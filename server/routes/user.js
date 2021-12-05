/* eslint-disable max-len */
const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {User} = require('../db');


const signupChecks = [
  check('name')
      .notEmpty().withMessage('name cannot be empty') // checks name is not empty
      .bail() // sends an error if this fails with out checking others in list
      .isLength({max: 50}).withMessage('name cannot exceed 50 chars') // max length can be 50
      .bail()
      .isAlpha('en-US', {ignore: ' '}).withMessage('name cannot contain number or symbols'), // can only have letters
  check('email')
      .isEmail() // checks if is email
      .bail()
      .custom(async (email)=>{ // checks if email is in use
        const user = await User.findByEmail(email);
        if (user) {
          throw new Error('This email is already in use');
        }
      }),
  check('password').notEmpty(), // want to make this stronger but the data seeeded will needd to match validations,
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
    console.log('HEREEEEEE', validationError);

    return res.render('signup', {validationError});
  }
  const newUser = await User.create(req.body);
  res.send(`<h3>Thanks your all signed up</h3>`);
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
