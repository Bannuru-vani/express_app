const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//#region ~ Encrypt Password Before Saveing  :-}
// Using function key-word insted of arrow function to use "this" to get Users properties
UserSchema.pre('save', async function (next) {
  // The below step usefull in update if password has modified then bcrypt it or
  // leave it if password has not changed
  if (!this.isModified('password')) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
//#endregion

//#region ~ Sign JWT and return :-}
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_FOR_TOKEN, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//#endregion

//#region ~ Match Password :-}

UserSchema.methods.matchPassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};

//#endregion

module.exports = mongoose.model('User', UserSchema);
