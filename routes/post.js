const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken')
const {createPost,myPost,getAllpost,post_like,post_unlike,post_comment,followersPost} = require('../controller/post')

//to create a post
router.post('/create-post',verifyToken,createPost)

//to get the post of user which is loggedIn
router.get('/my_post',verifyToken,myPost)

//to get the post of users who are following
router.get('/followers_post',verifyToken,followersPost)

//to get all posts that are posted
router.get('/all_post',getAllpost)

//to update the post collection for like
router.put('/like',verifyToken,post_like)

//to update the post collection for unlike
router.put('/unlike',verifyToken,post_unlike)

//to comment on a post
router.put('/comment',verifyToken,post_comment)







module.exports = router

