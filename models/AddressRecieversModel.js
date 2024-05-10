const mongoose = require("mongoose");
const AddressSchema = mongoose.Schema(
  {
    AddressRecievers: {
      type: [
        {
          ProductType: {
            type: String,
          },
          ShipmentType: {
            type: String,
          },
          ServiceType: {
            type: String,
          },
          ReceiversEmail: {
            type: String,
          },
          ReceiversContactPerson: {
            type: String,
          },
          Destination: {
            type: String,
          },
          company_name: {
            type: String,
          },
          address_line_1: {
            type: String,
            // required: true,
          },
          address_line_2: {
            type: String,
          },
          phone_number: {
            type: String,
            min: 10,
            max: 15
          },
          telephone_number: {
            type: String,
            min: 10,
            max: 15
          },
          Country: {
            type: String,
            default: "AE",
          },
          City: {
            type: String,
          },
          ZipCode: {
            type: Number,
          },
          Active: {
            type: Boolean,
            default: false,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },

      ],
      default: []
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserInfo',
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
const AddressRecieversModel = mongoose.model("AddressRecieversModel", AddressSchema);
module.exports = AddressRecieversModel;
