module.exports.format_api = function (object, compagnie)
{
    var json_to_return = [{}];
    var tmp_obj;
    
    object.forEach(element => {
        if(compagnie == "AIR_JAZZ")
        {
            tmp_obj = {
                provider: compagnie,
                price: parseFloat(element.price),
                departure_time: element.dtime,
                arrival_time: element.atime
            };
        }
        else
        {
            tmp_obj = {
                provider: compagnie,
                price: parseFloat(element.price),
                departure_time: element.departure_time,
                arrival_time: element.arrival_time
            };
        }
        
       json_to_return.push(tmp_obj);
    });
   return json_to_return;
}

module.exports.encrypt = function (text)
{
    const crypto = require('crypto');
    
	var cipher = crypto.createHmac("sha256", text);
	var crypted = cipher.update(text,'utf8','hex');
	crypted += cipher.digest('hex');
	return crypted;
}