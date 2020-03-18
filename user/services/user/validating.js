const constants = require("./constants");

module.exports = function(
  logger,
  next,
) {

  async function login(ctx, username, password) {
    if (!username) {
      return [null, constants.ERR_MISSING_NAME];
    }
    if (!password) {
      return [null, constants.ERR_MISSING_PASSWORD];
    }
    return next.login(ctx, username, password);
  }

  async function logout(ctx) {
    return next.logout(ctx);
  }

  async function info(ctx) {
    return next.info(ctx);
  }

  return {
    logout,
    login,
    info
  };
};
