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
    /*
     * userAgent取得
     * */
    var Agent = window.navigator.userAgent.toLowerCase();
    var _ua = (function (u) {
        return {
            Tablet: (u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1)
            || u.indexOf("ipad") != -1
            || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
            || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
            || u.indexOf("kindle") != -1
            || u.indexOf("silk") != -1
            || u.indexOf("playbook") != -1,
            Mobile: (u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
            || u.indexOf("iphone") != -1
            || u.indexOf("ipod") != -1
            || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
            || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
            || u.indexOf("blackberry") != -1
        }
    })(Agent);

    growApp.prototype.changeViewPort = function () {

        //ビューポート処理
        if (_ua.Mobile) {
            $('head').prepend('<meta name="viewport" content="width=device-width,initial-scale=1">');
        } else {
            $('head').prepend('<meta name="viewport" content="width=1100">');
        }
    };

    /*
    *
    * スマホメニューの高さを取得する
    *
    * */
    growApp.prototype.menuHight = function () {
        var win = $(window).innerWidth();
        if (win > 750) {
            return false;
        }

        var $smpHeaderHeight = $('.l-header').height();
        var windowHeight = window.innerHeight;
        var winH = windowHeight - $smpHeaderHeight;

        console.log($smpHeaderHeight);

        //動かすターゲットを取得
        var targetSlidebarWrap = $('.c-slidebar-menu'),
            targetSlidebarMenu = $('.c-slidebar__parent'),
            targetSlidebarBtn = $('.c-slidebar-menu__parent');


        //いざ実行(クリックしたら処理を実行する)
        targetSlidebarBtn.on('click', function () {
            $('.c-slidebar-menu').toggleClass('is-active');

        });
    }

    growApp.prototype.footerMenu = function () {
        var win = $(window).innerWidth();
        if (win > 750) {
            return false;
        }
        $('.c-footer-menu__block').on('click',function() {
            $(this).children(".c-footer-menu__title").toggleClass('is-open');
            $(this).children(".c-footer-menu__list.is-sub").slideToggle();
        })
    }

    $(function () {
        var app = new growApp();
        app.changeViewPort();
        // app.menuHight();
        app.footerMenu();
    });

})(jQuery);
