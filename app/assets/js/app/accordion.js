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

      // ターゲットの初期設定
      target.defaultOpen = target.attr("open") !== undefined; //初期値がopenか確認
      target.responsive = target.data("accordion-responsive");
      target.title = target.find('*[' + this.options.titleTargetAttr + ']').eq(0);
      target.content = target.find('*[' + this.options.contentTargetAttr + ']').eq(0);

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
    target.title.off('click'); // イベントを削除
    this.accordion(target);

    if(!target.defaultOpen){
      target.removeAttr('open');
    }
  }

  // ターゲットの破棄
  elementDestroy(target) {
    target.attr("open",'');//open属性をつける（アコーディオンを開く）

    target.title.off('click'); // イベントを削除
    target.title.on('click', (e) => {
      // クリックされた要素が a タグの場合は処理をスキップ
      if (e.target.tagName.toLowerCase() === 'a') {
        return;
      }
      // デフォルトの動作をキャンセル
      e.preventDefault();
    });
  }


  /**
   * アコーディオンの動作
   * @param el
   */
  accordion(el) {
    $(el.title).on('click', (e) => {
      e.preventDefault();
      if(el.content.parent().attr("open")){
        // open属性がついていれば：アコーディオンを閉じるときの処理
        el.content.slideUp(this.options.speed, function (){
          // アニメーションの完了後にopen属性を取り除き、display:none;を外す
          $(this).parent().removeAttr("open");
          $(this).show();
        });
      } else {
        // open属性が無ければ:アコーディオンを開くときの処理
        // open属性を付ける
        el.content.parent().attr("open",'');
        // いったんdisplay:none;してからslideDownで開く
        el.content.hide().slideDown(this.options.speed);
      }
    });

  }
}
