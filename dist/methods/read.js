"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authenticate = require("./authenticate.js");

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (client, auth, data) => {
  let resp;
  const authSchema = typeof client.authSchema === 'string' ? client.authSchema : client.authSchema.read;

  if (!auth) {
    resp = {
      status: 400,
      body: 'Request requires an authentication token.'
    };
  } else if (!(0, _authenticate2.default)(authSchema, auth)) {
    resp = {
      statusCode: 403,
      body: 'Invalid authentication token.'
    };
  } else {
    return client.getRows().then(d => {
      return new Promise((resolve, reject) => {
        resp = {
          status: 200,
          body: d
        };
        resolve(resp);
      });
    }).catch(err => {
      return new Promise((resolve, reject) => {
        resp = {
          status: 500,
          body: 'Something went wrong.'
        };
        console.error(err);
        resolve(resp);
      });
    });
  }

  return new Promise((resolve, reject) => {
    resolve(resp);
  });
};