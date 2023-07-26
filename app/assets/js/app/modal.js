

// <div data-modaal-content-source="assets/image/image.jpg" class="js-modal-image">Show</div>
// 動画の場合 → js-video
// iframeの場合 → js-iframe
// 見やすくしたい場合 -> .js-clone(data-modaal-content-source="inline")


let defaultOptions = {
  selector: ".js-modal-image,.js-modal",
  mobile: true // モバイル時にどう動作するか
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
    if ( (screen.width > 768)  || this.options.mobile === true) {
      this.run();
    }
  }

  /**
   * 実行
   */
  run() {
    for (var i = 0; i < this.targetEle.length; i++) {

      var target = $(this.targetEle[i]);

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

      if (target.hasClass('js-clone')){
        let $emptyHtml = $('<div></div>')
        let $clonedTable = target.clone();
        let $id = target.data('modaal-content-source') ;
        $emptyHtml.attr('id', $id);
        $emptyHtml.css('display', 'none');
        $emptyHtml.append($clonedTable);
        target.after($emptyHtml);

        target.modaal({
          type: 'inline',
          content_source: '#' + $id,
          custom_class: 'is-full-view'
        });
      }


      target.modaal({
        type: 'image'
      });
    }
  }
}

