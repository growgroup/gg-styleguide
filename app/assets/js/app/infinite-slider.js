import { gsap } from "gsap";
import imagesLoaded from "imagesloaded";


/**
 * 無限スクロールクラス
 *
 * .js-infinite-slider(data-infinite-speed="5000" data-infinite-direction="forward")
 *   .js-infinite-slider-track
 *      div スライド
 *      div スライド
 *    //- 一次停止ボタンが必要な場合は以下を追加可能
 *    button.js-infinite-slider-pause pause
 *    button.js-infinite-slider-play play
 */


const defaultOptions = {
  wrapperSelector: '.js-infinite-slider',           // スライダー全体のラッパー
  trackSelector: '.js-infinite-slider-track',       // アイテムを流すトラック
  pauseSelector: '.js-infinite-slider-pause',       // 一時停止ボタン
  playSelector: '.js-infinite-slider-play',         // 再生ボタン
  dataSpeed: 'data-infinite-speed',                 // スピードを指定するデータ属性
  dataDirection: 'data-infinite-direction',         // スクロール方向を指定するデータ属性
  speed: 3000,                                      // 1スライド送りにかかるミリ秒
  direction: 'forward',                             // 'forward' | 'reverse'
  waitForFonts: false,                              // テキストスライダーの計算がズレる場合はtrueにする
};

export default class InfiniteSlider {
  constructor(options = {}) {
    this.options = { ...defaultOptions, ...options };
    this.instances = [];
    this.wrappers = Array.from(document.querySelectorAll(this.options.wrapperSelector));

    this.init();
    this.bindResize();
  }

  // 初期化関数
  init() {
    // フォントの読み込み待ちが必要な場合
    if (this.options.waitForFonts && "fonts" in document) {
      document.fonts.ready
        .then(() => this.initAll())
        .catch(() => this.initAll());
    } else {
      this.initAll();
    }
  }

  // 各ラッパー要素に対してスライダー初期化
  initAll() {
    this.wrappers.forEach(wrapper => {
      const track = wrapper.querySelector(this.options.trackSelector);
      if (!track) return;

      // それぞれのtrack内の画像が読み込み終わるごとに初期化
      imagesLoaded(track, { background: false }, () => {
        // 必要に応じて多重防止。初期化済み判定
        if (wrapper.dataset.sliderInited === "true") return;
        wrapper.dataset.sliderInited = "true";

        const speed = parseFloat(wrapper.getAttribute(this.options.dataSpeed)) || this.options.speed;
        const direction = wrapper.getAttribute(this.options.dataDirection) || this.options.direction;

        const instance = new SliderInstance({
          wrapper,
          track,
          pauseSelector: this.options.pauseSelector,
          playSelector: this.options.playSelector,
          speed,
          direction,
        });
        this.instances.push(instance);
      });
    });
  }

  // リサイズ時に再計算（デバウンス）
  bindResize() {
    let timer;
    this.resizeHandler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.instances.forEach(inst => inst.recalc());
      }, 200);
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  // 全インスタンス一時停止
  pause() {
    this.instances.forEach(inst => inst.pause());
  }

  // 全インスタンス再生
  play() {
    this.instances.forEach(inst => inst.play());
  }

  // 全インスタンス破棄
  destroy() {
    // リサイズイベントリスナーを削除
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
    this.instances.forEach(inst => inst.destroy());
    this.instances = [];
  }
}

// 個別スライダーインスタンスのロジック
class SliderInstance {
  constructor({ wrapper, track, pauseSelector, playSelector, speed, direction }) {
    this.wrapper = wrapper;
    this.track = track;
    this.pauseSelector = pauseSelector;
    this.playSelector = playSelector;
    this.speed = speed;
    this.direction = direction;
    this.isPlaying = false;
    this.gsapTween = null;
    this.currentCloneSets = 0;

    this.setup();
    this.bindControls();
    this.play();
  }

