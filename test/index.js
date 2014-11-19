"use strict";

var request = require('request')
  , assert = require('assert');

describe('Circumflex CORS', function() {

  before(function(cb) {
    require('./mock/app')(cb);
  });

  it('should not append CORS headers without middleware', function(cb) {
    request.get('http://localhost:8123/hello', {
      headers: {
        origin: 'localhost'
      }
    }, function(err, res, body) {
      if (err) return cb(err);
      assert.equal(res.headers['access-control-allow-methods'], null);
      cb();
    });
  });

  describe('with allowedOrigins', function() {

    it('should append CORS headers', function(cb) {
      request.get('http://localhost:8123/sync/hello', {
        headers: {
          origin: 'foo.bar'
        }
      }, function(err, res, body) {
        if (err) return cb(err);
        assert.equal(res.statusCode, 200);
        assert.equal(res.headers['access-control-allow-methods'], 'GET,HEAD,OPTIONS');
        cb();
      });
    });

    it('should send 403 for unknown origin', function(cb) {
      request.get('http://localhost:8123/sync/hello', {
        headers: {
          origin: 'whatever'
        }
      }, function(err, res, body) {
        if (err) return cb(err);
        assert.equal(res.statusCode, 403);
        cb();
      });
    });

    it('should copy access-control-request-headers to access-control-allow-headers', function(cb) {
      request.get('http://localhost:8123/sync/hello', {
        headers: {
          origin: 'localhost',
          'access-control-request-headers': 'X-Powered-By'
        }
      }, function(err, res, body) {
        if (err) return cb(err);
        assert.equal(res.headers['access-control-allow-headers'], 'X-Powered-By');
        cb();
      });
    });

  });

  describe('with validateOrigin', function() {

    it('should append CORS headers', function(cb) {
      request.get('http://localhost:8123/async/hello', {
        headers: {
          origin: 'localhost'
        }
      }, function(err, res, body) {
        if (err) return cb(err);
        assert.equal(res.statusCode, 200);
        assert.equal(res.headers['access-control-allow-methods'], 'GET,HEAD,OPTIONS');
        cb();
      });
    });

    it('should send 403 for unknown origin', function(cb) {
      request.get('http://localhost:8123/async/hello', {
        headers: {
          origin: 'whatever'
        }
      }, function(err, res, body) {
        if (err) return cb(err);
        assert.equal(res.statusCode, 403);
        cb();
      });
    });

    it('should copy access-control-request-headers to access-control-allow-headers', function(cb) {
      request.get('http://localhost:8123/async/hello', {
        headers: {
          origin: 'localhost',
          'access-control-request-headers': 'X-Powered-By'
        }
      }, function(err, res, body) {
        if (err) return cb(err);
        assert.equal(res.headers['access-control-allow-headers'], 'X-Powered-By');
        cb();
      });
    });

  });

});
