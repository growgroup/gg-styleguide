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


    function buildFormat() {
      var $toc = $('<div />', {id: 'toc_container'});
      var $list = $('<ul />', {class: 'toc_list'});
      var $groups = $('.u-format-group');
      // フォーマットグループごとの処理
      for (var i = 0; i < $groups.length; i++) {
        var $_list = $('<ul />');
        var $group = $($groups[i]);
        var group_title = $group.find('.u-format-group__title').text();
        var $group_li = $('<li />');
        var groupid = 'formatgroup_' + (i + 1);
        $group.attr('id', groupid);
        $list.append(
          $group_li.append(
            $('<a />',
              {
                text: (i + 1) + '. ' + group_title,
                href: '#' + groupid
              }
            )
          )
        );
        // フォーマットごとの処理
        var $formats = $group.find('.u-format-group__content').find('.u-format');
        var $_ul = $('<ul />');
        for (var m = 0; m < $formats.length; m++) {
          var $format = $($formats[m]);
          var $format_title = $format.find('.u-format__title');
          var $format_content = $format.find('.u-format__content');
          var formatid = 'format_' + (i + 1) + (m + 1);
          $format.find('.u-format__title').attr('id', formatid);
          var format_title = $format_title.text();
          var format_number = (i + 1) + '.' + (m + 1) + '. ';
          $format_title.text(format_number + format_title);
          $_ul.append(
            $('<li />').append(
              $('<a />', {
                  href: '#' + formatid,
                  text: format_number + format_title
                }
              )
            )
          );

          // コードを追加
          var $code = $('<div />', {class: 'u-format__code'});
          $code.append($('<div />', {
            class: 'u-format__code__title',
            text: format_number + format_title
          }));
          var formathtml = $format.find('.u-format__content').html();
          $code.append($('<pre />', {text: formathtml.trim()}));
          $format.append($code);
        }
        $group_li.append($_ul);
        $_list.append($group_li);
        $list.append($_list);
      }
      $toc.append($list);
      $('.c-breadcrumb').after(
        $('<div />', {
            class: 'l-container'
          }
        ).append($toc)
      );
    }

    $(function() {
        var owls = $('.owl-carousel');
        if (owls.length === 0) {
            return false
        }
        owls.imagesLoaded(function () {
            $('.c-case-slider .owl-carousel').owlCarousel({
                items: 4,
                margin: 16
            });
            $('.c-mainvisual-slider').owlCarousel({
                items: 1,
                margin: 0,
                dots: true,
                loop: true,
                nav: true,
                autoplayHoverPause: true,
                autoplay: true,
                autoplaySpeed: 500,
                center: true,
                navText: ['<img src="/assets/images/icon-slider-prev.svg" />','<img src="/assets/images/icon-slider-next.svg" />'],
            });
        });
      buildFormat();
    });
  }
}

window.GApp = new App();
