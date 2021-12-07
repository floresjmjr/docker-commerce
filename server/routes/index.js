const router = require('express').Router();
const Handlebars = require('handlebars');
Handlebars.registerHelper('isdefined', function(value) {
  return value !== undefined;
});


// router.use('/apiroute', require('./yourfilepath'))
router.use('/user', require('./user'));
router.use('/products', require('./products'));
router.use('/', require('./admin'));

// 404 Error handler
router.use((req, res, next) => {
  res.render('notFound', {path: req.path})
});

// Default error handler
router.use((err, req, res, next) => {
  console.error(`Method: ${req.method}`);
  console.error(`URI involved: ${req.instance}`)
  console.error(`Status Code: ${req.status}`)
  console.error(`Technical Error Message: ${err}`);
  console.error(`Human readable error message: ${req.title}`)
  console.error(`Detailed error message: ${req.detail}`)
  res.status(500).send('Server error, please try again or at some other time.');
  // Ideally a cool 500 page would be rendered
});


module.exports = router;
