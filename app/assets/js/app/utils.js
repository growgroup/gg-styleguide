/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 */

import  $ from "./jquery-shim.js"

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
}





