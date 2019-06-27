/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 */
import $ from './jquery-shim.js';


var defaultOptions = {
  selector: '.js-tabs', // 実行するタブを包括するセレクタ
  activeClass: 'is-active', // 有効時に付与する class
  navsClass: '.c-tabs__navs,.js-tabs-nav', // ナビゲーションのクラス
  navTargetAttr: 'data-tab-target',
  paneNameAttr: 'data-tab-name',
  paneClass: '.c-tabs__content,.js-tabs-content'
};

export default class Tab {

  constructor(options) {
    this.$tabs = null;
    this.options = $.extend(options, defaultOptions);
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    this.$tabs = $(this.options.selector);
    for (var i = 0; i < this.$tabs.length; i++) {
      var $tab = $(this.$tabs[i]);
      var $navs = $tab.find('*[' + this.options.navTargetAttr + ']');
      var $panes = $tab.find('*[' + this.options.paneNameAttr + ']');
      if (!$navs.eq(0).hasClass(this.options.activeClass)) {
        $navs.eq(0).addClass(this.options.activeClass);
      }
      if (!$panes.eq(0).hasClass(this.options.activeClass)) {
        $panes.eq(0).addClass(this.options.activeClass);
      }
      this.onClick($navs, $panes);
    }
  }

  /**
   * クリック時の動作
   */
  onClick($navs, $panes) {
    var self = this;
    $navs.on('click', function(e) {
      e.preventDefault();
      $panes.removeClass(self.options.activeClass);
      $navs.removeClass(self.options.activeClass);
      $(this).addClass(self.options.activeClass);
      var targetName = $(this).attr(self.options.navTargetAttr);
      for (var i = 0; i < $panes.length; i++) {
        if (targetName === $($panes[i]).attr(self.options.paneNameAttr)) {
          $($panes[i]).addClass(self.options.activeClass);
        }
      }
    });
  }

}
