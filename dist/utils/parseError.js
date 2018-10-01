"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _exceptions = require("../constants/exceptions.js");

exports.default = err => {
  const regex = /^Error: HTTP error ((\d*)[\w|\d|\s|(|)]*) -/;
  const match = regex.exec(err);

  if (match) {
    if (match[2] === '403') {
      return [true, (0, _exceptions.GAPI_INVALID_AUTH)()];
    }
  }

  return [false];
};