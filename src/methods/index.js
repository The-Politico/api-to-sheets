// import exceptions
import { FIVE_HUNDRED } from '../constants/exceptions.js';

// import utils
import authenticate from '../utils/authenticate.js';
import getOptions from '../utils/getOptions.js';
import parseError from '../utils/parseError.js';

// import methods
import append from './append.js';
import read from './read.js';

const composeMethod = (methodFunc) => (client, auth, data) => {
  let resp;

  const options = getOptions(client.options, methodFunc.name);
  const authentication = authenticate(client.authSchema, auth, methodFunc.name);

  if (!authentication[0]) {
    resp = authentication[1];
    return new Promise((resolve, reject) => {
      resolve(resp);
    });
  } else {
    return methodFunc(client, data, options)
      .catch(err => {
        const errorObj = parseError(err);
        if (errorObj[0]) {
          return new Promise((resolve, reject) => {
            resp = errorObj[1];
            resolve(resp);
          });
        } else {
          return new Promise((resolve, reject) => {
            console.error(err);
            resp = FIVE_HUNDRED();
            resolve(resp);
          });
        }
      });
  }
};

export default {
  append: composeMethod(append),
  read: composeMethod(read),
};
