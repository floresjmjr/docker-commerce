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


module.exports = router