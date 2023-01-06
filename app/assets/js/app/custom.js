
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
    this.formModal();
  }

  /**
   * カスタム関数
   */

  // headerのフォーム
  formModal() {
    const triggerbtn = $(".js-header-form");
    const closebtn = $(".c-block-modal-form__close");

    triggerbtn.click(function (e) {
      $("body").toggleClass("is-search-modal-open");
      $(triggerbtn).toggleClass("is-active");
    })

    closebtn.click(function (e) {
      $("body").toggleClass("is-search-modal-open");
      $(triggerbtn).toggleClass("is-active");
    })


    $(".c-block-modal-form__bg").click(function (e) {
      $("body").toggleClass("is-search-modal-open");
      $(triggerbtn).toggleClass("is-active");
    })
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




