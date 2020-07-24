const router = require('express').Router()
const TodoRouter = require('./todoRouter')
const UserRouter = require('./userRouter')
const WeatherRouter = require('./weatherRouter')

router.get('/', (req, res) => {
    res.send('Home')
})
router.use('/todos', TodoRouter)
router.use('/users', UserRouter)
router.use('/weather', WeatherRouter)



module.exports = router