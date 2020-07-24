const {Todo, User} = require('../models')
const jwt = require('jsonwebtoken')

class Authentication {
    static authentication(req, res, next) {
        const {acces_token} = req.headers
        // const acces_token = req.headers.acces_token
        // console.log(acces_token)
        if(!acces_token) {
            next({name: 'TOKEN_ERROR'})
            // res.status(400).json({message:`Token not found`})
        } else if(acces_token) {
            let decode = jwt.verify(acces_token, process.env.SECRET)
            req.userData = decode
            // console.log(decode);
            
            User.findByPk(decode.id)
            .then(data => {
                if(data) {
                    next()
                } else {
                    next({name: `INVALID_USER`})
                    // res.status(404).json({message:'Invalid User'})
                }
            })
            .catch(err => {
                console.log(err)
                // res.status(500).json({message:`Internal Server Error`})
                next({name:err})
            })
        } 
    }

    static authorization(req, res, next) {
    const id = req.params.id
    console.log(id, '<<<<<<<< id')
    Todo.findByPk(id)
    .then(data => {
        if(!data) {
            // res.status(404).json({message:`Data Not Found`})
            next({name:`ERROR_DATA`})
        } else if(data.UserId !== req.userData.id) {
            next({name:`ERROR_USER`})
            // res.status(401).json({message: `You not authorized`})
        } else {
            next()
        }
    })
    .catch(err => {
        console.log(err)
        // res.status(500).json({message:`Internal Server Error`})
        next({name:err})
    })
    }

}


module.exports = Authentication