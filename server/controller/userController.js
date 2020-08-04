const {User, Todo} = require('../models')
const {compare} = require('../helper/bcrypt')
const jwt = require('jsonwebtoken') 
const {OAuth2Client} = require('google-auth-library');


class UserController {

    static googleSign(req, res, next) {
        let {id_token} = req.body
        console.log(id_token)
        let email = null
        const client = new OAuth2Client(process.env.CLIENT_ID)
        client.verifyIdToken({
            idToken: id_token,
            audience: process.env.CLIENT_ID
        })
        .then(ticket => {
            email = ticket.getPayload().email
            return User.findOne({
                where: {email}
            })
        })
        .then(data => {
            if (data) {
                return {
                    id: data.id,
                    email: data.email
                }
            } else {
                return User.create({
                    email, password: 'qwerty'
                })
            }
        })
        .then(data => {
            let access_token = jwt.sign({
                id: data.id,
                email: data.email
            }, process.env.SECRET)
            return res.status(201).json({access_token})
        })
        .catch(err => {
            console.log(err)
            next(err)    
        })
    }



    static list(req, res) {
        User.findAll({
            include:[Todo]
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({message:`Internal server error`})
        })
    }

    static find(req, res, next) {
        User.findOne({
            include:[Todo],
            where: {email:req.params.email}
        })
        .then(data => {
            res.status(200).json({data})
        })
        .catch(err => {
            next(err)
        })
    }

    static register(req, res, next) {
        let obj = {
            email:req.body.email,
            password: req.body.password
        }
        User.create(obj)
        .then(data => {
            res.status(201).json({status:201, data})
        })
        .catch(err => {
            next(err)
            // const error = [];
            // err.errors.forEach((el) => {
            // error.push(el.message);
            // });
            // error.length >= 1 ? res.status(400).json({ status: 400, error }) : res.status(500).json({ status: 500, err });
        })
    }


    static login(req, res) {
        let user = {
            email : req.body.email,
            password: req.body.password
        }
        console.log("masuk")
        User.findOne({where:{email: req.body.email}})
        .then(data => {
        console.log(data)
            if(data && compare(user.password, data.password)) {
                const token = jwt.sign({id: data.id, email: user.email}, "secret")
                res.status(201).json({token})
            } else {
                res.status(400).json({status:400, message:`Invalid password or email`})
            }
        })
        .catch(err => {
        console.log("masukkkkkk")
            res.status(500).json({status:500, message:`Server Error`})
        })
    }
    
}


module.exports = UserController