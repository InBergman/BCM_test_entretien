module.exports.flight_airBeam_request = function (http, hotsname, path, callback)
{
    
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
            var json_to_return = [{}];
            var data_chunk_array = data_chunk_joined
                                                    .split('\n')
                                                    .slice(1, data_chunk_joined.length);
            data_chunk_array.forEach(element => {
                var split_element = element.split(',');
                
                if(split_element.length > 1)
                {
                    var obj_tmp = {
                        provider: "AIR_BEAM",
                        price: parseFloat(split_element[1]),
                        departure_time: split_element[2],
                        arrival_time: split_element[3]
                    };
                    json_to_return.push(obj_tmp);
                }
            }); 
            return callback(null, json_to_return);
        });
    });
    
    api_single_end_point_request.on('error', (error) => {
        return callback(error, null);
    });
    
    api_single_end_point_request.end();
}