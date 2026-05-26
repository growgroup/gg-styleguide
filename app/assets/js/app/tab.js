/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 */

import Utils from "./utils";

const utils = new Utils();

var defaultOptions = {
  selector: '.js-tabs', // 実行するタブを包括するセレクタ
  activeClass: 'is-active', // 有効時に付与する class
  navsClass: '.c-tabs__navs,.js-tabs-nav', // ナビゲーションのクラス
  navTargetAttr: 'data-tab-target',
  paneNameAttr: 'data-tab-name',
  paneClass: '.c-tabs__content,.js-tabs-content',
  tabParam: 'tabID',
};

export default class Tab {

  constructor(options) {
    this.$tabs = null;
    this.options = $.extend({}, defaultOptions, options);
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    // クエリパラメータからタブIDを取得
    const tabID = utils.getQueryString(this.options.tabParam);

    this.$tabs = $(this.options.selector);
    for (var i = 0; i < this.$tabs.length; i++) {
      var $tab = $(this.$tabs[i]);
      var $navs = $tab.find(this.options.navsClass).eq(0).find('*[' + this.options.navTargetAttr + ']');
      var $firstPane = $tab.find('*[' + this.options.paneNameAttr + ']:first-of-type');
      var $panes = $firstPane.parent().children('*[' + this.options.paneNameAttr + ']');

      if (!$navs.hasClass(this.options.activeClass)) {
        $navs.eq(0).addClass(this.options.activeClass);
      }
      if (!$panes.hasClass(this.options.activeClass)) {
        $panes.eq(0).addClass(this.options.activeClass);
      }

      // クエリパラメータがある場合はそのIDを開く
      if (tabID !== false) {
        this.openPanel(tabID, $navs, $panes);
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
      var targetName = $(this).attr(self.options.navTargetAttr);
      self.openPanel(targetName, $navs, $panes, $(this));
    });
  }

  /**
   * 指定したIDと一致するタブを開く（クリック時と同じ class の付け外し）
   * @param {string} targetName タブID
   * @param {object} $navs ナビゲーション
   * @param {object} $panes パネル
   * @param {object} [$clickedNav] クリックされたナビ。省略時は targetName に一致する先頭ナビを有効化
   */
  openPanel(targetName, $navs, $panes, $clickedNav) {
    var activeClass = this.options.activeClass;
    var navTargetAttr = this.options.navTargetAttr;
    var paneNameAttr = this.options.paneNameAttr;

    // クリック経路ならその要素だけ、クエリ経路なら targetName に一致する先頭ナビを取得
    var $targetNav = $clickedNav && $clickedNav.length ? $clickedNav : $navs.filter(function() {
      return $(this).attr(navTargetAttr) === targetName;
    }).eq(0);
    var hasTargetPane = false;

    // 名前が一致するパネルがあるか確認
    for (var i = 0; i < $panes.length; i++) {
      if (targetName === $($panes[i]).attr(paneNameAttr)) {
        hasTargetPane = true;
        break;
      }
    }

    // ナビゲーションかパネルがない場合は処理を中断
    if (!$targetNav.length || !hasTargetPane) {
      return;
    }

    // 全ナビとパネルからactiveを外す
    $panes.removeClass(activeClass);
    $navs.removeClass(activeClass);

    // ターゲットのナビゲーションにactiveを付与
    $targetNav.addClass(activeClass);

    // ターゲット名と一致するパネルにactiveを付与
    for (var j = 0; j < $panes.length; j++) {
      if (targetName === $($panes[j]).attr(paneNameAttr)) {
        $($panes[j]).addClass(activeClass);
      }
    }
  }

}
