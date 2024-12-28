const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String, required: true, unique: true, trim: true, lowercase: true,

    },
    email: {
      type: String,
      required: [true, 'Email is required!'],
      trim: true,
      unique: [true, 'Email must be unique!'],
      minLength: [3, 'Email must have 3 characters!'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password must be provided!'],
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
