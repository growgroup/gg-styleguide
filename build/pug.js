// Pug の設定ファイル
var fs = require("fs")

var pugconfig = {
  pretty: true,
  cache: false,
  escapePre: true,
  basedir: "app/",
  locals: {
    addComponentFile: async function (componentName) {
      var componentPath = __dirname + '/../app/assets/scss/object/components/_' + componentName + '.scss';
      try {
        fs.statSync(componentPath);
        return true;
      } catch (err) {
        await fs.writeFileSync(componentPath, '.c-' + componentName + ' {\n\n}', {flag: "a"});
        return false;
      }
    },
    addLayoutFile: async function (componentName) {
      var componentPath = __dirname + '/../app/assets/scss/layout/_' + componentName + '.scss';
      try {
        fs.statSync(componentPath);
        return true;
      } catch (err) {
        await fs.writeFileSync(componentPath, '.l-' + componentName + ' {\n\n}', {flag: "a"});
        return false;
      }
    },
  },
  filters: {
    // 改行をbrに置換
    'gt-textblock': function (text, options) {
      return text.replace(/\r?\n/g, '<br>');
    },
    // テキストを改行に合わせてリスト表示
    'gt-simple-list': function (text, options) {
      var list = text.split(/\r\n|\r|\n/);
      var listhtml = [];
      for (var i = 0; i < list.length; i++) {
        listhtml.push('<li>' + list[i] + '</li>');
      }
      return listhtml.join('');
    }
  }
}

module.exports = pugconfig;
