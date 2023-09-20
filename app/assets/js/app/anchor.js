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
  headerElement:'.l-header' // ヘッダーの高さ分ずらしたいとき '.l-header' のように
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
    this.onClick();
    this.run();
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
      var top = anchorTarget.offset().top;

      //headerElementの指定があればheaderの高さを測って top の値をずらす
      var headerHeight;
      if (self.options.headerElement) {
        headerHeight = $(self.options.headerElement).outerHeight();
        top = top - headerHeight
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
          // フォーカスが完了した後に tabindex と スタイルを削除
          if (typeof anchorTabindex === 'undefined') {
            $(this).removeAttr('tabindex');
            $(this).css('outline', '');
          }
        });
      }

    });
  }


  /**
   * ページロード時に実行
   */
  run() {
    var self = this;
    //headerElementの指定があればheaderの高さを測って表示位置をずらす
    var headerHeight;
    var url = $(location).attr('href');
    if (url.indexOf("#") !== -1) {
      if (self.options.headerElement) {
        window.onload = function() {
          headerHeight = $(self.options.headerElement).outerHeight();
          var id = url.split("#");
          var $target = $('#' + id[id.length - 1]);
          if ($target.length) {
            var pos = $target.offset().top - headerHeight;
            $("html, body").animate({scrollTop: pos}, 10);
          }
        };
      }
    }
  }
}


