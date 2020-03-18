const yargs = require("yargs");
const log4js = require("log4js");
const sessionModelModule = require("../model/session");

log4js.configure({
  appenders: { console: { type: "console" } },
  categories: {
    default: { appenders: ["console"], level: "DEBUG" }
  }
});
const logger = require("sharedLib/logger")("userService");
const sessionModel = sessionModelModule(logger);

yargs.command({
  command: "remove-old-token",
  handler: async () => {
    logger.info("Removing old tokens ...");
    const token = await sessionModel.getAll();
    for (let index = 0; index < token.length; index++) {
      if (token[index].ext < Date.now()) {
        try {
          await sessionModel.removeSession(token[index].id);
        } catch (err) {
          logger.warn({
            message: "cron remove-old-token",
            tokenId: token[index].id,
            err: err
          });
        }
      }
    }

    logger.info("Successfully removed all tokens.");
  }
});
