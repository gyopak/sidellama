const packageJsonPath = require('path').join(__dirname, '../../package.json');

const packageJson = require(packageJsonPath);

module.exports = {
  name: packageJson.name,
  description: packageJson.description,
  version: packageJson.version
};
