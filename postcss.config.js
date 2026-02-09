const selectorParser = require("postcss-selector-parser");

const EDITOR_WRAPPER_ID = "growp-editor-wrapper";
const EDITOR_WRAPPER_PREFIX = `#${EDITOR_WRAPPER_ID} `;
const EXCLUSION_GUARD = ":where(:not(.acf-fields *):not(.components-placeholder *))";

module.exports = (ctx) => ({
  plugins: {
    "postcss-pxtorem": {
      propList: ["*", "!border*", "!box-shadow*"],
      selectorBlackList: [/^html$/], //html要素は除外
    },
    // postcss-pxtoremが対応していないCSS変数のvar()内のフォールバック値のpx→rem変換
    [require.resolve('./config/postcss-var-pxtorem')]: {
      rootValue: 16,
      exclude: ['border*', 'box-shadow*']
    },
    autoprefixer: {},
    "postcss-prefix-selector":
      ctx.file.basename === "admin-style.css"
        ? {
          // :root以外に #growp-editor-wrapper を付与
          prefix: EDITOR_WRAPPER_PREFIX,
          exclude: [":root"],
          // タグ名単体またはタグ名[属性名]のみのセレクタに対して「祖先に.acf-fieldsまたは.components-placeholderがないときだけ」を付与
          transform: function (prefix, selector) {
            let hasEditorWrapper = false;

            // セレクタをASTとして走査し、必要なものだけ除外ガードを付与する
            const modifiedSelector = selectorParser((selectors) => {
              // どこかに #growp-editor-wrapper が含まれているかを先に記録する
              selectors.walkIds((idNode) => {
                if (idNode.value === EDITOR_WRAPPER_ID) {
                  hasEditorWrapper = true;
                }
              });

              selectors.each((sel) => {
                let alreadyScoped = false;
                // 個々のセレクタが既に #growp-editor-wrapper 配下なら対象外
                sel.walkIds((idNode) => {
                  if (idNode.value === EDITOR_WRAPPER_ID) {
                    alreadyScoped = true;
                  }
                });

                // 既にスコープ済み、または同じ除外ガード付きなら何もしない
                if (alreadyScoped || sel.toString().includes(EXCLUSION_GUARD)) {
                  return;
                }

                // 複合セレクタをコンビネータ単位で分割し、単一compoundのみ対象にする
                const compounds = [];
                let currentCompound = [];

                sel.each((node) => {
                  if (node.type === "combinator") {
                    if (currentCompound.length) {
                      compounds.push(currentCompound);
                      currentCompound = [];
                    }
                  } else {
                    currentCompound.push(node);
                  }
                });
                if (currentCompound.length) compounds.push(currentCompound);

                if (compounds.length !== 1) {
                  return;
                }

                // 対象にする形（* / ::before のみ / tag[attrs][::before]）かを判定
                const compound = compounds[0];
                const tagNodes = compound.filter((n) => n.type === "tag");
                const hasClass = compound.some((n) => n.type === "class");
                const pseudoElementIndex = compound.findIndex(
                  (n) => n.type === "pseudo" && n.value && n.value.startsWith("::")
                );
                const isUniversal =
                  compound.length === 1 && compound[0].type === "universal";
                const isSinglePseudoElement =
                  compound.length === 1 && pseudoElementIndex === 0;
                const isTagWithOptionalAttributesAndPseudoElement =
                  tagNodes.length === 1 &&
                  !hasClass &&
                  compound.every((n) => {
                    if (n.type === "tag" || n.type === "attribute") {
                      return true;
                    }
                    return (
                      n.type === "pseudo" &&
                      typeof n.value === "string" &&
                      n.value.startsWith("::")
                    );
                  });
                const shouldAppendGuard =
                  isUniversal ||
                  isSinglePseudoElement ||
                  isTagWithOptionalAttributesAndPseudoElement;

                if (!shouldAppendGuard) {
                  return;
                }

                // 疑似要素があれば直前、なければ末尾に除外ガードを挿入
                const guardPseudo = selectorParser.pseudo({ value: EXCLUSION_GUARD });

                if (pseudoElementIndex > -1) {
                  compound[pseudoElementIndex].parent.insertBefore(
                    compound[pseudoElementIndex],
                    guardPseudo
                  );
                  return;
                }

                const lastNode = compound[compound.length - 1];
                lastNode.parent.insertAfter(lastNode, guardPseudo);
              });
            }).processSync(selector);

            // 既に #growp-editor-wrapper を含む場合はそのまま返し、なければprefixを付与
            if (hasEditorWrapper) {
              return modifiedSelector;
            }

            return prefix + modifiedSelector;
          },
        }
        : false,
  },
});
