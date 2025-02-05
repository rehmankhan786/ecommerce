const mongoose = require("mongoose");
const Router = require("express").Router();
const USER = require("../models/userModel");
const bcrypt = require("bcrypt");
// const userCtrl = require("../controller/userCtrl");
const  adminCtrl  = require("../controller/adminController");
const { isAdmin } = require("../middlewares/auth");

Router.get("/users", isAdmin,adminCtrl.getAllUsers);
Router.post("/login", adminCtrl.login);
Router.post("/changepassword", isAdmin, adminCtrl.changePassword);
Router.post("/forgotpassword/:forgotToken", adminCtrl.changePassword);
Router.post("/forgotpassword", adminCtrl.forgotPassword);
Router.post("/updateprofile", isAdmin, adminCtrl.updateProfile);
Router.delete("/product/:productId", isAdmin, adminCtrl.deleteProduct);
Router.get("/products", isAdmin, adminCtrl.getProducts);
Router.delete("/user/:userId", isAdmin, adminCtrl.deleteUser);
Router.put("/user/:userId", isAdmin, adminCtrl.blockUser);

module.exports = Router;
