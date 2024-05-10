const mongoose = require("mongoose");
const UserInfo = require("./userInfo");
const AddressSchema = mongoose.Schema(
  {
    Address: {
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
          SendersEmail: {
            type: String,
          },
          SendersContactPerson: {
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
          Origin: {
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
AddressSchema.pre("save", async function (next) {
  try {
    console.log("Address", this.Address)
    if (this.Address.length === 0) {
      throw new Error("Address is required");
    } else {
      const userInfo = await UserInfo.findByIdAndUpdate(this.userId, { address: this.Address[0]._id });
      if (!userInfo) {
        throw new Error("UserInfo not found");
      } else {
        console.log("userInfo", userInfo);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});
const AddressModel = mongoose.model("AddressModel", AddressSchema);
module.exports = AddressModel;
