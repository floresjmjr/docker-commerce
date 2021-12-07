/* eslint-disable max-len */
const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {User, Order, Product} = require('../db');

router.get('/', (req, res) => {
  const cartItems = res.app.locals.user.Orders[0].Products;
  // console.log('cartItems: ', )
  res.render('cart', {cartItems});
});

module.exports = router;
