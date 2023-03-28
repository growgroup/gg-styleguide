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

  growApp.prototype.showCookie = function () {
    const cookie = $("#cookie");
    const btn = $("#wt-cli-accept-all-btn");

    if (!cookie.length || !btn.length) return;

    const isCookiePermitted = sessionStorage.getItem('session-cookie-permission');

    if (isCookiePermitted) {
      cookie.addClass("is-hidden");
      return;
    }

    btn.click(function (e) {
      e.preventDefault();
      sessionStorage.setItem('session-cookie-permission', true);
      cookie.addClass("is-hidden");
    });

    window.onscroll = function (e) {
      if (window.pageYOffset > 100) {
        cookie.addClass("is-fixed");
      } else {
        cookie.removeClass("is-fixed");
      }
    }
  }

  $(function () {
    var app = new growApp();
    app.myCode();
    app.enterAnimation();
    app.showCookie();
  });
})(jQuery);
