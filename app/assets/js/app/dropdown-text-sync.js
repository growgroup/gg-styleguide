/**
 * ドロップダウンメニューにおいて、選択された要素のテキストをトリガー要素のテキストにする
 * ※.js-dropdownと組み合わせて使う想定
 *
 *  // 例
 * .c-dropdown.js-dropdown.js-dropdown-text-sync
 *   button.c-dropdown__trigger(data-dropdown-trigger="trigger") Triger※ここがCurrentに置き換わる
 *   .c-dropdown__content(data-dropdown-target="target")
 *     +a("/hoge/").c-dropdown__item.is-current Current
 *     +a("/fuga/").c-dropdown__item Another
 *
 */

'use strict';

const defaultOptions = {
  selector: '.js-dropdown-text-sync',
  triggerSelector: 'data-dropdown-trigger',
  targetSelector: 'data-dropdown-target',
  currentClasses: ['is-current', 'is-active', 'gt-current-lang'], // 複数のクラスを配列で指定
};

export default class DropdownTextSync {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
    this.init();
  }


  /**
   * 初期化処理
   * ドロップダウン要素を取得し、テキスト同期と変更監視を設定
   */
  init() {
    this.dropdown = document.querySelectorAll(this.options.selector);
    if (!this.dropdown.length) return;

    this.dropdown.forEach(element => {
      this.syncCurrentText(element);
      this.observeChanges(element);
    });
  }


  /**
   * 選択された要素のテキストをトリガー要素に同期
   * @param {Element} element - ドロップダウンのルート要素
   */
  syncCurrentText(element) {
    const trigger = element.querySelector(`[${this.options.triggerSelector}]`);
    const target = element.querySelector(`[${this.options.targetSelector}]`);

    if (!trigger || !target) return;

    // いずれかのクラスを持つ要素を検索
    const currentElement = this.options.currentClasses.reduce((found, className) => {
      return found || target.querySelector(`.${className}`);
    }, null);

    if (currentElement) {
      trigger.textContent = currentElement.textContent.trim();
    }
  }



  /**
   * 要素の変更を監視し、クラスの変更があった場合にテキストを同期
   * @param {Element} element - 監視対象のドロップダウン要素
   */
  observeChanges(element) {
    const target = element.querySelector(`[${this.options.targetSelector}]`);
    if (!target) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          this.syncCurrentText(element);
        }
      });
    });

    const config = {
      attributes: true,// 属性の変更を監視
      subtree: true,// 属性の変更を監視
      attributeFilter: ['class']// classの変更のみを監視
    };

    observer.observe(target, config);
  }
}
