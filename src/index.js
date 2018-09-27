import express from 'express';
import find from 'lodash/find';
import omit from 'lodash/omit';
import keys from 'lodash/keys';
import GAPI from './gapi';
import sheets from '../sheets.json';
import methods from './methods';

const server = express();
server.use(express.json());

server.get('', (req, res) => {
  res.status(200);
  res.send('OK');
});

server.post('', (req, res) => {
  // if there is no method or sheet Id
  if (!req.body.method || !req.body.sheet) {
    res.status(400);
    res.send('Request needs a "method" and "sheet"');
    return;
  }

  // if the method doesn't exist
  if (keys(methods).indexOf(req.body.method) < 0) {
    res.status(400);
    res.send(`"${req.body.method}" is an invalid method.`);
    return;
  }

  const sheet = find(sheets, s => s.slug === req.body.sheet);
  const data = omit(req.body, [
    'method',
    'sheet',
    'authorization',
  ]);

  const client = new GAPI(sheet);
  client.auth()
    .then(() => {
      return methods[req.body.method](client, req.body.authorization, data);
    })
    .then(resp => {
      res.status(resp.status);
      res.send(resp.body);
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = server;
