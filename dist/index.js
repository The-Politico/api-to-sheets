"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _find = require("lodash/find");

var _find2 = _interopRequireDefault(_find);

var _omit = require("lodash/omit");

var _omit2 = _interopRequireDefault(_omit);

var _keys = require("lodash/keys");

var _keys2 = _interopRequireDefault(_keys);

var _gapi = require("./gapi");

var _gapi2 = _interopRequireDefault(_gapi);

var _sheets = require("../sheets.json");

var _sheets2 = _interopRequireDefault(_sheets);

var _methods = require("./methods");

var _methods2 = _interopRequireDefault(_methods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const server = (0, _express2.default)();
server.use(_express2.default.json());
server.get('', (req, res) => {
  res.status(200);
  res.send('OK');
});
server.post('', (req, res) => {
  // if there is no method or sheet Id
  if (!req.body.method || !req.body.sheet) {
    res.status(400);
    res.send('Request needs a "method" and "sheet"');
    return;
  } // if the method doesn't exist


  if ((0, _keys2.default)(_methods2.default).indexOf(req.body.method) < 0) {
    res.status(400);
    res.send(`"${req.body.method}" is an invalid method.`);
    return;
  }

  const sheet = (0, _find2.default)(_sheets2.default, s => s.slug === req.body.sheet);
  const data = (0, _omit2.default)(req.body, ['method', 'sheet', 'authorization']);
  const client = new _gapi2.default(sheet);
  client.auth().then(() => {
    return _methods2.default[req.body.method](client, req.body.authorization, data);
  }).then(resp => {
    res.status(resp.status);
    res.send(resp.body);
  }).catch(err => {
    console.error(err);
  });
});
module.exports = server;