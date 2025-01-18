const Cart = require("../models/cart");
const Product = require("../models/productModel");

const cartController = {
  // Fetch the cart for a user
  getCart: async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({ userId }).populate("items.productId");

      if (!cart) return res.status(200).json({ items: [] });

      const cartDetails = cart.items.map((item) => ({
        id: item.productId._id,
        name: item.productId.productName,
        price: item.productId.productPrice,
        image: item.productId.productImage,
        quantity: item.quantity,
      }));

      res.status(200).json(cartDetails);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart", error });
    }
  },

  // Add an item to the cart
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user._id;

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      const existingItem = cart.items.find((item) => item.productId.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
      res.status(200).json({ success: true, message: "Item added to cart" });
    } catch (error) {
      res.status(500).json({ message: "Error adding to cart", error });
    }
  },

  // Update quantity of an item in the cart
  updateCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user._id;

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const item = cart.items.find((item) => item.productId.toString() === productId);

      if (item) {
        item.quantity += quantity;

        if (item.quantity <= 0) {
          cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        }

        await cart.save();
        res.status(200).json({ success: true, message: "Cart updated" });
      } else {
        res.status(404).json({ message: "Item not found in cart" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating cart", error });
    }
  },

  // Remove an item from the cart
  removeFromCart: async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = req.user._id;

      const cart = await Cart.findOne({ userId });

      if (!cart) return res.status(404).json({ message: "Cart not found" });

      cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

      await cart.save();
      res.status(200).json({ success: true, message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Error removing item", error });
    }
  },
};

module.exports = cartController;

