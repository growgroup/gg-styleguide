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
    this.$tabs = null;
    this.options = $.extend(options, defaultOptions);
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    this.$tabs = $(this.options.selector); // 指定されたセレクタに該当するタブを取得
    for (var i = 0; i < this.$tabs.length; i++) { // 各タブに対して処理を実行
      var $tab = $(this.$tabs[i]); // 現在のタブを取得
      var $panes = $();//jQueryオブジェクトを準備
      var $navs = $tab.find(this.options.navsClass).eq(0).find('*[' + this.options.navTargetAttr + ']'); // ナビゲーション要素を取得
      //ナビボタンの数だけループ
      for (var j = 0; j < $navs.length; j++) {
        var $nav = $($navs[j]); // 現在のナビゲーションを取得
        var targetName = $nav.attr(this.options.navTargetAttr); // ターゲットの名前を取得
        var $pane = $tab.find('*[' + this.options.paneNameAttr + '="' + targetName + '"]'); // ターゲットの名前と一致するパネルを取得
        if ($pane.length === 0) { // パネルが見つからない場合
          console.warn('Tab panel is not found.'); // エラーメッセージを出力
        }
        //$panesに追加ループのたびに追加
        $panes = $panes.add($pane);
      }

      if (!$navs.hasClass(this.options.activeClass)) {
        $navs.eq(0).addClass(this.options.activeClass);
      }
      if (!$panes.hasClass(this.options.activeClass)) {
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
