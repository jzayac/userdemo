const { loggerMiddleware } = require("../../serviceLib/loggingMiddleware");

module.exports = function(logger, next) {
  async function login(ctx, ...args) {
    return await loggerMiddleware(ctx, logger, next.login, args);
  }

  async function logout(ctx, ...args) {
    return await loggerMiddleware(ctx, logger, next.logout, args);
  }

  return {
    logout,
    login
  };
};
