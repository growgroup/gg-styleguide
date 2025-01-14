/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 */


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
    this.options = $.extend(true, {}, defaultOptions, options);
    this.$tabs = null;
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    this.$tabs = $(this.options.selector);

    this.$tabs.each((index, tab) => {
      const $tab = $(tab);
      const $parentNavs = $tab.find(this.options.navsClass).eq(0).find(`[${this.options.navTargetAttr}]`);
      const $parentPanes = $tab.find(`[${this.options.paneNameAttr}]`);

      // 親タブの初期設定
      const $defaultParentNav = $parentNavs.filter(`.${this.options.activeClass}`).first() || $parentNavs.eq(0);
      const parentTargetName = $defaultParentNav.attr(this.options.navTargetAttr);

      $parentNavs.removeClass(this.options.activeClass);
      $parentPanes.removeClass(this.options.activeClass);

      $defaultParentNav.addClass(this.options.activeClass);
      $parentPanes.filter(`[${this.options.paneNameAttr}="${parentTargetName}"]`).addClass(this.options.activeClass);

      // 子タブの初期設定
      const $childTab = $parentPanes.filter(`[${this.options.paneNameAttr}="${parentTargetName}"]`);
      this.initChildTabs($childTab);

      // 親タブクリック時の動作
      this.onParentTabClick($parentNavs, $parentPanes);
    });
  }

  /**
   * 子タブの初期化
   */
  initChildTabs($childTab) {
    const $childNavs = $childTab.find(this.options.navsClass).eq(0).find(`[${this.options.navTargetAttr}]`);
    const $childPanes = $childTab.find(`[${this.options.paneNameAttr}]`);

    const $defaultChildNav = $childNavs.filter(`.${this.options.activeClass}`).first() || $childNavs.eq(0);
    const childTargetName = $defaultChildNav.attr(this.options.navTargetAttr);

    $childNavs.removeClass(this.options.activeClass);
    $childPanes.removeClass(this.options.activeClass);

    $defaultChildNav.addClass(this.options.activeClass);
    $childPanes.filter(`[${this.options.paneNameAttr}="${childTargetName}"]`).addClass(this.options.activeClass);

    // 子タブクリック時の動作
    this.onChildTabClick($childNavs, $childPanes);
  }

  /**
   * 親タブクリック時の動作
   */
  onParentTabClick($parentNavs, $parentPanes) {
    const self = this;

    $parentNavs.on('click', function (e) {
      e.preventDefault();

      const $currentParentNav = $(this);
      const parentTargetName = $currentParentNav.attr(self.options.navTargetAttr);

      // 親タブの切り替え
      $parentNavs.removeClass(self.options.activeClass);
      $parentPanes.removeClass(self.options.activeClass);

      $currentParentNav.addClass(self.options.activeClass);
      const $currentParentPane = $parentPanes.filter(`[${self.options.paneNameAttr}="${parentTargetName}"]`);
      $currentParentPane.addClass(self.options.activeClass);

      // 子タブの初期化
      self.initChildTabs($currentParentPane);
    });
  }

  /**
   * 子タブクリック時の動作
   */
  onChildTabClick($childNavs, $childPanes) {
    const self = this;

    $childNavs.on('click', function (e) {
      e.preventDefault();

      const $currentChildNav = $(this);
      const childTargetName = $currentChildNav.attr(self.options.navTargetAttr);

      // 子タブの切り替え
      $childNavs.removeClass(self.options.activeClass);
      $childPanes.removeClass(self.options.activeClass);

      $currentChildNav.addClass(self.options.activeClass);
      $childPanes.filter(`[${self.options.paneNameAttr}="${childTargetName}"]`).addClass(self.options.activeClass);
    });
  }
}
