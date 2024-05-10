// external modules
const express = require("express");
var history = require('connect-history-api-fallback');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require("dotenv");
const path = require('path');
const fileUpload = require('express-fileupload');
// internal modules
const apiRoutes = require("./routes")
const connectDB = require("./config/db.config");
// defining cors format
const corsConfig = {
  origin: true,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
// app setup
const app = express();
dotenv.config();
// app configuration
// File Upload
app.use(fileUpload());
app.use(morgan('tiny'));
// adding Helmet to enhance your API's security
app.use(helmet());
// Set EJS as templating engine 
app.set('view engine', 'ejs');
// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use("/static", express.static(path.join(__dirname, 'public')));
app.use("/api", apiRoutes);
// Define a route for the welcome page
app.get('/', (req, res) => {
  // Render the welcome page (views/welcome.ejs)
  res.render('welcome', { message: 'Welcome to  Express.js app!' });
});
app.all('*', (req, res) => {
  // Render the welcome page (views/welcome.ejs)
  res.status(404).render('404', { message: 'requested Method Not FOund' });
});
// server configuration
connectDB();
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
// Update All user Set Address Model First Address Array id in all user model according to userid 
// const UserInfo = require("./models/userInfo");
// const AddressModel = require("./models/AddressModel");
// const updateAddress = async () => {
//   const allUsers = await UserInfo.find();
//   for (let i = 0; i < allUsers.length; i++) {
//     const user = allUsers[i];
//     const address = await AddressModel.findOne({ userId: user._id });
//     if (address) {
//       if (address.Address.length > 0) {
//         user.address = address.Address[0]._id;
//       } else {

//       }
//       await user.save();
//     }
//   }
// }
// updateAddress()

