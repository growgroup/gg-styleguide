// core version + navigation, pagination modules:
import Swiper, {
  Navigation,
  Pagination,
  Autoplay,
  Controller,
  Keyboard,
  EffectFade,
  // EffectCreative,
  // Scrollbar,
  // Thumbs,
} from 'swiper';

Swiper.use([
  Pagination,
  Navigation,
  Autoplay,
  Controller,
  Keyboard,
  EffectFade,
  // EffectCreative,
  // Scrollbar,
  // Thumbs
]);
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
// import 'swiper/css/effect-creative';
// import 'swiper/css/scrollbar';
// import 'swiper/css/thumbs';


import imagesLoaded from "imagesloaded";
import Utils from "./utils";

const utils = new Utils();


let defaultOptions = {
  selector: ".swiper",
};

export default class SwiperSlider {
  /**
   * 初期化
   * @param options
   */
  constructor(options) {
    this.options = Object.assign(defaultOptions, options);
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    // ターゲットを取得する
    this.targetAll = document.querySelectorAll(this.options.selector);

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
    imagesLoaded(this.targetAll, () => {
      this.MainVisualSlider(); //->メインビジュアル
      this.runCardSlider(); //->カードスライダー
      this.documentSlider(); //->ドキュメントスライダー
      this.galleryImageSlider(); //->ギャラリーイメージスライダー
    });
  }

