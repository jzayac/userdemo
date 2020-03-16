const serviceModule = require("./service");
const loggingModule = require("./logging");
const validatingModule = require("./validating");
const transportModule = require("./transportHttp");
// const userModelModule = require("../../model/user/userModel")

const logger = console;

// const userModel = userModelModule(logger);

// initialize service layers
let service = serviceModule(
  logger,
  process.env.JWT_SECRET,
);
service = validatingModule(logger, service);
service = loggingModule(logger, service);
service = transportModule(logger, service);

module.exports = service;
