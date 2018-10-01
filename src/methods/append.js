import sanitize from '../utils/sanitize.js';

const append = (client, data, options) => {
  if (options.sanitize) {
    data = sanitize(data);
  }

  return client.addRow(data)
    .then(d => {
      return new Promise((resolve, reject) => {
        resolve({
          status: 200,
          body: {message: 'OK'},
        });
      });
    });
};

export default append;
