const path = require('path');

module.exports = {
  entry: './client/src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public')
  }
};
