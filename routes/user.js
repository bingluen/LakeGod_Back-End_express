var express = require('express');
var router = express.Router();

var user = require('../modules/user');

/* Router setting */

router.get('/login/:fbtoken', user.login);
router.get('/myPost/:fbtoken', user.myPost);

module.exports = router;