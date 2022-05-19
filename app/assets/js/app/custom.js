import $ from './jquery-shim.js';

export default class CustomFunctions {
  /**
   * 初期化
   * @param options
   */
  constructor(options) {
    this.options = $.extend(options);
    this.init();
  }

  /**
   * 実行する
   */
  init() {
    this.infiniteSlider();
  }

  /**
   * カスタム関数
   */

  // ループスライダー
  infiniteSlider() {
    const optionInfinite = {
      infinite: true,
      arrows: false,
      swipe: false,
      dots: false,
      variableWidth: true,  // スライド幅の自動計算を無効
      autoplay: true,
      autoplaySpeed: 0,
      speed: 5000,
      cssEase: "linear",
      pauseOnFocus: false,
      pauseOnHover: false
    }
    const slickInfinite = $('.js-infinite-slider');
    if (slickInfinite) $(slickInfinite).slick(optionInfinite);
  }


  // 複製して作業
  mycode() {

  }


}




