const router = require('express').Router();

// router.use('/apiroute', require('./yourfilepath'))
router.use('/user', require('./user'));
router.use('/products', require('./products'));
router.use('/', require('./admin'));

// 404 Error handler
router.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Default error handler
router.use((err, req, res, next) => {
  console.error(`Start of Error:\n ${err} \n`);
  console.error(`Status:\n ${req.status}\n`);
  console.error(`Status:\n ${req.method}\n`)
  res.status(500).send('Server error, please try again or at some other time.');
  // Ideally a cool 500 page would be rendered
});

module.exports = router;
