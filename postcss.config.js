module.exports = (ctx) => ({
  plugins: {
    "@tailwindcss/postcss": {},
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
          prefix: "#growp-editor-wrapper ",
          exclude: [":root"],
          transform: function (prefix, selector, prefixedSelector) {
            if (selector.includes("#growp-editor-wrapper")) {
              return selector;
            } else {
              return prefixedSelector;
            }
          },
        }
        : false,
  },
});
