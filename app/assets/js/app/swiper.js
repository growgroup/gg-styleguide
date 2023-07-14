// core version + navigation, pagination modules:
import Swiper, {Navigation, Pagination, Autoplay,Controller, EffectCreative,Keyboard,EffectFade,Scrollbar} from 'swiper';
Swiper.use([Pagination, Navigation,Autoplay,Controller, EffectCreative,Keyboard,EffectFade,Scrollbar]);
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';



let defaultOptions = {
  selector: ".swiper",
};

export default class SwiperSlider {
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
    //->スライダー
    this.targetAll.imagesLoaded(function () {

      if ($('.c-main-visual.swiper').length <= 0) {
        return;
      }

      let bar = document.querySelector('.c-main-visual__bar span');
      let pagination = document.querySelector('.c-main-visual__pagination');
      let delayTime = 3500;

      const mainVisualSwiper = new Swiper(".c-main-visual.swiper", {
        loop: true,
        effect: 'fade',
        autoplay: {
          delay: delayTime, // ４秒後に次の画像へ
          disableOnInteraction: false, // ユーザー操作後に自動再生を再開する
        },
        speed: 2000,
        allowTouchMove: false,
        pagination: {
          el: pagination, // ページネーションのクラス名を指定
        },
        on: {
          //スライド（次または前）へのアニメーションの開始後にイベント発生
          slideChangeTransitionStart: function (result) {
            bar.style.transitionDuration = '0ms';
            bar.style.transform = 'scaleY(0)'
          },
          //スライド（次または前）へのアニメーションの開始後にイベント発生
          slideChangeTransitionEnd: function (result) {
            bar.style.transitionDuration = delayTime + 'ms';
            bar.style.transform = 'scaleY(1)'
          },
        },
      });
    });

    this.targetAll.imagesLoaded(function () {

      if ($('.js-float-swiper.swiper').length <= 0) {
        return;
      }

      const textLoopInstagramSwiper = new Swiper(".js-float-swiper.swiper", {
        loop: true,
        speed: 20000,
        slidesPerView: "auto",
        allowTouchMove: false,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        },
        breakpoints: {
          0: {
            spaceBetween: 32,
          },
          950: {
            spaceBetween: 54,
          },
        },
      });
    });

    this.targetAll.imagesLoaded(function () {

      if ($('.c-gallery-logo__slider.swiper').length <= 0) {
        return;
      }

      const infiniteSwiperEven = new Swiper(".c-gallery-logo__slider.swiper:nth-child(even)", {
        loop: true,
        speed: 4000,
        slidesPerView: "auto",
        allowTouchMove: false,
        autoplay: {
          delay: 0,
        },
        breakpoints: {
          0: {
            spaceBetween: 32,
          },
          950: {
            spaceBetween: 90,
          },
        },
      });

      const infiniteSwiperOdd = new Swiper(".c-gallery-logo__slider.swiper:nth-child(odd)", {
        loop: true,
        speed: 4000,
        slidesPerView: "auto",
        allowTouchMove: false,
        autoplay: {
          delay: 0,
          reverseDirection: true,
        },
        breakpoints: {
          0: {
            spaceBetween: 32,
          },
          950: {
            spaceBetween: 90,
          },
        },
      });
    });

    this.targetAll.imagesLoaded(function () {

      if ($('.c-gallery-card.swiper').length <= 0) {
        return;
      }

      let bar = document.querySelector('.swiper-scrollbar');

      const cultureGallerySwiper = new Swiper(".c-gallery-card.swiper", {
        loop: true,
        speed: 500,
        slidesPerView: "auto",
        slideToClickedSlide: true,
        centeredSlides: true,
        autoplay: {
          delay: 3000,
        },
        navigation: {
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        },
        pagination: {
          el: bar,
          type: 'progressbar',
          draggable: true,
        },
      });
    });

    this.targetAll.imagesLoaded(function () {

      if ($('.c-block-document__slider.swiper').length <= 0) {
        return;
      }

      let delayTime = 3500;

      const downloadSwiper = new Swiper(".c-block-document__slider.swiper", {
        loop: true,
        speed: 500,
        autoplay: {
          delay: delayTime,
        },
        navigation: {
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        },
      });
    });
  }
}
