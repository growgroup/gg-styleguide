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
  }

  growApp.prototype.enterAnimation = function () {
    let $mainVisual = $('.c-main-visual');
    if (!$mainVisual.length === 0) {
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
      if ($mainVisual) {
        changeClass($mainVisual, "is-active", 1000).then(function () {

        });
      }
    };

    // first entry only
    if (!sessionStorage.getItem('loading')) {
      sessionStorage.setItem('loading', true);
      loaderFunction();
    } else {
      $mainVisual.addClass('is-already');
    }
  };

  $(function () {
    var app = new growApp();
    app.myCode();
    app.enterAnimation();
  });
})(jQuery);
