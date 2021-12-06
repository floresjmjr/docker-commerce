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
  try {
    // check user by email
    const [user] = await User.findAll({
      where: {
        email: req.body.email,
      },
    });

    console.log(`found user: `, user);
    console.log(`password given: `, req.body.password);
    console.log('user.password = ', user.password);
    // check if password matches
    if (user.password === req.body.password) {
      res.send(`<h3> Welcome back ${user.name}! </h3>`);
    } else {
      throw new Error('Password does not match user');
    }
  } catch (err) {
    //! id LOVE to split this into two errors, 
    // letting user know if email exists vefore password does not match
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
