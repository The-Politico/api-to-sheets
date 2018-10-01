import keys from 'lodash/keys';

export default (sheetOptionsConfig, method) => {
  let options = {};

  keys(sheetOptionsConfig).forEach(key => {
    options[key] = typeof sheetOptionsConfig[key] !== 'object' ? sheetOptionsConfig[key] : sheetOptionsConfig[key][method];
  });

  return options;
};
