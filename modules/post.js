var database = require('./database')

var getPost = {}

getPost.ByID = function(req, res, next) {
    database.query('SELECT * FROM `post` WHERE id = ?', req.params.id, function(error, row, fields) {
        if (row.length > 0) {
            res.status(200).json({
                status_messages: "getPost API By id! Access Success.",
                status_code: 200,
                data: row[0]
            });
        } else {
        	res.status(404).json({
        		status_messages: "getPost Api by id! Not found.",
        		status_code: 404
        	})
        }
    });

};

getPost.ByTitle = function(req, res, next) {
	var queryStatement = '';
	var parameter = '';
	if (req.params.type === 'all')
	{
		queryStatement = 'SELECT * FROM `post` WHERE `title` LIKE ?;';
		parameter = '%' + req.params.key + '%';
	}
	else
	{
		queryStatement = 'SELECT * FROM `post` WHERE `title` LIKE ? AND `type` = ?;';
		parameter = new Array('%' + req.params.key + '%', req.params.type);
	}

    database.query(queryStatement, parameter, function(error, row, fields) {
        if (row.length > 0) {
            res.status(200).json({
                status_messages: "getPost API by Title! Access Success",
                status_code: 200,
                data: row
            });
        } else {
        	res.status(404).json({
        		status_messages: "getPost Api by Title! Not found",
        		status_code: 404
        	})
        }
    });

}

getPost.ByTag = function(req, res, next) {
	var queryStatement = '';
	var parameter = '';
	if (req.params.type === 'all')
	{
		queryStatement = 'SELECT * FROM `post` WHERE `tag` LIKE ?;';
		parameter = '%' + req.params.key + '%';
	}
	else
	{
		queryStatement = 'SELECT * FROM `post` WHERE `tag` LIKE ? ANT `type` = ?;';
		parameter = new Array('%' + req.params.key + '%', req.params.type);
	}
    database.query(queryStatement, parameter, function(error, row, fields) {
        if (row.length > 0) {
            res.status(200).json({
                status_messages: "getPost API by Tag! Access Success",
                status_code: 200,
                data: row
            });
        } else {
        	res.status(404).json({
        		status_messages: "getPost Api by Tag! Not found",
        		status_code: 404
        	})
        }
    });

}

getPost.ByUser = function(req, res, next) {
	var queryStatement = '';
	var parameter = '';
	if (req.params.type === 'all')
	{
		queryStatement = 'SELECT * FROM `post` WHERE `author_name` LIKE ? OR `author_id = ?;';
		parameter = new Array('%' + req.params.key + '%', req.params.key);
	}
	else
	{
		queryStatement = 'SELECT * FROM `post` WHERE (`author_name` LIKE ? OR `author_id = ?) AND `type` = ?;';
		parameter = new Array('%' + req.params.key + '%', req.params.key, req.params.type);
	}
    database.query(queryStatement, parameter, function(error, row, fields) {
        if (row.length > 0) {
            res.status(200).json({
                status_messages: "getPost API by User! Access Success",
                status_code: 200,
                data: row
            });
        } else {
        	res.status(404).json({
        		status_messages: "getPost Api by User! Not found",
        		status_code: 404
        	})
        }
    });

}

var addPost = function(req, res, next) {
	console.log(req.body);
    res.status(200).json({
        message: "addPost API!"
    });
};

var deletePost = function(req, res, next) {
    res.status(200).json({
        message: "deletePost API!"
    });
};

var updatePost = function(req, res, next) {
    res.status(200).json({
        message: "updatePost API!"
    });
};

module.exports.getPost = getPost;
module.exports.addPost = addPost;
module.exports.deletePost = deletePost;
module.exports.updatePost = updatePost;
