//web service module - express
var express = require('express');
//access mysql service
var mysql = require('mysql');
//https service
var https = require('https');

var app = express();
var port = 443;
var appname = "lakegod";

//var server = https.createServer(opts, app);

var server = app.listen(port, function () {
	var host = server.address().address;
	var port = server.address().port;
});

app.use(require('body-parser')()); // for post
//app.use(require('connect-multiparty')());

//Router
app.get('/', homePage);

function homePage (req, res) {
	res.statusCode = 200;
	res.sendfile("index.html");
}
	
