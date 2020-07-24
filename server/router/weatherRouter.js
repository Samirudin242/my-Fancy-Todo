const router = require('express').Router()
const weatherController = require('../controller/weatherController')


router.get('/:city', weatherController.getWeather)

module.exports = router