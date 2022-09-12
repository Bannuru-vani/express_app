const Product = require('../models/Product');
const asyncHandler = require('../middlewares/asyncHandler');
const httpError = require('../utils/httpError');

//#region ~ POST - /api/v1/product - Upload a Product - Private
exports.addProduct = asyncHandler(async (req, res, next) => {
  let { name, desc, slug, image, background, price, discount, stock, color } =
    req.body;
  const product = await Product.create({
    name,
    desc,
    slug,
    image,
    background,
    price,
    discount,
    stock,
    color,
  });
  product.save();
  return res.status(201).json({ item: product.toObject({ getters: true }) });
});
//#endregion

//#region ~ GET - /api/v1/products - GET PRODUCTS - PRIVATE
exports.getProducts = asyncHandler(async (req, res, next) => {
  const items = await Product.find();
  res.status(200).json(items);
});
//#endregion

// //#region ~ PUT - /api/v1/slider/:sliderId - Upload a slider - Private
// exports.changeActiveStatus = asyncHandler(async (req, res, next) => {
//   let { active } = req.body;
//   let { sliderId } = req.params;
//   const sliderItem = await SliderItem.findById(sliderId);
//   sliderItem.active = active;
//   sliderItem.save();
//   return res.status(201).json({ item: sliderItem.toObject({ getters: true }) });
// });
// //#endregion
