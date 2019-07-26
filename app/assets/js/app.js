import $ from './app/jquery-shim.js';
import Utils from './app/utils.js';
import Accordion from './app/accordion.js';
import Anchor from './app/anchor.js';
import FixedHeader from './app/fixedheader.js';
import HeightLine from './app/heightline.js';
import ResponsiveTable from './app/responsive-table.js';
import Slidebar from './app/slidebar.js';
import Tab from './app/tab.js';
import CurrentNav from './app/current-nav.js';
import buildFormat from './app/format.js';
import OwlCarousel from 'owl.carousel';

import fontAwesome from "font-awesome/scss/font-awesome.scss"
import OwlCss from "owl.carousel/dist/assets/owl.carousel.css"
import OwlThemeCss from "owl.carousel/dist/assets/owl.theme.default.css"

class App {
  constructor() {
    this.Utils = new Utils();
    this.Accordion = new Accordion();
    this.Anchor = new Anchor();
    this.FixedHeader = new FixedHeader();
    this.HeightLine = new HeightLine();
    this.ResponsiveTable = new ResponsiveTable();
    this.Slidebar = new Slidebar();
    this.CurrentNav = new CurrentNav();
    this.Tab = new Tab();

      //SPメニューの高さ取得
    function menuHight() {
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

      //フッターメニューSPスライド
      function menuSlide() {
          var win = $(window).innerWidth();
          if (win > 750) {
              return false;
          }
          $('.l-footer__block').on('click',function() {
              $(this).children(".l-footer__menutitle").toggleClass('is-open');
              $(this).children(".l-footer__menulist.is-sub").slideToggle();
          })
      }
      //owlcarousel
      function owlCarousel() {
          var owls = $('.owl-carousel');
          if (owls.length === 0) {
              return false
          }
          //->スライダー
          owls.imagesLoaded(function () {
              $('.c-main-visual__slider').owlCarousel({
                  items: 1,
                  margin: 0,
                  dots: true,
                  loop: true,
                  nav: false,
                  autoplayHoverPause: true,
                  autoplay: true,
                  autoplaySpeed: 500,
                  autoWidth: false,
                  autoHeight: false,
                  center: true,
                  navText: ['<img src="../assets/images/icon-slider-prev.svg" />','<img src="../assets/images/icon-slider-next.svg" />'],
              });
          });
          //->カルーセル
          owls.imagesLoaded(function () {
              $('.c-main-visual__carousel').owlCarousel({
                  items: 1,
                  margin: 16,
                  dots: true,
                  loop: true,
                  nav: true,
                  autoplayHoverPause: true,
                  autoplay: false,
                  autoplaySpeed: 500,
                  autoWidth: false,
                  autoHeight: false,
                  center: true,
                  navText: ['<div class="c-main-visual__nav is-left"><i class="fa fa-angle-left" aria-hidden="true"></i></div>','<div class="c-main-visual__nav is-right"><i class="fa fa-angle-right" aria-hidden="true"></i></div>'],
                  responsive : {
                    // breakpoint from 0 up
                    0 : {
                      stagePadding: 32,
                    },
                    // breakpoint from 750  up
                    750 : {
                      stagePadding: 64,
                    },
                    // breakpoint from 950 up
                    950 : {
                      stagePadding: 156,
                    },
                    1400 : {
                      stagePadding: 312,
                    }
                  }
              });
          });
          //->カルーセル_ノーマル
          owls.imagesLoaded(function () {
          $('.c-main-visual__carousel.is-normal').owlCarousel({
            items: 1,
            margin: 8,
            dots: true,
            loop: true,
            nav: true,
            autoplayHoverPause: true,
            autoplay: false,
            autoplaySpeed: 500,
            autoWidth: false,
            autoHeight: false,
            center: true,
            navText: ['<div class="c-main-visual__nav is-left"><i class="fa fa-angle-left" aria-hidden="true"></i></div>','<div class="c-main-visual__nav is-right"><i class="fa fa-angle-right" aria-hidden="true"></i></div>'],
            responsive : {
              // breakpoint from 0 up
              0 : {
                stagePadding: 32,
              },
              // breakpoint from 750  up
              750 : {
                stagePadding: 64,
              },
              // breakpoint from 950 up
              950 : {
                stagePadding: 156,
              },
              1400 : {
                stagePadding: 312,
              }
            }
          });
        });
          //->カルーセル_レイヤー
          owls.imagesLoaded(function () {
            $('.c-main-visual-layer__carousel').owlCarousel({
              items: 1,
              margin: 0,
              dots: true,
              loop: true,
              nav: false,
              autoplayHoverPause: true,
              autoplay: true,
              autoplaySpeed: 500,
              autoWidth: false,
              autoHeight: false,
              center: true,
              navText: ['<img src="..//assets/images/icon-slider-prev.svg" />','<img src="../assets/images/icon-slider-next.svg" />'],
            });
          });
          //->カード_カルーセル
          owls.imagesLoaded(function () {
              $('.js-card-slider').owlCarousel({
                  margin: 0,
                  dots: false,
                  loop: true,
                  nav: true,
                  autoplayHoverPause: true,
                  autoplay: true,
                  autoplaySpeed: 500,
                  autoWidth: false,
                  autoHeight: false,
                  center: true,
                  navText: ['<img src="../assets/images/icon-slider-prev.svg" />','<img src="../assets/images/icon-slider-next.svg" />'],
                  responsive : {
                    // breakpoint from 0 up
                    0 : {
                      items: 1,
                    },
                    // breakpoint from 750 up
                    750 : {
                      items: 3,
                    }
                  }
              });
          });
      }

    $(function() {
        menuSlide();
        owlCarousel();
    });
  }
}

window.GApp = new App();
