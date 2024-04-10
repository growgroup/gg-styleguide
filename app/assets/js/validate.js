class FormValidator {
  constructor() {

    const triggerClass = document.querySelector('.js-GGform-validate');
    if (!triggerClass) {
      return;
    }
    this.validateRules = {
      typeRequired: {
        type: 'GGform-required', message: 'この必須項目を入力してください.'
      }, typeTelephone: {
        type: 'GGform-telephone', message: '半角数字と + - ( ) のみ利用できます.'
      }, typeEmail: {
        type: 'GGform-email', message: 'メールアドレスの形式が正しくありません.'
      }, typeKatakana: {
        type: 'GGform-katakana', message: 'カタカナで入力してください.'
      }, typeHiragana: {
        type: 'GGform-hiragana', message: 'ひらがなで入力してください.'
      }, typeKana: {
        type: 'GGform-kana', message: 'ひらがなもしくはカタカナで入力してください.'
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

      //バリデーション発火フラグ
      let validActive = false;

      // 必須項目は先行してerrorのflagを付与
      if (element.classList.contains(this.validateRules.typeRequired.type)) {
        this.validateInitFlag(element);
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

    // MW WP FormがActiveかどうかの判定
    if (document.querySelector('.mw_wp_form')) {
      // MW WP Form特有のファイルを保持するhiddenフィールドを別のファイルが指定された時に削除する
      document.querySelectorAll(this.fileElement).forEach(file => {
        file.addEventListener('change', (e) => {
          const mwFormFile = e.target.closest('.c-forms__file').querySelector('.mw-wp-form_file');
          if (mwFormFile) {
            mwFormFile.remove();
          }
        });
      });
    }

    // submit時のバリデーション一斉チェック
    this.submit.addEventListener('click', (event) => {
      const errorGroups = document.querySelectorAll(`.${this.validateClass}.${this.flagClass}`);

      if (errorGroups.length > 0) {
        errorGroups.forEach(errorGroup => {
          errorGroup.classList.add(this.errorClass);
          const errorElem = errorGroup.querySelector(`.${this.errorMsgElemClass}`);
          if (!errorElem.getAttribute(this.dataName)) {
            errorElem.textContent = this.validateRules.typeRequired.message;
          }
        });
        event.preventDefault();
        return;
      }

      const validationPassedEvent = new CustomEvent('validationPassed', {bubbles: true});
      this.submit.dispatchEvent(validationPassedEvent);
    });
  }

  // input[type="text"], input[type="email"], input[type="password"], textareaのバリデーション
  validateTextareaElement(parentElement, eventListeners) {
    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');

    parentElement.querySelector(this.inputElement).addEventListener(eventListeners, (e) => {
      let validActive = false;  // バリデーション発火フラグ
      let checkValidateType;    // バリデーション対象物の確認

      // 必須項目チェック（required）、文字入力・空白チェック
      if (hasValidTypes.includes(this.validateRules.typeRequired.type)) {

        if (!e.target.value.trim() || e.target.value.trim() === "") {
          checkValidateType = this.validateRules.typeRequired;
          validActive = true;
        }
      }

      //　ひらがなチェック
      if (hasValidTypes.includes(this.validateRules.typeHiragana.type)) {
        const hiraganaRegex = /^[ぁ-ゞー\s]+$/; // 正規表現：ひらがな

        if (e.target.value.trim() !== '' && !hiraganaRegex.test(e.target.value)) {
          checkValidateType = this.validateRules.typeHiragana;
          validActive = true;
        }
      }

      // カタカナチェック
      if (hasValidTypes.includes(this.validateRules.typeKatakana.type)) {
        const katakanaRegex = /^[\u30a1-\u30f6｡-ﾟ\s]+$/; // 正規表現：全角半角カタカナ

        if (e.target.value.trim() !== '' && !katakanaRegex.test(e.target.value)) {
          checkValidateType = this.validateRules.typeKatakana;
          validActive = true;
        }
      }

      //　ひらがなorカタカナチェック
      if (hasValidTypes.includes(this.validateRules.typeKana.type)) {
        const kanaRegex = /^[ぁ-ゖァ-ヶーｦ-ﾟ]+$/; // 正規表現：全角半角カタカナひらがな

        if (e.target.value !== '' && !kanaRegex.test(e.target.value)) {
          checkValidateType = this.validateRules.typeKana;
          validActive = true;
        }
      }

      // 電話番号形式チェック
      if (hasValidTypes.includes(this.validateRules.typeTelephone.type)) {

        if (!/^[0-9+\-()]*$/.test(e.target.value)) {
          checkValidateType = this.validateRules.typeTelephone;
          validActive = true;
        }
      }

      // メール形式チェック
      if (hasValidTypes.includes(this.validateRules.typeEmail.type)) {

        if (e.target.value.trim() && !/\S+@\S+\.\S+/.test(e.target.value.trim())) {
          checkValidateType = this.validateRules.typeEmail;
          validActive = true;
        }
      }

      // バリデーション発火確認
      if (validActive) {
        this.activeError(parentElement, checkValidateType);
        return;
      }

      // 問題なければバリデーション解除
      this.validCancell(parentElement);
    });
  }

  // checkboxのバリデーション
  validateCheckboxElement(parentElement, eventListeners) {

    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');

    parentElement.querySelectorAll(this.checkboxElement).forEach(checkbox => {
      checkbox.addEventListener(eventListeners, () => {

        let validActive = false;  // バリデーション発火フラグ
        let checkValidateType;    // バリデーション対象物の確認

        // 必須項目チェック（required）
        if (hasValidTypes.includes(this.validateRules.typeRequired.type)) {
          let isChecked = false;

          parentElement.querySelectorAll(this.checkboxElement).forEach(checkbox => {
            if (checkbox.checked) {
              isChecked = true;

            }
          });

          if (!isChecked) {
            checkValidateType = this.validateRules.typeRequired;
            validActive = true;
          }
        }

        // バリデーション発火確認
        if (validActive) {
          this.activeError(parentElement, checkValidateType);
          return;
        }

        // 問題なければバリデーション解除
        this.validCancell(parentElement);
      });
    });
  }

  // radioのバリデーション
  validateRadioElement(parentElement, eventListeners) {

    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');

    parentElement.querySelectorAll(this.radioElement).forEach(radioButton => {
      radioButton.addEventListener(eventListeners, () => {

        let validActive = false;  // バリデーション発火フラグ
        let checkValidateType;    // バリデーション対象物の確認

        // 必須項目チェック（required）
        if (hasValidTypes.includes(this.validateRules.typeRequired.type)) {

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
        if (validActive) {
          this.activeError(parentElement, checkValidateType);
          return;
        }

        // 問題なければバリデーション解除
        this.validCancell(parentElement);
      });
    });
  }

  // selectのバリデーション
  validateSelectElement(parentElement, eventListeners) {

    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');

    parentElement.querySelector(this.selectElement).addEventListener(eventListeners, (e) => {
      let validActive = false;  // バリデーション発火フラグ
      let checkValidateType;    // バリデーション対象物の確認

      const option = e.target.options[e.target.selectedIndex];

      // 必須項目チェック（required）
      if (hasValidTypes.includes(this.validateRules.typeRequired.type)) {

        if (!option || option.value.trim() === '') {
          checkValidateType = this.validateRules.typeRequired;
          validActive = true;
        }
      }

      // バリデーション発火確認
      if (validActive) {
        this.activeError(parentElement, checkValidateType);
        return;
      }

      // 問題なければバリデーション解除
      this.validCancell(parentElement);
    });
  }

  // fileのバリデーション
  validateFileElement(parentElement, eventListeners) {
    //必要なバリデーションタイプを取得
    const hasValidTypes = parentElement.className.split(' ');

    parentElement.querySelector(this.fileElement).addEventListener(eventListeners, (e) => {
      let validActive = false;  // バリデーション発火フラグ
      let checkValidateType;    // バリデーション対象物の確認

      // mw-wp-form_file要素があればバリデーション解除する
      if (e.target.closest('.c-forms__file').querySelector('.mw-wp-form_file')) {
        this.validCancell(parentElement);
        return;
      }

      // 必須項目チェック（required）、ファイルアップロードチェック
      if (hasValidTypes.includes(this.validateRules.typeRequired.type)) {

        if (!e.target.files || e.target.files.length === 0) {
          checkValidateType = this.validateRules.typeRequired;
          validActive = true;
        }
      }

      // バリデーション発火確認
      if (validActive) {
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

  // 初期値がない場合にflagClassを付与
  validateInitFlag(element) {
    // 各セレクタに対する個別のバリデーション処理
    const textInputs = element.querySelectorAll(this.inputElement);
    const fileInputs = element.querySelectorAll(this.fileElement);
    const checkboxes = element.querySelectorAll(this.checkboxElement);
    const radios = element.querySelectorAll(this.radioElement);
    const selects = element.querySelectorAll(this.selectElement);

    // テキスト入力のバリデーション
    textInputs.forEach(e => {
      if (e.value.trim() === '') {
        element.classList.add(this.flagClass);
      }
    });

    // ファイル入力のバリデーション
    fileInputs.forEach(e => {
      const hidden = element.querySelector('input[type="hidden"]');
      if (e.files.length === 0 && (!hidden || hidden.value.trim() === '')) {
        element.classList.add(this.flagClass);
      }
    });

    // チェックボックス、ラジオボタンのバリデーション（グループ化が必要）
    // 注意: この実装では全てのチェックボックスやラジオボタンが同一グループとして扱われます
    if (checkboxes.length > 0 && !Array.from(checkboxes).some(e => e.checked)) {
      element.classList.add(this.flagClass);
    }
    if (radios.length > 0 && !Array.from(radios).some(e => e.checked)) {
      element.classList.add(this.flagClass);
    }

    // セレクトボックスのバリデーション
    selects.forEach(e => {
      if (e.selectedIndex === -1 || e.value.trim() === '') {
        element.classList.add(this.flagClass);
      }
    });
  }
}

// グローバルスコープにクラスを追加
window.FormValidator = FormValidator;
