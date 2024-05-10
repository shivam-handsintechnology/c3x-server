const mongoose = require("mongoose");
const ServiceTypeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    Active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const ServiceTypeModel = mongoose.model("ServiceTypeModel", ServiceTypeSchema);
module.exports = ServiceTypeModel;
