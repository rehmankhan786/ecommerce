const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const USER = require("../models/userModel");
const { genCookie, secretKey } = require("../middlewares/genCookie");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const frontEnd = "http://localhost:4000";
const jwt = require("jsonwebtoken");
const productModel = require("../models/productModel");

const userCtrl = {
  register: async (req, res) => {
    // console.log(req.body);
    const { email, password, contact, country, username } = req.body;
    // console.log(email);
    const isUserExists = await USER.findOne({ email });
    if (isUserExists) {
      // console.log(isUserExists);
      return res
        .status(401)
        .json({ msg: "User Already Exists", success: false });
    } else {
      let hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new USER({
        email,
        password: hashedPassword,
        contact,
        country,
        username,
      });
      await newUser.save();
      return res.status(200).json({ msg: "User Created Successfully" });
    }
  },
  login: async (req, res) => {
    // console.log(req.body.email);
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      // console.log(user);
      if (isPasswordMatch) {
        if (user.blockStatus === false) {
          const usercookie = await genCookie(user);
          const cart = user.cart;
          const wish = user.wishlist;
          cart.forEach(async (product, idx) => {
            // console.log(product)
            const prodId = product._id;
            const findRes = await productModel.findOne({ _id: prodId });
            if (findRes === null) {
              cart.splice(idx, 1);
              user.cart = cart;
            }
          });
          wish.forEach(async (product, idx) => {
            // console.log(product)
            const prodId = product._id;
            const findRes = await productModel.findOne({ _id: prodId });

            if (findRes === null) {
              wish.splice(idx, 1);
              user.wishlist = wish;
              // console.log(wish)
            }
          });
          setTimeout(async () => {
            await user.save();
          }, 2000);

          setTimeout(async () => {
            await user.save();
          }, 1500);
          return res
            .status(200)
            .cookie("ecom_cookies", usercookie, {
              httpOnly: true,
              sameSite: "none",
              secure: true,
              expires: new Date(Date.now() + 20 * 60 * 60 * 1000),
            })
            .json({ msg: "logged in successfully", user });
        } else {
          return res.status(401).json({
            success: false,
            msg: "You have been blocked by admin ,please Contact Admin",
          });
        }
      } else {
        return res
          .status(401)
          .json({ msg: "invalid credentials", success: false });
      }
    } else {
      return res.json({ msg: "invalid credentials", success: false });
    }
  },
  changePassword: async (req, res) => {
    const Token = req.params.forgotToken;
    const { newpassword } = req.body;
    if (Token) {
      try {
        const forgotToken = jwt.verify(Token, secretKey);
        let user = await userModel.findOne({ email: forgotToken });

        if (user) {
          user.password = bcrypt.hashSync(newpassword, 12);
          user.forgotPasswordToken = "";
          await user.save();
          return res
            .status(200)
            .json({ message: "Password changed successfully", success: true });
        } else {
          return res
            .status(401)
            .json({ message: "invalid token", success: false });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: "Some error Occured because of you",
          success: false,
        });
      }
    } else {
      const {
        email,
        passwordData: { oldPassword, newPassword, confirmPassword },
      } = req.body;

      // console.log(req.body);
      // console.log(oldPassword, newPassword);
      const user = await userModel.findOne({ email });
      // console.log(user)

      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (isPasswordMatch) {
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();
        return res
          .status(200)
          .json({ success: true, message: "Password changed Successfully" });
      } else {
        return res
          .status(401)
          .json({ message: "old password is not matched." });
      }
    }
  },
  forgotPassword: async (req, res, next) => {
    const userEmail = req.body.email;
    const user = await userModel.findOne({ email: userEmail });
    if (user) {
      const encryptEmail = jwt.sign(user.email, secretKey);
      user.forgotPasswordToken = encryptEmail;
      await user.save();

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "arkhan434@gmail.com",
          pass: "timetodie",
        },
      });

      async function main() {
        const info = await transporter.sendMail({
          from: "rehmam_Ecom", // sender address
          to: userEmail, // list of receivers
          subject: "To for get password", // Subject line
          text: `It seems like oyu forgot your password`, // plain text body
          html: `<a>${frontEnd}/forgotpassword/${encryptEmail}</a>`, // html body
        });

        // console.log("Message sent: ", info.messageId);
      }
      main().catch(console.error);
      return res.cookie("forgotPasswordCookie", encryptEmail);
    } else {
      return res.status(409).json({ message: "User Doesn't Exists." });
    }
  },
  updateProfile: async (req, res) => {
    const { password, contact, country, name } = req.body;
    const user = await USER.findOne({ email });
    if (user) {
      user.password = password;
      user.contact = contact;
      user.country = country;
      user.name = name;
      user.email = email;
      await user.save();
    }
  },
  getData: async (req, res) => {
    const { email } = req.body;
    const user = await USER.findOne({ email });
    if (user) {
      return res.json(user);
    } else {
      return res
        .status(404)
        .json({ msg: "user doesn't exists", success: false });
    }
  },
  getProfile: async (req, res) => {
    try {
      const token = req.cookies.ecom_cookies;
      if (token) {
        const verifiedToken = jwt.verify(token, secretKey);

        const user = await USER.findOne({ email: verifiedToken });
        // console.log(user);
        if (user) {
          return res.status(200).json(user);
        } else {
          return res
            .status(404)
            .json({ msg: "user doesn't exists", success: false });
        }
      } else {
        return res.status(401).json({ msg: "Log in first", success: false });
        // res.status(200)
      }
    } catch (error) {
      return res.status(401).json({ msg: "Log in first", success: false });
    }
  },
  deleteAccount: async (req, res) => {
    const userCookie = req.cookie.ecom_cookies;
    const email = jwt.verify(userCookie, secretKey);
    const user = await userModel.findOneAndDelete({ email });
    return res.status(200).json({
      success: true,
      message:
        "we are so Sorry ! for being not compatible to you. Your account has been deleted.",
      user,
    });
  },
  addToWishlist: async (req, res) => {
    const token = req.cookies.ecom_cookies;
    const productId = req.params.productId;
    // console.log(req.params)
    // console.log("Request Body:", req.body);

    if (!token) {
      return res.status(401).json({ message: "Login First" });
    }
    try {
      // Verify token and extract user email
      const decodedToken = jwt.verify(token, secretKey);
      const userEmail = decodedToken;
      // console.log(userEmail)

      // Find the user by email
      const user = await userModel.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the product is already in the wishlist
      const isProductInWishlist = user.wishlist.some(
        (item) => item._id.toString() === productId.toString()
      );
      // console.log(isProductInWishlist)

      if (isProductInWishlist) {
        return res
          .status(400)
          .json({ message: "Product is already in your wishlist" });
      } else {
        // Add the product to the wishlist
        // console.log(user.wishlist)
        user.wishlist.push({ _id: productId }); // Assuming you are using an ObjectId
        // console.log(user.wishlist)
        // console.log(user)
        await user.save();
        return res.status(200).json({ message: "Item added to wishlist" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },
  addToCart: async (req, res) => {
    const token = req.cookies.ecom_cookies;
    // console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Login First" });
    }
    try {
      // Verify token and extract user email
      const decodedToken = jwt.verify(token, secretKey);
      const userEmail = decodedToken;

      // Find the user by email
      const user = await userModel.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const productId = req.params.productId;

      // Check if the product is already in the wishlist
      const isProductInCart = user.cart.some(
        (item) => item._id.toString() === productId.toString()
      );
      // console.log(isProductInCart)

      if (isProductInCart) {
        return res
          .status(400)
          .json({ message: "Product is already in your cart" });
      } else {
        // Add the product to the wishlist
        user.cart.push({ _id: productId }); // Assuming you are using an ObjectId
        await user.save();
        return res.status(200).json({ message: "Item added to Cart" });
      }
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  logout: async (req, res) => {
    return res
      .clearCookie("ecom_cookies", {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
      })
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  },
  removeFromWishlist: async (req, res) => {
    // console.log("Call  - - removeFromWishlist");
    const token = req.cookies.ecom_cookies; // Retrieve the JWT token from cookies
    const productId = req.params.productId; // Get the product ID from request parameters

    try {
      // Verify and decode the token
      const decodedToken = jwt.verify(token, secretKey);

      // Find the user by their email
      const user = await userModel.findOne({ email: decodedToken });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // console.log(user);
      let wishlist = user.wishlist;
      // Find the index of the product to remove
      const itemIndex = wishlist.findIndex((item, idx) => {
        // item._id == productId;
        // console.log(item._id);
        // console.log(productId);
        if (item._id == productId) {
          // console.log("helo");
          return item;
        }
      });
      // console.log(itemIndex)
      // console.log(itemIndex);
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in wishlist" });
      }

      // Remove the item from the wishlist
      user.wishlist.splice(itemIndex, 1);

      // console.log(wishlist);
      // user.wishlist = wishlist;

      // Save the updated user document
      // console.log(splishedList)
      // console.log(user.wishlist);
      await user.save();

      return res.status(200).json({
        message: "Item removed from wishlist successfully",
        wishlist: user.wishlist,
      });
    } catch (error) {
      console.log("Error removing item from wishlist:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  },
  updateCart: async (req, res) => {
    // console.log(req.body)
    // console.log("Started-------------------");
    let { productId, quantity } = req.body;
    let { email } = req.user;
    // console.log(req.user)
    const userData = await userModel.findOne({ email });

    // console.log(req.userData.cart)
    // console.log("hello")
    let userCart = req.user.cart;
    userCart.forEach((item,idx) => {
      item.productQuantity += quantity;
      if(item.productQuantity==0){
        userCart.splice(idx,1)
      }
    });
    userData.cart = userCart;
    await userData.save();
    // console.log(userCart);

    return res.status(200).json({success:true, msg: "cart updated" });
  },
};

module.exports = userCtrl;
