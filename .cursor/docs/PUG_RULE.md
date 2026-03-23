# Pug コーディングルール

このドキュメントは、本プロジェクトにおけるPugの作成ルールをまとめたものです。

---

## 1. ディレクトリ構成

```
app/
├── inc/
│   ├── _settings.pug      # サイト全体の設定・ページ情報
│   ├── foundation/        # ベーステンプレート
│   │   ├── _base.pug      # 1カラム用ベース
│   │   ├── _base-twocolumn.pug  # 2カラム用ベース
│   │   └── _head.pug      # HTML head + 共通構造
│   ├── layout/            # レイアウトパーツ
│   │   ├── _header.pug
│   │   ├── _footer.pug
│   │   ├── _aside.pug
│   └── mixins/            # mixin定義ファイル
│       ├── _mixins.pug    # 全mixinをincludeするエントリポイント
│       ├── _cssrules.pug  # BEM命名用mixin（+c, +e, +l など）
│       ├── _misc.pug      # 汎用コンポーネントmixin
│       └── ...
├── format/                # デザインフォーマット確認用
│   ├── index.pug
│   └── components/        # フォーマットパーツ
├── design-format/         # デザイナー確認用フォーマット
└── [ページディレクトリ]/  # 各ページ用pug
```

---

## 2. ページ作成の基本構造

### 2.1 ページテンプレートの継承

```pug
//- 2カラムページの場合
extends /inc/foundation/_base-twocolumn.pug

//- 1カラムページの場合
extends /inc/foundation/_base.pug

```


### 2.2 レイアウトパラメータ（2カラム時）

```pug
block layout_params
  - twoColumnAddClass = "" //- "" or "is-reverse"（サイドバーを左にする場合）
```

### 2.3 主要なblock

```pug
block page_header //- ページヘッダー・パンくずリスト
block body //- メインコンテンツ

//- 1カラム（/inc/foundation/_base.pug）
block under_main //- mainの後

//- 2カラム（/inc/foundation/_base-twocolumn.pug）
block aside //- サイドバー
```

---

## 3. BEM命名規則対応Mixin（cssrules.pug）

このプロジェクトでは、FLOCSSベースの命名規則をPugで簡単に記述するためのmixinを使用します。

### 3.1 コンポーネントmixin `+c`

コンポーネント（`.c-xxx`）を作成します。

```pug
//- 基本形
+c.card-example
  //- 出力: <div class="c-card-example">

//- タグ指定
+c("ul").list-example
  //- 出力: <ul class="c-list-example">

//- モディファイア追加
+c.card-example.is-lg
  //- 出力: <div class="c-card-example is-lg">
```

### 3.2 要素mixin `+e`

コンポーネント内の要素（`.__xxx`）を作成します。

```pug
+c.card-example
  +e.title //- 出力: <div class="c-card-example__title">
  +e("p").text //- 出力: <p class="c-card-example__text">
  +e("img").image //- 出力: <img class="c-card-example__image">
```

### 3.3 レイアウトmixin `+l`

レイアウト（`.l-xxx`）を作成します。

```pug
+l.section
  //- 出力: <div class="l-section">
```

### 3.4 プロジェクトmixin `+pr`

ページ固有コンポーネント（`.p-xxx`）を作成します。

```pug
+pr.home-hero
  //- 出力: <div class="p-home-hero">
```

### 3.5 リンクmixin `+a` / `+ae`

このプロジェクトにはリンク用mixinが2種類あります。

- `+a(href, autoTarget)`（`/inc/mixins/_anchor.pug`）
  パス解決（`config.rootpath` の付与）と、target属性の自動設定を行う通常のリンクです。クラスは通常どおり指定します。
- `+ae(href, autoTarget)`（`/inc/mixins/_cssrules.pug`）
  `+a` と同じ挙動に加えて、`+c/+e` の文脈で **BEMクラスを継承**します（`.link` 等の指定から `c-xxx__link` を自動生成）。

`autoTarget` は省略時 `true`。`true` の場合、外部URL/`.pdf`/`'blank'` 指定で `target="_blank"` が自動で付きます。`false` を渡すと自動設定を無効化します。

