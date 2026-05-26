// import Lottie from 'lottie-web';
import {gsap} from "gsap";
import {ScrollTrigger} from 'gsap/ScrollTrigger'
// import {GSDevTools} from "gsap/GSDevTools";
// import {MorphSVGPlugin} from "gsap/MorphSVGPlugin";

gsap.registerPlugin(ScrollTrigger);
// gsap.registerPlugin(GSDevTools);
// gsap.registerPlugin(MorphSVGPlugin);

import Utils from './utils.js';

const utils = new Utils();


export default class GsapAnimation {

  /**
   * 初期化
   * @param options
   */
  constructor(options) {
    this.options = Object.assign({}, options);
    this.run();
  }


  /**
   * インスタンス化直後に呼ばれる関数
   */
  run() {
      this.mainVisual();
      this.scrollSpy();
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

  /**
   * ScrollSpy
   *
   * example: 横スクロールあり
   *
   * <nav class="js-scrollspy-nav">
   *   <ul class="js-scrollspy-nav-inner">
   *     <li><a href="#one">one</a></li>
   *     <li><a href="#two">two</a></li>
   *     <li><a href="#three">three</a></li>
   *   </ul>
   * </nav>
   *
   * example: 横スクロールなし
   *
   * <nav class="js-scrollspy-nav">
   *   <ul>
   *     <li><a href="#one">one</a></li>
   *     <li><a href="#two">two</a></li>
   *     <li><a href="#three">three</a></li>
   *   </ul>
   * </nav>
   *
   * <section id="one"></section>
   * <section id="two"></section>
   * <section id="three"></section>
   */
  scrollSpy() {
    const targetSelector = ".js-scrollspy-nav";
    const mediaQuery = "(width > 950px)";//PCのみ発火させる
    // const InnerSelector = ".js-scrollspy-nav-inner"; //ナビ内の横スクロールありの場合は使用
    const scrollspyNavs = document.querySelectorAll(targetSelector);
    if (!scrollspyNavs.length) {
      return;
    }

    const mm = gsap.matchMedia();
    mm.add(mediaQuery, () => {
      scrollspyNavs.forEach((nav) => {
        const links = nav.querySelectorAll("a[href^='#']");
        // const scrollWrap = nav.querySelector(InnerSelector); //ナビ内の横スクロールありの場合は使用

        links.forEach((link, index) => {
          const target = link.getAttribute("href");
          if (!target || target === "#" || !document.querySelector(target)) {
            return;
          }

          ScrollTrigger.create({
            trigger: target,
            start: "top 80%",//スクロール位置適宜調整
            end: "bottom 80%",//スクロール位置適宜調整
            toggleClass: {
              targets: link,
              className: "is-current",
            },
            //ナビ内の横スクロールありの場合は使用
            // onToggle: (self) => {
            //   //もしscrollWrapが存在するなら、スクロールさせる
            //   if (!self.isActive || !scrollWrap) {
            //     return;
            //   }

            //   const linkLeft = link.offsetLeft;
            //   const linkWidth = link.offsetWidth;
            //   const wrapWidth = scrollWrap.clientWidth;

            //   scrollWrap.scrollTo({
            //     left: linkLeft - wrapWidth / 2 + linkWidth / 2,
            //     behavior: "smooth",
            //   });
            // },
          });
        });
      });
    });
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
