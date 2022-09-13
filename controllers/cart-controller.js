const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('../middlewares/asyncHandler');
const httpError = require('../utils/httpError');

//#region ~ POST - /api/v1/cart - Add item to cart - Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  let { productId, quantity } = req.body;
  let productDetails = await Product.findById(productId);
  if (!productDetails) {
    return next(new httpError('Product not found', 400));
  }

  // TODO: Need to check if cart is already exists with this customer and need to add a new item and update the existing product
  const cartData = {
    userId: req.user._id,
    items: [
      {
        productId: productId,
        quantity: quantity,
        total: parseInt(productDetails.price * quantity),
        price: productDetails.price,
      },
    ],
    subTotal: parseInt(productDetails.price * quantity),
  };

  await Cart.create(cartData);
  return res
    .status(201)
    .json({ message: `${productDetails.name} is added to cart!` });
});
//#endregion
