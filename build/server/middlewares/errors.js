// Generated by CoffeeScript 1.9.1
var logger, util;

util = require('util');

logger = require('printit')({
  date: true
});

module.exports = function(err, req, res, next) {
  var header, message, ref, statusCode, templateName, value;
  statusCode = err.status || 500;
  message = err instanceof Error ? err.message : err.error;
  message = message || 'Server error occurred';
  if ((err.headers != null) && Object.keys(err.headers).length > 0) {
    ref = err.headers;
    for (header in ref) {
      value = ref[header];
      res.set(header, value);
    }
  }
  if ((err.template != null) && (req != null ? req.accepts('html') : void 0) === 'html') {
    templateName = err.template.name + ".jade";
    res.render(templateName, err.template.params, function(err, html) {
      return res.send(statusCode, html);
    });
  } else {
    res.send(statusCode, {
      error: message
    });
  }
  if (err instanceof Error) {
    logger.error(err.message);
    return logger.error(err.stack);
  }
};
