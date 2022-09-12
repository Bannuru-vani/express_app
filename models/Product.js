const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  desc: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
  },
  image: {
    type: String,
  },
  background: {
    type: String,
  },
  price: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  stock: {
    type: Number,
  },
  color: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//#region ~ Create slug from product name :-}
// Using function key-word insted of arrow function to use "this" to get Users properties
ProductSchema.pre('save', async function (next) {
  if (!this.isModified('name')) next();
  this.slug = this.name.toLowerCase().replace(/\W+/g, '-');
});
//#endregion

module.exports = mongoose.model('Product', ProductSchema);
