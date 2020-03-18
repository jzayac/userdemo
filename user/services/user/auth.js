const constants = require("./constants");
const constantsService = require("sharedLib/service/constants");
const { getPayloadFromContext } = require("sharedLib/service/token");
const sessionModelModule = require("../../model/session");

module.exports = function(
  logger,
  next,
  jwtSecret,
  getPayload = getPayloadFromContext,
  sessionModel = sessionModelModule(logger)
) {
  // TODO: session/tokenAccess should be a standalone service
  async function _isTokenValid(ctx) {
    const [payload, err] = getPayload(ctx);
    console.log()
    if (err) {
      return err;
    }
    let isValid = false;
    try {
      isValid = await sessionModel.isSessionValidById(payload);
    } catch (err) {
      logger.warn(
        {
          message: "session verification faild",
          err: err
        },
        ctx
      );
      return constantsService.ERR_INVALID_TOKEN;
    }

    return !isValid ? constants.ERR_ACCESS_DENIED : null;
  }

  async function login(ctx, ...args) {
    return await next.login(ctx, ...args);
  }

  async function logout(ctx, ...args) {
    const err = await _isTokenValid(ctx);
    if (err) {
      return [null, err];
    }

    return await next.logout(ctx, ...args);
  }

  async function info(ctx, ...args) {
    const err = await _isTokenValid(ctx);
    if (err) {
      return [null, err];
    }

    return await next.info(ctx, ...args);
  }

  return {
    logout,
    login,
    info
  };
};
