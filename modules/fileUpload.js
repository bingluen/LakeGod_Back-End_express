var multer = require('multer');
var md5 = require('blueimp-md5').md5;
var fileUpload = multer({
    dest: './fileUpload'
});

module.exports = fileUpload;
