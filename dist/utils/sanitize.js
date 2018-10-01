"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapValues = require("lodash/mapValues");

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = data => {
  return (0, _mapValues2.default)(data, value => value.replace(/^=/, ''));
};