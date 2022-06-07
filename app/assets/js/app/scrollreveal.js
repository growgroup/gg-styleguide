import {scrollfire} from "./scrolltrigger";
import anime from "animejs";

export default class ScrollReveal {
    constructor(options) {
        this.options = options;
    }

    reveal(el, options, duration) {
        $(el).css({
            visibility: "visible",
            opacity: 0,
        })
        scrollfire(el, function () {
            // console.log(el);
            var args = {
                targets: el,
                // opacity: 1,
                // translateY: -options.distance,
                // duration: 600
            }
            args = Object.assign(options, args);
            anime(args);
        }, {
            offset: window.innerHeight
        })
    }
}
