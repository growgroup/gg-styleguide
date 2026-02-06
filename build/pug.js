// Pug の設定ファイル
var fs = require("fs");

// ビルドプロセスかどうかを判定
const isBuildProcess = process.env.NODE_ENV === 'production';

var pugconfig = {
  pretty: false,
  cache: false,
  escapePre: true,
  basedir: "app/",
  locals: {
    addFile: async function (componentName, type) {
      let typePrefix = '';
      let folderName = '';
      let wpFolderName = '';

      if (type === 'component') {
        typePrefix = 'c-';
        folderName = 'object/components';
        wpFolderName = 'wordpress/components';
      } else if (type === 'project') {
        typePrefix = 'p-';
        folderName = 'object/project';
        wpFolderName = 'object/project';//将来的に拡張する場合はここを変更
      } else if (type === 'layout') {
        typePrefix = 'l-';
        folderName = 'layout';
        wpFolderName = 'wordpress/layout';
      }

      let componentPath = __dirname + '/../app/assets/scss/' + folderName + '/' + componentName + '.scss';
      let indexFilePath = __dirname + '/../app/assets/scss/' + folderName + '/_index.scss';
      let wpComponentPath = __dirname + '/../app/assets/scss/' + wpFolderName + '/' + componentName + '.scss';
      let wpIndexFilePath = __dirname + '/../app/assets/scss/' + wpFolderName + '/_index.scss';

      try {
        fs.statSync(componentPath);
        return true;
      } catch (err) {
        // componentPathにファイルが存在しない場合、wpComponentPathも確認
        try {
          // wpComponentPathにファイルが存在する場合は、componentPathにも作成しない
          fs.statSync(wpComponentPath);
          if (!isBuildProcess) {
            console.warn('\x1b[33m[Info] @sass/wordpress に重複するコンポーネントが存在しています。\x1b[0m:',wpComponentPath);
          }
          return true;
        } catch (wpErr) {
          // どちらにも存在しない場合のみ、ファイルを作成
          await fs.writeFileSync(componentPath, '.' + typePrefix + componentName + ' {\n\n}', {flag: "a"});

          // index.scss にインポート文を追加
          let indexContent = fs.readFileSync(indexFilePath, {encoding: 'utf8', flag: 'r'}).split("\n");
          let wpIndexContent = fs.readFileSync(wpIndexFilePath, {encoding: 'utf8', flag: 'r'}).split("\n");
          let newImportStmt = "@import '" + componentName + "';";
          let alreadyImported = indexContent.includes(newImportStmt) || wpIndexContent.includes(newImportStmt);

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
