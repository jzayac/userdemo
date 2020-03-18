const { loggerMiddleware } = require("sharedLib/service/loggingMiddleware");

module.exports = function(logger, next) {
  async function login(ctx, ...args) {
    return await loggerMiddleware(ctx, logger, next.login, args);
  }

  async function logout(ctx, ...args) {
    return await loggerMiddleware(ctx, logger, next.logout, args);
  }

  async function info(ctx, ...args) {
    return await loggerMiddleware(ctx, logger, next.info, args);
  }

  return {
    logout,
    login,
    info
  };
};
