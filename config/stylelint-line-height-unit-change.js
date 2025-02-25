/* eslint-disable */
const stylelint = require("stylelint");
const ruleName = "custom/line-height-unit-change";
const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: "line-height unit '%' disallow. Change relative value",
});

/**
 * stylelintrc.jsonのruleに渡すオプションを引数に指定
 * @param {object} primaryOption stylelintrcのruleに渡すobject
 * @param {object} secondaryOption(_) 二次的なオプション必要であれば設定
 * @param {object} context autoFix実現のために必要 {fix: boolean, newline: string}
 * @returns {function} returnFunction
 */
const ruleFunction = (primaryOption, _, context) => {

  /**
   * @param {object} root postcssでparseされたASTのrootNode
   * @param {object} result the PostCSS LazyResult
   */
  const returnFunction = (root , result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {});

    primaryOption = {"line-height-unit-change/rules": true}

    // プロパティが一致する宣言に対してのみ反復処理が行われる
    root.walkDecls('line-height', (decl) => {
      const matched = decl.value.match(/(\d+)(%)/);
      if (!matched) {
        return;
      }

      if (matched) {
        stylelint.utils.report({
          ruleName,
          result,
          message: messages.expected,
          node: decl,
        });

        if (context.fix) {
          // 文字列変換して%を取る
          const unitDelete = decl.value.toString().replace(/%/i, '');
          // 100で割る
          const changeResult = (Number(unitDelete) / 100).toString();

          return decl.value = changeResult;
        }
      }
    });

    if (!validOptions) {
      return;
    }
  };

  return returnFunction;
}

module.exports.ruleName = ruleName;
module.exports.messages = messages;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);

