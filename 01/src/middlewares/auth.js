const db = require('../services/dbConnection')
const jwt = require('jsonwebtoken')

const authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers

  try {
    const [, userToken] = authorization.split(' ')
    const { userId } = jwt.verify(userToken, "SenhaSegura")

    const queryUser = `
      SELECT * FROM usuarios
      WHERE usuario_id = $1
    `

    const queryResult = await db.query(queryUser, [userId])
    const [{ usuario_senha: _, ...authenticatedUser }] = queryResult.rows

    req.authenticatedUser = authenticatedUser

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Não autorizado.' })
  }
}

module.exports = authenticateUser