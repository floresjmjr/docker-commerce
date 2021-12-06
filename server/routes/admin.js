const router = require('express').Router();
const {Product} = require('../db/index');

router.get('/admin/newProduct', (req, res, next) => {
  try {
    //need to verify that person is admin
    console.log(req);
    res.render('addProduct');
  } catch (error) {
    next(error);
  }
});

router.post('/admin/newProduct', async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.render('singleProduct', product);
  } catch (error) {
    next(error);
  }
});

router.post('/products/:productId/update', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    await product.update(req.body);
    res.render('singleProduct', product);
  } catch (error) {
    next(error);
  }
});

router.get('/products/:productId/update', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    res.render('updateProduct', {product: product});
  } catch (error) {
    next(error);
  }
});

router.delete('/product/:productId', async (req, res, next) => {
  try {
    await Product.destroy({where: {id: req.params.productId}});
    const products = await Product.findAll();
    res.render('allProducts', products);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
