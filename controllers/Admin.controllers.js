const { sendResponse, errorHandler } = require("../utils/dataHandler");
const UserModel = require("../models/userInfo");
const { validateAdminAddUser } = require("../utils/Validator");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const XLSX = require("xlsx");
const excelJS = require("exceljs");
const AddressModel = require("../models/AddressModel");
const path = require("path");
const ejs = require("ejs")
const BatchNumberModel = require("../models/BatchNumberModel")
const file = path.join(__dirname, `../views/credentials.ejs`);
const {
  usersWithHashedPasswordsPromiseArray, hashPassword, decryptPassword,
} = require("../helpers/passwordencrypter");
const { sendEmail } = require("../helpers/sendEmail");
const MyServicetypesList = require("../models/MyServicetypesList");
const { default: mongoose } = require("mongoose");
const AddressRecieversModel = require("../models/AddressRecieversModel");
module.exports = {
  addMultipleUsers: asyncHandler(async (req, res) => {
    try {
      let data;
      if (req.files && req.files.userinfo) {
        // Assuming you have a file upload middleware that stores the uploaded Excel file in req.file.buffer
        const buffer = req.files.userinfo.data;
        // Parse the Excel file
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = XLSX.utils.sheet_to_json(sheet);
        if (!excelData || excelData.length === 0) {
          return sendResponse(
            res,
            400,
            "No data found in the uploaded Excel file."
          );
        }

        // Check if all required columns are present
        const requiredColumns = [
          "full_name",
          "email",
          "password",
          "contactPhone",
        ];
        const columnHeaders = Object.keys(excelData[0]);

        for (const column of requiredColumns) {
          if (!columnHeaders.includes(column)) {
            return sendResponse(
              res,
              400,
              `Column "${column}" is missing in the Excel file.`
            );
          }
        }

        // Create new users in the aggregation pipeline
        ////console.log("excelData", excelData)
        data = await usersWithHashedPasswordsPromiseArray(excelData);
        // Insert the new users using the aggregation pipeline
        await UserModel.insertMany(data, { ordered: false });

        return sendResponse(res, 201, "Users added successfully");
      } else {
        const users = req.body.users;
        // Create new users in the aggregation pipeline
        const Promisedata = await usersWithHashedPasswordsPromiseArray(users);
        const newUsers = await Promise.all(Promisedata);
        ////console.log(newUsers)
        // Insert the new users using the aggregation pipeline
        await UserModel.insertMany(newUsers);

        return sendResponse(res, 201, "Users added successfully");
      }
    } catch (error) {
      ////console.log(error)

      return errorHandler(res, 500, error);
    }
  }),
  // Add user controller
  addUser: asyncHandler(async ({ body, user, headers }, res) => {
    try {
      const {
        username,
        full_name,
        phone_number, telephone_number,
        email,
        company_name,
        address_line_1,
        address_line_2,
        Country,
        City,
        Origin,
        AccountNo,
      } = body;

      let dashboard = {
        Manage_Sub_Users: true,
        Pickup_Request: true,
        Pickup_History: true,
        Air_Way_bill_history: true,
        Print_Airway_Bill: true,
        Airway_Bill_Generation: true,
      };

      if (user.Role === "User") {
        dashboard = {
          ...body.dashboard,
        };
      }

      const userAddres = {
        SendersContactPerson: full_name,
        SendersEmail: email,
        company_name,
        address_line_1,
        address_line_2,
        phone_number,
        Country,
        City,
        Origin,
        telephone_number
      };

      const userDetail = {
        username,
        full_name,
        phone_number,
        password: uuidv4(),
        email,
        dashboard,
        AccountNo,
      };

      const payload = { ...userDetail, ...userAddres };

      const { error } = validateAdminAddUser(payload);
      if (error) {
        return errorHandler(res, 400, error.details[0].message);
      }

      userDetail.password = await hashPassword(userDetail.password);

      if (user.Role === "User") {
        userDetail.SubuserId = user._id;
        userDetail.Role = "SubUser";
      } else if (user.Role === "Admin") {
        userDetail.Role = "User";
      }

      const newUser = new UserModel({
        ...userDetail,
        dashboard,
        isActive: true
      });

      newUser.service_types = newUser._id;
      let userId = newUser._id;
      let savedUser = await newUser.save()
      await AddressModel.create({ Address: [userAddres], userId })
      if (user.Role === "Admin") {
        userDetail.Role = "User";
        let service_types = [];
        if (body.service_types && body.service_types.length > 0) {
          service_types = body.service_types;
          await MyServicetypesList.findOneAndUpdate(
            { userId: userId },
            { $addToSet: { service_types: { $each: service_types } } },
            { new: true }
          );
        }
      }

      const frontendUrl = headers.origin + "/Login" || "http://localhost:4000/Login";
      const template = await ejs.renderFile(file, {
        user: savedUser,
        frontendurl: frontendUrl,
        url: headers.origin,
        password: userDetail.password,
        message: "Your Account Created Successfully. Below are your system generated credentials"
      });

      const options = {
        fromemail: user.email,
        email: savedUser.email,
        subject: "Account Updated",
        text: `Hello ${savedUser.full_name} Your Account Created Successfully`,
        html: template
      };


      sendEmail(options);


      return sendResponse(res, 201, { message: "User added successfully", user: savedUser }, "User added successfully");
    } catch (error) {
      console.log(error);
      return errorHandler(res, 500, error);
    }
  }),


  // Update user controller
  updateUser: asyncHandler(async (req, res) => {
    try {

      // Check if user exists
      const existingUser = await UserModel.findById(req.body._id);
      if (!existingUser) {
        return sendResponse(res, 404, "User not found");
      }
      //console.log("service_types", req.body.service_types)
      let originalpassword = req.body.password
      if (req.body.password) {
        req.body.password = await hashPassword(req.body.password)
      }
      if (req.user.Role === "Admin" || req.user.Role === "User") {
        if (req.body.service_types && req.body.service_types.length > 0) {
          let service_types = req.body.service_types.map((item) => new mongoose.Types.ObjectId(item))
          //console.log({ service_types })
          await MyServicetypesList.findOneAndUpdate(
            { userId: req.body._id },
            { $addToSet: { service_types: { $each: service_types } } },
            { new: true } // Return the updated document
          );
        }

      }
      if (req.body.address && Object.keys(req.body.address).length > 0) {
        console.log("_id", req.body.address._id, "userid", req.user._id)
        if (req.body.address._id) {

          let addressupdate = await AddressModel.findOneAndUpdate(
            { userId: req.body._id, 'Address._id': req.body.address._id },
            { $set: { 'Address.$': req.body.address, } },
            { new: true } // To get the updated document as the result
          );
          console.log("addressupdate", addressupdate)
          req.body.address = req.body.address._id
        } else {
          const existingAddress = await AddressModel.findOne({ userId: req.user._id });
          if (existingAddress) {
            await existingAddress.Address.push(req.body)
            let addressdata = await existingAddress.save()
            req.body.address = addressdata.Address[0]._id
          } else if (!existingAddress) {
            let addressdata = await AddressModel.create({
              Address: [{ ...req.body.address }],
              userId: req.body._id,
            });
            req.body.address = addressdata.Address[0]._id
          }

        }
      }
      delete req.body.service_types
      let data = await UserModel.findByIdAndUpdate(req.body._id, req.body, {
        new: true,
      });

      let frontendurl = req.headers.origin + "/Login" ? req.headers.origin : "http://localhost:4000/Login"

      const template = await ejs.renderFile(file, { url: req.headers.origin, user: data, frontendurl, password: originalpassword, message: "Your Account Updated Successfully. Below are your system generated credentials" });
      let options = {
        fromemail: req.user.email,
        email: data.email,
        subject: "Account Updated",
        // text: `Hello ${data.full_name} Your Account Updated Successfully`,
        html: template
      }

      sendEmail(options)

      return sendResponse(res, 200, data, "User updated successfully");
    } catch (error) {
      console.log(error);
      return errorHandler(res, 500, error);
    }
  }),
  updateStatus: asyncHandler(async (req, res) => {
    try {
      // Check if user exists
      const existingUser = await UserModel.findById(req.body._id);
      if (!existingUser) {
        return sendResponse(res, 404, "User not found");
      }
      if (req.body.password) {
        req.body.password = await hashPassword(req.body.password)
      }
      let data = await UserModel.findByIdAndUpdate(req.body._id, req.body, {
        new: true,
      });

      return sendResponse(res, 200, data, "User updated successfully");
    } catch (error) {
      ////console.log(error);
      return errorHandler(res, 500, error);
    }
  }),
  // Delete user controller
  deleteUser: asyncHandler(async (req, res) => {
    try {
      const { userId } = req.query;
      // Check if user exists
      const existingUser = await UserModel.findById(userId);
      if (!existingUser) {
        return sendResponse(res, 404, "User not found");
      }
      console.log("userId", userId)
      // Delete user
      await MyServicetypesList.findOneAndDelete({ userId: userId })
      await AddressModel.findOneAndDelete({ userId: userId })
      await BatchNumberModel.findOneAndDelete({ userId: userId })
      await AddressRecieversModel.findOneAndDelete({ userId: userId })
      await UserModel.findByIdAndDelete(userId);
      return sendResponse(res, 200, "User deleted successfully");
    } catch (error) {
      console.log(error)
      return errorHandler(res, 500, error);
    }
  }),
  // Get All  user controller
  // Get All user controller
  GetAllUser: asyncHandler(async (req, res) => {
    ////console.log("admin", req.user)
    const { page, limit, search = "", activate = "" } = req.query;
    let obj = {
      // isAdmin: false,
    };
    let usercountObj = {
      // isAdmin: false,
    }
    activate === "" && delete obj["isActive"];
    activate === "active" && (obj["isActive"] = true);
    activate === "inactive" && (obj["isActive"] = false);

    ////console.log({ obj })
    if (search !== "") {
      obj["$or"] = [
        { full_name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { AccountNo: new RegExp(search, "i") },
        { username: new RegExp(search, "i") },
      ];
    }

    try {
      if (req.user.Role === "User") {
        obj.SubuserId = req.user._id
        usercountObj.SubuserId = req.user._id
        obj.Role = "SubUser"
      }
      else if (req.user.Role === "Admin") {
        obj.Role = "User"
        usercountObj.Role = "User"
      }
      if (activate !== "") {
        usercountObj.isActive = activate === "active" ? true : false
      }
      if (search !== "") {
        usercountObj["$or"] = [
          { full_name: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
          { AccountNo: new RegExp(search, "i") },
          { username: new RegExp(search, "i") },
        ];
      }

      // Get total count of users
      const totalCount = await UserModel.countDocuments(usercountObj);
      console.log({ totalCount })
      // Convert page and limit to numbers
      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 10;
      // Calculate the skip value
      const skip = (pageNumber - 1) * limitNumber;
      // Aggregate pipeline
      const pipeline = [
        {
          $match: obj,
        },
        {
          $lookup: {
            from: "myservicetypeslists", // Replace with your AddressModel's collection name
            let: { userId: '$_id' }, // Define a variable 'userId' for use in the pipeline
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$userId', '$$userId'] // Match the userId in the address document with the user's _id
                  }
                }
              },
              // { $unwind: '$Address' }, // Unwind the Address array
              // { $project: { Address: 1, _id: 0 } } // Project only the Address field
            ],
            as: 'Service'
          }
        },
        {
          $lookup: {
            from: "addressmodels",
            localField: "address",
            foreignField: "Address._id",
            as: "address"
          }
        },
        // {
        //   "$unwind": "$address"
        // },
        // {
        //   $unwind: "$address.Address"
        // },

        // {
        //   "$replaceRoot": {
        //     "newRoot": "$address"
        //   }
        // },
        // Pagination
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNumber },
        // Sort by username in ascending order
      ];

      // Execute the aggregate query
      const users = await UserModel.aggregate(pipeline);

      // Check if users exist
      if (users.length === 0) {
        // Create a function to decrypt the password for a user

        return sendResponse(res, 404, null, "No users found");
      }
      let decryptedUsers = []
      // Return the paginated users
      if (users.length > 0) {
        const decryptUserPassword = async (user) => {
          //console.log({ users })
          let service_types = user.Service.length > 0 ? user.Service[0].service_types : []
          delete user.Service
          console.log("address", user.address)
          if (user.address && user.address.length > 0) {
            user.address = user?.address[0]["Address"][0]
          } else {
            user.address = null
          }
          const decryptedPassword = await decryptPassword(user.password);
          return {
            ...user,
            service_types,
            // address,
            password: decryptedPassword,
          };
        };

        // Use Promise.all to decrypt passwords for all users in parallel
        decryptedUsers = await Promise.all(users.map(decryptUserPassword));

      }
      return sendResponse(
        res,
        200,
        {
          users: decryptedUsers,
          totalCount,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalCount / limitNumber),
        },
        "Users retrieved successfully"
      );
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, "Internal server error");
    }
  }),
  GetAllUserByAccountNo: asyncHandler(async (req, res) => {

    try {

      const { AccountNo = req?.user?.AccountNo } = req.query;
      let obj = {}
      if (AccountNo == "") {
        return sendResponse(res, 500, "Please Enter Account No");
      }
      else if (AccountNo !== "") {
        obj["AccountNo"] = AccountNo
      }


      // Aggregate pipeline
      const pipeline = [
        {
          $match: obj,
        },
        {
          $project: {
            full_name: 1,
            username: 1

          }
        },
        // Pagination
        { $sort: { createdAt: -1 } },
        // Sort by username in ascending order
      ];

      // Execute the aggregate query
      const users = await UserModel.aggregate(pipeline);

      // Check if users exist
      if (users.length === 0) {
        // Create a function to decrypt the password for a user
        return sendResponse(res, 404, null, "No users found");
      }
      return sendResponse(res, 200, users, "Users retrieved successfully")
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, "Internal server error");
    }
  }),
  // Get All Batch NUmber
  GetAllBatchNumber: asyncHandler(async (req, res) => {
    ////console.log("admin", req.user)
    const { page, limit, search = "", activate = "" } = req.query;

    try {
      let obj = {
        userId: req.user._id
      };
      let usercountObj = {
        userId: req.user._id
      }
      if (search !== "") {
        obj["BatchNumber"] = new RegExp(search, "i")
      }
      // Get total count of users
      const totalCount = await BatchNumberModel.countDocuments(usercountObj);
      console.log({ totalCount })
      // Convert page and limit to numbers
      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 10;
      // Calculate the skip value
      const skip = (pageNumber - 1) * limitNumber;
      // Aggregate pipeline
      const pipeline = [
        {
          $match: obj,
        },

        // Pagination
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNumber },
        // Sort by username in ascending order
      ];

      // Execute the aggregate query
      const users = await BatchNumberModel.aggregate(pipeline);
      console.log("users", users)
      // Check if users exist
      if (users.length === 0) {
        // Create a function to decrypt the password for a user

        return sendResponse(res, 404, null, "No Records Found");
      }

      // Return the paginated users

      return sendResponse(
        res,
        200,
        {
          Batchnumbers: users,
          totalCount,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalCount / limitNumber),
        },
        "Users retrieved successfully"
      );
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, "Internal server error");
    }
  }),
  exportUser: async (req, res) => {
    const workbook = new excelJS.Workbook(); // Create a new workbook
    const worksheet = workbook.addWorksheet("My Users"); // New Worksheet
    const path = "./files"; // Path to download excel
    // Column for data in excel. key must match data key
    worksheet.columns = [
      { header: "S no.", key: "s_no", width: 10 },
      { header: "Full Name", key: "full_name", width: 10 },
      { header: "Email Id", key: "email", width: 10 },
    ];
    // Looping through User data
    let counter = 1;
    User.forEach((user) => {
      user.s_no = counter;
      worksheet.addRow(user); // Add data in worksheet
      counter++;
    });
    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    try {
      const User = await UserModel.find({});
      const data = await workbook.xlsx
        .writeFile(`${path}/users.xlsx`)
        .then(() => {
          res.send({
            status: "success",
            message: "file successfully downloaded",
            path: `${path}/users.xlsx`,
          });
        });
    } catch (err) {
      res.send({
        status: "error",
        message: "Something went wrong",
      });
    }
  },
  GetAddressByUserid: async (req, res) => {
    try {
      const { _id } = req.user;
      const data = await AddressModel.findOne({ user: _id });
      return sendResponse(res, 200, data, "Address retrieved successfully");
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  },
  UpdateAddressByUserid: async (req, res) => {
    try {
      const { _id } = req.user;
      // Check if user exists
      const existingUser = await AddressModel.findOne({ user: _id });
      if (!existingUser) {
        return sendResponse(res, 404, "User not found");
      }
      let data = await AddressModel.findByIdAndUpdate(req.body._id, req.body, {
        new: true,
      });
      return sendResponse(res, 200, data, "User updated successfully");
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  },
};
