const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {Product} = require('../db/index');
const {isAdmin, formatSingleProduct} = require('./_functions');

// Server-side validation checks for the product through the req.body
const productChecks = [
  check('title').notEmpty(),
  check('price')
      .notEmpty()
      .isCurrency().withMessage('Price needs to have 2 digits after decimal'),
  check('description').notEmpty(),
  check('category').notEmpty(),
  check('image')
      .notEmpty()
      .isURL().withMessage('Image has to be from proper URL'),
];

// Admin views the page to create a new product
router.get('/admin/newProduct', (req, res, next) => {
  try {
    if (isAdmin(res.app.locals.user)) {
      res.render('addProduct');
    } else {
      // Need a unauthorized page
      res.send('You\'re not authorized! Do not pass go, do not collect $200');
    }
  } catch (error) {
    next(error);
  }
});

// Admin creates a new product for sale
router.post('/admin/newProduct', productChecks, async (req, res, next) => {
  try {
    if (isAdmin(res.app.locals.user)) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // return res.status(404).json({errors: errors.array()});
        const validationError = errors.array();
        return res.render('addProduct', {validationError});
      }
      const product = await Product.create(req.body);
      res.redirect(`/products/${product.id}`);
    } else {
      // Need a unauthorized page
      res.send('You\'re not authorized! Do not pass go, do not collect $200');
    }
  } catch (error) {
    next(error);
  }
});

// Admin updates the product information
router.post(
    '/products/:productId/update', productChecks, async (req, res, next) => {
      try {
        if (isAdmin(res.app.locals.user)) {
          const errors = validationResult(req);
          const product = await Product.findByPk(req.params.productId);
          if (!errors.isEmpty()) {
            // return res.status(404).json({errors: errors.array()});
            const validationError = errors.array();
            return res.render(
                'updateProduct',
                {validationError: validationError, product: product});
          }
          await product.update(req.body);

          const context = {
            product: formatSingleProduct(product),
            admin: isAdmin(res.app.locals.user),
          };

          res.render('single-product', context);
        } else {
          // Need a unauthorized page
          res.send('You\'re not authorized! Do not pass go, do not collect $200');
        }
      } catch (error) {
        next(error);
      }
    });

// Admin views the page to update a product
router.get('/products/:productId/update', async (req, res, next) => {
  try {
    if (isAdmin(res.app.locals.user)) {
      const product = await Product.findByPk(req.params.productId);
      res.render('updateProduct', {product: product});
    } else {
      // Need a unauthorized page
      res.send('You\'re not authorized! Do not pass go, do not collect $200');
    }
  } catch (error) {
    next(error);
  }
});

// Admin deletes a product from sale
router.delete('/products/:productId', async (req, res, next) => {
  try {
    if (isAdmin(res.app.locals.user)) {
      await Product.destroy({where: {id: req.params.productId}});
      res.sendStatus(200);
    } else {
      // Need a unauthorized page
      res.send('You\'re not authorized! Do not pass go, do not collect $200');
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
