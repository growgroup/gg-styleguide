// コピーライトの年数自動出力
import $ from "./jquery-shim";


let defaultOptions = {
  selector: ".js-current-year",
}

export default class CopyRight {

  constructor(options) {
    this.options = $.extend(defaultOptions, options);
    this.init();
  }
  /**
   * 初期化
   */
  init() {
    this.targetEle = $(this.options.selector);
    this.run();
  }

  /**
   * 実行
   */
  run() {
    this.targetEle.text(new Date().getFullYear());
  }
}
