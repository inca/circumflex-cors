'use strict';

/**
 * If `Origin` request header is specified, validates the origin (see below)
 * and either attaches CORS headers or responds with HTTP 403 Access Denied.
 *
 * In order to validate the origin `options` can contain:
 *
 *   * `allowedOrigins` -- an array to validate the `Origin` header
 *   * `validateOrigin` -- `function(origin, cb)` an asynchronous validating
 *     function, which should invoke `cb(null, true)` if origin is valid
 *
 * If none of these options are provided, middleware will send CORS headers
 * for any `Origin`.
 *
 * To serve custom headers set `options.headers` (can be either string with
 * comma-separated values or an array of header names).
 *
 * @returns {Function} Middleware function
 */
module.exports = function(options) {

  options = options || {};

  var origins = Array.isArray(options.allowedOrigins) ?
    options.allowedOrigins : null;

  var validateOrigin = typeof options.validateOrigin == 'function' ?
    options.validateOrigin : null;

  function _validateOrigin(origin, cb) {
    if (validateOrigin)
      return validateOrigin(origin, cb);
    if (origins)
      return cb(null, origins.indexOf(origin) > -1);
    else return cb(null, true);
  }

  return function cors(req, res, next) {
    var origin = req.get('Origin');
    if (!origin)
      return next();
    _validateOrigin(origin, function(err, valid) {
      if (err) return next(err);
      if (!valid)
        return res.sendStatus(403);
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods',
          req.get('Access-Control-Request-Method') || 'GET,HEAD,OPTIONS');
      res.header('Access-Control-Allow-Headers',
          req.get('Access-Control-Request-Headers') || 'Content-Type');
      next();
    });
  };
};
