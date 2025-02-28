/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 *
 * # example:
 * .c-accordion
 *   details.c-accordion__block.js-accordion(data-accordion-responsive="950")
 *     summary.c-accordion__title(data-accordion-title="title")
 *       |タイトルテキスト
 *    .c-accordion__content(data-accordion-content="content")
 *      .c-accordion__content-inner
 *        |コンテンツ
 *
 */

import Utils from "./utils";

const utils = new Utils();

var defaultOptions = {
  selector: '.js-accordion',
  titleTargetAttr: 'data-accordion-title',
  contentTargetAttr: 'data-accordion-content',
  responsive: null,
  speed: 250,
};

export default class Accordion {
  /**
   * 初期化
   * @param options
   */
  constructor(options) {
    this.options = $.extend(defaultOptions, options);
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    // ターゲットを取得する
    this.targetAll = $(this.options.selector);

    // ターゲットが存在しない場合は実行しない
    if (!this.targetAll.length) {
      return false;
    }

    // 実行する
    this.run();
  }

  /**
   * 実行する
   */
  run() {
    for (var i = 0; i < this.targetAll.length; i++) {
      let target = $(this.targetAll[i]);

      
      target.isDetails = target.prop("tagName").toLowerCase() === "details";

      // ターゲットの初期設定
      target.defaultOpen = target.attr("open") !== undefined;
      target.responsive = target.data("accordion-responsive");
      target.title = target.find('*[' + this.options.titleTargetAttr + ']').eq(0);
      target.content = target.find('*[' + this.options.contentTargetAttr + ']').eq(0);

      // レスポンシブの設定がある場合
      if (target.responsive !== undefined) {
        utils.responsiveMatch(
          () => {
            this.elementInit(target);
          },
          () => {
            this.elementDestroy(target);
          },
          "max-width: " + target.responsive + "px"
        );
      } else {
        this.elementInit(target);
      }
    }
  }

  /**
   * ターゲットの初期化
   */
  elementInit(target) {
    target.title.off('click');
    this.accordion(target);

    if (!target.defaultOpen) {
      target.removeAttr('open');
    }
  }

  /**
   * ターゲットの破棄
   */
  elementDestroy(target) {
    target.attr("open", '');

    target.title.off('click');
    target.title.on('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a') {
        return;
      }
      e.preventDefault(); // デフォルトの動作をキャンセル
    });
  }

  /**
   * アコーディオンの動作
   * @param el
   */
  accordion(el) {
    $(el.title).on('click', (e) => {
      e.preventDefault();

      if (el.isDetails) {
        // detailsタグのアコーディオン
        if (el.prop("open")) {
          el.content.slideUp(this.options.speed, function (){
            $(this).parent().removeAttr("open");
            $(this).show();
          });
        } else {
          el.content.parent().attr("open",'');
          el.content.hide().slideDown(this.options.speed);
        }
      } else {
        // 通常のアコーディオン
        if (el.content.parent().attr("open")) {
          el.content.slideUp(this.options.speed, function () {
            $(this).parent().removeAttr("open").show();
          });
        } else {
          el.content.parent().attr("open", '');
          el.content.hide().slideDown(this.options.speed);
        }
      }
    });
  }
}
