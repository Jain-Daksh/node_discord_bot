const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  serviceLink: { type: String, required: true },
  monthlyFee: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
