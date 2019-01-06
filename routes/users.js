const errors = require('restify-errors');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = server => {
  // Register new user
  server.post('/register', (req, res, next) => {
    const {
      email,
      password
    } = req.body;

    const user = new User({
      email,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // hash user password
        user.password = hash;

        // save user to db
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });
};