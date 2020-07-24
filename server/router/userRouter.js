const router = require('express').Router()
const userController = require('../controller/userController')

router.get('/', userController.list)
router.get('/:email', userController.find)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/googleSign', userController.googleSign)


module.exports = router