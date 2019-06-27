class ScrollDOM {

  constructor(element, callback, options) {
    if (typeof element === 'string') {
      element = document.querySelectorAll(element);
    }

    this.el = element;

    this.options = Object.assign({
      offset: 300,
      interval: 0,
      initialize: null
    }, options);

    this.interval = 0;
    this.isFired = false;
    this.domRect = null;
    this.callback = callback;
    this.range = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };

    this.setRange = this.setRange.bind(this);
    this.inRange = this.inRange.bind(this);
    this.watch = this.watch.bind(this);
    this.start = this.start.bind(this);
    this.toggleFired = this.toggleFired.bind(this);

    this.init();
  }

  init() {
    this.setRange();
    this.polyfill();
    if (this.options.initialize) {
      this.options.initialize(this.el);
    }
  }

  refresh(){
    this.setRange();
  }

  start() {
    this.watch();
  }

  setInterval(interval) {
    this.interval = interval;
  }

  getInterval(interval) {
    return this.interval;
  }

  setRange() {
    this.domRect = this.el.getBoundingClientRect();
    this.range = {
      top: this.domRect.top,
      bottom: this.domRect.top + this.domRect.height,
      left: this.domRect.left,
      right: this.domRect.right
    };
  }

  polyfill() {
    if (typeof Object.assign != 'function') {
      Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) {
          'use strict';
          if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
          }
          var to = Object(target);
          for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
              for (var nextKey in nextSource) {
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
          }
          return to;
        },
        writable: true,
        configurable: true
      });
    }
  }

  watch() {
    this.trigger();
    if (this.isFired === false) {
      window.requestAnimationFrame(this.watch);
    }

  }

  trigger() {
    if (this.inRange()) {
      if (typeof this.callback === 'function') {
        this.callback(this.el, this.getInterval());
        this.isFired = true;
      }
    }
  }

  toggleFired() {
    this.isFired = !this.isFired;
  }

  inRange() {
    return (window.pageYOffset > ((this.range.top - 0) - (this.options.offset - 0)));
  }
}


export default class ScrollTrigger {
  constructor(element, callback, options) {
    this.collections = [];
    if (typeof element === 'string') {
      this.elements = document.querySelectorAll(element);
    } else if (typeof element === 'object') {
      this.elements = element;
    }
    if (this.elements.length >= 1) {
      for (var i = 0; i < this.elements.length; i++) {
        var _scrolldom = new ScrollDOM(this.elements[i], callback, options);
        _scrolldom.setInterval(i);
        this.collections.push(_scrolldom);
      }
    }
    this.start = this.start.bind(this);
  }

  start() {
    for (let i = 0; i < this.collections.length; i++) {
      this.collections[i].start();
    }
  }
}

export const scrollfire = function(element, callback, options) {
  var st = new ScrollTrigger(element, callback, options);
  st.start();
}
