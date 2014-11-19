'use strict';

var async = require('async');
var app = require('express')();

app.use('/sync', require('../../index')({
  allowedOrigins: ['localhost', 'foo.bar']
}));

app.use('/async', require('../../index')({
  validateOrigin: function(origin, cb) {
    cb(null, origin == 'localhost');
  }
}));

app.get('/hello', function(req, res) {
  res.send('Hello World');
});

app.get('/sync/hello', function(req, res) {
  res.send('Hello World');
});

app.get('/async/hello', function(req, res) {
  res.send('Hello World');
});

module.exports = function(cb) {
  require('http').createServer(app).listen(8123, cb);
};
