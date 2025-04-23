import { gsap } from "gsap";

/**
 * 無限スクロールクラス
 *
 */


const defaultOptions = {
  wrapperSelector: '.js-infinite-slider',           // スライダー全体のラッパー
  trackSelector: '.js-infinite-slider-track',       // アイテムを流すトラック
  pauseSelector: '.js-infinite-slider-pause',       // 一時停止ボタン
  playSelector: '.js-infinite-slider-play',         // 再生ボタン
  dataSpeed: 'data-infinite-speed',                       // スピードを指定するデータ属性
  dataDirection: 'data-infinite-direction',               // スクロール方向を指定するデータ属性
  speed: 3000,                                      // 1スライド送りにかかるミリ秒
  direction: 'forward',                             // 'forward' | 'reverse'
  waitForFonts: true,                              // Webフォント読み込み待機フラグ
};

export default class InfiniteSlider {
  /**
   * @param {Object} options
   * @param {string} options.wrapperSelector
   * @param {string} options.trackSelector
   * @param {string} options.pauseSelector
   * @param {string} options.playSelector
   * @param {number} options.speed
   * @param {'forward'|'reverse'} options.direction
   * @param {boolean} options.waitForFonts
   */
  constructor(options = {}) {
    this.options = { ...defaultOptions, ...options };
    this.instances = [];

    // staticカウンタ初期化
    if (typeof InfiniteSlider.instanceCount === 'undefined') {
      InfiniteSlider.instanceCount = 0;
    }


    this._init();
    this._bindResize();
  }

  // 初期化関数
  _init() {
    if (this.options.waitForFonts && 'fonts' in document) {
      // Webフォント読み込み完了を待ってから初期化
      document.fonts.ready.then(() => {
        // フォント読み込み完了後に初期化
        this._initAll();
      }).catch(error => {
        // フォント読み込みエラー時は通常通り初期化
        this._initAll();
      });
    } else {
      // フォント読み込み待機なしですぐに初期化
      this._initAll();
    }
  }

  // 各ラッパー要素に対してスライダー初期化
  _initAll() {
    const wrappers = document.querySelectorAll(this.options.wrapperSelector);
    wrappers.forEach(wrapper => {
      const track = wrapper.querySelector(this.options.trackSelector);
      if (!track) {
        return;
      }

      const speed = parseFloat(wrapper.getAttribute(this.options.dataSpeed)) || this.options.speed;
      const direction = wrapper.getAttribute(this.options.dataDirection) || this.options.direction;

      console.log('speed', speed);
      console.log('direction', direction);

      const id = ++InfiniteSlider.instanceCount;
      const instance = new SliderInstance({
        wrapper,
        track,
        pauseSelector: this.options.pauseSelector,
        playSelector: this.options.playSelector,
        speed,
        direction,
        id,
      });
      this.instances.push(instance);
    });
  }

  // リサイズ時に再計算（デバウンス）
  _bindResize() {
    let timer;
    window.addEventListener('resize', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.instances.forEach(inst => inst.recalc());
      }, 200);
    });
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
    this.instances.forEach(inst => inst.destroy());
    this.instances = [];
  }
}

// 個別スライダーインスタンスのロジック
class SliderInstance {
  constructor({ wrapper, track, pauseSelector, playSelector, speed, direction, id }) {
    this.wrapper = wrapper;
    this.track = track;
    this.pauseSelector = pauseSelector;
    this.playSelector = playSelector;
    this.speed = speed;
    this.direction = direction;
    this.id = id;
    this.isPlaying = false;
    this.gsapTween = null;

    this._setup();
    this._bindControls();
    this.play();
  }

  // 要素複製＆GSAPアニメーション設定
  _setup() {
    // クローン追加前にオリジナルアイテムのみ取得
    const originalItems = Array.from(this.track.querySelectorAll(':scope > :not([data-cloned])'));
    if (originalItems.length === 0) return;

    // 実際のtrack幅を取得（これにはgapも含まれる）
    this.track.style.display = 'flex';
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

    // 必要なクローンセット数を計算（ラッパー幅 + 元の幅をカバーするために必要な数）
    // 最低でも1セット、必要に応じて増加（+1で余裕を持たせる）
    const minCloneSets = Math.ceil((wrapperWidth + originalTrackWidth) / originalTrackWidth);

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

    // 1スライド分の移動距離
    const moveDistance = firstSlideWidth + gapValue;

    // --- 方向ごとに初期位置と終了位置を設定
    let startX, endX;
    if (this.direction === 'forward') {
      startX = 0;
      endX = dirSign * moveDistance; // -moveDistance
    } else {
      startX = -moveDistance;
      endX = 0;
    }

    // 初期位置を設定
    gsap.set(this.track, { x: startX });

    // アニメーションループの関数
    const repeatAnimation = () => {
      gsap.set(this.track, { x: startX });
      this.gsapTween = gsap.to(this.track, {
        x: endX,
        duration: this.speed / 1000, // ミリ秒を秒に変換
        ease: "none",
        onComplete: repeatAnimation
      });
      if (!this.isPlaying) this.gsapTween.pause();
    };

    // 最初のアニメーション開始
    this.gsapTween = gsap.to(this.track, {
      x: endX,
      duration: this.speed / 1000, // ミリ秒を秒に変換
      ease: "none",
      onComplete: repeatAnimation
    });
    if (!this.isPlaying) this.pause();
  }

  // リサイズ等で再計算
  recalc() {
    this.destroy();
    this._setup();
    if (!this.isPlaying) this.pause();
  }

  // pause/playボタンを自動バインド
  _bindControls() {
    const pauseBtn = this.wrapper.querySelector(this.pauseSelector);
    const playBtn = this.wrapper.querySelector(this.playSelector);
    if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
    if (playBtn) playBtn.addEventListener('click', () => this.play());
  }

  pause() {
    if (this.gsapTween) this.gsapTween.pause();
    this.isPlaying = false;
  }

  play() {
    if (this.gsapTween) this.gsapTween.play();
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
    this.track.style.width = 'fit-content'; // width を fit-content に戻す
  }
}

