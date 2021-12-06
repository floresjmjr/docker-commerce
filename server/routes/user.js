const router = require('express').Router();
const {User} = require('../db');

router.get('/signup', async (req, res)=>{
  res.render('signup');
});

router.post('/signup', async (req, res)=>{
  const newUser = await User.create(req.body);
  res.send(`<h3>Thanks your all signed up</h3>`);
});

// login page
router.get('/login', async (req, res) => {
  res.render('login');
});

// verify user exist, and return user data if they do
router.post('/login', async (req, res) => {
  console.log('req.body: ', req.body);
  try {
    // check user by email
    const [user] = await User.findAll({
      where: {
        email: req.body.email,
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

    res.send(`<h3>Welcome back ${user.name}!</h3>`);
  } catch (err) {
    console.error(err);
  }
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
