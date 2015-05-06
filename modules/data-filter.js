var datafilter = function (data, method) {
	method = typeof method !== 'undefined' ? a : 0;
	switch (method) {
		default:
			return defaultFilter(data);
	}

}


var defaultFilter = function (data)
{
	if(typeof data !== 'undefined')
		return data;
	else
		return '';
}

module.exports = datafilter;