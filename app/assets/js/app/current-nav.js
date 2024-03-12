import url from "url";

var defaultOptions = {
  targetSelector: '.js-current-nav', // 実行するセレクタ
  childrenClass: "js-current-children",
  activeClass: "is-current", // 付与するクラス
}

export default class CurrentNav {

  constructor(options) {
    this.options = $.extend(defaultOptions, options)
    this.init();
  }

  init() {
    // ナビゲーションのターゲット
    this.target = $(this.options.targetSelector);

    // 付与するクラス
    this.activeClass = this.options.activeClass;

    // 現在のURLのパス
    this.currentPathname = window.location.pathname;
    if (this.target.length === 0 || typeof this.currentPathname === "undefined") {
      return false;
    }
    this.run();
  }

  /**
   * ターゲットをセット
   * @param selector
   */
  setTarget(selector) {
    this.target = $(selector);
  }

  /**
   * リセット
   */
  reset() {
    this.target.removeClass("is-current");
  }

  /**
   * 実行
   */
  run() {
    this.reset();
    for (var i = this.target.length - 1; i >= 0; i--) {
      var $element = $(this.target[i]);
      var href = $element.attr('href');
      href = this.isHttp(href);
      href = this.isIndexPage(href);

      if ($element.hasClass(defaultOptions.childrenClass) && this.currentPathname.includes(href)) {
        $(this.target[i]).addClass(this.activeClass);
        // 1個だけにする場合はbreakを有効にする
        // break;
      } else if (this.isMatch(href)) {
        $(this.target[i]).addClass(this.activeClass);
      }
    }
  }

  isMatch(path) {
    path = path.replace(/^(.*(?:\.\.?))/,'')
    if (this.currentPathname === path) {
      return true;
    }

    return false;
  }

  isHttp(targetHref) {
    var match = targetHref.match(/^http/g);
    if (!$.isEmptyObject(match) && match[0] === "http") {
      return url.parse(targetHref).pathname;
    }
    return targetHref;
  }

  isIndexPage(targetHref) {
    var targetMatch = targetHref.substr(-1, 1);
    var locationMatch = this.currentPathname.substr(-1, 1);
    if (targetMatch === "/" && locationMatch === "/") {
      return targetHref;
    }
    if (targetMatch === "l" && locationMatch === "/") {
      this.currentPathname = this.currentPathname + "index.html";
    }

    if (targetMatch === "/" && locationMatch === "l") {
      return targetHref + "index.html";
    }
    return targetHref;
  }
}
