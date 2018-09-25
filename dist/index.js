"use strict";

var _gapi = require("./gapi");

var _gapi2 = _interopRequireDefault(_gapi);

var _sheets = require("../sheets.json");

var _sheets2 = _interopRequireDefault(_sheets);

var _find = require("lodash/find");

var _find2 = _interopRequireDefault(_find);

var _omit = require("lodash/omit");

var _omit2 = _interopRequireDefault(_omit);

var _keys = require("lodash/keys");

var _keys2 = _interopRequireDefault(_keys);

var _methods = require("./methods");

var _methods2 = _interopRequireDefault(_methods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.get = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: 'OK'
  });
};

exports.post = (event, context, callback) => {
  let resp = {}; // console.log(event);
  // if there is no method or sheet Id

  if (!event.body.method || !event.body.sheet) {
    resp.statusCode = 400;
    resp.body = 'Request needs a "method" and "sheet"';
    callback(null, resp);
    return;
  } // if the method doesn't exist


  if ((0, _keys2.default)(_methods2.default).indexOf(event.body.method) < 0) {
    resp.statusCode = 400;
    resp.body = `"${event.body.method}" is an invalid method.`;
    callback(null, resp);
    return;
  }

  const sheet = (0, _find2.default)(_sheets2.default, s => s.slug === event.body.sheet);
  const data = (0, _omit2.default)(event.body, ['method', 'sheet', 'authorization']);
  const client = new _gapi2.default(sheet);
  client.auth().then(() => {
    return _methods2.default[event.body.method](client, event.body.authorization, data);
  }).then(resp => {
    callback(null, resp);
  }).catch(err => {
    console.error(err);
  });
};