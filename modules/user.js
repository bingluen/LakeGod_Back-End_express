var database = require('./database');
var facebook = require('./facebook');
var userHelper = require('./helper/userHelper');
var postHelper = require('./helper/postHelper');

var login = function(req, res, next) {

    facebook({
        fbtoken: req.params.fbtoken,
        LoginCallback: function(body) {
            if (!body.vaild)
                res.status(412).json({
                    status_messages: 'facebook token fail.',
                    status_code: 412
                });
            else
                checkUserExists(body.data);
        }
    });

    var checkUserExists = function(userid) {
        var queryStatment = 'SELECT `id` FROM `user` WHERE id = ?;';
        var parameter = new Array(userid.id);
        database.query(queryStatment, parameter, function(err, row, field) {
            if (err) {
                res.status(500).json({
                    status_messages: 'Internal error',
                    status_code: 500
                });
                console.log("Error: check user exists - " + err);
            } else if (row.length == 1) {
                res.status(200).json({
                    status_messages: 'login successful!',
                    status_code: 200
                });
            } else if (row.length == 0) {
                register(userid);
            } else {
                res.status(500).json({
                    status_messages: 'Internal error',
                    status_code: 500
                });
                /* 理論上不該走到這 */
                console.log("Error: Unknow Error ");
            }

        })
    }

    var register = function(user) {
        var queryStatment = 'INSERT INTO `user` (`id`, `name`, `email`) VALUE (?, ?, ?);';
        var parameter = new Array(user.id, user.name, user.email);
        database.query(queryStatment, parameter, function(err, row, field) {
            if (err) {
                res.status(500).json({
                    status_messages: 'Internal error',
                    status_code: 500
                });
                console.log("Error: user register - " + err);
            } else {
                res.status(200).json({
                    status_messages: 'Register successful!',
                    status_code: 200,
                });
            }
        });
    }
};

var myPost = function(req, res, next) {

    var getMyPost = function(body) {
        if (!body.vaild)
            res.status(412).json({
                status_messages: 'facebook token fail.',
                status_code: 412
            });
        else {
            var queryStatment = 'SELECT user.name AS author_name, result.* FROM (SELECT * FROM post WHERE post.author_id = ?) result, user WHERE result.author_id = user.id';
            var parameter = new Array(body.data.id)
            database.query(queryStatment, parameter, function(err, row, fields) {
                if (err) {
                    res.status(500).json({
                        status_messages: 'Internal error',
                        status_code: 500
                    });
                    console.log("Error: get My post - " + err);
                } else if (row.length > 0) {
                    res.status(200).json({
                        status_messages: "myPost API!",
                        status_code: 200,
                        data: postHelper.timezoneConvert(row)
                    });
                } else {
                    res.status(404).json({
                        status_messages: 'get myPost! Not found',
                        status_code: 404
                    })
                }
            });
        }
    };

    facebook({
        fbtoken: req.params.fbtoken,
        LoginCallback: getMyPost
    });
};

module.exports.login = login;
module.exports.myPost = myPost;
