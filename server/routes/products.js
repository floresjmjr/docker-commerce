const router = require('express').Router();
const Product = require('../db/models/Product');

router.get('/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  const context = {
    product: product,
    admin: false,
  }
  if(res.app.locals.user){
    if(res.app.locals.user.type === 'Admin') { context.admin = true;}
  }
  res.render('single-product', context);
});

router.get('/', async (req, res)=>{
  const products = await Product.findAll();
  const context = {
    products: products,
    admin: false,
  }
  if(res.app.locals.user){
    if(res.app.locals.user.type === 'Admin') { context.admin = true;}
  }

  res.render('products', context);
});

module.exports = router;
