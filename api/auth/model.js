const db = require("../../data/dbConfig")

const createUser = async (username,password) => {
  const [id] = await db('users').insert({username,password})
  return findById(id);
};

const findById = async (id) => {
  const user = await db('users').where({ id: id }).first(); 
  return user
};