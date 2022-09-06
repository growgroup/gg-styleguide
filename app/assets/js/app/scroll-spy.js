/**
 * ScrollSpy用クラス
 * 
 * example: 
 * 
 * <div class="js-scrollspy-nav">
 *   <ul>
 *      <li><a href="#one">one</a></li>
 *      <li><a href="#two">two</a></li>
 *      <li><a href="#three">three</a></li>
 *   </ul>
 * </div>
 * 
 * <div id="one" class="js-scrollspy-section"></div>
 * <div id="two" class="js-scrollspy-section"></div>
 * <div id="three" class="js-scrollspy-section"></div>
 */

export default class ScrollSpy {

    constructor() {
        this.lastScrollTop = 0;
        this.currentScrollTop = 0;

        this.options = {
            root: null, // 今回はビューポートをルート要素とする
            rootMargin: "-50% 0px", // ビューポートの中心を判定基準にする
            threshold: 0, // 閾値は0
            paneSelector: ".js-scrollspy-pane",
            navWrapSelector: ".js-scrollspy-nav",
            navScollWrapSelector: ".js-scrollspy-nav-wrap",
            navActiveClassName: "is-active",
        };
        const targets = document.querySelectorAll(this.options.paneSelector);

        this.doWhenIntersect = this.doWhenIntersect.bind(this);
        this.getOption = this.getOption.bind(this);
        if (targets.length <= 0) return;


        const observer = new IntersectionObserver(this.doWhenIntersect, this.options);
        // それぞれのboxを監視する
        for (let i = 0; i < targets.length; i++) {
            observer.observe(targets[i]);
        }
    }

    getOption(key, _def = false) {
        return (typeof "undefined" !== this.options[key]) ? this.options[key] : _def;
    }


    /**
     * 交差したときに呼び出す関数
     * @param entries
     */
    doWhenIntersect(entries) {
        // 交差検知をしたもののなかで、isIntersectingがtrueのDOMを色を変える関数に渡す
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                this.activateIndex(entries[i].target);
            }
        }
    }

    /**
     * 目次の色を変える関数
     * @param element
     */
    activateIndex(element) {
        const navSelector = this.getOption("navWrapSelector");
        const navScollWrapSelector = this.getOption("navScollWrapSelector");
        const currentActiveIndex = document.querySelector(`${navSelector} li a.is-active`);
        if (currentActiveIndex !== null) {
            currentActiveIndex.classList.remove("is-active");
            this.currentScrollTop = window.pageYOffset + document.querySelector(navSelector).getBoundingClientRect().top;
            if (this.currentScrollTop > this.lastScrollTop) {
                this.lastScrollTop = this.currentScrollTop;
                const prevEleWidth = currentActiveIndex.offsetWidth;
                document.querySelector(`${navSelector} ${navScollWrapSelector}`).scrollLeft += prevEleWidth;
            } else {
                this.lastScrollTop = this.currentScrollTop;
                const currentNode = document.querySelector(`${navSelector} a[href='#${element.id}']`);
                if (currentNode && currentNode.parentElement.previousElementSibling) {
                    let prevSibling = currentNode.parentElement.previousElementSibling.offsetWidth;
                    document.querySelector(`${navSelector} ${navScollWrapSelector}`).scrollLeft -= prevSibling;
                } else {
                    if (currentNode) {
                        document.querySelector(`${navSelector} ${navScollWrapSelector}`).scrollLeft = 0;
                    }
                }
            }
        }

        // 引数で渡されたDOMが飛び先のaタグを選択し、activeクラスを付与
        const newActiveIndex = document.querySelector(`${navSelector} a[href='#${element.id}']`);
        if (newActiveIndex) {
            newActiveIndex.classList.add(this.getOption("navActiveClassName"));
        }
    }

}
}
