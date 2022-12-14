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
  const items = await Product.find().select({ image: 1, slug: 1 });
  res.status(200).json(items);
});
//#endregion

//#region ~ GET - /api/v1/products/:slug - GET Individual PRODUCT - PRIVATE
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const item = await Product.find({ slug });
  console.log(item);
  if (!item.length) {
    return next(new httpError('No Item found', 404));
  }
  res.status(200).json(item[0]);
});
//#endregion
