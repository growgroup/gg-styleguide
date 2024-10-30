
const postcssScss = require('postcss-scss');
module.exports = {
  customSyntax: postcssScss,
  "plugins": ["stylelint-scss","stylelint-replace-assets-path.js"],
  "rules": {
    "custom/replace-assets-path": true
  }
}
