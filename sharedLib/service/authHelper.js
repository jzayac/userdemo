const constants = require("./constants");
const { getTokenFromContext } = require("sharedLib/service/token");
const jwtModule = require("jsonwebtoken");

function tokenAuth(
  ctx,
  logger,
  jwtSecret,
  jwt = jwtModule,
  decodeToken = getTokenFromContext
) {
  const token = decodeToken(ctx);
  if (!token) {
    return [null, constants.ERR_MISSING_TOKEN];
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    logger.warn(
      {
        message: "token verification faild",
        err: err.message
      },
      ctx
    );
    return [null, constants.ERR_INVALID_TOKEN];
  }
  return [payload, null]
}

module.exports = tokenAuth;
