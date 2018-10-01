"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const read = (client, data, options) => {
  // TODO: pass options into the GAPI from the request body
  return client.getRows().then(d => {
    return new Promise((resolve, reject) => {
      resolve({
        status: 200,
        body: d
      });
    });
  });
};

exports.default = read;