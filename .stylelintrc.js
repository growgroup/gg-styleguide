const path = require('path');
const postcssScss = require('postcss-scss');
module.exports = {
  customSyntax: postcssScss,
  "plugins": [
    "stylelint-scss",
    path.resolve(__dirname, "./config/stylelint-replace-assets-path.js")
  ],
  "rules": {
    "custom/replace-assets-path": true
  }
}
