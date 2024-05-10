const mongoose = require("mongoose");
const { hashPassword } = require("../helpers/passwordencrypter");

const CustomerShchema = mongoose.Schema(
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
      minlength: 5,
      maxlength: 255,
    },
  },
  {
    timestamps: true,
  }
);

Customers.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});
const Customers = mongoose.model("Customers", CustomerShchema);

module.exports = Customers;
