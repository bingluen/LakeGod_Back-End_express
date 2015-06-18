var database = require('../database');

var getUserName = function(userid, next) {
    database.query('SELECT `name` FROM `user` WHERE `id` = ?', userid, function(error, row, fields) {
        if (error) {
            res.status(500).json({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('ERROR: userHelper.getUserName:' + error);
        }
        if (row.length == 1)
            next(row[0].name, userid);
        else
            next(undefined);
    });
};

module.exports.getUserName = getUserName;
