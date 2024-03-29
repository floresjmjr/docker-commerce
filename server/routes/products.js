const router = require('express').Router();
const Product = require('../db/models/Product');
const Order = require('../db/models/Order');

const {
  isAdmin,
  formatSingleProduct,
  formatAllProducts,
} = require('./_functions');

// route to search products by phrase
router.post('/search', async (req, res) => {
  const products = await Product.searchByPhrase(req.body.search);
  const context = {
    products: formatAllProducts(products),
    admin: isAdmin(res.app.locals.user),
  };
  res.render('products', context);
});
// get mens clothing
router.get('/Men\'s', async (req, res) => {
  const products = await Product.findAll({
    where: {
      category: 'Men\'s Clothing',
    }});

  const context = {
    products: formatAllProducts(products),
    admin: isAdmin(res.app.locals.user),
  };
  res.render('products', context);
});
// get womans clothing
router.get('/Women\'s', async (req, res) => {
  const products = await Product.findAll({
    where: {
      category: 'Women\'s Clothing',
    }});

  const context = {
    products: formatAllProducts(products),
    admin: isAdmin(res.app.locals.user),
  };
  res.render('products', context);
});
// get jewelry
router.get('/Jewelery', async (req, res) => {
  const products = await Product.findAll({where: {category: 'Jewelery'}});
  const context = {
    products: formatAllProducts(products),
    admin: isAdmin(res.app.locals.user),
  };
  res.render('products', context);
});

// get electronics
router.get('/Electronics', async (req, res) => {
  const products = await Product.findAll({where: {category: 'Electronics'}});

  const context = {
    products: formatAllProducts(products),
    admin: isAdmin(res.app.locals.user),
  };
  res.render('products', context);
});
// get a single product
router.get('/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  const context = {
    product: formatSingleProduct(product),
    user: res.app.locals.user,
    admin: isAdmin(res.app.locals.user),
  };
  res.render('single-product', context);
});
// get all products
router.get('/', async (req, res) => {
  const products = await Product.findAll();
  const context = {
    products: formatAllProducts(products),
    admin: isAdmin(res.app.locals.user),
  };
  res.render('products', context);
});
// add something to the cart
router.post('/:id', async (req, res) => {
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
