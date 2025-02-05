const mongosose = require("mongoose");
const Router = require("express").Router();
const USER = require("../models/userModel");
const bcrypt = require("bcrypt");
const userCtrl = require("../controller/userCtrl");
const { auth, getUser, getUserData } = require("../middlewares/auth");

Router.post("/register", userCtrl.register);
Router.post("/login", userCtrl.login);
Router.put("/changepassword", userCtrl.changePassword);
Router.post("/forgotpassword/:forgotToken", userCtrl.changePassword);
Router.post("/forgotpassword", userCtrl.forgotPassword);
Router.post("/addtowishlist/:productId", userCtrl.addToWishlist);
Router.post("/addtocart/:productId", userCtrl.addToCart);
Router.post("/removefromwishlist/:productId", userCtrl.removeFromWishlist);
Router.get("/logout", userCtrl.logout);
Router.put("/updateprofile", userCtrl.updateProfile);
Router.delete("/deletemyaccount", auth,userCtrl.deleteAccount);
Router.get("/profile", userCtrl.getProfile);
Router.post("/updateCart",getUserData, userCtrl.updateCart);

module.exports = Router;
