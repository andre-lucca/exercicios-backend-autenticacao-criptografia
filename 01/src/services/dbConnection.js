const { Pool } = require('pg')

const db = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '3030',
  database: 'catalogo_pokemons'
})

module.exports = db