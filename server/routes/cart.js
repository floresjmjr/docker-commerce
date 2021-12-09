/* eslint-disable max-len */
const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {User, Order, Product} = require('../db');
require('dotenv').config();
const stripe = require('stripe')('sk_test_51K4HnNDOuKMTHnuIRYjV7kV1IkeqMKQ3S9cPDR2Brk17Aktg7m7PIEKhssnXf2uX8pkuNURRl2PMKiV17iAty3DO00XkpYtpau');
const express = require('express');
const endpointSecret = 'whsec_zQX8PmpQ6nreCkT8AEWdt2X81jhMQ4K9';

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
 
  const itemToRemove = await Product.findByPk(req.params.productId);

  const cart = await Order.findOne({
    where: {
      userId: res.app.locals.user.id,
      isPurchased: 0,
    },
  });
  
  const deleted = await cart.removeProduct(itemToRemove);
  

  await cart.reload();
  res.sendStatus(200);
});

router.post('/create-checkout-session', async (req, res)=>{
  console.log('POST HIT');
  const total = 'need to grab server side total';
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
router.post('/webhook', express.json({type: 'application/json'}), (request, response) => {
  const event = request.body;
  // // Only verify the event if you have an endpoint secret defined.
  // // Otherwise use the basic event deserialized with JSON.parse
  // if (endpointSecret) {
  //   // Get the signature sent by Stripe
  //   const signature = request.headers['stripe-signature'];
  //   try {
  //     event = stripe.webhooks.constructEvent(
  //         request.body,
  //         signature,
  //         endpointSecret,
  //     );
  //   } catch (err) {
  //     console.log(`⚠️  Webhook signature verification failed.`, err.message);
  //     return response.sendStatus(400);
  //   }
  // }

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
    // case 'payment_method.attached':
    //   const paymentMethod = event.data.object;
    //   // Then define and call a method to handle the successful attachment of a PaymentMethod.
    //   // handlePaymentMethodAttached(paymentMethod);
    //   break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
router.get('/success', async (req, res)=>{
  res.render('success');
});
router.get('/cancel', async (req, res)=>{
  res.render('cancel');
});
module.exports = router;
