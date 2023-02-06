const express = require('express')
const userRoute = require('./src/routes/userRoute')

const app = express()

app.use(express.json())
app.use(userRoute)

app.listen(3000, () => console.log('Server running on: http://localhost:3000'))