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
import  $ from "./jquery-shim.js"


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
            var table = this.tables[i];
            wrapper.append($(table).clone());
            $(table).after(wrapper);
            $(table).remove();
        }
    }
}
