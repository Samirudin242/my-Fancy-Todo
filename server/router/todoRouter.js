const router = require('express').Router()
const TodoController = require('../controller/todoController')
const Auth = require('../middleware/Auth')



router.use(Auth.authentication)
router.get('/', TodoController.getTodo)
router.post('/add', TodoController.add)
router.get('/:id', TodoController.find)
router.put('/:id', TodoController.update)
// router.use(Auth.authorization)
router.delete('/delete/:id',  TodoController.delete)

module.exports = router