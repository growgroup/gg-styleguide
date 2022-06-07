

// <div data-modaal-content-source="assets/image/image.jpg" class="js-modal-image">Show</div>
// 動画の場合 → js-video
// iframeの場合 → js-iframe



let defaultOptions = {
  selector: ".js-modal-image",
}

export default class modal {

  constructor(options) {
    this.options = $.extend(defaultOptions, options);
    this.init();
  }
  /**
   * 初期化
   */
  init() {
    this.targetEle = $(this.options.selector);
    this.run();
  }

  /**
   * 実行
   */
  run() {
    if (this.targetEle.hasClass('js-video')){
      this.targetEle.modaal({
        type: 'video'
      });
    }

    if (this.targetEle.hasClass('js-iframe')){
      this.targetEle.modaal({
        type: 'iframe'
      });
    }

    this.targetEle.modaal({
      type: 'image'
    });
  }
}

