import MicroModal from "micromodal";
import MicromodalWrapper from "./wrapperClasses/micromodalWrapper";

  /**
   * 【モーダル使用方法】/format/ を参考にしてください
   *
   *
   * 【エントリーモーダルの使用方法】
   * <div style="display: none" class="js-auto-entry-modal" id="entry-modal-content-01" data-entry-modal-id="entry-modal-02" data-entry-modal-type="content" data-entry-modal-src="#entry-modal-content-01" data-entry-modal-title="モーダルタイトル" data-entry-modal-light-dismiss="false">
   * <p>モーダルコンテンツ</p>
   * </div>
   */

let defaultOptions = {
  selector: ".js-modal",
  autoEntryModalSelector: ".js-auto-entry-modal",
  autoEntryModalStoragePrefix: "entryModalDismissed:",
}

export default class modal {

  constructor(options) {
    this.options = Object.assign(defaultOptions, options);
    this.micromodalWrapperInstance = null;
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    this.run();
  }

  /**
   * 実行
   */
  run() {
    this.microModalWrapper();

    this.bindEntryModalCloseStorage();//エントリーモーダル
    this.setupAutoEntryModal();//エントリーモーダル

    // this.microModal();
  }

  microModalWrapper() {
    this.micromodalWrapperInstance = new MicromodalWrapper({
      wrapper: {
        modalTrigger: ".js-modal",
        // galleryLoop: true,
        // videoAutoplay: true
      }
    });
  }

  /**
   * 以降は【エントリーモーダル用】の関数群です
   */
  //【エントリーモーダル用】ストレージキーを取得
  getEntryModalStorageKey(modalId) {
    return `${this.options.autoEntryModalStoragePrefix}${modalId}`;
  }

  //【エントリーモーダル用】ストレージキーが存在するかを確認
  isEntryModalDismissed(modalId) {
    return sessionStorage.getItem(this.getEntryModalStorageKey(modalId)) === "1";
  }

  //【エントリーモーダル用】ストレージキーを設定
  setEntryModalDismissed(modalId) {
    sessionStorage.setItem(this.getEntryModalStorageKey(modalId), "1");
  }

  //【エントリーモーダル用】モーダルが閉じられた際にストレージキーを設定
  bindEntryModalCloseStorage() {
    document.addEventListener("modalClosed", (event) => {
      const modalId = event?.detail?.modalId;
      if (!modalId) return;
      this.setEntryModalDismissed(modalId);
    });
  }

  //【エントリーモーダル用】対象要素を取得し、モーダルをセットアップ
  setupAutoEntryModal() {
    const runAutoEntryModal = () => {
      const targets = document.querySelectorAll(this.options.autoEntryModalSelector);
      targets.forEach((target) => {
        this.openAutoEntryModal(target);
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", runAutoEntryModal, { once: true });
      return;
    }

    runAutoEntryModal();
  }

  //【エントリーモーダル用】モーダルを開く
  openAutoEntryModal(target) {
    const modalId = target.dataset.entryModalId;
    const modalType = target.dataset.entryModalType || "content";
    const modalSrc = target.dataset.entryModalSrc;
    const modalTitle = target.dataset.entryModalTitle || "Modal Window";
    const lightDismiss = this.parseLightDismiss(target.dataset.entryModalLightDismiss);

    if (!modalId || !modalSrc || !this.micromodalWrapperInstance) return;
    if (this.isEntryModalDismissed(modalId)) return;

    this.micromodalWrapperInstance.createAndShowModal(
      modalType,
      modalSrc,
      modalId,
      target,
      modalTitle,
      { lightDismiss }
    );
  }

  parseLightDismiss(value) {
    if (value == null) return true;
    return !["false", "0", "off"].includes(String(value).toLowerCase());
  }


  microModal() {
    //Micromodal.js本体をそのまま起動することも可能
    // MicroModal.init({
    //   openTrigger: 'data-micromodal-open',
    //   closeTrigger: 'data-micromodal-close',
    //   disableScroll: true,
    //   disableFocus: false,
    //   awaitOpenAnimation: true,
    //   awaitCloseAnimation: true,
    //   debugMode: true,
    // });
  }

}
