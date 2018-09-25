"use strict";

var _gapi = require("./gapi");

var _gapi2 = _interopRequireDefault(_gapi);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _sheets = require("../sheets.json");

var _sheets2 = _interopRequireDefault(_sheets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const app = (0, _express2.default)();
app.use(_express2.default.json());
const sheetAuths = [];

const authenticate = (authSchema, auth) => {
  // check to see if the auth schema calls for authentication
  if (authSchema) {
    if (!auth) {
      return false;
    } // check to see if a token was provided in the authorization header


    const tokenAuth = /^Token\s(.*)$/.exec(auth);

    if (!tokenAuth) {
      return false;
    } // check to see if the tokens match either the public or private token,
    // depending on what was called for in the auth schema


    const token = tokenAuth[1];

    if (authSchema === 'public_token') {
      return token === process.env.PUBLIC_TOKEN;
    } else if (authSchema === 'private_token') {
      return token === process.env.PRIVATE_TOKEN;
    }
  }

  return true;
}; // create routes for each sheet


_sheets2.default.forEach(sheet => {
  const client = new _gapi2.default(sheet.id);
  sheetAuths.push(client.auth()); // Add append routes

  app.post(`/${sheet.slug}/append/`, (req, res) => {
    // use append permission or sheet default
    const authSchema = typeof sheet.auth === 'string' ? sheet.auth : sheet.auth.append;

    if (authenticate(authSchema, req.headers.authorization)) {
      client.addRow(req.body).then(() => {
        res.sendStatus(200);
      }).catch(() => {
        res.status(500);
        res.send(`An error occured.\nIt could have something to do with your permissions. Make sure to share all sheets with ${process.env.GAPI_CLIENT_EMAIL}.`);
      });
    } else {
      res.sendStatus(403);
    }
  }); // Add read routes

  app.post(`/${sheet.slug}/read/`, (req, res) => {
    // use append permission or sheet default
    const authSchema = typeof sheet.auth === 'string' ? sheet.auth : sheet.auth.read;

    if (authenticate(authSchema, req.headers.authorization)) {
      const worksheetId = req.body.worksheet ? req.body.worksheet : null;
      client.getRows(worksheetId, req.body).then(d => {
        res.status(200);
        res.send(d);
      }).catch(() => {
        res.status(500);
        res.send(`An error occured.\nIt could have something to do with your permissions. Make sure to share all sheets with ${process.env.GAPI_CLIENT_EMAIL}.`);
      });
    } else {
      res.sendStatus(403);
    }
  });
}); // Start server after the GAPI auths have been established


Promise.all(sheetAuths).then(() => {
  const port = 3000;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}).catch(err => {
  console.error(err);
});