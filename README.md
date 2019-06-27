# Grow Template [![Build Status](https://travis-ci.org/growgroup/grow-template.svg?branch=master)](https://travis-ci.org/growgroup/grow-template)

Sass & Pug を利用した必要最小限のHTMLコーディング用テンプレートです。

より効率的なHTMLコーディングを実現するために作成しています。

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
git clone https://github.com/growgroup/grow-template
```

もしくは **Download** ボタンからダウンロードし、プロジェクトルートディレクトリへ展開してください。

ディレクトリの用意ができたら下記のコマンドを入力してください。

```shell
npm install
```

## 実行
基本的に、```npm run script```にてタスクを実行します。
詳細は、package.json を確認してください。

#### 開発時 (サーバーが立ち上がります)
```
npm run develop -s
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
│   │       ├── base
│   │       ├── components
│   │       ├── layout
│   │       └── style.scss
│   ├── inc
│   │   ├── components
│   │   ├── core
│   │   │   └── _base.pug
│   │   └── layouts
│   │       ├── _aside.pug
│   │       ├── _footer.pug
│   │       └── _header.pug
│   └── index.pug
├── bower.json
├── bower_components/
├── dist
│   ├── assets
│   │   ├── css
│   │   │   └── style.css
│   │   └── js
│   │       ├── main.js
│   │       ├── scripts.js
│   │       └── vendor.js
│   └── index.html
├── docs
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
    //- サイトの設定
    -
      config = {

        // サイト情報
        site: {
          title: "サイト名",
          description: "説明文",
          keywords: "キーワード",
          viewport: "width=device-width,initial-scale=1",
          favicon: "",
          "apple-touch-icon": "",
          ogp: {
            locale: "ja",
            type: "type",
            title: "title",
            description: "description",
            url: "",
            site_name: "",
            image: ""
          },
        },

        // ページ情報
        pages: {
          'top': {
            name: "top",
            title: "ホーム",
            description: "",
          },
          'about': {
            name: "about",
            title: "私たちについて",
            description: "",
          },
          'service': {
            name: "service",
            title: "サービス紹介",
            description: "",
          },
          'works': {
            name: "works",
            title: "実績紹介",
            description: "",
          },
          'contact': {
            name: "contact",
            title: "お問合せ",
            description: "",
          },

        },
      }


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

