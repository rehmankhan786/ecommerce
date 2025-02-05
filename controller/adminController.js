const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const USER = require("../models/userModel");
const { genCookie, secretKey } = require("../middlewares/genCookie");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const frontEnd = "http://localhost:4000";
const jwt = require("jsonwebtoken");
const productModel = require("../models/productModel");

const adminCtrl = {
  getAllUsers: async (req, res) => {
    const adminCookie = req.cookies.ecom_cookies;
    const adminEmail =await jwt.verify(adminCookie, secretKey);
    const admin = await userModel.findOne({ email: adminEmail });
    if (admin.isAdmin == 1) {
      const users = await userModel.find({});
      return res.status(200).json({ success: true, message: "", users });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "You are not Authorized Admin." });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await USER.findOne({ email });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        const usercookie = await genCookie(user);
        return res
          .status(200)
          .cookie("ecom_cookies", usercookie, {
            httpOnly: true,
            sameSite: false,
            secure: true,
            expired: "720h",
          })
          .json(user);
      } else {
        return res.json({ msg: "invalid credentials", success: false });
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
      const { email, password, oldpassword } = req.body;
      const user = await USER.findOne({ email });
      const isPasswordMatch = await bcrypt.compare(oldpassword, user.password);
      if (isPasswordMatch) {
        user.password = bcrypt.hash(password, 12);
        await user.save();
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

      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: "rehmam_Ecom", // sender address
          to: userEmail, // list of receivers
          subject: "To for get password", // Subject line
          text: `It seems like oyu forgot your password`, // plain text body
          html: `<a>${frontEnd}/forgotpassword/${encryptEmail}</a>`, // html body
        });

        // console.log("Message sent: ", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
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
  getProfile: async (req, res) => {
    const { email } = req.body;
    const user = await USER.findOne({ email });
    if (user) {
      return res.status(200).json(user);
    } else {
      return res
        .status(404)
        .json({ msg: "user doesn't exists", success: false });
    }
  },
  deleteProduct: async (req, res) => {
    const productId = req.params.productId;
    // console.log(`product id:- ${productId} has been deleted`)
    const product = await productModel.findOneAndDelete({ _id: productId });
    return res
      .status(200)
      .json({
        success: true,
        message: `Product ${product.productName} has been deleted`,
        product,
      });
  },
  deleteUser: async (req, res) => {
    const userId = req.params.userId;
    const user = await userModel.findOneAndDelete({ _id: userId });
    return res
      .status(200)
      .json({
        success: true,
        message: `User ${product.productName} has been deleted`,
        user,
      });
  },
  blockUser: async (req, res) => {
    const userId = req.params.userId;
    // console.log(userId)
    const user = await userModel.findOne({ _id: userId });
    user.blockStatus = !user.blockStatus;
    // console.log(user.blockStatus)
    await user.save();
    return res.status(200).json({success:true,message:user.blockStatus,user})
  },
  getProducts: async (req, res) => {
    try {
      const adminCookie = req.cookies.ecom_cookies;
      const adminEmail = await jwt.verify(adminCookie, secretKey);
      const admin = await userModel.findOne({ email: adminEmail });

      if (admin && admin.isAdmin === 1) {
        const products = await productModel.find({}); // Fetch all products
        return res.status(200).json({
          success: true,
          message: "Products fetched successfully",
          products,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "You are not an authorized admin.",
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching products.",
      });
    }
  },
  addCategory: async (req, res) => {
    const adminCookie = req.cookies.ecom_cookies;
    const adminEmail = await jwt.verify(adminCookie, secretKey);
    const admin = await userModel.findOne({ email: adminEmail });

    if (admin && admin.isAdmin === 1) {
      const { name, description } = req.body;

      try {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
          return res.status(400).json({
            success: false,
            message: "Category already exists",
          });
        }

        const newCategory = new Category({ name, description });
        await newCategory.save();
        return res.status(201).json({
          success: true,
          message: "Category added successfully",
          category: newCategory,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "An error occurred while adding the category",
        });
      }
    } else {
      return res
        .status(401)
        .json({ success: false, message: "You are not an authorized admin." });
    }
  },

};

module.exports = adminCtrl;
