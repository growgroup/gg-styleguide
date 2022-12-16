module.exports = (ctx) => ({
  plugins: {
    "autoprefixer":{ grid: true },
    "prepend-selector-postcss":ctx.file.basename === 'admin-style.css' ? {
      selector: '#growp-editor-wrapper ',
      appendTo:['html','body'],
    } : false,
  },
})
