/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 */

(function ($) {
  var growApp = function () {

  };

  /************************
   * please insert your code
   *************************/
  growApp.prototype.myCode = function () {
    $('.js-modal-content').modaal();
  }

  growApp.prototype.urlCopy = function () {

    $('.c-block-modal__copy button').on('click', function(){

      // コピーする文章の取得
      let $url = $('.c-block-modal__copy input').val();
      // テキストエリアの作成
      let $textarea = $('<textarea></textarea>');
      // テキストエリアに文章を挿入
      $textarea.text($url);
      //　テキストエリアを選択
      $textarea.select();
      // コピー
      document.execCommand('copy');
      // テキストエリアの削除
      $textarea.remove();
      // アラート文の表示
      alert('「' + $url + '」をコピーしました。');
    });
  }

  growApp.prototype.enterAnimation = function () {
    let $loader = $('.c-loader');
    if (!$loader.length === 0) {
      return false;
    }

    function changeClass(el, className, time) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          el.addClass(className);
          resolve(className);
        }, time);
      });
    }

    var loaderFunction = function () {
      // ここから実行
      if ($loader) {
        changeClass($loader, "is-active", 1000).then(function () {
          changeClass($loader, "is-close", 2000).then(function () {
            changeClass($loader, "is-hidden", 1000).then(function () {

            });
          });
        });
      }
    };

    // first entry only
    if (!sessionStorage.getItem('loading')) {
      sessionStorage.setItem('loading', true);
      loaderFunction();
    } else {
      // テストはこちらをコメントアウト外す
      // loaderFunction();
      $loader.addClass('is-already');
    }
  };

  growApp.prototype.backCache = function () {
    window.onpageshow = function(event) {
      if (event.persisted) {
        window.location.reload();
      }
    }
  }

  $(function () {
    var app = new growApp();
    app.myCode();
    app.urlCopy();
    app.enterAnimation();
  });
})(jQuery);
