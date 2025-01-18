const mongosose = require("mongoose");
const Router = require("express").Router();
const Product = require("../models/productModel");
const bcrypt = require("bcrypt");
const productCtrl = require("../controller/productsCtrl");
const { auth, authenticateToken } = require("../middlewares/auth");
const { upload } = require("../utilities/multer");
// const authenticateToken = require("../middlewares/auth");


Router.get('/',productCtrl.getProducts)
Router.post("/", authenticateToken, productCtrl.getProductsByIds);
Router.post('/add',auth,upload.single("productImage"),productCtrl.addProduct)
Router.post('/update:pCode',auth,productCtrl.updateProduct)
Router.delete('/delete:pCode',auth,productCtrl.deleteProduct)
Router.get('/cart', authenticateToken,productCtrl.getCartProducts)
Router.get('/:productId',productCtrl.getSingleProduct)


module.exports = Router;