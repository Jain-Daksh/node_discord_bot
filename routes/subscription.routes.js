const router = require('express').Router();
const Subscription = require('../controllers/subscription.controller');

module.exports = (app) => {
  router.post('/', Subscription.create);
  router.get('/:id', Subscription.get);
  router.get('/user/:id', Subscription.getAllSubscriptionOfUser);

  app.use('/api/subscriptions', router);
};
