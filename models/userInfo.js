const mongoose = require("mongoose");
const MyServicetypesList = require("./MyServicetypesList");
const uuid = require("uuid").v4;
const userInfo = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      default: null
    },
    AccountNo: {
      type: String,
      // unique: true,
      default: uuid()
      // required: true
    },
    full_name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    dashboard: {
      type: {
        Manage_Sub_Users: {
          type: Boolean,
          default: false,
        },
        Air_Way_bill_history: {
          type: Boolean,
          default: false,
        },
        Pickup_History: {
          type: Boolean,
          default: false,
        },
        Pickup_Request: {
          type: Boolean,
          default: false,
        },
        Print_Airway_Bill: {
          type: Boolean,
          default: false,
        },
        Schedule_A_Pickup: {
          type: Boolean,
          default: false,
        },
        Airway_Bill_Generation: {
          type: Boolean,
          default: false,
        },
        Manage_Service_Type: {
          type: Boolean,
          default: false,
        },
      },
      default: {
        Manage_Sub_Users: false,
        Pickup_Request: false,
        Pickup_History: false,
        Air_Way_bill_history: false,
        Print_Airway_Bill: false,
        Airway_Bill_Generation: false,
      }
    },
    firstLogin: {
      type: Boolean,
      default: true
    },
    service_types: {
      type: mongoose.Types.ObjectId,
      ref: "MyServicetypesList",
    },
    Role: {
      type: String,
      required: true,
      enum: ["SubUser", "User", "Admin"],
      default: "User",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    Usertype: {
      type: String,
      enum: ["Credit", "Prepaid"],
      default: "Credit",
    },
    SubuserId: {
      type: mongoose.Types.ObjectId,
      default: null
    },
    address: {
      type: mongoose.Types.ObjectId,
      ref: "AddressModel"
    }
  },
  {
    timestamps: true,
  }
);

userInfo.pre("save", async function (next) {
  MyServicetypesList.create({ userId: this._id });
  next();
});
const UserInfo = mongoose.model("UserInfo", userInfo);

module.exports = UserInfo;
