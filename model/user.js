const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name required"],
    },
    email: {
      type: String,
      require: [true, "Email required"],
      unique: [true, "Email must be unique"],
    },
    birthday: {
      type: Date,
    },
    password: {
      type: String,
      require: [true, "Password required"],
    },
    resetToken: String,
    resetTime: Date,
    role: {
      type: String,
      enum: ["user", "admin", "guide", "lead-guide"],
      default: "user",
    },
    cart: {
      type: Array,
    },
    favorite: {
      type: Array,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.checkPasswords = async function (pass) {
  return await bcrypt.compare(pass.toString(), this.password);
};

userSchema.methods.resetTokenHandler = async function () {
  const resetPassword = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto
    .createHash("sha256")
    .update(resetPassword)
    .digest("hex");
  const updateFields = {
    $set: {
      resetToken: hashedPassword,
      resetTime: Date.now() + 15 * 60 * 1000,
    },
  };
  await User.findByIdAndUpdate(this._id, updateFields);
  return resetPassword;
};

userSchema.methods.cartAndFavoriteHandler = async function (cart, favorite) {
  const updateFields = { $set: { cart: cart, favorite: favorite } };
  await User.findByIdAndUpdate(this._id, updateFields);
};

userSchema.methods.updateUser = async function (birthday, email, name) {
  const updateFields = { $set: { birthday, email, name } };
  await User.findByIdAndUpdate(this._id, updateFields);
};

const User = mongoose.model("user", userSchema);
module.exports = User;
