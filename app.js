var http = require("http");
var http = require('follow-redirects').http;
var tool = require('./format_api');
const promisify = require('util').promisify;
var config = require('./application_information.json');
var airJazz_api_end_point = require('./request_airJazz_flight');
var airBeam_api_end_point = require('./request_airBeam_flight');
var airMoon_api_end_point = require('./request_airMoon_flight');

const jazz_json = promisify(airJazz_api_end_point.flight_airJazz_request);
const moon_json = promisify(airMoon_api_end_point.flight_airMoon_request);
const beam_json = promisify(airBeam_api_end_point.flight_airBeam_request);

var requestQueue = 0;
var all_result = [{}];
var json_to_return = [{}];

http.createServer(function (req, res) {
	var url = req.url;
	if (url === '/api/flights')
	{

		var user_pass = req.headers.authorization.split(" ");
		var app_pass =  tool.encrypt(config.token_pass);

		user_pass[1] = user_pass[1].trim();
		user_pass[1] = tool.encrypt(user_pass[1]);

		if(app_pass == user_pass[1])
		{
			res.writeHead(200, { 'Content-Type': 'application/json' });
			console.log("API ACCES AUTHORIZE");
		}
		else
		{
			console.log("ACCESS_DENIED");
			res.writeHead(401, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({message:"ACCESS_DENIED"}));	
			return;
		}

		requestQueue++;

		(async () => { // wrapping routine below to tell interpreter that it must pause (wait) for result
			try {
				if(requestQueue > config.max_incoming_call) // When to much request are made, delay of X(config.time_request_delay) second
				{
					console.log("You've made too much request, please wait", config.time_request_delay/1000, "seconds before making another request");
					await new Promise(done => setTimeout(() => done(), config.time_request_delay));
					requestQueue = 0;
					res.end();
					return;
				}

				all_result.push(await jazz_json(http, config.path_api.url, config.path_api.airJazz));
				all_result.push(await moon_json(http, config.path_api.url, config.path_api.airMoon));
				all_result.push(await beam_json(http, config.path_api.url, config.path_api.airBeam));
				
				all_result.forEach(function(element) {
					json_to_return.push([].slice.call(element).sort((a, b) => parseFloat(a.price) - parseFloat(b.price)));
				})
				res.end(JSON.stringify(json_to_return));
			}
			catch (error) {
				console.error('Error:', error.message);
				res.writeHead(503, { 'Content-Type': 'application/json' });
				res.end({error_message: error.message});
			}
		})();
	}
	else {
		res.writeHead(500, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({message:"ACCESS_DENIED"}));	
	}
}).listen(config.port, function () {
});
