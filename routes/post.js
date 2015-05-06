var express = require('express');
var router = express.Router();

var post = require('../modules/post');

/* Router setting */

router.post('/addPost', post.addPost);
router.get('/getPost/list/:pages', post.getPost.List);
router.get('/getPost/id/:id', post.getPost.ByID);
router.get('/getPost/title/:key/:type', post.getPost.ByTitle);
router.get('/getPost/tag/:key/:type', post.getPost.ByTag);
router.get('/getPost/user/:key/:type', post.getPost.ByUser);
//router.get('/getPost/occure_time/:start-:end/:type', post.getPost.ByOccureTime);
//router.get('/getPost/upload_time/:start-:end/:type', post.getPost.ByUploadTime);

router.post('/deletePost', post.deletePost);
router.post('/updatePost', post.updatePost);

module.exports = router;
