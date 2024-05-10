const Router = require("express").Router()
const AddressController = require("../controllers/Address.controllers")

Router.route("/").post(AddressController.addAddress)
.get(AddressController.searchAddresses).delete(AddressController.deleteAddress).put(AddressController.updateAddress)
Router.route("/recieveraddress").post(AddressController.addRecieverAddress)
.get(AddressController.searchRecieverAddresses).delete(AddressController.deleteRecieverAddress).put(AddressController.updateRecieverAddress)

module.exports = Router