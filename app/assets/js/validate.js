class FormValidator {
  constructor() {

    const trrigerClass = document.querySelector('.js-GGform-validate');
    if(!trrigerClass) {
      return;
    }
    this.validateRules = {
      typeRequired: {
        type: 'GGform-required',
        message: 'この必須項目を入力してください.'
      },
      typeTelephone: {
        type: 'GGform-telephone',
        message: '半角数字と + - ( ) のみ利用できます.'
      },
      typeEmail: {
        type: 'GGform-email',
        message: 'メールアドレスの形式が正しくありません.'
      },
      typeKatakana: {
        type: 'GGform-katakana',
        message: 'カタカナで入力してください.'
      },
      typeHiragana: {
        type: 'GGform-hiragana',
        message: 'ひらがなで入力してください.'
      },
      typeKana: {
        type: 'GGform-kana',
        message: 'ひらがなもしくはカタカナで入力してください.'
      }
    };

    this.errorClass = 'GGform-error';
    this.errorMsgElemClass = 'GGform-validate-message';
    this.dataName = 'data-validate-type';
    this.dataError = 'validateActive';

    this.inputElement = 'input[type="text"], input[type="email"], input[type="password"], textarea';
    this.fileElement = 'input[type="file"]';
    this.checkboxElement = 'input[type="checkbox"]';
    this.radioElement = 'input[type="radio"]';
    this.selectElement = 'select';

    this.validateClass = 'GGform-validate';
    this.validateElements = document.querySelectorAll(`.${this.validateClass}`);
    this.submit = document.querySelector('.GGform-submit');

    this.validateElements.forEach(element => {
      const addErrorElement = document.createElement('div');
      addErrorElement.className = this.errorMsgElemClass;
      element.appendChild(addErrorElement);

      // 最初に一度だけ必須項目が空かチェック
      if (element.classList.contains(this.validateRules.typeRequired.type)) {
        this.checkInitialRequired(element);
      }

      // typeに応じて処理を分岐
      // text
      if (element.querySelector(this.inputElement)) {
        this.checkValidateTextareaElement(element);
      }
      // checkbox
      if (element.querySelector(this.checkboxElement)) {
        this.checkValidateCheckboxElement(element);
      }
      // radio
      if (element.querySelector(this.radioElement)) {
        this.checkValidateRadioElement(element);
      }
      // select
      if (element.querySelector(this.selectElement)) {
        this.checkValidateSelectElement(element);
      }
      // file
      if (element.querySelector(this.fileElement)) {
        this.checkValidateFileElement(element);
      }
    });

    //- 住所自動入力(ajaxzip3)対応
    this.zipButton = document.getElementById("zipauto");
    this.address = document.getElementById("auto-input-address");
    this.zipButton.addEventListener('click', () => {
      // AjaxZip3のデータ取得コールバック
      AjaxZip3.onSuccess = () => {
        this.validCancell(this.address);
      };
    });

    // submit時のバリデーション一斉チェック
    this.submit.addEventListener('click', (event) => {
      let hasNoErrors = true;

      this.validateElements.forEach(element => {
        if (element.dataset.validateType === this.dataError) {
          element.classList.add(`${this.errorClass}`);
          const errorElem = element.querySelector(`.${this.errorMsgElemClass}`);
          errorElem.textContent = errorElem.textContent || this.validateRules.typeRequired.message;
          hasNoErrors = false; // エラーがある場合は false を返す
        }
      });

      if (!hasNoErrors) {
        event.preventDefault();
        return;
      }
    });
  }

  checkInitialRequired(element) {

    // input
    if (element.querySelector(this.inputElement)) {

      // 未入力チェック
      const elemValue = element.querySelector(this.inputElement).value;
      if(elemValue === '') {
        element.dataset.validateType = this.dataError;
      }
    }

    // checkbox
    if (element.querySelector(this.checkboxElement)) {

      // 未選択チェック：1つ以上選択されているか確認
      let isChecked = false;
      element.querySelectorAll(this.checkboxElement).forEach(checkbox => {
        if (checkbox.checked) {
          isChecked = true;
        }
      });

      if(!isChecked) {
        element.dataset.validateType = this.dataError;
      }
    }

    // radio
    if (element.querySelector(this.radioElement)) {

      // 未選択チェック：1つ以上選択されているか確認
      let isChecked = false;
      element.querySelectorAll(this.radioElement).forEach(radioButton => {
        if (radioButton.checked) {
          isChecked = true;
        }
      });
      if(!isChecked) {
        element.dataset.validateType = this.dataError;
      }
    }

    // select
    if (element.querySelector(this.selectElement)) {
      const elem = element.querySelector(this.selectElement);
      const elemValue = elem.value;

      // 未選択またはdisabledか確認
      if(elemValue === '' || elem.options[elem.selectedIndex].disabled) {
        element.dataset.validateType = this.dataError;
      }
    }

    // file
    if (element.querySelector(this.fileElement)) {

      // 未入力チェック（MW WP Form利用を想定してinput[type="hidden"]も許容）
      const elemValue = element.querySelectorAll(this.fileElement+', .mw-wp-form_file input[type="hidden"]');
      const flag = Array.from(elemValue).some(elem => elem.value.trim() !== '');

      if(!flag){
        element.dataset.validateType = this.dataError;
        return;
      }
      this.validCancell(element);
    }
  }

  // 入力形
  checkValidateTextareaElement(parentElement) {

    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');

    // 以下のイベントに応じてバリデーション発火
    ['keyup', 'focusout'].forEach((event) => {
      parentElement.querySelector(this.inputElement).addEventListener(event, (e) => {
        let validActive = false;  // バリデーション発火フラグ
        let checkValidateType;    // バリデーション対象物の確認

        // 必須項目チェック（required）、文字入力・空白チェック
        if(hasValidTypes.includes(this.validateRules.typeRequired.type)) {

          if(!e.target.value.trim() || e.target.value.trim() === "") {
            checkValidateType = this.validateRules.typeRequired;
            validActive = true;
          }
        }

        //　ひらがなチェック
        if(hasValidTypes.includes(this.validateRules.typeHiragana.type)) {
          const hiraganaRegex =/^[ぁ-ゞー\s]+$/; // 正規表現：ひらがな

          if(e.target.value.trim() !== '' && !hiraganaRegex.test(e.target.value)) {
            checkValidateType = this.validateRules.typeHiragana;
            validActive = true;
          }
        }

        // カタカナチェック
        if(hasValidTypes.includes(this.validateRules.typeKatakana.type)) {
          const katakanaRegex = /^[\u30a1-\u30f6｡-ﾟ\s]+$/;; // 正規表現：全角半角カタカナ

          if (e.target.value.trim() !== '' && !katakanaRegex.test(e.target.value) ) {
            checkValidateType = this.validateRules.typeKatakana;
            validActive = true;
          }
        }

        //　ひらがなorカタカナチェック
        if(hasValidTypes.includes(this.validateRules.typeKana.type)) {
          const kanaRegex = /^[ぁ-ゖァ-ヶーｦ-ﾟ]+$/; // 正規表現：全角半角カタカナひらがな

          if(e.target.value !== '' && !kanaRegex.test(e.target.value)) {
            checkValidateType = this.validateRules.typeKana;
            validActive = true;
          }
        }

        // 電話番号形式チェック
        if(hasValidTypes.includes(this.validateRules.typeTelephone.type)) {

          if(!/^[0-9+\-()]*$/.test(e.target.value)) {
            checkValidateType = this.validateRules.typeTelephone;
            validActive = true;
          }
        }

        // メール形式チェック
        if(hasValidTypes.includes(this.validateRules.typeEmail.type)) {

          if (e.target.value.trim() && !/\S+@\S+\.\S+/.test(e.target.value.trim())) {
            checkValidateType = this.validateRules.typeEmail;
            validActive = true;
          }
        }

        // バリデーション発火確認
        if(validActive) {
          this.activeError(parentElement, checkValidateType);
          return;
        }

        // 問題なければバリデーション解除
        this.validCancell(parentElement);
      });
    });
  }

  // checkbox
  checkValidateCheckboxElement(parentElement) {

    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');
    // 以下のイベントに応じてバリデーション発火
    ['focusout', 'change'].forEach((event) => {

      parentElement.querySelectorAll(this.checkboxElement).forEach(checkbox => {
        checkbox.addEventListener(event, () => {

          let validActive = false;  // バリデーション発火フラグ
          let checkValidateType;    // バリデーション対象物の確認

          // 必須項目チェック（required）
          if(hasValidTypes.includes(this.validateRules.typeRequired.type)) {
            let isChecked = false;

            parentElement.querySelectorAll(this.checkboxElement).forEach(checkbox => {
              if (checkbox.checked) {
                isChecked = true;
                return;
              }
            });

            if (!isChecked) {
              checkValidateType = this.validateRules.typeRequired;
              validActive = true;
            }
          }

          // バリデーション発火確認
          if(validActive) {
            this.activeError(parentElement, checkValidateType);
            return;
          }

          // 問題なければバリデーション解除
          this.validCancell(parentElement);
        });
      });
    });
  }

  // radio
  checkValidateRadioElement(parentElement) {

    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');
    ['focusout', 'change'].forEach((event) => {

      parentElement.querySelectorAll(this.radioElement).forEach(radioButton => {
        radioButton.addEventListener(event, () => {

          let validActive = false;  // バリデーション発火フラグ
          let checkValidateType;    // バリデーション対象物の確認

          // 必須項目チェック（required）
          if(hasValidTypes.includes(this.validateRules.typeRequired.type)) {

            // 選択チェック
            let isChecked = false;
            parentElement.querySelectorAll(this.radioElement).forEach(radioButton => {
              if (radioButton.checked) {
                isChecked = true;
              }
            });

            if (!isChecked) {
              checkValidateType = this.validateRules.typeRequired;
              validActive = true;
            }
          }

          // バリデーション発火確認
          if(validActive) {
            this.activeError(parentElement, checkValidateType);
            return;
          }

          // 問題なければバリデーション解除
          this.validCancell(parentElement);
        });
      });
    });
  }

  // select
  checkValidateSelectElement(parentElement) {

    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');
    ['focusout', 'change'].forEach((event) => {
      parentElement.querySelector(this.selectElement).addEventListener(event, (e) => {
        let validActive = false;  // バリデーション発火フラグ
        let checkValidateType;    // バリデーション対象物の確認

        const option = e.target.options[e.target.selectedIndex];

        // 必須項目チェック（required）
        if(hasValidTypes.includes(this.validateRules.typeRequired.type)) {

          if(!option || option.disabled) {
            checkValidateType = this.validateRules.typeRequired;
            validActive = true;
          }
        }

        // バリデーション発火確認
        if(validActive) {
          this.activeError(parentElement, checkValidateType);
          return;
        }

        // 問題なければバリデーション解除
        this.validCancell(parentElement);
      });
    });
  }

  // file
  checkValidateFileElement(parentElement) {

    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');
    ['focusout', 'change'].forEach((event) => {

      parentElement.querySelector(this.fileElement).addEventListener(event, (e) => {
        let validActive = false;  // バリデーション発火フラグ
        let checkValidateType;    // バリデーション対象物の確認

        // 必須項目チェック（required）、ファイルアップロードチェック
        if(hasValidTypes.includes(this.validateRules.typeRequired.type)) {

          if(!e.target.files || !e.target.files.length > 0) {
            checkValidateType = this.validateRules.typeRequired;
            validActive = true;
          }
        }

        // バリデーション発火確認
        if(validActive) {
          this.activeError(parentElement, checkValidateType);
          return;
        }

        // 問題なければバリデーション解除
        this.validCancell(parentElement);
      });
    });
  }

  // バリデーション解除
  validCancell(element) {
    const errorElement = element.querySelector(`.${this.errorMsgElemClass}`);
    element.classList.remove(this.errorClass);
    element.dataset.validateType = '';
    errorElement.textContent = '';
  }
  // バリデーション発火
  activeError(element, validateType) {
    const errorElement = element.querySelector(`.${this.errorMsgElemClass}`);
    element.classList.add(this.errorClass);
    element.dataset.validateType = this.dataError;
    errorElement.textContent = validateType.message;
  }
}

// グローバルスコープにクラスを追加
window.FormValidator = FormValidator;