```pug
//- 通常のリンク（クラスは任意で指定）
+a("/about/").c-button 会社概要へ

//- 外部リンク（自動でtarget="_blank"）
+a("https://example.com") 外部サイトへ

//- target自動設定を無効化（外部でもtargetを付けない）
+a("https://example.com", false) 外部サイトへ

//- targetを強制的に_blankにしたい場合（内部リンクでも）
+a("/about/", "blank") 会社概要へ

//- BEM要素としてリンクを作りたい場合（クラス継承あり）
+c.card
  +ae("/about/").link 会社概要へ
  //- 出力: <a href="./about/" class="c-card__link">
```

### 3.6 汎用タグmixin

要素名に対応するmixinで、自動的にBEMクラスを継承します。

```pug
+c.card
  +p.text テキスト //- <p class="c-card__text">
  +span.label ラベル //- <span class="c-card__label">
  +h2.title タイトル //- <h2 class="c-card__title">
  +ul.list //- <ul class="c-card__list">
    +li.item アイテム //- <li class="c-card__item">
```

---

## 4. 基本タグMixin（tags.pug）

### 4.1 画像 `+img`

```pug
//- 基本形
+img("filename.jpg", "alt text")

//- サイズ指定
+img("filename.jpg", "alt text", 800, 600)

//- 属性追加
+img("filename.jpg", "alt text", 800, 600)(loading="lazy")
```

### 4.2 レスポンシブ画像 `+picture`

```pug
+picture({
  pc: "image-pc.jpg",
  sp: "image-sp.jpg",
  alt: "説明",
  width: 1200,
  height: 600,
  widthSp: 750,
  heightSp: 500,
  media: ""  //- デフォルト: "(width < 46.875em)" = 750px
})
```

---

## 5. 汎用コンポーネントMixin（misc.pug）

よく使うコンポーネントのmixinが定義されています。


```pug


//- ループ
+loop(10)
  p ループコンテンツ

//- スクローラブル
+c_scrollable
  table.c-table
    //- テーブル内容
```

---

## 6. ページ構成の基本パターン

### 6.1 一般的な下層ページ

```pug
extends /inc/foundation/_base-twocolumn.pug

block append config
  - current.id = "format" // ページのID
  - current.title = "フォーマット" // タイトル
  //- - current.description = `ページごとに説明文を設定する場合の動作サンプルです` // ページごとに説明文を設定する場合のみ
  - current.bodyClass = `${current.id}` // body に付与するクラス
  - current.path = `/${current.id}/` // ページのpath
  - current.depth = 2 // ページの階層

block layout_params
  - twoColumnAddClass = ""

block page_header
  +l_page_header({
    image: "img-page-header-format.jpg",
    subtitle: "サブタイトルあり",
    title: "ページヘッダー",
  })

block body
  section.l-section
    .l-container
      h2.c-heading.is-lg セクション見出し
      p 本文テキスト

block aside
  +l-aside
```

---

## 7. 命名規則とクラス付与

### 7.1 FLOCSS命名

| プレフィックス | 用途                       | 例                           |
| :------------- | :------------------------- | :--------------------------- |
| `l-`           | レイアウト                 | `.l-section`, `.l-container` |
| `c-`           | コンポーネント（汎用）     | `.c-button`, `.c-card`       |
| `p-`           | プロジェクト（ページ固有） | `.p-home-hero`               |
| `u-`           | ユーティリティ             | `.u-mbs`, `.u-hidden-sm`     |
| `is-`          | 状態・バリエーション       | `.is-active`, `.is-lg`       |
| `js-`          | JavaScript用フック         | `.js-accordion`, `.js-modal` |

### 7.2 モディファイア命名

```pug
//- サイズバリエーション
.c-button.is-sm
.c-button.is-lg
.c-button.is-xlg

//- カラーバリエーション
.c-button.is-primary
.c-button.is-secondary

//- 状態
.c-accordion.is-active
.c-tab__item.is-current
```

---

## 8. 注意事項

### 8.1 HTMLタグの選択

- 見出しは適切な見出しタグ（h1〜h6）を使用
- 本文は `p` タグ、リストは `ul/ol` を使用
- `div` は他に適切なタグがない場合のみ使用

### 8.2 画像化の方針

- テキストは可能な限り画像化せず、altを適切に設定
- 複雑なデザインやSPでPCをそのまま縮小する箇所は画像可


---

## 9. 参考ファイル

- `/format/index.pug` - デザインフォーマット確認用（頻出レイアウト・パーツ・メインコンポーネントのまとめ領域）
- `/inc/mixins/_misc.pug` - 汎用mixin定義
