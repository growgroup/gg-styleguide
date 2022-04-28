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
    this.removeCssHoverOnIE();
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

  removeCssHoverOnIE() {
    function hasTouch() {
      return 'ontouchstart' in document.documentElement
        || navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0;
    }

    if (hasTouch()) { // remove all the :hover stylesheets
      try { // prevent exception on browsers not supporting DOM styleSheets properly
        for (var si in document.styleSheets) {
          var styleSheet = document.styleSheets[si];
          if (!styleSheet.rules) continue;

          for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
            if (!styleSheet.rules[ri].selectorText) continue;

            if (styleSheet.rules[ri].selectorText.match(':hover')) {
              styleSheet.deleteRule(ri);
            }
          }
        }
      } catch (ex) {}
    }
  }

  // 複製して作業
  mycode() {

  }


}




