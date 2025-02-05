require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");
const { getUser } = require("../middlewares/auth");
const { uploadProductPhoto, deleteImage } = require("../utilities/cloudinary");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const secretKey = process.env.SECRET_KEY;

class APIPRODUCTS {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    let queryObj = { ...this.queryString };
    const excludedFields = ["limit", "page", "sort"];
    excludedFields.forEach((field) => delete queryObj[field]);
    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(
      /\b(gt|gte|lt|eq|lte|regex)\b/g,
      (match) => "$" + match
    );
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join("");
      // console.log(sortBy)

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("createdAt");
    }

    return this;
  }
  pagination() {
    let page = this.queryString.page * 1 || 1; // Convert page to a number or default to 1
    page = page < 1 ? 1 : page; // Ensure page is at least 1

    const limit = this.queryString.limit * 1 || 9; // Default limit to 9 if not specified
    // let productLength = this.query.length;
    // console.log(productLength)
    // console.log(page)
    const skipProduct = (page - 1) * limit; // Calculate products to skip
    this.query = this.query.skip(skipProduct).limit(limit); // Apply pagination

    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    const prodList = await Product.find({});
    const limit = req.query.limit ? req.query.limit * 1 : 9;
    const prodLength = prodList.length;
    const maxPage = Math.ceil(prodLength / limit); // Calculate the maximum allowable page number
    let page = parseInt(req.query.page) * 1 || 1; // Convert page to a number or default to 1

    page = Math.max(1, Math.min(page, maxPage));
    req.query.page = JSON.stringify(page);
    // console.log(page);
    // console.log(req.query);
    let TProducts = new APIPRODUCTS(Product.find(), req.query)
      .filtering()
      .sorting()
      .pagination();
    const filteredProducts = await TProducts.query;
    return res.status(200).json({ filteredProducts, maxPage });
  },
  getSingleProduct: async (req, res) => {
    const productId = req.params.productId;
    // console.log(req.params);
    const product = await productModel.findOne({ _id: productId });
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ message: "Product doesn't exists" });
    }
  },
  addProduct: async (req, res) => {
    try{
      const productPhoto = req.file;
      // console.log(req.body)
      const uploadedPhoto = await uploadProductPhoto(productPhoto.filename);
      const {
        productName,
        productCode,
        productDescription,
        productPrice,
        productImage,
        productRatings,
        productQuantity,
        productSoldQuantity,
        productAddedBy,
        productCategory,
      } = req.body;
      const userCookie = req.cookies.ecom_cookies;
      const userjwt = jwt.verify(userCookie, secretKey);
      if (userjwt) {
        const user = await getUser(userjwt);
        const { email } = user;
        // console.log(user);
        const productsAddedByUser = await Product.findOne({
          productAddedBy: email,
          productCode,
        });
    
        if (productsAddedByUser) {
          const filename = req.file.filename;
          deleteImage(filename);
          return res.status(400).json({
            msg: "Product Already Exists with same Product Code By You",
            success: false,
          });
        } else {
          const newProduct = new Product({
            productName,
            productCode,
            productDescription,
            productPrice,
            productImage: uploadedPhoto.secure_url,
            productRatings,
            productQuantity,
            productSoldQuantity,
            productAddedBy: userjwt,
            productCategory,
            createdAt: Date.now(),
          });
          await newProduct.save();
          return res.status(200).json({ msg: "Product added Successfully" });
        }
      } else {
        return res.status(500).json({ msg: "Please Login First" });
      }

    }
    catch(error){
      console.log(error)
    }
  },
  updateProduct: async (req, res) => {
    const {
      productName,
      productCode,
      productDescription,
      productPrice,
      productImage,
      productRatings,
      productQuantity,
      productSoldQuantity,
      productAddedBy,
      productCategory,
    } = req.body;
    const userCookie = req.cookies.ecom_cookies;
    const TokenVerified = jwt.verify(userCookie, secretKey);
    if (TokenVerified) {
      const user = await getUser(TokenVerified.email);
      const { email } = user;
      const updateProduct = await Product.findOne({
        productAddedBy: email,
        productCode,
      });
      updateProduct = {
        productName,
        productDescription,
        productPrice,
        productImage,
        productRatings,
        productQuantity,
        productSoldQuantity,
        productCategory,
      };
      await updateProduct.save();
    }
  },
  deleteProduct: async (req, res) => {
    const { email } = jwt.verify(req.cookies.ecom_cookies, secretKey);
    const productCode = req.params.Pcode;
    const existProduct = Product.findOne({ email, productCode });
    if (existProduct) {
      await Product.findOneAndDelete({ email, productCode });
      return res.status(200).json({
        success: "true",
        msg: "product deleted Successfully",
        existProduct,
      });
    } else {
      return res.status(500).json({
        success: "false",
        msg: "you are not authorized to dete this product",
      });
    }
  },
  productSold: async (req, res) => {
    const productId = req.params.productId;
    const product = await productModel.findOne({ _id: productId });
    const email = jwt.verify(req.cookies.ecom_cookies, secretKey);
    const user = await userModel.findOne({ email });
    if (!product) {
      return res
        .status(200)
        .json({ success: false, message: "product doesn't exists" });
    } else {
      product.productSoldQuantity += 1;
      product.productQuantity -= 1;
      product.productBuyers.forEach((buyer) => {
        if (buyer._id === user._id) {
          buyer.quantity += 1;
        } else {
          const newBuyer = {
            name: user.username,
            Id: user._id,
            quantity: 1,
          };
          product.productBuyers.push(newBuyer);
        }
      });
      if (product.productBuyers) await product.save();
    }
  },
  getCartProducts: async (req, res) => {
    try {
      const productIds = req.user.cart.map((item) => item._id); // Get cart items from user object

      // console.log("productIDs  ", productIds);

      const products = await Product.find({ _id: { $in: productIds } }); // Fetch product details
      // console.log("products", products);
      return res.status(200).json(products);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching products", error });
    }
  },

  // Fetch multiple products by their IDs
  getProductsByIds: async (req, res) => {
    try {
      const { productIds } = req.body; // Expect an array of product IDs in the request body
      // console.log(productIds);
      // console.log("productIds");
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ message: "Invalid product IDs" });
      }

      const products = await Product.find({ _id: { $in: productIds } });
      // console.log(products);
      // Convert products array into an object with productId as keys for easy mapping
      const productsById = products.reduce((acc, product) => {
        acc[product._id] = product;
        return acc;
      }, {});

      res.status(200).json(productsById);
    } catch (error) {
      console.error("Error fetching products by IDs:", error);
      res.status(500).json({ message: "Error fetching products", error });
    }
  },
};

module.exports = productCtrl;
1;
