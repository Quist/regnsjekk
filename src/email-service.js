//@flow
const request = require("request");
const logger = require("./logger").logger;
const snsService = require("./sns-service");

const HTTP_STATUS_SUCCESS_END = 300;
const HTTP_STATUS_SUCCESS_START = 200;

exports.sendMail = function sendMail(subject: string, text: string, callback: () => void) {

    const formData = {
        from: "Mailgun Sandbox <postmaster@sandbox47e877f4a7434270807583ba7eacdd48.mailgun.org>",
        to: "Joakim Lindquister <joakim@lindquister.no>",
        subject,
        text

    };

    const apiKey: ?string = process.env.mailgunApiKey;
    if (apiKey === null || apiKey === undefined) {
        throw new Error("No enviroment key for mailgunApiKey");
    }
    request.post({url: `https://api:${ apiKey }@api.mailgun.net/v3/sandbox47e877f4a7434270807583ba7eacdd48.mailgun.org/messages`, formData}, (err, httpResponse, body) => {
        if (err) {
            logger.error("Email upload failed:", err);
            snsService.sendDeveloperAlert("Email upload failed", err, callback);
        } else if (httpResponse.statusCode >= HTTP_STATUS_SUCCESS_END ||
           httpResponse.statusCode < HTTP_STATUS_SUCCESS_START) {
            logger.error(`Error sending mail. Mailgun returned HTTP statusCode: ${ httpResponse.statusCode}`);
            snsService.sendDeveloperAlert("Email upload failed", `Error sending mail. Mailgun returned HTTP statusCode: ${ httpResponse.statusCode}`, callback);
        } else {
            logger.info("Email upload successful!  Server responded with:", body);
        }
    }
    );
};
