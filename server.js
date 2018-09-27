require('dotenv').config();

const server = require('./dist');
const port = 3000;
server.listen(port, () => console.log(`Example app listening on port ${port}!`));
