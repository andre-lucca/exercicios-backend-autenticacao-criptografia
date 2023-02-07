const { Router } = require('express')
const authenticateUser = require('../middlewares/auth')
const {
  createPokemon,
  changePokeNickName,
  getAllPokemons,
  getPokemonById,
  removePokemonById
} = require('../controllers/pokeController')

const pokeRoute = Router()

pokeRoute.use(authenticateUser)
pokeRoute.post('/register-pokemon', createPokemon)
pokeRoute.get('/pokemon', getAllPokemons)
pokeRoute.get('/pokemon/:pokeId', getPokemonById)
pokeRoute.patch('/pokemon/:pokeId', changePokeNickName)
pokeRoute.delete('/pokemon/:pokeId', removePokemonById)

module.exports = pokeRoute