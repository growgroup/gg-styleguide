
export default class CustomFunctions {
  /**
   * 初期化
   * @param options
   */
  constructor(options) {
    this.options = Object.assign({}, options);
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
    const triggerBtns = document.querySelectorAll(triggerbtnName);
    // const closeBtns = document.querySelectorAll(closebtnName);

    triggerBtns.forEach((triggerBtn) => {
      triggerBtn.addEventListener('click', function (e) {
        //トリガーボタンを押したときの動作
        if(document.body.classList.contains('is-search-modal-open')){
          document.body.classList.remove("is-search-modal-open");
          triggerBtns.forEach((button) => button.classList.remove("is-active"));
        }else{
          document.body.classList.add("is-search-modal-open");
          triggerBtns.forEach((button) => button.classList.add("is-active"));
        }
      });
    });
    document.addEventListener('click', function(e) {
      //bodyに.is-search-modal-openがついているときに、
      //検索フォーム本体でもトリガーボタンでも無い要素が押されたら
      if(!e.target.closest(contentName) && !e.target.closest(triggerbtnName)){
        if(document.body.classList.contains('is-search-modal-open')){
          //bodyの.is-search-modal-openと、トリガーボタンの.is-activeを外す
          document.body.classList.remove("is-search-modal-open");
          triggerBtns.forEach((button) => button.classList.remove("is-active"));
        }
      }
    });
  }



  // 複製して作業
  mycode() {

  }


}

