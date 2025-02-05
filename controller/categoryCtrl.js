const mongoose = require("mongoose");
const category = require("../models/categoryModel");


const categoryCtrl = {
  get: async (req, res) => {
    const categoryList = await category.find({});
    return res.status(200).json(categoryList);
  },
  update: async (req, res) => {
    const newname = req.query.categoryName;
    const updatedCategory = await category.findOne({ name });
    updatedCategory.name = newname;
    await updatedCategory.save();
  },
  add: async (req, res) => {
    var { categoryName } = req.body;
    // console.log(req.body)
    categoryName = categoryName.toLowerCase();
    const isCategoryExists = await category.findOne({ name: categoryName });
    if (isCategoryExists) {
      return res.status(200).json({ msg: "category already exists" });
    } else {
      const newCategory = new category({ name: categoryName });
      await newCategory.save();
      return res.status(200).json({
        success: true,
        msg: "new categoryhas been added",
        newCategory,
      });
    }
  },
  delete: async (req, res) => {
    const pCode = req.params.pCode;
    let toBeDeletedCategory = await category.findOneAndDelete({_id: pCode });
    return res
      .status(200)
      .json({
        success: true,
        msg: "category deleted successfully",
        toBeDeletedCategory,
      });
  },
};
module.exports = categoryCtrl;
