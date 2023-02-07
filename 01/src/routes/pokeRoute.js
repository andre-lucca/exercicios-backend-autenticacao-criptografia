const { Router } = require('express')
const authenticateUser = require('../middlewares/auth')
const {
  createPokemon
} = require('../controllers/pokeController')

const pokeRoute = Router()

pokeRoute.use(authenticateUser)
pokeRoute.post('/register-pokemon', createPokemon)

module.exports = pokeRoute