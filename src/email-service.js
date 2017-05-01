const request = require('request');
const logger = require('./logger').logger;
const snsService = require('./sns-service');

exports.sendMail = function sendMail(subject, text, callback) {

    const formData = {
        from: "Mailgun Sandbox <postmaster@sandbox47e877f4a7434270807583ba7eacdd48.mailgun.org>",
        to: "Joakim Lindquister <joakim@lindquister.no>",
        subject: subject,
        text: text

    }

    const apiKey = process.env.mailgunApiKey;
    request.post({url:'https://api:' + apiKey + '@api.mailgun.net/v3/sandbox47e877f4a7434270807583ba7eacdd48.mailgun.org/messages', formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) {
            logger.error('Email upload failed:', err);
            snsService.sendDeveloperAlert('Email upload failed', err, callback);
        } else if (httpResponse.statusCode >= 300 || httpResponse.statusCode < 200) {
            logger.error("Error sending mail. Mailgun returned HTTP statusCode: " + httpResponse.statusCode);
            snsService.sendDeveloperAlert('Email upload failed', "Error sending mail. Mailgun returned HTTP statusCode: " + httpResponse.statusCode, callback);
        } else {
            logger.info('Email upload successful!  Server responded with:', body);
        }
      }
    );
}
