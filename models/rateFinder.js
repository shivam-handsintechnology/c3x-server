const mongoose = require("mongoose");
const rateFinder = new mongoose.Schema(
  {
    freight: {
      type: Number,
      required: true,
    },
    fuel: {
      type: Number,
      required: true,
    },
    netAmount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    vat: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RateFinderSchema = mongoose.model("RateFinder", rateFinder);

module.exports = RateFinderSchema;
