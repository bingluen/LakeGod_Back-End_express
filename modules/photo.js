var database = require('./database');


var getPhoto = function (req, res, next) {
	var queryStatment = 'SELECT * FROM `photo` WHERE `photo_id` = ?;';
	var parameter = [];

	parameter.push(re.params.id);

	database.query(queryStatment, parameter, function(error, row, field) {
		if(error)
		{
			res.status(500).json({
				status_messages : 'Internal error',
				status_code: 500
			});
		}

		if(row.length == 1)
		{
			res.status(200).json({
				status_messages: 'successful!',
				status_code: 200
				photo:
			});
		}
	});

}


var uploadPhoto = function (req, res, next) {
	
}