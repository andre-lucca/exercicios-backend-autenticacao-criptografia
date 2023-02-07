const db = require('../services/dbConnection')

const createPokemon = async (req, res) => {
  const { authenticatedUser } = req
  const pokemon = req.body

  if (!pokemon.nome || !pokemon.habilidades) {
    return res.status(400)
      .json({ message: 'O nome e as habilidades do pokemon são obrigatórios.' })
  }

  try {
    const insertPokemon = `
      INSERT INTO pokemons
      (usuario_id, pokemon_nome, pokemon_habilidades, pokemon_imagem, pokemon_apelido)
      values
      ($1, $2, $3, $4, $5)
      returning *;
    `

    const queryResult = await db.query(insertPokemon, [
      authenticatedUser.usuario_id,
      pokemon.nome,
      pokemon.habilidades,
      pokemon.imagem || null,
      pokemon.apelido || null
    ])
    const [createdPokemon] = queryResult.rows

    return res.status(201).json(createdPokemon)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const changePokeNickName = async (req, res) => {
  const { authenticatedUser } = req
  const { pokeId } = req.params
  const { apelido: pokeNickName } = req.body

  if (!pokeNickName) {
    return res.status(400)
      .json({ message: 'Informe o apelido.' })
  }

  try {
    const queryPokemon = `
      SELECT * FROM pokemons
      WHERE pokemon_id = $1`

    const queryPokemonResult = await db.query(queryPokemon, [pokeId])
    const [pokemon] = queryPokemonResult.rows


    if (!pokemon) {
      return res.status(404)
        .json({ message: 'Pokemon não encontrado.' })
    }

    if (pokemon.usuario_id !== authenticatedUser.usuario_id) {
      return res.status(403)
        .json({ message: 'Este pokemon pertence à outro usuário!' })
    }

    const patchPokemon = `
      UPDATE pokemons
      SET pokemon_apelido = $1
      WHERE pokemon_id = $2
      RETURNING *;
    `

    const patchPokemonResult = await db.query(patchPokemon, [pokeNickName, pokeId])
    const [patchedPokemon] = patchPokemonResult.rows

    return res.json(patchedPokemon)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const getAllPokemons = async (req, res) => {
  try {
    const queryPokemons = `
      SELECT
        p.pokemon_id,
        u.usuario_nome,
        p.pokemon_nome,
        p.pokemon_apelido,
        p.pokemon_habilidades,
        p.pokemon_imagem
      FROM pokemons p
      JOIN usuarios u
      ON u.usuario_id = p.usuario_id
      ORDER BY p.pokemon_id ASC;`

    const queryPokemonsResult = await db.query(queryPokemons)
    const { rows: pokemons } = queryPokemonsResult
    const formattedPokemons = pokemons.map(pokemon => ({
      id: pokemon.pokemon_id,
      usuario: pokemon.usuario_nome,
      nome: pokemon.pokemon_nome,
      apelido: pokemon.pokemon_apelido,
      habilidades: pokemon.pokemon_habilidades.split(', '),
      imagem: pokemon.pokemon_imagem
    }))

    return res.json(formattedPokemons)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const getPokemonById = async (req, res) => {
  const { pokeId } = req.params

  if (isNaN(Number(pokeId))) {
    return res.status(400)
      .json({ message: 'O id precisa ser um número.' })
  }

  try {
    const queryPokemonById = `
      SELECT
        p.pokemon_id,
        u.usuario_nome,
        p.pokemon_nome,
        p.pokemon_apelido,
        p.pokemon_habilidades,
        p.pokemon_imagem
      FROM pokemons p
      JOIN usuarios u
      ON u.usuario_id = p.usuario_id
      WHERE p.pokemon_id = $1
      ORDER BY p.pokemon_id ASC;`

    const queryResult = await db.query(queryPokemonById, [pokeId])
    const [pokemon] = queryResult.rows
    const formattedPokemon = {}

    if (!pokemon) {
      return res.status(404)
        .json({ message: 'Pokemon não encontrado.' })
    }

    for (const key in pokemon) {
      const prop = key.substring(key.indexOf('_') + 1)
      if (key === 'usuario_nome') formattedPokemon.usuario = pokemon[key]
      formattedPokemon[prop] = pokemon[key]
    }

    return res.json(formattedPokemon)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const removePokemonById = async (req, res) => {
  const { authenticatedUser } = req
  const { pokeId } = req.params

  if (isNaN(Number(pokeId))) {
    return res.status(400)
      .json({ message: 'O id precisa ser um número.' })
  }

  try {
    const queryPokemonResult = await db.query('SELECT * FROM pokemons WHERE pokemon_id = $1', [pokeId])
    const [pokemon] = queryPokemonResult.rows

    if (!pokemon) {
      return res.status(404)
        .json({ message: 'Pokemon não encontrado.' })
    }

    if (authenticatedUser.usuario_id !== pokemon.usuario_id) {
      return res.status(403)
        .json({ message: 'Este pokemon pertence à outro usuário.' })
    }

    const queryRemovePokemon = `
      DELETE FROM pokemons
      WHERE pokemon_id = $1
      RETURNING *`

    const queryRemovePokemonResult = await db.query(queryRemovePokemon, [pokeId])
    const [removedPokemon] = queryRemovePokemonResult.rows

    return res.json(removedPokemon)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

module.exports = {
  createPokemon,
  changePokeNickName,
  getAllPokemons,
  getPokemonById,
  removePokemonById
}