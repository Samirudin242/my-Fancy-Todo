const {Todo} = require('../models')

class TodoController {
    static add(req, res, next) {
        let obj = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            due_date: req.body.due_date,
            UserId: req.userData.id
        }

        Todo.create(obj)
        .then(data => {
            res.status(201).json({status:200, message:`Succesfully add data`})
        })
        .catch(err => {
            console.log(err)
            next(err)
            // const error = [];
            // err.errors.forEach((el) => {
            // error.push(el.message);
            // });
            // error.length >= 1 ? res.status(400).json({ status: 400, error }) : res.status(500).json({ status: 500, err });
        })
    }

    static getTodo(req, res) {
        Todo.findAll({
            where: {UserId : req.userData.id}
        })
        .then(data => {
            console.log(data)
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({
                status : 500,
                error : err
            })
        })
    }
    

    static find(req, res) {
        Todo.findByPk(req.params.id)
            .then(todo => {
                if(todo) {
                    res.status(200).json(todo)
                } else {
                    res.status(404).json({
                        status: 404,
                        error: `Not found`
                    })
                }
            })
            .catch(err => {
                res.status(500).json(err)
            })
        }

    static update(req, res) {
        let obj = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            due_date: req.body.due_date
        }
        Todo.update(obj, {where:{id:req.params.id}})
        .then(data => {
            if(data) {
                res.status(201).json({status:200})
            } else {
                res.status(404).json({
                    status: 404,
                    error: `Not found`
                })
            }
        })
        .catch(err => {
            const error = [];
            err.errors.forEach((el) => {
                error.push(el.message);
            });
            error.length >= 1 ? res.status(400).json({ status: 400, error }) : res.status(500).json({ status: 500, err });
        })
    }

    static delete(req, res) {
        Todo.findByPk(req.params.id)
        .then(data => {
                if(data) {
                    Todo.destroy({where:{id:req.params.id}})
                    .then(data => {
                        res.status(200).json({status:200, message:`Succesfully delete data`})
                    })
                } else {
                    res.status(404).json({status: 404, error:`Not Found`})
                    console.log('<<<<<<<< test')
                }
        })
        .catch(err => {
            res.status(500).json({status:500, error:err})
        })
    }

}


module.exports = TodoController