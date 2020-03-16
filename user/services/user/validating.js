module.exports = function(logger, next) {
  async function login(ctx, username, password) {
    return next.login(ctx, username, password);
  }

  async function logout(ctx) {
    return next.logout(ctx);
  }

  return {
    logout,
    login
  };
};
