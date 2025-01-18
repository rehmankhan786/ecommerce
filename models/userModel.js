const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    username: { type: String},
    email: {
      type: String,
      required: [true, "Email is a necessary field"],
    },
    password: {
      type: String,
      required: [true, "Password is mandatory"],
    },
    country: String,
    contact: String,
    isAdmin: { type: Number, default: 0 },
    cart: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductModel",
            required: [true, "Product ID is required"],
          },
          productQuantity: {
            type: Number,
            default: 1,
            min: [1, "Quantity cannot be less than 1"],
          },
        },
      ],
      default: [],
    },
    forgotPasswordToken: { type: String, default: "" },
    blockStatus: { type: Boolean, default: false },
    purchaseHistory: {
      type: [
        {
          purchasedProducts: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductModel",
            required: [true, "Purchased product ID is required"],
          },
          price: { type: Number, required: true },
          image: { type: String },
          purchaseDate: { type: Date, default: Date.now },
          deliveryStatus: { type: String, default: "Pending" },
        },
      ],
      default: [],
    },
    wishlist: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductModel",
            required: [true, "Wishlist item ID is required"],
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userschema);

module.exports = userModel;
