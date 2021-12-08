/* eslint-disable max-len */
const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {User, Order, Product} = require('../db');
require('dotenv').config();
const stripe = require('stripe')('sk_test_51K4HnNDOuKMTHnuIRYjV7kV1IkeqMKQ3S9cPDR2Brk17Aktg7m7PIEKhssnXf2uX8pkuNURRl2PMKiV17iAty3DO00XkpYtpau');


router.get('/', async (req, res) => {
  let cartItems = await Order.findOne({
    where: {
      userId: res.app.locals.user.id,
    },
    include: {
      model: Product,
    },
  });
  cartItems = await cartItems.getProducts();
  res.render('cart', {cartItems});
});

router.delete('/:productId', async (req, res)=>{
  const itemToRemove = await Product.findByPk(req.params.productId);

  const cart = await Order.findOne({
    where: {
      userId: res.app.locals.user.id,
    },
  });

  await cart.removeProduct(itemToRemove);
  await cart.reload();
  res.sendStatus(200);
});

router.post('/create-checkout-session', async (req, res)=>{
  console.log('POST HIT');
  const total = 'need to grab server side total';
  const cartItems = await Order.findOne({
    where: {
      userId: res.app.locals.user.id,
    },
    include: {
      model: Product,
    },
  });
  const DOMAIN = 'http://localhost:3000';
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: cartItems.Products.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
          },
          unit_amount: item.price * 100,
        },
        quantity: 1,
      };
    }),
    success_url: `${DOMAIN}/cart/success`,
    cancel_url: `${DOMAIN}/cart/cancel`,
  });
  console.log('SESSION HERE', session);
  res.redirect(303, session.url);
  console.log('SESSION HERE 2', session);
});
router.get('/success', async (req, res)=>{
  res.render('success');
});
router.get('/cancel', async (req, res)=>{
  res.render('cancel');
});
module.exports = router;
