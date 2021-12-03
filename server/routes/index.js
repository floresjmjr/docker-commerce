const router = require('express').Router();

//router.use('/apiroute, require(yourfilepath)')

//404 Error handler
router.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404;
    next(error);
})

module.exports = router;