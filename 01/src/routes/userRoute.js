const { Router } = require('express')
const {
  createUser,
  connectUser
} = require('../controllers/userController')

const userRoute = Router()

userRoute.post('/usuario', createUser)
userRoute.post('/login', connectUser)

module.exports = userRoute