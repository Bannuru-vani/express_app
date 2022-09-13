const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('../middlewares/asyncHandler');
const httpError = require('../utils/httpError');

//#region ~ POST - /api/v1/cart - Add item to cart - Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  let { productId, quantity } = req.body;
  let userId = req.user._id;
  let productDetails = await Product.findById(productId);
  if (!productDetails) {
    return next(new httpError('Product not found', 400));
  }

  // TODO: Need to check if cart is already exists with this customer and need to add a new item and update the existing product
  let cart = await Cart.find({ userId });

  if (!cart) {
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
  } else {
    let productIndex = cart.items.findIndex(
      item => item.productId === productId
    );

    if (productIndex) {
      cart.items[productIndex].quantity = quantity;
      cart.items[productIndex].total = quantity * productDetails.price;
      cart.subTotal = cart.items
        .map(item => item.total)
        .reduce((acc, next) => acc + next);
    } else {
      cart.items.push({
        productId: productId,
        quantity: quantity,
        total: parseInt(productDetails.price * quantity),
        price: productDetails.price,
      });
      cart.subTotal = cart.items
        .map(item => item.total)
        .reduce((acc, next) => acc + next);
    }
  }

  return res
    .status(201)
    .json({ message: `${productDetails.name} is added to cart!` });
});
//#endregion
