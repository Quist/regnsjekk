//@flow
const http = require("http");
const parseString = require("xml2js").parseString;
const moment = require("moment");
import type {YrVærmelding} from "./api";
import type {Timemelding} from "./api";

const hentVærdataFraYr = function(callback: (YrVærmelding) => void) {

    return http.get({
        host: "www.yr.no",
        path: "/sted/Norge/Oslo/Oslo/Sandaker/varsel_time_for_time.xml"
    }, (response) => {
        let body = "";
        response.on("data", (d) => {
            body += d;
        });
        response.on("end", () => {
            parseString(body, (err, result) => {
                callback(result.weatherdata);
            });
        });
    });

};

exports.hentDagensVærData = function hentDagensVærData(callback: (Array<Timemelding>) => void) {
    hentVærdataFraYr((vaerData: YrVærmelding) => {
        const forecast = vaerData.forecast[0].tabular[0].time;
        callback(forecast.filter(timesVarsel => {
            return moment().isSame(moment(timesVarsel.$.from), "day");
        }));
    });
};
