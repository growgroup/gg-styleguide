import '@splidejs/splide/css/core';
import Splide from '@splidejs/splide';

let defaultOptions = {
  selector: ".splide",
};

export default class SplideSlider {
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
   */
  init() {
    // ターゲットを取得する
    this.targetAll = $(this.options.selector);

    // ターゲットが存在しない場合は実行しない
    if (!this.targetAll.length) {
      return false;
    }

    // 実行する
    this.run();
  }

  /**
   * 実行する
   */
  run() {
    this.targetAll.imagesLoaded(function () {

      if ($('.c-main-visual.splide').length <= 0) {
        return;
      }


      let splide = new Splide( '.c-main-visual.splide', {
        type: "fade",
        perPage: 1,
        perMove: 1,
        arrows: false,
        pagination: false,
        drag: false,
        autoplay: true,
        pauseOnHover: false,
        pauseOnFocus: false,
        rewind: true,
        interval: 10000,
        speed: 20000,
        loop:true,

        reducedMotion: {
          autoplay: true,
          interval: 10000,
          speed: 20000,
        }
      }).mount();
    });
  }
}
