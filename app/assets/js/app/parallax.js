import simpleParallax from 'simple-parallax-js';


let defaultOptions = {
  overflow: true, // false
  orientation: "up", // up, down, left, right
  delay: .3, // .2, .4, .6...
  transition: 'cubic-bezier(0,0,0,1)',
  scale: 1.4, // 1以上の数字
}

export default class Parallax {

  constructor(options) {
    this.options = $.extend(defaultOptions, options);
    this.targetClassName = ".js-parallax";
    this.init();
  }
  /**
   * 初期化
   */
  init() {
    this.targetEle = $(this.targetClassName);
    this.run();
  }

  /**
   * 実行
   */
  run() {
    if (this.targetEle.length === 0) return;

    /**
     * 各パララックスを実行
     */
    this.parallaxBtt();
    this.parallaxTtb();
    this.parallaxLtr();
    this.parallaxRtl();
  }

  parallaxBtt() {
    var images = document.querySelectorAll(".js-parallax.is-btt");

    if (images.length === 0) return;

    new simpleParallax(images, {
      ...this.options,
    });
  }

  parallaxTtb() {
    var images = document.querySelectorAll(".js-parallax.is-ttb");

    if (images.length === 0) return;

    new simpleParallax(images, {
      ...this.options,
      orientation: "down"
    });
  }

  parallaxLtr() {
    var images = document.querySelectorAll(".js-parallax.is-ltr");

    if (images.length === 0) return;

    new simpleParallax(images, {
      ...this.options,
      orientation: "right",
    });
  }

  parallaxRtl() {
    var images = document.querySelectorAll(".js-parallax.is-rtl");

    if (images.length === 0) return;

    new simpleParallax(images, {
      ...this.options,
      orientation: "left",
    });
  }
}

