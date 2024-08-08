// オプション公式
// https://github.com/humaan/Modaal

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
    for (var i = 0; i < this.targetEle.length; i++) {
      var target = $(this.targetEle[i]);

      if (target.hasClass('js-open')){

        if (!sessionStorage.getItem('loading')) {
          sessionStorage.setItem('loading', true);

          target.modaal({
            start_open:true, // ページロード時に表示するか
          });
        }
      }

      if (target.hasClass('js-video')){
        target.modaal({
          type: 'video'
        });
      }

      if (target.hasClass('js-iframe')){
        target.modaal({
          type: 'iframe'
        });
      }

      target.modaal({
        type: 'image'
      });
    }
  }
}

