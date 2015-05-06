var database = require('./database');

var dataFilter = require('./data-filter');

var postHelper = require('./helper/postHelper');

var getPost = {}

getPost.List = function(req, res, next) {
    var queryStatement = '';
    var parameter = [];
    var pages = req.params.pages > 0 ? (req.params.pages - 1) * 20 : 0;

    if (req.params.type === 'all') {
        queryStatement = 'SELECT * FROM `post` ORDER BY `upload_time` LIMIT ?, 20;';
        parameter.push(pages);
    } else {
        queryStatement = 'SELECT * FROM `post` WHERE `type` = ? ORDER BY `upload_time` LIMIT ?, 20;';
        parameter.push(req.params.type);
        parameter.push(pages);
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
    database.query('SELECT * FROM `post` WHERE id = ?', req.params.id, function(error, row, fields) {
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
    var parameter = '';
    if (req.params.type === 'all') {
        queryStatement = 'SELECT * FROM `post` WHERE `title` LIKE ?;';
        parameter = '%' + req.params.key + '%';
    } else {
        queryStatement = 'SELECT * FROM `post` WHERE `title` LIKE ? AND `type` = ?;';
        parameter = new Array('%' + req.params.key + '%', req.params.type);
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
        queryStatement = 'SELECT * FROM `post` WHERE `tag` LIKE ?;';
        parameter = '%' + req.params.key + '%';
    } else {
        queryStatement = 'SELECT * FROM `post` WHERE `tag` LIKE ? AND `type` = ?;';
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
        queryStatement = 'SELECT * FROM `post` WHERE `author_name` LIKE ? OR `author_id` = ?;';
        parameter = new Array('%' + req.params.key + '%', req.params.key);
    } else {
        queryStatement = 'SELECT * FROM `post` WHERE (`author_name` LIKE ? OR `author_id` = ?) AND `type` = ?;';
        parameter = new Array('%' + req.params.key + '%', req.params.key, req.params.type);
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

var addPost = function(req, res, next) {

    /* 準備 資料 */
    var data = req.body;

    /* 驗證FB token是否合法 */

    /* 驗證FB_id是否已註冊 */
    var userHelper = require('./helper/userHelper');


    userHelper.getUserName(dataFilter(data['fb_user_id']), function(username) {
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
            parameter.push(dataFilter(username));
            parameter.push(dataFilter(data['type']));
            parameter.push(dataFilter(data['location']));
            parameter.push(dataFilter(data['map_lat']));
            parameter.push(dataFilter(data['map_lng']));
            parameter.push(dataFilter(data['occure_time']));

            var queryStatement = 'INSERT INTO `post`(`title`, `tag`, `description`, `photos`, `author_id`, `author_name`, `type`, `location`, `map_lat`, `map_lng`, `occure_time`) VALUE( ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ? );';

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
    });
};

var deletePost = function(req, res, next) {
    res.status(200).json({
        message: 'deletePost API!'
    });
};

var updatePost = function(req, res, next) {
    res.status(200).json({
        message: 'updatePost API!'
    });
};

module.exports.getPost = getPost;
module.exports.addPost = addPost;
module.exports.deletePost = deletePost;
module.exports.updatePost = updatePost;
