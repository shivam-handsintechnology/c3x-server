const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');

const userInfo = mongoose.Schema(
  {
    UserId: {
      type: String,
      unique: true,
      ref:"UserInfo"
    },
    dashboard: {
      ManageSubUsers: { type: Boolean, default: false },
      CreateBooking: { type: Boolean, default: false },
      ViewBookingHistory: { type: Boolean, default: false },
      PrintAirwayBill: { type: Boolean, default: false },
      PickupWithAWB: { type: Boolean, default: false },
      ViewAWBBookingHistory: { type: Boolean, default: false },
    }
  },
  {
    timestamps: true,
  }
);
const UserInfo = mongoose.model("UserDashBoard", userInfo);
module.exports = UserInfo;
