const db = require('../services/dbConnection')
const bcrypt = require('bcrypt')

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

module.exports = {
  createUser
}