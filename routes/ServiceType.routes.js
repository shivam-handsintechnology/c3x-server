const Router = require("express").Router()
const ServiceTypeController = require("../controllers/ServiceTypes.controllers")
const { CheckAdminToken, Credentials_Verify } = require("../utils/AuthToken")
////console.log(CheckAdminToken)
Router.route("/").post(ServiceTypeController.addServiceType)
    .get(ServiceTypeController.searchServiceType).delete(ServiceTypeController.deleteServiceType).put(ServiceTypeController.updateServiceType)
module.exports = Router
Router.route("/servicetyprlist").post(ServiceTypeController.Add).delete(ServiceTypeController.Delete)
module.exports = Router