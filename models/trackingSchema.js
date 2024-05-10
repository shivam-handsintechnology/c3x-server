const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema(
  {
    airwayBillNumber: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    shipperReference: {
      type: String,
      required: true,
    },
    trackingLogDetails: {
      type: Array,
      required: true,
    },
    forwardingNumber: {
      type: String,
      required: true,
    },
    shipmentProgress: {
      type: String,
      required: true,
    },
    trackingLogDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrackLogSchema",
    },
  },
  {
    timestamps: true,
  }
);

const TrackingSchema = mongoose.model("TrackingSchema", trackingSchema);

module.exports = TrackingSchema;
