// WordPressのテーマファイルを作成
var fs = require("fs")
var wp = {
  // テーマ名
  'Name': 'grow-html-template',
  // テーマのURI
  'Uri': 'http://github.com/growgroup/grow-html-template',
  // 著者
  'Author': 'growgroup',
  // 著者URL
  'AuthorUri': 'http://grow-group.jp',
  // 説明文
  'Description': 'HTML Boilerplate',
  // バージョン
  'Version': '1.0.0',
  // ライセンス
  'License': 'GPL v3 or Later',
  // ライセンスの詳細が記載されているURI
  'LicenseUri': '',
  // 親テーマ名
  'Template': 'growp',
  // タグ
  'Tag': '',
  // テキストドメイン
  'TextDomain': 'grow-html-template',
  // その他
  'Option': ''
};

var wpThemeInfo = '@charset "UTF-8";\n'
  + '/*\n'
  + ' Theme Name: ' + wp.Name + '\n'
  + ' Theme URI: ' + wp.Uri + '\n'
  + ' Author: ' + wp.Author + '\n'
  + ' Author URI: ' + wp.AuthorUri + '\n'
  + ' Description: ' + wp.Description + '\n'
  + ' Version: ' + wp.Version + '\n'
  + ' Theme License: ' + wp.License + '\n'
  + ' License URI: ' + wp.LicenseUri + '\n'
  + ' Template: ' + wp.Template + '\n'
  + ' Tags: ' + wp.Tag + '\n'
  + ' Text Domain: ' + wp.TextDomain + '\n'
  + wp.Option
  + '*/\n';

function makeWordPressFile() {
  if (wpThemeInfo) {
    fs.writeFile(__dirname + '/../dist/style.css', wpThemeInfo, (err) => {
      if (err) {
        throw err;
      }
    });
    fs.writeFile(__dirname + '/../dist/index.php', '', (err) => {
      if (err) {
        throw err;
      }
    });
    fs.writeFile(__dirname + '/../dist/functions.php', '', (err) => {
      if (err) {
        throw err;
      }
    });
  }
}

makeWordPressFile();
