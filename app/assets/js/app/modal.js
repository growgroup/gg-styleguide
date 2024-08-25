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
    new MicromodalWrapper({
      wrapper: {
        modalTrigger: ".js-modal",
        // galleryLoop: true,
        // videoAutoplay: true
      }
    });
  }
}
