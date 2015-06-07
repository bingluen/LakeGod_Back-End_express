var express = require('express');
var router = express.Router();

var photo = require('../modules/photo');


/* Router setting  */
router.get('/getPhoto', photo.getPhoto);
router.post('/uploadPhoto', photo.uploadPhoto);

module.exports = router;