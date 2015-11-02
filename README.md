# PagerDuty Notifications    

This is a simple node.js project that taps on to PagerDuty webhooks for sending out email notifications. Notifications are received through AWS API Gateway backed by a AWS Lambda function, requests are processed and emails are dispatched through AWS Simple Email Service (SES). 

The biggest benefit of this method is that, there are no servers to maintain, issues on scale or need to think about high availability

## Requirements 

* Have node.js installed

* Have an Amazon Web Services (AWS) Account

* Create an IAM role that has access to AWS Lambda, SES, API Gateway (make sure you modify package.json to set the same role name)

* Provision AWS API Gateway with a new API

* Provision AWS SES and validate a few email address you will use with this application

## Building and Deploying

* Modify aws.json, add appropriate AWS Keys

* Modify config.json, add appropriate email addresses you previously configured with AWS SES

* `npm install` to install node modules

* `gulp` to build and deploy this to your AWS Lambda environment. Check `pagerDutyNotifications` function in your selected region

* Create a new POST method in your AWS API Gateway to connect to the `pagerDutyNotifications` AWS Lambda

* Deploy the API, get the URL and add it as 'Webhook' into a PagerDuty service!

Now all the events generated in the service will be emailed to the appropriate target

## References

https://developer.pagerduty.com/documentation/rest/webhooks


