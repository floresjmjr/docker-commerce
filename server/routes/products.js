const router = require('express').Router();
const Product = require('../db/models/Product');
const Order = require('../db/models/Order');
const {isAdmin} = require('./_functions');


router.post('/search', async (req, res)=>{
  const products = await Product.searchByPhrase(req.body.search);
  const context = {
    products: products,
    admin: isAdmin(res.app.locals.user),
  };
  res.render('products', context);
});

router.get('/Men\'s', async (req, res)=>{
  const products = await Product.findAll({where: {category: 'men\'s clothing'}});
  const context = {
    products: products,
    admin: isAdmin(res.app.locals.user),
  };
  res.render('products', context);
});

router.get('/Women\'s', async (req, res)=>{
  const products = await Product.findAll({where: {category: 'women\'s clothing'}});
  const context = {
    products: products,
    admin: isAdmin(res.app.locals.user),
  };
  res.render('products', context);
});

router.get('/Jewelery', async (req, res)=>{
  const products = await Product.findAll({where: {category: 'jewelery'}});
  const context = {
    products: products,
    admin: isAdmin(res.app.locals.user),
  };
  res.render('products', context);
});

router.get('/Electronics', async (req, res)=>{
  const products = await Product.findAll({where: {category: 'electronics'}});
  const context = {
    products: products,
    admin: isAdmin(res.app.locals.user),
  };
  res.render('products', context);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  const context = {
    product: product,
    admin: isAdmin(res.app.locals.user),
  };
  res.render('single-product', context);
});

router.get('/', async (req, res)=>{
  const products = await Product.findAll();
  const context = {
    products: products,
    admin: false,
  };
  if (res.app.locals.user) {
    if (res.app.locals.user.type === 'Admin') {
      context.admin = true;
    }
  }

  res.render('products', context);
});
// add something to the cart
router.post('/:id', async (req, res)=>{
  const itemToAdd = await Product.findByPk(req.params.id);
  const currentUser = res.app.locals.user;
  let cart = await Order.findOne({
    where: {
      userId: currentUser.id,
      isPurchased: 0,
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

  res.redirect(301, '/cart');
});
module.exports = router;
