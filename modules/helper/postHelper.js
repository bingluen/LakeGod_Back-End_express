var database = require('../database');
var config = require('../../config.json');

var getPostAuthorId = function(postid, next) {
    database.query('SELECT `author_id` FROM `post` WHERE `id` = ?', postid, function(error, row, fields) {
        if (error) {
            res.status(500).json({
                status_messages: 'Internal error',
                status_code: 500
            });
            console.log('ERROR: postHelper.getPostAuthorId:' + error);
        }
        if (row.length == 1)
            next(row[0]['author_id']);
        else
            return undefined;
    });
};


var timezoneConvert = function(rows) {
	var moment = require('moment-timezone');
    for (var i = 0; i < rows.length; i++) {
    	rows[i]['occure_time'] = moment(rows[i]['occure_time']).tz(config.timezone).format();
    	rows[i]['upload_time'] = moment(rows[i]['upload_time']).tz(config.timezone).format();
        //photo id join path
        rows[i]['photos'] = rows[i]['photos'].split(',');
        console.log(rows[i]['photos']); 
        for(var j = 0; j < rows[i]['photos'].length; j++)
        {
            rows[i]['photos'][j] = 'photo/getPhoto/'+rows[i]['photos'][j];
        }
        rows[i]['photos'] = rows[i]['photos'].toString();
        console.log(rows[i]['photos']); 
    }
    return rows;
}

module.exports.getPostAuthorId = getPostAuthorId;
module.exports.timezoneConvert = timezoneConvert;