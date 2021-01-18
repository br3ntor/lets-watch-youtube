const { v4: uuidv4 } = require("uuid");
const { Pool } = require("pg");

const pool = new Pool();

function getAllUsers() {
  return pool.query("SELECT * FROM users");
}

function createNewUser(name, password) {
  const text = "INSERT INTO users(id, name, password) VALUES ($1, $2, $3)";
  const values = [uuidv4(), name, password];
  return pool.query(text, values);
}

function lookupUser(name) {
  const text = "SELECT * FROM users WHERE name = $1";
  const values = [name];
  return pool.query(text, values);
}

module.exports = {
  getAllUsers,
  createNewUser,
  lookupUser,
};
