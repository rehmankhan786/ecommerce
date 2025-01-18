const express = require("express");
const cartController = require("../controller/cartCtrl");
const {  authenticateToken } = require("../middlewares/auth");

const router = express.Router();

// Get user's cart
router.get("/", authenticateToken, cartController.getCart);

// Add to cart
router.post("/add", authenticateToken, cartController.addToCart);

// Update cart item quantity
router.post("/update", authenticateToken, cartController.updateCart);

// Remove from cart
router.post("/remove", authenticateToken, cartController.removeFromCart);

module.exports = router;
