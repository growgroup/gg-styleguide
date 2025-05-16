/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 * # example:
 * <a class="js-anchor" data-anchor-taget=".target-selector">
 *     Link
 * </a>
 *
 */
'use strict';


/**
 * デフォルトオプション
 * @type {{}}
 */
var defaultOptions = {
  selector: 'a.js-anchor, button.js-anchor',
  dataSelector: 'anchor-target',
  scrollSpeed: 300,
  easing: 'linear',
};
export default class Anchor {
  constructor(options) {
    // オプションをセット
    this.options = $.extend(defaultOptions, options);
    this.init();
  }


  /**
   * 初期化
   * @param e ターゲットとなるエレメント
   */
  init() {
    this.target = $(this.options.selector);
    this.scrollPaddingTopObj = $(this.options.scrollPaddingTopObj);
    this.onClick();
  }

  /**
   * クリック時のイベント
   */
  onClick() {
    let self = this;

    this.target.on('click', function(e) {
      e.preventDefault();

      // スクロール先のターゲットを指定
      let anchorTargetSelector = $(this).data(self.options.dataSelector);

      // aタグの場合のみhrefの処理を行う
      if ($(this).is('a')) {
        // リンク先のパスと現在のページのパスを比較
        let linkHref = $(this).attr('href').split('#')[0]; // hrefのパス部分を取得
        let currentPath = window.location.pathname; // 現在のページのパス

        // linkHrefが空の場合（#はじまりのリンク）は同一ページと判定
        let isSamePage = !linkHref || new URL(linkHref, window.location.origin).pathname === currentPath;

        // 他ページの場合は何もせずに通常のリンク遷移を行う
        if (!isSamePage) return;

        // data-anchor-targetが未定義の場合、hrefから取得を試みる
        if (typeof anchorTargetSelector === 'undefined') {
          var href = $(this).attr('href');
          anchorTargetSelector = href.match(/#(\S*)/g);
          if (typeof anchorTargetSelector[0] === 'undefined') {
            throw new Error('ターゲットとなる要素を取得できませんでした。');
            return false;
          }
          anchorTargetSelector = anchorTargetSelector[0];
        }
      }

      // data-anchor-targetが未定義の場合はエラー
      if (typeof anchorTargetSelector === 'undefined') {
        throw new Error('ターゲットとなる要素を取得できませんでした。');
        return false;
      }

      let anchorTarget = $(anchorTargetSelector);

      if (anchorTarget.length === 0) {
        throw new Error('ターゲットとなる要素を取得できませんでした。');
        return false;
      }

      let top = anchorTarget.offset().top;


      // 基本的なスクロール位置調整値としてhtml要素のscroll-padding-topを取得
      let rootHeaderHeight = $('html').css('scroll-padding-top');
      // 個別のスクロール位置調整値としてターゲット要素のscroll-margin-topを取得
      let headerHeight = anchorTarget.css('scroll-margin-top');
      rootHeaderHeight = parseInt(rootHeaderHeight);
      headerHeight = parseInt(headerHeight);

      // スクロール位置調整値が数値であれば、スクロール位置から引く（個別の調整値は追加で引く）
      if (!isNaN(headerHeight)) {
        top -= headerHeight;
      }
      if (!isNaN(rootHeaderHeight)) {
        top -= rootHeaderHeight;
      }

      // スクロールさせる
      $('body,html').animate({
        scrollTop: top
      }, {
        duration: self.options.scrollSpeed,
        easing: self.options.easing
      });

      // フォーカスを移動する
      if (document.activeElement !== anchorTarget) {
        let anchorTabindex = anchorTarget.attr('tabindex');
        if (typeof anchorTabindex === 'undefined') {
          anchorTarget.attr('tabindex', '-1');
          anchorTarget.css('outline', 'none');
        }
        anchorTarget.focus().promise().done(function () {
          // フォーカスが完了した後に tabindex を削除
          if (typeof anchorTabindex === 'undefined') {
            $(this).removeAttr('tabindex');
          }
        });
      }

    });
  }
}
