const Joi = require('joi');
const { ValidateDate } = require('./DateValidator');

// / User-defined function to validate the user 

function validateAdminAddUser(user) {
    const userPayloadSchema = Joi.object({
        username: Joi.string().required().label('Username'),
        full_name: Joi.string().required().label('Full Name'),
        email: Joi.string().email().required().label('Email'),
        phone_number: Joi.number().required().label('Phone Number'),
        telephone_number: Joi.number().allow("").label('Telephone Number'),
        company_name: Joi.string().required().label('company Name'),
        address_line_1: Joi.string().max(500).required().label('Address Line 1'),
        address_line_2: Joi.string().max(100).required().label('Address Line 2'),
        // Extenson: Extenson,
        Country: Joi.string().required().label('Country'),
        SendersContactPerson: Joi.string().required().label('Contact Person'),
        SendersEmail: Joi.string().email().required().label('Email'),
        City: Joi.string().required().label('City'),
        Origin: Joi.string().required().label('Origin'),
        password: Joi.string().required().label('Password'),
        // cpassword: Joi.any().equal(Joi.ref('password'))
        //     .required()
        //     .label('Confirm password')
        //     .messages({ 'any.only': 'Password and {{#label}} does not match' }),
        dashboard: Joi.object().required().label('User Dashboard'),
        AccountNo: Joi.string().required().label('Account No'),
    });

    return userPayloadSchema.validate(user);
}
// validate Service Type 
function validateServiceType(user) {
    const userPayloadSchema = Joi.object({
        title: Joi.string().required().label('Title'),
        value: Joi.string().required().label('Value'),

    }).unknown(true);

    return userPayloadSchema.validate(user);
}
function validateUser(user) {
    const userPayloadSchema = Joi.object({
        username: Joi.string().required().label('Username'),
        full_name: Joi.string().required().label('Full Name'),
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().required().label('Password'),
        cpassword: Joi.any().equal(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .messages({ 'any.only': '{{#label}} does not match' }),
        phone_number: Joi.string().required().label('Phone Number'),


    });

    return userPayloadSchema.validate(user);
}

// Validate Tracking details
function validateTracking(user) {
    const JoiSchema = Joi.object({
        TrackingAWB: Joi.array()
            .items(
                Joi.object({
                    AirWayBillNo: Joi.string().required().label('AirWayBillNo')
                })
            )
            .required().label('Tracking AWB'),
        UserName: Joi.string().required().label('User Name'),
        Password: Joi.string().required().label('Password'),
        Country: Joi.string().label('Country'),
    });

    return JoiSchema.validate(user);
}
// Validate Country API
function validateCountryAPi(user) {
    const JoiSchema = Joi.object({
        UserName: Joi.string().required().label('User Name'),
        Password: Joi.string().required().label('Password'),
    });

    return JoiSchema.validate(user);
}

// Validate City List API
function validateCityListAPi(user) {
    const JoiSchema = Joi.object({
        UserName: Joi.string().required().label('User Name'),
        Password: Joi.string().required().label('Password'),
        Country: Joi.string().required().label('Country'),
    });

    return JoiSchema.validate(user);
}

// Validate Due Invoices
function validateDueInvoices(user) {
    const JoiSchema = Joi.object({
        AccountNo: Joi.required().label('Account No'),
        UserName: Joi.string().required().label('User Name'),
        Password: Joi.string().required().label('Password'),
        Country: Joi.string().label('Country'),
    });

    return JoiSchema.validate(user);
}

// Validate Prepaid Account Status
function validatePrepaidAccountStatus(user) {
    const JoiSchema = Joi.object({
        AccountNo: Joi.required().label('Account No'),
        UserName: Joi.string().required().label('User Name'),
        Password: Joi.string().required().label('Password'),
    });

    return JoiSchema.validate(user);
}

// Validate Invoice No
function validateInvoiceNo(user) {
    const JoiSchema = Joi.object({
        InvoiceNo: Joi.number().required().label('Invoice No'),
        UserName: Joi.string().required().label('User Name'),
        Password: Joi.string().required().label('Password'),
        Country: Joi.string().label('Country'),
    });

    return JoiSchema.validate(user);
}

// Validate Pickup Summary For Accounts
function validatePickupSummaryForAccounts(user) {
    const JoiSchema = Joi.object({
        AccountCode: Joi.string().required().label('Account No'),
        UserName: Joi.string().required().label('User Name'),
        Password: Joi.string().required().label('Password'),
        FromDate: Joi.date().required().label('From Date'),
        ToDate: Joi.date().required().label('To Date'),
        Country: Joi.string().allow("").required().label('Country'),
    }).custom(ValidateDate, 'Date Validation')

    return JoiSchema.validate(user);
}

// Validate Rate Finder
function validateRateFinder(user) {
    const JoiSchema = Joi.object({
        AccountNo: Joi.string().required().label('Account No'),
        UserName: Joi.string().required().label('User Name'),
        Password: Joi.string().required().label('Password'),
        Destination: Joi.string().required().label('Destination'),
        // Dimension: Joi.string().allow("").required().label('Dimension'),
        Origin: Joi.string().required().label('Origin'),
        // ServiceType: Joi.string().required().label('Service Type'),
        Weight: Joi.number().required().label('Weight'),
        // Country: Joi.string().required().label('Country'),
        Product: Joi.string().required().label('Product'),
    }).unknown(true);

    return JoiSchema.validate(user);

}
// COntact us validation
function validateContactUs(user) {
    const JoiSchema = Joi.object({
        full_name: Joi.string().required().label('Full Name'),
        email: Joi.string().email().required().label('Email'),
        phone_number: Joi.number().required().label('Phone Number'),
        message: Joi.string().required().label('Message'),
        subject: Joi.string().required().label('Subject'),
    })
    return JoiSchema.validate(user);
}

// Validate Airway Bill PDF Format
function validatAirwayBillPDFFormat(user) {
    const JoiSchema = Joi.object({
        AccountNo: Joi.required().label('Account No'),
        AirwayBillNumber: Joi.string().required().label('Airway Bill Number'),
        RequestUser: Joi.string().allow("").required().label('Request User'),
        PrintType: Joi.string().required().label('Print Type'),
        UserName: Joi.string().required().label('User Name'),
        Password: Joi.string().required().label('Password'),
        Country: Joi.string().required().label('Country'),
    });

    return JoiSchema.validate(user);
}

// Validate Booking History
function ValidateBookingHistory(user) {
    const JoiSchema = Joi.object({
        AccountNo: Joi.required().label('Account No'),
        BookingFromDate: Joi.date().required().label('Booking From Date'),
        BookingPerson: Joi.string().allow('').required().label('Booking Person'),
        BookingToDate: Joi.date().required().label('Booking To Date'),
        PickupRequestNo: Joi.string().allow('').required().label('Pickup Request No'),
        ReceiversCompany: Joi.string().allow('').required().label('Receivers Company'),
        ReceiversName: Joi.string().allow('').required().label('Receivers Name'),
        ReceiversPhone: Joi.string().allow('').required().label('Receivers Phone'),
        SendersCompany: Joi.string().allow('').required().label('Senders Company'),
        SendersPhone: Joi.string().allow('').required().label('Senders Phone'),
        ServiceType: Joi.string().allow('').required().label('Service Type'),
        UserName: Joi.string().required().label('User Name'),
        Password: Joi.string().required().label('Password'),
        Country: Joi.string().label('Country'),
    }).custom(ValidateDate, 'Date Validation')

    return JoiSchema.validate(user);
}

// Validate Shipment History
function ValidateShipmentHistoryy(user) {
    const JoiSchema = Joi.object({
        AccountNo: Joi.required().label('Account No'),
        AirWayBillNo: Joi.string().allow('').required().label('AirWay Bill No'),
        ShipmentFromDate: Joi.date().required().label('Shipment From Date'),
        ShipmentToDate: Joi.date().required().label('Shipment To Date'),
        Consignee: Joi.string().allow('').required().label('Consignee'),
        ConsigneeCity: Joi.string().allow('').required().label('Consignee City'),
        ConsigneeName: Joi.string().allow('').required().label('Consignee Name'),
        ConsigneePhone: Joi.string().allow('').required().label('Consignee Phone'),
        ServiceType: Joi.string().allow('').required().label('Service Type'),
        Shipper: Joi.string().allow('').required().label('Shipper'),
        ShipperPhone: Joi.string().allow('').required().label('Shipper Phone'),
        ShipperReference: Joi.string().allow('').required().label('Shipper Reference'),
        CreatedBy: Joi.string().allow('').required().label('Created By'),
        UserName: Joi.string().required().label('User Name'),
        Password: Joi.string().required().label('Password'),
        Country: Joi.string().label('Country'),
    }).custom(ValidateDate, 'Date Validation')

    return JoiSchema.validate(user);
}

// Validate Create Airway Bill
function ValidateCreateAirwayBill(user) {
    const schema = Joi.object({
        AirwayBillData: Joi.object({
            // ... (add labels for AirwayBillData properties similarly)
        }).required().label('Airway Bill Data'),
        UserName: Joi.string().required().label('User Name'),
        Password: Joi.string().required().label('Password'),
        AccountNo: Joi.string().required().label('Account No'),
        Country: Joi.string().required().label('Country'),
    });

    return schema.validate(user);
}

//    Validate AddressModel
function validateAddressModel(user) {
    const schema = Joi.object({
        company_name: Joi.string().required().label('Company Name'),
        address_line_1: Joi.string().required().label('Address Line 1'),
        address_line_2: Joi.string().required().label('Address Line 2'),
        phone_number: Joi.string().required().label('Phone Number'),
        // Extenson: Joi.string().required().label('Extenson'),
        Country: Joi.string().required().label('Country'),
        City: Joi.string().required().label('City'),
        ZipCode: Joi.number().required().label('Zip Code'),
        telephone_number: Joi.number().required().label('Telephone Number'),
        // Active: Joi.boolean().required().label('Active'),

        // userId: Joi.string().required().label('User Id'),
    }).unknown(true);

    return schema.validate(user);
}

module.exports = { validateContactUs, validateAdminAddUser, validateServiceType, validateAddressModel, validatePickupSummaryForAccounts, validateCountryAPi, validateCityListAPi, validateInvoiceNo, validatAirwayBillPDFFormat, validateUser, ValidateShipmentHistoryy, validateTracking, ValidateCreateAirwayBill, ValidateBookingHistory, validateDueInvoices, validatePrepaidAccountStatus, validateRateFinder }