const { Pool, Client } = require("pg");
const bcrypt = require("bcrypt");

function user() {}

function model(logger) {
  function _generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  function _validatePassword(password, hash) {
    const isCompare = bcrypt.compareSync(password, hash);
    return isCompare;
  }

  async function authenticate(username, password) {
    const client = new Client();
    await client.connect();
    const query = {
      name: "fetch-customer",
      text: "SELECT * FROM users WHERE username = $1",
      values: [username]
    };
    const res = await client.query(query);
    if (!_validatePassword(password, res.rows[0].password)) {
      // TODO: return error
      throw "kokotina";
    }
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
    return res;
  }

  async function createUser(username, password) {
    const client = new Client();
    await client.connect();
    const hash = _generateHash(password);
    const query = {
      name: "fetch-user",
      text: "INSERT INTO users(username, password) VALUES($1, $2)",
      values: [username, hash]
    };
    const res = await client.query(query);
    await client.end();
    return res;
  }

  async function test() {
    const client = new Client();
    await client.connect();

    const query = {
      name: "fetch-user",
      // text: "SELECT NOW()",
      text: `SELECT * FROM users WHERE username='rit'`
      // values: [username]
    };
    const res = await client.query(query);
    await client.end();
    console.log(res);
    // client.close()
  }

  authenticate("jozo", "tits");

  // clients will also use environment variables
  // for connection information
  //
  return {
    getUserByUserName,
    authenticate,
    createUser
    // user,
  };
}
module.exports = model;
