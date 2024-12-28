const Subscription = require('../models/subscription.Model');
const { ERROR_CODES } = require('../utils/error.handler');
const User = require('../models/user.Model');

exports.create = async (req, res) => {
  const { serviceName, serviceLink, monthlyFee, username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(ERROR_CODES.NOT_FOUND.status).json({
        success: false,
        message: ERROR_CODES.NOT_FOUND.error,
      });
    }
    const userID = user.id




    const newSubscription = new Subscription({
      serviceName,
      serviceLink,
      monthlyFee,
      startDate: new Date(),
      userID,
    });

    const result = await newSubscription.save();

    return res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      result,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(ERROR_CODES.INTERNAL_SERVER_ERROR.status).json({
      success: false,
      message: ERROR_CODES.INTERNAL_SERVER_ERROR.error,
    });
  }
};


exports.get = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id)
      .populate('userID')
      .select('-password');
    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: 'Subscription not found' });
    }
    res.status(200).json({ success: true, subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllSubscriptionOfUser = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.find({ userID: id })
      .populate('userID')
      .select('-password');
    res.status(200).json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
