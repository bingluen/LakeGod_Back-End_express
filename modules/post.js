var getPost = function (req, res, next) {
	/**
	 * req.params.id === undefined 時
	 * 視為使用其他條件讀取文章
	 */
	

	res.status(200).json({
        message: "getPost API!",
        id: req.params.id
    });
};

var addPost = function (req, res, next) {
	res.status(200).json({
		message: "addPost API!"
	});
};

var deletePost = function (req, res, next) {
	res.status(200).json({
		message: "deletePost API!"
	});
};

var updatePost = function (req, res, next) {
	res.status(200).json({
		message: "updatePost API!"
	});
};

module.exports.getPost = getPost;
module.exports.addPost = addPost;
module.exports.deletePost = deletePost;
module.exports.updatePost = updatePost;