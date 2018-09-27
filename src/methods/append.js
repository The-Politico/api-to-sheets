import authenticate from './authenticate.js';

export default (client, auth, data) => {
  let resp;
  const authSchema = typeof client.authSchema === 'string' ? client.authSchema : client.authSchema.append;

  if (!auth) {
    resp = {
      status: 400,
      body: 'Request requires an authentication token.',
    };
  } else if (!authenticate(authSchema, auth)) {
    resp = {
      status: 403,
      body: 'Invalid authentication token.',
    };
  } else {
    return client.addRow(data)
      .then(d => {
        return new Promise((resolve, reject) => {
          resp = {
            status: 200,
            body: 'OK',
          };
          resolve(resp);
        });
      })
      .catch(err => {
        return new Promise((resolve, reject) => {
          resp = {
            status: 500,
            body: 'Something went wrong.',
          };
          console.error(err);
          resolve(resp);
        });
      });
  }

  return new Promise((resolve, reject) => {
    resolve(resp);
  });
};
