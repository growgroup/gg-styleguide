const stylelint = require("stylelint");

const ruleName = "custom/replace-assets-path";
const messages = stylelint.utils.ruleMessages(ruleName, {
  replaced: (original, replacement) => `Replaced '${original}' with '${replacement}'`
});

module.exports = stylelint.createPlugin(ruleName, (primaryOption, secondaryOptions, context) => {
  return (root, result) => {
    root.walkDecls(decl => {
      const assetPattern = /url\(['"]?(\/assets\/images\/[^'"]+)['"]?\)/g;

      if (decl.value.match(assetPattern)) {
        const newValue = decl.value.replace(assetPattern, (match, path) => {
          return `url('../images/${path.replace('/assets/images/', '')}')`;
        });

        if (context.fix) {
          decl.value = newValue; // オートフィックスの適用
        } else {
          stylelint.utils.report({
            message: messages.replaced(decl.value, newValue),
            node: decl,
            result,
            ruleName
          });
        }
      }
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
