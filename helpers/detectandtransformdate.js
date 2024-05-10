const moment = require('moment'); // You may need to install the 'moment' library if not already installed

function detectAndTransformDates(req, res, next) {
    // Recursively search through the req.body object to identify and transform date properties
    function searchAndTransformDates(obj) {
        for (const key in obj) {
            const value = obj[key];
            if (value instanceof Object) {
                // If the property is an object, recursively search and transform it
                obj[key] = searchAndTransformDates(value);
            } else if (moment(value, moment.ISO_8601, true).isValid()) {
                // If the property is a valid ISO 8601 date string, transform it to the desired format
                obj[key] = moment(value).format('MM/DD/YYYY'); // Change the format as needed
                
            }
        }
        return obj;
    }

    // Detect and transform date properties within req.body
    req.body = 
     searchAndTransformDates(req.body);

    next();
}

module.exports = detectAndTransformDates;
