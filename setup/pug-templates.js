/**
 * Pug 生成用テンプレート（npm run setup 時に generate-pug.js から読み込まれる）
 *
 * プレースホルダー（置換されるもの）:
 *   {{extendsPath}} {{configBlock}} {{pageHeaderBlock}} … これらだけが実行時に差し替わります。
 *
 * それ以外（block body / under_main / aside の中身など）はすべて直書きです。
 * 自由に Pug を記述してください。
 */

// -----------------------------------------------------------------------------
// block append config 用
// 置換: {{id}} {{title}} {{currentPath}} {{depth}}。各要素は Pug の 1 行です。
// -----------------------------------------------------------------------------
const configBlock = [
  "block append config",
  "  - current.id = \"{{id}}\" // ページのID",
  "  - current.title = \"{{title}}\" // タイトル",
  "  //- - current.description = `これは${current.title}についての説明文です` // ページごとに説明文を設定する場合のみ",
  "  - current.bodyClass = `${current.id}` // body に付与するクラス",
  "  - current.path = \"{{currentPath}}\" // ページのpath",
  "  - current.depth = {{depth}} // ページの階層",
].join("\n");

// -----------------------------------------------------------------------------
// block page_header 用
// プレースホルダー: {{pathsBlock}}（パンくず配列）
//
// 【分離型】+c_breadcrumb を外だしする場合: block page_header 内で
//   (1) +l_page_header から breadcrumb を抜く
//   (2) 任意の箇所に +c_breadcrumb を追加し、paths に {{pathsBlock}} をそのまま渡す
// 追加する部分の例:
//   +c_breadcrumb({
//     paths: {{pathsBlock}}
//   })
//
// -----------------------------------------------------------------------------
const pageHeader = `block page_header
  +l_page_header({
    title: current.title,
    image: "img-page-header-format.jpg",
    breadcrumb: {
      paths: {{pathsBlock}}
    }
  })
`;

// -----------------------------------------------------------------------------
// 1カラムレイアウト全文（_base.pug 用）
// 置換: {{extendsPath}} {{configBlock}} {{pageHeaderBlock}} のみ。block body / under_main は自由に記述可。
// -----------------------------------------------------------------------------
const oneColumn = `extends {{extendsPath}}
{{configBlock}}

{{pageHeaderBlock}}

block body
  section.l-section.is-md
    .l-container

block under_main
  +l_offer
`;

// -----------------------------------------------------------------------------
// 2カラムレイアウト全文（_base-twocolumn.pug 用）
// 置換: {{extendsPath}} {{configBlock}} {{pageHeaderBlock}} のみ。block body / aside 等は自由に記述可。
// -----------------------------------------------------------------------------
const twoColumn = `extends {{extendsPath}}
{{configBlock}}

block layout_params
  - twoColumnAddClass = "" //- "" or "is-reverse"

{{pageHeaderBlock}}

block body
  section.l-section.is-md
    .l-container

block aside
  +l-aside()
`;

// -----------------------------------------------------------------------------
// エクスポート（必須。不足時は generate-pug.js がエラーで終了する）
// -----------------------------------------------------------------------------
module.exports = {
  configBlock,
  pageHeader,
  oneColumn,
  twoColumn,
};
