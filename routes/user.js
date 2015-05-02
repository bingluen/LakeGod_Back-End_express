var express = require('express');
var router = express.Router();

var user = require('../modules/user');

/* Router setting */

router.get('/login', user.login);
router.get('/myPost', user.myPost);

module.exports = router;