const mongoose = require("mongoose");

const pickUpBooking = new mongoose.Schema(
  {
    appoximateWeight: {
      type: Number,
    },
    bookingAddress1: {
      type: String,
    },
    bookingAddress2: {
      type: String,
    },
    bookingCompanyName: {
      type: String,
    },
    bookingContactPerson: {
      type: String,
    },
    bookingCreatedBy: {
      type: String,
    },
    bookingEmail: {
      type: String,
    },
    bookingMobileNo: {
      type: String,
    },
    bookingPhoneNo: {
      type: String,
    },
    businessClosingTime: {
      type: String,
    },
    destination: {
      type: String,
    },
    goodsDescription: {
      type: String,
    },
    numberofPeices: {
      type: Number,
    },
    numberofShipments: {
      type: String,
    },
    origin: {
      type: String,
    },
    productType: {
      type: String,
    },
    receiversAddress1: {
      type: String,
    },
    receiversAddress2: {
      type: String,
    },
    receiversCity: {
      type: String,
    },
    receiversContactPerson: {
      type: String,
    },
    receiversEmail: {
      type: String,
    },
    receiversGeoLocation: {
      type: String,
    },
    receiversMobile: {
      type: String,
    },
    receiversCompany: {
      type: String,
    },
    receiversPhone: {
      type: String,
    },
    receiversPinCode: {
      type: String,
    },
    shipperReference: {
      type: String,
    },
    sendersAddress1: {
      type: String,
    },
    sendersAddress2: {
      type: String,
    },
    sendersCity: {
      type: String,
    },
    sendersContactPerson: {
      type: String,
    },
    sendersDepartment: {
      type: String,
    },
    sendersEmail: {
      type: String,
    },
    sendersGeoLocation: {
      type: String,
    },
    sendersMobile: {
      type: String,
    },
    sendersCompany: {
      type: String,
    },
    sendersPhone: {
      type: String,
    },
    sendersPinCode: {
      type: String,
    },
    serviceType: {
      type: String,
    },
    shipmentReadyDate: {
      type: String,
    },
    shipmentReadyTime: {
      type: String,
    },
    specialInstruction: {
      type: String,
    },
    packageType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PickUpBooking", pickUpBooking);
