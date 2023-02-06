create database catalogo_pokemons;

create table usuarios (
  usuario_id serial primary key,
  usuario_nome text not null,
  usuario_email text not null unique,
  usuario_senha text not null
);

create table pokemons (
  pokemon_id serial primary key,
  usuario_id integer references usuarios(usuario_id),
  pokemon_nome text not null,
  pokemon_habilidades text not null,
  pokemon_imagem text,
  pokemon_apelido text
);