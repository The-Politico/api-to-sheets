import { NO_AUTH, INVALID_TOKEN } from '../constants/exceptions.js';

export default (sheetAuthConfig, reqAuth, method) => {
  // get the authSchema
  let authSchema = false;
  if (sheetAuthConfig) {
    authSchema = sheetAuthConfig === 'string' ? sheetAuthConfig : sheetAuthConfig[method];
  }

  // if no auth required, return true
  if (!authSchema) {
    return [true];
  }

  // if auth required and non provided, return false
  if (!reqAuth) {
    return [false, NO_AUTH()];
  }

  // parse auth token and return false if none provided
  const tokenAuth = /^Token\s(.*)$/.exec(reqAuth);
  if (!tokenAuth) {
    return [false, NO_AUTH()];
  }

  // check to see if the tokens match either the public or private token,
  // depending on what was called for in the auth schema
  const reqToken = tokenAuth[1];
  let envToken = '';
  if (authSchema === 'public_token') {
    envToken = process.env.PUBLIC_TOKEN;
  } else if (authSchema === 'private_token') {
    envToken = process.env.PRIVATE_TOKEN;
  }

  // if the tokens match, return true
  if (reqToken === envToken) {
    return [true];
  }

  // by default, or if the tokens don't match, return false
  return [false, INVALID_TOKEN()];
};
