const router = require('express').Router()
const {User} = require('../db');


router.get('/:id', async (req, res) => {
    try{
        const user = await User.findByPk(req.params.id);
        res.json(user);
    } catch (err) {
        console.error(err);
    }
})


router.get('/signup', async (req, res)=>{
  res.render('signup');
});

router.post('/signup', async (req, res)=>{
  const newUser = await User.create(req.body);
  res.send(`<h3>Thanks your all signed up</h3>`);
});

module.exports = router;