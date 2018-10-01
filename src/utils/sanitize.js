import mapValues from 'lodash/mapValues';

export default (data) => {
  return mapValues(data, (value) => value.replace(/^=/, ''));
};
