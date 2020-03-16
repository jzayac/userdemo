const transportModule = require("../../serviceLib/transport");
const trace = require("../../serviceLib/trace");
const constants = require("./constants");

module.exports = function(logger, service) {
  const options = {
    before: [trace.getTraceIdFromRequestHeaderMiddleware],
    after: [trace.setTraceToResponseHeaderMiddleware]
  };

  function encodeError(err, res) {
    switch (err) {
      // case constants.ERR_NOT_FOUND_CAR:
      // case constants.ERR_NOT_FOUND_DELIVERY_METHODS:
      // case constants.ERR_NOT_FOUND_CONFIGURATION:
      //   res.status(404);
      //   res.json({
      //     res: null,
      //     err: err,
      //   });
      //   break;
      default:
        res.status(500);
        res.json({
          res: null,
          err: err
        });
    }
  }

  const initialDataOptions = {
    before: [trace.getTraceIdFromRequestHeaderMiddleware],
    after: [trace.setTraceToResponseHeaderMiddleware]
  };

  // - /user/login
  // - /user/logout
  // - /me
  // - /status

  const transportInitialData = transportModule(logger, encodeError, options);
  const initialDataDecoder = req => [req.body.username, req.body.password];
  const login = transportInitialData.newEndpoint(
    // "POST",
    // "/user/login",
    service.login,
    initialDataDecoder
  );

  const transportCarData = transportModule(logger, encodeError, options);
  const carDataDecoder = () => [];
  const logout = transportCarData.newEndpoint(
    // "POST",
    // "/user/logout",
    service.logout,
    carDataDecoder
  );

  return {
    login,
    logout
  };
};
