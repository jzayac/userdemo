const constaints = require("./constants");
const jwtModule = require("jsonwebtoken");
const userModelModule = require("../../model/user/userModel");

module.exports = function(logger, jwtSecret, userModel, jwt = jwtModule) {
  userModel = userModel || userModelModule(logger);
  async function login(ctx, username, password) {
    let user;

    // try {
    //   user = await userModel.getUserByUserName(username);
    //   console.log(">>>>>>>>>>>>");
    //   console.log(user);
    // } catch (err) {
    //   return [null, null];
    // }
    // return [user, null]

    try {
      user = await userModel.authenticate(username, password);
    } catch (err) {
      logger.warn(
        {
          method: "login",
          err: err
        },
        ctx
      );
      return [null, constaints.ERR_INVALID_LOGIN_OR_PASSWORD];
    }

    const token = jwt.sign(
      { user: user.username, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      jwtSecret
    );
    // TODO -> store to db
    return [token, null];
  }

  async function logout(ctx) {
    const { id } = jwt.verify(token, jwtSecret);
    ctx.params.id = id;

    return ["logout", null];
  }

  return {
    logout,
    login
  };
};
