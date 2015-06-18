var database = require('./database');

var dataFilter = require('./data-filter');

var postHelper = require('./helper/postHelper');

var getPost = {}

var appConfig = require('../appConfig.json')

getPost.List = function(req, res, next) {
    var queryStatement = '';
    var parameter = [];
    var pages = req.params.pages > 0 ? (req.params.pages - 1) * appConfig.post.postNumOfList : 0;

    if (req.params.type.toLowerCase() === 'all') {
        //
        queryStatement = 'SELECT result.*, user.name as author_name FROM (SELECT * FROM `post` ORDER BY `upload_time` LIMIT ?, ?) result, user Where result.author_id = user.id;';
        parameter.push(pages);
        parameter.push(appConfig.post.postNumOfList);
    } else {
        queryStatement = 'SELECT result.*, user.name as author_name FROM (SELECT * FROM `post` WHERE `type` = ? ORDER BY `upload_time` LIMIT ?, ?) result, user Where result.author_id = user.id;';
        parameter.push(req.params.type);
        parameter.push(pages);
        parameter.push(appConfig.post.postNumOfList);
    }


    database.query(queryStatement, parameter, function(error, row, fields) {
        if (error) {
            res.status(500).json({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getPost.List :' + error);
        }
        if (row.length > 0) {
            res.status(200).json({
                status_messages: 'getPost API! page ' + req.params.pages + ' Access Success.',
                status_code: 200,
                data: postHelper.timezoneConvert(row)
            });
        } else {
            res.status(404).json({
                status_messages: 'getPost Api! Not found.',
                status_code: 404
            })
        }
    });
};

getPost.ByID = function(req, res, next) {

    database.query('SELECT result.*, user.name as author_name FROM (SELECT * FROM `post` WHERE id = ?) result, user Where result.author_id = user.id;', req.params.id, function(error, row, fields) {
        if (error) {
            res.status(500).json({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getPost.ByID :' + error);
        }
        if (row.length > 0) {
            res.status(200).json({
                status_messages: 'getPost API By id! Access Success.',
                status_code: 200,
                data: postHelper.timezoneConvert(row)[0]
            });
        } else {
            res.status(404).json({
                status_messages: 'getPost Api by id! Not found.',
                status_code: 404
            })
        }
    });

};

getPost.ByTitle = function(req, res, next) {
    var queryStatement = '';
    var parameter = [];
    if (req.params.type === 'all') {
        queryStatement = 'SELECT result.*, user.name as author_name FROM (SELECT * FROM `post` WHERE `title` LIKE ?) result, user Where result.author_id = user.id;';
        parameter.push('%' + req.params.key + '%');
    } else {
        queryStatement = 'SELECT result.*, user.name as author_name FROM (SELECT * FROM `post` WHERE `title` LIKE ? AND `type` = ?;) result, user Where result.author_id = user.id;';
        parameter.push('%' + req.params.key + '%')
        parameter.push(req.params.type);
    }

    database.query(queryStatement, parameter, function(error, row, fields) {
        if (error) {
            res.status(500).json({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getPost.ByTitle :' + error);
        }
        if (row.length > 0) {
            res.status(200).json({
                status_messages: 'getPost API by Title! Access Success',
                status_code: 200,
                data: postHelper.timezoneConvert(row)
            });
        } else {
            res.status(404).json({
                status_messages: 'getPost Api by Title! Not found',
                status_code: 404
            })
        }
    });

}

getPost.ByTag = function(req, res, next) {
    var queryStatement = '';
    var parameter = '';
    if (req.params.type === 'all') {
        queryStatement = 'SELECT result.*, user.name as author_name FROM (SELECT * FROM `post` WHERE `tag` LIKE ?) result, user Where result.author_id = user.id;';
        parameter = '%' + req.params.key + '%';
    } else {
        queryStatement = 'SELECT result.*, user.name as author_name FROM (SELECT * FROM `post` WHERE `tag` LIKE ? AND `type` = ?) result, user Where result.author_id = user.id;';
        parameter = new Array('%' + req.params.key + '%', req.params.type);
    }
    database.query(queryStatement, parameter, function(error, row, fields) {
        if (error) {
            res.status(500).json({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getPost.ByTag :' + error);
        }
        if (row.length > 0) {
            res.status(200).json({
                status_messages: 'getPost API by Tag! Access Success',
                status_code: 200,
                data: postHelper.timezoneConvert(row)
            });
        } else {
            res.status(404).json({
                status_messages: 'getPost Api by Tag! Not found',
                status_code: 404
            })
        }
    });

}

getPost.ByUser = function(req, res, next) {
    var queryStatement = '';
    var parameter = '';
    if (req.params.type === 'all') {
        queryStatement = 'SELECT * FROM (SELECT post.*, user.name as author_name FROM user, post WHERE post.author_id = user.id) result WHERE result.author_name LIKE ?;';
        parameter = new Array('%' + req.params.key + '%');
    } else {
        queryStatement = 'SELECT * FROM (SELECT post.*, user.name as author_name FROM user, post WHERE post.author_id = user.id) result WHERE result.author_name LIKE ? AND result.type = ?;';
        parameter = new Array('%' + req.params.key + '%', req.params.type);
    }
    database.query(queryStatement, parameter, function(error, row, fields) {
        if (error) {
            res.status(500).json({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getPost.ByUser :' + error);
        }
        if (row.length > 0) {
            res.status(200).json({
                status_messages: 'getPost API by User! Access Success',
                status_code: 200,
                data: postHelper.timezoneConvert(row)
            });
        } else {
            res.status(404).json({
                status_messages: 'getPost Api by User! Not found',
                status_code: 404
            })
        }
    });

}


getPost.ByLocation = function(req, res, next) {
    var queryStatement = '';
    var parameter = '';
    if (req.params.type === 'all') {
        queryStatement = 'SELECT result.*, user.name as author_name FROM (SELECT * FROM `post` WHERE `location` LIKE ? ) result, user Where result.author_id = user.id;';
        parameter = new Array('%' + req.params.key + '%');
    } else {
        queryStatement = 'SELECT result.*, user.name as author_name FROM (SELECT * FROM `post` WHERE `location` LIKE ? AND `type` = ?) result, user Where result.author_id = user.id;';
        parameter = new Array('%' + req.params.key + '%', req.params.type);
    }
    database.query(queryStatement, parameter, function(error, row, fields) {
        if (error) {
            res.status(500).json({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('Error: getPost.Bylocation :' + error);
        }
        if (row.length > 0) {
            res.status(200).json({
                status_messages: 'getPost API by location! Access Success',
                status_code: 200,
                data: postHelper.timezoneConvert(row)
            });
        } else {
            res.status(404).json({
                status_messages: 'getPost Api by location! Not found',
                status_code: 404
            })
        }
    });
}

var addPost = function(req, res, next) {

    /* 準備 資料 */
    var data = req.body;

    /* 驗證FB token是否合法 */
    var token = data['fb_token'];
    var facebook = require('./facebook');

    /* 驗證FB_id是否已註冊 */
    var userHelper = require('./helper/userHelper');

    facebook({
        fbtoken: data['fb_token'],
        LoginCallback: function(body) {
            if (body.vaild)
                userHelper.getUserName(body.data.id, post);
            else {
                res.status(412).json({
                    status_messages: 'facebook token fail.',
                    status_code: 412
                });
            }
        }
    });

    var post = function(username, user_id) {
        /* 不合法直接退貨w */
        if (!(typeof username !== 'undefined')) {
            res.status(412).json({
                status_messages: 'Unregistered users id.',
                status_code: 412
            });
        } else {
            var parameter = [];
            parameter.push(dataFilter(data['title']));
            parameter.push(dataFilter(data['tag']));
            parameter.push(dataFilter(data['description']));
            parameter.push(dataFilter(data['photos']));
            parameter.push(dataFilter(data['fb_user_id']));
            parameter.push(dataFilter(data['type']));
            parameter.push(dataFilter(data['location']));
            parameter.push(dataFilter(data['map_lat']));
            parameter.push(dataFilter(data['map_log']));
            parameter.push(dataFilter(data['occure_time']));

            var queryStatement = 'INSERT INTO `post`(`title`, `tag`, `description`, `photos`, `author_id`, `type`, `location`, `map_lat`, `map_lng`, `occure_time`) VALUE( ? , ? , ? , ? , ? , ? , ? , ? , ?, ? );';

            /* 儲存到資料庫 */
            database.query(queryStatement, parameter, function(error, row, fields) {
                if (error) {
                    res.status(500).json({
                        status_messages: 'occure error when saving data.',
                        status_code: 500
                    });
                    console.log('Error: addPost:' + error);
                } else {
                    res.status(200).json({
                        status_messages: 'addPost API! successful!',
                        status_code: 200
                    });
                }
            });
        }
    }
};


module.exports.getPost = getPost;
module.exports.addPost = addPost;
