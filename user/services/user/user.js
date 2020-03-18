const serviceModule = require("./service");
const loggingModule = require("./logging");
const authModule = require("./auth");
const validatingModule = require("./validating");
const transportModule = require("./transportHttp");

const jwtSecret = process.env.JWT_SECRET;

module.exports = function(logger) {
  let service = serviceModule(logger, jwtSecret);

  service = validatingModule(logger, service);
  service = authModule(logger, service, jwtSecret);
  service = loggingModule(logger, service);
  service = transportModule(logger, service);

  return service;
};
