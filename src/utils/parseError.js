import { GAPI_INVALID_AUTH } from '../constants/exceptions.js';

export default (err) => {
  const regex = /^Error: HTTP error ((\d*)[\w|\d|\s|(|)]*) -/;
  const match = regex.exec(err);

  if (match) {
    if (match[2] === '403') {
      return [true, GAPI_INVALID_AUTH()];
    }
  }

  return [false];
};
