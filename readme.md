# Light Switch Rave Party

![](https://raw.github.com/atuttle/Light-Switch-Rave-Party/master/system-down.png)

### Get notified of degraded service via Twilio-powered Phone Call

As described in my [blog post][bolg], I have my phone set to silence _everything_ overnight, with the exception of _phone calls_. I figure if someone's calling me in the middle of the night, it's important and I need to answer the call.

For this reason, SMS alerts won't work for a situation in which I _really_ need to get out of bed and fix something. Enter **Light Switch Rave Party** ("LSRP"). It will check a URL via HTTP GET, and if the timeout is exceeded, or if a non-200-range response status is returned (400, 500, etc) then it calls you using Twilio to alert you to the problem.

You'll **create an auth.json file** (copy auth-example.json and modify it), with your Twilio credentials and the phone number you want to use as the caller.

Then update config.json:

* **gettable:** URL that you want to monitor (called via HTTP GET)
* **getFrequency:** Number of seconds between monitoring requests (begins after success of previous response)
* **getTimeout:** Number of seconds to wait before considering the request to be "timed out" and notifying you of degredation
* **notifyAction:** URL that returns the [TwiML][twiml] for the call
* **notify:** Array of numbers to call and notify (currently only supports exactly 1 number)

> **Note:** _The script intentionally kills itself_ if it has to notify you. Twilio costs cash-money, so we don't want to go wasting that, do we?! Also, not getting called every minute while you're trying to fix your app is probably going to make it easier to fix. Just manually restart the monitoring job once you've fixed your app.

Once that's all good to go, start it up:

    $ node main.js

You can run this in the background, but currently it logs messages to stdout, so pipe that into a log file if you want to keep it from cluttering up your terminal window.

    $ node main.js > LSRP.log &

Pull requests welcome. **MIT Licensed.**

[bolg]: http://fusiongrokker.com
[twiml]: https://www.twilio.com/labs/twimlets/message