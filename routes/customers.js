const errors = require('restify-errors');
const Customer = require('../models/Customer');

module.exports = server => {

  /* ===== GET CUSTOMERS ===== */
  server.get('/customers', async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err))
    }
  });

  /* ===== GET SINGLE CUSTOMER ===== */
  server.get('/customers/:id', async (req, res, next) => {
    try {
      const customers = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    } catch (err) {
      return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`));
    }
  });


  /* ===== ADD CUSTOMER ===== */
  server.post('/customers', async (req, res, next) => {
    // check for JSON format
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json' "));
    }
    const {
      name,
      email,
      balance
    } = req.body;

    const customer = new Customer({
      name,
      email,
      balance
    });

    try {
      const newCustomer = await customer.save();
      res.send(201);
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  /* ===== EDIT CUSTOMER ===== */
  server.put('/customers/:id', async (req, res, next) => {
    // check for JSON format
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json' "));
    }
    const {
      name,
      email,
      balance
    } = req.body;

    const customer = new Customer({
      name,
      email,
      balance
    });

    try {
      const customer = await Customer.findOneAndUpdate({
        _id: req.params.id
      }, req.body);
      res.send(201);
    } catch (err) {
      return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`));
    }
  });

  /* ===== DELETE CUSTOMER ===== */
  server.del('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findOneAndRemove({
        _id: req.params.id
      });
      res.send(204);
      next();
    } catch (err) {
      return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`));
    }
  });
};