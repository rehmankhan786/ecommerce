const mongoose = require("mongoose");
const Router = require("express").Router();
const USER = require("../models/userModel");
const bcrypt = require("bcrypt");
// const userCtrl = require("../controller/userCtrl");
const  adminCtrl  = require("../controller/adminController");

Router.get("/users", adminCtrl.getAllUsers);
Router.post("/login", adminCtrl.login);
Router.post("/changepassword", adminCtrl.changePassword);
Router.post("/forgotpassword/:forgotToken", adminCtrl.changePassword);
Router.post("/forgotpassword", adminCtrl.forgotPassword);
Router.post("/updateprofile", adminCtrl.updateProfile);
Router.delete("/product/:productId", adminCtrl.deleteProduct);
Router.get("/products", adminCtrl.getProducts);
Router.delete("/user/:userId", adminCtrl.deleteUser);
Router.put("/user/:userId", adminCtrl.blockUser);

module.exports = Router;
