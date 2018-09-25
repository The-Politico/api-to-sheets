const express = require('express');
const app = require('./dist/index.js');
require('dotenv').config();

const server = express();
server.use(express.json());

server.get('', (req, res) => {
  const callback = (_, result) => {
    res.status(result.statusCode);
    res.send(result.body);
  };

  app.get(req, null, callback);
});

server.post('', (req, res) => {
  const callback = (_, result) => {
    res.status(result.statusCode);
    res.send(result.body);
  };

  app.post(req, null, callback);
});

const port = 3000;
server.listen(port, () => console.log(`Example app listening on port ${port}!`));
