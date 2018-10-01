import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import find from 'lodash/find';
import omit from 'lodash/omit';
import keys from 'lodash/keys';

import GAPI from './gapi';
import sheets from '../sheets.json';
import methods from './methods';

import {NO_METHOD, NO_SHEET, INVALID_METHOD, INVALID_SHEET} from './constants/exceptions.js';

const server = express();
server.use(bodyParser.json({
  type: ['application/json', 'text/plain'],
}));

server.use(cors());

server.get('', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  res.send('OK');
});

server.post('', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // if there is no method
  if (!req.body.method) {
    const err = NO_METHOD();
    res.status(err.status);
    res.send(err.body);
    return;
  }

  // if there is no method
  if (!req.body.sheet) {
    const err = NO_SHEET();
    res.status(err.status);
    res.send(err.body);
    return;
  }

  // if the method doesn't exist
  if (keys(methods).indexOf(req.body.method) < 0) {
    const err = INVALID_METHOD(req.body.method);
    res.status(err.status);
    res.send(err.body);
    return;
  }

  // get the sheet being used
  let sheet = find(sheets, s => s.slug === req.body.sheet);
  if (!sheet) {
    sheet = find(sheets, s => s.id === req.body.sheet);
  }

  // if sheet is not in config
  if (!sheet) {
    const err = INVALID_SHEET(req.body.sheet);
    res.status(err.status);
    res.send(err.body);
    return;
  }

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
