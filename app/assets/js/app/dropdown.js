/**
 * ドロップダウンメニューを制御するクラス
 *
 *  // hoverで展開・fadeIn
 * .c-dropdown.js-dropdown
 *   +a("/format/").c-dropdown-trigger(data-dropdown-trigger="trigger") FORMAT
 *   .c-dropdown-content(data-dropdown-target="target")
 *
 *  // clickで展開・slideDown
 * .c-dropdown.js-dropdown(data-dropdown-event="click", data-dropdown-animation="slide")
 *   +a("/format/").c-dropdown-trigger(data-dropdown-trigger="trigger") FORMAT
 *   .c-dropdown-content(data-dropdown-target="target")
 *
 */

'use strict';

import {gsap} from "gsap";

const defaultOptions = {
  selector: '.js-dropdown',
  triggerSelector: 'data-dropdown-trigger',
  targetSelector: 'data-dropdown-target',
  eventTypeSelector: 'data-dropdown-event',
  animationTypeSelector: 'data-dropdown-animation',
  openClass: 'is-open',
};

export default class Dropdown {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
    this.isReady = false;
    // ページロード完了後にisReadyをtrueにする
    window.addEventListener('load', () => {
      this.isReady = true;
    });
    this.init();
  }

  init() {
    this.dropdown = document.querySelectorAll(this.options.selector);
    if (!this.dropdown.length) return;
    this.dropdown.forEach((dropdown) => {
      const wrapper = dropdown;
      const trigger = dropdown.querySelector(`[${this.options.triggerSelector}]`);
      const target = dropdown.querySelector(`[${this.options.targetSelector}]`);
      const eventType = dropdown.getAttribute(this.options.eventTypeSelector);
      const animationType = dropdown.getAttribute(this.options.animationTypeSelector);

      //triggerまたはtargetが存在しないときerrorを投げる
      if (!trigger || !target) {
        throw new Error('triggerまたはtargetが存在しません');
      }

      //wrapperにis-openクラスがない ＆ animationTypeがnone以外の場合はtargetを非表示にする
      if (!wrapper.classList.contains(this.options.openClass)&&animationType!=='none') {
        target.style.visibility = 'hidden';
        target.style.opacity = 0;
      }

      // イベントタイプごとにイベントを初期化
      if (eventType !== 'click') {
        this.hoverInit(wrapper, trigger, target, animationType);
      } else {
        this.clickInit(wrapper, trigger, target, animationType);
      }
    });
  }

  hoverInit(wrapper, trigger, target, animationType) {
    let timeoutId;

    trigger.addEventListener('mouseenter', () => {
      // ページを開いた瞬間は処理を実行しない
      if (!this.isReady) return;
      if (timeoutId) clearTimeout(timeoutId);
      if (wrapper.classList.contains(this.options.openClass)) {
        return;
      }
      if (gsap.isTweening(target)) {
        gsap.killTweensOf(target);
      }
      this.dropdownOpen(wrapper, target, animationType);
    });

    //wrapperからマウスが離れたら閉じる
    wrapper.addEventListener('mouseleave', () => {
      //100ms後に処理を実行
      timeoutId =
        setTimeout(() => {
          if (gsap.isTweening(target)) {
            gsap.killTweensOf(target);
          }
        this.dropdownClose(wrapper, target, animationType);
      }, 100);
    });

    //targetにマウスが載ったとき、閉じる途中であれば再度開く
    target.addEventListener('mouseenter', () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (wrapper.classList.contains(this.options.openClass)) {
        return;
      }
      if (gsap.isTweening(target)) {
        const currentTween = gsap.getTweensOf(target)[0];
        const progress = currentTween.progress();
        // 進捗が80%以上の場合は処理をキャンセル
        if (progress >= 0.8) {
          return;
        }
        gsap.killTweensOf(target);
        this.dropdownOpen(wrapper, target, animationType);
      }
    });
  }

  clickInit(wrapper, trigger, target, animationType) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // クリックイベントの伝播を止める

      if (gsap.isTweening(target)) {
        gsap.killTweensOf(target);
      }

      // トグル動作の実装
      if (wrapper.classList.contains(this.options.openClass)) {
        this.dropdownClose(wrapper, target, animationType);
      } else {
        this.dropdownOpen(wrapper, target, animationType);
      }
    });

    const handleClickOutside = (e) => {
      if (!wrapper.classList.contains(this.options.openClass)) return;
      // triggerとtarget以外をクリックした場合に閉じる
      if (!target.contains(e.target) && !trigger.contains(e.target)) {
        this.dropdownClose(wrapper, target, animationType);
      }
    };

    document.addEventListener('click', handleClickOutside);
  }


  dropdownOpen(wrapper, target, animationType) {
    wrapper.classList.add(this.options.openClass);

    //classの付け外しのみにしたいときはnoneを指定
    if (animationType === 'none') {
      return;
    }

    if (animationType === 'slide') {
      this.animationSlideDown(target);
      return;
    }
    // カスタムアニメーションを指定する場合
    // if(animationType==='custom'){
    //   this.animationCustomIn(target);
    //   return;
    // }

    //アニメーションタイプ指定が無ければフェードイン
    this.animationFadeIn(target);
  }

  dropdownClose(wrapper, target, animationType) {
    wrapper.classList.remove(this.options.openClass);
    //classの付け外しのみにしたいときはnoneを指定
    if (animationType === 'none') {
      return;
    }

    if (animationType === 'slide') {
      this.animationSlideUp(target);
      return;
    }

    // カスタムアニメーションを指定する場合
    // if(animationType==='custom'){
    //   this.animationCustomOut(target);
    //   return;
    // }

    //アニメーションタイプ指定が無ければフェードアウト
    this.animationFadeOut(target);
  }

  animationFadeIn(target) {
    gsap.fromTo(target,
      {
        autoAlpha: 0,
      },
      {
        duration: 0.2,
        ease: 'power2.out',
        autoAlpha: 1,
      }
    );
  }


  animationFadeOut(target) {
    gsap.to(target, {
      duration: 0.3,
      autoAlpha: 0,
      ease: 'power2.out',
    });
  }

  animationSlideDown(target) {
    gsap.fromTo(target,
      {
        autoAlpha: 1,
        clipPath: 'inset(0 0 100% 0)'
      },
      {
        autoAlpha: 1,
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.3,
        ease: "power2.out"
      }
    );
  }

  animationSlideUp(target) {
    gsap.to(target, {
      duration: 0.3,
      clipPath: 'inset(0 0 100% 0)',
      autoAlpha: 0,
      ease: 'power2.out',
    });
  }
}
