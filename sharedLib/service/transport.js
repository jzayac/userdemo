module.exports = function(logger, encodeError, options) {
  const ERR_TRANSPORT_EXCEPTION = "transport: unhladned exception";

  function unhandledException(err) {
    logger.error(err);
  }

  function responseHandler(output, err, res) {
    if (!err) {
      return res.status(200).json({
        res: output,
        err: "",
      });
    }
    encodeError(err, res);
    return res;
  }

  function newEndpoint(endpoint, decoder) {
    options.before = options.before || [];
    options.after = options.after || [];

    return async function(req, res) {
      let ctx = {};

      let [output, err] = [null, null];
      try {
        options.before.map(beforeFunc => {
          ctx = beforeFunc(ctx, req);
        });

        const args = decoder(req);
        [output, err] = await endpoint(ctx, ...args);

        options.after.map(afterFunc => {
          ctx = afterFunc(ctx, res);
        });
      } catch (e) {
        unhandledException(e);
        [output, err] = [null, e];
      }

      responseHandler(output, err, res);
    };
  }

  return {
    ERR_TRANSPORT_EXCEPTION,
    newEndpoint,
  };
};
