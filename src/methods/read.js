const read = (client, data, options) => {
  // TODO: pass options into the GAPI from the request body
  return client.getRows()
    .then(d => {
      return new Promise((resolve, reject) => {
        resolve({
          status: 200,
          body: d,
        });
      });
    });
};

export default read;
