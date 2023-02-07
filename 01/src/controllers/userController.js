const db = require('../services/dbConnection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createUser = async (req, res) => {
  const { nome: userName, email: userEmail, senha: userPassword } = req.body

  if (!userName || !userEmail || !userPassword) {
    return res.status(400)
      .json({ message: 'Nome, email e senha são obrigatórios!' })
  }

  try {
    const encryptedUserPassword = await bcrypt.hash(userPassword, 10)

    const createNewUser = `
      INSERT INTO usuarios
      (usuario_nome, usuario_email, usuario_senha)
      values
      ($1, $2, $3)
      RETURNING *;
    `

    const result = await db.query(createNewUser, [userName, userEmail, encryptedUserPassword])
    const [createdUser] = result.rows

    return res.status(201).json(createdUser)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const connectUser = async (req, res) => {
  const { email: userEmail, senha: userPassword } = req.body

  if (!userEmail || !userPassword) {
    return res.status(400)
      .json({ message: 'E-mail e senha são obrigatórios!' })
  }

  try {
    const queryUser = `
      SELECT * FROM usuarios
      WHERE usuario_email = $1
    `

    const result = await db.query(queryUser, [userEmail])
    const [user] = result.rows
    const isPasswordValid = await bcrypt.compare(userPassword, user.usuario_senha)

    if (!user || !isPasswordValid) {
      return res.status(401)
        .json({ message: 'E-mail ou senha inválido.' })
    }

    const { usuario_senha: _, ...connectedUser } = user
    const userToken = jwt.sign({ userId: connectedUser.usuario_id }, "SenhaSegura", { expiresIn: '8h' })

    return res.json({ ...connectedUser, userToken })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

module.exports = {
  createUser,
  connectUser
}