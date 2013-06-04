var config = require('./config.json');
var auth = require('./auth.json');
var http = require('http');
var twilio = require('twilio')(auth.twilio.sid, auth.twilio.authToken);

var seconds = 1000, minutes = seconds * 60, hours = minutes * 60;

var checkFrequency = config.getFrequency * seconds;
var checkTimeout = config.getTimeout * seconds;

function notify(callback){
	console.log('%s - API DEGRADED; NOTIFYING!', new Date().toString());
	twilio.makeCall(
		{
			to: config.notify[0]
			,from: config.caller
			,url: config.notifyAction
		}
		,function(err, responseData){
			if (err){
				console.log('ERROR Making Phone Call with Twilio:\nstatus: %s\nmsg: %s\nmore info: %s', err.status, err.message, err.more_info);
			}
			if (callback) callback();
		}
	);
}

function probe(callback){
	// console.log('requesting... %s', config.gettable);
	var request = http.get(config.gettable, function (res) {
		// console.log(res);
		if (res.statusCode < 400){
			return callback(false); //indicate did not timeout
		}else{
			return callback(true); //indicate failure
		}
	});
	request.setTimeout( checkTimeout, function() {
		return callback(true); //indicate did timeout
	});
}

function monitor(){
	probe(function(failed){
		if (failed){
			//don't re-run if failed = true (make me restart the service when I'm ready to be notified again)
			notify(function(){
				console.log('... quitting to prevent nagging - manually restart when ready to re-enable monitoring.');
				process.exit(0);
			});
		}else{
			console.log('%s - API appears healthy, taking no action', new Date().toString());
		}
		setup();
	})
}

function setup(){
	setTimeout(monitor, checkFrequency);
}

//run immediately at startup; it will
//queue up the next run once it completes
monitor();
