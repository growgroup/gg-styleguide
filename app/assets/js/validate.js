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

    this.flagClass = 'GGform-flag';
    this.errorClass = 'GGform-error';
    this.errorMsgElemClass = 'GGform-validate-message';
    this.dataName = 'data-validate-type';

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

      // 必須項目は先行してerrorのflagを付与
      if (element.classList.contains(this.validateRules.typeRequired.type)) {
        element.classList.add(this.flagClass);
      }

      // 以下のイベントに応じてバリデーション発火
      ['keyup', 'focusout', 'change'].forEach((eventListeners) => {

        // typeに応じて処理を分岐
        // text
        if (element.querySelector(this.inputElement)) {
          this.validateTextareaElement(element, eventListeners);
        }
        // checkbox
        if (element.querySelector(this.checkboxElement)) {
          this.validateCheckboxElement(element, eventListeners);
        }
        // radio
        if (element.querySelector(this.radioElement)) {
          this.validateRadioElement(element, eventListeners);
        }
        // select
        if (element.querySelector(this.selectElement)) {
          this.validateSelectElement(element, eventListeners);
        }
        // file
        if (element.querySelector(this.fileElement)) {
          this.validateFileElement(element, eventListeners);
        }

      });
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
      const errorGroups = document.querySelectorAll(`.${this.validateClass}.${this.flagClass}`);

      if(errorGroups.length > 0) {
        errorGroups.forEach(errorGroup => {
          errorGroup.classList.add(this.errorClass);
          const errorElem = errorGroup.querySelector(`.${this.errorMsgElemClass}`);
          if(!errorElem.getAttribute(this.dataName)) {
            errorElem.textContent = this.validateRules.typeRequired.message;
          }
        });
        event.preventDefault();
        return;
      }
    });
  }

  // 入力形
  validateTextareaElement(parentElement, eventListeners) {
    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');

    parentElement.querySelector(this.inputElement).addEventListener(eventListeners, (e) => {
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
  }

  // checkbox
  validateCheckboxElement(parentElement, eventListeners) {

    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');

    parentElement.querySelectorAll(this.checkboxElement).forEach(checkbox => {
      checkbox.addEventListener(eventListeners, () => {

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
  }

  // radio
  validateRadioElement(parentElement, eventListeners) {

    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');

    parentElement.querySelectorAll(this.radioElement).forEach(radioButton => {
      radioButton.addEventListener(eventListeners, () => {

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
  }

  // select
  validateSelectElement(parentElement, eventListeners) {

    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');

    parentElement.querySelector(this.selectElement).addEventListener(eventListeners, (e) => {
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
  }

  // file
  validateFileElement(parentElement, eventListeners) {

    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');

    parentElement.querySelector(this.fileElement).addEventListener(eventListeners, (e) => {
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
  }

  // バリデーション解除
  validCancell(element) {
    const errorElement = element.querySelector(`.${this.errorMsgElemClass}`);
    element.classList.remove(this.flagClass, this.errorClass);
    errorElement.dataset.validateType = '';
    errorElement.textContent = '';
  }
  // バリデーション発火
  activeError(element, validateType) {
    const errorElement = element.querySelector(`.${this.errorMsgElemClass}`);
    element.classList.add(this.flagClass, this.errorClass);
    errorElement.dataset.validateType = validateType.type;
    errorElement.textContent = validateType.message;
  }
}

// グローバルスコープにクラスを追加
window.FormValidator = FormValidator;
