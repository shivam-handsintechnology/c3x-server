const { sendResponse, errorHandler } = require("../utils/dataHandler");
const UserModel = require("../models/userInfo");
const { validateUser } = require("../utils/Validator");
const asyncHandler = require("express-async-handler");
const { accessToken } = require("../utils/generateToken");
const { v4: uuidv4 } = require('uuid');
const { Dashboarddata } = require("../helpers/dashboards");
const { axiosAPI } = require("../config/thirdPartyApi");
const AddressModel = require("../models/AddressModel");
const { default: mongoose } = require("mongoose");
const Joi = require('joi');
const { hashPassword, decryptPassword } = require("../helpers/passwordencrypter");
const { sendEmail } = require("../helpers/sendEmail");
const ejs = require("ejs")
const path = require("path")
const file = path.join(__dirname, `../views/credentials.ejs`);
module.exports = {
  Register: asyncHandler(async (req, res, next) => {
    try {
      const { username, full_name, phone_number, telphone_number, cpassword, password, email, company_name, address_line_1, address_line_2, Origin, message, Country, City, dashboard, Role, } = req.body;
      const userAddres = {
        SendersContactPerson: full_name,
        SendersEmail: email,
        company_name: company_name,
        address_line_1: address_line_1,
        address_line_2: address_line_2,
        phone_number: phone_number,
        telephone_number: telphone_number,
        Country: Country,
        Origin: Origin,
        City: City,
      };

      const userDetail = {
        full_name: full_name,
        password: uuidv4(),
        // cpassword: cpassword,
        username: username,
        email: email,

      };
      let originalPassword = userDetail.password
      let payload = {
        ...userDetail,
        ...userAddres
      }
      const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        full_name: Joi.string().required(),

        password: Joi.string().min(6).required(),
        // cpassword: Joi.string().valid(Joi.ref('password')).required().messages({ 'any.only': 'Confirm Password does not match with Password' }),
        email: Joi.string().email().required(),
        company_name: Joi.string().required(),
        address_line_1: Joi.string().max(500).required(),
        address_line_2: Joi.string().max(100).required(),
        Country: Joi.string().required(),
        City: Joi.string().required(),
        Origin: Joi.string().required(),
        phone_number: Joi.string().min(10).max(15).required().label("Phone Number"),
        telephone_number: Joi.string().optional().allow(""),
        SendersContactPerson: Joi.string().required().label("Contact Person"),
        SendersEmail: Joi.string().email().required().label("Email"),

      });

      // Validate request body against schema
      const { error, value } = schema.validate(payload);
      if (error) {
        return errorHandler(res, 400, error.details[0].message);
      }
      // // Check if user already exists
      // const existingUser = await UserModel.findOne({ email });
      // if (existingUser) {
      //   return errorHandler(res, 400, "User already exists");
      // }
      userDetail.password = await hashPassword(userDetail.password)
      // Create new user
      const newUser = new UserModel({
        ...userDetail, dashboard: {
          Manage_Sub_Users: true,
          Pickup_Request: true,
          Pickup_History: true,
          Air_Way_bill_history: true,
          Print_Airway_Bill: true,
          Airway_Bill_Generation: true,
        }
      });
      // Save the user to the database
      newUser.service_types = newUser._id
      let user = await newUser.save();
      user = user.toObject()
      if (user) {
        await AddressModel.create({
          Address: [{ ...userAddres, Active: true }],
          userId: user._id,
        });
      }
      delete user.password
      delete user.Role
      const access_token = accessToken(user._id);
      let frontendurl = req.headers.origin + "/Login" ? req.headers.origin : "http://localhost:4000/Login"
      const template = await ejs.renderFile(file, { user, frontendurl, url: req.headers.origin, password: originalPassword, message: "Your Account Created Successfully. Below are your system generated credentials" });
      let options = {
        fromemail: process.env.EMAIL_HOST_USER,
        email: process.env.EMAIL_HOST_USER,
        subject: "Account Created",
        text: `Hello User is created please check`,
        html: template
      }
      await sendEmail(options)
      return sendResponse(res, 201, { ...user, access_token }, "User Registered Successfully")
    } catch (error) {
      console.log(error)
      return errorHandler(res, 500, error)
    }
  }),
  SignIn: asyncHandler(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw new Error("Please Enter Email");
      } else if (!password) {
        throw new Error("Please Enter Password");
      } else {
        let exist = await UserModel.findOne({ $or: [{ email: email }, { username: email }] });

        if (exist) {
          let isActive = exist.isActive;
          if (!isActive) {
            throw new Error("User is not Active");
          }
          let Originalpassword = exist.password;
          Originalpassword = await decryptPassword(Originalpassword);
          if (Originalpassword !== password) {
            return errorHandler(res, 400, "Please Enter valid Username and Password");
          }

          // Check if the user is logging in for the first time
          if (exist.Role === "Admin") {
            // If it's not the first login, continue with the regular login process
            exist = exist.toObject();
            const access_token = accessToken(exist._id);
            return sendResponse(res, 200, { ...exist, access_token }, "Login successfully");
          }
          else if (exist.firstLogin) {
            // Set the firstLogin flag to true and save it
            exist.firstLogin = false;
            await exist.save();
            exist = exist.toObject();
            const access_token = accessToken(exist._id);
            return sendResponse(res, 200, { ...exist, first: true, access_token }, "Login successfully");
            // Redirect the user to the changepasswordpage
            // You should replace '/changepasswordpage' with the actual route for your changepasswordpage.
          } else {
            // If it's not the first login, continue with the regular login process
            exist = exist.toObject();
            const access_token = accessToken(exist._id);
            return sendResponse(res, 200, { ...exist, access_token }, "Login successfully");
          }

        } else {
          throw new Error("User Does Not Exist");
        }
      }
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),

  GetProfile: asyncHandler(async (req, res, next) => {
    try {

      const { _id } = req.user

      if (!_id) {
        throw new Error("User Id Not Found")
      } else {
        let result = await UserModel.aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(_id) } // Ensuring _id is converted to ObjectId
          },
          {
            $lookup: {
              from: "addressmodels", // Replace with your AddressModel's collection name
              let: { userId: '$_id' }, // Define a variable 'userId' for use in the pipeline
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$userId', '$$userId'] // Match the userId in the address document with the user's _id
                    }
                  }
                },
                { $unwind: '$Address' }, // Unwind the Address array
                { $match: { 'Address.Active': true } }, // Filter the addresses to keep only active ones
                { $project: { Address: 1, _id: 0 } } // Project only the Address field
              ],
              as: 'ActiveAddress'
            }
          },

          {
            $project: {
              // Project the fields you need
              AccountNo: 1,
              isActive: 1,
              full_name: 1,
              username: 1,
              password: 1,
              email: 1,
              dashboard: 1,
              isAdmin: 1,
              ActiveAddress: 1, // Include the active address
              Role: 1
            }
          }
        ]);

        ////console.log(result);
        if (result.length > 0) {
          result = result[0]
          result.ActiveAddress.length > 0 ? result.ActiveAddress = result.ActiveAddress[0].Address : result.ActiveAddress = {}
        }
        let Usercredentials = {

          AccountNo: req.user.AccountNo,
          UserName: req.body["UserName"],
          Password: req.body["Password"]
        }
        console.log({ Usercredentials })
        await axiosAPI.post("VerifyAccount", Usercredentials)
          .then((response) => {
            if (response.data.Code < 0) {
              console.log(response)
              throw new Error(response.data.Description)
            } else {
              console.log(response.data)
              return sendResponse(res, 200, {
                AccountData: response.data,
                user: result
              })
            }
          })
          .catch((error) => {
            return errorHandler(res, 500, error)
          })
      }

    } catch (error) {
      return errorHandler(res, 500, error)
    }


  }),
  Dashboard: asyncHandler(async (req, res) => {
    try {
      const { Role } = req.user;
      ////console.log({ Role })
      const user = Dashboarddata.find(item => item.Role === Role);
      ////console.log({ user })
      if (!user) {
        return sendResponse(res, 404, "User not found");
      }
      return sendResponse(res, 200, user.dashboard, "User dashboard retrieved successfully");
    } catch (error) {
      return errorHandler(res, 500, error)
    }
  }),
  Adddress: asyncHandler(async (req, res) => {
    try {
      const user = await AddressModel.findOne({ user: req.user._id });
      if (!user) {
        req.body["user"] = req.user._id
        const address = await AddressModel.create(req.body);
        await address.save()
        return sendResponse(res, 200, address, "Address added successfully");
      } else {
        req.body["user"] = req.user._id
        await AddressModel.findOneAndUpdate({ user: req.user._id }, req.body, { new: true });
        return sendResponse(res, 200, user, "Address Updated successfully");
      }
    } catch (err) {
      console.error(err);
      return errorHandler(res, 500, err.message)
    }
  }),
  ChnagePassword: asyncHandler(async (req, res) => {
    try {
      let { oldPassword, newPassword } = req.body;
      const { _id } = req.user;
      if (!oldPassword) {
        return errorHandler(res, 400, "Old password is required");
      }
      if (!newPassword) {
        return errorHandler(res, 400, "New password is required");
      }
      const user = await UserModel.findById(_id);
      if (!user) {
        return errorHandler(res, 400, "User not found");
      }
      let Originalpassword = await decryptPassword(user.password)
      if (Originalpassword !== oldPassword) {
        return errorHandler(res, 400, "Old password is incorrect");
      } else {
        newPassword = await hashPassword(newPassword)
        let data = await UserModel.findByIdAndUpdate(_id, { password: newPassword }, { new: true });
        return sendResponse(res, 200, data, "Password changed successfully");

      }
    } catch (error) {
      console.error(error);
    }
  }),

}