const pugConfig = require("./build/pug.js")
const pug = require("pug")
const pugCache = new Map();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
// const webpackConfig = require("./webpack.config.babel.js")
const webpackStyleConfig = require("./webpack.style.config.babel.js")
// const jsCompiler = webpack(webpackConfig({}, {mode: 'development'}));
const styleCompiler = webpack(webpackStyleConfig({}, {mode: 'development'}));
const browserSync = require("browser-sync")
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

  // pugのキャッシュ生成
  const pugStats = fs.statSync(pugPath);
  const cacheKey = pugPath;
  const cachedData = pugCache.get(cacheKey);

  if (cachedData && cachedData.mtime === pugStats.mtime.getTime()) {
    res.setHeader('Content-Type', 'text/html');
    res.end(cachedData.content);
    return;
  }
  try {
    // pugがファイルを見つけたのでコンパイルする
    var content = pug.renderFile(pugPath, pugConfig);

    // キャッシュを更新
    pugCache.set(cacheKey, {
      mtime: pugStats.mtime.getTime(),
      content: content
    });

    res.setHeader('Content-Type', 'text/html');
    // コンパイル結果をレスポンスに渡す
    res.end(new Buffer.from(content));

  } catch (err) {
    // エラー画面を返す
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/html');

  const escape = (str = '') =>
    String(str).replace(/[&<>"']/g, s => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[s]));

  // ★ Pug が教えてくれる「本当の原因ファイル」
  const errorFile =
    err.filename ||
    err.path ||
    err.babylonError?.filename ||
    pugPath;

  const mainStack = err.stack || err.toString();
  const babelStack = err.babylonError?.stack || '';

  res.end(`
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pug Error</title>
  <style>
    body {
      font-family: monospace;
    }
  </style>
</head>
<body>
  <h1>Pug Compile Error</h1>
  <h2>Entry</h2>
  <pre>${escape(errorFile)}</pre>
  <h2>Stack</h2>
  <pre>${escape(mainStack)}</pre>
  ${babelStack ? `
    <pre>${escape(babelStack)}</pre>
  ` : ''}
</body>
</html>
  `);
  }
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

      // webpackDevMiddleware(jsCompiler, {
      //   publicPath: '/',
      //   stats: {colors: true}
      // }),
      webpackDevMiddleware(styleCompiler, {
        publicPath: '/',
        stats: 'minimal',
      }),

      // webpackHotMiddleware(jsCompiler),
      webpackHotMiddleware(styleCompiler),
      pugMiddleWare,
    ],
  },
  scrollRestoreTechnique: 'cookie'
}

/**
 * 監視タスク
 */

bs.watch(["app/*.pug", "app/**/*.pug"]).on("change", function (event) {

    // キャッシュをクリア
    pugCache.clear();
    bs.reload("*.html")
});

bs.watch("app/assets/**/*.scss").on("change", function (event) {
  bs.reload("*.css")
});
bs.watch("dist/assets/**/*.js").on("change", function () {
  bs.reload("*.js")
});

bs.init(config)
