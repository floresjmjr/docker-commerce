/* eslint-disable max-len */
const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {User, Order, Product} = require('../db');


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
// let validatationError;


router.get('/signup', async (req, res)=>{
  res.render('signup');
});

router.post('/signup', signupChecks, async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json({errors: errors.array()});
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

  // console.log('created new user: ', newUser);
  // console.log('new user after adding order: ', newUser.Orders);

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

  console.log("body recieved: ", req.body);
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


    res.app.locals.user = user;


    // ! This is a place holder for MVP.
    // ! This should return a json of the user to be stored locally
    res.redirect(`/`);
  } catch (err) {
    console.error(err);
  }
});


router.get('/logout', async (req, res) => {
  res.app.locals.user = undefined;
  res.redirect('/');
});

// get logged in user(and will display account page)
router.get('/:id', async (req, res) => {
  try {
    console.log(req);
    // const user = await User.findAll();
    res.json(req);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
