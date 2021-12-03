const router = require('express').Router()
const {Product} = require('../db/index')

router.get('/admin/newProduct', (req, res)=>{
  //verify that person is admin
  console.log(req)
  res.render('AddProduct')
})

router.post('/admin/newProduct', async(req, res)=>{
  const product = await Product.create(
    {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      image: req.body.image,
      inventoryCount: req.body.inventoryCount
    })
  //talk to Jonathan about the name of this page
  res.render('product', product)
})

router.get('/product/:productId/update', async(req, res)=>{
  const product = await Product.findByPk(req.params.productId)
  res.render('updateProduct', product)
})

router.put('/product/:productId/update', async(req, res)=>{
  const product = await Product.findByPk(req.params.productId)
  //is req.body sufficient??
  await product.update(req.body)
  res.render('product', product)
})

router.delete('/product/:productId', async(req,res)=>{
  await Product.destroy({where: {id: req.params.productId}})
  const products = await Product.findAll()
  res.render('allProducts', products)
})

module.exports = router