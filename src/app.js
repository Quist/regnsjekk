const moment = require('moment');
const schedule = require('node-schedule');
const logger = require('./logger').logger;

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
        logger.info("No rain today :-)");
    }
  });
}

schedule.scheduleJob('25 07 * * *', regnsjekk);
logger.info("Calculating clouds...");
logger.info("Generating good weather..");

logger.info("Sending test email..");
emailService.sendMail("Regnsjekk har startet opp", "Tenkte du ville vite det!");

logger.info("Script started.");
