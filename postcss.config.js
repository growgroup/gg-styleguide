module.exports = (ctx) => ({
  plugins: {
    "postcss-pxtorem": {
      propList: ["*", "!border*", "!box-shadow*"],
      selectorBlackList: [/^html$/], //html要素は除外
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
