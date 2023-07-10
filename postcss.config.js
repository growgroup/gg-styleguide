module.exports = (ctx) => ({
  plugins: {
    "autoprefixer": {},
    "postcss-prefix-selector": ctx.file.basename === 'admin-style.css' ? {
      prefix: '#growp-editor-wrapper ',
      exclude: [':root'],
      transform: function (prefix, selector, prefixedSelector) {
        if (selector.includes('body')) {
          return prefix;
        } else if (selector.includes('html')) {
          return prefix;
        } else {
          return prefixedSelector;
        }
      }
    } : false,

  },
})
