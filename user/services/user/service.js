const constaints = require("./constants");
const jwtModule = require("jsonwebtoken");
const userModelModule = require("../../model/user");
const sessionModelModule = require("../../model/session");
const { getPayloadFromContext } = require("sharedLib/service/token");

module.exports = function(
  logger,
  jwtSecret,
  userModel,
  sessionModel,
  jwt = jwtModule,
  getPayload = getPayloadFromContext
) {
  userModel = userModel || userModelModule(logger);
  sessionModel = sessionModel || sessionModelModule(logger);

  async function login(ctx, username, password) {
    let user;
    try {
      user = await userModel.authenticate(username, password);
    } catch (err) {
      logger.warn(
        {
          method: "login",
          message: "invalid username or password",
          err: err.message
        },
        ctx
      );
      return [null, constaints.ERR_INVALID_LOGIN_OR_PASSWORD];
    }

    let session;
    try {
      session = await sessionModel.createSession(user.id);
    } catch (err) {
      logger.warn(
        {
          method: "login",
          message: "faild to create accesstoken",
          err: err.message
        },
        ctx
      );
      return [null, constaints.ERR_FAILED_TO_CREATE_SESSION];
    }

    const token = jwt.sign(
      {
        uid: user.id,
        user: user.username,
        sub: session.sub,
        ext: session.ext,
        jdi: session.id
      },
      jwtSecret
    );
    return [token, null];
  }

  async function logout(ctx) {
    const [payload] = getPayload(ctx);
    const { jdi } = payload;
    try {
      await sessionModel.removeSession(jdi);
    } catch (err) {
      logger.warn(
        {
          method: "logout",
          message: "faild to remove accesstoken",
          err: err.message
        },
        ctx
      );
      return [null, constaints.ERR_FAILED_TO_REMOVE_SESSION];
    }

    return ["logout", null];
  }

  async function info(ctx) {
    const [payload] = getPayload(ctx);
    const { uid } = payload;
    let user;
    try {
      user = await userModel.getUserById(uid);
    } catch (err) {
      logger.warn(
        {
          method: "info",
          message: `faild to get user info by id ${uid}`,
          err: err.message
        },
        ctx
      );
      return [null, constaints.ERR_FAILED_TO_GET_USER_INFO];
    }

    delete user.password;
    return [user, null];
  }

  return {
    logout,
    login,
    info
  };
};
