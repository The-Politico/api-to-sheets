"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _googleSpreadsheet = require("google-spreadsheet");

var _googleSpreadsheet2 = _interopRequireDefault(_googleSpreadsheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GAPI {
  constructor(config) {
    this.config = config;
    this.doc = new _googleSpreadsheet2.default(config.id);
    this.authSchema = config.auth;
    this.creds = {
      private_key: (process.env.GAPI_PRIVATE_KEY + '').replace(/\\n/g, '\n'),
      // dotenv escapes "\n" characters which should be rendered
      client_email: process.env.GAPI_CLIENT_EMAIL
    };
  }

  auth() {
    return new Promise((resolve, reject) => {
      this.doc.useServiceAccountAuth(this.creds, (err, test) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  getInfo() {
    return new Promise((resolve, reject) => {
      this.doc.getInfo((err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  }

  getRows(worksheet = 1, options = {}) {
    return new Promise((resolve, reject) => {
      this.doc.getRows(worksheet, options, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  addRow(data, worksheet = 1) {
    return new Promise((resolve, reject) => {
      this.doc.addRow(worksheet, data, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

}

exports.default = GAPI;