import ScrollHint from 'scroll-hint';
import ScrollHintCss from 'scroll-hint/css/scroll-hint.css';

//  table.c-table-xlg.js-scrollable
//     thead
//       tr
//         th タイトル
//         th タイトル
//         th タイトル
//     tbody
//       tr
//         th タイトル
//         td テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
//         td テキストテキストテキストテキストテキスト
//       tr
//         th タイトル
//         td テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
//         td テキストテキストテキストテキストテキスト

export default class Scrollable {

  constructor() {
    this.targetSelector = ".js-scrollable";
    this.iconWidth = 125;
    this.iconHeight = 86;
    this.init();
  }

  init() {
    const elements = $(this.targetSelector);
    if (elements.length === 0) return;
    this.run();
  }

  run() {
    new ScrollHint(this.targetSelector, {
      suggestiveShadow:true,//シャドウを追加
      applyToParents: true,//親要素に適用
      i18n: {
        scrollable: 'スクロールできます'//表示されるテキストを変更
      }
    });

    $(".scroll-hint-icon").width(this.iconWidth - 20);
    $(".scroll-hint-icon").height(this.iconHeight - 30);
  }
}
