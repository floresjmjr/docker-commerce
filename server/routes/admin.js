const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {Product} = require('../db/index');
const { isAdmin } = require('./_functions')

//Server-side validation checks for the product through the req.body
const productChecks = [
  check('title').notEmpty(),
  check('price').notEmpty().isCurrency(),
  check('description').notEmpty(),
  check('category').notEmpty(),
  check('image').notEmpty().isURL(),
];

//Admin views the page to create a new product
router.get('/admin/newProduct', (req, res, next) => {
  try {
    if (isAdmin(res.app.locals.user)) {
      res.render('addProduct');
    } else {
      //Need a unauthorized page
      res.send("You're not authorized");
    }
  } catch (error) {
    next(error);
  }
});

//Admin creates a new product for sale
router.post('/admin/newProduct', productChecks, async (req, res, next) => {
  try {
    if (isAdmin(res.app.locals.user)) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({errors: errors.array()});
      }
      const product = await Product.create(req.body);
      res.render('singleProduct', product);
    } else {
      //Need a unauthorized page
      res.send("You're not authorized");
    }
  } catch (error) {
    next(error);
  }
});

// Admin updates the product information
router.put('/products/:productId/update', productChecks, async (req, res, next) => {
  try {
    if (isAdmin(res.app.locals.user)) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({errors: errors.array()});
      }
      const product = await Product.findByPk(req.params.productId);
      await product.update(req.body);
      res.status(200).json({id: req.params.productId});
    } else {
      //Need a unauthorized page
      res.send("You're not authorized");
    }
  } catch (error) {
    next(error);
  }
});

//Admin views the page to update a product
router.get('/products/:productId/update', async (req, res, next) => {
  try {
    if (isAdmin(res.app.locals.user)) {
      const product = await Product.findByPk(req.params.productId);
      res.render('updateProduct', {product: product});
    } else {
      //Need a unauthorized page
      res.send("You're not authorized");
    }
  } catch (error) {
    next(error);
  }
});

//Admin deletes a product from sale
router.delete('/products/:productId', async (req, res, next) => {
  try {
    if (isAdmin(res.app.locals.user)) {
      await Product.destroy({where: {id: req.params.productId}});
      res.sendStatus(200);
    } else {
      //Need a unauthorized page
      res.send("You're not authorized");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
