/* eslint-disable max-len */
const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {User, Order, Product} = require('../db');
require('dotenv').config();
const stripe = require('stripe')('sk_test_51K4HnNDOuKMTHnuIRYjV7kV1IkeqMKQ3S9cPDR2Brk17Aktg7m7PIEKhssnXf2uX8pkuNURRl2PMKiV17iAty3DO00XkpYtpau');
const express = require('express');
const endpointSecret = 'whsec_zQX8PmpQ6nreCkT8AEWdt2X81jhMQ4K9';

// change order to puchased when stripe webhook hits
async function update(obj) {
  const cart = await Order.findOne({
    where: {
      userId: obj,
      isPurchased: 0,
    },
  });

  cart.update({isPurchased: 1});
  console.log('CART STATUS UPDATED');
}
// get cart page
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
// delete product from cart
router.delete('/:productId', async (req, res)=>{
  const itemToRemove = await Product.findByPk(req.params.productId);
  const cart = await Order.findOne({
    where: {
      userId: res.app.locals.user.id,
      isPurchased: 0,
    },
  });
  await cart.removeProduct(itemToRemove);
  await cart.reload();
  res.sendStatus(200);
});
// stripe payment route
router.post('/create-checkout-session', async (req, res)=>{
  console.log('POST HIT');
  const cartItems = await Order.findOne({
    where: {
      userId: res.app.locals.user.id,
      isPurchased: 0,
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
    allow_promotion_codes: true,
    success_url: `${DOMAIN}/cart/success`,
    cancel_url: `${DOMAIN}/cart/cancel`,
  });

  res.redirect(303, session.url);
});
// stripe webhook for listening if payment method went through
router.post('/webhook', express.json({type: 'application/json'}), (request, response) => {
  const event = request.body;
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      update(response.app.locals.user.id);
    }
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
// route for sucessful payment
router.get('/success', async (req, res)=>{
  res.render('success');
});
// route for problem with payment
router.get('/cancel', async (req, res)=>{
  res.render('cancel');
});
module.exports = router;
