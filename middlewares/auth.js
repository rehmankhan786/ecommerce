const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { secretKey } = require("./genCookie");

const getUser = async (email) => {
  const user = await userModel.findOne({ email });
  try {
    if (user) {
      // req.userData = user
      return user;
    }
  } catch (error) {
    console.log("ERROR:----", error);
  }
};
const getUserData = async (req,res,next) => {

const token = req.cookies.ecom_cookies;
const email = jwt.verify(token, secretKey)


  const user = await userModel.findOne({ email });
  try {
    if (user) {
      req.user = user
      // return user;
      next()
    }
  } catch (error) {
    console.log("ERROR:----", error);
  }
};
const isAdmin = async (req,res,next) => {
  const token = req.cookies.ecom_cookies;
  console.log(token)
  const email = await jwt.verify(token,secretKey);
  console.log(email)

  const user = await userModel.findOne({ email });
  try {
    if (user) {
      // req.user = user
      next()
    }
  } catch (error) {
    console.log("ERROR:----", error);
  }
};

const auth = async (req, res, next) => {
  var verifiedUser = await jwt.verify(req.cookies.ecom_cookies, secretKey);
  //   console.log(verifiedUser)
  //   verifiedUser = JSON.stringify(verifiedUser)
  const user = await getUser(verifiedUser);

  if (user) {
    if (user.blockStatus == false) {
      next();
    } else {
      return res
        .status(401)
        .json({
          success: false,
          message: "You are unAuthorized please contact Admin",
        });
    }
  } else {
    res
      .status(400)
      .json({ success: false, msg: "Only logged Admin has access of it." });
  }
};
const authenticateToken = async (req, res, next) => {
  const token = req.cookies.ecom_cookies; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Decode the token
    const user = await userModel.findOne({ email: decoded }); // Fetch user using the email in token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user; // Attach user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token', error });
  }
};

// module.exports = authenticateToken;
module.exports = { auth, getUser,getUserData,authenticateToken,isAdmin };