  MainVisualSlider() {
    const minSlides = 2;
    const targetSelector = '.js-main-visual';
    const targetSlideSelector = `${targetSelector} .swiper-slide`;
    const target = document.querySelector(targetSelector);
    const targetSlides = document.querySelectorAll(targetSlideSelector);

    // ターゲット要素が存在しない場合、処理を終了する
    if (!target) {
      return;
    }

    // スライドの数が最低限必要な数（minSlides）より少ない場合、スライダーを初期化せずに処理を終了する
    if (targetSlides.length < minSlides) {
      return;
    }

    // const prev = document.querySelector(targetSelector + '-prev');
    // const next = document.querySelector(targetSelector + '-next');
    const pagination = document.querySelector(targetSelector + '-pagination');
    const bar = document.querySelector(targetSelector + '-bar span');
    const pause = document.querySelector(targetSelector + '-pause');
    const delayTime = 4000;

    const swiper = new Swiper(targetSelector, {
      loop: true,
      //loopedSlidesLimit:false, //スライドの複製を無制限にする
      //loopedSlides: 2, //スライドの複製数を指定する
      effect: 'fade',
      autoplay: {
        delay: delayTime, // ４秒後に次の画像へ
        disableOnInteraction: false, // ユーザー操作後に自動再生を再開する
      },
      speed: 2000,
      allowTouchMove: false,
      threshold: 10, // allowTouchMoveがtrueのとき、スライド内のリンクがクリックできない問題の解決
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

    //★ポーズボタン実装があるとき
    if (pause) {
      pause.addEventListener('click', () => {
        if (!swiper || !swiper.autoplay) return;
        if (swiper.autoplay.running) {
          swiper.autoplay.stop();
          pause.innerHTML = 'play';
          pause.classList.add('is-active');
        } else {
          swiper.autoplay.start();
          pause.innerHTML = 'pause';
          pause.classList.remove('is-active');
        }
      });
    }
  }



  // スマホとPCで最低限必要なスライド数が異なる場合のサンプル
  //initとrunを分ける（init側は、スライダーの初期化のみを行う）
  initCardSlider(target, minSlides) {
    // ターゲット要素が存在しない場合、nullを返して処理を終了する
    if (!target) {
      return null;
    }

    const targetSlides = target.querySelectorAll('.swiper-slide');
    const prev = target.querySelector('.js-card-slider-prev');
    const next = target.querySelector('.js-card-slider-next');
    const pagination = target.querySelector('.js-card-slider-pagination');

    // スライドの数が最低限必要な数（minSlides）より少ない場合、nullを返して処理を終了する
    if (targetSlides.length < minSlides) {
      return null;
    }

    return new Swiper(target, {
      spaceBetween: 40,
      loop: true,
      // loopedSlidesLimit:false, //スライドの複製を無制限にする
      // loopedSlides: 2, //スライドの複製数を指定する

      //*ポーズボタンのサンプル用に自動再生を設定しています。要件になければ削除してください。
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },

      navigation: {
        nextEl: next,
        prevEl: prev,
      },
      pagination: {
        el: pagination,
        clickable: false,
      },
      threshold: 10, // allowTouchMoveがtrueのとき、スライド内のリンクがクリックできない問題の解決
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1.25,
          centeredSlides: true,
          spaceBetween: 16,
        },
        950: {
          spaceBetween: 40,
          slidesPerView: 3,
          loopAdditionalSlides: 3,
        }
      },
    });
  }

  // スマホとPCで最低限必要なスライド数が異なる場合のサンプル
  //initとrunを分ける(run側でレスポンシブ対応を行う)
  runCardSlider() {
    const targetSelector = '.js-card-slider';
    const sliders = document.querySelectorAll(targetSelector);

    sliders.forEach(slider => {
      let swiper = null;

      utils.responsiveMatch(
        // SP (mobile) の場合の処理
        () => {
          if (swiper) {
            swiper.destroy();
          }
          swiper = this.initCardSlider(slider, 2);
          // ナビゲーション表示非表示方法参考
          //  &__slider-nav {
          //     display: none;
          //     // swiper が初期化された後に表示する
          //     @at-root .swiper-initialized & {
          //       display: block;
          //     }
          //   }
        },
        // PC の場合の処理
        () => {
          if (swiper) {
            swiper.destroy();
          }
          swiper = this.initCardSlider(slider, 4);
        }
      );

      //★ポーズボタン実装があるとき
      const pause = slider.querySelector('.js-card-slider-pause');
      if (pause) {
        pause.addEventListener('click', () => {
          if (!swiper || !swiper.autoplay) return;
          if (swiper.autoplay.running) {
            swiper.autoplay.stop();
            pause.innerHTML = 'play';
            pause.classList.add('is-active');
          } else {
            pause.classList.remove('is-active');
            pause.innerHTML = 'pause';
            swiper.autoplay.start();
          }
        });
      }

    });
  }

  // 同じスライダーを複数設置する場合のサンプル
  documentSlider() {
    const targetSelector = '.js-document-slider';
    const targetSlideSelector = `${targetSelector} .swiper-slide`;
    const minSlides = 2;
    const targets = document.querySelectorAll(targetSelector);

    // スライダーのターゲット要素が存在しない場合、処理を終了する
    if (!targets.length) {
      return;
    }

    targets.forEach(target => {

      const targetSlides = target.querySelectorAll(targetSlideSelector);

      // スライドの数が最低限必要な数（minSlides）より少ない場合、処理を終了する
      if (targetSlides.length < minSlides) {
        return;
      }

      const prev = target.querySelector(targetSelector + '-prev');
      const next = target.querySelector(targetSelector + '-next');
      // const pagination = target.querySelector(targetSelector + '-pagination');
      const delayTime = 4000;

      const swiper = new Swiper(target, {
        loop: true,
        //loopedSlidesLimit:false, //スライドの複製を無制限にする
        //loopedSlides: 2, //スライドの複製数を指定する
        effect: 'slide',
        autoplay: {
          delay: delayTime, // ４秒後に次の画像へ
          disableOnInteraction: false, // ユーザー操作後に自動再生を再開する
        },
        speed: 400,
        allowTouchMove: false,
        threshold: 10, // allowTouchMoveがtrueのとき、スライド内のリンクがクリックできない問題の解決
        navigation: {
          nextEl: next,
          prevEl: prev,
        },
      });
    });
  }


  // サムネイルもメイン部分も両方スライドするギャラリーのサンプル
  galleryImageSlider() {
    const mainMinSlides = 2;
    const thumbnailMinSlides = 7;

    const galleryGroupSelector = '.js-gallery-image-group';
    const galleryGroup = document.querySelectorAll(galleryGroupSelector);

    galleryGroup.forEach(group => {
      const mainTarget = group.querySelector('.js-gallery-image-main');
      const thumbnailTarget = group.querySelector('.js-gallery-image-thumbnail');
      const mainPrev = group.querySelector('.js-gallery-image-main-prev');
      const mainNext = group.querySelector('.js-gallery-image-main-next');
      const thumbnailPrev = group.querySelector('.js-gallery-image-thumbnail-prev');
      const thumbnailNext = group.querySelector('.js-gallery-image-thumbnail-next');
      const mainTargetSlides = mainTarget.querySelectorAll('.swiper-slide');
      const thumbnailTargetSlides = thumbnailTarget.querySelectorAll('.swiper-slide');
      let thumbnailLoop = true;

      //メインスライドが少ない場合はそもそも発火しない（サムネイルの方はまた別）
      if (mainTargetSlides.length < mainMinSlides) {
        return;
      }


      //メイン側のスライダーを初期化
      const mainSwiper = new Swiper(mainTarget, {
        speed: 500,
        loop: true,
        loopedSlides: mainTargetSlides.length,
        slidesPerView: 1,
        spaceBetween: 4,
        threshold: 10,
        navigation: {
          nextEl: mainNext,
          prevEl: mainPrev,
        },
      });


      //サムネイル側のスライダーを初期化
      if (thumbnailTargetSlides.length >= thumbnailMinSlides) {
        const thumbnailSwiper = new Swiper(thumbnailTarget, {
          speed: 500,
          loop: thumbnailLoop,
          threshold: 10,
          slidesPerView: 6,

          slideToClickedSlide: true,
          spaceBetween: 4,
          // centeredSlides: true,
          loopedSlidesLimit: false, //スライドの複製を無制限にする
          loopedSlides: mainTargetSlides.length, //メインスライダーと同じ複製数に設定
          controller: {
            control: mainSwiper,
          },
          navigation: {
            nextEl: thumbnailNext,
            prevEl: thumbnailPrev,
          },
        });

        mainSwiper.controller.control = thumbnailSwiper;

      }
      else {
        //サムネイルスライダーの1枚目にactiveクラスを付与する
        thumbnailTargetSlides[0].classList.add('swiper-slide-active');

        //サムネイルスライダーを初期化せずに、サムネイルリストをクリックしたらメインスライダーを切り替えるようにする
        thumbnailTargetSlides.forEach((slide, index) => {
          slide.addEventListener('click', () => {
            mainSwiper.slideTo(index);
            thumbnailTargetSlides.forEach((slide, index) => {
              slide.classList.toggle('swiper-slide-active', index === current);
            });
          });
        });
        //メインスライダーが切り替わったらサムネイルスライダーを更新する
        mainSwiper.on('slideChange', () => {
          const current = mainSwiper.realIndex;
          thumbnailTargetSlides.forEach((slide, index) => {
            slide.classList.toggle('swiper-slide-active', index === current);
          });
        });
      }

      // 自動再生するタイプだともしかして以下いるかも
      // サムネイルスライダーのスライドをクリックした時に実行
      // thumbnailTarget.addEventListener('click', () => {
      //   setTimeout(() => {
      //     thumbnailSwiper.autoplay.start();
      //   }, 3000);
      // });

      // メインスライダーを手動で切り替えた時に実行
      // mainSwiper.on('touchEnd', () => {
      //   slideChangePermit = true;
      // });

      // mainSwiper.on('slideChange', () => {
      //   if (slideChangePermit) {
      //     const current = mainSwiper.realIndex;
      //     thumbnailSwiper.slideTo(current);
      //     setTimeout(() => {
      //       thumbnailSwiper.autoplay.start();
      //     }, 3000);
      //     slideChangePermit = false;
      //   }
      // });

    });
  }
}
