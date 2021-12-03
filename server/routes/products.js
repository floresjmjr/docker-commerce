const router = require('express').Router();
const Product = require('../db/models/Product');

router.get('/:id', async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    res.render('single-product', {product});
});

module.exports = router;