// import Lottie from 'lottie-web';
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


  // /**
  //  * Lottieを使用する場合のサンプル
  //  * import Lottie from 'lottie-web'; をgsap.js上部に追加してから使用してください
  // */
  // sampleLottieScrollTrigger() {
  //   const triggerSelector = ".js-hogehoge-trigger";
  //   const targetSelector = ".js-hogehoge-lottie";
  //   // if (!document.querySelector(triggerSelector)) {
  //     return;
  //   }
  //
  //   // Lottieの初期化
  //   const lottieAnimation = Lottie.loadAnimation({
  //     container: document.querySelector(targetSelector),
  //     renderer: 'svg',
  //     loop: false,//ループしない
  //     autoplay: false,//自動再生しない
  //     path: `/assets/files/sample-lottie.json`, // Lottieファイルのパス
  //   });
  //
  //   // ScrollTriggerの設定 画面内に入ったら発火させる
  //   ScrollTrigger.create({
  //     trigger: triggerSelector,
  //     start: "top 90%",
  //     markers: true,
  //     onEnter: () => {
  //       lottieAnimation.play();
  //     }
  //   });
  // }


}
