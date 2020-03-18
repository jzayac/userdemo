const { Client } = require("pg");
const { v4: uuidv4Module } = require("uuid");
const sesionExpirationInMinutes = process.env.JWT_EXPIRATION_IN_MINUTES || 1;

function model(logger, uuidv4 = uuidv4Module) {
  async function getSessionById(jdi) {
    const client = new Client();
    await client.connect();
    const query = {
      name: "fetch-accesstoken",
      text: "SELECT * FROM accesstoken WHERE id = $1",
      values: [jdi]
    };
    const res = await client.query(query);
    return res.rows[0];
  }

  async function isSessionValidById({ jdi, uid, sub }) {
    const session = await getSessionById(jdi);
    if (!session) {
      return false;
    }
    if (uid === session.uid && sub === session.sub) {
      return session.ext > Date.now();
    }
    return false;
  }

  async function createSession(userId) {
    const sub = uuidv4();
    const ext = Math.floor(Date.now()) + sesionExpirationInMinutes * 1000;
    const client = new Client();
    await client.connect();
    const query = {
      name: "create-accesstoken",
      text:
        "INSERT INTO accesstoken(uid, sub, ext) VALUES($1, $2, $3) RETURNING *",
      values: [userId, sub, ext]
    };
    const res = await client.query(query);
    await client.end();
    return res.rows[0];
  }

  async function removeSession(jdi) {
    const client = new Client();
    await client.connect();
    const query = {
      name: "delete-accesstoken",
      text: "DELETE FROM accesstoken where id = $1",
      values: [jdi]
    };
    const res = await client.query(query);
    // TODO: check
    await client.end();
    return res.rowCount === 1;
  }

  async function getAll() {
    const client = new Client();
    await client.connect();
    const query = {
      name: "get-all-accesstoken",
      text: "SELECT * FROM accesstoken"
    };
    const res = await client.query(query);
    await client.end();
    return res.rows;
  }

  return {
    getAll,
    getSessionById,
    createSession,
    removeSession,
    isSessionValidById
  };
}

module.exports = model;
