"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const NO_METHOD = exports.NO_METHOD = () => ({
  status: 400,
  body: {
    message: 'Request needs a method.'
  }
});

const NO_SHEET = exports.NO_SHEET = () => ({
  status: 400,
  body: {
    message: 'Request needs a sheet.'
  }
});

const NO_AUTH = exports.NO_AUTH = sheet => ({
  status: 400,
  body: {
    message: 'Request requires an authentication token.'
  }
});

const INVALID_METHOD = exports.INVALID_METHOD = method => ({
  status: 400,
  body: {
    message: `${method} is an invalid method.`
  }
});

const INVALID_SHEET = exports.INVALID_SHEET = sheet => ({
  status: 400,
  body: {
    message: `Sheet ${sheet} not found in configuration file.`
  }
});

const INVALID_TOKEN = exports.INVALID_TOKEN = () => ({
  status: 403,
  body: {
    message: 'Invalid authentication token.'
  }
});

const GAPI_INVALID_AUTH = exports.GAPI_INVALID_AUTH = () => ({
  status: 403,
  body: {
    message: 'Invalid service account permissions.'
  }
});

const FIVE_HUNDRED = exports.FIVE_HUNDRED = () => ({
  status: 500,
  body: {
    message: 'Something went wrong.'
  }
});