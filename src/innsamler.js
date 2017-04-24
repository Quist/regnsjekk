
const http = require('http');
const parseString = require('xml2js').parseString;
const moment = require('moment');

function hentVærdataFraYr(callback) {

    return http.get({
        host: 'www.yr.no',
        path: '/sted/Norge/Oslo/Oslo/Sandaker/varsel_time_for_time.xml'
    }, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            parseString(body, function (err, result) {
                callback(result.weatherdata);
            });
        });
    });

}

exports.hentDagensVærData = function hentDagensVærData(callback) {
    hentVærdataFraYr(function (vaerData) {
        const forecast = vaerData.forecast[0].tabular[0].time;
        callback(forecast.filter(timesVarsel => {
            return moment().isSame(moment(timesVarsel.$.from), 'day');
        }));
    });
}
