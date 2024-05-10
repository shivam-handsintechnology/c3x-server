const mongoose = require("mongoose");

const shipment = new mongoose.Schema(
  {
    consignee: {
      type: String,
      required: true,
    },
    consigneeCity: {
      type: String,
      required: true,
    },
    consigneeName: {
      type: String,
      required: true,
    },
    consigneePhone: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    shipmentFromDate: {
      type: Date,
      required: true,
    },
    shipmentToDate: {
      type: Date,
      required: true,
    },
    shipper: {
      type: String,
      required: true,
    },
    shipperPhone: {
      type: String,
      required: true,
    },
    shipperReference: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Shipment = mongoose.model("Shipment", shipment);

module.exports = Shipment;
