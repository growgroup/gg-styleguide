// Pug の設定ファイル
var fs = require("fs")

var pugconfig = {
    pretty: true,
    cache: false,
    escapePre: true,
    basedir: "app/",
    locals: {
        addComponentFile: function (componentName) {
            var componentPath = __dirname + '/../app/assets/scss/object/components/_' + componentName + '.scss';
            try {
                fs.statSync(componentPath);
                return true;
            } catch (err) {
                fs.writeFile(componentPath, '', (err) => {
                    if (err) {
                        throw err;
                    }
                });
                return false;
            }
        },
        addLayoutFile: function (componentName) {
            var componentPath = __dirname + '/../app/assets/scss/layout/_' + componentName + '.scss';
            try {
                fs.statSync(componentPath);
                return true;
            } catch (err) {
                fs.writeFile(componentPath, '', (err) => {
                    if (err) {
                        throw err;
                    }
                });
                return false;
            }
        },
    }
}

module.exports = pugconfig;
