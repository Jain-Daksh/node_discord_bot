const router = require('express').Router();
const User = require('../controllers/user.controller');
const { isAuthenticated } = require('../utils/jwt');

module.exports = (app) => {
  router.get('/', isAuthenticated, User.getAll);
  router.post('/', User.create);
  // router.get('/:id', isAuthenticated, User.get);

  router.get('/:username', User.get);
  router.put('/:id', isAuthenticated, User.update);
  router.delete('/:id', isAuthenticated, User.delete);

  app.use('/api/users', router);
};
