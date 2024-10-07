import {gsap} from "gsap";
import {ScrollTrigger} from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger);
import Utils from './utils.js';

const utils = new Utils();


export default class GsapAnimation {

  /**
   * 初期化
   * @param options
   */
  constructor(options) {
    this.options = $.extend(options);
    this.run();
  }


  /**
   * インスタンス化直後に呼ばれる関数
   */
  run() {
      this.mainVisual();
      // this.sampleCustomSpring();
  }

  /**
   * メインビジュアル
   */
  mainVisual() {
    const targetSelector = ".js-main-visual";
    if (!document.querySelector(targetSelector)) {
      return;
    }
    gsap
      .timeline({
        defaults: {},
        scrollTrigger: {
          trigger: targetSelector,
          start: "top 100%",
        },
      })
        .from(targetSelector,
        {
          opacity: 0,
          delay: .5,
          duration: 1,
        }
      )
  }

  // /**
  //  * Figmaのカスタムスプリングを使用したサンプル
  // */
  // sampleCustomSpring() {
  //   const targetSelector = ".js-box";
  //   if (!document.querySelector(targetSelector)) {
  //     return;
  //   }
  //   gsap.to(targetSelector, {
  //     x: 300,
  //     duration: 0.8,
  //     ease: utils.customSpring(100, 15, 1)
  //   });
  // }


}
