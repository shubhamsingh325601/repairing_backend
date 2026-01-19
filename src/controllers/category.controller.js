const { successResponse, failedResponse, errorResponse } = require('../helpers/apiResponse');
const {Category} = require('../models');

/**
 * @method GET
 * Returns all categories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return successResponse(res, categories, "Categories fetched successfully");
  } catch (err) {
    return errorResponse(res, err, "Error fetching categories");
  }
};

exports.addCategory = async (req, res) => {
  const { name, icon, services, products, isActive } = req.body;

  try {
    // Check if category already exists
    const existing = await Category.findOne({ name });
    if (existing) {
      return failedResponse(res, 'Category already exists', 400);
    }

    const newCategory = new Category({
      name,
      icon,
      services,
      products,
      isActive,
    });

    await newCategory.save();

    return successResponse(res, newCategory, 'Category created successfully', 201);
  } catch (error) {
    return errorResponse(res, error, 'Server error while creating category');
  }
};
