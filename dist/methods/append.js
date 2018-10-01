"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sanitize = require("../utils/sanitize.js");

var _sanitize2 = _interopRequireDefault(_sanitize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const append = (client, data, options) => {
  if (options.sanitize) {
    data = (0, _sanitize2.default)(data);
  }

  return client.addRow(data).then(d => {
    return new Promise((resolve, reject) => {
      resolve({
        status: 200,
        body: {
          message: 'OK'
        }
      });
    });
  });
};

exports.default = append;