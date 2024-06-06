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
  selector: '.js-anchor',
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

    var self = this;

    this.target.on('click', function(e) {
      e.preventDefault();

      // スクロール先のターゲットを指定
      var anchorTargetSelector = $(this).data(self.options.dataSelector);


      if (typeof anchorTargetSelector === 'undefined') {
        var href = $(this).attr('href');
        var anchorTargetSelector = href.match(/#(\S*)/g);
        if (typeof anchorTargetSelector[0] === 'undefined') {
          throw new Error('ターゲットとなる要素を取得できませんでした。');
          return false;
        }
        anchorTargetSelector = anchorTargetSelector[0];

      }

      var anchorTarget = $(anchorTargetSelector);

      if (anchorTarget.length === 0) {
        throw new Error('ターゲットとなる要素を取得できませんでした。');
        return false;
      }

      let top = anchorTarget.offset().top;


      // ヘッダーの高さを取得
      // target に指定された要素の scroll-margin-top を取得
      let rootHeaderHeight = $('html').css('scroll-padding-top');
      let headerHeight = anchorTarget.css('scroll-margin-top');
      rootHeaderHeight = parseInt(rootHeaderHeight);
      headerHeight = parseInt(headerHeight);
      if (!isNaN(headerHeight)) {
        top -= headerHeight;
      }
      if (!isNaN(rootHeaderHeight)) {
        top -= rootHeaderHeight;
      }
      console.log(headerHeight)

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
