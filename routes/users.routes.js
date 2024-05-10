const Router = require("express").Router()
const UserController = require("../controllers/User.controllers")
const { verify_token } = require("../utils/AuthToken")
Router.post("/register", UserController.Register)
Router.post("/signin", UserController.SignIn)
Router.get("/dashboard", verify_token, UserController.Dashboard)
Router.get("/profile", verify_token, UserController.GetProfile)
Router.post("/address", verify_token, UserController.Adddress)
Router.put("/changepassword", verify_token, UserController.ChnagePassword)
module.exports = Router

// /api/auth/changepassword