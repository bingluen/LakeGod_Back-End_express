var express = require('express');
var router = express.Router();

var post = require('../modules/post');

/* Router setting */

router.post('/addPost', post.addPost);
router.get('/getPost/', post.getPost);
router.get('/getPost/:id', post.getPost);
router.post('/deletePost', post.deletePost);
router.post('/updatePost', post.updatePost);

module.exports = router;
