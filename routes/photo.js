var express = require('express');
var router = express.Router();

var photo = require('../module/photo');


router.get('/getPhoto', photo.getPhoto);
router.post('/uploadPhoto', photo.uploadPhoto);


module.exprots = router;