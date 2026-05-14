// コピーライトの年数自動出力

let defaultOptions = {
  selector: ".js-current-year",
}

export default class CopyRight {

  constructor(options) {
    this.options = Object.assign(defaultOptions, options);
    this.init();
  }
  /**
   * 初期化
   */
  init() {
    this.targetEle = document.querySelectorAll(this.options.selector);
    this.run();
  }

  /**
   * 実行
   */
  run() {
    this.targetEle.forEach((element) => {
      element.textContent = new Date().getFullYear();
    });
  }
}
