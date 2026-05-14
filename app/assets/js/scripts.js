/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 */
(function () {
  var growApp = function () {

  };

  /************************
   * please insert your code
   *************************/
  growApp.prototype.myCode = function () {
  }


  growApp.prototype.enterAnimation = function () {
    let loader = document.querySelector('.c-loader');
    if (!loader) {
      return false;
    }

    function changeClass(el, className, time) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          el.classList.add(className);
          resolve(className);
        }, time);
      });
    }
    function removeClass(el, className, time) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          el.classList.remove(className);
          resolve(className);
        }, time);
      });
    }

    var loaderFunction = async function () {
      // ここから実行
      if (loader) {
        await changeClass(loader, "is-active", 1000);
        await changeClass(loader, "is-close", 2000);
        await changeClass(loader, "is-hidden", 1000);
      }
    };

    // first entry only
    if (!sessionStorage.getItem('loading')) {
      sessionStorage.setItem('loading', true);
      loaderFunction();
    } else {
      // テストはこちらをコメントアウト外す
      // loaderFunction();
      loader.classList.add('is-already');
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
    const cookie = document.querySelector(".js-cookie");
    const cookieId = document.querySelector("#cookie");
    const btn = document.querySelector("#wt-cli-accept-all-btn");

    if (cookie || btn) {

      const isCookiePermitted = sessionStorage.getItem('session-cookie-permission');

      if (isCookiePermitted) {
        if (cookie) {
          cookie.classList.add("is-hidden");
        }
        return;
      }

      if (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          sessionStorage.setItem('session-cookie-permission', true);
          if (cookie) {
            cookie.classList.add("is-hidden");
          }
        });
      }
    }

    window.onscroll = function (e) {
      if (!cookieId) {
        return;
      }
      if (window.pageYOffset > 100) {
        cookieId.classList.add("is-fixed");
      } else {
        cookieId.classList.remove("is-fixed");
      }
    }
  }
  document.addEventListener('DOMContentLoaded', function () {
    var app = new growApp();
    app.myCode();
    // app.modalContents();
    app.enterAnimation();
    app.showCookie();
    // app.backCache();
  });
})();
