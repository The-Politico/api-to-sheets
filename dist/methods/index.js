"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _exceptions = require("../constants/exceptions.js");

var _authenticate = require("../utils/authenticate.js");

var _authenticate2 = _interopRequireDefault(_authenticate);

var _getOptions = require("../utils/getOptions.js");

var _getOptions2 = _interopRequireDefault(_getOptions);

var _parseError = require("../utils/parseError.js");

var _parseError2 = _interopRequireDefault(_parseError);

var _append = require("./append.js");

var _append2 = _interopRequireDefault(_append);

var _read = require("./read.js");

var _read2 = _interopRequireDefault(_read);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import exceptions
// import utils
// import methods
const composeMethod = methodFunc => (client, auth, data) => {
  let resp;
  const options = (0, _getOptions2.default)(client.options, methodFunc.name);
  const authentication = (0, _authenticate2.default)(client.authSchema, auth, methodFunc.name);

  if (!authentication[0]) {
    resp = authentication[1];
    return new Promise((resolve, reject) => {
      resolve(resp);
    });
  } else {
    return methodFunc(client, data, options).catch(err => {
      const errorObj = (0, _parseError2.default)(err);

      if (errorObj[0]) {
        return new Promise((resolve, reject) => {
          resp = errorObj[1];
          resolve(resp);
        });
      } else {
        return new Promise((resolve, reject) => {
          console.error(err);
          resp = (0, _exceptions.FIVE_HUNDRED)();
          resolve(resp);
        });
      }
    });
  }
};

exports.default = {
  append: composeMethod(_append2.default),
  read: composeMethod(_read2.default)
};