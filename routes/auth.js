const express = require('express');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const verifyToken = require('../middleware/verifyToken')

const {userSignup,userSignin,follow_user,unfollow_user} = require ('../controller/auth')



//signup for user
router.post('/signup', userSignup)

//signin for user
router.post('/signin',userSignin)

//to follow a user
router.put('/follow',verifyToken,follow_user)

//to unfollow a user
router.put('/unfollow',verifyToken,unfollow_user)


module.exports = router