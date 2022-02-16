import $ from './jquery-shim.js';
import {gsap} from "gsap";
import {ScrollTrigger} from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger);


export default class GsapAnimation {

  /**
   * 初期化
   * @param options
   */
  constructor(options) {
    this.options = $.extend(options);
    //this._animate = this.animate;
    this.init();
  }

  /**
   *
   */
  init() {
    this.run();
  }


  /**
   * インスタンス化直後に呼ばれる関数
   */
  run() {
    if(document.querySelector(".c-main-visual")) {
    gsap
      .timeline({
        defaults: {},
        scrollTrigger: {
          trigger: ".c-main-visual",
          start: "top 100%",
        },
      })
      .from(".c-main-visual",
        {
          opacity: 0,
          delay: .5,
          duration: 1,
        }
      )
    }
  }


  /**
   * インスタンス化後に呼び出せる関数
   * 例) app.js　から　this.gsap.animate　を呼び出す
   */
  get animate() {
    if(document.querySelector(".c-card.is-top")) {
    gsap
      .timeline({
        defaults: {},
        scrollTrigger: {
          trigger: ".c-card.is-top",
          start: "top 80%",
        },
      })
      .from(".c-card__block",
        {
          opacity: 0,
          y: 30,
          delay: .3,
          duration: .4,
          stagger: {
            from: "start",
            each: .3,
          }
        }
      )
    }
  }
}
