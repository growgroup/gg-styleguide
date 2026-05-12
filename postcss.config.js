const selectorParser = require("postcss-selector-parser");
const fs = require("fs");
const path = require("path");
const sassCompat = require("./config/postcss-sass-compat");

const EDITOR_WRAPPER_ID = "growp-editor-wrapper";
const EDITOR_WRAPPER_PREFIX = `#${EDITOR_WRAPPER_ID} `;
const EXCLUSION_GUARD = ":where(:not(.acf-fields *):not(.components-placeholder *))";

const editorPrefixOptions = (ctx) => {
  const basename = ctx.file && ctx.file.basename;

  if (basename !== "admin-style.css") {
    return false;
  }

  return {
    // :root以外に #growp-editor-wrapper を付与
    prefix: EDITOR_WRAPPER_PREFIX,
    exclude: [":root"],
    // タグ名単体またはタグ名[属性名]のみのセレクタに対して「祖先に.acf-fieldsまたは.components-placeholderがないときだけ」を付与
    transform: function (prefix, selector) {
      let hasEditorWrapper = false;
      const isAttributeOnlyWherePseudo = (pseudoNode) => {
        if (
          pseudoNode.type !== "pseudo" ||
          pseudoNode.value !== ":where" ||
          !Array.isArray(pseudoNode.nodes) ||
          pseudoNode.nodes.length === 0
        ) {
          return false;
        }

        return pseudoNode.nodes.every((innerSelector) => {
          return (
            innerSelector.type === "selector" &&
            innerSelector.nodes.length > 0 &&
            innerSelector.nodes.every((innerNode) => innerNode.type === "attribute")
          );
        });
      };
      const isRootTagOnlySelector = (sel) => {
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
        if (compounds.length !== 1) return false;

        const compound = compounds[0];
        const tagNodes = compound.filter((n) => n.type === "tag");
        if (tagNodes.length !== 1) return false;

        const tagName = tagNodes[0].value && tagNodes[0].value.toLowerCase();
        if (tagName !== "html" && tagName !== "body") return false;

        return compound.every((n) => {
          if (
            n.type === "tag" ||
            n.type === "attribute" ||
            isAttributeOnlyWherePseudo(n) ||
            (n.type === "pseudo" && n.toString() === EXCLUSION_GUARD)
          ) {
            return true;
          }
          return false;
        });
      };

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

          // 対象にする形（* / ::before のみ / tag[attrs][:where([attrs],...)][::before]）かを判定
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
              if (
                n.type === "tag" ||
                n.type === "attribute" ||
                isAttributeOnlyWherePseudo(n)
              ) {
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

      // html/body 系は配下指定ではなくラッパー自体のセレクタに正規化する
      const normalizedSelector = selectorParser((selectors) => {
        selectors.each((sel) => {
          if (!isRootTagOnlySelector(sel)) {
            return;
          }
          sel.removeAll();
          sel.append(selectorParser.id({ value: EDITOR_WRAPPER_ID }));
        });
      }).processSync(modifiedSelector);

      const hasEditorWrapperAfterNormalize = selectorParser((selectors) => {
        selectors.walkIds((idNode) => {
          if (idNode.value === EDITOR_WRAPPER_ID) {
            hasEditorWrapper = true;
          }
        });
      }).processSync(normalizedSelector);

      // 既に #growp-editor-wrapper を含む場合はそのまま返し、なければprefixを付与
      if (hasEditorWrapper) {
        return hasEditorWrapperAfterNormalize;
      }

      return prefix + hasEditorWrapperAfterNormalize;
    },
  };
};

const resolvePcssImport = (id, basedir) => {
  const basePaths = [
    basedir,
    path.resolve(__dirname, "app/assets/pcss"),
    path.resolve(__dirname, "node_modules"),
  ];
  const candidates = [];

  for (const basePath of basePaths) {
    const fullPath = path.resolve(basePath, id);
    const dirname = path.dirname(fullPath);
    const basename = path.basename(fullPath);

    candidates.push(
      fullPath,
      `${fullPath}.pcss`,
      `${fullPath}.css`,
      path.join(dirname, `_${basename}.pcss`),
      path.join(fullPath, "index.pcss"),
      path.join(fullPath, "_index.pcss"),
      path.join(fullPath, "index.css"),
    );
  }

  const resolved = candidates.find((candidate) => fs.existsSync(candidate));
  return resolved || id;
};

module.exports = (ctx) => {
  const editorPrefix = editorPrefixOptions(ctx);

  return {
    syntax: "postcss-scss",
    plugins: [
    sassCompat.syntaxPlugin,
    require("postcss-import")({
      path: [path.resolve(__dirname, "app/assets/pcss")],
      resolve: resolvePcssImport,
    }),
    sassCompat.syntaxPlugin,
    sassCompat.valuePlugin,
    sassCompat.mixinPlugin,
    require("postcss-mixins")({ silent: false }),
    require("postcss-each"),
    require("postcss-for"),
    require("postcss-conditionals"),
    require("postcss-simple-vars")({ silent: true }),
    sassCompat.valuePlugin,
    require("postcss-functions")({ functions: sassCompat.functions }),
    require("postcss-calc"),
    require("postcss-color-mix"),
    require("postcss-nested"),
    require("postcss-sort-media-queries")({
      sort: "desktop-first",
      onlyTopLevel: true,
    }),
    require("postcss-pxtorem")({
      propList: ["*", "!border*", "!box-shadow*"],
      selectorBlackList: [/^html$/], //html要素は除外
    }),
    // postcss-pxtoremが対応していないCSS変数のvar()内のフォールバック値のpx→rem変換
    require("./config/postcss-var-pxtorem")({
      rootValue: 16,
      exclude: ['border*', 'box-shadow*']
    }),
    require("autoprefixer"),
    editorPrefix ? require("postcss-prefix-selector")(editorPrefix) : false,
    ].filter(Boolean),
  };
};
