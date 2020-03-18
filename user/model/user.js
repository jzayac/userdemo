const { Client } = require("pg");
const bcrypt = require("bcrypt");
const ModelError = require("../error/ModelError");

function model(logger) {
  function _generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  function _validatePassword(password, hash) {
    const isCompare = bcrypt.compareSync(password, hash);
    return isCompare;
  }

  async function authenticate(username, password) {
    const user = await getUserByUserName(username);
    if (!user) {
      throw new ModelError("user not found", 404);
    }
    if (!_validatePassword(password, user.password)) {
      throw new ModelError("invalid password", 404);
    }
    return user;
  }

  async function getUserById(id) {
    const client = new Client();
    await client.connect();
    const query = {
      name: "fetch-user-info",
      text: "SELECT * FROM users WHERE id = $1",
      values: [id]
    };

    const res = await client.query(query);
    await client.end();
    return res.rows[0];
  }

  async function getUserByUserName(username) {
    const client = new Client();
    await client.connect();
    const query = {
      name: "fetch-customer",
      text: "SELECT * FROM users WHERE username = $1",
      values: [username]
    };

    const res = await client.query(query);
    await client.end();
    return res.rows[0];
  }

  async function createUser(username, password, email, firstname, lastname) {
    const client = new Client();
    await client.connect();
    const hash = _generateHash(password);
    const created = new Date().toISOString();
    const query = {
      name: "create-user",
      text:
        "INSERT INTO users(username, password, created_at, " +
        "updated_at, email, firstname, lastname) " +
        "VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      values: [username, hash, created, created, email, firstname, lastname]
    };
    const res = await client.query(query);
    await client.end();
    return res.rows[0];
  }

  return {
    getUserByUserName,
    authenticate,
    createUser,
    getUserById
  };
}
module.exports = model;
