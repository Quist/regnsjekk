const moment = require('moment');
var schedule = require('node-schedule');

const innsamler = require('./innsamler');
const emailService = require('./email-service');

function regnsjekk() {
  innsamler.hentDagensVærData(dagensVærvarsler => {
    const regnThreshold = 0.1;
    const regnfulleTimer = dagensVærvarsler.filter(værvarsel => {
          return værvarsel.precipitation[0].$.value >= regnThreshold;
    });

    if (regnfulleTimer.length > 0) {
        let text = 'God morgen, Joakim!\nVi beklager å måtte informere deg om at det er meldt regn i dag:\n';
        dagensVærvarsler.forEach(varsel =>  {
            const time = moment(varsel.$.from).hour();
            text += time + " - " + (time + 1) + ": " +  varsel.precipitation[0].$.value + " mm\n";
        });
        emailService.sendMail("Regnvarsel for " + moment().format("D MMMM Y"), text);
    } else {
        console.log("No rain today :-)");
    }
  });
}

schedule.scheduleJob('15 07 * * *', regnsjekk);
console.log("Calculating clouds...");
console.log("Generating good weather..");
console.log("Script started.")
