const db = require('../../data/dbConfig');

const createUser = async (username, password) => {
  const [id] = await db('users').insert({ username, password });
  return findById(id);
};

const findById = async (id) => {
  return await db('users').where({ id }).first();
};

const findByUsername = async (username) => {
  return await db('users').where({ username }).first();
};

module.exports = {
  createUser,
  findById,
  findByUsername,
};
