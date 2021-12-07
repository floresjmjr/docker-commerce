const router = require('express').Router();
const Product = require('../db/models/Product');
const Order = require('../db/models/Order');

router.get('/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  res.render('single-product', {product: product, user: res.app.locals.user});
});

router.get('/', async (req, res)=>{
  const products = await Product.findAll();
  res.render('products', {products});
});
// add something to the cart
router.post('/:id', async (req, res)=>{
  const itemToAdd = await Product.findByPk(req.params.id);
  const currentUser = res.app.locals.user;
  let cart = await Order.findOne({
    where: {
      userId: currentUser.id,
    },
    include: {
      model: Product,
    },
  });
  if (!cart) {
    cart = await Order.create({
      include: {model: Product},
    });
    await currentUser.addOrder(cart);
    await cart.addProduct(itemToAdd);
  } else {
    await cart.addProduct(itemToAdd);
  }

  cart = await cart.getProducts();

  res.render('cart', {cartItems: cart});
});
module.exports = router;
