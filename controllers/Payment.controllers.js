const { sendResponse, errorHandler } = require("../utils/dataHandler");
const UserModel = require("../models/userInfo");
const { validateUser } = require("../utils/Validator");
const asyncHandler = require("express-async-handler");
const sdk = require('api')('@telr-api/v1.0#f0vn439llhl0gkv');
module.exports = {
  Pay: asyncHandler(async (req,res) => {
    return new Promise(async (resolve, reject) => {
      try {
        const axios = require('axios');
        let data = JSON.stringify({
          "method": "create",
          "authkey": "HDC7X-PPrH#ZThfc",
          "store": "29540",
          "framed": 0,
          "order": {
            "cartid": Date.now(),
            "test": "1",
            "amount": req.body.PaidAmount,
            "currency": "AED",
            "description": "My purchase",
            "trantype": "string"
          },
          "return": {
            "authorised": req.headers.origin + "/ThankYou/authorised",
            "declined": req.headers.origin + "/ThankYou/declined",
            "cancelled": req.headers.origin + "/ThankYou/cancelled",
          }
        });
  
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://secure.telr.com/gateway/order.json',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          data: data
        };
  
        axios.request(config)
          .then((response) => {
            console.log(response.data);
            sendResponse(res, 200,  response.data)
          })
          .catch((error) => {
            console.log(error);
         errorHandler(res, 400, error)
          });
  
  
      } catch (error) {
        // return reject(error)
        errorHandler(res, 400, error)
      }
    }
    )
  }),

}