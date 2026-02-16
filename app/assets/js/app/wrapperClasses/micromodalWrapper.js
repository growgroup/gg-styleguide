import MicroModal from "micromodal";

/**
 * MicromodalWrapper クラスは、MicroModal ライブラリのラッパーとして動作し、
 * カスタムオプションの設定やギャラリー機能のサポートを提供します。
 */
export default class MicromodalWrapper {
  /**
   * @param {Object} options - クラスの初期化オプション
   */
  constructor(options = {}) {
    this.micromodalOptions = this.initializeMicroModalOptions(
      options.micromodal || {}
    );
    this.wrapperOptions = this.initializeWrapperOptions(options.wrapper || {});
    this.galleries = new Map();

    this.initMicroModal();
    this.setupModals();
    this.setupGallery();
  }

  /**
   * MicroModalのオプションを初期化します。
   * @param {Object} userOptions - ユーザーが指定したオプション
   * @returns {Object} 結合されたオプション
   */
  initializeMicroModalOptions(userOptions) {
    const defaultMicroModalOptions = {
      openClass: "is-open",
      disableScroll: true,
      awaitOpenAnimation: true,
      awaitCloseAnimation: true,
      onShow: this.defaultOnShow.bind(this),
      onClose: this.defaultOnClose.bind(this)
    };
    return { ...defaultMicroModalOptions, ...userOptions };
  }

  /**
   * ラッパーオプションを初期化します。
   * @param {Object} userOptions - ユーザーが指定したオプション
   * @returns {Object} 結合されたオプション
   */
  initializeWrapperOptions(userOptions) {
    const defaultWrapperOptions = {
      modalTrigger: ".js-modal",
      defaultModalTitle: "Modal Window",
      galleryLoop: false,
      videoAutoplay: false
    };
    return { ...defaultWrapperOptions, ...userOptions };
  }

  /**
   * モーダルが表示された際に呼び出されるデフォルトのコールバック関数。
   * @param {HTMLElement} modal - 表示されるモーダル要素
   */
  defaultOnShow(modal) {
    document.dispatchEvent(
      new CustomEvent("modalOpened", {
        detail: { modalId: modal.id, trigger: modal.trigger }
      })
    );
  }

  /**
   * モーダルが閉じられた際に呼び出されるデフォルトのコールバック関数。
   * @param {HTMLElement} modal - 閉じられるモーダル要素
   */
  defaultOnClose(modal) {
    document.dispatchEvent(
      new CustomEvent("modalClosed", {
        detail: { modalId: modal.id }
      })
    );
  }

  /**
   * MicroModal ライブラリを初期化します。
   */
  initMicroModal() {
    MicroModal.init(this.micromodalOptions);
  }

  /**
   * モーダル要素を生成し、ページに追加します。
   * @param {string} id - モーダルのID
   * @param {string} content - モーダル内に表示するコンテンツ
   * @param {string} modalTitle - モーダルのタイトル
   * @param {Object} modalOptions - モーダルの表示オプション
   */
  createModalElement(id, content, modalTitle, modalOptions = {}) {
    const modalElement = document.createElement("div");
    modalElement.className = "c-mm";
    modalElement.id = id;
    modalElement.setAttribute("aria-hidden", "true");
    modalElement.innerHTML = this.generateModalHTML(
      id,
      content,
      modalTitle,
      modalOptions
    );
    document.body.appendChild(modalElement);
  }

  /**
   * モーダルのHTMLコンテンツを生成します。
   * @param {string} id - モーダルのID
   * @param {string} content - モーダル内に表示するコンテンツ
   * @param {string} modalTitle - モーダルのタイトル
   * @param {Object} modalOptions - モーダルの表示オプション
   * @returns {string} 生成されたHTML文字列
   */
  generateModalHTML(id, content, modalTitle, modalOptions = {}) {
    const { lightDismiss = true } = modalOptions;
    const overlayCloseAttribute = lightDismiss ? "data-micromodal-close" : "";

    return `
      <div class="c-mm__overlay" tabindex="-1" ${overlayCloseAttribute}>
        <div role="dialog" class="c-mm__container" aria-modal="true" aria-label="${modalTitle}">
          <button class="c-mm__close" aria-label="Close modal" data-micromodal-close></button>
          <div class="c-mm__container-inner" id="${id}-container-inner">
          <div class="c-mm__content" id="${id}-content">
            ${content}
          </div>
        </div>
        </div>
      </div>
    `;
  }

  /**
   * ページ上のモーダルトリガーを設定します。
   */
  setupModals() {
    document
      .querySelectorAll(this.wrapperOptions.modalTrigger)
      .forEach(this.setupModalTrigger.bind(this));
  }

