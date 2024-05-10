const mongoose = require("mongoose");
const userInfo = mongoose.Schema(
  {
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
    },
    dashboard: {
      Home: {
        type: Object, default: {
          isAllowed: true,
          route: "/",
        }
      },
      Manage_Sub_Users: {
        type: Object, default: {
          isAllowed: false,
          route: "/ManageSubUsers",

        }
      },
      Mamage_Shiping: {
        type: Object, default: {
          isAllowed: false,
          route: "/Managingshipping",
        }
      },
      Schedule_A_Pickup: {
        type: Object, default: {
          isAllowed: false,
          route: "/Schedulepickupbooking",
        }
      },
      Pickup_History: {
        type: Object, default: {
          isAllowed: false,
          route: "/Pickuphistory",
        }
      },
      Top_Up_Request: {
        type: Object, default: {
          isAllowed: false,
          route: "/Topuprequest",
        }
      },
      Prepaid_Topup_Request: {
        type: Object, default: {
          isAllowed: false,
          route: "/PrepaidTopuprequest",
        }
      },
      Prepaid_Topup_Request_History: {
        type: Object, default: {
          isAllowed: false,
          route: "/Topuphistory",
        }
      },
      Invoices: {
        type: Object, default: {
          isAllowed: false,
          route: "/invoices",
        }
      },
      Payment_Dues: {
        type: Object, default: {
          isAllowed: false,
          route: "/PaymentDues",
        }
      },
    },

  },
  {
    timestamps: true,
  }
);
const UserInfo = mongoose.model("Admins", userInfo);
module.exports = UserInfo;
