const express = require('express');

const {body}= require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup',[
body('password','Please enter a valid Password including text and numbers only, minimun length 5 characters')
.trim()
.isLength({min:5})
.isAlphanumeric(),
body('confirmPassword').trim().custom((value, { req } )=>{
 if(value !== req.body.password){
     throw new Error('Passwords have to match!');
 }
 return true;
})
], authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;