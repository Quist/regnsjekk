// @flow
const moment = require("moment");
const schedule = require("node-schedule");

const logger = require("./logger").logger;
const yrService = require("./yr-service");
const emailService = require("./email-service");
import type {Timemelding} from "./api";

const regnsjekk = function () {
    yrService.hentDagensVærData((dagensVærvarsler: Array<Timemelding>) => {
        const regnThreshold = 0.1;
        const regnfulleTimer = dagensVærvarsler.filter((værvarsel: Timemelding) => {
            return værvarsel.precipitation[0].$.value >= regnThreshold;
        });

        if (regnfulleTimer.length > 0) {
            let text = "God morgen, Joakim!\nVi beklager å måtte informere deg " +
            "om at det er meldt regn i dag:\n";
            dagensVærvarsler.forEach(værvarsel => {
                const time = moment(værvarsel.$.from).hour();
                text += `${time } - ${ time + 1 }: ${ værvarsel.precipitation[0].$.value } mm\n`;
            });
            emailService.sendMail("joakim@lindquister.no", "Joakim Lindquister", `Regnvarsel for ${ moment().format("D MMMM Y")}`, text, () => {});
            emailService.sendMail("benibe88@gmail.com", "Bendik Ibenholt", `Regnvarsel for ${ moment().format("D MMMM Y")}`, text, () => {});
        } else {
            logger.info("No rain today :-)");
        }
    });
};

schedule.scheduleJob("25 05 * * *", regnsjekk);
logger.info("Calculating clouds...");
logger.info("Generating good weather..");

logger.info("Sending test email..");
emailService.sendMail("joakim@lindquister.no", "Joakim Lindquister", "Regnsjekk har startet opp", "Tenkte du ville vite det!", () => {});

logger.info("Script started.");
