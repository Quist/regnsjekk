const logger = require('./logger').logger;
const AWS = require('aws-sdk');
AWS.config.update({region:'eu-central-1'});

var sns = new AWS.SNS();

exports.sendDeveloperAlert = function sendMail(subject, message, callback) {

    var params = {
        Message: message,
        Subject: subject,
        TopicArn: 'arn:aws:sns:eu-central-1:344540162777:regnsjekk-alerts'
    };

    sns.publish(params, function(err, data) {
      if (err) {
          logger.error(err, err.stack);
          callback(err);
      } else {
          logger.info("Developer alert published: ", data);
          callback(null);
      }
    });
}
