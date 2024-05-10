const PhoneNumber = require('libphonenumber-js');
const extractCountryCode = (phoneNumber) => {

    try {
        // Parse the phone number
        const phoneNumber = PhoneNumber.parse(phoneNumber);

        // Check if the phone number is valid
        if (PhoneNumber.isValidNumber(phoneNumber)) {
            // Get the country dial code (country calling code)
            const countryDialCode = PhoneNumber.getCountryCallingCode(phoneNumber.country);

            // Get the phone number without the country dial code
            const phoneNumberWithoutDialCode = phoneNumber.nationalNumber;

            ////console.log('Country Dial Code:', countryDialCode);
            ////console.log('Phone Number Without Dial Code:', phoneNumberWithoutDialCode);
            return {
                Extenson: countryDialCode,
                phoneNumber: phoneNumberWithoutDialCode
            }
        } else {
            ////console.log('Invalid phone number');
        }
    } catch (error) {
        console.error('Error parsing phone number:', error.message);
        return {
            Extenson: "+971",
            phoneNumber
        }

    }

};
module.exports = { extractCountryCode }