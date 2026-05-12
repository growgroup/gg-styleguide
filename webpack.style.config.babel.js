const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const path = require('path');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');

const BASE_DIR = "../../"

module.exports = (env, argv) => {
  // 開発モードかどうか
  // モード（none / production / development）
  const IS_DEVELOPMENT = argv.mode === 'development';

  const configs = {
    mode: argv.mode,
    stats:'minimal',
    context: __dirname + '/app/',
    // cache: {
    //     type: 'filesystem',
    //     buildDependencies: {
    //         config: [__filename]
    //     }
    // },
    entry: {
      style: __dirname + '/app/assets/pcss/style.pcss',
      editor: __dirname + '/app/assets/pcss/editor.pcss',
      print: __dirname + '/app/assets/pcss/print.pcss',
    },
    output: {
      path: path.join(__dirname, 'dist/'),
      filename: 'assets/js/[name].js',
      publicPath: BASE_DIR,
    },
    optimization: {
      minimizer: [
        `...`,
        new CssMinimizerPlugin({
          minify: async (data, inputMap, minimizerOptions) => {
            const [[filename, source]] = Object.entries(data);
            const postcss = require('postcss');
            const cssnano = require('cssnano');

            let cleaned = '';
            let i = 0;
            while (i < source.length) {
              if (source[i] === '/' && source[i + 1] === '*') {
                const end = source.indexOf('*/', i + 2);
                const slice = end === -1 ? source.slice(i) : source.slice(i, end + 2);
                cleaned += slice;
                i += slice.length;
              } else if (source[i] === '"' || source[i] === "'") {
                const q = source[i];
                let j = i + 1;
                while (j < source.length && source[j] !== q) {
                  if (source[j] === '\\') j++;
                  j++;
                }
                cleaned += source.slice(i, j + 1);
                i = j + 1;
              } else if (source[i] === '/' && source[i + 1] === '/') {
                const nl = source.indexOf('\n', i);
                i = nl === -1 ? source.length : nl;
              } else {
                cleaned += source[i];
                i++;
              }
            }

            const result = await postcss([cssnano({ preset: 'default' })]).process(cleaned, {
              from: filename,
              to: filename,
            });
            return { code: result.css, map: result.map?.toString() };
          },
        }),
      ],
    },
    watch: false,
    module: {
      rules: [
        {
          test: /\.(pcss|css)$/,
          include: [
            path.resolve(__dirname, 'app/assets/pcss'),
          ],
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            },
            {
              loader: "postcss-loader",
            }
          ],
        },

      ]
    },
    plugins: [
      new StylelintWebpackPlugin({
        files: 'assets/pcss/**/*.pcss', // チェック対象のファイルパターン
        fix: true, // 自動修正を有効にする場合
        failOnError: false, // エラーがあった場合ビルドを中断するか
      }),
      new RemoveEmptyScriptsPlugin(), // CSS別出力時の不要JSファイルを削除
      new MiniCssExtractPlugin({
        filename: "assets/css/[name].css",
        chunkFilename: "[id].css"
      })
    ],
  }
  if (IS_DEVELOPMENT) {
    // development であれば、devtool を追加
    configs.devtool = 'eval';
    configs.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename]
      }
    };
    Object.keys(configs.entry).forEach(entryName => {
      configs.entry[entryName] = ['webpack-hot-middleware/client?reload=true', configs.entry[entryName]];
    });
    configs.plugins.push(new webpack.HotModuleReplacementPlugin());
  }


  return configs;
}
