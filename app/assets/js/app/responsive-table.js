/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 *
 * # example:
 * <table class="c-table js-table">
 *     <tbody>
 *         <tr>
 *             <th>
 *                 title
 *             </th>
 *             <td>
 *                 content
 *             </td>
 *         </tr>
 *     </tbody>
 * </table>
 *
 */


var defaultOptions = {
    selector: ".js-table,.tablepress"
}


export default class ResponsiveTable {

    constructor(options) {
        this.options = $.extend(defaultOptions, options);
        this.init();
    }


    /**
     * 初期化
     */
    init() {
        this.tables = $(this.options.selector);
        this.run();
    }

    /**
     * 実行
     */
    run() {

        for (var i = 0; i < this.tables.length; i++) {
            var wrapper = $('<div class="js-responsive-table"></div>');
            var wrapperSecond = $('<div class="js-responsive-table-wrapper"></div>');
            var table = this.tables[i];

            wrapperSecond.append($(table).clone());
            wrapper.append(wrapperSecond);
            $(table).after(wrapper);
            $(table).remove();
        }

        i < 9 ? "0" + (i + 1) : i + 1

        var tables = document.querySelectorAll(".js-responsive-table");


        for (var i = 0; i < tables.length; i++) {
          var tableWrapper = tables[i].querySelector(".js-responsive-table-wrapper");
          const table = tables[i];
          tableWrapper.addEventListener("scroll", function (e) {
            var scrollWidth = e.target.scrollLeft;
            if (scrollWidth > 20) {
              table.classList.add("is-scrollable");
            }
            if (scrollWidth === 0) {
              table.classList.remove("is-scrollable");
            }
            if (scrollWidth >= (e.target.scrollWidth - e.target.offsetWidth - 20)) {
              table.classList.add("is-unscrollable");
            }
            if (scrollWidth <= (e.target.scrollWidth - e.target.offsetWidth - 20)) {
              table.classList.remove("is-unscrollable");
            }
          })
        }

    }
}
