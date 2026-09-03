# 診断 Playbook（gg-styleguide 固有）

chrome-devtools-mcp の insight を、このテンプレの実ファイルに翻訳して修正提案にする対応表。
形式: insight/症状 → 該当ファイル/mixin → 修正 → 効果目安。

> 実ファイル確認済み（2026-07-21 時点のリポジトリ）:
> - 画像 mixin: `app/inc/mixins/_misc.pug` の `mixin img(file,alt,width,height)`（テンプレート内では `+img(...)` として利用）。
> - フォント: `app/assets/scss/font.scss` は `@fontsource-variable/material-symbols-outlined` のみを `@use "pkg:..."` で読み込み（アイコンフォント用。静的版と `@fontsource/material-icons-*` はコメントアウトで残置）。本文/見出し用の可変フォント（`@fontsource-variable/roboto-flex`、`@fontsource/noto-sans-jp`、`@fontsource/line-seed-jp`）は `app/assets/js/fonts.js` に `import` されており、`webpack.config.babel.js` の `fonts` エントリでビルドされる（CSS ビルドの `webpack.style.config.babel.js` 側ではない点に注意）。
> - JS エントリ: `webpack.config.babel.js` の `entry` は `app`（`app/assets/js/app.js`）と `fonts`（`app/assets/js/fonts.js`）の2本。CSS ビルドは `webpack.style.config.babel.js`（`style` / `editor` / `print` の3エントリ、`app/assets/scss/*.scss` を対象）。
> - `app/assets/js/app.js` で実際に有効化されているのは jQuery 前提のユーティリティ群、`swiper`（`app/assets/js/app/swiper.js` 経由の `SwiperSlider`）、`micromodal`（`app/assets/js/app/modal.js`）、`gsap`（`app/assets/js/app/gsap.js`）、`scroll-hint`（`app/assets/js/app/scrollable.js` 経由）。`lenis`・`lottie-web`・`simple-parallax-js`・`modaal` はモジュールとして `app/assets/js/app/` 配下に存在するが `app.js` 内で `import` がコメントアウトされており未使用（必要なページのみ有効化する設計）。`slick-carousel` と `owl.carousel` は `package.json` の依存関係には残っているが、現状の `app/assets/js/app/` にはそれらを読み込むモジュールが無く、実装上は不使用（未使用依存＝JS/CSS 肥大の原因候補）。

## LCP（hero 画像・フォント・CSS ブロッキング）
- **画像が LCP 要素**（LCP breakdown で load 遅延が大）
  - 該当: `app/assets/images/`、`app/**/*.pug` 内の `+img(...)`（定義は `app/inc/mixins/_misc.pug`）
  - 修正: WebP/AVIF 化 + 表示サイズに合わせた画像寸法。hero だけ `loading="eager"` + `fetchpriority="high"`、他は `loading="lazy"`。hero 画像を `<link rel="preload" as="image">`。
  - 効果目安: LCP -1.0〜1.5s
- **レンダーブロッキング CSS**（render-blocking requests に `style.css`）
  - 該当: `webpack.style.config.babel.js`（`style.scss` エントリ）、レイアウト側の CSS 読み込み箇所
  - 修正: 重要 CSS を先行、非クリティカル CSS（`editor.scss`/`print.scss` 相当や下部セクション専用スタイル）の `media` 分割/遅延読み込み。
  - 効果目安: FCP/LCP -0.3〜0.8s
- **フォント遅延**（フォント読み込みが LCP をブロック）
  - 該当: アイコンフォントは `app/assets/scss/font.scss` の `@fontsource-variable/material-symbols-outlined`（`@use "pkg:..."`)。本文/見出しフォントは `app/assets/js/fonts.js` の `@fontsource-variable/roboto-flex` / `@fontsource/noto-sans-jp`（400/500/600/700） / `@fontsource/line-seed-jp`（400/700）。
  - 修正: 使用ウェイトを実際に使うものだけに限定（`noto-sans-jp` の 4 ウェイトが全て使われているか要確認）、`font-display: swap`、hero で使うフォントは preload。`material-symbols` はコメントアウトで1バリアント（`outlined` の可変フォント版・`$axes: (FILL, wght)` で約1.1MB）のみ有効化されている状態を維持し、他バリアントを誤って有効化しない。Fill を使わないデザインなら `$axes: wght` で約750KBに削減できる。GRAD / opsz を使うと `full`（約3.9MB）になるため原則変更しない。アイコンフォントは `font-display: block` を維持する（`swap` にするとアイコン名のテキストが露出する）。
  - 効果目安: LCP -0.2〜0.6s

