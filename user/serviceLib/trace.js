const { v4: uuidv4 } = require('uuid');

const TRACE_ID = "X-Request-Id";

function _makeid() {
  return uuidv4();
}

function getTraceIdFromRequestHeaderMiddleware(ctx, req) {
  let trace = req.header(TRACE_ID);

  if (!trace) {
    trace = _makeid();
  }

  return {
    ...ctx,
    [TRACE_ID]: trace,
  };
}

function setTraceToResponseHeaderMiddleware(ctx, res) {
  let trace = getTraceIdFromContext(ctx);

  if (!trace) {
    trace = _makeid();
  }

  res.set(TRACE_ID, trace);
  return ctx;
}

function getTraceIdFromContext(ctx) {
  const t = ctx && ctx[TRACE_ID];
  return t || "unknown";
}

module.exports = {
  getTraceIdFromRequestHeaderMiddleware,
  setTraceToResponseHeaderMiddleware,
  getTraceIdFromContext,
};
