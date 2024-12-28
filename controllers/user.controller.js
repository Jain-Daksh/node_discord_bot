const User = require('../models/user.Model');
const Subscription = require('../models/subscription.Model');
const { v4: uuidv4 } = require('uuid');
const { ERROR_CODES } = require('../utils/error.handler');

const { doHash } = require('../utils/hashing');

exports.create = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    const existingUserName = await User.findOne({
      username,
    });

    if (existingUserName || existingUser) {
      return res
        .status(ERROR_CODES.ERROR_CODES?.alreadyExist?.status || 400)
        .json({
          success: false,
          message:
            ERROR_CODES.ERROR_CODES?.alreadyExist?.error ||
            'Conflict: User already exists',
        });
    }
    let hashedPassword;
    if (password) {
      hashedPassword = await doHash(password, 12);
    } else {
      const randomPassword = uuidv4();
      hashedPassword = await doHash(randomPassword, 12);
    }


    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const result = await newUser.save();
    result.password = undefined;
    res.status(201).json({
      success: true,
      message: 'Your account has been created successfully',
      result,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.get = async (req, res) => {
  try {
    const { username } = req.params; const user = await User.findOne({ username }).select('-password');  // Find user by username

    const subscriptions = await Subscription.find({ userID: user._id });

    if (!user) {
      return res.status(ERROR_CODES.ERROR_CODES.notFound.status).json({
        success: false,
        message: ERROR_CODES.ERROR_CODES.notFound.error,
      });
    }

    res.status(200).json({
      success: true,
      user,
      subscriptions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required to update a user',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.send({
        status: ERROR_CODES.ERROR_CODES.notFound.status,
        message: ERROR_CODES.ERROR_CODES.notFound.error,
      });
    }

    /// checking if username which user has given is been used or not if in use give error

    const existingUserName = await User.findOne({ username });

    if (existingUserName) {
      res.send({
        status: ERROR_CODES.ERROR_CODES.alreadyExist.status,
        message: ERROR_CODES.ERROR_CODES.alreadyExist.error,
      });
    }

    if (username) user.username = username;
    if (password) user.password = await doHash(password, 12);

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.send({
        status: ERROR_CODES.ERROR_CODES.badRequest.status,
        message: ERROR_CODES.ERROR_CODES.badRequest,
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
