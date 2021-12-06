const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {Product} = require('../db/index');

const productChecks = [
  check('title')
      .notEmpty(),
  check('price')
      .notEmpty()
      .isCurrency(),
  check('description')
      .notEmpty(),
  check('category')
      .notEmpty,
  check('image')
      .notEmpty()
      .isURL(),
];

router.get('/admin/newProduct', (req, res, next) => {
  try {
    // need to verify that person is admin
    console.log(req);
    res.render('addProduct');
  } catch (error) {
    next(error);
  }
});

router.post('/admin/newProduct', productChecks, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({errors: errors.array()});
    }
    const product = await Product.create(req.body);
    res.render('singleProduct', product);
  } catch (error) {
    next(error);
  }
});

router.post(
    '/updateproduct/:productId/update',
    productChecks,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(404).json({errors: errors.array()});
        }
        const product = await Product.findByPk(req.params.productId);
        await product.update(req.body);
        res.render('singleProduct', product);
      } catch (error) {
        next(error);
      }
    });

router.get('/product/:productId/update', async (req, res, next) => {
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
