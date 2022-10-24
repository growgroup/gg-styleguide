import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import globImporter from 'node-sass-glob-importer';
import path from 'path'

const BASE_DIR = "../../"

module.exports = (env, argv) => {
    // 開発モードかどうか
    // モード（none / production / development）
    const IS_DEVELOPMENT = argv.mode === 'development';

    const configs = {
        mode: argv.mode,
        context: __dirname + '/app/',
        cache: {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename]
            }
        },
        entry: {
            style: __dirname + '/app/assets/js/style.js',
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

            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "assets/css/[name].css",
                chunkFilename: "[id].css"
            })
        ],
    }
    if (IS_DEVELOPMENT) {
        // development であれば、devtool を追加
        configs.devtool = 'cheap-module-source-map';
    }
    return configs;
}
