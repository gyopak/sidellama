const base = require('./v3');

module.exports = {
  ...base,

  // Replace with your Chrome extension public key to maintain consistent extension id
  // see https://stackoverflow.com/questions/21497781/how-to-change-chrome-packaged-app-id-or-why-do-we-need-key-field-in-the-manifest/21500707#21500707
  key: undefined
};
