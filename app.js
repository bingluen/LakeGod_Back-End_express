/* Module */
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var multer = require('./modules/multer');

/* require Router setting */
var post = require('./routes/post');
var photo = require('./routes/photo');
var user = require('./routes/user');


var app = express();

/**
 * for post request
 * body-parser => x-www-form-urlencoded
 *  
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );
/**
 * for file upload & form-data 
 */
app.use(multer);

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
