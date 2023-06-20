module.exports = (ctx) => ({
  plugins: {
    "autoprefixer":{},
    "prepend-selector-postcss":ctx.file.basename === 'admin-style.css' ? {
      selector: '#growp-editor-wrapper ',
      appendTo:['html','body'],
    } : false,
  },
})
