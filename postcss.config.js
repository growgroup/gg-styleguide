module.exports = (ctx) => ({
  plugins: {
    "autoprefixer": {},
    "postcss-prefix-selector": ctx.file.basename === 'admin-style.css' ? {
      prefix: '#growp-editor-wrapper ',
      exclude: [':root'],
      transform: function (prefix, selector, prefixedSelector) {
        if (selector.includes('#growp-editor-wrapper')) {
          return selector;
        } else if (selector === 'body') {
          return prefix;
        } else if (selector === 'html') {
          return prefix;
        } else {
          return prefixedSelector;
        }
      }
    } : false,

  },
})
