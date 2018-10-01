"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

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

var _exceptions = require("./constants/exceptions.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const server = (0, _express2.default)();
server.use(_bodyParser2.default.json({
  type: ['application/json', 'text/plain']
}));
server.use((0, _cors2.default)());
server.get('', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  res.send('OK');
});
server.post('', (req, res) => {
  res.setHeader('Content-Type', 'application/json'); // if there is no method

  if (!req.body.method) {
    const err = (0, _exceptions.NO_METHOD)();
    res.status(err.status);
    res.send(err.body);
    return;
  } // if there is no method


  if (!req.body.sheet) {
    const err = (0, _exceptions.NO_SHEET)();
    res.status(err.status);
    res.send(err.body);
    return;
  } // if the method doesn't exist


  if ((0, _keys2.default)(_methods2.default).indexOf(req.body.method) < 0) {
    const err = (0, _exceptions.INVALID_METHOD)(req.body.method);
    res.status(err.status);
    res.send(err.body);
    return;
  } // get the sheet being used


  let sheet = (0, _find2.default)(_sheets2.default, s => s.slug === req.body.sheet);

  if (!sheet) {
    sheet = (0, _find2.default)(_sheets2.default, s => s.id === req.body.sheet);
  } // if sheet is not in config


  if (!sheet) {
    const err = (0, _exceptions.INVALID_SHEET)(req.body.sheet);
    res.status(err.status);
    res.send(err.body);
    return;
  }

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