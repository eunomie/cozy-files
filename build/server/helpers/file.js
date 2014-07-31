// Generated by CoffeeScript 1.7.1
var downloader,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

downloader = require('../lib/downloader');

module.exports = {
  normalizePath: function(path) {
    if (path === "/") {
      path = "";
    } else if (path.length > 0 && path[0] !== '/') {
      path = "/" + path;
    }
    return path;
  },
  processAttachment: function(req, res, next, download) {
    var contentHeader, file;
    file = req.file;
    if (download) {
      contentHeader = "attachment; filename=" + file.name;
    } else {
      contentHeader = "inline; filename=" + file.name;
    }
    res.setHeader('Content-Disposition', contentHeader);
    res.setHeader('Content-Length', file.size);
    return downloader.download("/data/" + file.id + "/binaries/file", function(stream) {
      var err;
      if (stream.statusCode === 200) {
        stream.pipefilter = function(source, dest) {
          var XSSmimeTypes, _ref;
          XSSmimeTypes = ['text/html', 'image/svg+xml'];
          if (_ref = source.headers['content-type'], __indexOf.call(XSSmimeTypes, _ref) >= 0) {
            return dest.setHeader('content-type', 'text/plain');
          }
        };
        return stream.pipe(res);
      } else if (stream.statusCode === 404) {
        err = new Error('An error occured while downloading the file: ' + 'file not found.');
        err.status = 404;
        return next(err);
      } else {
        return next(new Error('An error occured while downloading the file.'));
      }
    });
  },
  getFileClass: function(file) {
    var fileClass, type;
    type = file.headers['content-type'];
    switch (type.split('/')[0]) {
      case 'image':
        fileClass = "image";
        break;
      case 'application':
        fileClass = "document";
        break;
      case 'text':
        fileClass = "document";
        break;
      case 'audio':
        fileClass = "music";
        break;
      case 'video':
        fileClass = "video";
        break;
      default:
        fileClass = "file";
    }
    return fileClass;
  }
};