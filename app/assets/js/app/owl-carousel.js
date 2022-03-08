import $ from './jquery-shim.js';
import 'owl.carousel';
import OwlCss from "owl.carousel/dist/assets/owl.carousel.css";
import OwlThemeCss from "owl.carousel/dist/assets/owl.theme.default.css";

var defaultOptions = {
  selector: '.owl-carousel',
};

export default class OwlCarousel {
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

    // const gsap = this.options.gsap;

    //->スライダー
    this.targetAll.imagesLoaded(function () {


      $('.c-main-visual__slider').owlCarousel({
        items: 1,
        margin: 0,
        dots: true,
        loop: true,
        nav: false,
        onInitialized: function () {
          // gsap.animate
        },
        autoplayHoverPause: true,
        autoplay: true,
        autoplaySpeed: 500,
        autoWidth: false,
        autoHeight: false,
        center: true,
        animateOut: 'fadeOut',
        navText: ['<img src="../assets/images/icon-slider-prev.svg" />', '<img src="../assets/images/icon-slider-next.svg" />'],
      });

    });


    //->カード_カルーセル
    this.targetAll.imagesLoaded(function () {

      if ($('.js-card-slider.owl-carousel').length <= 0) {
        return;
      }

      if ($('.js-card-slide').length <= 2) {
        $('.js-card-slider').removeClass("owl-carousel");
        return;
      }

      $('.js-card-slider').owlCarousel({
        margin: 0,
        dots: false,
        loop: true,
        nav: true,
        autoplayHoverPause: true,
        autoplay: true,
        autoplaySpeed: 500,
        autoWidth: false,
        autoHeight: false,
        center: true,
        speed: 400,
        navText: ['<img src="../assets/images/icon-slider-prev.svg" />', '<img src="../assets/images/icon-slider-next.svg" />'],
        responsive: {
          // breakpoint from 0 up
          0: {
            items: 1,
          },
          // breakpoint from 750 up
          750: {
            items: 3,
          }
        }
      });
    });


  }
}




