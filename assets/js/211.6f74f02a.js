/*! For license information please see 211.6f74f02a.js.LICENSE.txt */
"use strict";(self.webpackChunkysw_kr=self.webpackChunkysw_kr||[]).push([[211],{2779:(e,t,n)=>{n.d(t,{A:()=>r});const r=(0,n(4722).A)("Clipboard",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}]])},5404:(e,t,n)=>{n.d(t,{A:()=>r});const r=(0,n(4722).A)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]])},690:(e,t,n)=>{n.d(t,{A:()=>r});const r=(0,n(4722).A)("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]])},6570:(e,t,n)=>{n.d(t,{A:()=>r});const r=(0,n(4722).A)("QrCode",[["rect",{width:"5",height:"5",x:"3",y:"3",rx:"1",key:"1tu5fj"}],["rect",{width:"5",height:"5",x:"16",y:"3",rx:"1",key:"1v8r4q"}],["rect",{width:"5",height:"5",x:"3",y:"16",rx:"1",key:"1x03jg"}],["path",{d:"M21 16h-3a2 2 0 0 0-2 2v3",key:"177gqh"}],["path",{d:"M21 21v.01",key:"ents32"}],["path",{d:"M12 7v3a2 2 0 0 1-2 2H7",key:"8crl2c"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M12 3h.01",key:"n36tog"}],["path",{d:"M12 16v.01",key:"133mhm"}],["path",{d:"M16 12h1",key:"1slzba"}],["path",{d:"M21 12v.01",key:"1lwtk9"}],["path",{d:"M12 21v-1",key:"1880an"}]])},4796:(e,t,n)=>{n.d(t,{A:()=>r});const r=(0,n(4722).A)("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]])},5920:(e,t,n)=>{n.d(t,{b:()=>l});var r=n(6540),i=n(2579),o=n(4848),s=r.forwardRef(((e,t)=>(0,o.jsx)(i.sG.label,{...e,ref:t,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}})));s.displayName="Label";var l=s},2579:(e,t,n)=>{n.d(t,{hO:()=>a,sG:()=>l});var r=n(6540),i=n(961),o=n(3362),s=n(4848),l=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"].reduce(((e,t)=>{const n=r.forwardRef(((e,n)=>{const{asChild:r,...i}=e,l=r?o.DX:t;return"undefined"!=typeof window&&(window[Symbol.for("radix-ui")]=!0),(0,s.jsx)(l,{...i,ref:n})}));return n.displayName=`Primitive.${t}`,{...e,[t]:n}}),{});function a(e,t){e&&i.flushSync((()=>e.dispatchEvent(t)))}},6459:(e,t,n)=>{n.d(t,{h:()=>P});var r,i=n(6540),o=Object.defineProperty,s=Object.getOwnPropertySymbols,l=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,h=(e,t,n)=>t in e?o(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,u=(e,t)=>{for(var n in t||(t={}))l.call(t,n)&&h(e,n,t[n]);if(s)for(var n of s(t))a.call(t,n)&&h(e,n,t[n]);return e},c=(e,t)=>{var n={};for(var r in e)l.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&s)for(var r of s(e))t.indexOf(r)<0&&a.call(e,r)&&(n[r]=e[r]);return n};(e=>{const t=class t{constructor(e,n,r,o){if(this.version=e,this.errorCorrectionLevel=n,this.modules=[],this.isFunction=[],e<t.MIN_VERSION||e>t.MAX_VERSION)throw new RangeError("Version value out of range");if(o<-1||o>7)throw new RangeError("Mask value out of range");this.size=4*e+17;let s=[];for(let t=0;t<this.size;t++)s.push(!1);for(let t=0;t<this.size;t++)this.modules.push(s.slice()),this.isFunction.push(s.slice());this.drawFunctionPatterns();const l=this.addEccAndInterleave(r);if(this.drawCodewords(l),-1==o){let e=1e9;for(let t=0;t<8;t++){this.applyMask(t),this.drawFormatBits(t);const n=this.getPenaltyScore();n<e&&(o=t,e=n),this.applyMask(t)}}i(0<=o&&o<=7),this.mask=o,this.applyMask(o),this.drawFormatBits(o),this.isFunction=[]}static encodeText(n,r){const i=e.QrSegment.makeSegments(n);return t.encodeSegments(i,r)}static encodeBinary(n,r){const i=e.QrSegment.makeBytes(n);return t.encodeSegments([i],r)}static encodeSegments(e,r,o=1,l=40,a=-1,h=!0){if(!(t.MIN_VERSION<=o&&o<=l&&l<=t.MAX_VERSION)||a<-1||a>7)throw new RangeError("Invalid value");let u,c;for(u=o;;u++){const n=8*t.getNumDataCodewords(u,r),i=s.getTotalBits(e,u);if(i<=n){c=i;break}if(u>=l)throw new RangeError("Data too long")}for(const n of[t.Ecc.MEDIUM,t.Ecc.QUARTILE,t.Ecc.HIGH])h&&c<=8*t.getNumDataCodewords(u,n)&&(r=n);let d=[];for(const t of e){n(t.mode.modeBits,4,d),n(t.numChars,t.mode.numCharCountBits(u),d);for(const e of t.getData())d.push(e)}i(d.length==c);const f=8*t.getNumDataCodewords(u,r);i(d.length<=f),n(0,Math.min(4,f-d.length),d),n(0,(8-d.length%8)%8,d),i(d.length%8==0);for(let t=236;d.length<f;t^=253)n(t,8,d);let g=[];for(;8*g.length<d.length;)g.push(0);return d.forEach(((e,t)=>g[t>>>3]|=e<<7-(7&t))),new t(u,r,g,a)}getModule(e,t){return 0<=e&&e<this.size&&0<=t&&t<this.size&&this.modules[t][e]}getModules(){return this.modules}drawFunctionPatterns(){for(let n=0;n<this.size;n++)this.setFunctionModule(6,n,n%2==0),this.setFunctionModule(n,6,n%2==0);this.drawFinderPattern(3,3),this.drawFinderPattern(this.size-4,3),this.drawFinderPattern(3,this.size-4);const e=this.getAlignmentPatternPositions(),t=e.length;for(let n=0;n<t;n++)for(let r=0;r<t;r++)0==n&&0==r||0==n&&r==t-1||n==t-1&&0==r||this.drawAlignmentPattern(e[n],e[r]);this.drawFormatBits(0),this.drawVersion()}drawFormatBits(e){const t=this.errorCorrectionLevel.formatBits<<3|e;let n=t;for(let r=0;r<10;r++)n=n<<1^1335*(n>>>9);const o=21522^(t<<10|n);i(o>>>15==0);for(let i=0;i<=5;i++)this.setFunctionModule(8,i,r(o,i));this.setFunctionModule(8,7,r(o,6)),this.setFunctionModule(8,8,r(o,7)),this.setFunctionModule(7,8,r(o,8));for(let i=9;i<15;i++)this.setFunctionModule(14-i,8,r(o,i));for(let i=0;i<8;i++)this.setFunctionModule(this.size-1-i,8,r(o,i));for(let i=8;i<15;i++)this.setFunctionModule(8,this.size-15+i,r(o,i));this.setFunctionModule(8,this.size-8,!0)}drawVersion(){if(this.version<7)return;let e=this.version;for(let n=0;n<12;n++)e=e<<1^7973*(e>>>11);const t=this.version<<12|e;i(t>>>18==0);for(let n=0;n<18;n++){const e=r(t,n),i=this.size-11+n%3,o=Math.floor(n/3);this.setFunctionModule(i,o,e),this.setFunctionModule(o,i,e)}}drawFinderPattern(e,t){for(let n=-4;n<=4;n++)for(let r=-4;r<=4;r++){const i=Math.max(Math.abs(r),Math.abs(n)),o=e+r,s=t+n;0<=o&&o<this.size&&0<=s&&s<this.size&&this.setFunctionModule(o,s,2!=i&&4!=i)}}drawAlignmentPattern(e,t){for(let n=-2;n<=2;n++)for(let r=-2;r<=2;r++)this.setFunctionModule(e+r,t+n,1!=Math.max(Math.abs(r),Math.abs(n)))}setFunctionModule(e,t,n){this.modules[t][e]=n,this.isFunction[t][e]=!0}addEccAndInterleave(e){const n=this.version,r=this.errorCorrectionLevel;if(e.length!=t.getNumDataCodewords(n,r))throw new RangeError("Invalid argument");const o=t.NUM_ERROR_CORRECTION_BLOCKS[r.ordinal][n],s=t.ECC_CODEWORDS_PER_BLOCK[r.ordinal][n],l=Math.floor(t.getNumRawDataModules(n)/8),a=o-l%o,h=Math.floor(l/o);let u=[];const c=t.reedSolomonComputeDivisor(s);for(let i=0,f=0;i<o;i++){let n=e.slice(f,f+h-s+(i<a?0:1));f+=n.length;const r=t.reedSolomonComputeRemainder(n,c);i<a&&n.push(0),u.push(n.concat(r))}let d=[];for(let t=0;t<u[0].length;t++)u.forEach(((e,n)=>{(t!=h-s||n>=a)&&d.push(e[t])}));return i(d.length==l),d}drawCodewords(e){if(e.length!=Math.floor(t.getNumRawDataModules(this.version)/8))throw new RangeError("Invalid argument");let n=0;for(let t=this.size-1;t>=1;t-=2){6==t&&(t=5);for(let i=0;i<this.size;i++)for(let o=0;o<2;o++){const s=t-o,l=!(t+1&2)?this.size-1-i:i;!this.isFunction[l][s]&&n<8*e.length&&(this.modules[l][s]=r(e[n>>>3],7-(7&n)),n++)}}i(n==8*e.length)}applyMask(e){if(e<0||e>7)throw new RangeError("Mask value out of range");for(let t=0;t<this.size;t++)for(let n=0;n<this.size;n++){let r;switch(e){case 0:r=(n+t)%2==0;break;case 1:r=t%2==0;break;case 2:r=n%3==0;break;case 3:r=(n+t)%3==0;break;case 4:r=(Math.floor(n/3)+Math.floor(t/2))%2==0;break;case 5:r=n*t%2+n*t%3==0;break;case 6:r=(n*t%2+n*t%3)%2==0;break;case 7:r=((n+t)%2+n*t%3)%2==0;break;default:throw new Error("Unreachable")}!this.isFunction[t][n]&&r&&(this.modules[t][n]=!this.modules[t][n])}}getPenaltyScore(){let e=0;for(let i=0;i<this.size;i++){let n=!1,r=0,o=[0,0,0,0,0,0,0];for(let s=0;s<this.size;s++)this.modules[i][s]==n?(r++,5==r?e+=t.PENALTY_N1:r>5&&e++):(this.finderPenaltyAddHistory(r,o),n||(e+=this.finderPenaltyCountPatterns(o)*t.PENALTY_N3),n=this.modules[i][s],r=1);e+=this.finderPenaltyTerminateAndCount(n,r,o)*t.PENALTY_N3}for(let i=0;i<this.size;i++){let n=!1,r=0,o=[0,0,0,0,0,0,0];for(let s=0;s<this.size;s++)this.modules[s][i]==n?(r++,5==r?e+=t.PENALTY_N1:r>5&&e++):(this.finderPenaltyAddHistory(r,o),n||(e+=this.finderPenaltyCountPatterns(o)*t.PENALTY_N3),n=this.modules[s][i],r=1);e+=this.finderPenaltyTerminateAndCount(n,r,o)*t.PENALTY_N3}for(let i=0;i<this.size-1;i++)for(let n=0;n<this.size-1;n++){const r=this.modules[i][n];r==this.modules[i][n+1]&&r==this.modules[i+1][n]&&r==this.modules[i+1][n+1]&&(e+=t.PENALTY_N2)}let n=0;for(const t of this.modules)n=t.reduce(((e,t)=>e+(t?1:0)),n);const r=this.size*this.size,o=Math.ceil(Math.abs(20*n-10*r)/r)-1;return i(0<=o&&o<=9),e+=o*t.PENALTY_N4,i(0<=e&&e<=2568888),e}getAlignmentPatternPositions(){if(1==this.version)return[];{const e=Math.floor(this.version/7)+2,t=32==this.version?26:2*Math.ceil((4*this.version+4)/(2*e-2));let n=[6];for(let r=this.size-7;n.length<e;r-=t)n.splice(1,0,r);return n}}static getNumRawDataModules(e){if(e<t.MIN_VERSION||e>t.MAX_VERSION)throw new RangeError("Version number out of range");let n=(16*e+128)*e+64;if(e>=2){const t=Math.floor(e/7)+2;n-=(25*t-10)*t-55,e>=7&&(n-=36)}return i(208<=n&&n<=29648),n}static getNumDataCodewords(e,n){return Math.floor(t.getNumRawDataModules(e)/8)-t.ECC_CODEWORDS_PER_BLOCK[n.ordinal][e]*t.NUM_ERROR_CORRECTION_BLOCKS[n.ordinal][e]}static reedSolomonComputeDivisor(e){if(e<1||e>255)throw new RangeError("Degree out of range");let n=[];for(let t=0;t<e-1;t++)n.push(0);n.push(1);let r=1;for(let i=0;i<e;i++){for(let e=0;e<n.length;e++)n[e]=t.reedSolomonMultiply(n[e],r),e+1<n.length&&(n[e]^=n[e+1]);r=t.reedSolomonMultiply(r,2)}return n}static reedSolomonComputeRemainder(e,n){let r=n.map((e=>0));for(const i of e){const e=i^r.shift();r.push(0),n.forEach(((n,i)=>r[i]^=t.reedSolomonMultiply(n,e)))}return r}static reedSolomonMultiply(e,t){if(e>>>8!=0||t>>>8!=0)throw new RangeError("Byte out of range");let n=0;for(let r=7;r>=0;r--)n=n<<1^285*(n>>>7),n^=(t>>>r&1)*e;return i(n>>>8==0),n}finderPenaltyCountPatterns(e){const t=e[1];i(t<=3*this.size);const n=t>0&&e[2]==t&&e[3]==3*t&&e[4]==t&&e[5]==t;return(n&&e[0]>=4*t&&e[6]>=t?1:0)+(n&&e[6]>=4*t&&e[0]>=t?1:0)}finderPenaltyTerminateAndCount(e,t,n){return e&&(this.finderPenaltyAddHistory(t,n),t=0),t+=this.size,this.finderPenaltyAddHistory(t,n),this.finderPenaltyCountPatterns(n)}finderPenaltyAddHistory(e,t){0==t[0]&&(e+=this.size),t.pop(),t.unshift(e)}};t.MIN_VERSION=1,t.MAX_VERSION=40,t.PENALTY_N1=3,t.PENALTY_N2=3,t.PENALTY_N3=40,t.PENALTY_N4=10,t.ECC_CODEWORDS_PER_BLOCK=[[-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],[-1,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30]],t.NUM_ERROR_CORRECTION_BLOCKS=[[-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],[-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],[-1,1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68],[-1,1,1,2,4,4,4,5,6,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81]];function n(e,t,n){if(t<0||t>31||e>>>t!=0)throw new RangeError("Value out of range");for(let r=t-1;r>=0;r--)n.push(e>>>r&1)}function r(e,t){return!!(e>>>t&1)}function i(e){if(!e)throw new Error("Assertion error")}e.QrCode=t;const o=class e{constructor(e,t,n){if(this.mode=e,this.numChars=t,this.bitData=n,t<0)throw new RangeError("Invalid argument");this.bitData=n.slice()}static makeBytes(t){let r=[];for(const e of t)n(e,8,r);return new e(e.Mode.BYTE,t.length,r)}static makeNumeric(t){if(!e.isNumeric(t))throw new RangeError("String contains non-numeric characters");let r=[];for(let e=0;e<t.length;){const i=Math.min(t.length-e,3);n(parseInt(t.substring(e,e+i),10),3*i+1,r),e+=i}return new e(e.Mode.NUMERIC,t.length,r)}static makeAlphanumeric(t){if(!e.isAlphanumeric(t))throw new RangeError("String contains unencodable characters in alphanumeric mode");let r,i=[];for(r=0;r+2<=t.length;r+=2){let o=45*e.ALPHANUMERIC_CHARSET.indexOf(t.charAt(r));o+=e.ALPHANUMERIC_CHARSET.indexOf(t.charAt(r+1)),n(o,11,i)}return r<t.length&&n(e.ALPHANUMERIC_CHARSET.indexOf(t.charAt(r)),6,i),new e(e.Mode.ALPHANUMERIC,t.length,i)}static makeSegments(t){return""==t?[]:e.isNumeric(t)?[e.makeNumeric(t)]:e.isAlphanumeric(t)?[e.makeAlphanumeric(t)]:[e.makeBytes(e.toUtf8ByteArray(t))]}static makeEci(t){let r=[];if(t<0)throw new RangeError("ECI assignment value out of range");if(t<128)n(t,8,r);else if(t<16384)n(2,2,r),n(t,14,r);else{if(!(t<1e6))throw new RangeError("ECI assignment value out of range");n(6,3,r),n(t,21,r)}return new e(e.Mode.ECI,0,r)}static isNumeric(t){return e.NUMERIC_REGEX.test(t)}static isAlphanumeric(t){return e.ALPHANUMERIC_REGEX.test(t)}getData(){return this.bitData.slice()}static getTotalBits(e,t){let n=0;for(const r of e){const e=r.mode.numCharCountBits(t);if(r.numChars>=1<<e)return 1/0;n+=4+e+r.bitData.length}return n}static toUtf8ByteArray(e){e=encodeURI(e);let t=[];for(let n=0;n<e.length;n++)"%"!=e.charAt(n)?t.push(e.charCodeAt(n)):(t.push(parseInt(e.substring(n+1,n+3),16)),n+=2);return t}};o.NUMERIC_REGEX=/^[0-9]*$/,o.ALPHANUMERIC_REGEX=/^[A-Z0-9 $%*+.\/:-]*$/,o.ALPHANUMERIC_CHARSET="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";let s=o;e.QrSegment=o})(r||(r={})),(e=>{let t;(e=>{const t=class{constructor(e,t){this.ordinal=e,this.formatBits=t}};t.LOW=new t(0,1),t.MEDIUM=new t(1,0),t.QUARTILE=new t(2,3),t.HIGH=new t(3,2);e.Ecc=t})(t=e.QrCode||(e.QrCode={}))})(r||(r={})),(e=>{let t;(e=>{const t=class{constructor(e,t){this.modeBits=e,this.numBitsCharCount=t}numCharCountBits(e){return this.numBitsCharCount[Math.floor((e+7)/17)]}};t.NUMERIC=new t(1,[10,12,14]),t.ALPHANUMERIC=new t(2,[9,11,13]),t.BYTE=new t(4,[8,16,16]),t.KANJI=new t(8,[8,10,12]),t.ECI=new t(7,[0,0,0]);e.Mode=t})(t=e.QrSegment||(e.QrSegment={}))})(r||(r={}));var d=r,f={L:d.QrCode.Ecc.LOW,M:d.QrCode.Ecc.MEDIUM,Q:d.QrCode.Ecc.QUARTILE,H:d.QrCode.Ecc.HIGH},g=128,m="L",M="#FFFFFF",E="#000000",w=!1,y=1,p=4,C=0,v=.1;function R(e,t=0){const n=[];return e.forEach((function(e,r){let i=null;e.forEach((function(o,s){if(!o&&null!==i)return n.push(`M${i+t} ${r+t}h${s-i}v1H${i+t}z`),void(i=null);if(s!==e.length-1)o&&null===i&&(i=s);else{if(!o)return;null===i?n.push(`M${s+t},${r+t} h1v1H${s+t}z`):n.push(`M${i+t},${r+t} h${s+1-i}v1H${i+t}z`)}}))})),n.join("")}function A(e,t){return e.slice().map(((e,n)=>n<t.y||n>=t.y+t.h?e:e.map(((e,n)=>(n<t.x||n>=t.x+t.w)&&e))))}function N({value:e,level:t,minVersion:n,includeMargin:r,marginSize:o,imageSettings:s,size:l,boostLevel:a}){let h=i.useMemo((()=>{const r=(Array.isArray(e)?e:[e]).reduce(((e,t)=>(e.push(...d.QrSegment.makeSegments(t)),e)),[]);return d.QrCode.encodeSegments(r,f[t],n,void 0,void 0,a)}),[e,t,n,a]);const{cells:u,margin:c,numCells:g,calculatedImageSettings:m}=i.useMemo((()=>{let e=h.getModules();const t=function(e,t){return null!=t?Math.max(Math.floor(t),0):e?p:C}(r,o),n=e.length+2*t,i=function(e,t,n,r){if(null==r)return null;const i=e.length+2*n,o=Math.floor(t*v),s=i/t,l=(r.width||o)*s,a=(r.height||o)*s,h=null==r.x?e.length/2-l/2:r.x*s,u=null==r.y?e.length/2-a/2:r.y*s,c=null==r.opacity?1:r.opacity;let d=null;if(r.excavate){let e=Math.floor(h),t=Math.floor(u);d={x:e,y:t,w:Math.ceil(l+h-e),h:Math.ceil(a+u-t)}}return{x:h,y:u,h:a,w:l,excavation:d,opacity:c,crossOrigin:r.crossOrigin}}(e,l,t,s);return{cells:e,margin:t,numCells:n,calculatedImageSettings:i}}),[h,l,s,r,o]);return{qrcode:h,margin:c,cells:u,numCells:g,calculatedImageSettings:m}}var S=function(){try{(new Path2D).addPath(new Path2D)}catch(e){return!1}return!0}();i.forwardRef((function(e,t){const n=e,{value:r,size:o=g,level:s=m,bgColor:l=M,fgColor:a=E,includeMargin:h=w,minVersion:d=y,boostLevel:f,marginSize:p,imageSettings:C}=n,v=c(n,["value","size","level","bgColor","fgColor","includeMargin","minVersion","boostLevel","marginSize","imageSettings"]),{style:P}=v,k=c(v,["style"]),I=null==C?void 0:C.src,b=i.useRef(null),z=i.useRef(null),O=i.useCallback((e=>{b.current=e,"function"==typeof t?t(e):t&&(t.current=e)}),[t]),[_,x]=i.useState(!1),{margin:L,cells:F,numCells:D,calculatedImageSettings:H}=N({value:r,level:s,minVersion:d,boostLevel:f,includeMargin:h,marginSize:p,imageSettings:C,size:o});i.useEffect((()=>{if(null!=b.current){const e=b.current,t=e.getContext("2d");if(!t)return;let n=F;const r=z.current,i=null!=H&&null!==r&&r.complete&&0!==r.naturalHeight&&0!==r.naturalWidth;i&&null!=H.excavation&&(n=A(F,H.excavation));const s=window.devicePixelRatio||1;e.height=e.width=o*s;const h=o/D*s;t.scale(h,h),t.fillStyle=l,t.fillRect(0,0,D,D),t.fillStyle=a,S?t.fill(new Path2D(R(n,L))):F.forEach((function(e,n){e.forEach((function(e,r){e&&t.fillRect(r+L,n+L,1,1)}))})),H&&(t.globalAlpha=H.opacity),i&&t.drawImage(r,H.x+L,H.y+L,H.w,H.h)}})),i.useEffect((()=>{x(!1)}),[I]);const B=u({height:o,width:o},P);let T=null;return null!=I&&(T=i.createElement("img",{src:I,key:I,style:{display:"none"},onLoad:()=>{x(!0)},ref:z,crossOrigin:null==H?void 0:H.crossOrigin})),i.createElement(i.Fragment,null,i.createElement("canvas",u({style:B,height:o,width:o,ref:O,role:"img"},k)),T)})).displayName="QRCodeCanvas";var P=i.forwardRef((function(e,t){const n=e,{value:r,size:o=g,level:s=m,bgColor:l=M,fgColor:a=E,includeMargin:h=w,minVersion:d=y,boostLevel:f,title:p,marginSize:C,imageSettings:v}=n,S=c(n,["value","size","level","bgColor","fgColor","includeMargin","minVersion","boostLevel","title","marginSize","imageSettings"]),{margin:P,cells:k,numCells:I,calculatedImageSettings:b}=N({value:r,level:s,minVersion:d,boostLevel:f,includeMargin:h,marginSize:C,imageSettings:v,size:o});let z=k,O=null;null!=v&&null!=b&&(null!=b.excavation&&(z=A(k,b.excavation)),O=i.createElement("image",{href:v.src,height:b.h,width:b.w,x:b.x+P,y:b.y+P,preserveAspectRatio:"none",opacity:b.opacity,crossOrigin:b.crossOrigin}));const _=R(z,P);return i.createElement("svg",u({height:o,width:o,viewBox:`0 0 ${I} ${I}`,ref:t,role:"img"},S),!!p&&i.createElement("title",null,p),i.createElement("path",{fill:l,d:`M0,0 h${I}v${I}H0z`,shapeRendering:"crispEdges"}),i.createElement("path",{fill:a,d:_,shapeRendering:"crispEdges"}),O)}));P.displayName="QRCodeSVG"}}]);