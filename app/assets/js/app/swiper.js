// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { Pagination } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';
import { Controller } from 'swiper/modules';
import { Keyboard } from 'swiper/modules';
import { EffectFade } from 'swiper/modules';
// import { EffectCreative } from 'swiper/modules';
// import { Scrollbar } from 'swiper/modules';
// import { Thumbs } from 'swiper/modules';

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
      this.testSlider();
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

      navigation: {
        nextEl: next,
        prevEl: prev,
      },
      pagination: {
        el: pagination,
        clickable: false,
      },
      threshold: 10,
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
          // 最低限必要なスライド数を指定
          // 枚数以下の場合スライダーになりません
          swiper = this.initCardSlider(slider, 3);
        }
      );
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


}
