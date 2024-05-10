const mongoose = require("mongoose");

// "Credit": 450,
// "DueAmount": 0,
//  "LastCreditAmount": 1050,
//  "LastCreditDate": "Aug 10, 2023",
//  "LastTransactionID": "6425",
//  "Remarks": "",
//  "TodayCharge": 0

const prepaidCustomer = new mongoose.Schema(
  {
    credit: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: true,
    },
    lastCreditAmount: {
      type: Number,
      required: true,
    },
    lastCreditDate: {
      type: String,
      required: true,
    },
    lastTransactionID: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
    },
    todayCharge: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
