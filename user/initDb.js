const { Pool, Client } = require("pg");
const userModelModule = require("./model/user/userModel");

async function initailizeDb() {
  const userModel = userModelModule(console);
  const client = new Client();
  await client.connect();

  await client.query(
    "CREATE TABLE IF NOT EXISTS users (ID SERIAL PRIMARY KEY, username VARCHAR(40) UNIQUE, password VARCHAR(255) NOT NULL)"
  );

  // await client.query(
  //   "CREATE TABLE IF NOT EXISTS token (ID SERIAL PRIMARY KEY, userId INT, salt VARCHAR(255) NOT NULL)"
  // );
// sub

  console.log(">>>>>>>>>>>>>>><<<<<<<<<<<");
  await userModel.createUser("jozo", "tits");
  await userModel.createUser("more", "tits");
}

initailizeDb();
