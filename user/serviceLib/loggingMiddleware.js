const { getTraceIdFromContext } = require("./trace");

const ERR_LOGGER_EXCEPTION = "logger middleware: catch unhandled exception";

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
    err = ERR_LOGGER_EXCEPTION;
  }

  if (process.env.NODE_ENV === "development") {
    message.output = output;
  }

  message.error = err;
  message.took = Date.now() - start + "ms";

  logger.info(JSON.stringify(message));

  return [output, err];
}

module.exports = {
  loggerMiddleware,
  ERR_LOGGER_EXCEPTION,
};
