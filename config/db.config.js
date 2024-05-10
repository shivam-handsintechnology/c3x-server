const mongoose = require("mongoose");
const AdminModel = require('../models/userInfo');
const { hashPassword } = require("../helpers/passwordencrypter");
async function createDefaultAdmin() {
  // Check if default admin exists in the database
  try {
    const adminExists = await AdminModel.findOne({ email: process.env.ADMIN_EMAIL })

    if (!adminExists) {
      // Create default admin
      const defaultAdmin = {
        username: process.env.C3XUSERNAME,
        full_name: process.env.ADMIN_FULL_NAME,
        password: await hashPassword(process.env.C3XPASSWORD),
        email: process.env.ADMIN_EMAIL,
        AccountNo: process.env.ACCOUNTNO,
        isAdmin: true,
        isActive: true,
        Role: "Admin",

        dashboard: {
          Manage_Sub_Users: true,
          Pickup_Request: true,
          Schedule_A_Pickup: true,
          Pickup_History: true,
          Air_Way_bill_history: true,
          Print_Airway_Bill: true,
          Airway_Bill_Generation: true,
          Manage_Service_Type: true,
        }
      }
      // Save default admin to the database
      await AdminModel.create(defaultAdmin);
      ////console.log("Admin created successfuully")
    }
  } catch (error) {
    console.log("error", error)
  }
}
// connection of database & server
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if (conn) {
      createDefaultAdmin()
      console.log(`MongoDB connected: at C3X ${conn.connection.host}`);
    } else {
      console.log("Failed to connect the database.");
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
