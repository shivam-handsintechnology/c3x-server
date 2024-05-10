const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// generateToken function
const accessToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRE,
    }
  );
  return token;
};


module.exports = {
  accessToken,
};
