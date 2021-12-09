/* eslint-disable max-len */
const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {User, Order, Product} = require('../db');

router.get('/', async (req, res) => {
  if (!res.app.locals.user) {
    res.redirect('/user/login');
  }

  let cartItems = await Order.findOne({
    where: {
      userId: res.app.locals.user.id,
      isPurchased: 0,
    },
    include: {
      model: Product,
    },
  });
  if (cartItems) {
    cartItems = await cartItems.getProducts();
  }

  res.render('cart', {cartItems});
});

router.delete('/:productId', async (req, res)=>{
  console.log('ROUTE HIT');
  const itemToRemove = await Product.findByPk(req.params.productId);

  const cart = await Order.findOne({
    where: {
      userId: res.app.locals.user.id,
      isPurchased: 0,
    },
  });
  console.log('REMOVE!', itemToRemove);
  const deleted = await cart.removeProduct(itemToRemove);
  console.log('DEEELETE', deleted);

  await cart.reload();
  res.sendStatus(200);
});

module.exports = router;
