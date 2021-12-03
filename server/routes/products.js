const router = require('express').Router();
const Product= require('../db/models/Product');

router.get('/', async (req, res)=>{
  const products = await Product.findAll();
  res.render('products', {products});
});
module.exports = router;
