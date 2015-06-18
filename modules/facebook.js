var database = require('./database');
var https = require('https');
var config = require('../config.json');

var facebook = function(option) {
    this.option = option || {};
    if (!option.fbtoken) {
        throw err;
    }

    config = {
        appid: config.fbappid,
        graphAPI: {
            app: 'https://graph.facebook.com/app',
            me: 'https://graph.facebook.com/me'
        },
        fields: 'id,name,email'
    }

    this.Check = function() {
        callback = option.CheckCallback || Login;
        fbtoken = option.fbtoken;
        Download(config.graphAPI.app + '?fields=id&&access_token' + fbtoken, function(body) {
            if (body.error)
                callback({
                    error: body.error,
                    vaild: false
                });
            else if (body.id != facebookConfig.appid)
                callback({
                    error: 'app id error',
                    vaild: false
                });
            else
                callback({
                    vaild: true,
                    data: body
                });
        });
    }

    this.Login = function(body) {
        callback = option.LoginCallback || function(body) {
            return body
        };
        fbtoken = option.fbtoken;
        Download(config.graphAPI.me + '?fields=' + config.fields + '&access_token=' + fbtoken, function(body) {
            if (body.error)
                callback({
                    error: body.error,
                    vaild: false
                });
            else
                callback({
                    data: body,
                    vaild: true
                });
        });
    }

    Check();
};

var Download = function(url, callback) {
    var strproto = url.substring(0, url.indexOf('://'))
    var proto = null
    if (strproto == 'https') proto = https;
    else if (strproto == 'http') proto = http;
    else {
        console.error(strproto + ' is not supported');
        return;
    }

    var str = '';
    proto.get(url, function(sres) {
        sres.on('data', function(d) {
            str += d;
        });
        sres.on('end', function(d) {
            callback(JSON.parse(str));
        });
    }).on('error', function(e) {
        console.error(e);
    });
}

module.exports = facebook;
