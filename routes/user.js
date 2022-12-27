const express = require('express');

const router = express.Router();



// User register URL using HTTP post => /user/register
router.post('/register', (req, res) => {
    let errors = [];
    let success_msg = 'User registered successfully.';
    // Do exercise 3 here

    if (req.body.password !== req.body.password2) {
        errors.push({ text: 'password do not match!' });
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'password must be at least 4 characters!' });
    }

    if (errors.length > 0) {
        res.render('user/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,

        });
    } else {
        res.render('user/login', { success_msg: success_msg }); // 
    }

});


module.exports = router;