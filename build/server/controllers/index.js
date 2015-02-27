// Generated by CoffeeScript 1.9.1
var async, cozydb;

async = require('async');

cozydb = require('cozydb');

module.exports.main = function(req, res, next) {
  return async.parallel([
    function(cb) {
      return cozydb.api.getCozyLocale(cb);
    }, function(cb) {
      return cozydb.api.getCozyTags(cb);
    }
  ], (function(_this) {
    return function(err, results) {
      var locale, tags;
      if (err) {
        return next(err);
      } else {
        locale = results[0], tags = results[1];
        return res.render('index.jade', {
          imports: "window.locale = \"" + locale + "\";\nwindow.tags = \"" + (tags.join(',').replace('\"', '')) + "\".split(',');"
        });
      }
    };
  })(this));
};
