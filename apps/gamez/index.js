function t(t,e,r,n){Object.defineProperty(t,e,{get:r,set:n,enumerable:!0,configurable:!0})}var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{};function r(t){return t&&t.__esModule?t.default:t}var n={},i={},o=e.parcelRequire21a6;null==o&&((o=function(t){if(t in n)return n[t].exports;if(t in i){var e=i[t];delete i[t];var r={id:t,exports:{}};return n[t]=r,e.call(r.exports,r,r.exports),r.exports}var o=new Error("Cannot find module '"+t+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(t,e){i[t]=e},e.parcelRequire21a6=o),o.register("hHZ9a",(function(e,r){var n;t(e.exports,"encode",(()=>n),(t=>n=t)),n=function(t,e){var r=new i(e);return r.write(t),r.read()};var i=o("lHxVy").EncodeBuffer})),o.register("lHxVy",(function(e,r){var n;t(e.exports,"EncodeBuffer",(()=>n),(t=>n=t)),n=f;var i=o("dGkYu").preset;function f(t){if(!(this instanceof f))return new f(t);if(t&&(this.options=t,t.codec)){var e=this.codec=t.codec;e.bufferish&&(this.bufferish=e.bufferish)}}o("aYqMD").FlexEncoder.mixin(f.prototype),f.prototype.codec=i,f.prototype.write=function(t){this.codec.encode(this,t)}})),o.register("dGkYu",(function(e,r){var n;t(e.exports,"preset",(()=>n),(t=>n=t));var i=o("k0HV8").ExtBuffer,f=o("gRxJn"),a=o("kE5js"),s=o("fjT19");function u(){var t=this.options;return this.encode=function(t){var e=a.getWriteType(t);return function(t,r){var n=e[typeof r];if(!n)throw new Error('Unsupported type "'+typeof r+'": '+r);n(t,r)}}(t),t&&t.preset&&f.setExtPackers(this),this}s.install({addExtPacker:function(t,e,r){r=s.filter(r);var n=e.name;if(n&&"Object"!==n){(this.extPackers||(this.extPackers={}))[n]=o}else{(this.extEncoderList||(this.extEncoderList=[])).unshift([e,o])}function o(e){return r&&(e=r(e)),new i(e,t)}},getExtPacker:function(t){var e=this.extPackers||(this.extPackers={}),r=t.constructor,n=r&&r.name&&e[r.name];if(n)return n;for(var i=this.extEncoderList||(this.extEncoderList=[]),o=i.length,f=0;f<o;f++){var a=i[f];if(r===a[0])return a[1]}},init:u}),n=u.call(s.preset)})),o.register("k0HV8",(function(e,r){var n;t(e.exports,"ExtBuffer",(()=>n),(t=>n=t)),n=function t(e,r){if(!(this instanceof t))return new t(e,r);this.buffer=i.from(e),this.type=r};var i=o("cXpey")})),o.register("cXpey",(function(t,e){var r=t.exports.$parcel$global=o("l4yHf"),n=t.exports.hasBuffer=r&&!!r.isBuffer,i=t.exports.hasArrayBuffer="undefined"!=typeof ArrayBuffer,f=t.exports.isArray=o("kNkO7");t.exports.isArrayBuffer=i?function(t){return t instanceof ArrayBuffer||l(t)}:g;var a=t.exports.isBuffer=n?r.isBuffer:g,s=t.exports.isView=i?ArrayBuffer.isView||x("ArrayBuffer","buffer"):g;t.exports.alloc=d,t.exports.concat=function(e,r){r||(r=0,Array.prototype.forEach.call(e,(function(t){r+=t.length})));var n=this!==t.exports&&this||e[0],i=d.call(n,r),o=0;return Array.prototype.forEach.call(e,(function(t){o+=p.copy.call(t,i,o)})),i},t.exports.from=function(t){return"string"==typeof t?y.call(this,t):v(this).from(t)};var u=t.exports.Array=o("i4Qgy"),c=t.exports.Buffer=o("jnK4p"),h=t.exports.Uint8Array=o("k5Oxx"),p=t.exports.prototype=o("63vxp");function d(t){return v(this).alloc(t)}var l=x("ArrayBuffer");function y(t){var e=3*t.length,r=d.call(this,e),n=p.write.call(r,t);return e!==n&&(r=p.slice.call(r,0,n)),r}function v(t){return a(t)?c:s(t)?h:f(t)?u:n?c:i?h:u}function g(){return!1}function x(t,e){return t="[object "+t+"]",function(r){return null!=r&&{}.toString.call(e?r[e]:r)===t}}})),o.register("l4yHf",(function(t,e){var r=o("kLEOP").Buffer;function n(t){return t&&t.isBuffer&&t}t.exports=n(void 0!==r&&r)||n(t.exports.Buffer)||n("undefined"!=typeof window&&window.Buffer)||t.exports.Buffer})),o.register("kLEOP",(function(t,e){})),o.register("kNkO7",(function(t,e){var r={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==r.call(t)}})),o.register("i4Qgy",(function(t,e){var r=o("cXpey"),n=t.exports=i(0);function i(t){return new Array(t)}n.alloc=i,n.concat=r.concat,n.from=function(t){if(!r.isBuffer(t)&&r.isView(t))t=r.Uint8Array.from(t);else if(r.isArrayBuffer(t))t=new Uint8Array(t);else{if("string"==typeof t)return r.from.call(n,t);if("number"==typeof t)throw new TypeError('"value" argument must not be a number')}return Array.prototype.slice.call(t)}})),o.register("jnK4p",(function(t,e){var r=o("cXpey"),n=r.global,i=t.exports=r.hasBuffer?f(0):[];function f(t){return new n(t)}i.alloc=r.hasBuffer&&n.alloc||f,i.concat=r.concat,i.from=function(t){if(!r.isBuffer(t)&&r.isView(t))t=r.Uint8Array.from(t);else if(r.isArrayBuffer(t))t=new Uint8Array(t);else{if("string"==typeof t)return r.from.call(i,t);if("number"==typeof t)throw new TypeError('"value" argument must not be a number')}return n.from&&1!==n.from.length?n.from(t):new n(t)}})),o.register("k5Oxx",(function(t,e){var r=o("cXpey"),n=t.exports=r.hasArrayBuffer?i(0):[];function i(t){return new Uint8Array(t)}n.alloc=i,n.concat=r.concat,n.from=function(t){if(r.isView(t)){var e=t.byteOffset,i=t.byteLength;(t=t.buffer).byteLength!==i&&(t.slice?t=t.slice(e,e+i):(t=new Uint8Array(t)).byteLength!==i&&(t=Array.prototype.slice.call(t,e,e+i)))}else{if("string"==typeof t)return r.from.call(n,t);if("number"==typeof t)throw new TypeError('"value" argument must not be a number')}return new Uint8Array(t)}})),o.register("63vxp",(function(e,r){var n,i,f,a;t(e.exports,"copy",(()=>n),(t=>n=t)),t(e.exports,"slice",(()=>i),(t=>i=t)),t(e.exports,"toString",(()=>f),(t=>f=t)),t(e.exports,"write",(()=>a),(t=>a=t));var s,u=o("775Wo");n=l,i=y,f=function(t,e,r){return(!p&&c.isBuffer(this)?this.toString:u.toString).apply(this,arguments)},s="write",a=function(){return(this[s]||u[s]).apply(this,arguments)};var c=o("cXpey"),h=c.global,p=c.hasBuffer&&"TYPED_ARRAY_SUPPORT"in h,d=p&&!h.TYPED_ARRAY_SUPPORT;function l(t,e,r,n){var i=c.isBuffer(this),o=c.isBuffer(t);if(i&&o)return this.copy(t,e,r,n);if(d||i||o||!c.isView(this)||!c.isView(t))return u.copy.call(this,t,e,r,n);var f=r||null!=n?y.call(this,r,n):this;return t.set(f,e),f.length}function y(t,e){var r=this.slice||!d&&this.subarray;if(r)return r.call(this,t,e);var n=c.alloc.call(this,e-t);return l.call(this,n,0,t,e),n}})),o.register("775Wo",(function(e,r){var n,i,o;t(e.exports,"copy",(()=>n),(t=>n=t)),t(e.exports,"toString",(()=>i),(t=>i=t)),t(e.exports,"write",(()=>o),(t=>o=t));n=function(t,e,r,n){var i;r||(r=0);n||0===n||(n=this.length);e||(e=0);var o=n-r;if(t===this&&r<e&&e<n)for(i=o-1;i>=0;i--)t[i+e]=this[i+r];else for(i=0;i<o;i++)t[i+e]=this[i+r];return o},i=function(t,e,r){var n=this,i=0|e;r||(r=n.length);var o="",f=0;for(;i<r;)(f=n[i++])<128?o+=String.fromCharCode(f):(192==(224&f)?f=(31&f)<<6|63&n[i++]:224==(240&f)?f=(15&f)<<12|(63&n[i++])<<6|63&n[i++]:240==(248&f)&&(f=(7&f)<<18|(63&n[i++])<<12|(63&n[i++])<<6|63&n[i++]),f>=65536?(f-=65536,o+=String.fromCharCode(55296+(f>>>10),56320+(1023&f))):o+=String.fromCharCode(f));return o},o=function(t,e){var r=this,n=e||(e|=0),i=t.length,o=0,f=0;for(;f<i;)(o=t.charCodeAt(f++))<128?r[n++]=o:o<2048?(r[n++]=192|o>>>6,r[n++]=128|63&o):o<55296||o>57343?(r[n++]=224|o>>>12,r[n++]=128|o>>>6&63,r[n++]=128|63&o):(o=65536+(o-55296<<10|t.charCodeAt(f++)-56320),r[n++]=240|o>>>18,r[n++]=128|o>>>12&63,r[n++]=128|o>>>6&63,r[n++]=128|63&o);return n-e}})),o.register("gRxJn",(function(e,r){var n;t(e.exports,"setExtPackers",(()=>n),(t=>n=t)),n=function(t){t.addExtPacker(14,Error,[d,c]),t.addExtPacker(1,EvalError,[d,c]),t.addExtPacker(2,RangeError,[d,c]),t.addExtPacker(3,ReferenceError,[d,c]),t.addExtPacker(4,SyntaxError,[d,c]),t.addExtPacker(5,TypeError,[d,c]),t.addExtPacker(6,URIError,[d,c]),t.addExtPacker(10,RegExp,[p,c]),t.addExtPacker(11,Boolean,[h,c]),t.addExtPacker(12,String,[h,c]),t.addExtPacker(13,Date,[Number,c]),t.addExtPacker(15,Number,[h,c]),"undefined"!=typeof Uint8Array&&(t.addExtPacker(17,Int8Array,s),t.addExtPacker(18,Uint8Array,s),t.addExtPacker(19,Int16Array,s),t.addExtPacker(20,Uint16Array,s),t.addExtPacker(21,Int32Array,s),t.addExtPacker(22,Uint32Array,s),t.addExtPacker(23,Float32Array,s),"undefined"!=typeof Float64Array&&t.addExtPacker(24,Float64Array,s),"undefined"!=typeof Uint8ClampedArray&&t.addExtPacker(25,Uint8ClampedArray,s),t.addExtPacker(26,ArrayBuffer,s),t.addExtPacker(29,DataView,s));f.hasBuffer&&t.addExtPacker(27,a,f.from)};var i,f=o("cXpey"),a=f.global,s=f.Uint8Array.from,u={name:1,message:1,stack:1,columnNumber:1,fileName:1,lineNumber:1};function c(t){return i||(i=o("hHZ9a").encode),i(t)}function h(t){return t.valueOf()}function p(t){(t=RegExp.prototype.toString.call(t).split("/")).shift();var e=[t.pop()];return e.unshift(t.join("/")),e}function d(t){var e={};for(var r in u)e[r]=t[r];return e}})),o.register("kE5js",(function(e,r){var n;t(e.exports,"getWriteType",(()=>n),(t=>n=t));var i=o("kNkO7"),f=o("jErKa"),a=f.Uint64BE,s=f.Int64BE,u=o("cXpey"),c=o("63vxp"),h=o("eLEOn"),p=o("bZyEl").uint8,d=o("k0HV8").ExtBuffer,l="undefined"!=typeof Uint8Array,y="undefined"!=typeof Map,v=[];v[1]=212,v[2]=213,v[4]=214,v[8]=215,v[16]=216,n=function(t){var e=h.getWriteToken(t),r=t&&t.useraw,n=l&&t&&t.binarraybuffer,o=n?u.isArrayBuffer:u.isBuffer,f=n?function(t,e){E(t,new Uint8Array(e))}:E,g=y&&t&&t.usemap?function(t,r){if(!(r instanceof Map))return b(t,r);var n=r.size;e[n<16?128+n:n<=65535?222:223](t,n);var i=t.codec.encode;r.forEach((function(e,r,n){i(t,r),i(t,e)}))}:b;return{boolean:function(t,r){e[r?195:194](t,r)},function:m,number:function(t,r){var n,i=0|r;if(r!==i)return void e[n=203](t,r);n=-32<=i&&i<=127?255&i:0<=i?i<=255?204:i<=65535?205:206:-128<=i?208:-32768<=i?209:210;e[n](t,i)},object:r?function(t,r){if(o(r))return function(t,r){var n=r.length;e[n<32?160+n:n<=65535?218:219](t,n),t.send(r)}(t,r);x(t,r)}:x,string:function(t){return r;function r(r,n){var i=n.length,o=5+3*i;r.offset=r.reserve(o);var f=r.buffer,a=t(i),s=r.offset+a;i=c.write.call(f,n,s);var u=t(i);if(a!==u){var h=s+u-a,p=s+i;c.copy.call(f,f,h,s,p)}e[1===u?160+i:u<=3?215+u:219](r,i),r.offset+=i}}(r?function(t){return t<32?1:t<=65535?3:5}:function(t){return t<32?1:t<=255?2:t<=65535?3:5}),symbol:m,undefined:m};function x(t,r){if(null===r)return m(t,r);if(o(r))return f(t,r);if(i(r))return function(t,r){var n=r.length;e[n<16?144+n:n<=65535?220:221](t,n);for(var i=t.codec.encode,o=0;o<n;o++)i(t,r[o])}(t,r);if(a.isUint64BE(r))return function(t,r){e[207](t,r.toArray())}(t,r);if(s.isInt64BE(r))return function(t,r){e[211](t,r.toArray())}(t,r);var n=t.codec.getExtPacker(r);if(n&&(r=n(r)),r instanceof d)return function(t,r){var n=r.buffer,i=n.length,o=v[i]||(i<255?199:i<=65535?200:201);e[o](t,i),p[r.type](t),t.send(n)}(t,r);g(t,r)}function m(t,r){e[192](t,r)}function E(t,r){var n=r.length;e[n<255?196:n<=65535?197:198](t,n),t.send(r)}function b(t,r){var n=Object.keys(r),i=n.length;e[i<16?128+i:i<=65535?222:223](t,i);var o=t.codec.encode;n.forEach((function(e){o(t,e),o(t,r[e])}))}}})),o.register("jErKa",(function(t,e){var r=o("kLEOP").Buffer;!function(t){var e,n="undefined",i=n!==typeof r&&r,o=n!==typeof Uint8Array&&Uint8Array,f=n!==typeof ArrayBuffer&&ArrayBuffer,a=[0,0,0,0,0,0,0,0],s=Array.isArray||function(t){return!!t&&"[object Array]"==Object.prototype.toString.call(t)},u=4294967296;function c(r,s,c){var b=s?0:4,w=s?4:0,k=s?0:3,A=s?1:2,U=s?2:1,B=s?3:0,I=s?g:m,P=s?x:E,R=L.prototype,S="is"+r,T="_"+S;return R.buffer=void 0,R.offset=0,R[T]=!0,R.toNumber=D,R.toString=function(t){var e=this.buffer,r=this.offset,n=M(e,r+b),i=M(e,r+w),o="",f=!c&&2147483648&n;f&&(n=~n,i=u-i);t=t||10;for(;;){var a=n%t*u+i;if(n=Math.floor(n/t),i=Math.floor(a/t),o=(a%t).toString(t)+o,!n&&!i)break}f&&(o="-"+o);return o},R.toJSON=D,R.toArray=h,i&&(R.toBuffer=p),o&&(R.toArrayBuffer=d),L[S]=function(t){return!(!t||!t[T])},t[r]=L,L;function L(t,r,i,s){return this instanceof L?function(t,r,i,s,c){o&&f&&(r instanceof f&&(r=new o(r)),s instanceof f&&(s=new o(s)));if(!(r||i||s||e))return void(t.buffer=v(a,0));if(!l(r,i)){c=i,s=r,i=0,r=new(e||Array)(8)}if(t.buffer=r,t.offset=i|=0,n===typeof s)return;"string"==typeof s?function(t,e,r,n){var i=0,o=r.length,f=0,a=0;"-"===r[0]&&i++;var s=i;for(;i<o;){var c=parseInt(r[i++],n);if(!(c>=0))break;a=a*n+c,f=f*n+Math.floor(a/u),a%=u}s&&(f=~f,a?a=u-a:f++);C(t,e+b,f),C(t,e+w,a)}(r,i,s,c||10):l(s,c)?y(r,i,s,c):"number"==typeof c?(C(r,i+b,s),C(r,i+w,c)):s>0?I(r,i,s):s<0?P(r,i,s):y(r,i,a,0)}(this,t,r,i,s):new L(t,r,i,s)}function D(){var t=this.buffer,e=this.offset,r=M(t,e+b),n=M(t,e+w);return c||(r|=0),r?r*u+n:n}function C(t,e,r){t[e+B]=255&r,r>>=8,t[e+U]=255&r,r>>=8,t[e+A]=255&r,r>>=8,t[e+k]=255&r}function M(t,e){return 16777216*t[e+k]+(t[e+A]<<16)+(t[e+U]<<8)+t[e+B]}}function h(t){var r=this.buffer,n=this.offset;return e=null,!1!==t&&0===n&&8===r.length&&s(r)?r:v(r,n)}function p(t){var n=this.buffer,o=this.offset;if(e=i,!1!==t&&0===o&&8===n.length&&r.isBuffer(n))return n;var f=new i(8);return y(f,0,n,o),f}function d(t){var r=this.buffer,n=this.offset,i=r.buffer;if(e=o,!1!==t&&0===n&&i instanceof f&&8===i.byteLength)return i;var a=new o(8);return y(a,0,r,n),a.buffer}function l(t,e){var r=t&&t.length;return e|=0,r&&e+8<=r&&"string"!=typeof t[e]}function y(t,e,r,n){e|=0,n|=0;for(var i=0;i<8;i++)t[e++]=255&r[n++]}function v(t,e){return Array.prototype.slice.call(t,e,e+8)}function g(t,e,r){for(var n=e+8;n>e;)t[--n]=255&r,r/=256}function x(t,e,r){var n=e+8;for(r++;n>e;)t[--n]=255&-r^255,r/=256}function m(t,e,r){for(var n=e+8;e<n;)t[e++]=255&r,r/=256}function E(t,e,r){var n=e+8;for(r++;e<n;)t[e++]=255&-r^255,r/=256}c("Uint64BE",!0,!0),c("Int64BE",!0,!1),c("Uint64LE",!1,!0),c("Int64LE",!1,!1)}("string"!=typeof t.exports.nodeName?t.exports:t.exports||{})})),o.register("eLEOn",(function(e,r){var n;t(e.exports,"getWriteToken",(()=>n),(t=>n=t));var i=o("aSRf6"),f=o("jErKa"),a=f.Uint64BE,s=f.Int64BE,u=o("bZyEl").uint8,c=o("cXpey"),h=c.global,p=c.hasBuffer&&"TYPED_ARRAY_SUPPORT"in h&&!h.TYPED_ARRAY_SUPPORT,d=c.hasBuffer&&h.prototype||{};function l(){var t=u.slice();return t[196]=y(196),t[197]=v(197),t[198]=g(198),t[199]=y(199),t[200]=v(200),t[201]=g(201),t[202]=x(202,4,d.writeFloatBE||b,!0),t[203]=x(203,8,d.writeDoubleBE||w,!0),t[204]=y(204),t[205]=v(205),t[206]=g(206),t[207]=x(207,8,m),t[208]=y(208),t[209]=v(209),t[210]=g(210),t[211]=x(211,8,E),t[217]=y(217),t[218]=v(218),t[219]=g(219),t[220]=v(220),t[221]=g(221),t[222]=v(222),t[223]=g(223),t}function y(t){return function(e,r){var n=e.reserve(2),i=e.buffer;i[n++]=t,i[n]=r}}function v(t){return function(e,r){var n=e.reserve(3),i=e.buffer;i[n++]=t,i[n++]=r>>>8,i[n]=r}}function g(t){return function(e,r){var n=e.reserve(5),i=e.buffer;i[n++]=t,i[n++]=r>>>24,i[n++]=r>>>16,i[n++]=r>>>8,i[n]=r}}function x(t,e,r,n){return function(i,o){var f=i.reserve(e+1);i.buffer[f++]=t,r.call(i.buffer,o,f,n)}}function m(t,e){new a(this,e,t)}function E(t,e){new s(this,e,t)}function b(t,e){i.write(this,t,e,!1,23,4)}function w(t,e){i.write(this,t,e,!1,52,8)}n=function(t){return t&&t.uint8array?(e=l(),e[202]=x(202,4,b),e[203]=x(203,8,w),e):p||c.hasBuffer&&t&&t.safe?function(){var t=u.slice();return t[196]=x(196,1,h.prototype.writeUInt8),t[197]=x(197,2,h.prototype.writeUInt16BE),t[198]=x(198,4,h.prototype.writeUInt32BE),t[199]=x(199,1,h.prototype.writeUInt8),t[200]=x(200,2,h.prototype.writeUInt16BE),t[201]=x(201,4,h.prototype.writeUInt32BE),t[202]=x(202,4,h.prototype.writeFloatBE),t[203]=x(203,8,h.prototype.writeDoubleBE),t[204]=x(204,1,h.prototype.writeUInt8),t[205]=x(205,2,h.prototype.writeUInt16BE),t[206]=x(206,4,h.prototype.writeUInt32BE),t[207]=x(207,8,m),t[208]=x(208,1,h.prototype.writeInt8),t[209]=x(209,2,h.prototype.writeInt16BE),t[210]=x(210,4,h.prototype.writeInt32BE),t[211]=x(211,8,E),t[217]=x(217,1,h.prototype.writeUInt8),t[218]=x(218,2,h.prototype.writeUInt16BE),t[219]=x(219,4,h.prototype.writeUInt32BE),t[220]=x(220,2,h.prototype.writeUInt16BE),t[221]=x(221,4,h.prototype.writeUInt32BE),t[222]=x(222,2,h.prototype.writeUInt16BE),t[223]=x(223,4,h.prototype.writeUInt32BE),t}():l();var e}})),o.register("aSRf6",(function(e,r){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */var n,i;t(e.exports,"read",(()=>n),(t=>n=t)),t(e.exports,"write",(()=>i),(t=>i=t)),n=function(t,e,r,n,i){var o,f,a=8*i-n-1,s=(1<<a)-1,u=s>>1,c=-7,h=r?i-1:0,p=r?-1:1,d=t[e+h];for(h+=p,o=d&(1<<-c)-1,d>>=-c,c+=a;c>0;o=256*o+t[e+h],h+=p,c-=8);for(f=o&(1<<-c)-1,o>>=-c,c+=n;c>0;f=256*f+t[e+h],h+=p,c-=8);if(0===o)o=1-u;else{if(o===s)return f?NaN:1/0*(d?-1:1);f+=Math.pow(2,n),o-=u}return(d?-1:1)*f*Math.pow(2,o-n)},i=function(t,e,r,n,i,o){var f,a,s,u=8*o-i-1,c=(1<<u)-1,h=c>>1,p=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,d=n?0:o-1,l=n?1:-1,y=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(a=isNaN(e)?1:0,f=c):(f=Math.floor(Math.log(e)/Math.LN2),e*(s=Math.pow(2,-f))<1&&(f--,s*=2),(e+=f+h>=1?p/s:p*Math.pow(2,1-h))*s>=2&&(f++,s/=2),f+h>=c?(a=0,f=c):f+h>=1?(a=(e*s-1)*Math.pow(2,i),f+=h):(a=e*Math.pow(2,h-1)*Math.pow(2,i),f=0));i>=8;t[r+d]=255&a,d+=l,a/=256,i-=8);for(f=f<<i|a,u+=i;u>0;t[r+d]=255&f,d+=l,f/=256,u-=8);t[r+d-l]|=128*y}})),o.register("bZyEl",(function(e,r){var n;t(e.exports,"uint8",(()=>n),(t=>n=t));for(var i=n=new Array(256),o=0;o<=255;o++)i[o]=f(o);function f(t){return function(e){var r=e.reserve(1);e.buffer[r]=t}}})),o.register("fjT19",(function(e,r){var n,i,f,a;t(e.exports,"createCodec",(()=>n),(t=>n=t)),t(e.exports,"install",(()=>i),(t=>i=t)),t(e.exports,"filter",(()=>f),(t=>f=t)),t(e.exports,"preset",(()=>a),(t=>a=t));var s=o("kNkO7");n=p,i=function(t){for(var e in t)c.prototype[e]=h(c.prototype[e],t[e])},f=function(t){return s(t)?function(t){return t=t.slice(),function(r){return t.reduce(e,r)};function e(t,e){return e(t)}}(t):t};var u=o("cXpey");function c(t){if(!(this instanceof c))return new c(t);this.options=t,this.init()}function h(t,e){return t&&e?function(){return t.apply(this,arguments),e.apply(this,arguments)}:t||e}function p(t){return new c(t)}c.prototype.init=function(){var t=this.options;return t&&t.uint8array&&(this.bufferish=u.Uint8Array),this},a=p({preset:!0})})),o.register("aYqMD",(function(e,r){var n,i;t(e.exports,"FlexDecoder",(()=>n),(t=>n=t)),t(e.exports,"FlexEncoder",(()=>i),(t=>i=t)),n=s,i=u;var f=o("cXpey"),a="BUFFER_SHORTAGE";function s(){if(!(this instanceof s))return new s}function u(){if(!(this instanceof u))return new u}function c(){throw new Error("method not implemented: write()")}function h(){throw new Error("method not implemented: fetch()")}function p(){return this.buffers&&this.buffers.length?(this.flush(),this.pull()):this.fetch()}function d(t){(this.buffers||(this.buffers=[])).push(t)}function l(){return(this.buffers||(this.buffers=[])).shift()}function y(t){return function(e){for(var r in t)e[r]=t[r];return e}}s.mixin=y({bufferish:f,write:function(t){var e=this.offset?f.prototype.slice.call(this.buffer,this.offset):this.buffer;this.buffer=e?t?this.bufferish.concat([e,t]):e:t,this.offset=0},fetch:h,flush:function(){for(;this.offset<this.buffer.length;){var t,e=this.offset;try{t=this.fetch()}catch(t){if(t&&t.message!=a)throw t;this.offset=e;break}this.push(t)}},push:d,pull:l,read:p,reserve:function(t){var e=this.offset,r=e+t;if(r>this.buffer.length)throw new Error(a);return this.offset=r,e},offset:0}),s.mixin(s.prototype),u.mixin=y({bufferish:f,write:c,fetch:function(){var t=this.start;if(t<this.offset){var e=this.start=this.offset;return f.prototype.slice.call(this.buffer,t,e)}},flush:function(){for(;this.start<this.offset;){var t=this.fetch();t&&this.push(t)}},push:d,pull:function(){var t=this.buffers||(this.buffers=[]),e=t.length>1?this.bufferish.concat(t):t[0];return t.length=0,e},read:p,reserve:function(t){var e=0|t;if(this.buffer){var r=this.buffer.length,n=0|this.offset,i=n+e;if(i<r)return this.offset=i,n;this.flush(),t=Math.max(t,Math.min(2*r,this.maxBufferSize))}return t=Math.max(t,this.minBufferSize),this.buffer=this.bufferish.alloc(t),this.start=0,this.offset=e,0},send:function(t){var e=t.length;if(e>this.minBufferSize)this.flush(),this.push(t);else{var r=this.reserve(e);f.prototype.copy.call(t,this.buffer,r)}},maxBufferSize:65536,minBufferSize:2048,offset:0,start:0}),u.mixin(u.prototype)})),o.register("6DJBP",(function(e,r){var n;t(e.exports,"decode",(()=>n),(t=>n=t)),n=function(t,e){var r=new i(e);return r.write(t),r.read()};var i=o("2FgJp").DecodeBuffer})),o.register("2FgJp",(function(e,r){var n;t(e.exports,"DecodeBuffer",(()=>n),(t=>n=t)),n=f;var i=o("2LxRC").preset;function f(t){if(!(this instanceof f))return new f(t);if(t&&(this.options=t,t.codec)){var e=this.codec=t.codec;e.bufferish&&(this.bufferish=e.bufferish)}}o("aYqMD").FlexDecoder.mixin(f.prototype),f.prototype.codec=i,f.prototype.fetch=function(){return this.codec.decode(this)}})),o.register("2LxRC",(function(e,r){var n;t(e.exports,"preset",(()=>n),(t=>n=t));var i=o("k0HV8").ExtBuffer,f=o("5N1Ur"),a=o("aqIYs").readUint8,s=o("eG5bJ"),u=o("fjT19");function c(){var t=this.options;return this.decode=function(t){var e=s.getReadToken(t);return function(t){var r=a(t),n=e[r];if(!n)throw new Error("Invalid type: "+(r?"0x"+r.toString(16):r));return n(t)}}(t),t&&t.preset&&f.setExtUnpackers(this),this}u.install({addExtUnpacker:function(t,e){(this.extUnpackers||(this.extUnpackers=[]))[t]=u.filter(e)},getExtUnpacker:function(t){return(this.extUnpackers||(this.extUnpackers=[]))[t]||function(e){return new i(e,t)}},init:c}),n=c.call(u.preset)})),o.register("5N1Ur",(function(e,r){var n;t(e.exports,"setExtUnpackers",(()=>n),(t=>n=t)),n=function(t){t.addExtUnpacker(14,[u,h(Error)]),t.addExtUnpacker(1,[u,h(EvalError)]),t.addExtUnpacker(2,[u,h(RangeError)]),t.addExtUnpacker(3,[u,h(ReferenceError)]),t.addExtUnpacker(4,[u,h(SyntaxError)]),t.addExtUnpacker(5,[u,h(TypeError)]),t.addExtUnpacker(6,[u,h(URIError)]),t.addExtUnpacker(10,[u,c]),t.addExtUnpacker(11,[u,p(Boolean)]),t.addExtUnpacker(12,[u,p(String)]),t.addExtUnpacker(13,[u,p(Date)]),t.addExtUnpacker(15,[u,p(Number)]),"undefined"!=typeof Uint8Array&&(t.addExtUnpacker(17,p(Int8Array)),t.addExtUnpacker(18,p(Uint8Array)),t.addExtUnpacker(19,[d,p(Int16Array)]),t.addExtUnpacker(20,[d,p(Uint16Array)]),t.addExtUnpacker(21,[d,p(Int32Array)]),t.addExtUnpacker(22,[d,p(Uint32Array)]),t.addExtUnpacker(23,[d,p(Float32Array)]),"undefined"!=typeof Float64Array&&t.addExtUnpacker(24,[d,p(Float64Array)]),"undefined"!=typeof Uint8ClampedArray&&t.addExtUnpacker(25,p(Uint8ClampedArray)),t.addExtUnpacker(26,d),t.addExtUnpacker(29,[d,p(DataView)]));f.hasBuffer&&t.addExtUnpacker(27,p(a))};var i,f=o("cXpey"),a=f.global,s={name:1,message:1,stack:1,columnNumber:1,fileName:1,lineNumber:1};function u(t){return i||(i=o("6DJBP").decode),i(t)}function c(t){return RegExp.apply(null,t)}function h(t){return function(e){var r=new t;for(var n in s)r[n]=e[n];return r}}function p(t){return function(e){return new t(e)}}function d(t){return new Uint8Array(t).buffer}})),o.register("aqIYs",(function(e,r){var n,i;t(e.exports,"getReadFormat",(()=>n),(t=>n=t)),t(e.exports,"readUint8",(()=>i),(t=>i=t));var f=o("aSRf6"),a=o("jErKa"),s=a.Uint64BE,u=a.Int64BE;n=function(t){var e=c.hasArrayBuffer&&t&&t.binarraybuffer,r=t&&t.int64;return{map:p&&t&&t.usemap?y:l,array:v,str:g,bin:e?m:x,ext:E,uint8:b,uint16:k,uint32:U,uint64:I(8,r?S:P),int8:w,int16:A,int32:B,int64:I(8,r?T:R),float32:I(4,L),float64:I(8,D)}},i=b;var c=o("cXpey"),h=o("63vxp"),p="undefined"!=typeof Map,d=!0;function l(t,e){var r,n={},i=new Array(e),o=new Array(e),f=t.codec.decode;for(r=0;r<e;r++)i[r]=f(t),o[r]=f(t);for(r=0;r<e;r++)n[i[r]]=o[r];return n}function y(t,e){var r,n=new Map,i=new Array(e),o=new Array(e),f=t.codec.decode;for(r=0;r<e;r++)i[r]=f(t),o[r]=f(t);for(r=0;r<e;r++)n.set(i[r],o[r]);return n}function v(t,e){for(var r=new Array(e),n=t.codec.decode,i=0;i<e;i++)r[i]=n(t);return r}function g(t,e){var r=t.reserve(e),n=r+e;return h.toString.call(t.buffer,"utf-8",r,n)}function x(t,e){var r=t.reserve(e),n=r+e,i=h.slice.call(t.buffer,r,n);return c.from(i)}function m(t,e){var r=t.reserve(e),n=r+e,i=h.slice.call(t.buffer,r,n);return c.Uint8Array.from(i).buffer}function E(t,e){var r=t.reserve(e+1),n=t.buffer[r++],i=r+e,o=t.codec.getExtUnpacker(n);if(!o)throw new Error("Invalid ext type: "+(n?"0x"+n.toString(16):n));return o(h.slice.call(t.buffer,r,i))}function b(t){var e=t.reserve(1);return t.buffer[e]}function w(t){var e=t.reserve(1),r=t.buffer[e];return 128&r?r-256:r}function k(t){var e=t.reserve(2),r=t.buffer;return r[e++]<<8|r[e]}function A(t){var e=t.reserve(2),r=t.buffer,n=r[e++]<<8|r[e];return 32768&n?n-65536:n}function U(t){var e=t.reserve(4),r=t.buffer;return 16777216*r[e++]+(r[e++]<<16)+(r[e++]<<8)+r[e]}function B(t){var e=t.reserve(4),r=t.buffer;return r[e++]<<24|r[e++]<<16|r[e++]<<8|r[e]}function I(t,e){return function(r){var n=r.reserve(t);return e.call(r.buffer,n,d)}}function P(t){return new s(this,t).toNumber()}function R(t){return new u(this,t).toNumber()}function S(t){return new s(this,t)}function T(t){return new u(this,t)}function L(t){return f.read(this,t,!1,23,4)}function D(t){return f.read(this,t,!1,52,8)}})),o.register("eG5bJ",(function(e,r){var n;t(e.exports,"getReadToken",(()=>n),(t=>n=t));var i=o("aqIYs");function f(t){var e,r=new Array(256);for(e=0;e<=127;e++)r[e]=a(e);for(e=128;e<=143;e++)r[e]=u(e-128,t.map);for(e=144;e<=159;e++)r[e]=u(e-144,t.array);for(e=160;e<=191;e++)r[e]=u(e-160,t.str);for(r[192]=a(null),r[193]=null,r[194]=a(!1),r[195]=a(!0),r[196]=s(t.uint8,t.bin),r[197]=s(t.uint16,t.bin),r[198]=s(t.uint32,t.bin),r[199]=s(t.uint8,t.ext),r[200]=s(t.uint16,t.ext),r[201]=s(t.uint32,t.ext),r[202]=t.float32,r[203]=t.float64,r[204]=t.uint8,r[205]=t.uint16,r[206]=t.uint32,r[207]=t.uint64,r[208]=t.int8,r[209]=t.int16,r[210]=t.int32,r[211]=t.int64,r[212]=u(1,t.ext),r[213]=u(2,t.ext),r[214]=u(4,t.ext),r[215]=u(8,t.ext),r[216]=u(16,t.ext),r[217]=s(t.uint8,t.str),r[218]=s(t.uint16,t.str),r[219]=s(t.uint32,t.str),r[220]=s(t.uint16,t.array),r[221]=s(t.uint32,t.array),r[222]=s(t.uint16,t.map),r[223]=s(t.uint32,t.map),e=224;e<=255;e++)r[e]=a(e-256);return r}function a(t){return function(){return t}}function s(t,e){return function(r){var n=t(r);return e(r,n)}}function u(t,e){return function(r){return e(r,t)}}n=function(t){var e=i.getReadFormat(t);return t&&t.useraw?function(t){var e,r=f(t).slice();for(r[217]=r[196],r[218]=r[197],r[219]=r[198],e=160;e<=191;e++)r[e]=u(e-160,t.bin);return r}(e):f(e)}})),o.register("oizuF",(function(e,r){var n;t(e.exports,"Encoder",(()=>n),(t=>n=t)),n=a;var i=o("cohjx"),f=o("lHxVy").EncodeBuffer;function a(t){if(!(this instanceof a))return new a(t);f.call(this,t)}a.prototype=new f,i.mixin(a.prototype),a.prototype.encode=function(t){this.write(t),this.emit("data",this.read())},a.prototype.end=function(t){arguments.length&&this.encode(t),this.flush(),this.emit("end")}})),o.register("cohjx",(function(t,e){!function(e){t.exports=e;var r="listeners",n={on:function(t,e){return f(this,t).push(e),this},once:function(t,e){var r=this;return n.originalListener=e,f(r,t).push(n),r;function n(){o.call(r,t,n),e.apply(this,arguments)}},off:o,emit:function(t,e){var r=this,n=f(r,t,!0);if(!n)return!1;var i=arguments.length;if(1===i)n.forEach((function(t){t.call(r)}));else if(2===i)n.forEach((function(t){t.call(r,e)}));else{var o=Array.prototype.slice.call(arguments,1);n.forEach((function(t){t.apply(r,o)}))}return!!n.length}};function i(t){for(var e in n)t[e]=n[e];return t}function o(t,e){var n,i=this;if(arguments.length){if(e){if(n=f(i,t,!0)){if(!(n=n.filter((function(t){return t!==e&&t.originalListener!==e}))).length)return o.call(i,t);i[r][t]=n}}else if((n=i[r])&&(delete n[t],!Object.keys(n).length))return o.call(i)}else delete i[r];return i}function f(t,e,n){if(!n||t[r]){var i=t[r]||(t[r]={});return i[e]||(i[e]=[])}}i(e.prototype),e.mixin=i}((
/**
 * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
 *
 * @copyright Yusuke Kawasaki
 * @license MIT
 * @constructor
 * @see https://github.com/kawanet/event-lite
 * @see http://kawanet.github.io/event-lite/EventLite.html
 * @example
 * var EventLite = require("event-lite");
 *
 * function MyClass() {...}             // your class
 *
 * EventLite.mixin(MyClass.prototype);  // import event methods
 *
 * var obj = new MyClass();
 * obj.on("foo", function() {...});     // add event listener
 * obj.once("bar", function() {...});   // add one-time event listener
 * obj.emit("foo");                     // dispatch event
 * obj.emit("bar");                     // dispatch another event
 * obj.off("foo");                      // remove event listener
 */
function t(){if(!(this instanceof t))return new t}))})),o.register("2QHXp",(function(e,r){var n;t(e.exports,"Decoder",(()=>n),(t=>n=t)),n=a;var i=o("cohjx"),f=o("2FgJp").DecodeBuffer;function a(t){if(!(this instanceof a))return new a(t);f.call(this,t)}a.prototype=new f,i.mixin(a.prototype),a.prototype.decode=function(t){arguments.length&&this.write(t),this.flush()},a.prototype.push=function(t){this.emit("data",t)},a.prototype.end=function(t){this.decode(t),this.emit("end")}})),o.register("lILlc",(function(e,r){var n;t(e.exports,"createCodec",(()=>n),(t=>n=t)),o("2LxRC"),o("dGkYu"),n=o("fjT19").createCodec})),o.register("1duQu",(function(e,r){var n;t(e.exports,"codec",(()=>n),(t=>n=t)),o("2LxRC"),o("dGkYu"),n={preset:o("fjT19").preset}}));var f={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let a;const s=new Uint8Array(16);function u(){if(!a&&(a="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!a))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return a(s)}const c=[];for(let t=0;t<256;++t)c.push((t+256).toString(16).slice(1));function h(t,e=0){return(c[t[e+0]]+c[t[e+1]]+c[t[e+2]]+c[t[e+3]]+"-"+c[t[e+4]]+c[t[e+5]]+"-"+c[t[e+6]]+c[t[e+7]]+"-"+c[t[e+8]]+c[t[e+9]]+"-"+c[t[e+10]]+c[t[e+11]]+c[t[e+12]]+c[t[e+13]]+c[t[e+14]]+c[t[e+15]]).toLowerCase()}var p,d,l,y,v,g,x=function(t,e,r){if(f.randomUUID&&!e&&!t)return f.randomUUID();const n=(t=t||{}).random||(t.rng||u)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,e){r=r||0;for(let t=0;t<16;++t)e[r+t]=n[t];return e}return h(n)},m={};t(m,"encode",(()=>p),(t=>p=t)),t(m,"decode",(()=>d),(t=>d=t)),t(m,"Encoder",(()=>l),(t=>l=t)),t(m,"Decoder",(()=>y),(t=>y=t)),t(m,"createCodec",(()=>v),(t=>v=t)),t(m,"codec",(()=>g),(t=>g=t)),p=o("hHZ9a").encode,d=o("6DJBP").decode,l=o("oizuF").Encoder,y=o("2QHXp").Decoder,v=o("lILlc").createCodec,g=o("1duQu").codec;const E=x(),b=document.querySelector.bind(document),w=document.querySelectorAll.bind(document);class k{constructor(t,e,r){this.username=t,this.password=e,this.url=r,this.gameId=null,this.gameType=null,this.queue=[],this.connect()}connect(){this.socket=new WebSocket(this.url),this.socket.onopen=this.sockOpen.bind(this),this.socket.onmessage=this.sockMessage.bind(this),this.socket.onerror=this.sockError.bind(this),this.socket.onclose=this.sockClose.bind(this)}sockOpen(t){this.socket.send((new TextEncoder).encode(this.password)),this.send(["$id",E,this.username]),b("#login").setAttribute("hidden",""),setInterval((()=>this.send(null)),500),setInterval((()=>this.dequeue()),10)}load(){b("#games").removeAttribute("hidden"),location.hash.length>1&&(this.gameId=location.hash.slice(1),location.hash=this.gameId,this.send(["$join",this.gameId]),b("#games").setAttribute("hidden","")),b("#code + button").addEventListener("click",(()=>{this.gameId=b("#code").value,location.hash=this.gameId,this.send(["$join",this.gameId]),b("#games").setAttribute("hidden","")})),w("#games > :last-child > button").forEach((t=>{t.addEventListener("click",(()=>{this.gameType=t.textContent.trim(),this.send(["$create",this.gameType]),b("#games").setAttribute("hidden","")}))})),b("#frame > div > button").addEventListener("click",(()=>{this.send(["$leave"]),b("#frame").setAttribute("hidden","")}))}initGame(){b("#frame > span").textContent=`${this.gameType} (${this.gameId})`,b("#frame").removeAttribute("hidden");const t=b("iframe");t.src=`/apps/gamez/games/${this.gameType}.html`,t.onload=()=>{window.frames["game-frame"].contentWindow.send=(t,...e)=>this.send([t,...e])}}async sockMessage(t){const e=new Uint8Array(await t.data.arrayBuffer());if(2!=e[0]||3!=e[e.byteLength-1])throw Error("Received message with invalid end bytes from server");const n=r(m).decode(e.slice(1,e.byteLength-1));if(Array.isArray(n)&&n.length)switch(n[0]){case"$load":this.load();break;case"$create":n[1]?(this.gameId=n[1],location.hash=n[1],this.initGame()):(b("#games > p").textContent=n[2],b("#games").removeAttribute("hidden"));break;case"$join":n[1]?(this.gameType=n[1],this.initGame()):(b("#games > p").textContent=n[2],b("#games").removeAttribute("hidden"));break;case"$leave":this.gameId=null,this.gameType=null,location.hash="",b("iframe").src="",b("#games > p").textContent=n[1]?"":n[2],b("#frame").setAttribute("hidden",""),b("#games").removeAttribute("hidden");break;default:{if(!this.gameId&&!this.gameType)return;const t="cmd_"+n[0];this.queue.push([t,n.slice(1)]);break}}}dequeue(){const t=window.frames["game-frame"].contentWindow;if("ready"in t)for(;this.queue.length;){const[e,r]=this.queue.shift();try{if(!(e in t))throw Error(`No command in game called "${e}"`);t[e](...r)}catch(t){console.error(t)}}}sockError(t){console.log("Error",t),w("section").forEach((t=>t.setAttribute("hidden","")))}sockClose(t){location.reload()}send(t){const e=r(m).encode(t);if(e.byteLength>2048)throw Error("Too much data to send!");const n=new Uint8Array(e.byteLength+2);n[0]=2,n[n.byteLength-1]=3;for(let t=0;t<e.byteLength;++t)n[t+1]=e[t];this.socket.send(n)}}let A=null;window.addEventListener("DOMContentLoaded",(()=>{b("#login button").addEventListener("click",(()=>{const t=b("#input-name"),e=b("#input-pass");A=new k(t.value,e.value,"wss://gamez.mathgeniuszach.com:22314")})),setTimeout((()=>{w("body > button").forEach((t=>t.remove()))}),1)}));