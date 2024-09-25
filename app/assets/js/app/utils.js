/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 */


const toString = Object.prototype.toString;
const nativeIsArray = Array.isArray;
const nativeKeys = Object.keys;
const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;


export default class Utils {


    constructor() {
        $.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], (key, name)=> {
            this['is' + name] = function (obj) {
                return toString.call(obj) === '[object ' + name + ']';
            };
        });
    }

    /**
     * 単位を変換
     * @param i
     * @param units
     */
    unit(i, units) {
        if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
            return i;
        } else {
            return "" + i + units;
        }
    }

    /**
     *
     * 配列かどうか
     * @param collection
     * @returns {boolean}
     */
    isArrayLike(collection) {
        var length = collection.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    }

    /**
     * オブジェクトかどうか
     * @param obj
     * @returns {boolean}
     */
    isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }

    /**
     * 配列か判別
     * @type {*|Function}
     */
    isArray(obj) {
        return nativeIsArray || function (obj) {
                return toString.call(obj) === '[object Array]';
            }
    }

    keys(obj) {
        if (!this.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if ($.inArray(obj, key)) keys.push(key);
        return keys;
    }

    /**
     * オブジェクトが空かどうか判断
     * @param obj
     * @returns {boolean}
     */

    isEmpty(obj) {
        if (obj == null) return true;
        if (this.isArrayLike(obj) && (this.isArray(obj) || this.isString(obj) || this.isArguments(obj))) return obj.length === 0;
        return this.keys(obj).length === 0;
    }

    isMobile() {
        var ua = navigator.userAgent;

        if (screen.width < 768) {
            return true;
        }

        var isMobile = {
            Android: function () {
                return ua.match(/Android/i);
            },
            BlackBerry: function () {
                return ua.match(/BlackBerry/i);
            },
            iPhone: function () {
                return ua.match(/iPhone/i);
            },
            Opera: function () {
                return ua.match(/Opera Mini/i);
            },
            Windows: function () {
                return ua.match(/IEMobile/i);
            },
            any: function () {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iPhone() || isMobile.Opera() || isMobile.Windows());
            }
        }

        if (!this.isEmpty(isMobile.any())) {
            return true;
        }

        return false;
    }


    /**
     * クエリをパース
     * @param string
     * @returns {{}}
     */
    parseQueryString(string) {

        var parsed = {};
        string = (string !== undefined) ? string : window.location.search;

        if (typeof string === "string" && string.length > 0) {
            if (string[0] === '?') {
                string = string.substring(1);
            }

            string = string.split('&');

            for (var i = 0, length = string.length; i < length; i++) {
                var element = string[i],
                    eqPos = element.indexOf('='),
                    keyValue, elValue;

                if (eqPos >= 0) {
                    keyValue = element.substr(0, eqPos);
                    elValue = element.substr(eqPos + 1);
                }
                else {
                    keyValue = element;
                    elValue = '';
                }

                elValue = decodeURIComponent(elValue);

                if (parsed[keyValue] === undefined) {
                    parsed[keyValue] = elValue;
                }
                else if (parsed[keyValue] instanceof Array) {
                    parsed[keyValue].push(elValue);
                }
                else {
                    parsed[keyValue] = [parsed[keyValue], elValue];
                }
            }
        }

        return parsed;
    }


    /**
     * クエリを指定したキーから取得する
     * @param key
     * @param string
     * @returns {boolean}
     */
    getQueryString(key, string) {
        var string = (string !== undefined) ? string : window.location.search;
        var queries = this.parseQueryString();
        var match = false;
        $.each(queries, function (qkey, value) {
            if (key === qkey) {
                match = value;
                return false;
            }
        });
        return match;
    }


    requestAnimationFrame() {
        var requestAnimFrame = window.requestAnimationFrame;

        var lastTime = Date.now();

        if (this.isMobile() || !requestAnimFrame) {
            requestAnimFrame = function (callback) {
                var deltaTime = Date.now() - lastTime;
                var delay = Math.max(0, 1000 / 60 - deltaTime);

                return window.setTimeout(function () {
                    lastTime = Date.now();
                    callback();
                }, delay);
            };
        }
        return requestAnimFrame;
    }


  debounce(func) {
    var timer;
    return function (event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, 300, event);
    };
  }

  /**
   * matchMediaを使ったレスポンシブ対応を便利にする
   *
   * @param {Function} onMatch - The function to execute when the media query matches.
   * @param {Function} onUnMatch - The function to execute when the media query does not match.
   * @param {string} [media='max-width: 46.8125em'] - The media query to evaluate.
   */
  responsiveMatch = (onMatch, onUnMatch, media = 'max-width: 46.8125em') => {
    //第3引数に入れたメディアクエリもしくは750pxのところでMediaQueryList作成
    const mql = window.matchMedia('(' + media + ')');

    //MediaQueryListにマッチした時の動作、しなかった時の動作を引数から受け取る
    function mediaChange(e) {
      if (e.matches) {
        onMatch();
      } else {
        onUnMatch();
      }
    }

    //MediaQueryListのChangeイベント時に発火させる
    mql.addEventListener("change", mediaChange);
    //ページ読み込み時にも発火させる
    mediaChange(mql);
  }

  //


  /**
   * カスタムspringイージング関数
   * Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js
   * @param {number} stiffness - The stiffness coefficient of the spring.
   * @param {number} damping - The damping coefficient of the spring.
   * @param {number} mass - The mass attached to the spring.
   * @param {number} [velocity=0] - The initial velocity of the mass.
   * @return {function(number): number} A function that takes time (t) as an argument and returns the displacement at that time.
   */
  customSpring(stiffness, damping, mass, velocity = 0) {
    return function (t) {

      // 減衰比（ζ）を計算
      const zeta = damping / (2 * Math.sqrt(stiffness * mass));

      // 自然角振動数（ω）を計算
      const omega = Math.sqrt(stiffness / mass);

      // 初期変位を計算
      const initialDisplacement = velocity / omega;

      // 減衰比が1未満の場合（減衰振動）
      if (zeta < 1) {
        // 減衰角振動数（ωd）を計算
        const omega_d = omega * Math.sqrt(1 - zeta * zeta);

        // 減衰振動の方程式を使用して変位を計算
        return 1 - (Math.exp(-zeta * omega * t) *
          (initialDisplacement * omega * Math.sin(omega_d * t) / omega_d +
            Math.cos(omega_d * t)));
      } else {
        // 減衰比が1以上の場合（過減衰）
        // 過減衰の方程式を使用して変位を計算
        const alpha = omega * Math.sqrt(zeta * zeta - 1);
        return 1 - (Math.exp(-zeta * omega * t) *
          (initialDisplacement * omega * Math.sinh(alpha * t) / alpha +
            Math.cosh(alpha * t)));
      }
    };
  }
}