## CLS（レイアウトシフト）
- **画像に寸法が無い**（layout shift culprits が画像）
  - 該当: `+img` 使用箇所（`app/inc/mixins/_misc.pug` 定義）
  - 修正: `+img` 呼び出し時に `width`/`height` 引数を必ず渡す、または CSS 側で `aspect-ratio` を付与。
  - 効果目安: CLS -0.05〜0.2（該当画像がビューポート内の場合）
- **Web フォント FOUT**
  - 該当: `app/assets/scss/font.scss`（`@fontsource-variable/material-symbols-outlined`）、`app/assets/js/fonts.js`（`roboto-flex`/`noto-sans-jp`/`line-seed-jp`）
  - 修正: `font-display` とフォールバックの `size-adjust`/metrics 整合。
  - 効果目安: CLS -0.02〜0.1
- **カルーセル/スライダー/モーダルの遅延初期化でのシフト**
  - 該当: `InfiniteSlider`（`app/assets/js/app/infinite-slider.js`、gsap+imagesloaded ベース、`app.js` で常時有効化 — 画像ロード後に幅を計算するため late shift の主因になりやすい）、`swiper`（`app/assets/js/app/swiper.js` の `SwiperSlider`、`app.js` で有効化）、`micromodal`（`app/assets/js/app/modal.js`）、`scroll-hint`（`app/assets/js/app/scrollable.js`）。`slick`/`owl.carousel`/`modaal`/`lenis`/`simple-parallax-js` は依存関係上は存在するが現状 `app.js` で未使用（有効化する場合も同様の対策が必要）。
  - 修正: 初期化前にプレースホルダ高さ（`aspect-ratio`/min-height）を確保。`InfiniteSlider` は imagesloaded 完了までコンテナ高さを固定し、`swiper` はコンテナに固定高さ/aspect-ratio を指定して初期化完了までスケルトンを表示。
  - 効果目安: CLS -0.05〜0.15
- **表示/非表示トグル系コンポーネントでのシフト**
  - 該当: `app/assets/js/app/` 配下の Accordion / Tab / Dropdown 等（`app.js` で有効化される可視状態を切り替える UI）
  - 修正: 開閉で高さが変わる要素は、上下のコンテンツを押し出さないレイアウト（絶対配置オーバーレイ、`grid-template-rows` トランジション等）にする。初期表示で閉じる要素は SSR/初期 HTML の段階で閉じた高さにしておく。
  - 効果目安: CLS -0.02〜0.1

## INP / TBT（メインスレッド・JS 肥大）
- **重い JS バンドル / 未使用ライブラリの同居**
  - 該当: `webpack.config.babel.js` の `app` エントリ（`app/assets/js/app.js`）、jQuery 前提のユーティリティ群 + `swiper`
  - 修正: `package.json` に残る `slick-carousel`/`owl.carousel`（未使用）、`app.js` でコメントアウト中の `modaal`/`lenis`/`lottie-web`/`simple-parallax-js` を、使う予定が無ければ依存ごと削除してバンドルサイズを削減。使う場合はページ単位で動的 `import()` に切り出し、スクリプトを `defer` 化。
  - 効果目安: TBT/INP を大きく削減
- **GSAP のジャンク**
  - 対応: 参照先の指針に従う（ここでは重複記述しない）
  - 参照: `.cursor/skills/gsap-performance`（transform/opacity 中心、`will-change`、レイアウトスラッシング回避）。ここでは重複記述しない。実装は `app/assets/js/app/gsap.js`（`GsapAnimation`、`app.js` で常時有効化）。
