import GAPI from './gapi';
import sheets from '../sheets.json';
import find from 'lodash/find';
import omit from 'lodash/omit';
import keys from 'lodash/keys';
import methods from './methods';

exports.get = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: 'OK',
  });
};

exports.post = (event, context, callback) => {
  let resp = {};
  console.log('event', event);
  console.log('context', context);

  // if there is no method or sheet Id
  if (!event.body.method || !event.body.sheet) {
    resp.statusCode = 400;
    resp.body = 'Request needs a "method" and "sheet"';
    callback(null, resp);
    return;
  }

  // if the method doesn't exist
  if (keys(methods).indexOf(event.body.method) < 0) {
    resp.statusCode = 400;
    resp.body = `"${event.body.method}" is an invalid method.`;
    callback(null, resp);
    return;
  }

  const sheet = find(sheets, s => s.slug === event.body.sheet);
  const data = omit(event.body, [
    'method',
    'sheet',
    'authorization',
  ]);

  const client = new GAPI(sheet);
  client.auth()
    .then(() => {
      return methods[event.body.method](client, event.body.authorization, data);
    })
    .then(resp => {
      callback(null, resp);
    })
    .catch(err => {
      console.error(err);
    });
};
