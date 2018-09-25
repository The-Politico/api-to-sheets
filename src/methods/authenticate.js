export default (authSchema, auth) => {
  // check to see if the auth schema calls for authentication
  if (authSchema) {
    if (!auth) {
      return false;
    }

    // check to see if a token was provided
    const tokenAuth = /^Token\s(.*)$/.exec(auth);
    if (!tokenAuth) {
      return false;
    }

    // check to see if the tokens match either the public or private token,
    // depending on what was called for in the auth schema
    const token = tokenAuth[1];
    if (authSchema === 'public_token') {
      return token === process.env.PUBLIC_TOKEN;
    } else if (authSchema === 'private_token') {
      return token === process.env.PRIVATE_TOKEN;
    }
  }

  return true;
};
