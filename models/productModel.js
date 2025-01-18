const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  productName: String,
  productCode: { type: String, unique: true },
  productDescription: String,
  productPrice: Number,
  productImage: String,
  productRatings: Number,
  productQuantity: Number,
  productSoldQuantity: Number,
  productAddedBy: String,
  productCategory: { type: [String], default: [] },
  productBuyers: {
    type: [
      {
        buyerData: {
          name: { type: String, required: true },
          Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true,
          },
          quantity: Number,
        },
      },
    ],
    default: [],
  },
  // default: [],
  createdAt: Date,
});
const productModel = new mongoose.model("product", productSchema);
module.exports = productModel;
