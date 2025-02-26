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

      // %を除去して数値変換
      const unitDelete = decl.value.toString().replace(/%/i, '');
      const numberValue = Number(unitDelete);

      // 数値変換が失敗してNaNの場合は、エラー報告もせずにそのまま返す
      if (isNaN(numberValue)) {
        return;
      }

      // エラー報告
      stylelint.utils.report({
        ruleName,
        result,
        message: messages.expected,
        node: decl,
      });

      if (context.fix) {
        // 100で割る
        const changeResult = (numberValue / 100).toString();
        decl.value = changeResult;
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

