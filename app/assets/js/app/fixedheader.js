/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 *
 * # example:
 * <header class="l-header js-fixedheader">
 *     Content
 * </header>
 *
 */
import  $ from "./jquery-shim.js"

var defaultOptions = {
    selector: '.js-fixedheader', // 実行するセレクタ
    offset: 500, // 実行するオフセットピクセル数,
    cssClass: ".l-global-navigation", // CSSが定義されているクラス
    activeClass: "is-fixed", // 有効な時に付与するクラス
    mobile: false // モバイル時にどう動作するか
}

export default class Fixedheader {

    constructor(options){
        this.options = $.extend(defaultOptions, options);
        this.init();
    }

    /**
     * 初期化する
     */
    init() {
        this.target = $(this.options.selector);

        this.isFixed = this.isFixed.bind(this);
        this.run = this.run.bind(this);
        if (
            ( screen.width > 768 && this.options.mobile )
            || this.options.mobile === false
        ) {
            window.requestAnimationFrame(this.run);
        }
    }


    /**
     * 実行
     */
    run() {
        if (this.isFixed()) {
            this.target.addClass(this.options.activeClass);
        } else {
            this.target.removeClass(this.options.activeClass);
        }

        window.requestAnimationFrame(this.run);
    }

    /**
     * 判断する
     * @returns {boolean}
     */
    isFixed() {
        // オフセットより高いか判断する
        return ( window.pageYOffset > this.options.offset ) ? true : false;
    }

}
