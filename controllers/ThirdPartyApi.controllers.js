const { axiosAPI } = require("../config/thirdPartyApi");
const BatchNumberModel = require("../models/BatchNumberModel");
const { sendResponse, errorHandler } = require("../utils/dataHandler");
const {
  validateTracking,
  ValidateBookingHistory,
  validatAirwayBillPDFFormat,
  validateDueInvoices,
  validatePrepaidAccountStatus,
  validateRateFinder,
  ValidateShipmentHistoryy,
  validateInvoiceNo,
  validateCountryAPi,
  validateCityListAPi,
  validatePickupSummaryForAccounts,
} = require("../utils/Validator");
const asyncHandler = require("express-async-handler");
module.exports = {
  Tracking: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      delete payload["AccountNo"];
      ////console.log(payload)
      let response = validateTracking(payload);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("Tracking", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            // const finddata = res.data.AirwayBillTrackList.find(item => !item.TrackingLogDetails)
            // ////console.log(">>>>>>finddta", finddata)
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  CountryMaster: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body

      delete payload["AccountNo"];
      if (req.query.Country) {
        payload["Country"] = req.query.Country, "BH"
      }
      else {
        payload["Country"] = "";
      }
      payload["State"] = "";
      console.log({ payload })
      await axiosAPI
        .post("CountryMaster", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  CityList: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      payload["State"] = "";
      ////console.log("payload", payload)
      await axiosAPI
        .post("CityList", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  TrackingBYRefrence: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      delete payload["AccountNo"];
      let response = validateTracking(payload);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("Trackbyreference", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
      // return sendResponse(res, 201, payload)
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  Trackbybooking: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      delete payload["AccountNo"];
      let response = validateTracking(payload);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("Trackbybooking", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
      // return sendResponse(res, 201, payload)
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  BookingHistory: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      let response = ValidateBookingHistory(payload);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("BookingHistory", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
      // return sendResponse(res, 201, payload)
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  PickupSummaryForAccounts: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      delete payload["AccountNo"];
      let response = validatePickupSummaryForAccounts(payload);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("PickupSummaryForAccounts", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            if (response.data.JasonString) {
              response.data.JasonString = JSON.parse(response.data.JasonString);
            }
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
      // return sendResponse(res, 201, payload)
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  AccountDayWiseShipments: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      delete payload["AccountNo"];
      let response = validatePickupSummaryForAccounts(payload);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("AccountDayWiseShipments", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            if (response.data.JasonString) {
              response.data.JasonString = JSON.parse(response.data.JasonString);
            }
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
      // return sendResponse(res, 201, payload)
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  DailyPickupDetailsForAccounts: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      delete payload["AccountNo"];
      let response = validatePickupSummaryForAccounts(payload);

      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("DailyPickupDetailsForAccounts", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            if (response.data.JasonString) {
              response.data.JasonString = JSON.parse(response.data.JasonString);
            }
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
      // return sendResponse(res, 201, payload)
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  DeliveryDetailsForAccounts: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      delete payload["AccountNo"];
      let response = validatePickupSummaryForAccounts(payload);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("DeliveryDetailsForAccounts", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            if (response.data.JasonString) {
              response.data.JasonString = JSON.parse(response.data.JasonString);
            }
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
      // return sendResponse(res, 201, payload)
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  CreateAirwayBill: asyncHandler(async (req, res, next) => {
    try {

      const payload = req.body;

      // let response = ValidateCreateAirwayBill(req.body)
      // if (response.error) {
      //     ////console.log(response.error)
      //     let ermessage = response.error.details.length > 0 && response.error.details[0].message ; throw new Error(ermessage)
      // }
      // else {
      // payload["AirwayBillData"]["NumberofPeices"] = +payload["AirwayBillData"]["NumberofPeices"]
      // delete payload["AccountNo"];
      //console.log(payload)
      if (payload["AirwayBillData"]["ProductType"] == "XPS") {
        if (payload["AirwayBillData"]["ShipmentInvoiceValue"] === "") {
          throw new Error("Shipment Invoice Value is required")
        }
      } else {
        delete payload["AirwayBillData"]["ShipmentInvoiceValue"]
      }
      if (payload["AirwayBillData"]["ServiceType"] !== "COD") {
        payload["AirwayBillData"]["CODAmount"] = 0
      }
      console.log("Payload", payload)
      await axiosAPI
        .post("CreateAirwayBill", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
      // return sendResponse(res, 201, payload)
      // }
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  MultipleCreateAirwayBill: asyncHandler(async (req, res, next) => {
    try {
      console.log(req.body)
      const BatchNumber = req.body.AccountNo + Date.now();
      const XLSX = require("xlsx");
      // Check if req.files contains the uploaded file(s)
      if (!req.files || Object.keys(req.files).length === 0) {
        throw new Error("No files were uploaded.")
      }

      // Assuming you have a file upload middleware that stores the uploaded Excel file in req.file.buffer
      const buffer = req.files.AirwayBill.data;
      // Parse the Excel file
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(sheet);
      if (!excelData || excelData.length === 0) {
        throw new Error("No data found in the uploaded Excel file.")
      }
      // Check if all required columns are present
      const requiredColumns = [
        'Shipper Name', 'Shipper Contact Person', 'Shipper Address1', 'Shipper Address2', 'Shipper City', 'Shipper Country', 'Shipper Telephone', 'Shipper Mobile', 'Shipper email', 'Consignee Company', 'Consignee Name', 'Consignee Address1', 'Consignee Address2', 'Consignee City', 'Consignee Phone', 'Consignee Mobile', 'Consignee Zip', 'Orgin', 'Dest', 'Pieces', 'Weight', 'Dimension', 'Product', 'Service', 'Special Inst', 'Description', 'DeclaredValue', 'invoicecurr', 'Shipper Reference'
      ];

      const columnHeaders = Object.keys(excelData[0]);

      for (const column of requiredColumns) {
        // console.log("column", column)

        if (!columnHeaders.includes(column)) {
          throw new Error(`Column "${column}" is missing in the Excel file.`)

        }
      }


      const promises = [];

      try {
        console.log("excelData", excelData)
        if (excelData.length > 100) {
          throw new Error("You can only upload 100 records at a time")
        }
        for (let data of excelData) {

          const payload = {
            AccountNo: req.body.AccountNo,
            BatchNumber: BatchNumber,
            ProductType: data["Product"] ? data["Product"] : "",
            "AirWayBillCreatedBy": req?.user.full_name ? "TEST USer" : req?.user.full_name,
            "CODAmount": data["COD Amount"] ? data["COD Amount"] : 0,
            "CODCurrency": data["COD Currency"] ? data["COD Currency"] : 0,
            "Destination": data["Dest"] ? data["Dest"] : "",
            "DutyConsigneePay": "0",
            "GoodsDescription": data["Description"] ? data["Description"] : "",
            "NumberofPeices": data["Pieces"] ? data["Pieces"] : "",
            "Origin": data["Orgin"] ? data["Orgin"] : "",
            "ReceiversAddress1": data["Consignee Address1"] ? data["Consignee Address1"] : "",
            "ReceiversAddress2": data["Consignee Address2"] ? data["Consignee Address2"] : "",
            "ReceiversCity": data["Consignee City"] ? data["Consignee City"] : "",
            "ReceiversSubCity": "",
            "ReceiversCountry": data["Consignee Country"] ? data["Consignee Country"] : "",
            "ReceiversCompany": data["Consignee Company"] ? data["Consignee Company"] : "",
            "ReceiversContactPerson": data["Consignee Name"] ? data["Consignee Name"] : "",
            "ReceiversEmail": "",
            "ReceiversGeoLocation": data["geol"] ? data["geol"] : "",
            "ReceiversMobile": data["Consignee Mobile"] ? data["Consignee Mobile"] : "",
            "ReceiversPhone": "",
            "ReceiversPinCode": data["Consignee Zip"] ? data["Consignee Zip"] : "",
            "ReceiversProvince": "",
            "SendersAddress1": data["Shipper Address1"] ? data["Shipper Address1"] : "",
            "SendersAddress2": data["Shipper Address2"] ? data["Shipper Address2"] : "",
            "SendersCity": data["Shipper City"] ? data["Shipper City"] : "",
            "SendersSubCity ": "",
            "SendersCountry": data["Shipper Country"] ? data["Shipper Country"] : "",
            "SendersCompany": data["Shipper Name"] ? data["Shipper Name"] : "",
            "SendersContactPerson": data["Shipper Contact Person"] ? data["Shipper Contact Person"] : "",
            "SendersEmail": data["Shipper email"] ? data["Shipper email"] : "",
            "SendersGeoLocation": "",
            "SendersMobile": data["Shipper Mobile"] ? data["Shipper Mobile"] : "",
            "SendersPhone": data["Shipper Telephone"] ? data["Shipper Telephone"] : "",
            "SendersPinCode": "",
            "ServiceType": data["Service"] ? data["Service"] : "",
            "ShipmentDimension": data["Dimension"] ? data["Dimension"] : "",
            "ShipmentInvoiceCurrency": data["invoicecurr"] ? data["invoicecurr"] : 0,
            "ShipmentInvoiceValue": data["DeclaredValue"] ? data["DeclaredValue"] : 0,
            "ShipperReference": data["Shipper Reference"] ? data["Shipper Reference"] : "",
            "ShipperVatAccount": "",
            "SpecialInstruction": data["Special Inst"] ? data["Special Inst"] : "",
            "Weight": data["Weight"] ? data["Weight"] : "",
          };
          await axiosAPI
            .post("AirwayBillBatchValidate", {
              "AirwayBillData": payload,
              ...req.body
            })
            .then(async (response) => {
              if (response.data.Code < 0) {
                throw new Error(response.data.Description);
              }

            })
            .catch((error) => {
              throw new Error(error.message)
            });
          promises.push(payload);
        }
        // Await for all data response
        await Promise.all(promises);
        console.log("payload", promises)
        let BulkAirwaybill = [];
        for (let data of promises) {
          await axiosAPI
            .post("CreateAirwayBill", {
              "AirwayBillData": data,
              ...req.body
            })
            .then(async (response) => {
              if (response.data.Code < 0) {
                throw new Error(response.data.Description);
              } else {
                BulkAirwaybill.push({ ...response.data, BatchNumber: BatchNumber });
                let checkBatchNumberexist = await BatchNumberModel.findOne({ BatchNumber: BatchNumber, userId: req.user._id });
                if (!checkBatchNumberexist) {
                  await BatchNumberModel.create({ BatchNumber: BatchNumber, userId: req.user._id });
                }


              }
            }
            ).catch((error) => {
              throw new Error(error.message)
            });
        }

        await Promise.all(BulkAirwaybill);
        return sendResponse(res, 201, { data: BulkAirwaybill, BatchNumber: BatchNumber, message: "Batch Number Created Successfully", });

      } catch (error) {
        console.log("error", error)
        return errorHandler(res, 500, error);
      }
      // }
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  AirwayBillBatchPDFFormat: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;

      if (!payload.AirwayBillNumber || payload.AirwayBillNumber === "") {
        throw new Error("Please Enter Airway Bill Number")
      }

      await axiosAPI
        .post("AirwayBillBatchPDFFormat", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  DueInvoices: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      console.log(payload)
      let response = validateDueInvoices(req.body);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("DueInvoices", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  PaymentDues: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      let response = validateDueInvoices(req.body);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("PaymentDues", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  PrepaidAccountStatus: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      let response = validatePrepaidAccountStatus(req.body);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("PrepaidAccountStatus", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  PrepaidPaymentHistory: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      let response = validatePrepaidAccountStatus(req.body);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("PrepaidPaymentHistory", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  RateFinder: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      let response = validateRateFinder(req.body);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("RateFinder", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  SchedulePickup: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      let ShipmentReadyDate = new Date(payload["BookingData"]["ShipmentReadyDate"])
      /*  this for testing
      let ShipmentReadyDate = new Date('2024-07-01')
      let currenttime = 17;
      */
      let currenttime = new Date().getHours();
      const isToday = ShipmentReadyDate.toDateString() === new Date().toDateString();

      let arraysplitdata = payload["BookingData"]["ShipmentReadyTime"].split("-")
      payload["BookingData"]["BusinessClosingTime"] = arraysplitdata[1] + ":00"
      payload["BookingData"]["ShipmentReadyTime"] = arraysplitdata[0] + ":00"

      console.log("isToday", isToday)
      console.log("currenttime", currenttime)
      if (isToday && currenttime >= 17) {
        throw new Error(`Pick Up Time Slot is Not Allowed between ${payload["BookingData"]["ShipmentReadyTime"]} to ${payload["BookingData"]["BusinessClosingTime"]}`)
      }
      // if (isToday && payload["BookingData"]["BusinessClosingTime"].includes('17')) {
      //   throw new Error(`Pick Up Time Slot is Not Allowed between ${payload["BookingData"]["ShipmentReadyTime"]} to ${payload["BookingData"]["BusinessClosingTime"]}`)
      // }
      // payload["BookingData"]["AccountNo"] = payload["AccountNo"]
      delete payload["AccountNo"];
      if (payload["BookingData"]["ProductType"] !== "DOX") {
        if (payload["BookingData"]["ShipmentInvoiceValue"] === "") {
          throw new Error("Shipment Invoice Value is required")
        }
      }

      //console.log(payload)
      await axiosAPI
        .post("SchedulePickup", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          ////console.log("error", error)
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  AsSchedulePickup: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      let ShipmentReadyDate = new Date(payload["BookingData"]["ShipmentReadyDate"])
      const isToday = ShipmentReadyDate.toDateString() === new Date().toDateString();
      let arraysplitdata = payload["BookingData"]["ShipmentReadyTime"].split("-")
      payload["BookingData"]["BusinessClosingTime"] = arraysplitdata[1] + ":00"
      payload["BookingData"]["ShipmentReadyTime"] = arraysplitdata[0] + ":00"
      let currenttime = new Date().getHours();
      if (isToday && currenttime >= 17) {
        throw new Error(`Pick Up Time Slot is Not Allowed between ${payload["BookingData"]["ShipmentReadyTime"]} to ${payload["BookingData"]["BusinessClosingTime"]}`)
      }
      payload["BookingData"]["AccountNo"] = payload["AccountNo"]
      delete payload["AccountNo"];
      if (payload["BookingData"]["ProductType"] !== "DOX") {
        if (payload["BookingData"]["ShipmentInvoiceValue"] === "") {
          throw new Error("Shipment Invoice Value is required")
        }
      }
      console.log(payload)

      await axiosAPI
        .post("SchedulePickup", payload)
        .then(async (response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {

            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          ////console.log("error", error)
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  ShipmentHistory: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      let response = ValidateShipmentHistoryy(req.body);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("ShipmentHistory", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  ShipmentHistorylength: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      let response = ValidateShipmentHistoryy(req.body);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("ShipmentHistory", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  VerifyAccount: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      let response = validatePrepaidAccountStatus(req.body);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }
      await axiosAPI
        .post("VerifyAccount", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  PrepaidAccountStatus: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      let response = validatePrepaidAccountStatus(req.body);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }
      await axiosAPI
        .post("PrepaidAccountStatus", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  InvoicePDFFormat: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      delete payload["AccountNo"];
      let response = validateInvoiceNo(payloady);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("InvoicePDFFormat", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
  AirwayBillPDFFormat: asyncHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      let response = validatAirwayBillPDFFormat(req.body);
      if (response.error) {
        ////console.log(response.error)
        let ermessage =
          response.error.details.length > 0 &&
          response.error.details[0].message;
        throw new Error(ermessage);
      }

      await axiosAPI
        .post("AirwayBillPDFFormat", payload)
        .then((response) => {
          if (response.data.Code < 0) {
            throw new Error(response.data.Description);
          } else {
            return sendResponse(res, 200, response.data);
          }
        })
        .catch((error) => {
          return errorHandler(res, 500, error);
        });
    } catch (error) {
      return errorHandler(res, 500, error);
    }
  }),
};
