
const request = require('request');

exports.sendMail = function sendMail(subject, text, callback) {

    const formData = {
        from: "Mailgun Sandbox <postmaster@sandbox47e877f4a7434270807583ba7eacdd48.mailgun.org>",
        to: "Joakim Lindquister <joakim@lindquister.no>",
        subject: subject,
        text: text
      }
    const apiKey = process.env.mailgunApiKey;

    request.post({url:'https://api' + apiKey + '@api.mailgun.net/v3/sandbox47e877f4a7434270807583ba7eacdd48.mailgun.org/messages', formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
      }
    );
}
