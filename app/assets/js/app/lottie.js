import Lottie from 'lottie-web';
/** 任意のタイミングで発火させたい場合は gsap.js や custom.jsで 個別設定してください */

/**
 * pug　 * .js-lottie-simple(data-lottie-src=config.rootpath+"/assets/files/sample-lottie.json" data-lottie-loop="false")
 *
 * html　 * <div class="js-lottie-simple" data-lottie-src="lottie.json"></div>
 */


/**
 * デフォルトオプション
 */
var defaultOptions = {
  selector: '.js-lottie-simple',
  srcData: 'data-lottie-src',
  loop: 'data-lottie-loop',
};

export default class LottieSimple {

  /**
   * 初期化
   * @param options
   */
  constructor(options) {
    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.init();
  }

  /**
   * 初期化
   */
  init() {
    this.elements = document.querySelectorAll(this.options.selector);
    if (!this.elements.length) return;

    this.setupAnimations();
  }

  /**
   * アニメーションのセットアップ
   */
  setupAnimations() {
    this.elements.forEach((element, index) => {
      const src = element.getAttribute(this.options.srcData);
      if (!src) return;

      // データ属性から設定を取得
      const hoverAttr = element.getAttribute(this.options.hover);
      const loopAttr = element.getAttribute(this.options.loop);

      // ループの設定（デフォルトはtrue）
      const loop = loopAttr === null || loopAttr === 'true';

      // Lottieアニメーションの初期化
      const animation = Lottie.loadAnimation({
        container: element,
        renderer: 'svg',
        loop: loop,
        autoplay: true,
        path: src,
      });
    });
  }

}