  // 要素複製＆GSAPアニメーション設定
  setup() {
    // クローン追加前にオリジナルアイテムのみ取得
    const originalItems = Array.from(this.track.querySelectorAll(':scope > :not([data-cloned])'));
    if (originalItems.length === 0) return;

    // 実際のtrack幅を取得（これにはgapも含まれる）
    this.track.style.width = 'max-content';

    // 1枚目スライド幅を取得
    const firstSlide = originalItems[0];
    const firstSlideWidth = firstSlide.getBoundingClientRect().width;
    const computedStyle = window.getComputedStyle(this.track);
    const gapValue = parseInt(computedStyle.gap) || 0;

    // 全体track幅も取得
    const originalTrackWidth = this.track.getBoundingClientRect().width;

    // ラッパー幅を取得
    const wrapperWidth = this.wrapper.getBoundingClientRect().width;

    // 必要なクローンセット数を計算
    const minCloneSets = Math.ceil((wrapperWidth + originalTrackWidth) / originalTrackWidth);

    // 現在のクローンセット数を保存
    this.currentCloneSets = minCloneSets;

    // 必要なセット数分のクローンを追加
    for (let i = 0; i < minCloneSets; i++) {
      originalItems.forEach(el => {
        const clone = el.cloneNode(true);
        clone.setAttribute('data-cloned', 'true');
        this.track.appendChild(clone);
      });
    }

    // direction判定
    const dirSign = this.direction === 'forward' ? -1 : 1;

    // 移動距離を計算
    const firstSlideWidthWithGap = firstSlideWidth + gapValue;
    const moveDistance = originalTrackWidth + gapValue;

    // 方向ごとに初期位置と終了位置を設定
    let startX, endX;
    if (this.direction === 'forward') {
      startX = 0;
      endX = dirSign * moveDistance; // -originalTrackWidth（トラック全体を移動）
    } else {
      startX = -moveDistance;
      endX = 0;
    }

    // 初期位置を設定
    gsap.set(this.track, { x: startX });

    // durationを計算
    const duration = (Math.abs(endX - startX) / firstSlideWidthWithGap) * (this.speed / 1000);

    const animate = () => {
      const tweenVars = {
        x: endX,
        duration: duration,
        ease: "none",
        onComplete: animate
      };

      gsap.set(this.track, { x: startX });
      this.gsapTween = gsap.to(this.track, tweenVars);
      if (!this.isPlaying) this.gsapTween.pause();
    };
    animate();
  }

  // リサイズ等で再計算
  recalc() {
    // 現在のtweenの進行状況を保存
    const currentProgress = this.gsapTween ? this.gsapTween.progress() : 0;
    const wasPlaying = this.isPlaying;

    // 必要なクローンセット数を計算
    const originalItems = Array.from(this.track.querySelectorAll(':scope > :not([data-cloned])'));
    if (originalItems.length === 0) return;

    // 実際のtrack幅を取得
    const originalTrackWidth = (() => {
      return originalItems.reduce((sum, item) => {
        return sum + item.getBoundingClientRect().width;
      }, 0);
    })();

    // ラッパー幅を取得
    const wrapperWidth = this.wrapper.getBoundingClientRect().width;

    // 必要なクローンセット数を再計算
    const newCloneSets = Math.ceil((wrapperWidth + originalTrackWidth) / originalTrackWidth);

    // クローンセット数が変わった場合のみdestroyとsetupを実行
    if (newCloneSets !== this.currentCloneSets) {
      this.destroy();
      this.setup();

      // 保存した進行状況を新しいtweenに適用
      if (this.gsapTween) {
        this.gsapTween.progress(currentProgress);
        if (!wasPlaying) {
          this.pause();
        }
      }
    }
  }

  // pause/playボタンを自動バインド
  bindControls() {
    const pauseBtn = this.wrapper.querySelector(this.pauseSelector);
    const playBtn = this.wrapper.querySelector(this.playSelector);
    if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
    if (playBtn) playBtn.addEventListener('click', () => this.play());
  }

  pause() {
    if (this.gsapTween) this.gsapTween.pause();
    this.wrapper.classList.add('is-paused');
    this.isPlaying = false;
  }

  play() {
    if (this.gsapTween) this.gsapTween.play();
    this.wrapper.classList.remove('is-paused');
    this.isPlaying = true;
  }

  destroy() {
    // 停止＆クリーンアップ
    if (this.gsapTween) {
      this.gsapTween.kill();
      this.gsapTween = null;
    }
    // クローン要素を削除
    this.track.querySelectorAll('[data-cloned]').forEach(el => el.remove());
    // トラックの位置とスタイルをリセット
    gsap.set(this.track, { x: 0 });
    this.track.removeAttribute('style');
  }
}

