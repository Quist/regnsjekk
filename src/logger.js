const moment = require("moment");
const winston = require("winston");

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp() {
                return moment().format();
            },
            formatter(options) {
                return `${options.timestamp() } ${ options.level.toUpperCase() } ${ options.message ? options.message : ""
          }${options.meta && Object.keys(options.meta).length ? `\n\t${ JSON.stringify(options.meta)}` : ""}`;
            }
        })
    ]
});

exports.logger = logger;
