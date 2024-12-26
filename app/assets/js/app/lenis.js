import Lenis from 'lenis'

/**
 * デフォルトオプション
 */
var defaultOptions = {
  lerp: 0.15,//数字を0.1にするとスクロールの滑らかさが強く、0.2にすると弱くなる
  insideLerp: 0.2,//insideはlerpよりも数値を大きくすると良いかも
  insideSelector: '.js-lenis-inside',
};

export default class LenisScroll {

  /**
   * 初期化
   * @param options
   */
  constructor(options) {
    this.options = $.extend(defaultOptions, options);
    this.init();
  }


  /**
   * 初期化
   *
   */
  init() {
    this.lenis();
    this.lenisInside();
  }


  /**
   * 通常のページ全体への適用
   */
  lenis() {
    const lenis = new Lenis({
      lerp: this.options.lerp,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }


  /**
   * overflow:autoまたはscrollがある場合の適用
   * ただし動的に要素内の高さが変更されると壊れるので
   * slidebarではこちらは使わずに data-lenis-prevent を付与することを推奨
   */
  lenisInside() {
    const containers = document.querySelectorAll(this.options.insideSelector);
    if (containers.length <= 0) return false;

    containers.forEach((container) => {
      const lenis = new Lenis({
        lerp: this.options.insideLerp,
        wrapper: container,
      })

      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    });
  }
}
