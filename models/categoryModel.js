const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  name: String,
});
CategoryModel = new mongoose.model("category", CategorySchema);

module.exports = CategoryModel;
