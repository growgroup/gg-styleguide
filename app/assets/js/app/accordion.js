/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 *
 * # example:
 * <div class="c-panel js-accordion" data-accordion-responsive="950">
 *     <div class="c-panel__title" data-accordion-title>
 *         Title
 *     </div>
 *     <div class="c-panel__content" data-accordion-content>
 *         Content
 *     </div>
 * </div>
 *
 */

import Utils from "./utils";

const utils = new Utils();


var defaultOptions = {
  selector: '.js-accordion',
  titleTargetAttr: 'data-accordion-title',
  contentTargetAttr: 'data-accordion-content',
  responsive: 0,
  speed: 300,
  defaultOpen: false,
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

      target.responsive = target.data("accordion-responsive");
      // レスポンシブの設定がある場合
      if (target.responsive !== undefined) {
        // Media Query にマッチするか確認
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
        // レスポンシブの設定がない場合、 そのまま実行
        this.elementInit(target);
      }
    }
  }

  // ターゲットの初期化
  elementInit(target) {
    target.title = target.find('*[' + this.options.titleTargetAttr + ']').eq(0);
    target.content = target.find('*[' + this.options.contentTargetAttr + ']').eq(0);
    this.accordion(target);
    if (this.options.defaultOpen) {
      target.content.slideDown();
    }
  }

  // ターゲットの破棄
  elementDestroy(target) {
    if (target.title === undefined) {
      return false;
    }
    target.title.off('click');
    target.title.off('mouseover');
  }


  /**
   * アコーディオンの動作
   * @param el
   */
  accordion(el) {

    $(el.title).on('click', (e) => {
      e.preventDefault();
      el.content.slideToggle(this.options.speed);
      el.content.closest(this.options.selector).toggleClass('is-open');
    });

    $(el.title).on('mouseover', (e) => {
      $(this).css('cursor', 'pointer');
    });

  }
}
