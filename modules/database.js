var config = require('../config.json');
var mysql = require('mysql');

var database = {};

database = mysql.createConnection({
	host: config.dbhost,
	user: config.username,
	password: config.password,
	database: config.dbname
});

module.exports = database;