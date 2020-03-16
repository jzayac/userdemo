const express = require("express");
const helmet = require("helmet");
const bodyparser = require("body-parser");
const routes = require("./router");
const docsConfig = require("./docs");
// require("./initDb")
const port = process.env.APP_PORT || 4002;

const app = express();

app.use(helmet());
app.use(bodyparser.json());

app.get("/", async (req, res) => {
  res.send("Hello world");
});

app.use(routes);

app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on port ${port}...`);
});
