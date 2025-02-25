const path = require('path');
const postcssScss = require('postcss-scss');
module.exports = {
  customSyntax: postcssScss,
  "plugins": [
    "stylelint-scss",
    path.resolve(__dirname, "./config/stylelint-replace-assets-path.js"),
    path.resolve(__dirname, "./config/stylelint-line-height-unit-change.js")
  ],
  "rules": {
    "custom/replace-assets-path": true,
    "custom/line-height-unit-change": [true, { "severity": "warning" }]
  }
}
