const axios = require('axios')

class WeatherController{

    static getWeather(req, res, next) {
        const key = process.env.WEATHER_KEY
        const {city} = req.params
        // const city = req.body.city
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
        .then(function (response) {
            // handle success
            // console.log(response);
            res.status(200).json(response.data)
        })
        .catch(function (error) {
            // handle error
            next(error)
        })
    }

}


module.exports = WeatherController