/* Module */
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var connectMultiparty = require('connect-multiparty');
var multer = require('./modules/multer');

/* require Router setting */
var post = require('./routes/post');
var photo = require('./routes/photo');
var user = require('./routes/user');


var app = express();

/**
 * for post request
 * body-parser => x-www-form-urlencoded
 * connect-multiparty = > form-data
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );
app.use(connectMultiparty());

/* Set router  */
app.use('/post', post);
app.use('/photo', photo);
app.use('/user', user);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    //var err = new Error('Not Found');
    //err.status = 404;
    //next(err);
    res.status(404).json({
    	messages: "404 Not Found"
    });
});

module.exports = app;
