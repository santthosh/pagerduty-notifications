/**
 * Appirio Inc
 *
 * Created by santthosh on 10/30/15.
 */

var AWS = require('aws-sdk');
var Q = require('q');
var jade = require('jade');
var moment = require('moment');
var Set = require('collections/set');
var config = require("./config.json");

exports.handler = function(event, context) {
    var html,title,literal,incidents = new Set([]),services = new Set([]);
    console.log(JSON.stringify(config));

    if(event.messages) {
        event.messages.map(function(message){
            incidents.add(message.data.incident.incident_number);
            services.add(message.data.incident.service.name);
        });

        literal = incidents.length > 1 ? "incidents" : "incident";

        var options = {
            "messages" : event.messages,
            "meta": {
                "literal" : literal,
                "incidents" : incidents.toArray().join(','),
                "services": services.toArray().join(',')
            }
        };

        var contentFn = jade.compileFile("templates/body.jade",{});
        html = contentFn(options);

        var titleFn = jade.compileFile("templates/subject.jade",{});
        title = titleFn(options);
    }
    var ses = new AWS.SES();

    var params = {
        Destination: {
            ToAddresses: config.email.to
        },
        Message: {
            Body: {
                Html: {
                    Data: html,
                    Charset: 'UTF-8'
                }
            },
            Subject: {
                Data: title,
                Charset: 'UTF-8'
            }
        },
        Source: config.email.from,
        ReplyToAddresses: config.email.reply-to
    };
    ses.sendEmail(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            context.fail(err);
        }
        else {
            console.log(data);           // successful response
            context.succeed("Sent email");
        }
    });
};