import {scrollfire} from "./scrolltrigger";
import anime from "animejs";

class ScrollReveal {
  constructor(options){
    this.options = options;
  }

  reveal(el, options, duration){
    $(el).css({
      visibility: "visible",
      opacity: 0,
    })
    scrollfire( el, function(){
      // console.log(el);
      var args = {
        targets: el,
        // opacity: 1,
        // translateY: -options.distance,
        // duration: 600
      }
      args = Object.assign(options,args);
      anime(args);
    }, {
      offset: window.innerHeight
    })
  }
}

//- スクロールリーバル
function reveal() {
  function domEach(items, callback) {
    if (typeof items === "string") {
      var items = $(items);
    }
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      // callback = callback.bind(item)
      callback(i, item);
    }
  }
  window.sr = new ScrollReveal({duration: 600, mobile: true});
  var baseEasing = 'cubicBezier(0.175, 0.885, 0.32, 1.275)';
  var baseDistance = '8';

  sr.reveal(".c-main-visual,.l-page-header", {
    duration: 1400,
    opacity: 1,
    //translateY: -baseDistance,
    delay: 900,
  }, 100);

  sr.reveal(".c-solution__wrap  > *",{
    scale: [0.9, 1],
    opacity: 1,
    duration: 600,
    delay: anime.stagger(100),
    translateX: [-baseDistance,0],
    easing: baseEasing
  });
  domEach(".c-card-sm__block", function(key, item){

    sr.reveal(item,{
      scale: {
        value: [0.9,1],
        // easing: "linear"
      },
      opacity: 1,
      duration: 600,
      delay: 100*key,
      translateY: [-baseDistance,0],
      easing: baseEasing
    } );
  });
}

// export default ScrollReveal;
