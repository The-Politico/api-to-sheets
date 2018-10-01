"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("lodash/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (sheetOptionsConfig, method) => {
  let options = {};
  (0, _keys2.default)(sheetOptionsConfig).forEach(key => {
    options[key] = typeof sheetOptionsConfig[key] !== 'object' ? sheetOptionsConfig[key] : sheetOptionsConfig[key][method];
  });
  return options;
};