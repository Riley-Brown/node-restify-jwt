const errors = require('restify-errors');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const jwt = require('jsonwebtoken');
const config = require('../config');

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

  /* ===== AUTH USER ===== */
  server.post('/auth', async (req, res, next) => {
    const {
      email,
      password
    } = req.body;

    try {
      // authenticate user
      const user = await auth.authenticate(email, password);

      // create JWT token
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: '15m'
      });

      const {
        iat,
        exp
      } = jwt.decode(token);

      // send token to user
      res.send({
        iat,
        exp,
        token
      });
      next();
    } catch (err) {
      // user auth failed
      return next(new errors.UnauthorizedError(err));
    }
  })
};