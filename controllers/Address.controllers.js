const { default: mongoose } = require("mongoose");
const AddressModel = require("../models/AddressModel");
const AddressRecieversModel = require("../models/AddressRecieversModel");
const { sendResponse, errorHandler } = require("../utils/dataHandler");
const { validateAddressModel } = require("../utils/Validator");
const UserInfo = require("../models/userInfo");

module.exports = {
  addAddress: async (req, res) => {
    try {
      let response = validateAddressModel(req.body);
      if (response.error) {
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }
      const existingAddress = await AddressModel.findOne({ userId: req.user._id });
      if (existingAddress) {
        await existingAddress.Address.push(req.body),
          await existingAddress.save()
        return sendResponse(res, 200, { success: true }, "update");
      } else {
        await AddressModel.create({
          Address: [req.body],
          userId: req.user._id
        });
        return sendResponse(res, 200, { success: true }, "Success");
      }
    } catch (error) {
      ////console.log(error)
      return errorHandler(res, 500, error.message)

    }
  },
  updateAddress: async (req, res) => {
    try {
      let result
      req.body.createdAt = Date.now()
      // Check if the 'Active' field is set to true in the request body

      if (req.body.hasOwnProperty("Active")) {
        // Step 1: Set all addresses for this user to 'Active: false'
        await AddressModel.updateMany(
          { userId: req.user._id },
          { $set: { 'Address.$[].Active': false } },
          { multi: true }
        );
        result = await AddressModel.findOneAndUpdate(
          { userId: req.user._id, 'Address._id': req.body._id },
          { $set: { 'Address.$.Active': req.body.Active, 'Address.$.createdAt': Date.now(), } },
          { new: true } // To get the updated document as the result
        );
      } else {
        result = await AddressModel.findOneAndUpdate(
          { userId: req.user._id, 'Address._id': req.body._id },
          { $set: { 'Address.$': req.body, } },
          { new: true } // To get the updated document as the result
        );
      }
      return sendResponse(res, 200, result); // Send back the updated address
    } catch (error) {
      //console.log(error)
      return errorHandler(res, 500, error); // Handle any errors and send an error response
    }
  },


  deleteAddress: async (req, res) => {
    try {
      if (req.query._id) {

        await AddressModel.findOneAndUpdate(
          { userId: req.user._id, 'Address._id': req.query._id },
          {
            $pull: { Address: { _id: req.query._id } }
          },
          { new: true }
        );
        let existAddressUsermodel = await UserInfo.findOne({ address: req.query._id })
        await UserInfo.findByIdAndUpdate(req.user._id, { address: null })
      } else {
        throw new Error("Provide address id")
      }
      return sendResponse(res, 200);
    } catch (error) {
      return errorHandler(res, 500, error)
    }
  },

  searchAddresses: async (req, res) => {
    try {
      const { page, limit, search = "" } = req.query;
      // Convert page and limit to numbers


      const pipeline = [];

      if (search !== "") {
        pipeline.push(
          { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } }, // Initial match for userId
          { $unwind: '$Address' }, // Unwind the Address array
          { $sort: { 'Address.createdAt': -1 } }, // Sort the unwound addresses by createdAt
          {
            $match: {
              $or: [
                { 'Address.title': new RegExp(search, 'i') },
                { 'Address.company_name': new RegExp(search, 'i') },
                { 'Address.City': new RegExp(search, 'i') },
                { 'Address.ZipCode': new RegExp(search, 'i') },
              ]
            }
          }, // Match the search string
          // Group the results back together
          {
            $group: {
              _id: '$_id',
              userId: { $first: '$userId' },
              Address: { $push: '$Address' },
              // Include other fields from the original document if necessary
            }
          },
          {
            $project: {
              Address: 1, // Include other fields as needed
              totalItems: { $size: "$Address" } // Add total items count
            }
          }
        );
      } else {
        pipeline.push(
          { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
          { $unwind: '$Address' }, // Unwind the Address array
          { $sort: { 'Address.createdAt': -1 } }, // Sort the unwound addresses by createdAt
          // Group the results back together
          {
            $group: {
              _id: '$_id',
              userId: { $first: '$userId' },
              Address: { $push: '$Address' },
              // Include other fields from the original document if necessary
            }
          },
          {
            $project: {
              Address: 1, // Include other fields as needed
              totalItems: { $size: "$Address" } // Add total items count
            }
          }
        );
      }

      const result = await AddressModel.aggregate(pipeline);
      ////console.log(result);

      if (result.length > 0) {
        const pageNumber = result.length > 10 ? parseInt(page) || 1 : 1;
        const limitNumber = parseInt(limit) || 2;

        // Calculate the skip value
        const skip = (pageNumber - 1) * limitNumber;
        ////console.log("totalpages", Math.ceil(result[0].totalItems / limitNumber));
        let data = {
          totalpages: Math.ceil(result[0].totalItems / limitNumber),
          totalItems: result[0].totalItems,
          Address: result[0].Address.slice(skip, skip + limitNumber) // Use $slice here for pagination
        };

        return sendResponse(res, 200, data);
      } else {
        let data = {
          totalpages: 0,
          totalItems: 0,
          Address: []
        };
        return sendResponse(res, 200, data);
      }
    } catch (error) {
      ////console.log(error);
      return errorHandler(res, 500, error);
    }
  },
  addRecieverAddress: async (req, res) => {
    try {
      // Find the existing address for the user
      const existingAddress = await AddressRecieversModel.findOne({ userId: req.user._id });

      if (existingAddress) {
        if (req.body._id) {
          // Update the existing receiver's address if it matches the provided email
          const updatedAddress = await AddressRecieversModel.findOneAndUpdate(
            { userId: req.user._id, 'AddressRecievers._id': req.body._id },
            { $set: { 'AddressRecievers.$': req.body } },
            { new: true } // To get the updated document as the result
          );

          if (!updatedAddress) {
            // If no address was updated, push the new address to the array
            existingAddress.AddressRecievers.push(req.body);
            await existingAddress.save();
          }
          return sendResponse(res, 200, { success: true }, "Update successful");
        }
        else if (req.body.ReceiversEmail && req.body.ReceiversEmail !== "") {
          // Update the existing receiver's address if it matches the provided email
          const updatedAddress = await AddressRecieversModel.findOneAndUpdate(
            { userId: req.user._id, 'AddressRecievers.ReceiversEmail': req.body.ReceiversEmail },
            { $set: { 'AddressRecievers.$': req.body } },
            { new: true } // To get the updated document as the result
          );

          if (!updatedAddress) {
            // If no address was updated, push the new address to the array
            existingAddress.AddressRecievers.push(req.body);
            await existingAddress.save();
          }
          return sendResponse(res, 200, { success: true }, "Update successful");
        } else {
          // If no receiver email is provided, push the new address
          existingAddress.AddressRecievers.push(req.body);
          await existingAddress.save();
          return sendResponse(res, 200, { success: true }, "Update successful");
        }
      } else {
        // If no existing address, create a new one
        await AddressRecieversModel.create({
          AddressRecievers: [req.body],
          userId: req.user._id
        });
        return sendResponse(res, 200, { success: true }, "Creation successful");
      }
    } catch (error) {
      return errorHandler(res, 500, error.message);
    }
  },

  updateRecieverAddress: async (req, res) => {
    try {
      let result
      req.body.createdAt = Date.now()
      // Check if the 'Active' field is set to true in the request body


      result = await AddressRecieversModel.findOneAndUpdate(
        { userId: req.user._id, 'AddressRecievers._id': req.body._id },
        { $set: { 'AddressRecievers.$': req.body, } },
        { new: true } // To get the updated document as the result
      );

      return sendResponse(res, 200, result); // Send back the updated address
    } catch (error) {
      //console.log(error)
      return errorHandler(res, 500, error); // Handle any errors and send an error response
    }
  },


  deleteRecieverAddress: async (req, res) => {
    try {
      if (req.query._id) {
        await AddressRecieversModel.findOneAndUpdate(
          { userId: req.user._id, 'AddressRecievers._id': req.query._id },
          {
            $pull: { AddressRecievers: { _id: req.query._id } }
          },
          { new: true }
        );
      } else {
        throw new Error("Provide address id")
      }
      return sendResponse(res, 200);
    } catch (error) {
      return errorHandler(res, 500, error)
    }
  },

  searchRecieverAddresses: async (req, res) => {
    try {
      const { page, limit, search = "" } = req.query;
      // Convert page and limit to numbers
      console.log("user id ", req.user._id)
      const pipeline = [];

      if (search !== "") {
        pipeline.push(
          { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } }, // Initial match for userId
          { $unwind: '$AddressRecievers' }, // Unwind the Address array
          { $sort: { 'AddressRecievers.createdAt': -1 } }, // Sort the unwound addresses by createdAt
          {
            $match: {
              $or: [
                { 'Address.company_name': new RegExp(search, 'i') },
                { 'Address.City': new RegExp(search, 'i') },
                { 'Address.ZipCode': new RegExp(search, 'i') },
              ]
            }
          }, // Match the search string
          // Group the results back together
          {
            $group: {
              _id: '$_id',
              userId: { $first: '$userId' },
              Address: { $push: '$AddressRecievers' },
              // Include other fields from the original document if necessary
            }
          },
          {
            $project: {
              Address: 1, // Include other fields as needed
              totalItems: { $size: "$AddressRecievers" } // Add total items count
            }
          }
        );
      } else {
        pipeline.push(
          { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
          { $unwind: '$AddressRecievers' }, // Unwind the Address array
          { $sort: { 'AddressRecievers.createdAt': -1 } }, // Sort the unwound addresses by createdAt
          // Group the results back together
          {
            $group: {
              _id: '$_id',
              userId: { $first: '$userId' },
              AddressRecievers: { $push: '$AddressRecievers' },
              // Include other fields from the original document if necessary
            }
          },
          {
            $project: {
              AddressRecievers: 1, // Include other fields as needed
              totalItems: { $size: "$AddressRecievers" } // Add total items count
            }
          }
        );
      }

      const result = await AddressRecieversModel.aggregate(pipeline);
      //console.log(result);

      if (result.length > 0) {
        const pageNumber = result.length > 10 ? parseInt(page) || 1 : 1;
        const limitNumber = parseInt(limit) || 2;

        // Calculate the skip value
        const skip = (pageNumber - 1) * limitNumber;
        ////console.log("totalpages", Math.ceil(result[0].totalItems / limitNumber));
        let data = {
          totalpages: Math.ceil(result[0].totalItems / limitNumber),
          totalItems: result[0].totalItems,
          Address: result[0].AddressRecievers.slice(skip, skip + limitNumber) // Use $slice here for pagination
        };

        return sendResponse(res, 200, data);
      } else {
        let data = {
          totalpages: 0,
          totalItems: 0,
          Address: []
        };
        return sendResponse(res, 200, data);
      }
    } catch (error) {
      //console.log(error);
      return errorHandler(res, 500, error);
    }
  },
};
