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
// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
// adding morgan to log HTTP requests
// routes 
// app.use(require("./helpers/detectandtransformdate"))
app.use("/api", apiRoutes);
// server configuration
connectDB();
app.listen(process.env.PORT, () => {
  //////console.log(`Server running on port ${process.env.PORT}`);
});
