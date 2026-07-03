/*
 * # example:
 *
 * <header class="js-drawer-clone-source">
 *   <button class="js-drawer-toggle" aria-expanded="false"></button>
 * </header>
 *
 * <dialog class="js-drawer-dialog">
 *   <nav class="js-drawer-menu">
 *     content
 *   </nav>
 * </dialog>
 *
 */

/**
 * デフォルトオプション
 * @type {{}}
 */
const defaultOptions = {
  dialogSelector: ".js-drawer-dialog",
  menuSelector: ".js-drawer-menu",
  buttonSelector: ".js-drawer-toggle",
  cloneSourceSelector: ".js-drawer-clone-source",
  activateMedia: "max-width: 59.3125em",
  openClass: "is-open",
  clonedClass: "is-cloned",
  activeClass: "is-drawer-active"
};

export default class Drawer {
  constructor(options = {}) {
    this.options = {
      ...defaultOptions,
      ...options
    };

    this.closeTimer = null;

    this.dialog = document.querySelector(this.options.dialogSelector);
    this.drawerMenu = this.dialog?.querySelector(this.options.menuSelector);
    this.toggleButton = document.querySelector(this.options.buttonSelector);
    this.cloneSrc = document.querySelector(this.options.cloneSourceSelector);

    this.clonedElement = null;
    this.clonedButton = null;

    this.init();
  }

  /**
   * 初期化
   *
   * @returns {void}
   */
  init() {
    if (!this.dialog || !this.toggleButton) return;

    this.createClonedElement();
    this.setupBasicEvent();
    this.setupResponsiveMatch();
  }

  /**
   * ヘッダーまたは開閉ボタンの複製
   * 複製するとき閉じるボタンに閉じるイベントを追加する
   *
   * @returns {void}
   */
  createClonedElement() {
    if (!this.cloneSrc) return;

    this.clonedElement = this.cloneSrc.cloneNode(true);
    this.clonedElement.classList.add(this.options.clonedClass);

    this.clonedButton = this.clonedElement.matches(this.options.buttonSelector)
      ? this.clonedElement
      : this.clonedElement.querySelector(this.options.buttonSelector);

    if (this.clonedButton) {
      this.clonedButton.setAttribute("aria-expanded", "false");
      this.clonedButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeMenu();
      });
    }

    this.dialog.insertBefore(this.clonedElement, this.dialog.firstChild);
  }

  /**
   * クリック時のトリガー
   *
   * @returns {void}
   */
  setupBasicEvent() {
    this.toggleButton.setAttribute("aria-expanded", "false");

    this.toggleButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.openMenu();
    });

    this.dialog.addEventListener("click", (e) => {
      if (e.target === this.dialog) {
        this.closeMenu();
      }
    });

    // ページ内リンク時の挙動
    this.dialog.querySelectorAll("a[href*='#']").forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMenu();
      });
    });


    // Escキー / cancelイベント時に状態を同期して閉じる
    this.dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      this.closeMenu();
    });
  }


  /**
   * Drawerを開く
   * dialog を表示し、開閉ボタンの状態を更新する。
   * 表示後、複製された閉じるボタンが存在する場合はフォーカスを移動する。
   *
   * @returns {void}
   */
  openMenu() {
    if (this.dialog.open) return;

    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    this.dialog.showModal();
    this.dialog.classList.add(this.options.openClass);
    document.body.classList.add(this.options.activeClass);
    this.setToggleButtonsState(true);

    if (this.clonedButton) {
      this.clonedButton.focus();
    }
  }

  /**
   * Drawerを閉じる
   * CSS transition / animation が設定されている場合は、
   * その完了時間を待ってから close 処理を行う。
   *
   * @returns {void}
   */
  closeMenu() {
    if (!this.dialog.open) return;

    this.dialog.classList.remove(this.options.openClass);
    document.body.classList.remove(this.options.activeClass);
    this.setToggleButtonsState(false);

    const motionTarget = this.drawerMenu || this.dialog;
    const motionDuration = this.getMotionDuration(motionTarget);

    if (motionDuration > 0) {
      this.closeTimer = window.setTimeout(() => {
        this.dialogClose();
      }, motionDuration);
    } else {
      this.dialogClose();
    }
  }

  /**
   * dialogを閉じる
   * dialog を閉じ、フォーカスを元の開閉ボタンへ戻す。
   *
   * @returns {void}
   */
  dialogClose() {
    if (!this.dialog.open) return;

    this.dialog.close();
    this.closeTimer = null;
    this.toggleButton.focus();
  }

  /**
   * ボタン状態の更新
   * aria-expanded と is-open クラスを同期する。
   *
   * @param {boolean} isOpen
   * @returns {void}
   */
  setToggleButtonsState(isOpen) {
    const toggleButtons = [
      this.toggleButton,
      this.clonedButton
    ].filter(Boolean);

    toggleButtons.forEach((button) => {
      button.setAttribute("aria-expanded", String(isOpen));
      button.classList.toggle(this.options.openClass, isOpen);
    });
  }

  /**
   * CSS transition / animation の時間を取得
   * duration と delay を合算し、transition と animation のうち長い方の時間を返す。
   *
   * @param {Element} element
   * @returns {number}
   */
  getMotionDuration(element) {
    // 要素のCSSを取得
    const styles = getComputedStyle(element);

    // CSS transition / animation の時間を取得する関数
    const toMs = (time) => {
      const value = parseFloat(time);

      if (Number.isNaN(value)) return 0;

      return time.includes("ms") ? value : value * 1000;
    };

    // 複数値存在するときに長いほうを取得する関数
    const getMaxTime = (value) => {
      return Math.max(
        ...value.split(",").map((time) => toMs(time.trim()))
      );
    };

    // transition と animation のうち長い方の時間を返す
    return Math.max(
      getMaxTime(styles.transitionDuration) + getMaxTime(styles.transitionDelay),
      getMaxTime(styles.animationDuration) + getMaxTime(styles.animationDelay)
    );
  }

  /**
   * リサイズ監視
   *
   * @returns {void}
   */
  setupResponsiveMatch() {
    if (!this.options.activateMedia) return;

    const mediaQuery = window.matchMedia(`(${this.options.activateMedia})`);
    const handleMediaChange = (e) => {
      if (!e.matches) {
        this.closeMenu();
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    handleMediaChange(mediaQuery);
  }
}
