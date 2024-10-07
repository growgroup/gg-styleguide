import MicroModal from "micromodal";
import MicromodalWrapper from "./wrapperClasses/micromodalWrapper";


let defaultOptions = {
  selector: ".js-modal",
}

export default class modal {

  constructor(options) {
    this.options = Object.assign(defaultOptions, options);
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
    // this.microModal();
  }

  microModalWrapper() {
    new MicromodalWrapper({
      wrapper: {
        modalTrigger: ".js-modal",
        // galleryLoop: true,
        // videoAutoplay: true
      }
    });
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
