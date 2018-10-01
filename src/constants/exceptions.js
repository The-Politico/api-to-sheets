export const NO_METHOD = () => ({
  status: 400,
  body: {message: 'Request needs a method.'},
});

export const NO_SHEET = () => ({
  status: 400,
  body: {message: 'Request needs a sheet.'},
});

export const NO_AUTH = (sheet) => ({
  status: 400,
  body: {message: 'Request requires an authentication token.'},
});

export const INVALID_METHOD = (method) => ({
  status: 400,
  body: {message: `${method} is an invalid method.`},
});

export const INVALID_SHEET = (sheet) => ({
  status: 400,
  body: {message: `Sheet ${sheet} not found in configuration file.`},
});

export const INVALID_TOKEN = () => ({
  status: 403,
  body: {message: 'Invalid authentication token.'},
});

export const GAPI_INVALID_AUTH = () => ({
  status: 403,
  body: {message: 'Invalid service account permissions.'},
});

export const FIVE_HUNDRED = () => ({
  status: 500,
  body: {message: 'Something went wrong.'},
});
