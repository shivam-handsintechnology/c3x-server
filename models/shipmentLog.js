const mongoose = require("mongoose");

// "Awbno": "315101002",
// "Consignee": "Inaya Wajid",
// "Content": "SCHOOL PE AND SPORTS UNIFORM",
// "CreatedBy": "",
// "Dated": "14 Aug 2023",
// "Destination": "DXB",
// "DestinationName": "DUBAI-UNITED ARAB EMIRATES",
// "Origin": "DXB",
// "OriginName": "DUBAI-UNITED ARAB EMIRATES",
// "PCS": 1,
// "Rate": 0,
// "ServiceType": "NOR",
// "Shipper": "J20SPORTS",
// "Status": "Delivered",
// "Weight": 1

const shipment = new mongoose.Schema(
  {
    consignee: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    dated: {
      type: Date,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    destinationName: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    originName: {
      type: String,
      required: true,
    },
    pcs: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    shipper: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Shipment = mongoose.model("Shipment", shipment);

module.exports = Shipment;
