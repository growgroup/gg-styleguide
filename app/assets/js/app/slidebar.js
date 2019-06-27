/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 *
 * # example:
 *
 * <div class="js-slidebar-menu">
 *    <ul>
 *        <li>menu</li>
 *        <li>menu</li>
 *        <li>menu</li>
 *    </ul>
 * </div>
 *
 * <a href="#" class="js-slidebar-button"><i class="fa fa-bars"></i></a>
 *
 * <div class="js-slidebar-container">
 *     content
 * </div>
 *
 */

import $ from "./jquery-shim.js"


/**
 * デフォルトオプション
 * @type {{}}
 */
var defaultOptions = {
  containerSelector: '.js-slidebar-container',
  buttonSelector: '.js-slidebar-button',
  menuSelector: '.js-slidebar-menu',
  slideSpeed: 500
}

export default class Slidebar {

  constructor(options) {
    // オプションをセット
    this.options = $.extend(defaultOptions, options);
    // オープン
    this.isActive = false;

    this.init();
  }

  /**
   * 初期化
   */
  init() {

    this.menu = $(this.options.menuSelector)
    this.button = $(this.options.buttonSelector)
    this.container = $(this.options.containerSelector)

    this.trigger();
    this.bodyTrigger();
    this.toggle = this.toggle.bind(this);

    $("body").addClass('slidebar-init')
  }

  /**
   * クリック時のトリガー
   */
  trigger() {
    var self = this;
    $(document).on('click', this.options.buttonSelector, function (e) {
      e.preventDefault();
      self.toggle();
    });
  }

  /**
   * 開閉動作
   */
  toggle() {
    if (this.isActive === false) {
      this.open();
    } else {
      this.close();
    }
  }

  bodyTrigger() {
    var self = this;
    $(document).on('click', this.options.containerSelector, function (e) {
      if (self.isActive) {
        self.close();
      }
    });
  }

  open() {
    $("body").addClass('is-slidebar-active');
    this.isActive = true;
  }

  close() {
    $("body").removeClass('is-slidebar-active');
    this.isActive = false;
  }

}
