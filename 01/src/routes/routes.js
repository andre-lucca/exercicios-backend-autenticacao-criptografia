const { Router } = require('express')
const userRoute = require('./userRoute')
const pokeRoute = require('./pokeRoute')

const routes = Router()

routes.use(userRoute)
routes.use(pokeRoute)

module.exports = routes