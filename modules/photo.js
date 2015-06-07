var database = require('./database');
var multer = require('multer');
var fs = require('fs');
var fse = require('fs-extra');
var md5 = require('MD5');
var dataFilter = require('./data-filter');
var path = require('path');

var getPhoto = function(req, res, next) {
    var queryStatment = 'SELECT * FROM `photo` WHERE `id` = ?;';
    var parameter = [];

    parameter.push(req.params.id);

    database.query(queryStatment, parameter, function(error, row, field) {
        if (error) {
            res.status(500).json({
                status_messages: 'Internal error',
                status_code: 500
            });
        }

        if (row.length == 1) {
            res.status(200).sendFile(path.join(__dirname, '../', row[0].path));
        }
    });

}

uploadPhoto = function(req, res, next) {
    var resMessages;
    var processUpload = multer({
        dest: './fileUpload',
        rename: function(fieldname, filename) {
            return md5(filename + Date.now());
        },
        onFileUploadStart: function(file, req, res) {},
        onFileUploadComplete: function(file, req, res) {
            /* 檢查有沒有重複檔案 */
            var fileContent = fs.readFileSync(file.path);
            var fileMd5 = md5(fileContent)
            var queryStatment = 'SELECT `path` FROM `photo` WHERE `md5_hash` = ? LIMIT 1;';
            var parameter = new Array(fileMd5);
            database.query(queryStatment, parameter, function(err, row, field) {
                if (err) {
                    /* 出錯，把暫存檔案刪掉 */
                    fse.removeSync(file.path);
                    res.status(500).json({
                        status_messages: 'Internal error',
                        status_code: 500
                    });
                    console.log("Error: check photo duplicate - " + err);
                }
                /* 有重複，檔案刪掉，直接以現有檔案路徑插入資料庫 */
                else if (row.length == 1) {
                    /* 刪除 */
                    fse.removeSync(file.path);
                    /* 插入資料 */
                    queryStatment = 'INSERT INTO `photo` (`author_id`, `md5_hash`, `path`) VALUES(?, ?, ?);';
                    parameter = new Array(dataFilter(req.body.fb_user_id), fileMd5, row[0].path);
                    database.query(queryStatment, parameter, function(err, row, field) {
                        if (err) {
                            /* 出錯，把暫存檔案刪掉 */
                            fse.removeSync(file.path);
                            res.status(500).json({
                                status_messages: 'Internal error',
                                status_code: 500
                            });
                            console.log("Error: insert photo data - " + err);
                        } else {
                            res.status(200).json({
                                status_code: 200,
                                status_messages: 'upload successful!',
                                photo_id: row.insertId
                            });
                        }
                    });
                }
                /* New File */
                else if (row.length <= 0) {
                    /* 插入資料 */
                    queryStatment = 'INSERT INTO `photo` (`author_id`, `md5_hash`, `path`) VALUES(?, ?, ?);';
                    parameter = new Array(dataFilter(req.body.fb_user_id), fileMd5, file.path);
                    database.query(queryStatment, parameter, function(err, row, field) {
                        if (err) {
                            /* 出錯，把暫存檔案刪掉 */
                            fse.removeSync(file.path);
                            res.status(500).json({
                                status_messages: 'Internal error',
                                status_code: 500
                            });
                            console.log("Error: insert photo data - " + err);
                        } else {
                            res.status(200).json({
                                status_code: 200,
                                status_messages: 'upload successful!',
                                photo_id: row.insertId
                            });
                        }
                    });
                }
            });
        },
        onParseEnd: function(req, next) {
        }.bind(this)
    });
    processUpload(req, res, next);
}

module.exports.getPhoto = getPhoto;
module.exports.uploadPhoto = uploadPhoto;
