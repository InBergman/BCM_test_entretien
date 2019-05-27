module.exports.flight_airMoon_request = function (http, hotsname, path, callback)
{
    var tool = require('./format_api');

    const options = {
        hostname: hotsname,
        path: path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/json'
        },
    };
    
    const api_single_end_point_request = http.request(options, (response) => {
        var data_chunk_joined;
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            data_chunk_joined += chunk;
        });
        response.on('end', () => {
            data_chunk_joined = data_chunk_joined.slice(9, data_chunk_joined.length);
            var jsonObject = JSON.parse(data_chunk_joined);
            formated_json_to_return =  tool.format_api(jsonObject, "AIR_MOON");
            return callback(null, formated_json_to_return);
        });
    });
    
    api_single_end_point_request.on('error', (error) => {
        return callback(error, null);
    });
    
    api_single_end_point_request.end();
}
