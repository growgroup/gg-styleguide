/**
 * PostCSS Plugin: CSS変数のvar()内のフォールバック値のpxをremに変換
 *
 * 例: var(--size, 16px) → var(--size, 1rem)
 */

const postcss = require('postcss');

const DEFAULT_OPTIONS = {
  rootValue: 16,
  unitPrecision: 5,
  minPixelValue: 0,
  // 変換から除外するプロパティのパターン
  exclude: [],
};

/**
 * @name toFixed
 * @description 指定された桁数で数値を丸める
 * @param {number} number - 丸める対象の数値
 * @param {number} precision - 小数点以下の桁数
 * @returns {number} 丸められた数値
 */
function toFixed(number, precision) {
  const multiplier = Math.pow(10, precision + 1);
  const wholeNumber = Math.floor(number * multiplier);
  return Math.round(wholeNumber / 10) * 10 / multiplier;
}

/**
 * @name convertPxToRem
 * @description 文字列内のpx値をrem値に変換する
 * @param {string} value - 変換対象のCSS値
 * @param {number} rootValue - ルート要素のフォントサイズ（px）
 * @param {number} unitPrecision - remの小数点以下の桁数
 * @param {number} minPixelValue - 変換対象とする最小のpx値
 * @returns {string} 変換後のCSS値
 */
function convertPxToRem(value, rootValue, unitPrecision, minPixelValue) {
  // px値の正規表現（var()内のフォールバック値用）
  const pxRegex = /(\d*\.?\d+)px/g;

  return value.replace(pxRegex, (match, numValue) => {
    const pixels = parseFloat(numValue);

    // px値が設定された最小値より小さいかどうかを確認
    if (pixels < minPixelValue) {
      return match;
    }

    const remValue = pixels / rootValue;
    const fixedRemValue = toFixed(remValue, unitPrecision);

    return `${fixedRemValue}rem`;
  });
}

/**
 * @name processVarFunction
 * @description CSSのvar()関数を処理し、フォールバック値のpxをremに変換する
 * @param {string} value - 処理対象のCSSプロパティ値
 * @param {object} options - プラグインのオプション
 * @returns {string} 処理後のCSSプロパティ値
 */
function processVarFunction(value, options) {
  // 以前の正規表現ベースのアプローチでは、フォールバック値内のネストされた括弧（例: calc()）で問題がありました。
  // この新しい実装では、var()関数を手動で解析して、より堅牢性を高めています。
  const varKeyword = 'var(';
  let result = '';
  let lastIndex = 0;
  let currentIndex = value.indexOf(varKeyword);

  // 文字列内に 'var(' が見つかった場合、ループを開始
  while (currentIndex !== -1) {
    result += value.substring(lastIndex, currentIndex);

    const startIndex = currentIndex + varKeyword.length;
    let balance = 1;
    let endIndex = startIndex;

    // 対応する閉じ括弧を見つける
    // カッコのバランスが0になるまでループ
    while (endIndex < value.length && balance > 0) {
      // 開き括弧が見つかった場合
      if (value[endIndex] === '(') {
        balance++;
      // 閉じ括弧が見つかった場合
      } else if (value[endIndex] === ')') {
        balance--;
      }
      endIndex++;
    }

    // カッコのバランスが正常に0になった（対応する閉じ括弧が見つかった）場合
    if (balance === 0) {
      const varContent = value.substring(startIndex, endIndex - 1);
      // フォールバック値があるかどうかを最初のカンマで判断
      const separatorIndex = varContent.indexOf(',');

      // フォールバック値が存在するかどうかを確認
      if (separatorIndex !== -1) {
        const varName = varContent.substring(0, separatorIndex).trim();
        const fallbackValue = varContent.substring(separatorIndex + 1).trim();

        // フォールバック値に'px'が含まれているかどうかを確認
        if (fallbackValue.includes('px')) {
          const convertedFallback = convertPxToRem(
            fallbackValue,
            options.rootValue,
            options.unitPrecision,
            options.minPixelValue,
          );
          result += `var(${varName}, ${convertedFallback})`;
        } else {
          // pxが含まれていなければ、変換せずにそのまま追加
          result += `var(${varName}, ${fallbackValue})`;
        }
      } else {
        // フォールバック値がなければ、変数名のみでvar()を再構築
        result += `var(${varContent.trim()})`;
      }
      lastIndex = endIndex;
    } else {
      // var()関数が正しく閉じられていない場合、残りの文字列を追加して処理を終了
      result += value.substring(currentIndex);
      lastIndex = value.length;
      break;
    }

    // 次の 'var(' を探す
    currentIndex = value.indexOf(varKeyword, lastIndex);
  }

  result += value.substring(lastIndex);
  return result;
}

/**
 * @name shouldExcludeProperty
 * @description 指定されたCSSプロパティが除外対象かどうかを判定する
 * @param {string} prop - CSSプロパティ名
 * @param {(string|RegExp)[]} excludePatterns - 除外パターンの配列
 * @returns {boolean} 除外対象の場合はtrue
 */
function shouldExcludeProperty(prop, excludePatterns) {
  // 除外パターンが指定されていない、または空の配列であるかを確認
  if (!excludePatterns || excludePatterns.length === 0) {
    return false;
  }

  return excludePatterns.some(pattern => {
    // パターンが文字列型であるかを確認
    if (typeof pattern === 'string') {
      // パターンにワイルドカード（*）が含まれているかどうかを確認
      if (pattern.includes('*')) {
        // ワイルドカードを正規表現の.*に変換してマッチング
        const regexPattern = pattern
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 特殊文字をエスケープ
          .replace(/\\\*/g, '.*'); // \* を .* に変換
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(prop);
      } else {
        // ワイルドカードがなければ、単純な文字列包含でチェック
        return prop.includes(pattern);
      }
    }
    // パターンが正規表現オブジェクトであるかを確認
    if (pattern instanceof RegExp) {
      return pattern.test(prop);
    }
    return false;
  });
}

/**
 * @name plugin
 * @description PostCSSプラグインの本体
 * @param {object} options - プラグインのオプション
 * @returns {object} PostCSSプラグインオブジェクト
 */
const plugin = (options = {}) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return {
    postcssPlugin: 'postcss-var-pxtorem',
    Declaration(decl) {
      // 現在のプロパティが除外対象リストに含まれているかを確認
      if (shouldExcludeProperty(decl.prop, opts.exclude)) {
        return;
      }

      // プロパティ値に 'var(' が含まれているかを確認
      if (decl.value.includes('var(')) {
        const originalValue = decl.value;
        const convertedValue = processVarFunction(decl.value, opts);

        // pxtoremによる変換が行われたかどうかを確認
        if (originalValue !== convertedValue) {
          decl.value = convertedValue;
        }
      }
    }
  };
};

plugin.postcss = true;

module.exports = plugin;
