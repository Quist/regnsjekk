const logger = require("./logger").logger;
const AWS = require("aws-sdk");
AWS.config.update({region: "eu-central-1"});

const sns = new AWS.SNS();

exports.sendDeveloperAlert = function sendMail(subject, message, callback) {

    const params = {
        Message: message,
        Subject: subject,
        TopicArn: "arn:aws:sns:eu-central-1:344540162777:regnsjekk-alerts"
    };

    sns.publish(params, (err, data) => {
        if (err) {
            logger.error(err, err.stack);
            return callback(err);
        } else {
            logger.info("Developer alert published: ", data);
            return callback(null);
        }
    });
};
