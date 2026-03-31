# SCSS コーディングルール

このドキュメントは、本プロジェクトにおけるSCSSの作成ルールをまとめたものです。

---

## 1. ディレクトリ構成

```
app/assets/scss/
├── style.scss              # メインエントリーポイント
├── foundation/             # 基盤設定
│   ├── _settings.scss      # 変数定義（カラー、フォント、ブレイクポイント等）
│   ├── _mixin-basic.scss   # 単位変換・map操作などの基礎function
│   ├── _mixin-math-unit.scss     # rem/vw/cqw/clamp/min などの単位計算function
│   ├── _mixin-queries.scss       # breakpoint/container query 関連
│   ├── _mixin.scss         # 汎用mixin定義（hover/transition等）
│   ├── _mixin-post-content.scss  # 投稿記事用mixin
│   ├── _normalize.scss     # リセットCSS
│   ├── _webfont.scss       # Webフォント設定
│   ├── _form-controls.scss # フォーム要素基本スタイル
│   └── _keyframes.scss     # アニメーション定義
├── layout/                 # レイアウト（l-xxx）
│   ├── _index.scss
│   ├── container.scss
│   ├── section.scss
│   ├── header.scss
│   ├── footer.scss
│   └── ...
├── object/
│   ├── components/         # 汎用コンポーネント（c-xxx）
│   │   ├── _index.scss
│   │   ├── button.scss
│   │   ├── heading.scss
│   │   └── ...
│   ├── project/            # ページ固有コンポーネント（p-xxx）
│   │   └── _index.scss
│   └── utility/            # ユーティリティ（u-xxx）
│       ├── _index.scss
│       ├── margin.scss
│       ├── responsive.scss
│       └── ...
└── wordpress/              # WordPress用スタイル
```

---

## 2. 命名規則（FLOCSS + BEM）

### 2.1 レイヤープレフィックス

| プレフィックス | レイヤー  | 用途                           | ファイル配置         |
| :------------- | :-------- | :----------------------------- | :------------------- |
| `l-`           | Layout    | ページの骨格となるレイアウト   | `layout/`            |
| `c-`           | Component | 再利用可能な汎用コンポーネント | `object/components/` |
| `p-`           | Project   | ページ固有のコンポーネント     | `object/project/`    |
| `u-`           | Utility   | 単一機能のユーティリティ       | `object/utility/`    |

### 2.2 BEM記法

```scss
// Block
.c-card {
}

// Element（__で接続）
.c-card__title {
}
.c-card__image {
}
.c-card__content {
}

// Modifier（.is-で別クラス）
.c-card.is-large {
}
.c-card.is-primary {
}
```

### 2.3 モディファイア命名パターン

```scss
// サイズ
.is-sm    // small
.is-md    // medium
.is-lg    // large
.is-xlg   // extra large
.is-xxs   // extra extra small

// カラー
.is-primary
.is-secondary
.is-accent

// 状態
.is-active
.is-current
.is-disabled

// 位置・方向
.is-top
.is-bottom
.is-center
.is-reverse

// その他
.is-full    // 幅100%
.is-fill    // 塗りつぶし
```

---

## 3. 変数定義（\_settings.scss）

### 3.1 カラー変数

```scss
// 基本の白黒
$color-white: #fff !default;
$color-black: #000 !default;

// ブランドカラー
$color-primary: #003a7e !default;
$color-secondary: #e5eaf0 !default;
$color-tertiary: #cccccc !default;

// アクセントカラー
$color-accent: #ffe3dc !default;

// 機能色
$color-gray: #9fabb9 !default;
$color-background: #eff3f8 !default;
$color-border: #d3d3d3 !default;

// 状態色
$color-state-danger: #d03045 !default;
$color-state-warning: #cc9e12 !default;
$color-state-info: #378da3 !default;
$color-state-success: #13a83a !default;
```

### 3.2 フォント変数

```scss
$font-html-size: 16px !default;
$font-base-size: var(--fz-base) !default;
$font-base-line-height: 1.5 !default;
$font-base-letter-spacing: 0 !default;
$font-base-color: $color-black !default;
$font-base-family: "Noto Sans JP Variable", sans-serif !default;
$font-base-weight: normal !default;
$font-icon-family: "Material Icons" !default;
```

### 3.3 ブレイクポイント

```scss
$breakpoints: (
  small: 0,
  medium: 750px,
  large: 950px,
  xlarge: 1200px,
  xxlarge: 1440px,
) !default;
```

## 4. 主要なMixin

### 4.1 ブレイクポイント `@include breakpoint()`

```scss
// medium以上
@include breakpoint(medium) {
  // 750px以上
}

// mediumのみ
@include breakpoint(medium only) {
  // 750px 〜 949px
}

// medium以下
@include breakpoint(medium down) {
  // 950px未満
}

// small以下（モバイル）
@include breakpoint(small down) {
  // 750px未満
}

// small only（モバイルのみ）
@include breakpoint(small only) {
  // 0 〜 749px
}
```


### 4.2 ホバーMixin

```scss
// 基本ホバー（hover対応デバイスのみ適用）
@include hover {
  opacity: 0.7;
}

// 親要素ホバー時のスタイル
@include group-hover {
  color: $color-primary;
}
```

