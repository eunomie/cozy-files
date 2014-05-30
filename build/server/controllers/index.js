// Generated by CoffeeScript 1.7.1
var Client, CozyInstance, async;

async = require('async');

Client = require('request-json').JsonClient;

CozyInstance = require('../models/cozy_instance');

module.exports.main = function(req, res, next) {
  return async.parallel([
    function(cb) {
      return CozyInstance.getLocale(cb);
    }
  ], (function(_this) {
    return function(err, results) {
      var locale;
      if (err) {
        return next(err);
      } else {
        locale = results[0];
        return res.render('index.jade', {
          imports: "window.locale = \"" + locale + "\";"
        });
      }
    };
  })(this));
};

module.exports.tags = function(req, res, next) {
  var dataSystem;
  dataSystem = new Client("http://localhost:9101/");
  return dataSystem.get('tags', function(err, response, body) {
    if (err != null) {
      return next(err);
    } else {
      return res.send(200, body);
    }
  });
};