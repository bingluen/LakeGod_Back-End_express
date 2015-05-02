//web service module - express
var express = require('express');
//access mysql service
var mysql = require('mysql');
//https service
var https = require('https');

var querystring = require('querystring');

var app = express();
var port = 443;
var appname = "lakegod";

//var server = https.createServer(opts, app);

var server = app.listen(port, function () {
	var host = server.address().address;
	var port = server.address().port;
});

//Router

/* POST Module 
app.post('post/addPost', addPost);
app.get('post/getPost', getPost);
app.get('post/deletePost',deletePost);
app.post('post/updatePost', updatePost);
*/

/* PHOTO Module
app.get('photo/getPhoto', getPhoto);
app.post('photo/uploadPhoto', uploadPhoto);
app.get('photo/')
*/

app.get('*', NotFound);



function homePage (req, res) {
	res.statusCode = 200;
	res.sendfile("index.html");
}
	
function NotFound(req, res) {
	console.log(404+"path : "+req.path)
	res.statusCode = 404;
	res.sendfile("html/404.html");
}

function addPost(req, res) {

}