### 4.3 トランジション

```scss
// 基本（color, bg, border, opacity, transform等）
@include transition();
@include transition(0.5s, ease-out);

// 色のみ
@include transition-colors();

// opacityのみ
@include transition-opacity();

// transformのみ
@include transition-transform();
```

### 4.4 単位変換Function

```scss

// pxからvwへ変換（デザイン幅1400px基準）
width: vw-calc(700); // 50vw

// pxからcqwへ変換（container-type 指定済みコンテナを基準に計算）
width: cqw-calc(700, 1400);

// clamp関数でレスポンシブ値
font-size: clamp-vw(24, 16); // clamp(1rem, vw計算値, 最大値)

// min関数でレスポンシブ値
margin: min-vw(40); // min(2.5rem, vw計算値)
```

### 4.5 その他の便利Mixin

```scss
// 行数制限（line-clamp）
@include line-clamp(2); // 2行で省略

// アイコンフォントスタイル
@include icon-font;
```

---

## 5. コンポーネント作成パターン

### 5.1 基本構造

```scss
/*
---
name: コンポーネント名
category: Category
---
*/

.c-component-name {
  // 基本スタイル

  // 要素
  &__title {
  }
  &__content {
  }
  &__image {
  }

  // モディファイア
  &.is-lg {
  }
  &.is-primary {
  }
}
```

### 5.2 レスポンシブ対応

```scss
.c-button {
  padding: 10px 20px;

  // モバイル対応
  @include breakpoint(small down) {
    padding: 8px 16px;
  }

  // サイズバリエーション
  &.is-lg {
    padding: 14px 28px;

    @include breakpoint(small down) {
      padding: 10px 20px;
    }
  }
}
```

---

## 6. レイアウトパターン

### 6.1 セクション `.l-section`

```scss
.l-section {
  // サイズバリエーション
  &.is-lg {
  }

  // 背景色
  &.is-bg-color {
    background: $color-background;
  }
  &.is-color-primary {
    background: $color-primary;
  }
}
```

### 6.2 コンテナ `.l-container`

```scss
.l-container {
}
```

## 7. ユーティリティクラス

### 7.1 マージン

```scss
.u-mbs {
}
```

### 7.2 レスポンシブ表示制御

```scss
// 非表示
.u-hidden-sm       // 750px未満（small only）で非表示
.u-hidden-md       // 950px未満（medium down）で非表示
.u-hidden-lg       // 750px以上（medium up）で非表示

// 表示（初期は非表示、ブレイクポイント内で表示に切り替え）
.u-visible-sm      // 750px未満（small only）でのみ表示
.u-visible-md      // 950px未満（medium down）でのみ表示
.u-visible-lg      // 750px以上（medium up）でのみ表示

// `.u-visible-*` は `.is-inlineblock` を付けると inline-block で表示できる
```

### 7.3 テキストスタイル

```scss
.u-text-link       // リンクスタイル
.u-text-strong     // 太字
.u-text-center     // 中央揃え
```

---

## 8. アイコンフォント

Material Iconsを使用しています。

```scss
// アイコンフォント出力
&::before {
  content: "chevron_right";
  @include icon-font();
}

// サイズ調整付き
.c-icon-font {
  @include icon-font-style;
  @include icon-font-size-control;
}
```

---

## 9. ファイル追加手順

### 9.1 新規コンポーネント追加

1. `object/components/` に `component-name.scss` を作成
2. `object/components/_index.scss` に `@import` を追加

```scss
// _index.scss
@import "component-name";
```

### 9.2 新規レイアウト追加

1. `layout/` に `layout-name.scss` を作成
2. `layout/_index.scss` に `@import` を追加

---

## 10. 注意事項

### 10.1 スマホ対応

- 固定値が必要な場合は `@include breakpoint(small down)` で個別対応

### 10.2 ホバースタイル

- 必ず `@include hover` を使用（タッチデバイス考慮）

### 10.3 z-index管理

- z-indexは必要最小限に
- 大きな値を使う場合はコメントで理由を記載

### 10.4 `!important` の使用

- 基本は使用禁止（まずセレクタ設計で解決する）
- 例外として、**ユーティリティ**および既存パターン（例：`.l-section.is-top` / `.l-section.is-bottom` / `.u-mbs.is-top` / `.u-mbs.is-bottom` など「片側だけを確実に打ち消す」用途）では使用可
- 新規で `!important` を追加する場合は、理由をコメントで残す

### 10.5 単位指定の方針

- 通常のサイズ指定は `px` を基本とする（ビルド時に `rem` へ自動変換される前提）
- `rem-calc()` は原則不要。複数値の変換など「関数が必要な場面」に限定して使用する

---

## 11. 参考ファイル

- `/format/index.html` - デザインフォーマット確認用(Figmaメインコンポーネントおよび、サイト内頻出コンポーネント確認用)
- `foundation/_settings.scss` - 変数定義
- `foundation/_mixin-basic.scss` - 基礎function
- `foundation/_mixin-math-unit.scss` - 単位計算function
- `foundation/_mixin-queries.scss` - メディア/コンテナクエリ関連
- `foundation/_mixin.scss` - その他汎用mixin
