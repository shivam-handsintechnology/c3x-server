const mongoose = require("mongoose");

const trackLog = new mongoose.Schema(
  {
    activityDate: {
      type: Date,
    },
    activityTime: {
      type: String,
      required: true,
    },
    deliveredTo: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TrackLogSchema = mongoose.model("TrackLogSchema", trackLog);

module.exports = TrackLogSchema;
