const { default: mongoose } = require("mongoose");
const ServiceTypeModel = require("../models/ServiceModel");
const MyServicetypesList = require("../models/MyServicetypesList");
const { sendResponse, errorHandler } = require("../utils/dataHandler");
const { validateServiceType } = require("../utils/Validator");

module.exports = {
  addServiceType: async (req, res) => {
    try {
      let response = validateServiceType(req.body);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }
      const existingAddress = await ServiceTypeModel.findOne(req.body);
      if (existingAddress) {
        return errorHandler(res, 409, "ServiceType already exists")
      } else {
        await ServiceTypeModel.create(req.body);
        return sendResponse(res, 200, { success: true }, "Success");
      }
    } catch (error) {
      ////console.log(error)
      return errorHandler(res, 500, error)
      return { success: false, error: error.message };
    }
  },
  updateServiceType: async (req, res) => {
    try {

      const result = await ServiceTypeModel.findOneAndUpdate(
        { '_id': req.body._id },
        {
          $set: req.body
        },
        { new: true }
      );

      return sendResponse(res, 200, result); // Send back the updated ServiceType
    } catch (error) {
      return errorHandler(res, error); // Make sure to pass the error to errorHandler
    }
  },

  deleteServiceType: async (req, res) => {
    try {
      if (req.query._id) {
        await ServiceTypeModel.findByIdAndDelete(req.query._id);
        return errorHandler(res, 200, "ServiceType deleted successfully")
      } else {
        throw new Error("Provide ServiceType id")
      }
    } catch (error) {
      return errorHandler(res, 500, error)
    }
  },
  searchServiceType: async (req, res) => {
    try {
      const { page, limit, search = "", activate = "" } = req.query;
      // Convert page and limit to numbers
      let usercountObj = {};
      if (activate !== "") {
        usercountObj.isActive = activate === "active" ? true : false
      }
      if (search !== "") {
        usercountObj["$or"] = [
          { title: new RegExp(search, "i") },
          { value: new RegExp(search, "i") },
        ];
      }
      const totalCount = await ServiceTypeModel.countDocuments(usercountObj);
      const pageNumber = totalCount > 10 ? parseInt(page) || 1 : 1;
      const limitNumber = parseInt(limit) || 10;
      // Calculate the skip value
      const skip = (pageNumber - 1) * limitNumber;
      const pipeline = []
      if (search !== "") {
        pipeline.push(
          {
            $match: { 'title': { $regex: search, $options: 'i' } }
            ,
          },
          // Pagination
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNumber },
        )
      } else {
        pipeline.push({ $match: {} },
          // Pagination
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNumber },
        )
      }

      const result = await ServiceTypeModel.aggregate(pipeline);
      ////console.log(result)
      return sendResponse(res, 200, {
        ServiceType: result,
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      });
    } catch (error) {
      ////console.log(error)
      return errorHandler(res, 500, error)
    }
  },
  activeServiceType: async (req, res) => {
    try {

      const pipeline = [
        { $match: { 'Active': true } },

      ];

      const result = await ServiceTypeModel.aggregate(pipeline);
      ////console.log(result)
      return sendResponse(res, 200, { ServiceType: result });
    } catch (error) {
      ////console.log(error)
      return errorHandler(res, 500, error)
    }
  },
  getServiceType: async (req, res) => {
    try {
      //console.log("req.user.Role", req.user.Role)
      let obj = {}
      if (req.user.Role === "User") {
        obj["userId"] = req.user._id
      }
      else if (req.user.Role === "SubUser") {
        obj["userId"] = req.user.SubuserId
      }
      const pipeline = [
        { $match: obj },
      ];
      //console.log({ obj })
      let result
      if (req.user.Role === "Admin") {
        result = await ServiceTypeModel.aggregate(pipeline);
      } else {
        result = await MyServicetypesList.aggregate(pipeline);
        if (result.length > 0) {
          result = await ServiceTypeModel.aggregate([
            { $match: { '_id': { $in: result[0].service_types } } },
          ]);
        }
      }
      //console.log(result)
      return sendResponse(res, 200, { ServiceType: result });
    } catch (error) {
      //console.log(error)
      return errorHandler(res, 500, error)
    }
  },
  Add: async (req, res) => {
    try {
      // Assuming req.body._id is an array of IDs
      const idsToAdd = req.body._id.map(id => new mongoose.Types.ObjectId(id));

      // Check if any of the service types already exist in the user's list
      const exist = await MyServicetypesList.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.body.userId),
            service_types: {
              $in: idsToAdd,
            },
          },
        },
      ]);

      //console.log("exist-----", exist);
      if (exist.length > 0) {
        return res.status(200).json({ result: exist });
      } else {
        // Add all unique IDs in req.body._id to the service_types list
        let data = await MyServicetypesList.findOneAndUpdate(
          { userId: req.body.userId },
          { $addToSet: { service_types: { $each: idsToAdd } } },
          { new: true } // Return the updated document
        );

        //console.log({ data });
        return res.status(200).json({ result: data });
      }
    } catch (error) {
      //console.log(error);
      return res.status(500).json(error.message);
    }
  },

  Delete: async (req, res) => {
    try {
      let data = await MyServicetypesList.findOneAndUpdate(
        req.body.userId,
        { $pull: { service_types: new mongoose.Types.ObjectId(req.query._id) } }
      );

      //console.log({ data });

      return res.status(200).json({ message: "Item removed successfully" });
    } catch (error) {
      //console.log(error);
      return res.status(500).json(error.message);
    }
  },
};
