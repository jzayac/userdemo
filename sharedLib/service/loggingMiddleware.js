const constants = require("./constants")
const { getTraceIdFromContext } = require("./trace");

async function loggerMiddleware(ctx, logger, next, args) {
  const start = Date.now();
  let output;
  let err;
  const message = {
    request_id: getTraceIdFromContext(ctx),
    method: next.name,
    variables: args,
  };

  try {
    [output, err] = await next(ctx, ...args);
  } catch (e) {
    message.exception_name = e.name;
    message.exception_message = e.message;
    err = constants.ERR_LOGGER_EXCEPTION;
  }

  if (process.env.NODE_ENV === "development") {
    message.output = output;
  }

  message.error = err;
  message.took = Date.now() - start + "ms";

  logger.info(JSON.stringify(message), ctx);

  return [output, err];
}

module.exports = {
  loggerMiddleware,
};