  /**
   * 個々のモーダルトリガーを設定します。
   * @param {HTMLElement} trigger - モーダルトリガー要素
   */
  setupModalTrigger(trigger) {
    const type = trigger.dataset.modalType;
    // hrefかdata-modal-srcを参照
    const href = trigger.getAttribute("href") || trigger.dataset.modalSrc;
    
    if (!href) {
      // href 属性が無い場合は警告を出力して終了
      console.warn(`Modal trigger element has no href attribute:`, trigger);
      return;
    }

    if (type === "gallery") return; // ギャラリータイプの場合はスキップ

    const modalId = `modal-${type}-${Math.random().toString(36).slice(2, 11)}`;
    const modalTitle =
      trigger.dataset.modalTitle || this.wrapperOptions.defaultModalTitle;
    const lightDismiss = this.parseLightDismiss(trigger.dataset.modalLightDismiss);

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      this.createAndShowModal(
        type,
        href,
        modalId,
        trigger,
        modalTitle,
        { lightDismiss }
      );
    });
  }

  parseLightDismiss(value) {
    if (value == null) return true;
    return !["false", "0", "off"].includes(String(value).toLowerCase());
  }

  /**
   * モーダルを生成し、表示します。
   * @param {string} type - モーダルのタイプ（例: image, youtube, etc.）
   * @param {string} href - モーダル内に表示するコンテンツのソース
   * @param {string} modalId - モーダルのID
   * @param {HTMLElement} trigger - モーダルをトリガーする要素
   * @param {string} modalTitle - モーダルのタイトル
   * @param {Object} modalOptions - モーダルの表示オプション
   */
  createAndShowModal(type, href, modalId, trigger, modalTitle, modalOptions = {}) {
    const contentMap = {
      image: () =>
        `<img src="${href}" alt="${trigger?.textContent || ""}" class="c-mm__img">`,
      youtube: () => this.createYouTubeEmbed(href),
      video: () => this.createVideoEmbed(href),
      iframe: () => `<iframe class="c-mm__iframe" src="${href}"></iframe>`,
      content: () => document.querySelector(href)?.innerHTML || ""
    };

    const contentFunction = contentMap[type];
    if (!contentFunction) {
      // 未知のモーダルタイプの場合は警告を出力して終了
      console.warn(`Unknown modal type: ${type}`);
      return;
    }

    const content = contentFunction();
    if (!content) return; // コンテンツが無い場合は終了

    this.createModalElement(modalId, content, modalTitle, modalOptions);
    MicroModal.show(modalId, {
      ...this.micromodalOptions,
      onShow: (modal) => {
        modal.trigger = trigger; // トリガー要素をモーダルオブジェクトに追加
        this.micromodalOptions.onShow(modal);
      }
    });
  }

  /**
   * YouTube の埋め込み用HTMLを生成します。
   * @param {string} href - YouTubeビデオのURL
   * @returns {string} 生成されたHTML文字列
   */
  createYouTubeEmbed(href) {
    const videoId = this.getYouTubeVideoId(href);
    const autoplayParam = this.wrapperOptions.videoAutoplay
      ? "&autoplay=1&amp;mute=1"
      : "";
    return videoId
      ? `<iframe class="c-mm__iframe c-mm__iframe--yt" src="https://www.youtube.com/embed/${videoId}?${autoplayParam}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
      : "";
  }

  /**
   * ビデオ埋め込み用のHTMLを生成します。
   * @param {string} href - ビデオファイルのURL
   * @returns {string} 生成されたHTML文字列
   */
  createVideoEmbed(href) {
    const autoplayAttr = this.wrapperOptions.videoAutoplay
      ? " autoplay muted"
      : "";
    return `<video class="c-mm__video" controls playsinline${autoplayAttr}><source src="${href}" type="video/mp4">Your browser does not support the video tag.</video>`;
  }

  /**
   * YouTubeビデオIDをURLから抽出します。
   * @param {string} url - YouTubeビデオのURL
   * @returns {string|null} 抽出されたビデオIDまたはnull
   */
  getYouTubeVideoId(url) {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    );
    return match ? match[1] : null;
  }

  /**
   * ギャラリーの設定を行います。
   */
  setupGallery() {
    document
      .querySelectorAll(
        `${this.wrapperOptions.modalTrigger}[data-modal-type="gallery"]`
      )
      .forEach(this.setupGalleryItem.bind(this));
  }

  removeExistingModal(modalId) {
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
      existingModal.remove();
    }
  }

  /**
   * ギャラリーアイテムを設定します。
   * @param {HTMLElement} el - ギャラリーアイテム要素
   */
  setupGalleryItem(el) {
    const groupName = el.dataset.modalGroup || "default";
    const href = el.getAttribute("href");
    if (!href) {
      // href 属性が無い場合は警告を出力して終了
      console.warn(`Gallery item has no href attribute:`, el);
      return;
    }

    this.addToGallery(groupName, href, el.getAttribute("alt") || "");

    el.addEventListener("click", (e) => {
      e.preventDefault();
      const index = this.galleries
        .get(groupName)
        .images.findIndex((img) => img.src === href);
      this.showGalleryModal(groupName, index);
    });
  }

  /**
   * ギャラリーにアイテムを追加します。
   * @param {string} groupName - ギャラリーのグループ名
   * @param {string} src - 画像のソースURL
   * @param {string} alt - 画像の代替テキスト
   */
  addToGallery(groupName, src, alt) {
    if (!this.galleries.has(groupName)) {
      this.galleries.set(groupName, { images: [] });
    }
    this.galleries.get(groupName).images.push({ src, alt });
  }

  /**
   * ギャラリーモーダルを表示します。
   * @param {string} groupName - ギャラリーのグループ名
   * @param {number} index - ギャラリー内の画像インデックス
   */
  showGalleryModal(groupName, index) {
    const gallery = this.galleries.get(groupName);
    if (!gallery || !gallery.images.length) {
      // ギャラリーに有効な画像が無い場合はエラーを出力して終了
      console.error(`No valid images found for gallery: ${groupName}`);
      return;
    }

    const modalId = `gallery-modal-${groupName}`;

    // 既存のモーダルがあれば削除
    this.removeExistingModal(modalId);

    const content = this.createGalleryContent(groupName, index);
    this.createModalElement(modalId, content, "Gallery");

    MicroModal.show(modalId, {
      ...this.micromodalOptions,
      onShow: (modal) => {
        this.setupGalleryNavigation(modal.id, groupName);
        this.micromodalOptions.onShow(modal);
      }
    });
  }

  /**
   * ギャラリーコンテンツのHTMLを生成します。
   * @param {string} groupName - ギャラリーのグループ名
   * @param {number} index - ギャラリー内の画像インデックス
   * @returns {string} 生成されたHTML文字列
   */
  createGalleryContent(groupName, index) {
    const gallery = this.galleries.get(groupName);
    if (!gallery || !gallery.images.length) {
      // ギャラリーに有効な画像が無い場合はエラーを出力して終了
      console.error(`No valid images found for gallery: ${groupName}`);
      return "";
    }

    const { images } = gallery;
    const current = images[index];
    const isFirst = index === 0;
    const isLast = index === images.length - 1;

    return `
      <div class="c-mm__gallery-container" data-current-index="${index}">
        <div class="c-mm__gallery-img-wrapper">
          <img src="${current.src}" alt="${
      current.alt || "Image"
    }" class="c-mm__gallery-img">
        </div>
        <div class="c-mm__gallery-nav">
          <button class="c-mm__gallery-btn c-mm__gallery-btn--prev" data-action="prev" ${
      isFirst && !this.wrapperOptions.galleryLoop ? "disabled" : ""
    } aria-label="prev"></button>
          <button class="c-mm__gallery-btn c-mm__gallery-btn--next" data-action="next" ${
      isLast && !this.wrapperOptions.galleryLoop ? "disabled" : ""
    } aria-label="next"></button>
        </div>
      </div>
    `;
  }

  /**
   * ギャラリーナビゲーションの設定を行います。
   * @param {string} modalId - モーダルのID
   * @param {string} groupName - ギャラリーのグループ名
   */
  setupGalleryNavigation(modalId, groupName) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const container = modal.querySelector(".c-mm__gallery-container");
    if (!container) return;

    if (groupName) {
      this.setupSwipeAndDrag(modalId, groupName); // スワイプとドラッグの設定
    }

    container.querySelectorAll(".c-mm__gallery-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const action = button.dataset.action;
        if (action === "next") {
          this.nextSlide(modalId, groupName);
        } else if (action === "prev") {
          this.prevSlide(modalId, groupName);
        }
      });
    });
  }

  /**
   * スワイプとドラッグの設定を行います。
   * @param {string} modalId - モーダルのID
   * @param {string} groupName - ギャラリーのグループ名
   */
  setupSwipeAndDrag(modalId, groupName) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const container = modal.querySelector(".c-mm__gallery-container");
    if (!container) return;

    let startX,
      startY,
      isDragging = false,
      isScrolling = false;

    const startDrag = (e) => {
      startX = this.getPositionX(e);
      startY = this.getPositionY(e);
      isDragging = true;
      isScrolling = false;
    };

    const drag = (e) => {
      if (!isDragging) return;

      const currentX = this.getPositionX(e);
      const currentY = this.getPositionY(e);
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      if (!isScrolling) {
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          e.preventDefault();
          this.handleSwipe(modalId, groupName, diffX);
          isDragging = false;
        } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
          isScrolling = true;
        }
      }
    };

    const endDrag = () => {
      isDragging = false;
      isScrolling = false;
    };

    container.addEventListener("mousedown", startDrag);
    container.addEventListener("touchstart", startDrag, { passive: true });
    container.addEventListener("mousemove", drag);
    container.addEventListener("touchmove", drag, { passive: false });
    container.addEventListener("mouseup", endDrag);
    container.addEventListener("mouseleave", endDrag);
    container.addEventListener("touchend", endDrag);
  }

  /**
   * スワイプ操作を処理します。
   * @param {string} modalId - モーダルのID
   * @param {string} groupName - ギャラリーのグループ名
   * @param {number} diffX - スワイプのX方向の差分
   */
  handleSwipe(modalId, groupName, diffX) {
    const container = document.querySelector(
      `#${modalId} .c-mm__gallery-container`
    );
    const currentIndex = parseInt(container.dataset.currentIndex, 10);
    const gallery = this.galleries.get(groupName);
    const images = gallery.images;

    // 次のスライドへ進む条件
    if (
      diffX > 0 &&
      (this.wrapperOptions.galleryLoop || currentIndex < images.length - 1)
    ) {
      this.nextSlide(modalId, groupName);
    }
    // 前のスライドへ戻る条件
    else if (
      diffX < 0 &&
      (this.wrapperOptions.galleryLoop || currentIndex > 0)
    ) {
      this.prevSlide(modalId, groupName);
    }
  }

  /**
   * X座標を取得します。
   * @param {Event} e - マウスまたはタッチイベント
   * @returns {number} X座標
   */
  getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }

  /**
   * Y座標を取得します。
   * @param {Event} e - マウスまたはタッチイベント
   * @returns {number} Y座標
   */
  getPositionY(e) {
    return e.type.includes("mouse") ? e.pageY : e.touches[0].clientY;
  }

  /**
   * 次のスライドを表示します。
   * @param {string} modalId - モーダルのID
   * @param {string} groupName - ギャラリーのグループ名
   */
  nextSlide(modalId, groupName) {
    this.changeSlide(modalId, groupName, 1);
  }

  /**
   * 前のスライドを表示します。
   * @param {string} modalId - モーダルのID
   * @param {string} groupName - ギャラリーのグループ名
   */
  prevSlide(modalId, groupName) {
    this.changeSlide(modalId, groupName, -1);
  }

  /**
   * スライドを変更します。
   * @param {string} modalId - モーダルのID
   * @param {string} groupName - ギャラリーのグループ名
   * @param {number} direction - 変更する方向（1 = 次, -1 = 前）
   */
  changeSlide(modalId, groupName, direction) {
    const container = document.querySelector(
      `#${modalId} .c-mm__gallery-container`
    );
    const currentIndex = parseInt(container.dataset.currentIndex, 10);
    const gallery = this.galleries.get(groupName);
    const images = gallery.images;
    const newIndex = (currentIndex + direction + images.length) % images.length;
    this.updateGallery(modalId, groupName, newIndex);
  }

  /**
   * ギャラリー表示を更新します。
   * @param {string} modalId - モーダルのID
   * @param {string} groupName - ギャラリーのグループ名
   * @param {number} index - 更新する画像のインデックス
   */
  updateGallery(modalId, groupName, index) {
    const container = document.querySelector(
      `#${modalId} .c-mm__gallery-container`
    );
    if (!container) return;

    const gallery = this.galleries.get(groupName);
    const images = gallery.images;
    if (!images || index < 0 || index >= images.length) return;

    const currentImage = images[index];
    const imgElement = container.querySelector(".c-mm__gallery-img");
    if (imgElement) {
      imgElement.src = currentImage.src;
      imgElement.alt = currentImage.alt || "";
    }

    container.dataset.currentIndex = index;

    this.updateNavigationButtons(container, index, images.length);
  }

  /**
   * ギャラリーナビゲーションボタンを更新します。
   * @param {HTMLElement} container - ギャラリーコンテナ要素
   * @param {number} index - 現在の画像インデックス
   * @param {number} totalImages - ギャラリー内の画像総数
   */
  updateNavigationButtons(container, index, totalImages) {
    const prevButton = container.querySelector(".c-mm__gallery-btn--prev");
    const nextButton = container.querySelector(".c-mm__gallery-btn--next");

    if (prevButton) {
      // 最初の画像でループが無効の場合、前のボタンを無効にする
      prevButton.disabled = !this.wrapperOptions.galleryLoop && index === 0;
    }
    if (nextButton) {
      // 最後の画像でループが無効の場合、次のボタンを無効にする
      nextButton.disabled =
        !this.wrapperOptions.galleryLoop && index === totalImages - 1;
    }
  }
}
