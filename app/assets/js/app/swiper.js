// Swiper v9 以降、モジュールは 'swiper/modules' から読み込み、
// 各インスタンスの modules オプションに渡す（v8 までの Swiper.use() は廃止）
import Swiper from 'swiper';
import {
  Navigation,
  Pagination,
  Autoplay,
  Controller,
  Keyboard,
  EffectFade,
  Thumbs,
  // EffectCreative,
  // Scrollbar,
} from 'swiper/modules';

// 各スライダーで利用するモジュール（new Swiper の modules オプションに渡す）
const modules = [
  Pagination,
  Navigation,
  Autoplay,
  Controller,
  Keyboard,
  EffectFade,
  Thumbs,
  // EffectCreative,
  // Scrollbar
];
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
      modules,
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



  // ループに必要な枚数を満たすようスライドを複製する（v8 の loopedSlides 相当）。
  // v14 のループは実スライドを並べ替える方式で、少数枚数＋見切れ表示では
  // 左右の隣スライドが不足して端が空き、シームレスにループできない。
  // そこで要件を満たすまで元スライドを丸ごと複製して補い、無限ループを成立させる。
  prepareLoopSlides(target, minSlides) {
    const wrapper = target.querySelector('.swiper-wrapper');
    if (!wrapper) {
      return;
    }
    // 既存の複製を除去してオリジナルだけに戻してから複製し直す（レスポンシブ再初期化での累積防止）
    this.resetLoopSlides(target);
    const originals = Array.from(wrapper.querySelectorAll('.swiper-slide'));
    if (originals.length === 0 || originals.length >= minSlides) {
      return;
    }
    // 末尾で同じスライドが隣り合わないよう、オリジナル枚数の倍数になるまで複製する
    const multiple = Math.ceil(minSlides / originals.length);
    for (let m = 1; m < multiple; m += 1) {
      originals.forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.setAttribute('data-card-slide-clone', '');
        wrapper.appendChild(clone);
      });
    }
  }

  // prepareLoopSlides で追加した複製スライドを取り除く（オリジナルのみに戻す）
  resetLoopSlides(target) {
    const wrapper = target.querySelector('.swiper-wrapper');
    if (!wrapper) {
      return;
    }
    wrapper.querySelectorAll('[data-card-slide-clone]').forEach(el => el.remove());
  }

  // スマホとPCで最低限必要なスライド数が異なる場合のサンプル
  //initとrunを分ける（init側は、スライダーの初期化のみを行う）
  initCardSlider(target, minSlides, originalCount) {
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

    // pagination を type:'custom' にするとコンテナに swiper-pagination-bullets が付かず、
    // Swiper 標準CSSのドット間マージン（.swiper-pagination-bullets .swiper-pagination-bullet）が
    // 効かなくなる。手動で付与して標準の余白を維持する。
    if (pagination) {
      pagination.classList.add('swiper-pagination-bullets');
    }

    return new Swiper(target, {
      modules,
      spaceBetween: 40,
      // 枚数は呼び出し前に prepareLoopSlides で複製して確保しているため、常に無限ループさせる
      loop: true,

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
        // prepareLoopSlides で複製した分だけドットが増えてしまうため、
        // 元スライド枚数（originalCount）だけドットを描画する。複製は同じ並びの
        // 繰り返しなので realIndex % originalCount で対応する元スライドを特定できる。
        type: 'custom',
        renderCustom: (sw) => {
          const count = originalCount || sw.slides.length;
          const active = sw.realIndex % count;
          let html = '';
          for (let i = 0; i < count; i += 1) {
            html += `<span class="swiper-pagination-bullet${i === active ? ' swiper-pagination-bullet-active' : ''}"></span>`;
          }
          return html;
        },
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
        750: {
          spaceBetween: 40,
          slidesPerView: 3,
          // v14 の loop は「slidesPerView + slidesPerGroup + loopAdditionalSlides」枚以上ないと
          // 無効化される。loopAdditionalSlides を足すと必要枚数が増えるだけで、スライド数が
          // 少ないと逆に loop が壊れる（「次へ」が途中で止まる）ため指定しない。
        }
      },
    });
  }

  // スマホとPCで最低限必要なスライド数が異なる場合のサンプル
  //initとrunを分ける(run側でレスポンシブ対応を行う)
  runCardSlider() {
    const targetSelector = '.js-card-slider';
    const sliders = document.querySelectorAll(targetSelector);

    // v14 のループは「実スライド数 >= slidesPerView + loopedSlides」でないと成立しない。
    // ブレークポイントで必要枚数が異なるため、満たない場合は prepareLoopSlides で
    // スライドを複製してから初期化し、少数枚数でも見切れ表示のまま無限ループさせる。
    //   - SP : slidesPerView 1.25 + centeredSlides → 5枚以上必要
    //   - PC : slidesPerView 3                     → 4枚以上必要
    const spLoopMinSlides = 5;
    const pcLoopMinSlides = 4;

    // スライダー化する最低枚数（これ未満はスライダーにせず素の表示のまま）
    //   - SP : 2枚以上でスライダー化
    //   - PC : 4枚以上でスライダー化（未満は 3カラムグリッド表示のまま）
    const spMinSlides = 2;
    const pcMinSlides = 4;

    sliders.forEach(slider => {
      let swiper = null;
      // オリジナル枚数（複製前）。responsiveMatch より前に取得するのでクローンは含まない
      const slideCount = slider.querySelectorAll('.swiper-slide').length;

      utils.responsiveMatch(
        // SP (mobile) の場合の処理
        () => {
          if (swiper) {
            swiper.destroy();
            swiper = null;
          }
          // SP の最低枚数に満たなければスライダー化しない
          if (slideCount < spMinSlides) {
            this.resetLoopSlides(slider);
            return;
          }
          // 無限ループに必要な枚数まで複製してから初期化する
          this.prepareLoopSlides(slider, spLoopMinSlides);
          swiper = this.initCardSlider(slider, spMinSlides, slideCount);
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
            swiper = null;
          }
          // PC の最低枚数未満はスライダー化しない（グリッド表示のまま）
          // （.swiper-initialized が付かないため .c-card__slider は既定の 3カラムグリッド表示に戻る）
          if (slideCount < pcMinSlides) {
            this.resetLoopSlides(slider);
            return;
          }
          // 無限ループに必要な枚数まで複製してから初期化する
          this.prepareLoopSlides(slider, pcLoopMinSlides);
          swiper = this.initCardSlider(slider, pcMinSlides, slideCount);
        },
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
        modules,
        loop: true,
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
      const thumbnailPerView = 6;

      //メインスライドが少ない場合はそもそも発火しない
      if (mainTargetSlides.length < mainMinSlides) {
        return;
      }

      // v14 の loop は実スライドを動的に並べ替える方式（旧 loopedSlidesLimit のような
      // 無制限クローンは不可）。slidesPerView + 1 枚以上ないと loop が無効化され警告が出るため、
      // 枚数が足りるときだけ loop を有効にする。
      const thumbnailLoop = thumbnailTargetSlides.length >= thumbnailPerView + 1;

      // メイン↔サムネの連携は Thumbs モジュールで行う。
      // Swiper v9 以降、双方向 controller での連携はアンチパターン。特に v11+ の動的 loop や
      // slidesPerView が異なるスライダー同士では controller の translate 補間で同期がずれ、
      // メイン操作時にサムネのアクティブ表示・位置が破綻するため Thumbs に統一する。
      // next で1枚ずつ送るため freeMode は使わず、slidesPerGroup は既定の 1 のままにする。
      // ※ Thumbs で参照するため、サムネ側をメイン側より先に初期化すること。
      const thumbnailSwiper = new Swiper(thumbnailTarget, {
        modules,
        speed: 500,
        loop: thumbnailLoop,
        threshold: 10,
        slidesPerView: thumbnailPerView,
        spaceBetween: 4,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        // サムネの前へ/次へは「メインを送る」ために使うため、サムネ自身の navigation には割り当てない
        // （Thumbs ではサムネ nav は本来ストリップのスクロール用で、メインとは同期しないため）。
      });

      //メイン側のスライダーを初期化（サムネと Thumbs で連携）
      const mainSwiper = new Swiper(mainTarget, {
        modules,
        speed: 500,
        loop: true,
        slidesPerView: 1,
        spaceBetween: 4,
        threshold: 10,
        navigation: {
          nextEl: mainNext,
          prevEl: mainPrev,
        },
        thumbs: {
          swiper: thumbnailSwiper,
        },
      });

      // サムネの前へ/次へでもメインを1枚ずつ送る（サムネのハイライト・スクロールは Thumbs が追従する）
      if (thumbnailNext) {
        thumbnailNext.addEventListener('click', () => mainSwiper.slideNext());
      }
      if (thumbnailPrev) {
        thumbnailPrev.addEventListener('click', () => mainSwiper.slidePrev());
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
