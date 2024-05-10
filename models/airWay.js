const mongoose = require("mongoose");

const airWaySchema = new mongoose.Schema(
  {
    airWayBillCreatedBy: {
      type: String,
    },
    codAmount: {
      type: String,
    },
    codCurrency: {
      type: String,
    },
    destination: {
      type: String,
    },
    dutyConsigneePay: {
      type: String,
    },
    goodsDescription: {
      type: String,
    },
    numberofPeices: {
      type: Number,
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
    receiversSubCity: {
      type: String,
    },
    receiversCountry: {
      type: String,
    },
    receiversCompany: {
      type: String,
    },
    ReceiversContactPerson: {
      type: String,
    },
    ReceiversEmail: {
      type: String,
    },
    receiversGeoLocation: {
      type: String,
    },
    receiversMobile: {
      type: String,
    },
    receiversPhone: {
      type: String,
    },
    receiversPinCode: {
      type: String,
    },
    receiversProvince: {
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
    sendersSubCity: {
      type: String,
    },
    sendersCountry: {
      type: String,
    },
    sendersCompany: {
      type: String,
    },
    sendersContactPerson: {
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
    sendersPhone: {
      type: String,
    },
    sendersPinCode: {
      type: String,
    },
    serviceType: {
      type: String,
    },
    shipmentDimension: {
      type: String,
    },
    shipmentInvoiceCurrency: {
      type: String,
    },
    shipmentInvoiceValue: {
      type: String,
    },
    shipperReference: {
      type: String,
    },
    shipperVatAccount: {
      type: String,
    },
    specialInstruction: {
      type: String,
    },
    weight: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const AirWay = mongoose.model("airWay", airWaySchema);

module.exports = AirWay;
