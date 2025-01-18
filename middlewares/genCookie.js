const secretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const genCookie = async (userData) => {
  const { email } = userData;
  const userCookie = await jwt.sign(email, secretKey);
  return userCookie;
};
module.exports = {genCookie,secretKey};
