var database = require('./database');

var login = function(req, res, next) {
    res.status(200).json({
        message: "login API!"
    });
};

var myPost = function(req, res, next) {
    res.status(200).json({
        message: "myPost API!"
    });
};

module.exports.login = login;
module.exports.myPost = myPost;
