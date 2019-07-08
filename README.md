# GG StyleGuide [![Build Status](https://travis-ci.org/growgroup/grow-template.svg?branch=master)](https://travis-ci.org/growgroup/grow-template)

GrowGroupデザインシステムに基づいて作成したスタイルガイドです。

1カラム、2カラム、アーカイブ、シングルページのHTMLコーディング用テンプレートも用意されています。
SCSS & Pug を利用しています。

なお、最終的に WordPress の子テーマとしての利用を前提として作成しています。

要望・改善点等は issues へお願いします。

## 必要なモジュール/ソフト

必要なモジュール/ソフトは下記の通りです。

Homebrew、もしくはその他の方法でインストールすること。

* node >=6.3.1
* git
* editorconfig (各IDE, テキストエディタのプラグイン/パッケージ)

## インストール

```shell
git clone https://github.com/growgroup/gg-styleguide.git
```

もしくは **Download** ボタンからダウンロードし、プロジェクトルートディレクトリへ展開してください。

ディレクトリの用意ができたら下記のコマンドを入力してください。

```shell
npm install
```

## 実行
基本的に、```npm run script```にてタスクを実行します。
詳細は、package.json を確認してください。

#### 開発サーバー (デフォルト：local:3000)
```
npm run develop -s
```

#### スタイルガイド (デフォルト：local:3100)
開発サーバーを立ち上げた後、もしくはdistを生成した後に起動してください。
```
npm run styleguide
```

#### 公開時
```
npm run build
```

## ディレクトリ構成

基本的に、app ディレクトリ内の静的ファイルを Gulp で操作後、
dist ディレクトリ内に展開します。

```json
.
├── README.md
├── app
│   ├── assets
│   │   ├── fonts
│   │   ├── images
│   │   ├── js
│   │   └── scss
│   │       ├── foundation
│   │       ├── layout
│   │       ├── object
│   │       │    ├── components
│   │       │    ├── project
│   │       │    └── utility
│   │       └── style.scss
│   ├── inc
│   │   ├── foundation
│   │   ├── layout
│   │   ├── mixins
│   │   └── _settings.pug
│   ├── onecolumn
│   ├── twocolumns
│   ├── archive-onecolumn
│   ├── archive-twocolumns
│   ├── format
│   │   ├── layout
│   │   ├── components
│   │   └── index.pug
│   └── robots.txt
├── build
├── config
├── node_modules
├── webpack.config.babel.js
├── server.js
└── package.json

```

## 作業の進め方

### Pug

##### _settings.pug の編集

app/inc/_settings.pug ファイルの値を変更することで、
自動的に変数に値がセットされ、HTMLにコンパイル時に反映されます。

```pug
    // --------------------------
        // 1. サイト情報
        // --------------------------
    
        // サイトのルートパスを設定
        // "" でドメイン直下からパスを開始
        root: "",
        site: {
          title: "株式会社 サンプル",
          titleSeparator: " | ",
          description: "説明文",
          keywords: "キーワード",
          viewport: "width=device-width,initial-scale=1",
          favicon: "",
          "apple-touch-icon": "",
          ogp: {
            locale: "ja_JP",
            type: "website",
            title: "株式会社 サンプル",
            description: "説明文",
            url: "",
            site_name: "株式会社 サンプル",
            image: "/assets/images/ogp.png"
          },
        },

```

#### 注意点

* a,link,script,img タグなど、パスを記述するタグについては、mixin をそれぞれ利用してください。

```pug
+a("/about/")
+link("/assets/css/style.css")(rel="stylesheet")
+script("/assets/js/scripts.js")
+img("img-demo01.jpg", "alt属性の値")
```

### Sass

本テンプレートでは SCSS を採用しています。
また CSSのコーディングルールとしてFLOCSSにて統一しています。

[https://github.com/hiloki/flocss](https://github.com/hiloki/flocss)


##### Function & mixin


### JavaScript

##### ESLint について

JavaScript の構文チェッカーとして ESLint を採用しています。

[http://eslint.org/](http://eslint.org/)

### その他

* [HTMLコーディング規約](docs/RULES_HTML_CODING.md)
* [命名規則](docs/RULES_NAMING.md)

