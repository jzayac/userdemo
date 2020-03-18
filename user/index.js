const express = require("express");
const helmet = require("helmet");
const bodyparser = require("body-parser");
const userServiceModule = require("./services/user/user");
// const docsConfig = require("./docs");
const log4js = require("log4js");
const port = process.env.APP_PORT || 4000;

log4js.configure({
  appenders: { console: { type: "console" } },
  categories: {
    default: { appenders: ["console"], level: "DEBUG" }
  }
});
const logger = require("sharedLib/logger")("userService");

const app = express();

app.use(helmet());
app.use(bodyparser.json());

// TODO: endpint for consul?
app.get("/status", async (req, res) => {
  res.json({
    status: "ok"
  });
});

const userService = userServiceModule(logger);

app.use(userService);

app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on port ${port}...`);
});
