import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'

const BASE_DIR = "../../"

export default {
  mode: 'development',
  context: __dirname + '/app/',
  entry: {
    app: __dirname + '/app/assets/js/app.js',
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'assets/js/[name].js',
    publicPath: BASE_DIR,
  },
  watch: false,
  module: {
    rules: [
      {
        test: /\.(scss|css)/,
        enforce: 'pre',
        loader: 'import-glob-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.(scss|css|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          }
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/fonts/',
            emitFile: true
          }
        }]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/plugin_images/',
              emitFile: true,
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],
  devtool: 'cheap-module-source-map',
}
