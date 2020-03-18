const transportModule = require("sharedLib/service/transport");
const trace = require("sharedLib/service/trace");
const token = require("sharedLib/service/token");
const constants = require("./constants");
const constantsService = require("sharedLib/service/constants");
const express = require("express");

module.exports = function(logger, service) {
  const router = express.Router();
  const optionsLogin = {
    before: [trace.getTraceIdFromRequestHeaderMiddleware],
    after: [trace.setTraceToResponseHeaderMiddleware]
  };

  const options = {
    before: [
      trace.getTraceIdFromRequestHeaderMiddleware,
      token.getTokenFromRequestHeaderMiddleware
    ],
    after: [trace.setTraceToResponseHeaderMiddleware]
  };

  function encodeError(err, res) {
    switch (err) {
      case constantsService.ERR_INVALID_TOKEN:
      case constantsService.ERR_MISSING_TOKEN:
        res.status(403);
        res.json({
          res: null,
          err: "Authorization Error"
        });
        break;
      case constants.ERR_INVALID_LOGIN_OR_PASSWORD:
      case constants.ERR_MISSING_NAME:
      case constants.ERR_MISSING_PASSWORD:
        res.status(404);
        res.json({
          res: null,
          err: err
        });
        break;
      default:
        res.status(500);
        res.json({
          res: null,
          err: err
        });
    }
  }

  const transportInitialData = transportModule(
    logger,
    encodeError,
    optionsLogin
  );
  const initialDataDecoder = req => [req.body.username, req.body.password];
  const login = transportInitialData.newEndpoint(
    service.login,
    initialDataDecoder
  );
  router.post("/v1/user/login", login);

  const transportData = transportModule(logger, encodeError, options);
  const logoutDataDecoder = () => [];
  const logout = transportData.newEndpoint(
    service.logout,
    logoutDataDecoder
  );
  router.post("/v1/user/logout", logout);

  // const transportInfoData = transportModule(logger, encodeError, options);
  const infoDataDecoder = () => [];
  const info = transportData.newEndpoint(service.info, infoDataDecoder);
  router.get("/v1/me", info);

  return router;
};
