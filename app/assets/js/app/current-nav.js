var defaultOptions = {
  targetSelector: '.js-current-nav', // 実行するセレクタ
  childrenData: "data-parent-nav",
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

      //ここでelementを渡す
      if (this.isMatch(href, $element)) {
        $(this.target[i]).addClass(this.activeClass);
      }
    }
  }

  // ここでelementを受け取る
  isMatch(path, $element) {
    path = path.replace(/^(.*(?:\.\.?))/,'')
    if (this.currentPathname === path || $element.attr(defaultOptions.childrenData) === "true" && this.currentPathname.includes(path)) {
      return true;
    }
    return false;
  }

  isHttp(targetHref) {
    var match = targetHref.match(/^https?:\/\/[^\/]+(.*)/);
    if (match) {
      return match[1]; // フルURLからpathname部分を返す
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
