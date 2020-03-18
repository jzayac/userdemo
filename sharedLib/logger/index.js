const log4jsmodule = require("log4js");

const logger = function(namespace, log4js) {
  const name = namespace || "undefined";
  const l = log4js || log4jsmodule.getLogger(name);

  function log(message) {
    l.debug(message);
  }

  function debug(message) {
    l.debug(message);
  }

  function trace(message) {
    l.trace(message);
  }

  function info(message) {
    l.info(message);
  }

  function warn(message) {
    l.warn(message);
  }

  function error(message) {
    l.error(message);
  }

  function fatal(message) {
    l.fatal(message);
  }

  return {
    log: log,
    debug: debug,
    trace: trace,
    info: info,
    warn: warn,
    error: error,
    fatal: fatal
  };
};

module.exports = logger;
