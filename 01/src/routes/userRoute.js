const { Router } = require('express')
const {
  createUser
} = require('../controllers/userController')

const userRoute = Router()

userRoute.post('/usuario', createUser)

module.exports = userRoute