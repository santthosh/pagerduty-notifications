/**
 * Appirio Inc
 *
 * Created by santthosh on 10/30/15.
 */

var AWS = require('aws-sdk');
var Q = require('q');
var jade = require('jade');
var moment = require('moment');

exports.handler = function(event, context) {
    var html,title;
    var titleTemplate = "[PagerDuty] incident #{message.incident_number} for #{message.service.name}";

    if(event.messages) {
        event.messages.map(function(message){
            var time = moment(message.data.incident.created_on).format("dddd, MMMM Do YYYY, h:mm:ss A");
            var options = {
                "message" : message.data.incident,
                "time" : time
            };
            var contentFn = jade.compileFile("templates/"+message.type+".jade",{});
            html = contentFn(options);

            var titleFn = jade.compile(titleTemplate,{});
            title = titleFn(options);
        });
    }
    var ses = new AWS.SES();

    var params = {
        Destination: {
            ToAddresses: [
                'sselvadurai@appirio.com'
            ]
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
        Source: 'technology+pagerduty@appirio.com',
        ReplyToAddresses: [
            'technology+pagerduty@appirio.com'
        ]
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