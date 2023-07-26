
export default class CustomFunctions {
  /**
   * 初期化
   * @param options
   */
  constructor(options) {
    this.options = $.extend(options);
    this.init();
  }

  /**
   * 実行する
   */
  init() {
    this.searchFormModal();
  }

  /**
   * カスタム関数
   */

  // headerのフォーム
  searchFormModal() {
    const triggerbtnName = ".js-header-searchform-open";
    const contentName = ".js-header-searchform-content";
    // const closebtnName = ".js-header-searchform-close";
    const $triggerbtn = $(triggerbtnName);
    const $content = $(contentName);
    // const $closebtn = $(closebtnName);

    $triggerbtn.click(function (e) {
      //トリガーボタンを押したときの動作
      if($("body").hasClass('is-search-modal-open')){
        $("body").removeClass("is-search-modal-open");
        $triggerbtn.removeClass("is-active");
      }else{
        $("body").addClass("is-search-modal-open");
        $triggerbtn.addClass("is-active");
      }
    });
    $(document).on('click', function(e) {
      //bodyに.is-search-modal-openがついているときに、
      //検索フォーム本体でもトリガーボタンでも無い要素が押されたら
      if(!$(e.target).closest(contentName).length && !$(e.target).closest(triggerbtnName).length){
        if($("body").hasClass('is-search-modal-open')){
          //bodyの.is-search-modal-openと、トリガーボタンの.is-activeを外す
          $("body").removeClass("is-search-modal-open");
          $triggerbtn.removeClass("is-active");
        }
      }
    });
  }

  // ループスライダー
  infiniteSlider() {
    const optionInfinite = {
      infinite: true,
      arrows: false,
      swipe: false,
      dots: false,
      variableWidth: true,  // スライド幅の自動計算を無効
      autoplay: true,
      autoplaySpeed: 0,
      speed: 5000,
      cssEase: "linear",
      pauseOnFocus: false,
      pauseOnHover: false
    }
    const slickInfinite = $('.js-infinite-slider');
    if (slickInfinite) $(slickInfinite).slick(optionInfinite);
  }


  // 複製して作業
  mycode() {
  }


}




