var database = require('./database');
var https = require('https');
var config = require('../config.json');
var facebookConfig = {
    appid: config.fbappid,
    graphAPI: {
        app: 'https://graph.facebook.com/app',
        me: 'https://graph.faceboom.com/me'
    },
    fields: 'id,name,email'

}

var login = function(fbtoken, callback) {
    this.Check(fbtoken, this.Login);
    this.Login = function(body) {
        Download(facebookConfig.graphAPI.me + '?fields=' + facebookConfig.fields + '&access_token=' + fbtoken, function(body) {
            if (body.error)
                callback({
                    facebookMessage: body,
                    vaild: false
                });

            else
                callback({
                    data: body,
                    vaild: true
                });
        });
    }
}

login.Check = function(fbtoken, callback) {
    callback = callback || this.Login
    Download(facebookConfig.graphAPI.app + '?field=id&access_token=' + fbtoken, function(body) {
        if (body.error)
            callback({
                facebookMessage: body,
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

module.exports = {
    Login: login,
    Check: login.Check
}
