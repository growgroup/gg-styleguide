const pugConfig = require("./build/pug.js")
const pug = require("pug")
const browserSync = require("browser-sync")
const notifier = require('node-notifier');
const url = require("url")
const path = require("path")
const fs = require("fs")
const bs = browserSync.create();

const APPPATH = __dirname + "/app"
const DISTPATH = __dirname + "/dist"

/**
 * ファイルが存在するか判定
 * @param file
 * @returns {boolean}
 */
function fileExists(file) {
  try {
    fs.statSync(file);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
  }
}

/**
 * browserSync ミドルウェア
 * pugのコンパイルを動的に対応
 */
function pugMiddleWare(req, res, next) {
  const requestPath = url.parse(req.url).pathname;
  // .html or / で終わるリクエストだけを対象とする
  if (!requestPath.match(/(\/|\.html)$/)) {
    return next();
  }

  // HTMLファイルが存在すれば、HTMLを返す
  var htmlPath = path.parse(requestPath).ext == '' ? `${requestPath}index.html` : requestPath;

  // pug のファイルパスに変換
  var pugPath = path.join(APPPATH, htmlPath.replace('.html', '.pug'));

  // pugファイルがなければ404を返す
  if (!fileExists(pugPath)) {
    return next();
  }

  // pugがファイルを見つけたのでコンパイルする
  var content = pug.renderFile(pugPath, pugConfig);
  res.setHeader('Content-Type', 'text/html');
  // コンパイル結果をレスポンスに渡す
  res.end(new Buffer(content));
  // next();
}

var config = {
  notify: false,
  open: true,
  ghostMode: {
    clicks: false,
    forms: false,
    scroll: false
  },
  tunnel: false,
  // proxy: "http://change-to-develop-url.dev",
  server: {
    baseDir: [DISTPATH],
    directory: true,
    middleware: [
      pugMiddleWare
    ]
  },
  scrollRestoreTechnique: 'cookie'
}

/**
 * 監視タスク
 */
bs.watch(["dist/*.html","dist/**/*.html"]).on("change", function (event) {
  bs.reload("*.html")
  notifier.notify({
    title: 'Grow Template',
    message: 'Compiled the HTML'
  });
});
bs.watch("dist/assets/**/*.css").on("change", function (event) {
  bs.reload("*.css")
  notifier.notify({
    title: 'Grow Template',
    message: 'Compiled the CSS'
  });
});
bs.watch("dist/assets/**/*.js").on("change", function () {
  bs.reload("*.js")
  notifier.notify({
    title: 'GrowTemplate',
    message: 'Compiled the JavaScript'
  });
});

bs.init(config)
