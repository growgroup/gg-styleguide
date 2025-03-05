// Pug の設定ファイル
var fs = require("fs");

var pugconfig = {
  pretty: true,
  cache: false,
  escapePre: true,
  basedir: "app/",
  locals: {
    addFile: async function (componentName, type) {
      let typePrefix = '';
      let folderName = '';

      if (type === 'component') {
        typePrefix = 'c-';
        folderName = 'object/components';
      } else if (type === 'project') {
        typePrefix = 'p-';
        folderName = 'object/project';
      } else if (type === 'layout') {
        typePrefix = 'l-';
        folderName = 'layout';
      }

      let componentPath = __dirname + '/../app/assets/scss/' + folderName + '/' + componentName + '.scss';
      let indexFilePath = __dirname + '/../app/assets/scss/' + folderName + '/_index.scss';

      try {
        fs.statSync(componentPath);
        return true;
      } catch (err) {
        // ファイルが存在しない場合
        // ファイルを作成
        await fs.writeFileSync(componentPath, '.' + typePrefix + componentName + ' {\n\n}', {flag: "a"});

        // index.scss にインポート文を追加
        let indexContent = fs.readFileSync(indexFilePath, {encoding: 'utf8', flag: 'r'}).split("\n");
        let newImportStmt = "@import '" + componentName + "';";
        let alreadyImported = indexContent.includes(newImportStmt);

        // 既にインポート文がある場合は何もしない
        if (!alreadyImported) {
          let isInserted = false;
          // インポート文をアルファベット順に挿入
          for (let i = 0; i < indexContent.length; i++) {
            const importStmt = indexContent[i];
            const importName = importStmt.replace(/@import '(.+)';/, '$1');

            if (importName > componentName) {
              // 新規コンポーネント名がアルファベット順になる位置に挿入
              indexContent.splice(i, 0, newImportStmt);
              isInserted = true;
              break; // 差し込み位置を見つけたらそこで終了
            }
          }
          // 一度も追加されなければ末尾に追加
          if (!isInserted) {
            indexContent.push(newImportStmt);
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
