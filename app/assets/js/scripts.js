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

  // growApp.prototype.modalContents = function () {
  //   $('.js-modal-content').modaal();
  // }

  growApp.prototype.enterAnimation = function () {
    let $loader = $('.c-loader');
    if (!$loader.length === 0) {
      return false;
    }

    function changeClass(el, className, time) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          el.addClass(className);
          resolve(className);
        }, time);
      });
    }
    function removeClass(el, className, time) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          el.removeClass(className);
          resolve(className);
        }, time);
      });
    }

    var loaderFunction = async function () {
      // ここから実行
      if ($loader) {
        await changeClass($loader, "is-active", 1000);
        await changeClass($loader, "is-close", 2000);
        await changeClass($loader, "is-hidden", 1000);
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

  //　キャッシュ対策
  growApp.prototype.backCache = function () {
    window.onpageshow = function(event) {
      if (event.persisted) {
        window.location.reload();
      }
    }
  }

  // Cookie
  growApp.prototype.showCookie = function () {
    const cookie = $(".js-cookie");
    const cookieId = $("#cookie");
    const btn = $("#wt-cli-accept-all-btn");

    if (cookie.length || btn.length) {

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
    }

    window.onscroll = function (e) {
      if (window.pageYOffset > 100) {
        cookieId.addClass("is-fixed");
      } else {
        cookieId.removeClass("is-fixed");
      }
    }
  }


  $(function () {
    var app = new growApp();
    app.myCode();
    app.modalContents();
    app.enterAnimation();
    app.showCookie();
    app.backCache();
  });
})(jQuery);
