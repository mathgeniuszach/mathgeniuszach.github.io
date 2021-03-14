(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.asty    = require("asty")
window.pegutil = require("pegjs-util")
},{"asty":2,"pegjs-util":3}],2:[function(require,module,exports){
(function (global){(function (){
/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ASTY = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var ASTYBase=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"init",value:function(e,t,n,r){if(arguments.length<2)throw new Error("init: invalid number of arguments");if(this.ctx=e,this.ASTy=!0,this.T=t,this.L={L:0,C:0,O:0},this.A={},this.C=[],this.P=null,"object"===_typeof(n))for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&this.set(i,n[i]);return"object"===_typeof(r)&&r instanceof Array&&this.add(r),this}},{key:"create",value:function(e,t,n){return this.ctx.create(e,t,n)}},{key:"type",value:function(e){if(0===arguments.length)return this.T;if(1===arguments.length)return this.T=e,this;throw new Error("type: invalid number of arguments")}},{key:"pos",value:function(e,t,n){if(0===arguments.length)return{line:this.L.L,column:this.L.C,offset:this.L.O};if(arguments.length<=3)return this.L.L=e||0,this.L.C=t||0,this.L.O=n||0,this;throw new Error("pos: invalid number of arguments")}},{key:"set",value:function(){for(var e=this,t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];if(1===n.length&&"object"===_typeof(n[0]))Object.keys(n[0]).forEach(function(t){void 0!==n[0][t]?e.A[t]=n[0][t]:delete e.A[t]});else{if(2!==n.length)throw new Error("set: invalid number of arguments");void 0!==n[1]?this.A[n[0]]=n[1]:delete this.A[n[0]]}return this}},{key:"unset",value:function(){for(var e=this,t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];if(1===n.length&&"object"===_typeof(n[0])&&n[0]instanceof Array)n[0].forEach(function(t){delete e.A[t]});else{if(1!==n.length)throw new Error("unset: invalid number of arguments");delete this.A[n[0]]}return this}},{key:"get",value:function(){for(var e=this,t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];if(1!==n.length)throw new Error("get: invalid number of arguments");if("object"===_typeof(n[0])&&n[0]instanceof Array)return n[0].map(function(t){if("string"!=typeof t)throw new Error("get: invalid key argument");return e.A[t]});var i=n[0];if("string"!=typeof i)throw new Error("get: invalid key argument");return this.A[i]}},{key:"attrs",value:function(){return Object.keys(this.A)}},{key:"nth",value:function(){if(null===this.P)return 1;var e=this.P.C.indexOf(this);if(e<0)throw new Error("nth: internal error -- node not in childs of its parent");return e}},{key:"ins",value:function(e){for(var t=this,n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];if(0===r.length)throw new Error("ins: invalid number of arguments");if(e<0&&(e=this.C.length+1-e),!(e>=0&&e<=this.C.length))throw new Error("ins: invalid position");var o=function(n){if(!t.ctx.isA(n))throw new Error("ins: invalid AST node argument");t.C.splice(e++,0,n),n.P=t};return r.forEach(function(e){"object"===_typeof(e)&&e instanceof Array?e.forEach(function(e){o(e)}):null!==e&&o(e)}),this}},{key:"add",value:function(){for(var e=this,t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];if(0===n.length)throw new Error("add: invalid number of arguments");var i=function(t){if(!e.ctx.isA(t))throw new Error("add: invalid AST node argument");e.C.push(t),t.P=e};return n.forEach(function(e){"object"===_typeof(e)&&e instanceof Array?e.forEach(function(e){i(e)}):null!==e&&i(e)}),this}},{key:"del",value:function(){for(var e=this,t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];if(0===n.length)throw new Error("del: invalid number of arguments");return n.forEach(function(t){if(!e.ctx.isA(t))throw new Error("del: invalid AST node argument");for(var n=!1,r=0;r<e.C.length;r++)if(e.C[r]===t){e.C.splice(r,1),t.P=null,n=!0;break}if(!n)throw new Error("del: AST node not found in childs")}),this}},{key:"childs",value:function(){if(arguments.length>2)throw new Error("childs: invalid number of arguments");if(2===arguments.length&&"number"==typeof(arguments.length<=0?void 0:arguments[0])&&"number"==typeof(arguments.length<=1?void 0:arguments[1]))return this.C.slice(arguments.length<=0?void 0:arguments[0],arguments.length<=1?void 0:arguments[1]);if(1===arguments.length&&"number"==typeof(arguments.length<=0?void 0:arguments[0]))return this.C.slice(arguments.length<=0?void 0:arguments[0]);if(0===arguments.length)return this.C;throw new Error("childs: invalid type of arguments")}},{key:"child",value:function(e){if("number"!=typeof e)throw new Error("child: invalid argument");return e<this.C.length?this.C[e]:null}},{key:"parent",value:function(){return this.P}},{key:"serialize",value:function(){return this.ctx.__serialize(this)}}]),e}();exports.default=ASTYBase;
},{}],2:[function(_dereq_,module,exports){
"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var tree={mid:{unicode:String.fromCharCode(9500),ascii:"+"},last:{unicode:String.fromCharCode(9492),ascii:"+"},down:{unicode:String.fromCharCode(9474),ascii:"|"},left:{unicode:String.fromCharCode(9472),ascii:"-"}},ASTYDump=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"dump",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1/0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(e,t){return t},n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r="",o=this;return this.walk(function(c,a){if(!(a>e)){if(a>0){var i=function(e){var t=0,n=0;return null!==e.P&&(t=e.P.C.indexOf(e),n=e.P.C.length-1),{nth:t,max:n}},u=i(c),l=u.nth,f=u.max,s=" ";s=n?"".concat(tree.left.unicode).concat(tree.left.unicode).concat(s):"".concat(tree.left.ascii).concat(tree.left.ascii).concat(s),s=l<f?"".concat(n?tree.mid.unicode:tree.mid.ascii).concat(s):"".concat(n?tree.last.unicode:tree.last.ascii).concat(s);for(var p=c.P;null!==p&&p!==o;p=p.P)if(null!==p.P){var d=i(p);s=d.nth<d.max?"".concat(n?tree.down.unicode:tree.down.ascii,"   ").concat(s):"    ".concat(s)}r+=t("tree",s)}r+=t("type",c.T)+" ";var g=Object.keys(c.A).filter(function(e){return!e.match(/^__/)});if(g.length>0){r+=t("parenthesis","(");var m=!0;g.forEach(function(e){m?m=!1:r+=t("comma",",")+" ",r+=t("key",e)+t("colon",":")+" ";var n=c.A[e];switch(_typeof(n)){case"boolean":case"number":r+=t("value",n.toString());break;case"string":var o=function(e){return e.charCodeAt(0).toString(16).toUpperCase()};r+=t("value",'"'+n.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\x08/g,"\\b").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\f/g,"\\f").replace(/\r/g,"\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g,function(e){return"\\x0"+o(e)}).replace(/[\x10-\x1F\x80-\xFF]/g,function(e){return"\\x"+o(e)}).replace(/[\u0100-\u0FFF]/g,function(e){return"\\u0"+o(e)}).replace(/[\u1000-\uFFFF]/g,function(e){return"\\u"+o(e)})+'"');break;case"object":n instanceof RegExp?r+=t("value","/"+n.source+"/"):r+=t("value",JSON.stringify(n));break;default:r+=t("value",JSON.stringify(n))}}),r+=t("parenthesis",")")+" "}r+=t("position",t("bracket","[")+t("line",c.L.L)+t("slash",",")+t("column",c.L.C)+t("bracket","]")),r+="\n"}},"downward"),r}}]),e}();exports.default=ASTYDump;
},{}],3:[function(_dereq_,module,exports){
"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var ASTYMerge=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"merge",value:function(e){var r=this,t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(null===e)return this;if(!this.ctx.isA(e))throw new Error("merge: invalid AST node argument");if(t){var i=e.pos();this.pos(i.line,i.column,i.offset)}e.attrs().forEach(function(t){var i=void 0!==n[t]?n[t]:t;null!==i&&r.set(i,e.get(t))}),e.childs().forEach(function(t){e.del(t),r.add(t)});var o=e.parent();return null!==o&&o.del(e),this}}]),e}();exports.default=ASTYMerge;
},{}],4:[function(_dereq_,module,exports){
"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var ASTYSerialize=function(){function e(){_classCallCheck(this,e)}return _createClass(e,null,[{key:"serialize",value:function(e,t){if(!e.isA(t))throw new Error("serialize: not an ASTy node");return JSON.stringify({ASTy:function e(t){var r={T:t.T,L:{L:t.L.L,C:t.L.C,O:t.L.O}},n=Object.keys(t.A);return n.length>0&&(r.A={},n.forEach(function(e){var n=t.A[e];switch(_typeof(n)){case"boolean":case"number":case"string":r.A[e]=n;break;default:r.A[e]=JSON.parse(JSON.stringify(n))}})),t.C.length>0&&(r.C=t.C.map(function(t){return e(t)})),r}(t)})}},{key:"unserialize",value:function(e,t){var r=JSON.parse(t);if("object"!==_typeof(r)||"object"!==_typeof(r.ASTy))throw new Error("unserialize: not an ASTy JSON export");return function t(r){var n=e.create(r.T);return n.pos(r.L.L,r.L.C,r.L.O),"object"===_typeof(r.A)&&Object.keys(r.A).forEach(function(e){var t=r.A[e];switch(_typeof(t)){case"boolean":case"number":case"string":n.set(e,t);break;default:n.set(e,JSON.parse(JSON.stringify(t)))}}),"object"===_typeof(r.C)&&r.C instanceof Array&&n.add(r.C.map(function(e){return t(e)})),n}(r.ASTy)}}]),e}();exports.default=ASTYSerialize;
},{}],5:[function(_dereq_,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var version={major:1,minor:8,micro:14,date:20210107},_default=version;exports.default=_default;
},{}],6:[function(_dereq_,module,exports){
"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,r){for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function _createClass(e,r,n){return r&&_defineProperties(e.prototype,r),n&&_defineProperties(e,n),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var ASTYWalk=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"walk",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"downward";return function n(t,a,o){"downward"!==r&&"both"!==r||e(t,a,o,"downward"),t.C.forEach(function(e){n(e,a+1,t)}),"upward"!==r&&"both"!==r||e(t,a,o,"upward")}(this,0,null),this}}]),e}();exports.default=ASTYWalk;
},{}],7:[function(_dereq_,module,exports){
"use strict";var _astyBase=_interopRequireDefault(_dereq_("./asty-base.js")),_astyMerge=_interopRequireDefault(_dereq_("./asty-merge.js")),_astyWalk=_interopRequireDefault(_dereq_("./asty-walk.js")),_astyDump=_interopRequireDefault(_dereq_("./asty-dump.js")),_astySerialize=_interopRequireDefault(_dereq_("./asty-serialize.js")),_astyVersion=_interopRequireDefault(_dereq_("./asty-version.js"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}var ASTYCtx=function(){function e(){var t=this;return _classCallCheck(this,e),this.ASTYNode=function e(){_classCallCheck(this,e)},[[_astyBase.default,"init","create","type","pos","set","unset","get","attrs","nth","ins","add","del","childs","child","parent","serialize"],[_astyMerge.default,"merge"],[_astyWalk.default,"walk"],[_astyDump.default,"dump"]].forEach(function(e){var r=e[0].prototype;e.slice(1).forEach(function(e){t.ASTYNode.prototype[e]=r[e]})}),this}return _createClass(e,[{key:"version",value:function(){return _astyVersion.default}},{key:"extend",value:function(e){for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(this.ASTYNode.prototype[t]=e[t]);return this}},{key:"create",value:function(e,t,r){return(new this.ASTYNode).init(this,e,t,r)}},{key:"isA",value:function(e){return"object"===_typeof(e)&&e instanceof this.ASTYNode&&"boolean"==typeof e.ASTy&&!0===e.ASTy}},{key:"__serialize",value:function(t){return e.serialize(t)}}],[{key:"serialize",value:function(e){return _astySerialize.default.serialize(e.ctx,e)}},{key:"unserialize",value:function(e){return _astySerialize.default.unserialize(new this,e)}}]),e}();module.exports=ASTYCtx;
},{"./asty-base.js":1,"./asty-dump.js":2,"./asty-merge.js":3,"./asty-serialize.js":4,"./asty-version.js":5,"./asty-walk.js":6}]},{},[1,2,3,4,5,6,7])(7)
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){(function (){
/*
**  pegjs-util -- Utility Class for PEG.js
**  Copyright (c) 2014-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  Universal Module Definition (UMD) for Library  */
(function (root, name, factory) {
    /* global define: false */
    /* global module: false */
    if (typeof module === "object" && typeof module.exports === "object")
        /*  CommonJS environment  */
        module.exports = factory(root);
    else if (typeof define === "function" && typeof define.amd !== "undefined")
        /*  AMD environment  */
        define(name, function () { return factory(root); });
    else
        /*  Browser environment  */
        root[name] = factory(root);
}(/* global global: false */
  (typeof global !== "undefined" ? global :
  /* global window: false */
  (typeof window !== "undefined" ? window : this)), "PEGUtil", function (/* root */) {

    var PEGUtil = {};

    /*  helper function for generating a function to generate an AST node  */
    PEGUtil.makeAST = function makeAST (location, options) {
        return function () {
            return options.util.__makeAST.call(
                null,
                location().start.line,
                location().start.column,
                location().start.offset,
                arguments
            );
        };
    };

    /*  helper function for generating a function to unroll the parse stack  */
    PEGUtil.makeUnroll = function (location, options) {
        return function (first, list, take) {
            if (   typeof list !== "object"
                || !(list instanceof Array))
                throw new options.util.__SyntaxError("unroll: invalid list argument for unrolling",
                    (typeof list), "Array", location());
            if (typeof take !== "undefined") {
                if (typeof take === "number")
                    take = [ take ];
                var result = [];
                if (first !== null)
                    result.push(first);
                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < take.length; j++)
                        result.push(list[i][take[j]]);
                }
                return result;
            }
            else {
                if (first !== null)
                    list.unshift(first);
                return list;
            }
        };
    };

    /*  utility function: create a source excerpt  */
    var excerpt = function (txt, o) {
        var l = txt.length;
        var b = o - 20; if (b < 0) b = 0;
        var e = o + 20; if (e > l) e = l;
        var hex = function (ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
        };
        var extract = function (txt, pos, len) {
            return txt.substr(pos, len)
                .replace(/\\/g,   "\\\\")
                .replace(/\x08/g, "\\b")
                .replace(/\t/g,   "\\t")
                .replace(/\n/g,   "\\n")
                .replace(/\f/g,   "\\f")
                .replace(/\r/g,   "\\r")
                .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return "\\x0" + hex(ch); })
                .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return "\\x"  + hex(ch); })
                .replace(/[\u0100-\u0FFF]/g,         function(ch) { return "\\u0" + hex(ch); })
                .replace(/[\u1000-\uFFFF]/g,         function(ch) { return "\\u"  + hex(ch); });
        };
        return {
            prolog: extract(txt, b, o - b),
            token:  extract(txt, o, 1),
            epilog: extract(txt, o + 1, e - (o + 1))
        };
    };

    /*  provide top-level parsing functionality  */
    PEGUtil.parse = function (parser, txt, options) {
        if (typeof parser !== "object")
            throw new Error("invalid parser object (not an object)");
        if (typeof parser.parse !== "function")
            throw new Error("invalid parser object (no \"parse\" function)");
        if (typeof txt !== "string")
            throw new Error("invalid input text (not a string)");
        if (typeof options !== "undefined" && typeof options !== "object")
            throw new Error("invalid options (not an object)");
        if (typeof options === "undefined")
            options = {};
        var result = { ast: null, error: null };
        try {
            var makeAST;
            if (typeof options.makeAST === "function")
                makeAST = options.makeAST;
            else {
                makeAST = function (location, args) {
                    return {
                        line:   location().start.line,
                        column: location().start.column,
                        offset: location().start.offset,
                        args:   args
                    };
                };
            }
            options.util = {
                makeUnroll:    PEGUtil.makeUnroll,
                makeAST:       PEGUtil.makeAST,
                __makeAST:     makeAST,
                __SyntaxError: parser.SyntaxError
            };
            result.ast = parser.parse(txt, options);
            result.error = null;
        }
        catch (e) {
            result.ast = null;
            if (e instanceof parser.SyntaxError) {
                var definedOrElse = function (value, fallback) {
                    return (typeof value !== "undefined" ? value : fallback);
                };
                result.error = {
                    line:     definedOrElse(e.location.start.line, 0),
                    column:   definedOrElse(e.location.start.column, 0),
                    message:  e.message,
                    found:    definedOrElse(e.found, ""),
                    expected: definedOrElse(e.expected, ""),
                    location: excerpt(txt, definedOrElse(e.location.start.offset, 0))
                };
            }
            else {
                result.error = {
                    line:     0,
                    column:   0,
                    message:  e.message,
                    found:    "",
                    expected: "",
                    location: excerpt("", 0)
                };
            }
        }
        return result;
    };

    /*  render a useful error message  */
    PEGUtil.errorMessage = function (e, noFinalNewline) {
        var l = e.location;
        var prefix1 = "line " + e.line + " (column " + e.column + "): ";
        var prefix2 = "";
        for (var i = 0; i < prefix1.length + l.prolog.length; i++)
            prefix2 += "-";
        var msg = prefix1 + l.prolog + l.token + l.epilog + "\n" +
            prefix2 + "^" + "\n" +
            e.message + (noFinalNewline ? "" : "\n");
        return msg;
    };

    return PEGUtil;
}));


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
