const constants = require("./constants");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function getTokenFromRequestHeaderMiddleware(ctx, req) {
  let token = req.header(constants.AUTHORIZATION);
  let err = null;
  let payload = null;

  if (token && token.startsWith(constants.AUTH_PREFIX)) {
    token = token.slice(constants.AUTH_PREFIX.length);
    try {
      payload = jwt.verify(token, jwtSecret);
    } catch (error) {
      err = constants.ERR_INVALID_TOKEN;
    }
  } else {
    token = "";
    err = constants.ERR_MISSING_TOKEN;
  }

  return {
    ...ctx,
    [constants.CTX_TOKEN_NAME]: token,
    [constants.CTX_PAYLOAD_NAME]: payload,
    [constants.CTX_TOKEN_ERROR]: err
  };
}

function setTokenToResponseHeaderMiddleware(ctx, res) {
  let trace = getTokenFromContext(ctx);

  res.set(constants.AUTHORIZATION, token);
  return ctx;
}

function getPayloadFromContext(ctx) {
  const t = ctx[constants.CTX_PAYLOAD_NAME];
  return [ctx[constants.CTX_PAYLOAD_NAME] , ctx[constants.CTX_TOKEN_ERROR]];
}

function getTokenFromContext(ctx) {
  const t = ctx[constants.CTX_TOKEN_NAME];
  return t;
}

module.exports = {
  getTokenFromRequestHeaderMiddleware,
  getPayloadFromContext,
  setTokenToResponseHeaderMiddleware,
  getTokenFromContext
};
