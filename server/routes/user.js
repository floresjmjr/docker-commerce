/* eslint-disable max-len */
const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {User, Order, Product} = require('../db');

// validations for signup
const signupChecks = [
  check('name')
      .notEmpty().withMessage('Name cannot be empty') // checks name is not empty
      .bail() // sends an error if this fails with out checking others in list
      .isLength({max: 50}).withMessage('Name cannot exceed 50 chars') // max length can be 50
      .bail()
      .isAlpha('en-US', {ignore: ' '}).withMessage('Name cannot contain numbers or symbols'), // can only have letters
  check('email')
      .isEmail() // checks if is email
      .bail()
      .custom(async (email)=>{ // checks if email is in use
        const user = await User.findByEmail(email);
        if (user) {
          throw new Error('This email is already in use');
        }
      }),
  check('password').notEmpty().withMessage('Password cannot be empty'), // want to make this stronger but the data seeeded will needd to match validations,
];

// get signup page
router.get('/signup', async (req, res)=>{
  res.render('signup');
});
// create a user
router.post('/signup', signupChecks, async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationError = errors.array();
    return res.render('signup', {validationError});
  }
  // create user
  const user = await User.create(req.body);
  // give them a cart
  await user.createOrder({});
  // get new User with orders
  const [newUser] = await User.findAll({
    where: {id: user.id},
    include: {
      model: Order,
      include: Product,
    },
  });

  // auto login
  res.app.locals.user = newUser;

  res.redirect(`/`);
});

// login page
router.get('/login', async (req, res) => {
  res.render('login');
});


// verify user exist, and return user data if they do
router.post('/login', async (req, res) => {
  console.log('body recieved: ', req.body);
  try {
    // check user by email
    const [user] = await User.findAll({
      where: {
        email: req.body.email,
      },
      include: {
        model: Order,
        include: Product,
      },
    });

    // check if account with email exists
    if (!user) {
      throw new Error('No user associated with email');
    }

    // check if password matches
    if (user.password !== req.body.password) {
      throw new Error('Password does not match user');
    }

    console.log('response being sent: ', user);

    res.json(user);

    res.app.locals.user = user;


    // ! This is a place holder for MVP.
    // ! This should return a json of the user to be stored locally
    // res.redirect(`/`);
  } catch (err) {
    console.error(err);
  }
});

// get logout page
router.get('/logout', async (req, res) => {
  res.app.locals.user = undefined;
  res.redirect('/');
});
// get user account page
router.get('/account', async (req, res)=>{
  const recentPurchases = await Order.findAll({where: {
    userId: res.app.locals.user.id,
    isPurchased: 1,
  }, include: Product});

  res.render('account', {user: res.app.locals.user, orderHistory: recentPurchases});
});
// update user information
router.post('/account/update', async (req, res)=>{
  const user = await User.findByPk(res.app.locals.user.id);
  res.app.locals.user = await user.update(req.body);

  res.redirect(301, '/user/account');
});

// get logged in user(and will display account page)
router.get('/:id', async (req, res) => {
  try {
    // const user = await User.findAll();
    res.json(req);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
