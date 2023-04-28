import webpack from 'webpack'

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const globImporter = require('node-sass-glob-importer');


const BASE_DIR = "../../"

module.exports = (env, argv) => {
    // 開発モードかどうか
    // モード（none / production / development）
    const IS_DEVELOPMENT = argv.mode === 'development';

    const configs = {
        mode: argv.mode,

        context: __dirname + '/app/',
        entry: {
            app: __dirname + '/app/assets/js/app.js',
        },
        output: {
            path: path.join(__dirname, 'dist/'),
            filename: 'assets/js/[name].js',
            publicPath: BASE_DIR,
            environment: {
                arrowFunction: false
            }
        },
        watch: false,
        module: {
            rules: [
                {
                    test: /\.(scss|css|sass)/,
                    enforce: 'pre',
                    loader: 'import-glob-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    enforce: 'pre',
                    loader: 'babel-loader',
                    options: {
                        presets: [[
                            "@babel/preset-env",
                            {
                                "useBuiltIns": "usage",
                                "corejs": 3
                            }
                        ]]
                    }
                },
                {
                    test: /\.(scss|css|sass)$/,
                    include: [
                        path.resolve(__dirname, 'node_modules'),
                    ],
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                esModule: false,
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    importer: globImporter()
                                },
                            }
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
            new CopyPlugin({
                //画像とscripts.jsは、そのままコピーする
                patterns: [
                    {
                        from: path.resolve(__dirname, 'app/assets/images'),
                        to: path.resolve(__dirname, 'dist/assets/images'),
                    },
                    {
                        from: path.resolve(__dirname, 'app/assets/files'),
                        to: path.resolve(__dirname, 'dist/assets/files'),
                    },
                    {
                        from: path.resolve(__dirname, 'app/assets/fonts'),
                        to: path.resolve(__dirname, 'dist/assets/fonts'),
                    },
                    //robots.txtは、そのままコピーする
                    {
                        from: path.resolve(__dirname, 'app/robots.txt'),
                        to: path.resolve(__dirname, 'dist/'),
                    },
                    //その他設定追加したい場合は以下を参考に
                    // {
                    //     from: path.resolve(__dirname, 'app/assets/js/scripts.js'),
                    //     to: path.resolve(__dirname, 'dist/assets/js'),
                    // },
                    // {
                    //     context: path.resolve(__dirname, "app/assets"),
                    //     from: path.resolve(__dirname, 'app/assets/**/*.pdf'),
                    //     to: path.resolve(__dirname, 'dist/assets'),
                    // },
                ]
            }),
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
        externals: {
            jquery: 'jQuery'
        },
    }
    if (IS_DEVELOPMENT) {
        // development であれば、devtool を追加
        configs.devtool = 'cheap-module-source-map';
    }
    return configs;
}
