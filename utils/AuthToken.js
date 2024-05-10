const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_ACCESS_SECRET;
const UserModel = require('../models/userInfo');
const { errorHandler } = require('./dataHandler');
const { decryptPassword } = require('../helpers/passwordencrypter');
const verify_token = async (req, res, next) => {
    try {

        let token = req.headers["authorization"];

        if (!token) {
            return errorHandler(res, 403, "Unaithorized")
        }
        token = token.split(" ")[1]
        let decode_token = jwt.verify(token, JWT_KEY)
        let current_user = await UserModel.findById(decode_token.id)
        req.user = current_user
        req.body["UserName"] = process.env.C3XUSERNAME
        req.body["Password"] = process.env.C3XPASSWORD
        // req.body["UserName"] = current_user["username"]
        // req.body["Password"] = await decryptPassword(current_user["password"])
        // req.body["AccountNo"] = current_user["AccountNo"]

        // req.body["AccountNo"] = "10002"
        // req.body["Country"] = "AE"
    } catch (error) {
        //console.log(error);
        if (error instanceof jwt.TokenExpiredError) {
            return errorHandler(res, 401, "Sesssion Expired")
        } else {
            return errorHandler(res, 401, "Unaithorized")
        }
    }
    return next();
}
const Credentials_Verify = async (req, res, next) => {
    try {
       
        req.body["UserName"] = process.env.C3XUSERNAME
        req.body["Password"] = process.env.C3XPASSWORD
        req.body["AccountNo"] =process.env.ACCOUNTNO
        // req.body["AccountNo"] = "10002"
        // req.body["Country"] = "AE"
    } catch (error) {
        ////console.log(error);
       
    }
    return next();
}
const Credentials_VerifyForSubUser = async (req, res, next) => {
    try {
        req.body["UserName"] = process.env.C3XUSERNAME
        req.body["Password"] = process.env.C3XPASSWORD
        // req.body["AccountNo"] = req.user.AccountNo
        // req.body["AccountNo"] = "10002"
        // req.body["Country"] = "AE"
    } catch (error) {
        ////console.log(error);
        if (error instanceof jwt.TokenExpiredError) {
            return errorHandler(res, 401, "Sesssion Expired")
        } else {
            return errorHandler(res, 401, "Unaithorized")
        }
    }
    return next();
}
const CheckAdminToken = async (req, res, next) => {
    try {
        let isUserApi = req.originalUrl.includes("/api/users")
        let token = req.headers["authorization"];
        ////console.log({ token })
        if (!token) {
            return errorHandler(res, 403, "Unaithorized")
        }
        token = token.split(" ")[1]
        let decode_token = jwt.verify(token, JWT_KEY)
        let current_user = await UserModel.findById(decode_token.id)
        req.user = current_user
        //console.log({current_user})
        if (current_user.Role === "Admin") {
            next()
            // return errorHandler(res, 403, "Unaithorized")
        } else if (current_user.Role === "User" && current_user.dashboard.Manage_Sub_Users && isUserApi) {
            next()
        } else {
            return errorHandler(res, 403, "Unaithorized")
        }
    } catch (error) {
        ////console.log(error);
        if (error instanceof jwt.TokenExpiredError) {
            return errorHandler(res, 401, "Sesssion Expired")
        } else {
            return errorHandler(res, 401, "Unaithorized")
        }
    }

}
const CheckManageSubusers = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];
        ////console.log({ token })
        if (!token) {
            return errorHandler(res, 403, "Unaithorized")
        }
        token = token.split(" ")[1]
        let decode_token = jwt.verify(token, JWT_KEY)
        let current_user = await UserModel.findById(decode_token.id)
        req.user = current_user
        ////console.log({ current_user, url: req.originalUrl })
        if (!current_user.isAdmin && current_user.user.dashboard.Manage_Sub_Users) {
            next()
        }
        else if (!current_user.isAdmin && !current_user.user.dashboard.Manage_Sub_Users) {
            return errorHandler(res, 403, "Unaithorized")
        }
    } catch (error) {
        ////console.log(error);
        if (error instanceof jwt.TokenExpiredError) {
            return errorHandler(res, 401, "Sesssion Expired")
        } else {
            return errorHandler(res, 401, "Unaithorized")
        }
    }
    return next();
}

module.exports = { verify_token, CheckAdminToken, Credentials_Verify, CheckManageSubusers }