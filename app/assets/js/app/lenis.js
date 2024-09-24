import Lenis from '@studio-freight/lenis'

/**
 * デフォルトオプション
 */
var defaultOptions = {
  insideSlector: '.js-lenis-inside',
  lerp: 0.15,//数字を0.1にするとスクロールの滑らかさが強く、0.2にすると弱くなる
  insideLerp: 0.2,//insideはlerpよりも強めに設定しても良い
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

  lenisInside() {
    const containers = document.querySelectorAll(this.options.insideSlector);
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
