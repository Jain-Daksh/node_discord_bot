const router = require('express').Router();

const auth = require('../controllers/auth.controller');

module.exports = (app) => {
  router.post('/login', auth.login);

  app.use('/api', router);
};
