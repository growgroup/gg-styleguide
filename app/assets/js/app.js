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
import myScript from './scripts.js';
import OwlCarousel from 'owl.carousel';
import modaal from 'modaal';
import {scrollfire} from "./app/scrolltrigger.js";
import anime from 'animejs';

import fontAwesome from "font-awesome/scss/font-awesome.scss";
import OwlCss from "owl.carousel/dist/assets/owl.carousel.css";
import OwlThemeCss from "owl.carousel/dist/assets/owl.theme.default.css";
import modaalCss from 'modaal/dist/css/modaal.css';
class ScrollReveal {
  constructor(options){
    this.options = options;
  }

  reveal(el, options, duration){
    $(el).css({
      visibility: "visible",
      opacity: 0,
    })
    scrollfire( el, function(){
      // console.log(el);
      var args = {
        targets: el,
        // opacity: 1,
        // translateY: -options.distance,
        // duration: 600
      }
      args = Object.assign(options,args);
      anime(args);
    }, {
      offset: window.innerHeight
    })
  }
}

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
      $('.l-footer__block').on('click', function () {
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
          navText: ['<img src="../assets/images/icon-slider-prev.svg" />', '<img src="../assets/images/icon-slider-next.svg" />'],
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
          navText: ['<img src="../assets/images/icon-slider-prev.svg" />', '<img src="../assets/images/icon-slider-next.svg" />'],
          responsive: {
            // breakpoint from 0 up
            0: {
              items: 1,
            },
            // breakpoint from 750 up
            750: {
              items: 3,
            }
          }
        });
      });
    }
    //- スクロールリーバル
    function reveal() {
      function domEach(items, callback) {
        if (typeof items === "string") {
          var items = $(items);
        }
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          // callback = callback.bind(item)
          callback(i, item);
        }
      }
      window.sr = new ScrollReveal({duration: 600, mobile: true});
      var baseEasing = 'cubicBezier(0.175, 0.885, 0.32, 1.275)';
      var baseDistance = '8';

      sr.reveal(".c-main-visual,.l-page-header", {
        duration: 1400,
        opacity: 1,
        //translateY: -baseDistance,
        delay: 900,
      }, 100);

      sr.reveal(".c-solution__wrap  > *",{
        scale: [0.9, 1],
        opacity: 1,
        duration: 600,
        delay: anime.stagger(100),
        translateX: [-baseDistance,0],
        easing: baseEasing
      });
      domEach(".c-card-sm__block", function(key, item){

        sr.reveal(item,{
          scale: {
            value: [0.9,1],
            // easing: "linear"
          },
          opacity: 1,
          duration: 600,
          delay: 100*key,
          translateY: [-baseDistance,0],
          easing: baseEasing
        } );
      });
    }

    // modaal
    function modaal() {
      // ====================
      // <HTML>
      // <a href="path/to/image.jpg" class="js-modal-image" data-modaal-desc="My Description">Show</a>
      // or
      // <button data-modaal-content-source="path/to/image.jpg" class="js-modal-image">Show</button>
      // ====================

      $('.js-modal-image').modaal({
        type: 'image'
      });
    }
    
    // コピーライトの年数自動出力
    function autoWriteYear() {
      $('.js-current-year').text(new Date().getFullYear());
    }

    $(function () {
      menuSlide();
      owlCarousel();
      modaal();
      reveal();
      autoWriteYear();
    });
  }
}

window.GApp = new App();
