
const Router = require("express").Router()
const AdminController = require("../controllers/Admin.controllers")
Router.route("/").get(AdminController.GetAllUser)
    .post(AdminController.addUser).delete(AdminController.deleteUser)
    .put(AdminController.updateUser)
Router.put("/updateStatus", AdminController.updateStatus)
Router.get("/GetAllUserByAccountNo", AdminController.GetAllUserByAccountNo)
Router.route("/multiple").post(AdminController.addMultipleUsers)
Router.route("/address").get(AdminController.GetAddressByUserid).put(AdminController.UpdateAddressByUserid)
module.exports = Router