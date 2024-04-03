// Pug の設定ファイル
var fs = require("fs")

var pugconfig = {
  pretty: true,
  cache: false,
  escapePre: true,
  basedir: "app/",
  locals: {
    addFile: async function (componentName, type) {
      var typePrefix = type === 'component' ? 'c-' : 'l-';
      var folderName = type === 'component' ? 'object/components' : 'layout';
      var componentPath = __dirname + '/../app/assets/scss/' + folderName + '/_' + componentName + '.scss';
      var indexFilePath = __dirname + '/../app/assets/scss/' + folderName + '/_index.scss';

      try {
        fs.statSync(componentPath);
        return true;
      } catch (err) {
        await fs.writeFileSync(componentPath, '.' + typePrefix + componentName + ' {\n\n}', {flag: "a"});

        var indexContent = fs.readFileSync(indexFilePath, {encoding: 'utf8', flag: 'r'}).split("\n");
        var newImportStmt = "@import '" + componentName + "';";

        for (var i = 0; i < indexContent.length; i++) {
          const importStmt = indexContent[i];
          const importName = importStmt.replace(/@import '(.+)';/, '$1');
          if (importName > componentName) {
            indexContent.splice(i, 0, newImportStmt);
            break;
          }
        }
        fs.writeFileSync(indexFilePath, indexContent.join('\n'));


        return false;
      }
    }
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
