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
 *  <div class="js-slidebar-container">
 *
 *    content
 *
 *  </div>
 * </div>
 *
 */


/**
 * デフォルトオプション
 * @type {{}}
 */
var defaultOptions = {
  containerSelector: '.js-slidebar-container',
  buttonSelector: '.js-slidebar-button',
  menuSelector: '.js-slidebar-menu',
  activateWidth: 950,//950px未満の場合のみ有効化。PCでもslidebarを利用する場合はnullを設定
  slideSpeed: 500
}

export default class Slidebar {

  constructor(options) {
    // オプションをセット
    this.options = $.extend(defaultOptions, options);
    // オープン
    this.isActive = false;

    this.init();

    if (this.options.activateWidth !== null) {
      this.setupResizeObserver(); // ResizeObserverをセットアップ
    }
  }

  /**
   * 初期化
   */
  init() {

    this.menu = $(this.options.menuSelector)
    this.button = $(this.options.buttonSelector)
    this.container = $(this.options.containerSelector)

    this.trigger();
    this.closeOnOuterClick();
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

    // ページ内リンク時の挙動
    this.menu.find("a[href*='#']").on('click', function (e) {
      self.close();
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

  closeOnOuterClick() {
    var self = this;
    $(document).on('click', this.options.containerSelector, function (e) {
      if (e.target === e.currentTarget && self.isActive) {
        self.close();
      }
    });
  }

  open() {
    $("body").addClass('is-slidebar-active');
    this.isActive = true;
    this.menu.removeAttr("inert");

    this.focusToMenu();
  }

  close() {
    $("body").removeClass('is-slidebar-active');
    this.isActive = false;
    this.menu.attr("inert", "inert");

    this.focusToOuterMenu();
  }

  focusToMenu() {
    // フォーカスを移動する
    if (document.activeElement !== this.menu) {
      let anchorTabindex = this.menu.attr('tabindex');
      if (typeof anchorTabindex === 'undefined') {
        this.menu.attr('tabindex', '-1');
        this.menu.css('outline', 'none');
      }
      this.menu.focus().promise().done(function () {
        // フォーカスが完了した後に tabIndex を削除
        if (typeof anchorTabindex === 'undefined') {
          $(this).removeAttr('tabindex');
        }
      });
    }
  }

  focusToOuterMenu() {
    // フォーカスを移動する
    let anchorTabindex = $("body").attr('tabindex');
    if (typeof anchorTabindex === 'undefined') {
      $("body").attr('tabindex', '-1');
      $("body").css('outline', 'none');
    }
    $("body").focus().promise().done(function () {
      // フォーカスが完了した後に tabIndex を削除
      if (typeof anchorTabindex === 'undefined') {
        $(this).removeAttr('tabindex');
      }
    });
  }

  setupResizeObserver() {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect.width > this.options.activateWidth) {
          document.body.classList.remove("is-slidebar-active");
          this.isActive = false;
          this.menu.attr("inert", "inert");
        }
      }
    });

    // 監視対象となる要素を設定
    resizeObserver.observe(document.body);
  }

}
