"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = err => {
  const regex = /^Error: HTTP error ((\d*)[\w|\d|\s|(|)]*) -/;
  const match = regex.exec(err);

  if (match) {
    return {
      message: err,
      error: match[1],
      status: parseInt(match[2])
    };
  }

  return false;
};