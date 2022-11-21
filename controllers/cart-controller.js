const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('../middlewares/asyncHandler');
const httpError = require('../utils/httpError');

//#region ~ POST - /api/v1/cart - Add item to cart - Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  let { productId, quantity } = req.body;
  console.log(productId, quantity);
  if (!quantity || quantity === '0') {
    return next(new httpError('quantity has to be more than one', 400));
  }
  let userId = req.user._id;
  let productDetails = await Product.findById(productId);
  if (!productDetails) {
    return next(new httpError('Product not found', 400));
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    const cartData = {
      userId: req.user._id,
      items: [
        {
          product: productId,
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
      item => item.product.toString() === productId
    );

    // cart.items.map(item =>
    //   console.log(item.productId.toString() === productId)
    // );
    if (productIndex > -1) {
      cart.items[productIndex].quantity = quantity;
      cart.items[productIndex].total = quantity * productDetails.price;
      cart.subTotal = cart.items
        .map(item => item.total)
        .reduce((acc, next) => acc + next);
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity,
        total: parseInt(productDetails.price * quantity),
        price: productDetails.price,
      });
      cart.subTotal = cart.items
        .map(item => item.total)
        .reduce((acc, next) => acc + next);
    }
    cart.save();
  }

  return res
    .status(201)
    .json({ message: `${productDetails.name} is added to cart!` });
});
//#endregion

//#region ~ DELETE - /api/v1/cart/deleteSignleItem- DELETE FROM CART - PRIVATE
exports.deleteFromCart = asyncHandler(async (req, res, next) => {
  let userId = req.user._id;
  let productID = req.params.productID;
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new httpError('Bad request!', 400));
  }
  // TODO: if the item is already deleted give some different message to user
  let cartItems = cart.items.filter(
    item => item.product.toString() !== productID
  );
  cart.items = [...cartItems];
  await cart.save();
  res.status(200).json({ message: `Item deleted from cart` });
});
//#endregion

//#region ~ DELETE - /api/v1/cart - DELETE CART - PRIVATE
exports.deleteAll = asyncHandler(async (req, res, next) => {
  let userId = req.user._id;
  let cart = await Cart.deleteOne({ userId });
  res.status(200).json({ message: `Cart deleted` });
});
//#endregion

//#region ~ GET - /api/v1/products - GET PRODUCTS - PRIVATE
exports.getCart = asyncHandler(async (req, res, next) => {
  let userId = req.user._id;
  const cart = await Cart.findOne({ userId }).populate('items.product');
  if (!cart || !Object.keys(cart).length) {
    return res.status(200).json({ message: 'Cart is empty' });
  }
  res.status(200).json(cart);
});
//#endregion

//#region ~ GET - /api/v1/cart/count - GET PRODUCTS COUNT - PRIVATE
exports.getCartCount = asyncHandler(async (req, res, next) => {
  let userId = req.user._id;
  const cart = await Cart.findOne({ userId });
  if (!cart || !Object.keys(cart).length) {
    return res.status(200).json({ cartCount: 0 });
  }
  let cartCount = cart.items?.length || 0;
  res.status(200).json({ cartCount });
});
//#endregion
