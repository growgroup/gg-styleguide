import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import globImporter from 'node-sass-glob-importer';
import path from 'path'

const BASE_DIR = "../../"

export default {
    mode: 'development',
    context: __dirname + '/app/',
    entry: {
        app: __dirname + '/app/assets/js/app.js',
        style: __dirname + '/app/assets/js/style.js',
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
                            esModule:false,
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
                test: /\.(scss|css|sass)$/,
                include: [
                    path.resolve(__dirname, 'app/assets/scss'),
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
