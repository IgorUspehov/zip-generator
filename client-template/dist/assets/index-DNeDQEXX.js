(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();var Rd={exports:{}},Pa={},Ed={exports:{}},W={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rr=Symbol.for("react.element"),Bm=Symbol.for("react.portal"),Im=Symbol.for("react.fragment"),Fm=Symbol.for("react.strict_mode"),Lm=Symbol.for("react.profiler"),Om=Symbol.for("react.provider"),Wm=Symbol.for("react.context"),Um=Symbol.for("react.forward_ref"),Hm=Symbol.for("react.suspense"),qm=Symbol.for("react.memo"),zm=Symbol.for("react.lazy"),Zl=Symbol.iterator;function $m(e){return e===null||typeof e!="object"?null:(e=Zl&&e[Zl]||e["@@iterator"],typeof e=="function"?e:null)}var _d={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Md=Object.assign,Td={};function Xn(e,t,n){this.props=e,this.context=t,this.refs=Td,this.updater=n||_d}Xn.prototype.isReactComponent={};Xn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Xn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Ad(){}Ad.prototype=Xn.prototype;function Li(e,t,n){this.props=e,this.context=t,this.refs=Td,this.updater=n||_d}var Oi=Li.prototype=new Ad;Oi.constructor=Li;Md(Oi,Xn.prototype);Oi.isPureReactComponent=!0;var Xl=Array.isArray,Pd=Object.prototype.hasOwnProperty,Wi={current:null},Dd={key:!0,ref:!0,__self:!0,__source:!0};function Bd(e,t,n){var s,r={},o=null,i=null;if(t!=null)for(s in t.ref!==void 0&&(i=t.ref),t.key!==void 0&&(o=""+t.key),t)Pd.call(t,s)&&!Dd.hasOwnProperty(s)&&(r[s]=t[s]);var l=arguments.length-2;if(l===1)r.children=n;else if(1<l){for(var c=Array(l),d=0;d<l;d++)c[d]=arguments[d+2];r.children=c}if(e&&e.defaultProps)for(s in l=e.defaultProps,l)r[s]===void 0&&(r[s]=l[s]);return{$$typeof:rr,type:e,key:o,ref:i,props:r,_owner:Wi.current}}function Gm(e,t){return{$$typeof:rr,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Ui(e){return typeof e=="object"&&e!==null&&e.$$typeof===rr}function Km(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var ec=/\/+/g;function ro(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Km(""+e.key):t.toString(36)}function Ur(e,t,n,s,r){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(o){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case rr:case Bm:i=!0}}if(i)return i=e,r=r(i),e=s===""?"."+ro(i,0):s,Xl(r)?(n="",e!=null&&(n=e.replace(ec,"$&/")+"/"),Ur(r,t,n,"",function(d){return d})):r!=null&&(Ui(r)&&(r=Gm(r,n+(!r.key||i&&i.key===r.key?"":(""+r.key).replace(ec,"$&/")+"/")+e)),t.push(r)),1;if(i=0,s=s===""?".":s+":",Xl(e))for(var l=0;l<e.length;l++){o=e[l];var c=s+ro(o,l);i+=Ur(o,t,n,c,r)}else if(c=$m(e),typeof c=="function")for(e=c.call(e),l=0;!(o=e.next()).done;)o=o.value,c=s+ro(o,l++),i+=Ur(o,t,n,c,r);else if(o==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function br(e,t,n){if(e==null)return e;var s=[],r=0;return Ur(e,s,"","",function(o){return t.call(n,o,r++)}),s}function Vm(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var ve={current:null},Hr={transition:null},Ym={ReactCurrentDispatcher:ve,ReactCurrentBatchConfig:Hr,ReactCurrentOwner:Wi};function Id(){throw Error("act(...) is not supported in production builds of React.")}W.Children={map:br,forEach:function(e,t,n){br(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return br(e,function(){t++}),t},toArray:function(e){return br(e,function(t){return t})||[]},only:function(e){if(!Ui(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};W.Component=Xn;W.Fragment=Im;W.Profiler=Lm;W.PureComponent=Li;W.StrictMode=Fm;W.Suspense=Hm;W.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ym;W.act=Id;W.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var s=Md({},e.props),r=e.key,o=e.ref,i=e._owner;if(t!=null){if(t.ref!==void 0&&(o=t.ref,i=Wi.current),t.key!==void 0&&(r=""+t.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(c in t)Pd.call(t,c)&&!Dd.hasOwnProperty(c)&&(s[c]=t[c]===void 0&&l!==void 0?l[c]:t[c])}var c=arguments.length-2;if(c===1)s.children=n;else if(1<c){l=Array(c);for(var d=0;d<c;d++)l[d]=arguments[d+2];s.children=l}return{$$typeof:rr,type:e.type,key:r,ref:o,props:s,_owner:i}};W.createContext=function(e){return e={$$typeof:Wm,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Om,_context:e},e.Consumer=e};W.createElement=Bd;W.createFactory=function(e){var t=Bd.bind(null,e);return t.type=e,t};W.createRef=function(){return{current:null}};W.forwardRef=function(e){return{$$typeof:Um,render:e}};W.isValidElement=Ui;W.lazy=function(e){return{$$typeof:zm,_payload:{_status:-1,_result:e},_init:Vm}};W.memo=function(e,t){return{$$typeof:qm,type:e,compare:t===void 0?null:t}};W.startTransition=function(e){var t=Hr.transition;Hr.transition={};try{e()}finally{Hr.transition=t}};W.unstable_act=Id;W.useCallback=function(e,t){return ve.current.useCallback(e,t)};W.useContext=function(e){return ve.current.useContext(e)};W.useDebugValue=function(){};W.useDeferredValue=function(e){return ve.current.useDeferredValue(e)};W.useEffect=function(e,t){return ve.current.useEffect(e,t)};W.useId=function(){return ve.current.useId()};W.useImperativeHandle=function(e,t,n){return ve.current.useImperativeHandle(e,t,n)};W.useInsertionEffect=function(e,t){return ve.current.useInsertionEffect(e,t)};W.useLayoutEffect=function(e,t){return ve.current.useLayoutEffect(e,t)};W.useMemo=function(e,t){return ve.current.useMemo(e,t)};W.useReducer=function(e,t,n){return ve.current.useReducer(e,t,n)};W.useRef=function(e){return ve.current.useRef(e)};W.useState=function(e){return ve.current.useState(e)};W.useSyncExternalStore=function(e,t,n){return ve.current.useSyncExternalStore(e,t,n)};W.useTransition=function(){return ve.current.useTransition()};W.version="18.3.1";Ed.exports=W;var y=Ed.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Jm=y,Qm=Symbol.for("react.element"),Zm=Symbol.for("react.fragment"),Xm=Object.prototype.hasOwnProperty,ef=Jm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,tf={key:!0,ref:!0,__self:!0,__source:!0};function Fd(e,t,n){var s,r={},o=null,i=null;n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),t.ref!==void 0&&(i=t.ref);for(s in t)Xm.call(t,s)&&!tf.hasOwnProperty(s)&&(r[s]=t[s]);if(e&&e.defaultProps)for(s in t=e.defaultProps,t)r[s]===void 0&&(r[s]=t[s]);return{$$typeof:Qm,type:e,key:o,ref:i,props:r,_owner:ef.current}}Pa.Fragment=Zm;Pa.jsx=Fd;Pa.jsxs=Fd;Rd.exports=Pa;var a=Rd.exports,Ld={exports:{}},Ie={},Od={exports:{}},Wd={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(T,F){var L=T.length;T.push(F);e:for(;0<L;){var te=L-1>>>1,ie=T[te];if(0<r(ie,F))T[te]=F,T[L]=ie,L=te;else break e}}function n(T){return T.length===0?null:T[0]}function s(T){if(T.length===0)return null;var F=T[0],L=T.pop();if(L!==F){T[0]=L;e:for(var te=0,ie=T.length,hr=ie>>>1;te<hr;){var Zt=2*(te+1)-1,so=T[Zt],Xt=Zt+1,gr=T[Xt];if(0>r(so,L))Xt<ie&&0>r(gr,so)?(T[te]=gr,T[Xt]=L,te=Xt):(T[te]=so,T[Zt]=L,te=Zt);else if(Xt<ie&&0>r(gr,L))T[te]=gr,T[Xt]=L,te=Xt;else break e}}return F}function r(T,F){var L=T.sortIndex-F.sortIndex;return L!==0?L:T.id-F.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;e.unstable_now=function(){return o.now()}}else{var i=Date,l=i.now();e.unstable_now=function(){return i.now()-l}}var c=[],d=[],u=1,m=null,f=3,b=!1,w=!1,x=!1,S=typeof setTimeout=="function"?setTimeout:null,p=typeof clearTimeout=="function"?clearTimeout:null,h=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function g(T){for(var F=n(d);F!==null;){if(F.callback===null)s(d);else if(F.startTime<=T)s(d),F.sortIndex=F.expirationTime,t(c,F);else break;F=n(d)}}function v(T){if(x=!1,g(T),!w)if(n(c)!==null)w=!0,ke(C);else{var F=n(d);F!==null&&Me(v,F.startTime-T)}}function C(T,F){w=!1,x&&(x=!1,p(A),A=-1),b=!0;var L=f;try{for(g(F),m=n(c);m!==null&&(!(m.expirationTime>F)||T&&!j());){var te=m.callback;if(typeof te=="function"){m.callback=null,f=m.priorityLevel;var ie=te(m.expirationTime<=F);F=e.unstable_now(),typeof ie=="function"?m.callback=ie:m===n(c)&&s(c),g(F)}else s(c);m=n(c)}if(m!==null)var hr=!0;else{var Zt=n(d);Zt!==null&&Me(v,Zt.startTime-F),hr=!1}return hr}finally{m=null,f=L,b=!1}}var E=!1,_=null,A=-1,N=5,k=-1;function j(){return!(e.unstable_now()-k<N)}function I(){if(_!==null){var T=e.unstable_now();k=T;var F=!0;try{F=_(!0,T)}finally{F?M():(E=!1,_=null)}}else E=!1}var M;if(typeof h=="function")M=function(){h(I)};else if(typeof MessageChannel<"u"){var D=new MessageChannel,O=D.port2;D.port1.onmessage=I,M=function(){O.postMessage(null)}}else M=function(){S(I,0)};function ke(T){_=T,E||(E=!0,M())}function Me(T,F){A=S(function(){T(e.unstable_now())},F)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(T){T.callback=null},e.unstable_continueExecution=function(){w||b||(w=!0,ke(C))},e.unstable_forceFrameRate=function(T){0>T||125<T?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):N=0<T?Math.floor(1e3/T):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_getFirstCallbackNode=function(){return n(c)},e.unstable_next=function(T){switch(f){case 1:case 2:case 3:var F=3;break;default:F=f}var L=f;f=F;try{return T()}finally{f=L}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(T,F){switch(T){case 1:case 2:case 3:case 4:case 5:break;default:T=3}var L=f;f=T;try{return F()}finally{f=L}},e.unstable_scheduleCallback=function(T,F,L){var te=e.unstable_now();switch(typeof L=="object"&&L!==null?(L=L.delay,L=typeof L=="number"&&0<L?te+L:te):L=te,T){case 1:var ie=-1;break;case 2:ie=250;break;case 5:ie=1073741823;break;case 4:ie=1e4;break;default:ie=5e3}return ie=L+ie,T={id:u++,callback:F,priorityLevel:T,startTime:L,expirationTime:ie,sortIndex:-1},L>te?(T.sortIndex=L,t(d,T),n(c)===null&&T===n(d)&&(x?(p(A),A=-1):x=!0,Me(v,L-te))):(T.sortIndex=ie,t(c,T),w||b||(w=!0,ke(C))),T},e.unstable_shouldYield=j,e.unstable_wrapCallback=function(T){var F=f;return function(){var L=f;f=F;try{return T.apply(this,arguments)}finally{f=L}}}})(Wd);Od.exports=Wd;var nf=Od.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var sf=y,Be=nf;function R(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Ud=new Set,Ws={};function wn(e,t){$n(e,t),$n(e+"Capture",t)}function $n(e,t){for(Ws[e]=t,e=0;e<t.length;e++)Ud.add(t[e])}var wt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Uo=Object.prototype.hasOwnProperty,rf=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,tc={},nc={};function af(e){return Uo.call(nc,e)?!0:Uo.call(tc,e)?!1:rf.test(e)?nc[e]=!0:(tc[e]=!0,!1)}function of(e,t,n,s){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return s?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function lf(e,t,n,s){if(t===null||typeof t>"u"||of(e,t,n,s))return!0;if(s)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function we(e,t,n,s,r,o,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=s,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=o,this.removeEmptyString=i}var pe={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){pe[e]=new we(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];pe[t]=new we(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){pe[e]=new we(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){pe[e]=new we(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){pe[e]=new we(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){pe[e]=new we(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){pe[e]=new we(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){pe[e]=new we(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){pe[e]=new we(e,5,!1,e.toLowerCase(),null,!1,!1)});var Hi=/[\-:]([a-z])/g;function qi(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Hi,qi);pe[t]=new we(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Hi,qi);pe[t]=new we(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Hi,qi);pe[t]=new we(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){pe[e]=new we(e,1,!1,e.toLowerCase(),null,!1,!1)});pe.xlinkHref=new we("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){pe[e]=new we(e,1,!1,e.toLowerCase(),null,!0,!0)});function zi(e,t,n,s){var r=pe.hasOwnProperty(t)?pe[t]:null;(r!==null?r.type!==0:s||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(lf(t,n,r,s)&&(n=null),s||r===null?af(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):r.mustUseProperty?e[r.propertyName]=n===null?r.type===3?!1:"":n:(t=r.attributeName,s=r.attributeNamespace,n===null?e.removeAttribute(t):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,s?e.setAttributeNS(s,t,n):e.setAttribute(t,n))))}var Et=sf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,yr=Symbol.for("react.element"),Rn=Symbol.for("react.portal"),En=Symbol.for("react.fragment"),$i=Symbol.for("react.strict_mode"),Ho=Symbol.for("react.profiler"),Hd=Symbol.for("react.provider"),qd=Symbol.for("react.context"),Gi=Symbol.for("react.forward_ref"),qo=Symbol.for("react.suspense"),zo=Symbol.for("react.suspense_list"),Ki=Symbol.for("react.memo"),At=Symbol.for("react.lazy"),zd=Symbol.for("react.offscreen"),sc=Symbol.iterator;function cs(e){return e===null||typeof e!="object"?null:(e=sc&&e[sc]||e["@@iterator"],typeof e=="function"?e:null)}var X=Object.assign,ao;function Ns(e){if(ao===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);ao=t&&t[1]||""}return`
`+ao+e}var oo=!1;function io(e,t){if(!e||oo)return"";oo=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var s=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){s=d}e.call(t.prototype)}else{try{throw Error()}catch(d){s=d}e()}}catch(d){if(d&&s&&typeof d.stack=="string"){for(var r=d.stack.split(`
`),o=s.stack.split(`
`),i=r.length-1,l=o.length-1;1<=i&&0<=l&&r[i]!==o[l];)l--;for(;1<=i&&0<=l;i--,l--)if(r[i]!==o[l]){if(i!==1||l!==1)do if(i--,l--,0>l||r[i]!==o[l]){var c=`
`+r[i].replace(" at new "," at ");return e.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",e.displayName)),c}while(1<=i&&0<=l);break}}}finally{oo=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Ns(e):""}function cf(e){switch(e.tag){case 5:return Ns(e.type);case 16:return Ns("Lazy");case 13:return Ns("Suspense");case 19:return Ns("SuspenseList");case 0:case 2:case 15:return e=io(e.type,!1),e;case 11:return e=io(e.type.render,!1),e;case 1:return e=io(e.type,!0),e;default:return""}}function $o(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case En:return"Fragment";case Rn:return"Portal";case Ho:return"Profiler";case $i:return"StrictMode";case qo:return"Suspense";case zo:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case qd:return(e.displayName||"Context")+".Consumer";case Hd:return(e._context.displayName||"Context")+".Provider";case Gi:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Ki:return t=e.displayName||null,t!==null?t:$o(e.type)||"Memo";case At:t=e._payload,e=e._init;try{return $o(e(t))}catch{}}return null}function df(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return $o(t);case 8:return t===$i?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Gt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function $d(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function uf(e){var t=$d(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),s=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,o=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return r.call(this)},set:function(i){s=""+i,o.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return s},setValue:function(i){s=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function xr(e){e._valueTracker||(e._valueTracker=uf(e))}function Gd(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),s="";return e&&(s=$d(e)?e.checked?"true":"false":e.value),e=s,e!==n?(t.setValue(e),!0):!1}function sa(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Go(e,t){var n=t.checked;return X({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function rc(e,t){var n=t.defaultValue==null?"":t.defaultValue,s=t.checked!=null?t.checked:t.defaultChecked;n=Gt(t.value!=null?t.value:n),e._wrapperState={initialChecked:s,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Kd(e,t){t=t.checked,t!=null&&zi(e,"checked",t,!1)}function Ko(e,t){Kd(e,t);var n=Gt(t.value),s=t.type;if(n!=null)s==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(s==="submit"||s==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Vo(e,t.type,n):t.hasOwnProperty("defaultValue")&&Vo(e,t.type,Gt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function ac(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var s=t.type;if(!(s!=="submit"&&s!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Vo(e,t,n){(t!=="number"||sa(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Cs=Array.isArray;function On(e,t,n,s){if(e=e.options,t){t={};for(var r=0;r<n.length;r++)t["$"+n[r]]=!0;for(n=0;n<e.length;n++)r=t.hasOwnProperty("$"+e[n].value),e[n].selected!==r&&(e[n].selected=r),r&&s&&(e[n].defaultSelected=!0)}else{for(n=""+Gt(n),t=null,r=0;r<e.length;r++){if(e[r].value===n){e[r].selected=!0,s&&(e[r].defaultSelected=!0);return}t!==null||e[r].disabled||(t=e[r])}t!==null&&(t.selected=!0)}}function Yo(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(R(91));return X({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function oc(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(R(92));if(Cs(n)){if(1<n.length)throw Error(R(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Gt(n)}}function Vd(e,t){var n=Gt(t.value),s=Gt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),s!=null&&(e.defaultValue=""+s)}function ic(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Yd(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Jo(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Yd(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var vr,Jd=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,s,r){MSApp.execUnsafeLocalFunction(function(){return e(t,n,s,r)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(vr=vr||document.createElement("div"),vr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=vr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Us(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Es={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},pf=["Webkit","ms","Moz","O"];Object.keys(Es).forEach(function(e){pf.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Es[t]=Es[e]})});function Qd(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Es.hasOwnProperty(e)&&Es[e]?(""+t).trim():t+"px"}function Zd(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var s=n.indexOf("--")===0,r=Qd(n,t[n],s);n==="float"&&(n="cssFloat"),s?e.setProperty(n,r):e[n]=r}}var mf=X({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Qo(e,t){if(t){if(mf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(R(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(R(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(R(61))}if(t.style!=null&&typeof t.style!="object")throw Error(R(62))}}function Zo(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Xo=null;function Vi(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var ei=null,Wn=null,Un=null;function lc(e){if(e=ir(e)){if(typeof ei!="function")throw Error(R(280));var t=e.stateNode;t&&(t=La(t),ei(e.stateNode,e.type,t))}}function Xd(e){Wn?Un?Un.push(e):Un=[e]:Wn=e}function eu(){if(Wn){var e=Wn,t=Un;if(Un=Wn=null,lc(e),t)for(e=0;e<t.length;e++)lc(t[e])}}function tu(e,t){return e(t)}function nu(){}var lo=!1;function su(e,t,n){if(lo)return e(t,n);lo=!0;try{return tu(e,t,n)}finally{lo=!1,(Wn!==null||Un!==null)&&(nu(),eu())}}function Hs(e,t){var n=e.stateNode;if(n===null)return null;var s=La(n);if(s===null)return null;n=s[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(s=!s.disabled)||(e=e.type,s=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!s;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(R(231,t,typeof n));return n}var ti=!1;if(wt)try{var ds={};Object.defineProperty(ds,"passive",{get:function(){ti=!0}}),window.addEventListener("test",ds,ds),window.removeEventListener("test",ds,ds)}catch{ti=!1}function ff(e,t,n,s,r,o,i,l,c){var d=Array.prototype.slice.call(arguments,3);try{t.apply(n,d)}catch(u){this.onError(u)}}var _s=!1,ra=null,aa=!1,ni=null,hf={onError:function(e){_s=!0,ra=e}};function gf(e,t,n,s,r,o,i,l,c){_s=!1,ra=null,ff.apply(hf,arguments)}function bf(e,t,n,s,r,o,i,l,c){if(gf.apply(this,arguments),_s){if(_s){var d=ra;_s=!1,ra=null}else throw Error(R(198));aa||(aa=!0,ni=d)}}function kn(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function ru(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function cc(e){if(kn(e)!==e)throw Error(R(188))}function yf(e){var t=e.alternate;if(!t){if(t=kn(e),t===null)throw Error(R(188));return t!==e?null:e}for(var n=e,s=t;;){var r=n.return;if(r===null)break;var o=r.alternate;if(o===null){if(s=r.return,s!==null){n=s;continue}break}if(r.child===o.child){for(o=r.child;o;){if(o===n)return cc(r),e;if(o===s)return cc(r),t;o=o.sibling}throw Error(R(188))}if(n.return!==s.return)n=r,s=o;else{for(var i=!1,l=r.child;l;){if(l===n){i=!0,n=r,s=o;break}if(l===s){i=!0,s=r,n=o;break}l=l.sibling}if(!i){for(l=o.child;l;){if(l===n){i=!0,n=o,s=r;break}if(l===s){i=!0,s=o,n=r;break}l=l.sibling}if(!i)throw Error(R(189))}}if(n.alternate!==s)throw Error(R(190))}if(n.tag!==3)throw Error(R(188));return n.stateNode.current===n?e:t}function au(e){return e=yf(e),e!==null?ou(e):null}function ou(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=ou(e);if(t!==null)return t;e=e.sibling}return null}var iu=Be.unstable_scheduleCallback,dc=Be.unstable_cancelCallback,xf=Be.unstable_shouldYield,vf=Be.unstable_requestPaint,ne=Be.unstable_now,wf=Be.unstable_getCurrentPriorityLevel,Yi=Be.unstable_ImmediatePriority,lu=Be.unstable_UserBlockingPriority,oa=Be.unstable_NormalPriority,kf=Be.unstable_LowPriority,cu=Be.unstable_IdlePriority,Da=null,it=null;function Sf(e){if(it&&typeof it.onCommitFiberRoot=="function")try{it.onCommitFiberRoot(Da,e,void 0,(e.current.flags&128)===128)}catch{}}var Qe=Math.clz32?Math.clz32:jf,Nf=Math.log,Cf=Math.LN2;function jf(e){return e>>>=0,e===0?32:31-(Nf(e)/Cf|0)|0}var wr=64,kr=4194304;function js(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function ia(e,t){var n=e.pendingLanes;if(n===0)return 0;var s=0,r=e.suspendedLanes,o=e.pingedLanes,i=n&268435455;if(i!==0){var l=i&~r;l!==0?s=js(l):(o&=i,o!==0&&(s=js(o)))}else i=n&~r,i!==0?s=js(i):o!==0&&(s=js(o));if(s===0)return 0;if(t!==0&&t!==s&&!(t&r)&&(r=s&-s,o=t&-t,r>=o||r===16&&(o&4194240)!==0))return t;if(s&4&&(s|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=s;0<t;)n=31-Qe(t),r=1<<n,s|=e[n],t&=~r;return s}function Rf(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ef(e,t){for(var n=e.suspendedLanes,s=e.pingedLanes,r=e.expirationTimes,o=e.pendingLanes;0<o;){var i=31-Qe(o),l=1<<i,c=r[i];c===-1?(!(l&n)||l&s)&&(r[i]=Rf(l,t)):c<=t&&(e.expiredLanes|=l),o&=~l}}function si(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function du(){var e=wr;return wr<<=1,!(wr&4194240)&&(wr=64),e}function co(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ar(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Qe(t),e[t]=n}function _f(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var s=e.eventTimes;for(e=e.expirationTimes;0<n;){var r=31-Qe(n),o=1<<r;t[r]=0,s[r]=-1,e[r]=-1,n&=~o}}function Ji(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var s=31-Qe(n),r=1<<s;r&t|e[s]&t&&(e[s]|=t),n&=~r}}var q=0;function uu(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var pu,Qi,mu,fu,hu,ri=!1,Sr=[],Lt=null,Ot=null,Wt=null,qs=new Map,zs=new Map,Dt=[],Mf="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function uc(e,t){switch(e){case"focusin":case"focusout":Lt=null;break;case"dragenter":case"dragleave":Ot=null;break;case"mouseover":case"mouseout":Wt=null;break;case"pointerover":case"pointerout":qs.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":zs.delete(t.pointerId)}}function us(e,t,n,s,r,o){return e===null||e.nativeEvent!==o?(e={blockedOn:t,domEventName:n,eventSystemFlags:s,nativeEvent:o,targetContainers:[r]},t!==null&&(t=ir(t),t!==null&&Qi(t)),e):(e.eventSystemFlags|=s,t=e.targetContainers,r!==null&&t.indexOf(r)===-1&&t.push(r),e)}function Tf(e,t,n,s,r){switch(t){case"focusin":return Lt=us(Lt,e,t,n,s,r),!0;case"dragenter":return Ot=us(Ot,e,t,n,s,r),!0;case"mouseover":return Wt=us(Wt,e,t,n,s,r),!0;case"pointerover":var o=r.pointerId;return qs.set(o,us(qs.get(o)||null,e,t,n,s,r)),!0;case"gotpointercapture":return o=r.pointerId,zs.set(o,us(zs.get(o)||null,e,t,n,s,r)),!0}return!1}function gu(e){var t=dn(e.target);if(t!==null){var n=kn(t);if(n!==null){if(t=n.tag,t===13){if(t=ru(n),t!==null){e.blockedOn=t,hu(e.priority,function(){mu(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function qr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=ai(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var s=new n.constructor(n.type,n);Xo=s,n.target.dispatchEvent(s),Xo=null}else return t=ir(n),t!==null&&Qi(t),e.blockedOn=n,!1;t.shift()}return!0}function pc(e,t,n){qr(e)&&n.delete(t)}function Af(){ri=!1,Lt!==null&&qr(Lt)&&(Lt=null),Ot!==null&&qr(Ot)&&(Ot=null),Wt!==null&&qr(Wt)&&(Wt=null),qs.forEach(pc),zs.forEach(pc)}function ps(e,t){e.blockedOn===t&&(e.blockedOn=null,ri||(ri=!0,Be.unstable_scheduleCallback(Be.unstable_NormalPriority,Af)))}function $s(e){function t(r){return ps(r,e)}if(0<Sr.length){ps(Sr[0],e);for(var n=1;n<Sr.length;n++){var s=Sr[n];s.blockedOn===e&&(s.blockedOn=null)}}for(Lt!==null&&ps(Lt,e),Ot!==null&&ps(Ot,e),Wt!==null&&ps(Wt,e),qs.forEach(t),zs.forEach(t),n=0;n<Dt.length;n++)s=Dt[n],s.blockedOn===e&&(s.blockedOn=null);for(;0<Dt.length&&(n=Dt[0],n.blockedOn===null);)gu(n),n.blockedOn===null&&Dt.shift()}var Hn=Et.ReactCurrentBatchConfig,la=!0;function Pf(e,t,n,s){var r=q,o=Hn.transition;Hn.transition=null;try{q=1,Zi(e,t,n,s)}finally{q=r,Hn.transition=o}}function Df(e,t,n,s){var r=q,o=Hn.transition;Hn.transition=null;try{q=4,Zi(e,t,n,s)}finally{q=r,Hn.transition=o}}function Zi(e,t,n,s){if(la){var r=ai(e,t,n,s);if(r===null)vo(e,t,s,ca,n),uc(e,s);else if(Tf(r,e,t,n,s))s.stopPropagation();else if(uc(e,s),t&4&&-1<Mf.indexOf(e)){for(;r!==null;){var o=ir(r);if(o!==null&&pu(o),o=ai(e,t,n,s),o===null&&vo(e,t,s,ca,n),o===r)break;r=o}r!==null&&s.stopPropagation()}else vo(e,t,s,null,n)}}var ca=null;function ai(e,t,n,s){if(ca=null,e=Vi(s),e=dn(e),e!==null)if(t=kn(e),t===null)e=null;else if(n=t.tag,n===13){if(e=ru(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return ca=e,null}function bu(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(wf()){case Yi:return 1;case lu:return 4;case oa:case kf:return 16;case cu:return 536870912;default:return 16}default:return 16}}var It=null,Xi=null,zr=null;function yu(){if(zr)return zr;var e,t=Xi,n=t.length,s,r="value"in It?It.value:It.textContent,o=r.length;for(e=0;e<n&&t[e]===r[e];e++);var i=n-e;for(s=1;s<=i&&t[n-s]===r[o-s];s++);return zr=r.slice(e,1<s?1-s:void 0)}function $r(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Nr(){return!0}function mc(){return!1}function Fe(e){function t(n,s,r,o,i){this._reactName=n,this._targetInst=r,this.type=s,this.nativeEvent=o,this.target=i,this.currentTarget=null;for(var l in e)e.hasOwnProperty(l)&&(n=e[l],this[l]=n?n(o):o[l]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?Nr:mc,this.isPropagationStopped=mc,this}return X(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Nr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Nr)},persist:function(){},isPersistent:Nr}),t}var es={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},el=Fe(es),or=X({},es,{view:0,detail:0}),Bf=Fe(or),uo,po,ms,Ba=X({},or,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:tl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ms&&(ms&&e.type==="mousemove"?(uo=e.screenX-ms.screenX,po=e.screenY-ms.screenY):po=uo=0,ms=e),uo)},movementY:function(e){return"movementY"in e?e.movementY:po}}),fc=Fe(Ba),If=X({},Ba,{dataTransfer:0}),Ff=Fe(If),Lf=X({},or,{relatedTarget:0}),mo=Fe(Lf),Of=X({},es,{animationName:0,elapsedTime:0,pseudoElement:0}),Wf=Fe(Of),Uf=X({},es,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Hf=Fe(Uf),qf=X({},es,{data:0}),hc=Fe(qf),zf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},$f={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Gf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Kf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Gf[e])?!!t[e]:!1}function tl(){return Kf}var Vf=X({},or,{key:function(e){if(e.key){var t=zf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=$r(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?$f[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:tl,charCode:function(e){return e.type==="keypress"?$r(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?$r(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Yf=Fe(Vf),Jf=X({},Ba,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),gc=Fe(Jf),Qf=X({},or,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:tl}),Zf=Fe(Qf),Xf=X({},es,{propertyName:0,elapsedTime:0,pseudoElement:0}),eh=Fe(Xf),th=X({},Ba,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),nh=Fe(th),sh=[9,13,27,32],nl=wt&&"CompositionEvent"in window,Ms=null;wt&&"documentMode"in document&&(Ms=document.documentMode);var rh=wt&&"TextEvent"in window&&!Ms,xu=wt&&(!nl||Ms&&8<Ms&&11>=Ms),bc=" ",yc=!1;function vu(e,t){switch(e){case"keyup":return sh.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function wu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var _n=!1;function ah(e,t){switch(e){case"compositionend":return wu(t);case"keypress":return t.which!==32?null:(yc=!0,bc);case"textInput":return e=t.data,e===bc&&yc?null:e;default:return null}}function oh(e,t){if(_n)return e==="compositionend"||!nl&&vu(e,t)?(e=yu(),zr=Xi=It=null,_n=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return xu&&t.locale!=="ko"?null:t.data;default:return null}}var ih={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function xc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!ih[e.type]:t==="textarea"}function ku(e,t,n,s){Xd(s),t=da(t,"onChange"),0<t.length&&(n=new el("onChange","change",null,n,s),e.push({event:n,listeners:t}))}var Ts=null,Gs=null;function lh(e){Pu(e,0)}function Ia(e){var t=An(e);if(Gd(t))return e}function ch(e,t){if(e==="change")return t}var Su=!1;if(wt){var fo;if(wt){var ho="oninput"in document;if(!ho){var vc=document.createElement("div");vc.setAttribute("oninput","return;"),ho=typeof vc.oninput=="function"}fo=ho}else fo=!1;Su=fo&&(!document.documentMode||9<document.documentMode)}function wc(){Ts&&(Ts.detachEvent("onpropertychange",Nu),Gs=Ts=null)}function Nu(e){if(e.propertyName==="value"&&Ia(Gs)){var t=[];ku(t,Gs,e,Vi(e)),su(lh,t)}}function dh(e,t,n){e==="focusin"?(wc(),Ts=t,Gs=n,Ts.attachEvent("onpropertychange",Nu)):e==="focusout"&&wc()}function uh(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ia(Gs)}function ph(e,t){if(e==="click")return Ia(t)}function mh(e,t){if(e==="input"||e==="change")return Ia(t)}function fh(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var et=typeof Object.is=="function"?Object.is:fh;function Ks(e,t){if(et(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),s=Object.keys(t);if(n.length!==s.length)return!1;for(s=0;s<n.length;s++){var r=n[s];if(!Uo.call(t,r)||!et(e[r],t[r]))return!1}return!0}function kc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Sc(e,t){var n=kc(e);e=0;for(var s;n;){if(n.nodeType===3){if(s=e+n.textContent.length,e<=t&&s>=t)return{node:n,offset:t-e};e=s}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=kc(n)}}function Cu(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Cu(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function ju(){for(var e=window,t=sa();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=sa(e.document)}return t}function sl(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function hh(e){var t=ju(),n=e.focusedElem,s=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Cu(n.ownerDocument.documentElement,n)){if(s!==null&&sl(n)){if(t=s.start,e=s.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var r=n.textContent.length,o=Math.min(s.start,r);s=s.end===void 0?o:Math.min(s.end,r),!e.extend&&o>s&&(r=s,s=o,o=r),r=Sc(n,o);var i=Sc(n,s);r&&i&&(e.rangeCount!==1||e.anchorNode!==r.node||e.anchorOffset!==r.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(r.node,r.offset),e.removeAllRanges(),o>s?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var gh=wt&&"documentMode"in document&&11>=document.documentMode,Mn=null,oi=null,As=null,ii=!1;function Nc(e,t,n){var s=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ii||Mn==null||Mn!==sa(s)||(s=Mn,"selectionStart"in s&&sl(s)?s={start:s.selectionStart,end:s.selectionEnd}:(s=(s.ownerDocument&&s.ownerDocument.defaultView||window).getSelection(),s={anchorNode:s.anchorNode,anchorOffset:s.anchorOffset,focusNode:s.focusNode,focusOffset:s.focusOffset}),As&&Ks(As,s)||(As=s,s=da(oi,"onSelect"),0<s.length&&(t=new el("onSelect","select",null,t,n),e.push({event:t,listeners:s}),t.target=Mn)))}function Cr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Tn={animationend:Cr("Animation","AnimationEnd"),animationiteration:Cr("Animation","AnimationIteration"),animationstart:Cr("Animation","AnimationStart"),transitionend:Cr("Transition","TransitionEnd")},go={},Ru={};wt&&(Ru=document.createElement("div").style,"AnimationEvent"in window||(delete Tn.animationend.animation,delete Tn.animationiteration.animation,delete Tn.animationstart.animation),"TransitionEvent"in window||delete Tn.transitionend.transition);function Fa(e){if(go[e])return go[e];if(!Tn[e])return e;var t=Tn[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Ru)return go[e]=t[n];return e}var Eu=Fa("animationend"),_u=Fa("animationiteration"),Mu=Fa("animationstart"),Tu=Fa("transitionend"),Au=new Map,Cc="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Yt(e,t){Au.set(e,t),wn(t,[e])}for(var bo=0;bo<Cc.length;bo++){var yo=Cc[bo],bh=yo.toLowerCase(),yh=yo[0].toUpperCase()+yo.slice(1);Yt(bh,"on"+yh)}Yt(Eu,"onAnimationEnd");Yt(_u,"onAnimationIteration");Yt(Mu,"onAnimationStart");Yt("dblclick","onDoubleClick");Yt("focusin","onFocus");Yt("focusout","onBlur");Yt(Tu,"onTransitionEnd");$n("onMouseEnter",["mouseout","mouseover"]);$n("onMouseLeave",["mouseout","mouseover"]);$n("onPointerEnter",["pointerout","pointerover"]);$n("onPointerLeave",["pointerout","pointerover"]);wn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));wn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));wn("onBeforeInput",["compositionend","keypress","textInput","paste"]);wn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));wn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));wn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Rs="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),xh=new Set("cancel close invalid load scroll toggle".split(" ").concat(Rs));function jc(e,t,n){var s=e.type||"unknown-event";e.currentTarget=n,bf(s,t,void 0,e),e.currentTarget=null}function Pu(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var s=e[n],r=s.event;s=s.listeners;e:{var o=void 0;if(t)for(var i=s.length-1;0<=i;i--){var l=s[i],c=l.instance,d=l.currentTarget;if(l=l.listener,c!==o&&r.isPropagationStopped())break e;jc(r,l,d),o=c}else for(i=0;i<s.length;i++){if(l=s[i],c=l.instance,d=l.currentTarget,l=l.listener,c!==o&&r.isPropagationStopped())break e;jc(r,l,d),o=c}}}if(aa)throw e=ni,aa=!1,ni=null,e}function K(e,t){var n=t[pi];n===void 0&&(n=t[pi]=new Set);var s=e+"__bubble";n.has(s)||(Du(t,e,2,!1),n.add(s))}function xo(e,t,n){var s=0;t&&(s|=4),Du(n,e,s,t)}var jr="_reactListening"+Math.random().toString(36).slice(2);function Vs(e){if(!e[jr]){e[jr]=!0,Ud.forEach(function(n){n!=="selectionchange"&&(xh.has(n)||xo(n,!1,e),xo(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[jr]||(t[jr]=!0,xo("selectionchange",!1,t))}}function Du(e,t,n,s){switch(bu(t)){case 1:var r=Pf;break;case 4:r=Df;break;default:r=Zi}n=r.bind(null,t,n,e),r=void 0,!ti||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(r=!0),s?r!==void 0?e.addEventListener(t,n,{capture:!0,passive:r}):e.addEventListener(t,n,!0):r!==void 0?e.addEventListener(t,n,{passive:r}):e.addEventListener(t,n,!1)}function vo(e,t,n,s,r){var o=s;if(!(t&1)&&!(t&2)&&s!==null)e:for(;;){if(s===null)return;var i=s.tag;if(i===3||i===4){var l=s.stateNode.containerInfo;if(l===r||l.nodeType===8&&l.parentNode===r)break;if(i===4)for(i=s.return;i!==null;){var c=i.tag;if((c===3||c===4)&&(c=i.stateNode.containerInfo,c===r||c.nodeType===8&&c.parentNode===r))return;i=i.return}for(;l!==null;){if(i=dn(l),i===null)return;if(c=i.tag,c===5||c===6){s=o=i;continue e}l=l.parentNode}}s=s.return}su(function(){var d=o,u=Vi(n),m=[];e:{var f=Au.get(e);if(f!==void 0){var b=el,w=e;switch(e){case"keypress":if($r(n)===0)break e;case"keydown":case"keyup":b=Yf;break;case"focusin":w="focus",b=mo;break;case"focusout":w="blur",b=mo;break;case"beforeblur":case"afterblur":b=mo;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":b=fc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":b=Ff;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":b=Zf;break;case Eu:case _u:case Mu:b=Wf;break;case Tu:b=eh;break;case"scroll":b=Bf;break;case"wheel":b=nh;break;case"copy":case"cut":case"paste":b=Hf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":b=gc}var x=(t&4)!==0,S=!x&&e==="scroll",p=x?f!==null?f+"Capture":null:f;x=[];for(var h=d,g;h!==null;){g=h;var v=g.stateNode;if(g.tag===5&&v!==null&&(g=v,p!==null&&(v=Hs(h,p),v!=null&&x.push(Ys(h,v,g)))),S)break;h=h.return}0<x.length&&(f=new b(f,w,null,n,u),m.push({event:f,listeners:x}))}}if(!(t&7)){e:{if(f=e==="mouseover"||e==="pointerover",b=e==="mouseout"||e==="pointerout",f&&n!==Xo&&(w=n.relatedTarget||n.fromElement)&&(dn(w)||w[kt]))break e;if((b||f)&&(f=u.window===u?u:(f=u.ownerDocument)?f.defaultView||f.parentWindow:window,b?(w=n.relatedTarget||n.toElement,b=d,w=w?dn(w):null,w!==null&&(S=kn(w),w!==S||w.tag!==5&&w.tag!==6)&&(w=null)):(b=null,w=d),b!==w)){if(x=fc,v="onMouseLeave",p="onMouseEnter",h="mouse",(e==="pointerout"||e==="pointerover")&&(x=gc,v="onPointerLeave",p="onPointerEnter",h="pointer"),S=b==null?f:An(b),g=w==null?f:An(w),f=new x(v,h+"leave",b,n,u),f.target=S,f.relatedTarget=g,v=null,dn(u)===d&&(x=new x(p,h+"enter",w,n,u),x.target=g,x.relatedTarget=S,v=x),S=v,b&&w)t:{for(x=b,p=w,h=0,g=x;g;g=Cn(g))h++;for(g=0,v=p;v;v=Cn(v))g++;for(;0<h-g;)x=Cn(x),h--;for(;0<g-h;)p=Cn(p),g--;for(;h--;){if(x===p||p!==null&&x===p.alternate)break t;x=Cn(x),p=Cn(p)}x=null}else x=null;b!==null&&Rc(m,f,b,x,!1),w!==null&&S!==null&&Rc(m,S,w,x,!0)}}e:{if(f=d?An(d):window,b=f.nodeName&&f.nodeName.toLowerCase(),b==="select"||b==="input"&&f.type==="file")var C=ch;else if(xc(f))if(Su)C=mh;else{C=uh;var E=dh}else(b=f.nodeName)&&b.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(C=ph);if(C&&(C=C(e,d))){ku(m,C,n,u);break e}E&&E(e,f,d),e==="focusout"&&(E=f._wrapperState)&&E.controlled&&f.type==="number"&&Vo(f,"number",f.value)}switch(E=d?An(d):window,e){case"focusin":(xc(E)||E.contentEditable==="true")&&(Mn=E,oi=d,As=null);break;case"focusout":As=oi=Mn=null;break;case"mousedown":ii=!0;break;case"contextmenu":case"mouseup":case"dragend":ii=!1,Nc(m,n,u);break;case"selectionchange":if(gh)break;case"keydown":case"keyup":Nc(m,n,u)}var _;if(nl)e:{switch(e){case"compositionstart":var A="onCompositionStart";break e;case"compositionend":A="onCompositionEnd";break e;case"compositionupdate":A="onCompositionUpdate";break e}A=void 0}else _n?vu(e,n)&&(A="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(A="onCompositionStart");A&&(xu&&n.locale!=="ko"&&(_n||A!=="onCompositionStart"?A==="onCompositionEnd"&&_n&&(_=yu()):(It=u,Xi="value"in It?It.value:It.textContent,_n=!0)),E=da(d,A),0<E.length&&(A=new hc(A,e,null,n,u),m.push({event:A,listeners:E}),_?A.data=_:(_=wu(n),_!==null&&(A.data=_)))),(_=rh?ah(e,n):oh(e,n))&&(d=da(d,"onBeforeInput"),0<d.length&&(u=new hc("onBeforeInput","beforeinput",null,n,u),m.push({event:u,listeners:d}),u.data=_))}Pu(m,t)})}function Ys(e,t,n){return{instance:e,listener:t,currentTarget:n}}function da(e,t){for(var n=t+"Capture",s=[];e!==null;){var r=e,o=r.stateNode;r.tag===5&&o!==null&&(r=o,o=Hs(e,n),o!=null&&s.unshift(Ys(e,o,r)),o=Hs(e,t),o!=null&&s.push(Ys(e,o,r))),e=e.return}return s}function Cn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Rc(e,t,n,s,r){for(var o=t._reactName,i=[];n!==null&&n!==s;){var l=n,c=l.alternate,d=l.stateNode;if(c!==null&&c===s)break;l.tag===5&&d!==null&&(l=d,r?(c=Hs(n,o),c!=null&&i.unshift(Ys(n,c,l))):r||(c=Hs(n,o),c!=null&&i.push(Ys(n,c,l)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var vh=/\r\n?/g,wh=/\u0000|\uFFFD/g;function Ec(e){return(typeof e=="string"?e:""+e).replace(vh,`
`).replace(wh,"")}function Rr(e,t,n){if(t=Ec(t),Ec(e)!==t&&n)throw Error(R(425))}function ua(){}var li=null,ci=null;function di(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var ui=typeof setTimeout=="function"?setTimeout:void 0,kh=typeof clearTimeout=="function"?clearTimeout:void 0,_c=typeof Promise=="function"?Promise:void 0,Sh=typeof queueMicrotask=="function"?queueMicrotask:typeof _c<"u"?function(e){return _c.resolve(null).then(e).catch(Nh)}:ui;function Nh(e){setTimeout(function(){throw e})}function wo(e,t){var n=t,s=0;do{var r=n.nextSibling;if(e.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(s===0){e.removeChild(r),$s(t);return}s--}else n!=="$"&&n!=="$?"&&n!=="$!"||s++;n=r}while(n);$s(t)}function Ut(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Mc(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var ts=Math.random().toString(36).slice(2),ot="__reactFiber$"+ts,Js="__reactProps$"+ts,kt="__reactContainer$"+ts,pi="__reactEvents$"+ts,Ch="__reactListeners$"+ts,jh="__reactHandles$"+ts;function dn(e){var t=e[ot];if(t)return t;for(var n=e.parentNode;n;){if(t=n[kt]||n[ot]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Mc(e);e!==null;){if(n=e[ot])return n;e=Mc(e)}return t}e=n,n=e.parentNode}return null}function ir(e){return e=e[ot]||e[kt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function An(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(R(33))}function La(e){return e[Js]||null}var mi=[],Pn=-1;function Jt(e){return{current:e}}function V(e){0>Pn||(e.current=mi[Pn],mi[Pn]=null,Pn--)}function G(e,t){Pn++,mi[Pn]=e.current,e.current=t}var Kt={},ge=Jt(Kt),Re=Jt(!1),hn=Kt;function Gn(e,t){var n=e.type.contextTypes;if(!n)return Kt;var s=e.stateNode;if(s&&s.__reactInternalMemoizedUnmaskedChildContext===t)return s.__reactInternalMemoizedMaskedChildContext;var r={},o;for(o in n)r[o]=t[o];return s&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=r),r}function Ee(e){return e=e.childContextTypes,e!=null}function pa(){V(Re),V(ge)}function Tc(e,t,n){if(ge.current!==Kt)throw Error(R(168));G(ge,t),G(Re,n)}function Bu(e,t,n){var s=e.stateNode;if(t=t.childContextTypes,typeof s.getChildContext!="function")return n;s=s.getChildContext();for(var r in s)if(!(r in t))throw Error(R(108,df(e)||"Unknown",r));return X({},n,s)}function ma(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Kt,hn=ge.current,G(ge,e),G(Re,Re.current),!0}function Ac(e,t,n){var s=e.stateNode;if(!s)throw Error(R(169));n?(e=Bu(e,t,hn),s.__reactInternalMemoizedMergedChildContext=e,V(Re),V(ge),G(ge,e)):V(Re),G(Re,n)}var bt=null,Oa=!1,ko=!1;function Iu(e){bt===null?bt=[e]:bt.push(e)}function Rh(e){Oa=!0,Iu(e)}function Qt(){if(!ko&&bt!==null){ko=!0;var e=0,t=q;try{var n=bt;for(q=1;e<n.length;e++){var s=n[e];do s=s(!0);while(s!==null)}bt=null,Oa=!1}catch(r){throw bt!==null&&(bt=bt.slice(e+1)),iu(Yi,Qt),r}finally{q=t,ko=!1}}return null}var Dn=[],Bn=0,fa=null,ha=0,Oe=[],We=0,gn=null,yt=1,xt="";function en(e,t){Dn[Bn++]=ha,Dn[Bn++]=fa,fa=e,ha=t}function Fu(e,t,n){Oe[We++]=yt,Oe[We++]=xt,Oe[We++]=gn,gn=e;var s=yt;e=xt;var r=32-Qe(s)-1;s&=~(1<<r),n+=1;var o=32-Qe(t)+r;if(30<o){var i=r-r%5;o=(s&(1<<i)-1).toString(32),s>>=i,r-=i,yt=1<<32-Qe(t)+r|n<<r|s,xt=o+e}else yt=1<<o|n<<r|s,xt=e}function rl(e){e.return!==null&&(en(e,1),Fu(e,1,0))}function al(e){for(;e===fa;)fa=Dn[--Bn],Dn[Bn]=null,ha=Dn[--Bn],Dn[Bn]=null;for(;e===gn;)gn=Oe[--We],Oe[We]=null,xt=Oe[--We],Oe[We]=null,yt=Oe[--We],Oe[We]=null}var De=null,Pe=null,Y=!1,Je=null;function Lu(e,t){var n=He(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Pc(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,De=e,Pe=Ut(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,De=e,Pe=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=gn!==null?{id:yt,overflow:xt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=He(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,De=e,Pe=null,!0):!1;default:return!1}}function fi(e){return(e.mode&1)!==0&&(e.flags&128)===0}function hi(e){if(Y){var t=Pe;if(t){var n=t;if(!Pc(e,t)){if(fi(e))throw Error(R(418));t=Ut(n.nextSibling);var s=De;t&&Pc(e,t)?Lu(s,n):(e.flags=e.flags&-4097|2,Y=!1,De=e)}}else{if(fi(e))throw Error(R(418));e.flags=e.flags&-4097|2,Y=!1,De=e}}}function Dc(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;De=e}function Er(e){if(e!==De)return!1;if(!Y)return Dc(e),Y=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!di(e.type,e.memoizedProps)),t&&(t=Pe)){if(fi(e))throw Ou(),Error(R(418));for(;t;)Lu(e,t),t=Ut(t.nextSibling)}if(Dc(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(R(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){Pe=Ut(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}Pe=null}}else Pe=De?Ut(e.stateNode.nextSibling):null;return!0}function Ou(){for(var e=Pe;e;)e=Ut(e.nextSibling)}function Kn(){Pe=De=null,Y=!1}function ol(e){Je===null?Je=[e]:Je.push(e)}var Eh=Et.ReactCurrentBatchConfig;function fs(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(R(309));var s=n.stateNode}if(!s)throw Error(R(147,e));var r=s,o=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===o?t.ref:(t=function(i){var l=r.refs;i===null?delete l[o]:l[o]=i},t._stringRef=o,t)}if(typeof e!="string")throw Error(R(284));if(!n._owner)throw Error(R(290,e))}return e}function _r(e,t){throw e=Object.prototype.toString.call(t),Error(R(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Bc(e){var t=e._init;return t(e._payload)}function Wu(e){function t(p,h){if(e){var g=p.deletions;g===null?(p.deletions=[h],p.flags|=16):g.push(h)}}function n(p,h){if(!e)return null;for(;h!==null;)t(p,h),h=h.sibling;return null}function s(p,h){for(p=new Map;h!==null;)h.key!==null?p.set(h.key,h):p.set(h.index,h),h=h.sibling;return p}function r(p,h){return p=$t(p,h),p.index=0,p.sibling=null,p}function o(p,h,g){return p.index=g,e?(g=p.alternate,g!==null?(g=g.index,g<h?(p.flags|=2,h):g):(p.flags|=2,h)):(p.flags|=1048576,h)}function i(p){return e&&p.alternate===null&&(p.flags|=2),p}function l(p,h,g,v){return h===null||h.tag!==6?(h=_o(g,p.mode,v),h.return=p,h):(h=r(h,g),h.return=p,h)}function c(p,h,g,v){var C=g.type;return C===En?u(p,h,g.props.children,v,g.key):h!==null&&(h.elementType===C||typeof C=="object"&&C!==null&&C.$$typeof===At&&Bc(C)===h.type)?(v=r(h,g.props),v.ref=fs(p,h,g),v.return=p,v):(v=Zr(g.type,g.key,g.props,null,p.mode,v),v.ref=fs(p,h,g),v.return=p,v)}function d(p,h,g,v){return h===null||h.tag!==4||h.stateNode.containerInfo!==g.containerInfo||h.stateNode.implementation!==g.implementation?(h=Mo(g,p.mode,v),h.return=p,h):(h=r(h,g.children||[]),h.return=p,h)}function u(p,h,g,v,C){return h===null||h.tag!==7?(h=fn(g,p.mode,v,C),h.return=p,h):(h=r(h,g),h.return=p,h)}function m(p,h,g){if(typeof h=="string"&&h!==""||typeof h=="number")return h=_o(""+h,p.mode,g),h.return=p,h;if(typeof h=="object"&&h!==null){switch(h.$$typeof){case yr:return g=Zr(h.type,h.key,h.props,null,p.mode,g),g.ref=fs(p,null,h),g.return=p,g;case Rn:return h=Mo(h,p.mode,g),h.return=p,h;case At:var v=h._init;return m(p,v(h._payload),g)}if(Cs(h)||cs(h))return h=fn(h,p.mode,g,null),h.return=p,h;_r(p,h)}return null}function f(p,h,g,v){var C=h!==null?h.key:null;if(typeof g=="string"&&g!==""||typeof g=="number")return C!==null?null:l(p,h,""+g,v);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case yr:return g.key===C?c(p,h,g,v):null;case Rn:return g.key===C?d(p,h,g,v):null;case At:return C=g._init,f(p,h,C(g._payload),v)}if(Cs(g)||cs(g))return C!==null?null:u(p,h,g,v,null);_r(p,g)}return null}function b(p,h,g,v,C){if(typeof v=="string"&&v!==""||typeof v=="number")return p=p.get(g)||null,l(h,p,""+v,C);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case yr:return p=p.get(v.key===null?g:v.key)||null,c(h,p,v,C);case Rn:return p=p.get(v.key===null?g:v.key)||null,d(h,p,v,C);case At:var E=v._init;return b(p,h,g,E(v._payload),C)}if(Cs(v)||cs(v))return p=p.get(g)||null,u(h,p,v,C,null);_r(h,v)}return null}function w(p,h,g,v){for(var C=null,E=null,_=h,A=h=0,N=null;_!==null&&A<g.length;A++){_.index>A?(N=_,_=null):N=_.sibling;var k=f(p,_,g[A],v);if(k===null){_===null&&(_=N);break}e&&_&&k.alternate===null&&t(p,_),h=o(k,h,A),E===null?C=k:E.sibling=k,E=k,_=N}if(A===g.length)return n(p,_),Y&&en(p,A),C;if(_===null){for(;A<g.length;A++)_=m(p,g[A],v),_!==null&&(h=o(_,h,A),E===null?C=_:E.sibling=_,E=_);return Y&&en(p,A),C}for(_=s(p,_);A<g.length;A++)N=b(_,p,A,g[A],v),N!==null&&(e&&N.alternate!==null&&_.delete(N.key===null?A:N.key),h=o(N,h,A),E===null?C=N:E.sibling=N,E=N);return e&&_.forEach(function(j){return t(p,j)}),Y&&en(p,A),C}function x(p,h,g,v){var C=cs(g);if(typeof C!="function")throw Error(R(150));if(g=C.call(g),g==null)throw Error(R(151));for(var E=C=null,_=h,A=h=0,N=null,k=g.next();_!==null&&!k.done;A++,k=g.next()){_.index>A?(N=_,_=null):N=_.sibling;var j=f(p,_,k.value,v);if(j===null){_===null&&(_=N);break}e&&_&&j.alternate===null&&t(p,_),h=o(j,h,A),E===null?C=j:E.sibling=j,E=j,_=N}if(k.done)return n(p,_),Y&&en(p,A),C;if(_===null){for(;!k.done;A++,k=g.next())k=m(p,k.value,v),k!==null&&(h=o(k,h,A),E===null?C=k:E.sibling=k,E=k);return Y&&en(p,A),C}for(_=s(p,_);!k.done;A++,k=g.next())k=b(_,p,A,k.value,v),k!==null&&(e&&k.alternate!==null&&_.delete(k.key===null?A:k.key),h=o(k,h,A),E===null?C=k:E.sibling=k,E=k);return e&&_.forEach(function(I){return t(p,I)}),Y&&en(p,A),C}function S(p,h,g,v){if(typeof g=="object"&&g!==null&&g.type===En&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case yr:e:{for(var C=g.key,E=h;E!==null;){if(E.key===C){if(C=g.type,C===En){if(E.tag===7){n(p,E.sibling),h=r(E,g.props.children),h.return=p,p=h;break e}}else if(E.elementType===C||typeof C=="object"&&C!==null&&C.$$typeof===At&&Bc(C)===E.type){n(p,E.sibling),h=r(E,g.props),h.ref=fs(p,E,g),h.return=p,p=h;break e}n(p,E);break}else t(p,E);E=E.sibling}g.type===En?(h=fn(g.props.children,p.mode,v,g.key),h.return=p,p=h):(v=Zr(g.type,g.key,g.props,null,p.mode,v),v.ref=fs(p,h,g),v.return=p,p=v)}return i(p);case Rn:e:{for(E=g.key;h!==null;){if(h.key===E)if(h.tag===4&&h.stateNode.containerInfo===g.containerInfo&&h.stateNode.implementation===g.implementation){n(p,h.sibling),h=r(h,g.children||[]),h.return=p,p=h;break e}else{n(p,h);break}else t(p,h);h=h.sibling}h=Mo(g,p.mode,v),h.return=p,p=h}return i(p);case At:return E=g._init,S(p,h,E(g._payload),v)}if(Cs(g))return w(p,h,g,v);if(cs(g))return x(p,h,g,v);_r(p,g)}return typeof g=="string"&&g!==""||typeof g=="number"?(g=""+g,h!==null&&h.tag===6?(n(p,h.sibling),h=r(h,g),h.return=p,p=h):(n(p,h),h=_o(g,p.mode,v),h.return=p,p=h),i(p)):n(p,h)}return S}var Vn=Wu(!0),Uu=Wu(!1),ga=Jt(null),ba=null,In=null,il=null;function ll(){il=In=ba=null}function cl(e){var t=ga.current;V(ga),e._currentValue=t}function gi(e,t,n){for(;e!==null;){var s=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,s!==null&&(s.childLanes|=t)):s!==null&&(s.childLanes&t)!==t&&(s.childLanes|=t),e===n)break;e=e.return}}function qn(e,t){ba=e,il=In=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(je=!0),e.firstContext=null)}function $e(e){var t=e._currentValue;if(il!==e)if(e={context:e,memoizedValue:t,next:null},In===null){if(ba===null)throw Error(R(308));In=e,ba.dependencies={lanes:0,firstContext:e}}else In=In.next=e;return t}var un=null;function dl(e){un===null?un=[e]:un.push(e)}function Hu(e,t,n,s){var r=t.interleaved;return r===null?(n.next=n,dl(t)):(n.next=r.next,r.next=n),t.interleaved=n,St(e,s)}function St(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var Pt=!1;function ul(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function qu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function vt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Ht(e,t,n){var s=e.updateQueue;if(s===null)return null;if(s=s.shared,H&2){var r=s.pending;return r===null?t.next=t:(t.next=r.next,r.next=t),s.pending=t,St(e,n)}return r=s.interleaved,r===null?(t.next=t,dl(s)):(t.next=r.next,r.next=t),s.interleaved=t,St(e,n)}function Gr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var s=t.lanes;s&=e.pendingLanes,n|=s,t.lanes=n,Ji(e,n)}}function Ic(e,t){var n=e.updateQueue,s=e.alternate;if(s!==null&&(s=s.updateQueue,n===s)){var r=null,o=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};o===null?r=o=i:o=o.next=i,n=n.next}while(n!==null);o===null?r=o=t:o=o.next=t}else r=o=t;n={baseState:s.baseState,firstBaseUpdate:r,lastBaseUpdate:o,shared:s.shared,effects:s.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function ya(e,t,n,s){var r=e.updateQueue;Pt=!1;var o=r.firstBaseUpdate,i=r.lastBaseUpdate,l=r.shared.pending;if(l!==null){r.shared.pending=null;var c=l,d=c.next;c.next=null,i===null?o=d:i.next=d,i=c;var u=e.alternate;u!==null&&(u=u.updateQueue,l=u.lastBaseUpdate,l!==i&&(l===null?u.firstBaseUpdate=d:l.next=d,u.lastBaseUpdate=c))}if(o!==null){var m=r.baseState;i=0,u=d=c=null,l=o;do{var f=l.lane,b=l.eventTime;if((s&f)===f){u!==null&&(u=u.next={eventTime:b,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var w=e,x=l;switch(f=t,b=n,x.tag){case 1:if(w=x.payload,typeof w=="function"){m=w.call(b,m,f);break e}m=w;break e;case 3:w.flags=w.flags&-65537|128;case 0:if(w=x.payload,f=typeof w=="function"?w.call(b,m,f):w,f==null)break e;m=X({},m,f);break e;case 2:Pt=!0}}l.callback!==null&&l.lane!==0&&(e.flags|=64,f=r.effects,f===null?r.effects=[l]:f.push(l))}else b={eventTime:b,lane:f,tag:l.tag,payload:l.payload,callback:l.callback,next:null},u===null?(d=u=b,c=m):u=u.next=b,i|=f;if(l=l.next,l===null){if(l=r.shared.pending,l===null)break;f=l,l=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(u===null&&(c=m),r.baseState=c,r.firstBaseUpdate=d,r.lastBaseUpdate=u,t=r.shared.interleaved,t!==null){r=t;do i|=r.lane,r=r.next;while(r!==t)}else o===null&&(r.shared.lanes=0);yn|=i,e.lanes=i,e.memoizedState=m}}function Fc(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var s=e[t],r=s.callback;if(r!==null){if(s.callback=null,s=n,typeof r!="function")throw Error(R(191,r));r.call(s)}}}var lr={},lt=Jt(lr),Qs=Jt(lr),Zs=Jt(lr);function pn(e){if(e===lr)throw Error(R(174));return e}function pl(e,t){switch(G(Zs,t),G(Qs,e),G(lt,lr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Jo(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Jo(t,e)}V(lt),G(lt,t)}function Yn(){V(lt),V(Qs),V(Zs)}function zu(e){pn(Zs.current);var t=pn(lt.current),n=Jo(t,e.type);t!==n&&(G(Qs,e),G(lt,n))}function ml(e){Qs.current===e&&(V(lt),V(Qs))}var Q=Jt(0);function xa(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var So=[];function fl(){for(var e=0;e<So.length;e++)So[e]._workInProgressVersionPrimary=null;So.length=0}var Kr=Et.ReactCurrentDispatcher,No=Et.ReactCurrentBatchConfig,bn=0,Z=null,ae=null,le=null,va=!1,Ps=!1,Xs=0,_h=0;function me(){throw Error(R(321))}function hl(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!et(e[n],t[n]))return!1;return!0}function gl(e,t,n,s,r,o){if(bn=o,Z=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Kr.current=e===null||e.memoizedState===null?Ph:Dh,e=n(s,r),Ps){o=0;do{if(Ps=!1,Xs=0,25<=o)throw Error(R(301));o+=1,le=ae=null,t.updateQueue=null,Kr.current=Bh,e=n(s,r)}while(Ps)}if(Kr.current=wa,t=ae!==null&&ae.next!==null,bn=0,le=ae=Z=null,va=!1,t)throw Error(R(300));return e}function bl(){var e=Xs!==0;return Xs=0,e}function rt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return le===null?Z.memoizedState=le=e:le=le.next=e,le}function Ge(){if(ae===null){var e=Z.alternate;e=e!==null?e.memoizedState:null}else e=ae.next;var t=le===null?Z.memoizedState:le.next;if(t!==null)le=t,ae=e;else{if(e===null)throw Error(R(310));ae=e,e={memoizedState:ae.memoizedState,baseState:ae.baseState,baseQueue:ae.baseQueue,queue:ae.queue,next:null},le===null?Z.memoizedState=le=e:le=le.next=e}return le}function er(e,t){return typeof t=="function"?t(e):t}function Co(e){var t=Ge(),n=t.queue;if(n===null)throw Error(R(311));n.lastRenderedReducer=e;var s=ae,r=s.baseQueue,o=n.pending;if(o!==null){if(r!==null){var i=r.next;r.next=o.next,o.next=i}s.baseQueue=r=o,n.pending=null}if(r!==null){o=r.next,s=s.baseState;var l=i=null,c=null,d=o;do{var u=d.lane;if((bn&u)===u)c!==null&&(c=c.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),s=d.hasEagerState?d.eagerState:e(s,d.action);else{var m={lane:u,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};c===null?(l=c=m,i=s):c=c.next=m,Z.lanes|=u,yn|=u}d=d.next}while(d!==null&&d!==o);c===null?i=s:c.next=l,et(s,t.memoizedState)||(je=!0),t.memoizedState=s,t.baseState=i,t.baseQueue=c,n.lastRenderedState=s}if(e=n.interleaved,e!==null){r=e;do o=r.lane,Z.lanes|=o,yn|=o,r=r.next;while(r!==e)}else r===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function jo(e){var t=Ge(),n=t.queue;if(n===null)throw Error(R(311));n.lastRenderedReducer=e;var s=n.dispatch,r=n.pending,o=t.memoizedState;if(r!==null){n.pending=null;var i=r=r.next;do o=e(o,i.action),i=i.next;while(i!==r);et(o,t.memoizedState)||(je=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,s]}function $u(){}function Gu(e,t){var n=Z,s=Ge(),r=t(),o=!et(s.memoizedState,r);if(o&&(s.memoizedState=r,je=!0),s=s.queue,yl(Yu.bind(null,n,s,e),[e]),s.getSnapshot!==t||o||le!==null&&le.memoizedState.tag&1){if(n.flags|=2048,tr(9,Vu.bind(null,n,s,r,t),void 0,null),ce===null)throw Error(R(349));bn&30||Ku(n,t,r)}return r}function Ku(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Z.updateQueue,t===null?(t={lastEffect:null,stores:null},Z.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Vu(e,t,n,s){t.value=n,t.getSnapshot=s,Ju(t)&&Qu(e)}function Yu(e,t,n){return n(function(){Ju(t)&&Qu(e)})}function Ju(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!et(e,n)}catch{return!0}}function Qu(e){var t=St(e,1);t!==null&&Ze(t,e,1,-1)}function Lc(e){var t=rt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:er,lastRenderedState:e},t.queue=e,e=e.dispatch=Ah.bind(null,Z,e),[t.memoizedState,e]}function tr(e,t,n,s){return e={tag:e,create:t,destroy:n,deps:s,next:null},t=Z.updateQueue,t===null?(t={lastEffect:null,stores:null},Z.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(s=n.next,n.next=e,e.next=s,t.lastEffect=e)),e}function Zu(){return Ge().memoizedState}function Vr(e,t,n,s){var r=rt();Z.flags|=e,r.memoizedState=tr(1|t,n,void 0,s===void 0?null:s)}function Wa(e,t,n,s){var r=Ge();s=s===void 0?null:s;var o=void 0;if(ae!==null){var i=ae.memoizedState;if(o=i.destroy,s!==null&&hl(s,i.deps)){r.memoizedState=tr(t,n,o,s);return}}Z.flags|=e,r.memoizedState=tr(1|t,n,o,s)}function Oc(e,t){return Vr(8390656,8,e,t)}function yl(e,t){return Wa(2048,8,e,t)}function Xu(e,t){return Wa(4,2,e,t)}function ep(e,t){return Wa(4,4,e,t)}function tp(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function np(e,t,n){return n=n!=null?n.concat([e]):null,Wa(4,4,tp.bind(null,t,e),n)}function xl(){}function sp(e,t){var n=Ge();t=t===void 0?null:t;var s=n.memoizedState;return s!==null&&t!==null&&hl(t,s[1])?s[0]:(n.memoizedState=[e,t],e)}function rp(e,t){var n=Ge();t=t===void 0?null:t;var s=n.memoizedState;return s!==null&&t!==null&&hl(t,s[1])?s[0]:(e=e(),n.memoizedState=[e,t],e)}function ap(e,t,n){return bn&21?(et(n,t)||(n=du(),Z.lanes|=n,yn|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,je=!0),e.memoizedState=n)}function Mh(e,t){var n=q;q=n!==0&&4>n?n:4,e(!0);var s=No.transition;No.transition={};try{e(!1),t()}finally{q=n,No.transition=s}}function op(){return Ge().memoizedState}function Th(e,t,n){var s=zt(e);if(n={lane:s,action:n,hasEagerState:!1,eagerState:null,next:null},ip(e))lp(t,n);else if(n=Hu(e,t,n,s),n!==null){var r=xe();Ze(n,e,s,r),cp(n,t,s)}}function Ah(e,t,n){var s=zt(e),r={lane:s,action:n,hasEagerState:!1,eagerState:null,next:null};if(ip(e))lp(t,r);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=t.lastRenderedReducer,o!==null))try{var i=t.lastRenderedState,l=o(i,n);if(r.hasEagerState=!0,r.eagerState=l,et(l,i)){var c=t.interleaved;c===null?(r.next=r,dl(t)):(r.next=c.next,c.next=r),t.interleaved=r;return}}catch{}finally{}n=Hu(e,t,r,s),n!==null&&(r=xe(),Ze(n,e,s,r),cp(n,t,s))}}function ip(e){var t=e.alternate;return e===Z||t!==null&&t===Z}function lp(e,t){Ps=va=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function cp(e,t,n){if(n&4194240){var s=t.lanes;s&=e.pendingLanes,n|=s,t.lanes=n,Ji(e,n)}}var wa={readContext:$e,useCallback:me,useContext:me,useEffect:me,useImperativeHandle:me,useInsertionEffect:me,useLayoutEffect:me,useMemo:me,useReducer:me,useRef:me,useState:me,useDebugValue:me,useDeferredValue:me,useTransition:me,useMutableSource:me,useSyncExternalStore:me,useId:me,unstable_isNewReconciler:!1},Ph={readContext:$e,useCallback:function(e,t){return rt().memoizedState=[e,t===void 0?null:t],e},useContext:$e,useEffect:Oc,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Vr(4194308,4,tp.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Vr(4194308,4,e,t)},useInsertionEffect:function(e,t){return Vr(4,2,e,t)},useMemo:function(e,t){var n=rt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var s=rt();return t=n!==void 0?n(t):t,s.memoizedState=s.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},s.queue=e,e=e.dispatch=Th.bind(null,Z,e),[s.memoizedState,e]},useRef:function(e){var t=rt();return e={current:e},t.memoizedState=e},useState:Lc,useDebugValue:xl,useDeferredValue:function(e){return rt().memoizedState=e},useTransition:function(){var e=Lc(!1),t=e[0];return e=Mh.bind(null,e[1]),rt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var s=Z,r=rt();if(Y){if(n===void 0)throw Error(R(407));n=n()}else{if(n=t(),ce===null)throw Error(R(349));bn&30||Ku(s,t,n)}r.memoizedState=n;var o={value:n,getSnapshot:t};return r.queue=o,Oc(Yu.bind(null,s,o,e),[e]),s.flags|=2048,tr(9,Vu.bind(null,s,o,n,t),void 0,null),n},useId:function(){var e=rt(),t=ce.identifierPrefix;if(Y){var n=xt,s=yt;n=(s&~(1<<32-Qe(s)-1)).toString(32)+n,t=":"+t+"R"+n,n=Xs++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=_h++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Dh={readContext:$e,useCallback:sp,useContext:$e,useEffect:yl,useImperativeHandle:np,useInsertionEffect:Xu,useLayoutEffect:ep,useMemo:rp,useReducer:Co,useRef:Zu,useState:function(){return Co(er)},useDebugValue:xl,useDeferredValue:function(e){var t=Ge();return ap(t,ae.memoizedState,e)},useTransition:function(){var e=Co(er)[0],t=Ge().memoizedState;return[e,t]},useMutableSource:$u,useSyncExternalStore:Gu,useId:op,unstable_isNewReconciler:!1},Bh={readContext:$e,useCallback:sp,useContext:$e,useEffect:yl,useImperativeHandle:np,useInsertionEffect:Xu,useLayoutEffect:ep,useMemo:rp,useReducer:jo,useRef:Zu,useState:function(){return jo(er)},useDebugValue:xl,useDeferredValue:function(e){var t=Ge();return ae===null?t.memoizedState=e:ap(t,ae.memoizedState,e)},useTransition:function(){var e=jo(er)[0],t=Ge().memoizedState;return[e,t]},useMutableSource:$u,useSyncExternalStore:Gu,useId:op,unstable_isNewReconciler:!1};function Ve(e,t){if(e&&e.defaultProps){t=X({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function bi(e,t,n,s){t=e.memoizedState,n=n(s,t),n=n==null?t:X({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ua={isMounted:function(e){return(e=e._reactInternals)?kn(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var s=xe(),r=zt(e),o=vt(s,r);o.payload=t,n!=null&&(o.callback=n),t=Ht(e,o,r),t!==null&&(Ze(t,e,r,s),Gr(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var s=xe(),r=zt(e),o=vt(s,r);o.tag=1,o.payload=t,n!=null&&(o.callback=n),t=Ht(e,o,r),t!==null&&(Ze(t,e,r,s),Gr(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=xe(),s=zt(e),r=vt(n,s);r.tag=2,t!=null&&(r.callback=t),t=Ht(e,r,s),t!==null&&(Ze(t,e,s,n),Gr(t,e,s))}};function Wc(e,t,n,s,r,o,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(s,o,i):t.prototype&&t.prototype.isPureReactComponent?!Ks(n,s)||!Ks(r,o):!0}function dp(e,t,n){var s=!1,r=Kt,o=t.contextType;return typeof o=="object"&&o!==null?o=$e(o):(r=Ee(t)?hn:ge.current,s=t.contextTypes,o=(s=s!=null)?Gn(e,r):Kt),t=new t(n,o),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Ua,e.stateNode=t,t._reactInternals=e,s&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=r,e.__reactInternalMemoizedMaskedChildContext=o),t}function Uc(e,t,n,s){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,s),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,s),t.state!==e&&Ua.enqueueReplaceState(t,t.state,null)}function yi(e,t,n,s){var r=e.stateNode;r.props=n,r.state=e.memoizedState,r.refs={},ul(e);var o=t.contextType;typeof o=="object"&&o!==null?r.context=$e(o):(o=Ee(t)?hn:ge.current,r.context=Gn(e,o)),r.state=e.memoizedState,o=t.getDerivedStateFromProps,typeof o=="function"&&(bi(e,t,o,n),r.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(t=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),t!==r.state&&Ua.enqueueReplaceState(r,r.state,null),ya(e,n,r,s),r.state=e.memoizedState),typeof r.componentDidMount=="function"&&(e.flags|=4194308)}function Jn(e,t){try{var n="",s=t;do n+=cf(s),s=s.return;while(s);var r=n}catch(o){r=`
Error generating stack: `+o.message+`
`+o.stack}return{value:e,source:t,stack:r,digest:null}}function Ro(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function xi(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Ih=typeof WeakMap=="function"?WeakMap:Map;function up(e,t,n){n=vt(-1,n),n.tag=3,n.payload={element:null};var s=t.value;return n.callback=function(){Sa||(Sa=!0,_i=s),xi(e,t)},n}function pp(e,t,n){n=vt(-1,n),n.tag=3;var s=e.type.getDerivedStateFromError;if(typeof s=="function"){var r=t.value;n.payload=function(){return s(r)},n.callback=function(){xi(e,t)}}var o=e.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(n.callback=function(){xi(e,t),typeof s!="function"&&(qt===null?qt=new Set([this]):qt.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function Hc(e,t,n){var s=e.pingCache;if(s===null){s=e.pingCache=new Ih;var r=new Set;s.set(t,r)}else r=s.get(t),r===void 0&&(r=new Set,s.set(t,r));r.has(n)||(r.add(n),e=Jh.bind(null,e,t,n),t.then(e,e))}function qc(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function zc(e,t,n,s,r){return e.mode&1?(e.flags|=65536,e.lanes=r,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=vt(-1,1),t.tag=2,Ht(n,t,1))),n.lanes|=1),e)}var Fh=Et.ReactCurrentOwner,je=!1;function be(e,t,n,s){t.child=e===null?Uu(t,null,n,s):Vn(t,e.child,n,s)}function $c(e,t,n,s,r){n=n.render;var o=t.ref;return qn(t,r),s=gl(e,t,n,s,o,r),n=bl(),e!==null&&!je?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,Nt(e,t,r)):(Y&&n&&rl(t),t.flags|=1,be(e,t,s,r),t.child)}function Gc(e,t,n,s,r){if(e===null){var o=n.type;return typeof o=="function"&&!Rl(o)&&o.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=o,mp(e,t,o,s,r)):(e=Zr(n.type,null,s,t,t.mode,r),e.ref=t.ref,e.return=t,t.child=e)}if(o=e.child,!(e.lanes&r)){var i=o.memoizedProps;if(n=n.compare,n=n!==null?n:Ks,n(i,s)&&e.ref===t.ref)return Nt(e,t,r)}return t.flags|=1,e=$t(o,s),e.ref=t.ref,e.return=t,t.child=e}function mp(e,t,n,s,r){if(e!==null){var o=e.memoizedProps;if(Ks(o,s)&&e.ref===t.ref)if(je=!1,t.pendingProps=s=o,(e.lanes&r)!==0)e.flags&131072&&(je=!0);else return t.lanes=e.lanes,Nt(e,t,r)}return vi(e,t,n,s,r)}function fp(e,t,n){var s=t.pendingProps,r=s.children,o=e!==null?e.memoizedState:null;if(s.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},G(Ln,Te),Te|=n;else{if(!(n&1073741824))return e=o!==null?o.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,G(Ln,Te),Te|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},s=o!==null?o.baseLanes:n,G(Ln,Te),Te|=s}else o!==null?(s=o.baseLanes|n,t.memoizedState=null):s=n,G(Ln,Te),Te|=s;return be(e,t,r,n),t.child}function hp(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function vi(e,t,n,s,r){var o=Ee(n)?hn:ge.current;return o=Gn(t,o),qn(t,r),n=gl(e,t,n,s,o,r),s=bl(),e!==null&&!je?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,Nt(e,t,r)):(Y&&s&&rl(t),t.flags|=1,be(e,t,n,r),t.child)}function Kc(e,t,n,s,r){if(Ee(n)){var o=!0;ma(t)}else o=!1;if(qn(t,r),t.stateNode===null)Yr(e,t),dp(t,n,s),yi(t,n,s,r),s=!0;else if(e===null){var i=t.stateNode,l=t.memoizedProps;i.props=l;var c=i.context,d=n.contextType;typeof d=="object"&&d!==null?d=$e(d):(d=Ee(n)?hn:ge.current,d=Gn(t,d));var u=n.getDerivedStateFromProps,m=typeof u=="function"||typeof i.getSnapshotBeforeUpdate=="function";m||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(l!==s||c!==d)&&Uc(t,i,s,d),Pt=!1;var f=t.memoizedState;i.state=f,ya(t,s,i,r),c=t.memoizedState,l!==s||f!==c||Re.current||Pt?(typeof u=="function"&&(bi(t,n,u,s),c=t.memoizedState),(l=Pt||Wc(t,n,l,s,f,c,d))?(m||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=s,t.memoizedState=c),i.props=s,i.state=c,i.context=d,s=l):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),s=!1)}else{i=t.stateNode,qu(e,t),l=t.memoizedProps,d=t.type===t.elementType?l:Ve(t.type,l),i.props=d,m=t.pendingProps,f=i.context,c=n.contextType,typeof c=="object"&&c!==null?c=$e(c):(c=Ee(n)?hn:ge.current,c=Gn(t,c));var b=n.getDerivedStateFromProps;(u=typeof b=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(l!==m||f!==c)&&Uc(t,i,s,c),Pt=!1,f=t.memoizedState,i.state=f,ya(t,s,i,r);var w=t.memoizedState;l!==m||f!==w||Re.current||Pt?(typeof b=="function"&&(bi(t,n,b,s),w=t.memoizedState),(d=Pt||Wc(t,n,d,s,f,w,c)||!1)?(u||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(s,w,c),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(s,w,c)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||l===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||l===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=s,t.memoizedState=w),i.props=s,i.state=w,i.context=c,s=d):(typeof i.componentDidUpdate!="function"||l===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||l===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),s=!1)}return wi(e,t,n,s,o,r)}function wi(e,t,n,s,r,o){hp(e,t);var i=(t.flags&128)!==0;if(!s&&!i)return r&&Ac(t,n,!1),Nt(e,t,o);s=t.stateNode,Fh.current=t;var l=i&&typeof n.getDerivedStateFromError!="function"?null:s.render();return t.flags|=1,e!==null&&i?(t.child=Vn(t,e.child,null,o),t.child=Vn(t,null,l,o)):be(e,t,l,o),t.memoizedState=s.state,r&&Ac(t,n,!0),t.child}function gp(e){var t=e.stateNode;t.pendingContext?Tc(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Tc(e,t.context,!1),pl(e,t.containerInfo)}function Vc(e,t,n,s,r){return Kn(),ol(r),t.flags|=256,be(e,t,n,s),t.child}var ki={dehydrated:null,treeContext:null,retryLane:0};function Si(e){return{baseLanes:e,cachePool:null,transitions:null}}function bp(e,t,n){var s=t.pendingProps,r=Q.current,o=!1,i=(t.flags&128)!==0,l;if((l=i)||(l=e!==null&&e.memoizedState===null?!1:(r&2)!==0),l?(o=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(r|=1),G(Q,r&1),e===null)return hi(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(i=s.children,e=s.fallback,o?(s=t.mode,o=t.child,i={mode:"hidden",children:i},!(s&1)&&o!==null?(o.childLanes=0,o.pendingProps=i):o=za(i,s,0,null),e=fn(e,s,n,null),o.return=t,e.return=t,o.sibling=e,t.child=o,t.child.memoizedState=Si(n),t.memoizedState=ki,e):vl(t,i));if(r=e.memoizedState,r!==null&&(l=r.dehydrated,l!==null))return Lh(e,t,i,s,l,r,n);if(o){o=s.fallback,i=t.mode,r=e.child,l=r.sibling;var c={mode:"hidden",children:s.children};return!(i&1)&&t.child!==r?(s=t.child,s.childLanes=0,s.pendingProps=c,t.deletions=null):(s=$t(r,c),s.subtreeFlags=r.subtreeFlags&14680064),l!==null?o=$t(l,o):(o=fn(o,i,n,null),o.flags|=2),o.return=t,s.return=t,s.sibling=o,t.child=s,s=o,o=t.child,i=e.child.memoizedState,i=i===null?Si(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},o.memoizedState=i,o.childLanes=e.childLanes&~n,t.memoizedState=ki,s}return o=e.child,e=o.sibling,s=$t(o,{mode:"visible",children:s.children}),!(t.mode&1)&&(s.lanes=n),s.return=t,s.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=s,t.memoizedState=null,s}function vl(e,t){return t=za({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Mr(e,t,n,s){return s!==null&&ol(s),Vn(t,e.child,null,n),e=vl(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Lh(e,t,n,s,r,o,i){if(n)return t.flags&256?(t.flags&=-257,s=Ro(Error(R(422))),Mr(e,t,i,s)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(o=s.fallback,r=t.mode,s=za({mode:"visible",children:s.children},r,0,null),o=fn(o,r,i,null),o.flags|=2,s.return=t,o.return=t,s.sibling=o,t.child=s,t.mode&1&&Vn(t,e.child,null,i),t.child.memoizedState=Si(i),t.memoizedState=ki,o);if(!(t.mode&1))return Mr(e,t,i,null);if(r.data==="$!"){if(s=r.nextSibling&&r.nextSibling.dataset,s)var l=s.dgst;return s=l,o=Error(R(419)),s=Ro(o,s,void 0),Mr(e,t,i,s)}if(l=(i&e.childLanes)!==0,je||l){if(s=ce,s!==null){switch(i&-i){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(s.suspendedLanes|i)?0:r,r!==0&&r!==o.retryLane&&(o.retryLane=r,St(e,r),Ze(s,e,r,-1))}return jl(),s=Ro(Error(R(421))),Mr(e,t,i,s)}return r.data==="$?"?(t.flags|=128,t.child=e.child,t=Qh.bind(null,e),r._reactRetry=t,null):(e=o.treeContext,Pe=Ut(r.nextSibling),De=t,Y=!0,Je=null,e!==null&&(Oe[We++]=yt,Oe[We++]=xt,Oe[We++]=gn,yt=e.id,xt=e.overflow,gn=t),t=vl(t,s.children),t.flags|=4096,t)}function Yc(e,t,n){e.lanes|=t;var s=e.alternate;s!==null&&(s.lanes|=t),gi(e.return,t,n)}function Eo(e,t,n,s,r){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:s,tail:n,tailMode:r}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=s,o.tail=n,o.tailMode=r)}function yp(e,t,n){var s=t.pendingProps,r=s.revealOrder,o=s.tail;if(be(e,t,s.children,n),s=Q.current,s&2)s=s&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Yc(e,n,t);else if(e.tag===19)Yc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}s&=1}if(G(Q,s),!(t.mode&1))t.memoizedState=null;else switch(r){case"forwards":for(n=t.child,r=null;n!==null;)e=n.alternate,e!==null&&xa(e)===null&&(r=n),n=n.sibling;n=r,n===null?(r=t.child,t.child=null):(r=n.sibling,n.sibling=null),Eo(t,!1,r,n,o);break;case"backwards":for(n=null,r=t.child,t.child=null;r!==null;){if(e=r.alternate,e!==null&&xa(e)===null){t.child=r;break}e=r.sibling,r.sibling=n,n=r,r=e}Eo(t,!0,n,null,o);break;case"together":Eo(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Yr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Nt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),yn|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(R(153));if(t.child!==null){for(e=t.child,n=$t(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=$t(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Oh(e,t,n){switch(t.tag){case 3:gp(t),Kn();break;case 5:zu(t);break;case 1:Ee(t.type)&&ma(t);break;case 4:pl(t,t.stateNode.containerInfo);break;case 10:var s=t.type._context,r=t.memoizedProps.value;G(ga,s._currentValue),s._currentValue=r;break;case 13:if(s=t.memoizedState,s!==null)return s.dehydrated!==null?(G(Q,Q.current&1),t.flags|=128,null):n&t.child.childLanes?bp(e,t,n):(G(Q,Q.current&1),e=Nt(e,t,n),e!==null?e.sibling:null);G(Q,Q.current&1);break;case 19:if(s=(n&t.childLanes)!==0,e.flags&128){if(s)return yp(e,t,n);t.flags|=128}if(r=t.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),G(Q,Q.current),s)break;return null;case 22:case 23:return t.lanes=0,fp(e,t,n)}return Nt(e,t,n)}var xp,Ni,vp,wp;xp=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Ni=function(){};vp=function(e,t,n,s){var r=e.memoizedProps;if(r!==s){e=t.stateNode,pn(lt.current);var o=null;switch(n){case"input":r=Go(e,r),s=Go(e,s),o=[];break;case"select":r=X({},r,{value:void 0}),s=X({},s,{value:void 0}),o=[];break;case"textarea":r=Yo(e,r),s=Yo(e,s),o=[];break;default:typeof r.onClick!="function"&&typeof s.onClick=="function"&&(e.onclick=ua)}Qo(n,s);var i;n=null;for(d in r)if(!s.hasOwnProperty(d)&&r.hasOwnProperty(d)&&r[d]!=null)if(d==="style"){var l=r[d];for(i in l)l.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(Ws.hasOwnProperty(d)?o||(o=[]):(o=o||[]).push(d,null));for(d in s){var c=s[d];if(l=r!=null?r[d]:void 0,s.hasOwnProperty(d)&&c!==l&&(c!=null||l!=null))if(d==="style")if(l){for(i in l)!l.hasOwnProperty(i)||c&&c.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in c)c.hasOwnProperty(i)&&l[i]!==c[i]&&(n||(n={}),n[i]=c[i])}else n||(o||(o=[]),o.push(d,n)),n=c;else d==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,l=l?l.__html:void 0,c!=null&&l!==c&&(o=o||[]).push(d,c)):d==="children"?typeof c!="string"&&typeof c!="number"||(o=o||[]).push(d,""+c):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(Ws.hasOwnProperty(d)?(c!=null&&d==="onScroll"&&K("scroll",e),o||l===c||(o=[])):(o=o||[]).push(d,c))}n&&(o=o||[]).push("style",n);var d=o;(t.updateQueue=d)&&(t.flags|=4)}};wp=function(e,t,n,s){n!==s&&(t.flags|=4)};function hs(e,t){if(!Y)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var s=null;n!==null;)n.alternate!==null&&(s=n),n=n.sibling;s===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:s.sibling=null}}function fe(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,s=0;if(t)for(var r=e.child;r!==null;)n|=r.lanes|r.childLanes,s|=r.subtreeFlags&14680064,s|=r.flags&14680064,r.return=e,r=r.sibling;else for(r=e.child;r!==null;)n|=r.lanes|r.childLanes,s|=r.subtreeFlags,s|=r.flags,r.return=e,r=r.sibling;return e.subtreeFlags|=s,e.childLanes=n,t}function Wh(e,t,n){var s=t.pendingProps;switch(al(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return fe(t),null;case 1:return Ee(t.type)&&pa(),fe(t),null;case 3:return s=t.stateNode,Yn(),V(Re),V(ge),fl(),s.pendingContext&&(s.context=s.pendingContext,s.pendingContext=null),(e===null||e.child===null)&&(Er(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Je!==null&&(Ai(Je),Je=null))),Ni(e,t),fe(t),null;case 5:ml(t);var r=pn(Zs.current);if(n=t.type,e!==null&&t.stateNode!=null)vp(e,t,n,s,r),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!s){if(t.stateNode===null)throw Error(R(166));return fe(t),null}if(e=pn(lt.current),Er(t)){s=t.stateNode,n=t.type;var o=t.memoizedProps;switch(s[ot]=t,s[Js]=o,e=(t.mode&1)!==0,n){case"dialog":K("cancel",s),K("close",s);break;case"iframe":case"object":case"embed":K("load",s);break;case"video":case"audio":for(r=0;r<Rs.length;r++)K(Rs[r],s);break;case"source":K("error",s);break;case"img":case"image":case"link":K("error",s),K("load",s);break;case"details":K("toggle",s);break;case"input":rc(s,o),K("invalid",s);break;case"select":s._wrapperState={wasMultiple:!!o.multiple},K("invalid",s);break;case"textarea":oc(s,o),K("invalid",s)}Qo(n,o),r=null;for(var i in o)if(o.hasOwnProperty(i)){var l=o[i];i==="children"?typeof l=="string"?s.textContent!==l&&(o.suppressHydrationWarning!==!0&&Rr(s.textContent,l,e),r=["children",l]):typeof l=="number"&&s.textContent!==""+l&&(o.suppressHydrationWarning!==!0&&Rr(s.textContent,l,e),r=["children",""+l]):Ws.hasOwnProperty(i)&&l!=null&&i==="onScroll"&&K("scroll",s)}switch(n){case"input":xr(s),ac(s,o,!0);break;case"textarea":xr(s),ic(s);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(s.onclick=ua)}s=r,t.updateQueue=s,s!==null&&(t.flags|=4)}else{i=r.nodeType===9?r:r.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Yd(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof s.is=="string"?e=i.createElement(n,{is:s.is}):(e=i.createElement(n),n==="select"&&(i=e,s.multiple?i.multiple=!0:s.size&&(i.size=s.size))):e=i.createElementNS(e,n),e[ot]=t,e[Js]=s,xp(e,t,!1,!1),t.stateNode=e;e:{switch(i=Zo(n,s),n){case"dialog":K("cancel",e),K("close",e),r=s;break;case"iframe":case"object":case"embed":K("load",e),r=s;break;case"video":case"audio":for(r=0;r<Rs.length;r++)K(Rs[r],e);r=s;break;case"source":K("error",e),r=s;break;case"img":case"image":case"link":K("error",e),K("load",e),r=s;break;case"details":K("toggle",e),r=s;break;case"input":rc(e,s),r=Go(e,s),K("invalid",e);break;case"option":r=s;break;case"select":e._wrapperState={wasMultiple:!!s.multiple},r=X({},s,{value:void 0}),K("invalid",e);break;case"textarea":oc(e,s),r=Yo(e,s),K("invalid",e);break;default:r=s}Qo(n,r),l=r;for(o in l)if(l.hasOwnProperty(o)){var c=l[o];o==="style"?Zd(e,c):o==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&Jd(e,c)):o==="children"?typeof c=="string"?(n!=="textarea"||c!=="")&&Us(e,c):typeof c=="number"&&Us(e,""+c):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(Ws.hasOwnProperty(o)?c!=null&&o==="onScroll"&&K("scroll",e):c!=null&&zi(e,o,c,i))}switch(n){case"input":xr(e),ac(e,s,!1);break;case"textarea":xr(e),ic(e);break;case"option":s.value!=null&&e.setAttribute("value",""+Gt(s.value));break;case"select":e.multiple=!!s.multiple,o=s.value,o!=null?On(e,!!s.multiple,o,!1):s.defaultValue!=null&&On(e,!!s.multiple,s.defaultValue,!0);break;default:typeof r.onClick=="function"&&(e.onclick=ua)}switch(n){case"button":case"input":case"select":case"textarea":s=!!s.autoFocus;break e;case"img":s=!0;break e;default:s=!1}}s&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return fe(t),null;case 6:if(e&&t.stateNode!=null)wp(e,t,e.memoizedProps,s);else{if(typeof s!="string"&&t.stateNode===null)throw Error(R(166));if(n=pn(Zs.current),pn(lt.current),Er(t)){if(s=t.stateNode,n=t.memoizedProps,s[ot]=t,(o=s.nodeValue!==n)&&(e=De,e!==null))switch(e.tag){case 3:Rr(s.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Rr(s.nodeValue,n,(e.mode&1)!==0)}o&&(t.flags|=4)}else s=(n.nodeType===9?n:n.ownerDocument).createTextNode(s),s[ot]=t,t.stateNode=s}return fe(t),null;case 13:if(V(Q),s=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Y&&Pe!==null&&t.mode&1&&!(t.flags&128))Ou(),Kn(),t.flags|=98560,o=!1;else if(o=Er(t),s!==null&&s.dehydrated!==null){if(e===null){if(!o)throw Error(R(318));if(o=t.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(R(317));o[ot]=t}else Kn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;fe(t),o=!1}else Je!==null&&(Ai(Je),Je=null),o=!0;if(!o)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(s=s!==null,s!==(e!==null&&e.memoizedState!==null)&&s&&(t.child.flags|=8192,t.mode&1&&(e===null||Q.current&1?oe===0&&(oe=3):jl())),t.updateQueue!==null&&(t.flags|=4),fe(t),null);case 4:return Yn(),Ni(e,t),e===null&&Vs(t.stateNode.containerInfo),fe(t),null;case 10:return cl(t.type._context),fe(t),null;case 17:return Ee(t.type)&&pa(),fe(t),null;case 19:if(V(Q),o=t.memoizedState,o===null)return fe(t),null;if(s=(t.flags&128)!==0,i=o.rendering,i===null)if(s)hs(o,!1);else{if(oe!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(i=xa(e),i!==null){for(t.flags|=128,hs(o,!1),s=i.updateQueue,s!==null&&(t.updateQueue=s,t.flags|=4),t.subtreeFlags=0,s=n,n=t.child;n!==null;)o=n,e=s,o.flags&=14680066,i=o.alternate,i===null?(o.childLanes=0,o.lanes=e,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=i.childLanes,o.lanes=i.lanes,o.child=i.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=i.memoizedProps,o.memoizedState=i.memoizedState,o.updateQueue=i.updateQueue,o.type=i.type,e=i.dependencies,o.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return G(Q,Q.current&1|2),t.child}e=e.sibling}o.tail!==null&&ne()>Qn&&(t.flags|=128,s=!0,hs(o,!1),t.lanes=4194304)}else{if(!s)if(e=xa(i),e!==null){if(t.flags|=128,s=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),hs(o,!0),o.tail===null&&o.tailMode==="hidden"&&!i.alternate&&!Y)return fe(t),null}else 2*ne()-o.renderingStartTime>Qn&&n!==1073741824&&(t.flags|=128,s=!0,hs(o,!1),t.lanes=4194304);o.isBackwards?(i.sibling=t.child,t.child=i):(n=o.last,n!==null?n.sibling=i:t.child=i,o.last=i)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=ne(),t.sibling=null,n=Q.current,G(Q,s?n&1|2:n&1),t):(fe(t),null);case 22:case 23:return Cl(),s=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==s&&(t.flags|=8192),s&&t.mode&1?Te&1073741824&&(fe(t),t.subtreeFlags&6&&(t.flags|=8192)):fe(t),null;case 24:return null;case 25:return null}throw Error(R(156,t.tag))}function Uh(e,t){switch(al(t),t.tag){case 1:return Ee(t.type)&&pa(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Yn(),V(Re),V(ge),fl(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return ml(t),null;case 13:if(V(Q),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(R(340));Kn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return V(Q),null;case 4:return Yn(),null;case 10:return cl(t.type._context),null;case 22:case 23:return Cl(),null;case 24:return null;default:return null}}var Tr=!1,he=!1,Hh=typeof WeakSet=="function"?WeakSet:Set,P=null;function Fn(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(s){ee(e,t,s)}else n.current=null}function Ci(e,t,n){try{n()}catch(s){ee(e,t,s)}}var Jc=!1;function qh(e,t){if(li=la,e=ju(),sl(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var s=n.getSelection&&n.getSelection();if(s&&s.rangeCount!==0){n=s.anchorNode;var r=s.anchorOffset,o=s.focusNode;s=s.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break e}var i=0,l=-1,c=-1,d=0,u=0,m=e,f=null;t:for(;;){for(var b;m!==n||r!==0&&m.nodeType!==3||(l=i+r),m!==o||s!==0&&m.nodeType!==3||(c=i+s),m.nodeType===3&&(i+=m.nodeValue.length),(b=m.firstChild)!==null;)f=m,m=b;for(;;){if(m===e)break t;if(f===n&&++d===r&&(l=i),f===o&&++u===s&&(c=i),(b=m.nextSibling)!==null)break;m=f,f=m.parentNode}m=b}n=l===-1||c===-1?null:{start:l,end:c}}else n=null}n=n||{start:0,end:0}}else n=null;for(ci={focusedElem:e,selectionRange:n},la=!1,P=t;P!==null;)if(t=P,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,P=e;else for(;P!==null;){t=P;try{var w=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(w!==null){var x=w.memoizedProps,S=w.memoizedState,p=t.stateNode,h=p.getSnapshotBeforeUpdate(t.elementType===t.type?x:Ve(t.type,x),S);p.__reactInternalSnapshotBeforeUpdate=h}break;case 3:var g=t.stateNode.containerInfo;g.nodeType===1?g.textContent="":g.nodeType===9&&g.documentElement&&g.removeChild(g.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(R(163))}}catch(v){ee(t,t.return,v)}if(e=t.sibling,e!==null){e.return=t.return,P=e;break}P=t.return}return w=Jc,Jc=!1,w}function Ds(e,t,n){var s=t.updateQueue;if(s=s!==null?s.lastEffect:null,s!==null){var r=s=s.next;do{if((r.tag&e)===e){var o=r.destroy;r.destroy=void 0,o!==void 0&&Ci(t,n,o)}r=r.next}while(r!==s)}}function Ha(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var s=n.create;n.destroy=s()}n=n.next}while(n!==t)}}function ji(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function kp(e){var t=e.alternate;t!==null&&(e.alternate=null,kp(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[ot],delete t[Js],delete t[pi],delete t[Ch],delete t[jh])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Sp(e){return e.tag===5||e.tag===3||e.tag===4}function Qc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Sp(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ri(e,t,n){var s=e.tag;if(s===5||s===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ua));else if(s!==4&&(e=e.child,e!==null))for(Ri(e,t,n),e=e.sibling;e!==null;)Ri(e,t,n),e=e.sibling}function Ei(e,t,n){var s=e.tag;if(s===5||s===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(s!==4&&(e=e.child,e!==null))for(Ei(e,t,n),e=e.sibling;e!==null;)Ei(e,t,n),e=e.sibling}var de=null,Ye=!1;function Mt(e,t,n){for(n=n.child;n!==null;)Np(e,t,n),n=n.sibling}function Np(e,t,n){if(it&&typeof it.onCommitFiberUnmount=="function")try{it.onCommitFiberUnmount(Da,n)}catch{}switch(n.tag){case 5:he||Fn(n,t);case 6:var s=de,r=Ye;de=null,Mt(e,t,n),de=s,Ye=r,de!==null&&(Ye?(e=de,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):de.removeChild(n.stateNode));break;case 18:de!==null&&(Ye?(e=de,n=n.stateNode,e.nodeType===8?wo(e.parentNode,n):e.nodeType===1&&wo(e,n),$s(e)):wo(de,n.stateNode));break;case 4:s=de,r=Ye,de=n.stateNode.containerInfo,Ye=!0,Mt(e,t,n),de=s,Ye=r;break;case 0:case 11:case 14:case 15:if(!he&&(s=n.updateQueue,s!==null&&(s=s.lastEffect,s!==null))){r=s=s.next;do{var o=r,i=o.destroy;o=o.tag,i!==void 0&&(o&2||o&4)&&Ci(n,t,i),r=r.next}while(r!==s)}Mt(e,t,n);break;case 1:if(!he&&(Fn(n,t),s=n.stateNode,typeof s.componentWillUnmount=="function"))try{s.props=n.memoizedProps,s.state=n.memoizedState,s.componentWillUnmount()}catch(l){ee(n,t,l)}Mt(e,t,n);break;case 21:Mt(e,t,n);break;case 22:n.mode&1?(he=(s=he)||n.memoizedState!==null,Mt(e,t,n),he=s):Mt(e,t,n);break;default:Mt(e,t,n)}}function Zc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Hh),t.forEach(function(s){var r=Zh.bind(null,e,s);n.has(s)||(n.add(s),s.then(r,r))})}}function Ke(e,t){var n=t.deletions;if(n!==null)for(var s=0;s<n.length;s++){var r=n[s];try{var o=e,i=t,l=i;e:for(;l!==null;){switch(l.tag){case 5:de=l.stateNode,Ye=!1;break e;case 3:de=l.stateNode.containerInfo,Ye=!0;break e;case 4:de=l.stateNode.containerInfo,Ye=!0;break e}l=l.return}if(de===null)throw Error(R(160));Np(o,i,r),de=null,Ye=!1;var c=r.alternate;c!==null&&(c.return=null),r.return=null}catch(d){ee(r,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Cp(t,e),t=t.sibling}function Cp(e,t){var n=e.alternate,s=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Ke(t,e),nt(e),s&4){try{Ds(3,e,e.return),Ha(3,e)}catch(x){ee(e,e.return,x)}try{Ds(5,e,e.return)}catch(x){ee(e,e.return,x)}}break;case 1:Ke(t,e),nt(e),s&512&&n!==null&&Fn(n,n.return);break;case 5:if(Ke(t,e),nt(e),s&512&&n!==null&&Fn(n,n.return),e.flags&32){var r=e.stateNode;try{Us(r,"")}catch(x){ee(e,e.return,x)}}if(s&4&&(r=e.stateNode,r!=null)){var o=e.memoizedProps,i=n!==null?n.memoizedProps:o,l=e.type,c=e.updateQueue;if(e.updateQueue=null,c!==null)try{l==="input"&&o.type==="radio"&&o.name!=null&&Kd(r,o),Zo(l,i);var d=Zo(l,o);for(i=0;i<c.length;i+=2){var u=c[i],m=c[i+1];u==="style"?Zd(r,m):u==="dangerouslySetInnerHTML"?Jd(r,m):u==="children"?Us(r,m):zi(r,u,m,d)}switch(l){case"input":Ko(r,o);break;case"textarea":Vd(r,o);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!o.multiple;var b=o.value;b!=null?On(r,!!o.multiple,b,!1):f!==!!o.multiple&&(o.defaultValue!=null?On(r,!!o.multiple,o.defaultValue,!0):On(r,!!o.multiple,o.multiple?[]:"",!1))}r[Js]=o}catch(x){ee(e,e.return,x)}}break;case 6:if(Ke(t,e),nt(e),s&4){if(e.stateNode===null)throw Error(R(162));r=e.stateNode,o=e.memoizedProps;try{r.nodeValue=o}catch(x){ee(e,e.return,x)}}break;case 3:if(Ke(t,e),nt(e),s&4&&n!==null&&n.memoizedState.isDehydrated)try{$s(t.containerInfo)}catch(x){ee(e,e.return,x)}break;case 4:Ke(t,e),nt(e);break;case 13:Ke(t,e),nt(e),r=e.child,r.flags&8192&&(o=r.memoizedState!==null,r.stateNode.isHidden=o,!o||r.alternate!==null&&r.alternate.memoizedState!==null||(Sl=ne())),s&4&&Zc(e);break;case 22:if(u=n!==null&&n.memoizedState!==null,e.mode&1?(he=(d=he)||u,Ke(t,e),he=d):Ke(t,e),nt(e),s&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!u&&e.mode&1)for(P=e,u=e.child;u!==null;){for(m=P=u;P!==null;){switch(f=P,b=f.child,f.tag){case 0:case 11:case 14:case 15:Ds(4,f,f.return);break;case 1:Fn(f,f.return);var w=f.stateNode;if(typeof w.componentWillUnmount=="function"){s=f,n=f.return;try{t=s,w.props=t.memoizedProps,w.state=t.memoizedState,w.componentWillUnmount()}catch(x){ee(s,n,x)}}break;case 5:Fn(f,f.return);break;case 22:if(f.memoizedState!==null){ed(m);continue}}b!==null?(b.return=f,P=b):ed(m)}u=u.sibling}e:for(u=null,m=e;;){if(m.tag===5){if(u===null){u=m;try{r=m.stateNode,d?(o=r.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(l=m.stateNode,c=m.memoizedProps.style,i=c!=null&&c.hasOwnProperty("display")?c.display:null,l.style.display=Qd("display",i))}catch(x){ee(e,e.return,x)}}}else if(m.tag===6){if(u===null)try{m.stateNode.nodeValue=d?"":m.memoizedProps}catch(x){ee(e,e.return,x)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===e)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===e)break e;for(;m.sibling===null;){if(m.return===null||m.return===e)break e;u===m&&(u=null),m=m.return}u===m&&(u=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:Ke(t,e),nt(e),s&4&&Zc(e);break;case 21:break;default:Ke(t,e),nt(e)}}function nt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Sp(n)){var s=n;break e}n=n.return}throw Error(R(160))}switch(s.tag){case 5:var r=s.stateNode;s.flags&32&&(Us(r,""),s.flags&=-33);var o=Qc(e);Ei(e,o,r);break;case 3:case 4:var i=s.stateNode.containerInfo,l=Qc(e);Ri(e,l,i);break;default:throw Error(R(161))}}catch(c){ee(e,e.return,c)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function zh(e,t,n){P=e,jp(e)}function jp(e,t,n){for(var s=(e.mode&1)!==0;P!==null;){var r=P,o=r.child;if(r.tag===22&&s){var i=r.memoizedState!==null||Tr;if(!i){var l=r.alternate,c=l!==null&&l.memoizedState!==null||he;l=Tr;var d=he;if(Tr=i,(he=c)&&!d)for(P=r;P!==null;)i=P,c=i.child,i.tag===22&&i.memoizedState!==null?td(r):c!==null?(c.return=i,P=c):td(r);for(;o!==null;)P=o,jp(o),o=o.sibling;P=r,Tr=l,he=d}Xc(e)}else r.subtreeFlags&8772&&o!==null?(o.return=r,P=o):Xc(e)}}function Xc(e){for(;P!==null;){var t=P;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:he||Ha(5,t);break;case 1:var s=t.stateNode;if(t.flags&4&&!he)if(n===null)s.componentDidMount();else{var r=t.elementType===t.type?n.memoizedProps:Ve(t.type,n.memoizedProps);s.componentDidUpdate(r,n.memoizedState,s.__reactInternalSnapshotBeforeUpdate)}var o=t.updateQueue;o!==null&&Fc(t,o,s);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Fc(t,i,n)}break;case 5:var l=t.stateNode;if(n===null&&t.flags&4){n=l;var c=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&n.focus();break;case"img":c.src&&(n.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var u=d.memoizedState;if(u!==null){var m=u.dehydrated;m!==null&&$s(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(R(163))}he||t.flags&512&&ji(t)}catch(f){ee(t,t.return,f)}}if(t===e){P=null;break}if(n=t.sibling,n!==null){n.return=t.return,P=n;break}P=t.return}}function ed(e){for(;P!==null;){var t=P;if(t===e){P=null;break}var n=t.sibling;if(n!==null){n.return=t.return,P=n;break}P=t.return}}function td(e){for(;P!==null;){var t=P;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Ha(4,t)}catch(c){ee(t,n,c)}break;case 1:var s=t.stateNode;if(typeof s.componentDidMount=="function"){var r=t.return;try{s.componentDidMount()}catch(c){ee(t,r,c)}}var o=t.return;try{ji(t)}catch(c){ee(t,o,c)}break;case 5:var i=t.return;try{ji(t)}catch(c){ee(t,i,c)}}}catch(c){ee(t,t.return,c)}if(t===e){P=null;break}var l=t.sibling;if(l!==null){l.return=t.return,P=l;break}P=t.return}}var $h=Math.ceil,ka=Et.ReactCurrentDispatcher,wl=Et.ReactCurrentOwner,ze=Et.ReactCurrentBatchConfig,H=0,ce=null,re=null,ue=0,Te=0,Ln=Jt(0),oe=0,nr=null,yn=0,qa=0,kl=0,Bs=null,Ce=null,Sl=0,Qn=1/0,gt=null,Sa=!1,_i=null,qt=null,Ar=!1,Ft=null,Na=0,Is=0,Mi=null,Jr=-1,Qr=0;function xe(){return H&6?ne():Jr!==-1?Jr:Jr=ne()}function zt(e){return e.mode&1?H&2&&ue!==0?ue&-ue:Eh.transition!==null?(Qr===0&&(Qr=du()),Qr):(e=q,e!==0||(e=window.event,e=e===void 0?16:bu(e.type)),e):1}function Ze(e,t,n,s){if(50<Is)throw Is=0,Mi=null,Error(R(185));ar(e,n,s),(!(H&2)||e!==ce)&&(e===ce&&(!(H&2)&&(qa|=n),oe===4&&Bt(e,ue)),_e(e,s),n===1&&H===0&&!(t.mode&1)&&(Qn=ne()+500,Oa&&Qt()))}function _e(e,t){var n=e.callbackNode;Ef(e,t);var s=ia(e,e===ce?ue:0);if(s===0)n!==null&&dc(n),e.callbackNode=null,e.callbackPriority=0;else if(t=s&-s,e.callbackPriority!==t){if(n!=null&&dc(n),t===1)e.tag===0?Rh(nd.bind(null,e)):Iu(nd.bind(null,e)),Sh(function(){!(H&6)&&Qt()}),n=null;else{switch(uu(s)){case 1:n=Yi;break;case 4:n=lu;break;case 16:n=oa;break;case 536870912:n=cu;break;default:n=oa}n=Dp(n,Rp.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Rp(e,t){if(Jr=-1,Qr=0,H&6)throw Error(R(327));var n=e.callbackNode;if(zn()&&e.callbackNode!==n)return null;var s=ia(e,e===ce?ue:0);if(s===0)return null;if(s&30||s&e.expiredLanes||t)t=Ca(e,s);else{t=s;var r=H;H|=2;var o=_p();(ce!==e||ue!==t)&&(gt=null,Qn=ne()+500,mn(e,t));do try{Vh();break}catch(l){Ep(e,l)}while(!0);ll(),ka.current=o,H=r,re!==null?t=0:(ce=null,ue=0,t=oe)}if(t!==0){if(t===2&&(r=si(e),r!==0&&(s=r,t=Ti(e,r))),t===1)throw n=nr,mn(e,0),Bt(e,s),_e(e,ne()),n;if(t===6)Bt(e,s);else{if(r=e.current.alternate,!(s&30)&&!Gh(r)&&(t=Ca(e,s),t===2&&(o=si(e),o!==0&&(s=o,t=Ti(e,o))),t===1))throw n=nr,mn(e,0),Bt(e,s),_e(e,ne()),n;switch(e.finishedWork=r,e.finishedLanes=s,t){case 0:case 1:throw Error(R(345));case 2:tn(e,Ce,gt);break;case 3:if(Bt(e,s),(s&130023424)===s&&(t=Sl+500-ne(),10<t)){if(ia(e,0)!==0)break;if(r=e.suspendedLanes,(r&s)!==s){xe(),e.pingedLanes|=e.suspendedLanes&r;break}e.timeoutHandle=ui(tn.bind(null,e,Ce,gt),t);break}tn(e,Ce,gt);break;case 4:if(Bt(e,s),(s&4194240)===s)break;for(t=e.eventTimes,r=-1;0<s;){var i=31-Qe(s);o=1<<i,i=t[i],i>r&&(r=i),s&=~o}if(s=r,s=ne()-s,s=(120>s?120:480>s?480:1080>s?1080:1920>s?1920:3e3>s?3e3:4320>s?4320:1960*$h(s/1960))-s,10<s){e.timeoutHandle=ui(tn.bind(null,e,Ce,gt),s);break}tn(e,Ce,gt);break;case 5:tn(e,Ce,gt);break;default:throw Error(R(329))}}}return _e(e,ne()),e.callbackNode===n?Rp.bind(null,e):null}function Ti(e,t){var n=Bs;return e.current.memoizedState.isDehydrated&&(mn(e,t).flags|=256),e=Ca(e,t),e!==2&&(t=Ce,Ce=n,t!==null&&Ai(t)),e}function Ai(e){Ce===null?Ce=e:Ce.push.apply(Ce,e)}function Gh(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var s=0;s<n.length;s++){var r=n[s],o=r.getSnapshot;r=r.value;try{if(!et(o(),r))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Bt(e,t){for(t&=~kl,t&=~qa,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Qe(t),s=1<<n;e[n]=-1,t&=~s}}function nd(e){if(H&6)throw Error(R(327));zn();var t=ia(e,0);if(!(t&1))return _e(e,ne()),null;var n=Ca(e,t);if(e.tag!==0&&n===2){var s=si(e);s!==0&&(t=s,n=Ti(e,s))}if(n===1)throw n=nr,mn(e,0),Bt(e,t),_e(e,ne()),n;if(n===6)throw Error(R(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,tn(e,Ce,gt),_e(e,ne()),null}function Nl(e,t){var n=H;H|=1;try{return e(t)}finally{H=n,H===0&&(Qn=ne()+500,Oa&&Qt())}}function xn(e){Ft!==null&&Ft.tag===0&&!(H&6)&&zn();var t=H;H|=1;var n=ze.transition,s=q;try{if(ze.transition=null,q=1,e)return e()}finally{q=s,ze.transition=n,H=t,!(H&6)&&Qt()}}function Cl(){Te=Ln.current,V(Ln)}function mn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,kh(n)),re!==null)for(n=re.return;n!==null;){var s=n;switch(al(s),s.tag){case 1:s=s.type.childContextTypes,s!=null&&pa();break;case 3:Yn(),V(Re),V(ge),fl();break;case 5:ml(s);break;case 4:Yn();break;case 13:V(Q);break;case 19:V(Q);break;case 10:cl(s.type._context);break;case 22:case 23:Cl()}n=n.return}if(ce=e,re=e=$t(e.current,null),ue=Te=t,oe=0,nr=null,kl=qa=yn=0,Ce=Bs=null,un!==null){for(t=0;t<un.length;t++)if(n=un[t],s=n.interleaved,s!==null){n.interleaved=null;var r=s.next,o=n.pending;if(o!==null){var i=o.next;o.next=r,s.next=i}n.pending=s}un=null}return e}function Ep(e,t){do{var n=re;try{if(ll(),Kr.current=wa,va){for(var s=Z.memoizedState;s!==null;){var r=s.queue;r!==null&&(r.pending=null),s=s.next}va=!1}if(bn=0,le=ae=Z=null,Ps=!1,Xs=0,wl.current=null,n===null||n.return===null){oe=1,nr=t,re=null;break}e:{var o=e,i=n.return,l=n,c=t;if(t=ue,l.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var d=c,u=l,m=u.tag;if(!(u.mode&1)&&(m===0||m===11||m===15)){var f=u.alternate;f?(u.updateQueue=f.updateQueue,u.memoizedState=f.memoizedState,u.lanes=f.lanes):(u.updateQueue=null,u.memoizedState=null)}var b=qc(i);if(b!==null){b.flags&=-257,zc(b,i,l,o,t),b.mode&1&&Hc(o,d,t),t=b,c=d;var w=t.updateQueue;if(w===null){var x=new Set;x.add(c),t.updateQueue=x}else w.add(c);break e}else{if(!(t&1)){Hc(o,d,t),jl();break e}c=Error(R(426))}}else if(Y&&l.mode&1){var S=qc(i);if(S!==null){!(S.flags&65536)&&(S.flags|=256),zc(S,i,l,o,t),ol(Jn(c,l));break e}}o=c=Jn(c,l),oe!==4&&(oe=2),Bs===null?Bs=[o]:Bs.push(o),o=i;do{switch(o.tag){case 3:o.flags|=65536,t&=-t,o.lanes|=t;var p=up(o,c,t);Ic(o,p);break e;case 1:l=c;var h=o.type,g=o.stateNode;if(!(o.flags&128)&&(typeof h.getDerivedStateFromError=="function"||g!==null&&typeof g.componentDidCatch=="function"&&(qt===null||!qt.has(g)))){o.flags|=65536,t&=-t,o.lanes|=t;var v=pp(o,l,t);Ic(o,v);break e}}o=o.return}while(o!==null)}Tp(n)}catch(C){t=C,re===n&&n!==null&&(re=n=n.return);continue}break}while(!0)}function _p(){var e=ka.current;return ka.current=wa,e===null?wa:e}function jl(){(oe===0||oe===3||oe===2)&&(oe=4),ce===null||!(yn&268435455)&&!(qa&268435455)||Bt(ce,ue)}function Ca(e,t){var n=H;H|=2;var s=_p();(ce!==e||ue!==t)&&(gt=null,mn(e,t));do try{Kh();break}catch(r){Ep(e,r)}while(!0);if(ll(),H=n,ka.current=s,re!==null)throw Error(R(261));return ce=null,ue=0,oe}function Kh(){for(;re!==null;)Mp(re)}function Vh(){for(;re!==null&&!xf();)Mp(re)}function Mp(e){var t=Pp(e.alternate,e,Te);e.memoizedProps=e.pendingProps,t===null?Tp(e):re=t,wl.current=null}function Tp(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Uh(n,t),n!==null){n.flags&=32767,re=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{oe=6,re=null;return}}else if(n=Wh(n,t,Te),n!==null){re=n;return}if(t=t.sibling,t!==null){re=t;return}re=t=e}while(t!==null);oe===0&&(oe=5)}function tn(e,t,n){var s=q,r=ze.transition;try{ze.transition=null,q=1,Yh(e,t,n,s)}finally{ze.transition=r,q=s}return null}function Yh(e,t,n,s){do zn();while(Ft!==null);if(H&6)throw Error(R(327));n=e.finishedWork;var r=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(R(177));e.callbackNode=null,e.callbackPriority=0;var o=n.lanes|n.childLanes;if(_f(e,o),e===ce&&(re=ce=null,ue=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Ar||(Ar=!0,Dp(oa,function(){return zn(),null})),o=(n.flags&15990)!==0,n.subtreeFlags&15990||o){o=ze.transition,ze.transition=null;var i=q;q=1;var l=H;H|=4,wl.current=null,qh(e,n),Cp(n,e),hh(ci),la=!!li,ci=li=null,e.current=n,zh(n),vf(),H=l,q=i,ze.transition=o}else e.current=n;if(Ar&&(Ar=!1,Ft=e,Na=r),o=e.pendingLanes,o===0&&(qt=null),Sf(n.stateNode),_e(e,ne()),t!==null)for(s=e.onRecoverableError,n=0;n<t.length;n++)r=t[n],s(r.value,{componentStack:r.stack,digest:r.digest});if(Sa)throw Sa=!1,e=_i,_i=null,e;return Na&1&&e.tag!==0&&zn(),o=e.pendingLanes,o&1?e===Mi?Is++:(Is=0,Mi=e):Is=0,Qt(),null}function zn(){if(Ft!==null){var e=uu(Na),t=ze.transition,n=q;try{if(ze.transition=null,q=16>e?16:e,Ft===null)var s=!1;else{if(e=Ft,Ft=null,Na=0,H&6)throw Error(R(331));var r=H;for(H|=4,P=e.current;P!==null;){var o=P,i=o.child;if(P.flags&16){var l=o.deletions;if(l!==null){for(var c=0;c<l.length;c++){var d=l[c];for(P=d;P!==null;){var u=P;switch(u.tag){case 0:case 11:case 15:Ds(8,u,o)}var m=u.child;if(m!==null)m.return=u,P=m;else for(;P!==null;){u=P;var f=u.sibling,b=u.return;if(kp(u),u===d){P=null;break}if(f!==null){f.return=b,P=f;break}P=b}}}var w=o.alternate;if(w!==null){var x=w.child;if(x!==null){w.child=null;do{var S=x.sibling;x.sibling=null,x=S}while(x!==null)}}P=o}}if(o.subtreeFlags&2064&&i!==null)i.return=o,P=i;else e:for(;P!==null;){if(o=P,o.flags&2048)switch(o.tag){case 0:case 11:case 15:Ds(9,o,o.return)}var p=o.sibling;if(p!==null){p.return=o.return,P=p;break e}P=o.return}}var h=e.current;for(P=h;P!==null;){i=P;var g=i.child;if(i.subtreeFlags&2064&&g!==null)g.return=i,P=g;else e:for(i=h;P!==null;){if(l=P,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:Ha(9,l)}}catch(C){ee(l,l.return,C)}if(l===i){P=null;break e}var v=l.sibling;if(v!==null){v.return=l.return,P=v;break e}P=l.return}}if(H=r,Qt(),it&&typeof it.onPostCommitFiberRoot=="function")try{it.onPostCommitFiberRoot(Da,e)}catch{}s=!0}return s}finally{q=n,ze.transition=t}}return!1}function sd(e,t,n){t=Jn(n,t),t=up(e,t,1),e=Ht(e,t,1),t=xe(),e!==null&&(ar(e,1,t),_e(e,t))}function ee(e,t,n){if(e.tag===3)sd(e,e,n);else for(;t!==null;){if(t.tag===3){sd(t,e,n);break}else if(t.tag===1){var s=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof s.componentDidCatch=="function"&&(qt===null||!qt.has(s))){e=Jn(n,e),e=pp(t,e,1),t=Ht(t,e,1),e=xe(),t!==null&&(ar(t,1,e),_e(t,e));break}}t=t.return}}function Jh(e,t,n){var s=e.pingCache;s!==null&&s.delete(t),t=xe(),e.pingedLanes|=e.suspendedLanes&n,ce===e&&(ue&n)===n&&(oe===4||oe===3&&(ue&130023424)===ue&&500>ne()-Sl?mn(e,0):kl|=n),_e(e,t)}function Ap(e,t){t===0&&(e.mode&1?(t=kr,kr<<=1,!(kr&130023424)&&(kr=4194304)):t=1);var n=xe();e=St(e,t),e!==null&&(ar(e,t,n),_e(e,n))}function Qh(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Ap(e,n)}function Zh(e,t){var n=0;switch(e.tag){case 13:var s=e.stateNode,r=e.memoizedState;r!==null&&(n=r.retryLane);break;case 19:s=e.stateNode;break;default:throw Error(R(314))}s!==null&&s.delete(t),Ap(e,n)}var Pp;Pp=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Re.current)je=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return je=!1,Oh(e,t,n);je=!!(e.flags&131072)}else je=!1,Y&&t.flags&1048576&&Fu(t,ha,t.index);switch(t.lanes=0,t.tag){case 2:var s=t.type;Yr(e,t),e=t.pendingProps;var r=Gn(t,ge.current);qn(t,n),r=gl(null,t,s,e,r,n);var o=bl();return t.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Ee(s)?(o=!0,ma(t)):o=!1,t.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,ul(t),r.updater=Ua,t.stateNode=r,r._reactInternals=t,yi(t,s,e,n),t=wi(null,t,s,!0,o,n)):(t.tag=0,Y&&o&&rl(t),be(null,t,r,n),t=t.child),t;case 16:s=t.elementType;e:{switch(Yr(e,t),e=t.pendingProps,r=s._init,s=r(s._payload),t.type=s,r=t.tag=eg(s),e=Ve(s,e),r){case 0:t=vi(null,t,s,e,n);break e;case 1:t=Kc(null,t,s,e,n);break e;case 11:t=$c(null,t,s,e,n);break e;case 14:t=Gc(null,t,s,Ve(s.type,e),n);break e}throw Error(R(306,s,""))}return t;case 0:return s=t.type,r=t.pendingProps,r=t.elementType===s?r:Ve(s,r),vi(e,t,s,r,n);case 1:return s=t.type,r=t.pendingProps,r=t.elementType===s?r:Ve(s,r),Kc(e,t,s,r,n);case 3:e:{if(gp(t),e===null)throw Error(R(387));s=t.pendingProps,o=t.memoizedState,r=o.element,qu(e,t),ya(t,s,null,n);var i=t.memoizedState;if(s=i.element,o.isDehydrated)if(o={element:s,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){r=Jn(Error(R(423)),t),t=Vc(e,t,s,n,r);break e}else if(s!==r){r=Jn(Error(R(424)),t),t=Vc(e,t,s,n,r);break e}else for(Pe=Ut(t.stateNode.containerInfo.firstChild),De=t,Y=!0,Je=null,n=Uu(t,null,s,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Kn(),s===r){t=Nt(e,t,n);break e}be(e,t,s,n)}t=t.child}return t;case 5:return zu(t),e===null&&hi(t),s=t.type,r=t.pendingProps,o=e!==null?e.memoizedProps:null,i=r.children,di(s,r)?i=null:o!==null&&di(s,o)&&(t.flags|=32),hp(e,t),be(e,t,i,n),t.child;case 6:return e===null&&hi(t),null;case 13:return bp(e,t,n);case 4:return pl(t,t.stateNode.containerInfo),s=t.pendingProps,e===null?t.child=Vn(t,null,s,n):be(e,t,s,n),t.child;case 11:return s=t.type,r=t.pendingProps,r=t.elementType===s?r:Ve(s,r),$c(e,t,s,r,n);case 7:return be(e,t,t.pendingProps,n),t.child;case 8:return be(e,t,t.pendingProps.children,n),t.child;case 12:return be(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(s=t.type._context,r=t.pendingProps,o=t.memoizedProps,i=r.value,G(ga,s._currentValue),s._currentValue=i,o!==null)if(et(o.value,i)){if(o.children===r.children&&!Re.current){t=Nt(e,t,n);break e}}else for(o=t.child,o!==null&&(o.return=t);o!==null;){var l=o.dependencies;if(l!==null){i=o.child;for(var c=l.firstContext;c!==null;){if(c.context===s){if(o.tag===1){c=vt(-1,n&-n),c.tag=2;var d=o.updateQueue;if(d!==null){d=d.shared;var u=d.pending;u===null?c.next=c:(c.next=u.next,u.next=c),d.pending=c}}o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),gi(o.return,n,t),l.lanes|=n;break}c=c.next}}else if(o.tag===10)i=o.type===t.type?null:o.child;else if(o.tag===18){if(i=o.return,i===null)throw Error(R(341));i.lanes|=n,l=i.alternate,l!==null&&(l.lanes|=n),gi(i,n,t),i=o.sibling}else i=o.child;if(i!==null)i.return=o;else for(i=o;i!==null;){if(i===t){i=null;break}if(o=i.sibling,o!==null){o.return=i.return,i=o;break}i=i.return}o=i}be(e,t,r.children,n),t=t.child}return t;case 9:return r=t.type,s=t.pendingProps.children,qn(t,n),r=$e(r),s=s(r),t.flags|=1,be(e,t,s,n),t.child;case 14:return s=t.type,r=Ve(s,t.pendingProps),r=Ve(s.type,r),Gc(e,t,s,r,n);case 15:return mp(e,t,t.type,t.pendingProps,n);case 17:return s=t.type,r=t.pendingProps,r=t.elementType===s?r:Ve(s,r),Yr(e,t),t.tag=1,Ee(s)?(e=!0,ma(t)):e=!1,qn(t,n),dp(t,s,r),yi(t,s,r,n),wi(null,t,s,!0,e,n);case 19:return yp(e,t,n);case 22:return fp(e,t,n)}throw Error(R(156,t.tag))};function Dp(e,t){return iu(e,t)}function Xh(e,t,n,s){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=s,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function He(e,t,n,s){return new Xh(e,t,n,s)}function Rl(e){return e=e.prototype,!(!e||!e.isReactComponent)}function eg(e){if(typeof e=="function")return Rl(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Gi)return 11;if(e===Ki)return 14}return 2}function $t(e,t){var n=e.alternate;return n===null?(n=He(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Zr(e,t,n,s,r,o){var i=2;if(s=e,typeof e=="function")Rl(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case En:return fn(n.children,r,o,t);case $i:i=8,r|=8;break;case Ho:return e=He(12,n,t,r|2),e.elementType=Ho,e.lanes=o,e;case qo:return e=He(13,n,t,r),e.elementType=qo,e.lanes=o,e;case zo:return e=He(19,n,t,r),e.elementType=zo,e.lanes=o,e;case zd:return za(n,r,o,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Hd:i=10;break e;case qd:i=9;break e;case Gi:i=11;break e;case Ki:i=14;break e;case At:i=16,s=null;break e}throw Error(R(130,e==null?e:typeof e,""))}return t=He(i,n,t,r),t.elementType=e,t.type=s,t.lanes=o,t}function fn(e,t,n,s){return e=He(7,e,s,t),e.lanes=n,e}function za(e,t,n,s){return e=He(22,e,s,t),e.elementType=zd,e.lanes=n,e.stateNode={isHidden:!1},e}function _o(e,t,n){return e=He(6,e,null,t),e.lanes=n,e}function Mo(e,t,n){return t=He(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function tg(e,t,n,s,r){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=co(0),this.expirationTimes=co(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=co(0),this.identifierPrefix=s,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function El(e,t,n,s,r,o,i,l,c){return e=new tg(e,t,n,l,c),t===1?(t=1,o===!0&&(t|=8)):t=0,o=He(3,null,null,t),e.current=o,o.stateNode=e,o.memoizedState={element:s,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},ul(o),e}function ng(e,t,n){var s=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Rn,key:s==null?null:""+s,children:e,containerInfo:t,implementation:n}}function Bp(e){if(!e)return Kt;e=e._reactInternals;e:{if(kn(e)!==e||e.tag!==1)throw Error(R(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Ee(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(R(171))}if(e.tag===1){var n=e.type;if(Ee(n))return Bu(e,n,t)}return t}function Ip(e,t,n,s,r,o,i,l,c){return e=El(n,s,!0,e,r,o,i,l,c),e.context=Bp(null),n=e.current,s=xe(),r=zt(n),o=vt(s,r),o.callback=t??null,Ht(n,o,r),e.current.lanes=r,ar(e,r,s),_e(e,s),e}function $a(e,t,n,s){var r=t.current,o=xe(),i=zt(r);return n=Bp(n),t.context===null?t.context=n:t.pendingContext=n,t=vt(o,i),t.payload={element:e},s=s===void 0?null:s,s!==null&&(t.callback=s),e=Ht(r,t,i),e!==null&&(Ze(e,r,i,o),Gr(e,r,i)),i}function ja(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function rd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function _l(e,t){rd(e,t),(e=e.alternate)&&rd(e,t)}function sg(){return null}var Fp=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ml(e){this._internalRoot=e}Ga.prototype.render=Ml.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(R(409));$a(e,t,null,null)};Ga.prototype.unmount=Ml.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;xn(function(){$a(null,e,null,null)}),t[kt]=null}};function Ga(e){this._internalRoot=e}Ga.prototype.unstable_scheduleHydration=function(e){if(e){var t=fu();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Dt.length&&t!==0&&t<Dt[n].priority;n++);Dt.splice(n,0,e),n===0&&gu(e)}};function Tl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ka(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function ad(){}function rg(e,t,n,s,r){if(r){if(typeof s=="function"){var o=s;s=function(){var d=ja(i);o.call(d)}}var i=Ip(t,s,e,0,null,!1,!1,"",ad);return e._reactRootContainer=i,e[kt]=i.current,Vs(e.nodeType===8?e.parentNode:e),xn(),i}for(;r=e.lastChild;)e.removeChild(r);if(typeof s=="function"){var l=s;s=function(){var d=ja(c);l.call(d)}}var c=El(e,0,!1,null,null,!1,!1,"",ad);return e._reactRootContainer=c,e[kt]=c.current,Vs(e.nodeType===8?e.parentNode:e),xn(function(){$a(t,c,n,s)}),c}function Va(e,t,n,s,r){var o=n._reactRootContainer;if(o){var i=o;if(typeof r=="function"){var l=r;r=function(){var c=ja(i);l.call(c)}}$a(t,i,e,r)}else i=rg(n,t,e,r,s);return ja(i)}pu=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=js(t.pendingLanes);n!==0&&(Ji(t,n|1),_e(t,ne()),!(H&6)&&(Qn=ne()+500,Qt()))}break;case 13:xn(function(){var s=St(e,1);if(s!==null){var r=xe();Ze(s,e,1,r)}}),_l(e,1)}};Qi=function(e){if(e.tag===13){var t=St(e,134217728);if(t!==null){var n=xe();Ze(t,e,134217728,n)}_l(e,134217728)}};mu=function(e){if(e.tag===13){var t=zt(e),n=St(e,t);if(n!==null){var s=xe();Ze(n,e,t,s)}_l(e,t)}};fu=function(){return q};hu=function(e,t){var n=q;try{return q=e,t()}finally{q=n}};ei=function(e,t,n){switch(t){case"input":if(Ko(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var s=n[t];if(s!==e&&s.form===e.form){var r=La(s);if(!r)throw Error(R(90));Gd(s),Ko(s,r)}}}break;case"textarea":Vd(e,n);break;case"select":t=n.value,t!=null&&On(e,!!n.multiple,t,!1)}};tu=Nl;nu=xn;var ag={usingClientEntryPoint:!1,Events:[ir,An,La,Xd,eu,Nl]},gs={findFiberByHostInstance:dn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},og={bundleType:gs.bundleType,version:gs.version,rendererPackageName:gs.rendererPackageName,rendererConfig:gs.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Et.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=au(e),e===null?null:e.stateNode},findFiberByHostInstance:gs.findFiberByHostInstance||sg,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Pr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Pr.isDisabled&&Pr.supportsFiber)try{Da=Pr.inject(og),it=Pr}catch{}}Ie.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ag;Ie.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Tl(t))throw Error(R(200));return ng(e,t,null,n)};Ie.createRoot=function(e,t){if(!Tl(e))throw Error(R(299));var n=!1,s="",r=Fp;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=El(e,1,!1,null,null,n,!1,s,r),e[kt]=t.current,Vs(e.nodeType===8?e.parentNode:e),new Ml(t)};Ie.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(R(188)):(e=Object.keys(e).join(","),Error(R(268,e)));return e=au(t),e=e===null?null:e.stateNode,e};Ie.flushSync=function(e){return xn(e)};Ie.hydrate=function(e,t,n){if(!Ka(t))throw Error(R(200));return Va(null,e,t,!0,n)};Ie.hydrateRoot=function(e,t,n){if(!Tl(e))throw Error(R(405));var s=n!=null&&n.hydratedSources||null,r=!1,o="",i=Fp;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=Ip(t,null,e,1,n??null,r,!1,o,i),e[kt]=t.current,Vs(e),s)for(e=0;e<s.length;e++)n=s[e],r=n._getVersion,r=r(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,r]:t.mutableSourceEagerHydrationData.push(n,r);return new Ga(t)};Ie.render=function(e,t,n){if(!Ka(t))throw Error(R(200));return Va(null,e,t,!1,n)};Ie.unmountComponentAtNode=function(e){if(!Ka(e))throw Error(R(40));return e._reactRootContainer?(xn(function(){Va(null,null,e,!1,function(){e._reactRootContainer=null,e[kt]=null})}),!0):!1};Ie.unstable_batchedUpdates=Nl;Ie.unstable_renderSubtreeIntoContainer=function(e,t,n,s){if(!Ka(n))throw Error(R(200));if(e==null||e._reactInternals===void 0)throw Error(R(38));return Va(e,t,n,!1,s)};Ie.version="18.3.1-next-f1338f8080-20240426";function Lp(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Lp)}catch(e){console.error(e)}}Lp(),Ld.exports=Ie;var ig=Ld.exports,Op,od=ig;Op=od.createRoot,od.hydrateRoot;/**
 * react-router v7.18.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */var Al=/^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i,Wp=/^[\\/]{2}/;function lg(e,t){return t+e.replace(/\\/g,"/")}var id="popstate";function ld(e){return typeof e=="object"&&e!=null&&"pathname"in e&&"search"in e&&"hash"in e&&"state"in e&&"key"in e}function cg(e={}){function t(s,r){var d;let o=(d=r.state)==null?void 0:d.masked,{pathname:i,search:l,hash:c}=o||s.location;return Pi("",{pathname:i,search:l,hash:c},r.state&&r.state.usr||null,r.state&&r.state.key||"default",o?{pathname:s.location.pathname,search:s.location.search,hash:s.location.hash}:void 0)}function n(s,r){return typeof r=="string"?r:sr(r)}return ug(t,n,null,e)}function J(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function tt(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function dg(){return Math.random().toString(36).substring(2,10)}function cd(e,t){return{usr:e.state,key:e.key,idx:t,masked:e.mask?{pathname:e.pathname,search:e.search,hash:e.hash}:void 0}}function Pi(e,t,n=null,s,r){return{pathname:typeof e=="string"?e:e.pathname,search:"",hash:"",...typeof t=="string"?ns(t):t,state:n,key:t&&t.key||s||dg(),mask:r}}function sr({pathname:e="/",search:t="",hash:n=""}){return t&&t!=="?"&&(e+=t.charAt(0)==="?"?t:"?"+t),n&&n!=="#"&&(e+=n.charAt(0)==="#"?n:"#"+n),e}function ns(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substring(n),e=e.substring(0,n));let s=e.indexOf("?");s>=0&&(t.search=e.substring(s),e=e.substring(0,s)),e&&(t.pathname=e)}return t}function ug(e,t,n,s={}){let{window:r=document.defaultView,v5Compat:o=!1}=s,i=r.history,l="POP",c=null,d=u();d==null&&(d=0,i.replaceState({...i.state,idx:d},""));function u(){return(i.state||{idx:null}).idx}function m(){l="POP";let S=u(),p=S==null?null:S-d;d=S,c&&c({action:l,location:x.location,delta:p})}function f(S,p){l="PUSH";let h=ld(S)?S:Pi(x.location,S,p);d=u()+1;let g=cd(h,d),v=x.createHref(h.mask||h);try{i.pushState(g,"",v)}catch(C){if(C instanceof DOMException&&C.name==="DataCloneError")throw C;r.location.assign(v)}o&&c&&c({action:l,location:x.location,delta:1})}function b(S,p){l="REPLACE";let h=ld(S)?S:Pi(x.location,S,p);d=u();let g=cd(h,d),v=x.createHref(h.mask||h);i.replaceState(g,"",v),o&&c&&c({action:l,location:x.location,delta:0})}function w(S){return pg(r,S)}let x={get action(){return l},get location(){return e(r,i)},listen(S){if(c)throw new Error("A history only accepts one active listener");return r.addEventListener(id,m),c=S,()=>{r.removeEventListener(id,m),c=null}},createHref(S){return t(r,S)},createURL:w,encodeLocation(S){let p=w(S);return{pathname:p.pathname,search:p.search,hash:p.hash}},push:f,replace:b,go(S){return i.go(S)}};return x}function pg(e,t,n=!1){let s="http://localhost";e&&(s=e.location.origin!=="null"?e.location.origin:e.location.href),J(s,"No window.location.(origin|href) available to create URL");let r=typeof t=="string"?t:sr(t);return r=r.replace(/ $/,"%20"),!n&&Wp.test(r)&&(r=s+r),new URL(r,s)}function Up(e,t,n="/"){return mg(e,t,n,!1)}function mg(e,t,n,s,r){let o=typeof t=="string"?ns(t):t,i=Ct(o.pathname||"/",n);if(i==null)return null;let l=fg(e),c=null,d=Cg(i);for(let u=0;c==null&&u<l.length;++u)c=Ng(l[u],d,s);return c}function fg(e){let t=Hp(e);return hg(t),t}function Hp(e,t=[],n=[],s="",r=!1){let o=(i,l,c=r,d)=>{let u={relativePath:d===void 0?i.path||"":d,caseSensitive:i.caseSensitive===!0,childrenIndex:l,route:i};if(u.relativePath.startsWith("/")){if(!u.relativePath.startsWith(s)&&c)return;J(u.relativePath.startsWith(s),`Absolute route path "${u.relativePath}" nested under path "${s}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),u.relativePath=u.relativePath.slice(s.length)}let m=Xe([s,u.relativePath]),f=n.concat(u);i.children&&i.children.length>0&&(J(i.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${m}".`),Hp(i.children,t,f,m,c)),!(i.path==null&&!i.index)&&t.push({path:m,score:kg(m,i.index),routesMeta:f.map((b,w)=>{let[x,S]=$p(b.relativePath,b.caseSensitive,w===f.length-1);return{...b,matcher:x,compiledParams:S}})})};return e.forEach((i,l)=>{var c;if(i.path===""||!((c=i.path)!=null&&c.includes("?")))o(i,l);else for(let d of qp(i.path))o(i,l,!0,d)}),t}function qp(e){let t=e.split("/");if(t.length===0)return[];let[n,...s]=t,r=n.endsWith("?"),o=n.replace(/\?$/,"");if(s.length===0)return r?[o,""]:[o];let i=qp(s.join("/")),l=[];return l.push(...i.map(c=>c===""?o:[o,c].join("/"))),r&&l.push(...i),l.map(c=>e.startsWith("/")&&c===""?"/":c)}function hg(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:Sg(t.routesMeta.map(s=>s.childrenIndex),n.routesMeta.map(s=>s.childrenIndex)))}var gg=/^:[\w-]+$/,bg=3,yg=2,xg=1,vg=10,wg=-2,dd=e=>e==="*";function kg(e,t){let n=e.split("/"),s=n.length;return n.some(dd)&&(s+=wg),t&&(s+=yg),n.filter(r=>!dd(r)).reduce((r,o)=>r+(gg.test(o)?bg:o===""?xg:vg),s)}function Sg(e,t){return e.length===t.length&&e.slice(0,-1).every((s,r)=>s===t[r])?e[e.length-1]-t[t.length-1]:0}function Ng(e,t,n=!1){let{routesMeta:s}=e,r={},o="/",i=[];for(let l=0;l<s.length;++l){let c=s[l],d=l===s.length-1,u=o==="/"?t:t.slice(o.length)||"/",m={path:c.relativePath,caseSensitive:c.caseSensitive,end:d},f=c.matcher&&c.compiledParams?zp(m,u,c.matcher,c.compiledParams):Ra(m,u),b=c.route;if(!f&&d&&n&&!s[s.length-1].route.index&&(f=Ra({path:c.relativePath,caseSensitive:c.caseSensitive,end:!1},u)),!f)return null;Object.assign(r,f.params),i.push({params:r,pathname:Xe([o,f.pathname]),pathnameBase:Eg(Xe([o,f.pathnameBase])),route:b}),f.pathnameBase!=="/"&&(o=Xe([o,f.pathnameBase]))}return i}function Ra(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,s]=$p(e.path,e.caseSensitive,e.end);return zp(e,t,n,s)}function zp(e,t,n,s){let r=t.match(n);if(!r)return null;let o=r[0],i=o.replace(/(.)\/+$/,"$1"),l=r.slice(1);return{params:s.reduce((d,{paramName:u,isOptional:m},f)=>{if(u==="*"){let w=l[f]||"";i=o.slice(0,o.length-w.length).replace(/(.)\/+$/,"$1")}const b=l[f];return m&&!b?d[u]=void 0:d[u]=(b||"").replace(/%2F/g,"/"),d},{}),pathname:o,pathnameBase:i,pattern:e}}function $p(e,t=!1,n=!0){tt(e==="*"||!e.endsWith("*")||e.endsWith("/*"),`Route path "${e}" will be treated as if it were "${e.replace(/\*$/,"/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${e.replace(/\*$/,"/*")}".`);let s=[],r="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(i,l,c,d,u)=>{if(s.push({paramName:l,isOptional:c!=null}),c){let m=u.charAt(d+i.length);return m&&m!=="/"?"/([^\\/]*)":"(?:/([^\\/]*))?"}return"/([^\\/]+)"}).replace(/\/([\w-]+)\?(\/|$)/g,"(/$1)?$2");return e.endsWith("*")?(s.push({paramName:"*"}),r+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?r+="\\/*$":e!==""&&e!=="/"&&(r+="(?:(?=\\/|$))"),[new RegExp(r,t?void 0:"i"),s]}function Cg(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return tt(!1,`The URL path "${e}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${t}).`),e}}function Ct(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,s=e.charAt(n);return s&&s!=="/"?null:e.slice(n)||"/"}function jg(e,t="/"){let{pathname:n,search:s="",hash:r=""}=typeof e=="string"?ns(e):e,o;return n?(n=Gp(n),n.startsWith("/")?o=ud(n.substring(1),"/"):o=ud(n,t)):o=t,{pathname:o,search:_g(s),hash:Mg(r)}}function ud(e,t){let n=Ea(t).split("/");return e.split("/").forEach(r=>{r===".."?n.length>1&&n.pop():r!=="."&&n.push(r)}),n.length>1?n.join("/"):"/"}function To(e,t,n,s){return`Cannot include a '${e}' character in a manually specified \`to.${t}\` field [${JSON.stringify(s)}].  Please separate it out to the \`to.${n}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function Rg(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function Pl(e){let t=Rg(e);return t.map((n,s)=>s===t.length-1?n.pathname:n.pathnameBase)}function Ya(e,t,n,s=!1){let r;typeof e=="string"?r=ns(e):(r={...e},J(!r.pathname||!r.pathname.includes("?"),To("?","pathname","search",r)),J(!r.pathname||!r.pathname.includes("#"),To("#","pathname","hash",r)),J(!r.search||!r.search.includes("#"),To("#","search","hash",r)));let o=e===""||r.pathname==="",i=o?"/":r.pathname,l;if(i==null)l=n;else{let m=t.length-1;if(!s&&i.startsWith("..")){let f=i.split("/");for(;f[0]==="..";)f.shift(),m-=1;r.pathname=f.join("/")}l=m>=0?t[m]:"/"}let c=jg(r,l),d=i&&i!=="/"&&i.endsWith("/"),u=(o||i===".")&&n.endsWith("/");return!c.pathname.endsWith("/")&&(d||u)&&(c.pathname+="/"),c}var Gp=e=>e.replace(/[\\/]{2,}/g,"/"),Xe=e=>Gp(e.join("/")),Ea=e=>e.replace(/\/+$/,""),Eg=e=>Ea(e).replace(/^\/*/,"/"),_g=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Mg=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e,Tg=class{constructor(e,t,n,s=!1){this.status=e,this.statusText=t||"",this.internal=s,n instanceof Error?(this.data=n.toString(),this.error=n):this.data=n}};function Ag(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}function Pg(e){let t=e.map(n=>n.route.path).filter(Boolean);return Xe(t)||"/"}var Kp=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";function Vp(e,t){let n=e;if(typeof n!="string"||!Al.test(n))return{absoluteURL:void 0,isExternal:!1,to:n};let s=n,r=!1;if(Kp)try{let o=new URL(window.location.href),i=Wp.test(n)?new URL(lg(n,o.protocol)):new URL(n),l=Ct(i.pathname,t);i.origin===o.origin&&l!=null?n=l+i.search+i.hash:r=!0}catch{tt(!1,`<Link to="${n}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}return{absoluteURL:s,isExternal:r,to:n}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");var Yp=["POST","PUT","PATCH","DELETE"];new Set(Yp);var Dg=["GET",...Yp];new Set(Dg);var Bg=["about:","blob:","chrome:","chrome-untrusted:","content:","data:","devtools:","file:","filesystem:","javascript:"];function Ig(e){try{return Bg.includes(new URL(e).protocol)}catch{return!1}}var ss=y.createContext(null);ss.displayName="DataRouter";var Ja=y.createContext(null);Ja.displayName="DataRouterState";var Jp=y.createContext(!1);function Fg(){return y.useContext(Jp)}var Qp=y.createContext({isTransitioning:!1});Qp.displayName="ViewTransition";var Lg=y.createContext(new Map);Lg.displayName="Fetchers";var Og=y.createContext(null);Og.displayName="Await";var Le=y.createContext(null);Le.displayName="Navigation";var cr=y.createContext(null);cr.displayName="Location";var dt=y.createContext({outlet:null,matches:[],isDataRoute:!1});dt.displayName="Route";var Dl=y.createContext(null);Dl.displayName="RouteError";var Zp="REACT_ROUTER_ERROR",Wg="REDIRECT",Ug="ROUTE_ERROR_RESPONSE";function Hg(e){if(e.startsWith(`${Zp}:${Wg}:{`))try{let t=JSON.parse(e.slice(28));if(typeof t=="object"&&t&&typeof t.status=="number"&&typeof t.statusText=="string"&&typeof t.location=="string"&&typeof t.reloadDocument=="boolean"&&typeof t.replace=="boolean")return t}catch{}}function qg(e){if(e.startsWith(`${Zp}:${Ug}:{`))try{let t=JSON.parse(e.slice(40));if(typeof t=="object"&&t&&typeof t.status=="number"&&typeof t.statusText=="string")return new Tg(t.status,t.statusText,t.data)}catch{}}function zg(e,{relative:t}={}){J(rs(),"useHref() may be used only in the context of a <Router> component.");let{basename:n,navigator:s}=y.useContext(Le),{hash:r,pathname:o,search:i}=dr(e,{relative:t}),l=o;return n!=="/"&&(l=o==="/"?n:Xe([n,o])),s.createHref({pathname:l,search:i,hash:r})}function rs(){return y.useContext(cr)!=null}function ut(){return J(rs(),"useLocation() may be used only in the context of a <Router> component."),y.useContext(cr).location}var Xp="You should call navigate() in a React.useEffect(), not when your component is first rendered.";function em(e){y.useContext(Le).static||y.useLayoutEffect(e)}function Sn(){let{isDataRoute:e}=y.useContext(dt);return e?sb():$g()}function $g(){J(rs(),"useNavigate() may be used only in the context of a <Router> component.");let e=y.useContext(ss),{basename:t,navigator:n}=y.useContext(Le),{matches:s}=y.useContext(dt),{pathname:r}=ut(),o=JSON.stringify(Pl(s)),i=y.useRef(!1);return em(()=>{i.current=!0}),y.useCallback((c,d={})=>{if(tt(i.current,Xp),!i.current)return;if(typeof c=="number"){n.go(c);return}let u=Ya(c,JSON.parse(o),r,d.relative==="path");e==null&&t!=="/"&&(u.pathname=u.pathname==="/"?t:Xe([t,u.pathname])),(d.replace?n.replace:n.push)(u,d.state,d)},[t,n,o,r,e])}y.createContext(null);function dr(e,{relative:t}={}){let{matches:n}=y.useContext(dt),{pathname:s}=ut(),r=JSON.stringify(Pl(n));return y.useMemo(()=>Ya(e,JSON.parse(r),s,t==="path"),[e,r,s,t])}function Gg(e,t){return tm(e,t)}function tm(e,t,n){var S;J(rs(),"useRoutes() may be used only in the context of a <Router> component.");let{navigator:s}=y.useContext(Le),{matches:r}=y.useContext(dt),o=r[r.length-1],i=o?o.params:{},l=o?o.pathname:"/",c=o?o.pathnameBase:"/",d=o&&o.route;{let p=d&&d.path||"";sm(l,!d||p.endsWith("*")||p.endsWith("*?"),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${l}" (under <Route path="${p}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${p}"> to <Route path="${p==="/"?"*":`${p}/*`}">.`)}let u=ut(),m;if(t){let p=typeof t=="string"?ns(t):t;J(c==="/"||((S=p.pathname)==null?void 0:S.startsWith(c)),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${c}" but pathname "${p.pathname}" was given in the \`location\` prop.`),m=p}else m=u;let f=m.pathname||"/",b=f;if(c!=="/"){let p=c.replace(/^\//,"").split("/");b="/"+f.replace(/^\//,"").split("/").slice(p.length).join("/")}let w=n&&n.state.matches.length?n.state.matches.map(p=>Object.assign(p,{route:n.manifest[p.route.id]||p.route})):Up(e,{pathname:b});tt(d||w!=null,`No routes matched location "${m.pathname}${m.search}${m.hash}" `),tt(w==null||w[w.length-1].route.element!==void 0||w[w.length-1].route.Component!==void 0||w[w.length-1].route.lazy!==void 0,`Matched leaf route at location "${m.pathname}${m.search}${m.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let x=Qg(w&&w.map(p=>Object.assign({},p,{params:Object.assign({},i,p.params),pathname:Xe([c,s.encodeLocation?s.encodeLocation(p.pathname.replace(/%/g,"%25").replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:p.pathname]),pathnameBase:p.pathnameBase==="/"?c:Xe([c,s.encodeLocation?s.encodeLocation(p.pathnameBase.replace(/%/g,"%25").replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:p.pathnameBase])})),r,n);return t&&x?y.createElement(cr.Provider,{value:{location:{pathname:"/",search:"",hash:"",state:null,key:"default",mask:void 0,...m},navigationType:"POP"}},x):x}function Kg(){let e=nb(),t=Ag(e)?`${e.status} ${e.statusText}`:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,s="rgba(200,200,200, 0.5)",r={padding:"0.5rem",backgroundColor:s},o={padding:"2px 4px",backgroundColor:s},i=null;return console.error("Error handled by React Router default ErrorBoundary:",e),i=y.createElement(y.Fragment,null,y.createElement("p",null,"💿 Hey developer 👋"),y.createElement("p",null,"You can provide a way better UX than this when your app throws errors by providing your own ",y.createElement("code",{style:o},"ErrorBoundary")," or"," ",y.createElement("code",{style:o},"errorElement")," prop on your route.")),y.createElement(y.Fragment,null,y.createElement("h2",null,"Unexpected Application Error!"),y.createElement("h3",{style:{fontStyle:"italic"}},t),n?y.createElement("pre",{style:r},n):null,i)}var Vg=y.createElement(Kg,null),nm=class extends y.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,t){return t.location!==e.location||t.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:t.error,location:t.location,revalidation:e.revalidation||t.revalidation}}componentDidCatch(e,t){this.props.onError?this.props.onError(e,t):console.error("React Router caught the following error during render",e)}render(){let e=this.state.error;if(this.context&&typeof e=="object"&&e&&"digest"in e&&typeof e.digest=="string"){const n=qg(e.digest);n&&(e=n)}let t=e!==void 0?y.createElement(dt.Provider,{value:this.props.routeContext},y.createElement(Dl.Provider,{value:e,children:this.props.component})):this.props.children;return this.context?y.createElement(Yg,{error:e},t):t}};nm.contextType=Jp;var Ao=new WeakMap;function Yg({children:e,error:t}){let{basename:n}=y.useContext(Le);if(typeof t=="object"&&t&&"digest"in t&&typeof t.digest=="string"){let s=Hg(t.digest);if(s){let r=Ao.get(t);if(r)throw r;let o=Vp(s.location,n),i=o.absoluteURL||o.to;if(Ig(i))throw new Error("Invalid redirect location");if(Kp&&!Ao.get(t))if(o.isExternal||s.reloadDocument)window.location.href=i;else{const l=Promise.resolve().then(()=>window.__reactRouterDataRouter.navigate(o.to,{replace:s.replace}));throw Ao.set(t,l),l}return y.createElement("meta",{httpEquiv:"refresh",content:`0;url=${i}`})}}return e}function Jg({routeContext:e,match:t,children:n}){let s=y.useContext(ss);return s&&s.static&&s.staticContext&&(t.route.errorElement||t.route.ErrorBoundary)&&(s.staticContext._deepestRenderedBoundaryId=t.route.id),y.createElement(dt.Provider,{value:e},n)}function Qg(e,t=[],n){let s=n==null?void 0:n.state;if(e==null){if(!s)return null;if(s.errors)e=s.matches;else if(t.length===0&&!s.initialized&&s.matches.length>0)e=s.matches;else return null}let r=e,o=s==null?void 0:s.errors;if(o!=null){let u=r.findIndex(m=>m.route.id&&(o==null?void 0:o[m.route.id])!==void 0);J(u>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(o).join(",")}`),r=r.slice(0,Math.min(r.length,u+1))}let i=!1,l=-1;if(n&&s){i=s.renderFallback;for(let u=0;u<r.length;u++){let m=r[u];if((m.route.HydrateFallback||m.route.hydrateFallbackElement)&&(l=u),m.route.id){let{loaderData:f,errors:b}=s,w=m.route.loader&&!f.hasOwnProperty(m.route.id)&&(!b||b[m.route.id]===void 0);if(m.route.lazy||w){n.isStatic&&(i=!0),l>=0?r=r.slice(0,l+1):r=[r[0]];break}}}}let c=n==null?void 0:n.onError,d=s&&c?(u,m)=>{var f,b;c(u,{location:s.location,params:((b=(f=s.matches)==null?void 0:f[0])==null?void 0:b.params)??{},pattern:Pg(s.matches),errorInfo:m})}:void 0;return r.reduceRight((u,m,f)=>{let b,w=!1,x=null,S=null;s&&(b=o&&m.route.id?o[m.route.id]:void 0,x=m.route.errorElement||Vg,i&&(l<0&&f===0?(sm("route-fallback",!1,"No `HydrateFallback` element provided to render during initial hydration"),w=!0,S=null):l===f&&(w=!0,S=m.route.hydrateFallbackElement||null)));let p=t.concat(r.slice(0,f+1)),h=()=>{let g;return b?g=x:w?g=S:m.route.Component?g=y.createElement(m.route.Component,null):m.route.element?g=m.route.element:g=u,y.createElement(Jg,{match:m,routeContext:{outlet:u,matches:p,isDataRoute:s!=null},children:g})};return s&&(m.route.ErrorBoundary||m.route.errorElement||f===0)?y.createElement(nm,{location:s.location,revalidation:s.revalidation,component:x,error:b,children:h(),routeContext:{outlet:null,matches:p,isDataRoute:!0},onError:d}):h()},null)}function Bl(e){return`${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function Zg(e){let t=y.useContext(ss);return J(t,Bl(e)),t}function Xg(e){let t=y.useContext(Ja);return J(t,Bl(e)),t}function eb(e){let t=y.useContext(dt);return J(t,Bl(e)),t}function Il(e){let t=eb(e),n=t.matches[t.matches.length-1];return J(n.route.id,`${e} can only be used on routes that contain a unique "id"`),n.route.id}function tb(){return Il("useRouteId")}function nb(){var s;let e=y.useContext(Dl),t=Xg("useRouteError"),n=Il("useRouteError");return e!==void 0?e:(s=t.errors)==null?void 0:s[n]}function sb(){let{router:e}=Zg("useNavigate"),t=Il("useNavigate"),n=y.useRef(!1);return em(()=>{n.current=!0}),y.useCallback(async(r,o={})=>{tt(n.current,Xp),n.current&&(typeof r=="number"?await e.navigate(r):await e.navigate(r,{fromRouteId:t,...o}))},[e,t])}var pd={};function sm(e,t,n){!t&&!pd[e]&&(pd[e]=!0,tt(!1,n))}y.memo(rb);function rb({routes:e,manifest:t,future:n,state:s,isStatic:r,onError:o}){return tm(e,void 0,{manifest:t,state:s,isStatic:r,onError:o,future:n})}function Xr({to:e,replace:t,state:n,relative:s}){J(rs(),"<Navigate> may be used only in the context of a <Router> component.");let{static:r}=y.useContext(Le);tt(!r,"<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.");let{matches:o}=y.useContext(dt),{pathname:i}=ut(),l=Sn(),c=Ya(e,Pl(o),i,s==="path"),d=JSON.stringify(c);return y.useEffect(()=>{l(JSON.parse(d),{replace:t,state:n,relative:s})},[l,d,s,t,n]),null}function ye(e){J(!1,"A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.")}function ab({basename:e="/",children:t=null,location:n,navigationType:s="POP",navigator:r,static:o=!1,useTransitions:i}){J(!rs(),"You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");let l=e.replace(/^\/*/,"/"),c=y.useMemo(()=>({basename:l,navigator:r,static:o,useTransitions:i,future:{}}),[l,r,o,i]);typeof n=="string"&&(n=ns(n));let{pathname:d="/",search:u="",hash:m="",state:f=null,key:b="default",mask:w}=n,x=y.useMemo(()=>{let S=Ct(d,l);return S==null?null:{location:{pathname:S,search:u,hash:m,state:f,key:b,mask:w},navigationType:s}},[l,d,u,m,f,b,s,w]);return tt(x!=null,`<Router basename="${l}"> is not able to match the URL "${d}${u}${m}" because it does not start with the basename, so the <Router> won't render anything.`),x==null?null:y.createElement(Le.Provider,{value:c},y.createElement(cr.Provider,{children:t,value:x}))}function rm({children:e,location:t}){return Gg(Di(e),t)}function Di(e,t=[]){let n=[];return y.Children.forEach(e,(s,r)=>{if(!y.isValidElement(s))return;let o=[...t,r];if(s.type===y.Fragment){n.push.apply(n,Di(s.props.children,o));return}J(s.type===ye,`[${typeof s.type=="string"?s.type:s.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),J(!s.props.index||!s.props.children,"An index route cannot have child routes.");let i={id:s.props.id||o.join("-"),caseSensitive:s.props.caseSensitive,element:s.props.element,Component:s.props.Component,index:s.props.index,path:s.props.path,middleware:s.props.middleware,loader:s.props.loader,action:s.props.action,hydrateFallbackElement:s.props.hydrateFallbackElement,HydrateFallback:s.props.HydrateFallback,errorElement:s.props.errorElement,ErrorBoundary:s.props.ErrorBoundary,hasErrorBoundary:s.props.hasErrorBoundary===!0||s.props.ErrorBoundary!=null||s.props.errorElement!=null,shouldRevalidate:s.props.shouldRevalidate,handle:s.props.handle,lazy:s.props.lazy};s.props.children&&(i.children=Di(s.props.children,o)),n.push(i)}),n}var ea="get",ta="application/x-www-form-urlencoded";function Qa(e){return typeof HTMLElement<"u"&&e instanceof HTMLElement}function ob(e){return Qa(e)&&e.tagName.toLowerCase()==="button"}function ib(e){return Qa(e)&&e.tagName.toLowerCase()==="form"}function lb(e){return Qa(e)&&e.tagName.toLowerCase()==="input"}function cb(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function db(e,t){return e.button===0&&(!t||t==="_self")&&!cb(e)}var Dr=null;function ub(){if(Dr===null)try{new FormData(document.createElement("form"),0),Dr=!1}catch{Dr=!0}return Dr}var pb=new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);function Po(e){return e!=null&&!pb.has(e)?(tt(!1,`"${e}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${ta}"`),null):e}function mb(e,t){let n,s,r,o,i;if(ib(e)){let l=e.getAttribute("action");s=l?Ct(l,t):null,n=e.getAttribute("method")||ea,r=Po(e.getAttribute("enctype"))||ta,o=new FormData(e)}else if(ob(e)||lb(e)&&(e.type==="submit"||e.type==="image")){let l=e.form;if(l==null)throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');let c=e.getAttribute("formaction")||l.getAttribute("action");if(s=c?Ct(c,t):null,n=e.getAttribute("formmethod")||l.getAttribute("method")||ea,r=Po(e.getAttribute("formenctype"))||Po(l.getAttribute("enctype"))||ta,o=new FormData(l,e),!ub()){let{name:d,type:u,value:m}=e;if(u==="image"){let f=d?`${d}.`:"";o.append(`${f}x`,"0"),o.append(`${f}y`,"0")}else d&&o.append(d,m)}}else{if(Qa(e))throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');n=ea,s=null,r=ta,i=e}return o&&r==="text/plain"&&(i=o,o=void 0),{action:s,method:n.toLowerCase(),encType:r,formData:o,body:i}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");function Fl(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function am(e,t,n,s){let r=typeof e=="string"?new URL(e,typeof window>"u"?"server://singlefetch/":window.location.origin):e;return n?r.pathname.endsWith("/")?r.pathname=`${r.pathname}_.${s}`:r.pathname=`${r.pathname}.${s}`:r.pathname==="/"?r.pathname=`_root.${s}`:t&&Ct(r.pathname,t)==="/"?r.pathname=`${Ea(t)}/_root.${s}`:r.pathname=`${Ea(r.pathname)}.${s}`,r}async function fb(e,t){if(e.id in t)return t[e.id];try{let n=await import(e.module);return t[e.id]=n,n}catch(n){return console.error(`Error loading route module \`${e.module}\`, reloading page...`),console.error(n),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function hb(e){return e==null?!1:e.href==null?e.rel==="preload"&&typeof e.imageSrcSet=="string"&&typeof e.imageSizes=="string":typeof e.rel=="string"&&typeof e.href=="string"}async function gb(e,t,n){let s=await Promise.all(e.map(async r=>{let o=t.routes[r.route.id];if(o){let i=await fb(o,n);return i.links?i.links():[]}return[]}));return vb(s.flat(1).filter(hb).filter(r=>r.rel==="stylesheet"||r.rel==="preload").map(r=>r.rel==="stylesheet"?{...r,rel:"prefetch",as:"style"}:{...r,rel:"prefetch"}))}function md(e,t,n,s,r,o){let i=(c,d)=>n[d]?c.route.id!==n[d].route.id:!0,l=(c,d)=>{var u;return n[d].pathname!==c.pathname||((u=n[d].route.path)==null?void 0:u.endsWith("*"))&&n[d].params["*"]!==c.params["*"]};return o==="assets"?t.filter((c,d)=>i(c,d)||l(c,d)):o==="data"?t.filter((c,d)=>{var m;let u=s.routes[c.route.id];if(!u||!u.hasLoader)return!1;if(i(c,d)||l(c,d))return!0;if(c.route.shouldRevalidate){let f=c.route.shouldRevalidate({currentUrl:new URL(r.pathname+r.search+r.hash,window.origin),currentParams:((m=n[0])==null?void 0:m.params)||{},nextUrl:new URL(e,window.origin),nextParams:c.params,defaultShouldRevalidate:!0});if(typeof f=="boolean")return f}return!0}):[]}function bb(e,t,{includeHydrateFallback:n}={}){return yb(e.map(s=>{let r=t.routes[s.route.id];if(!r)return[];let o=[r.module];return r.clientActionModule&&(o=o.concat(r.clientActionModule)),r.clientLoaderModule&&(o=o.concat(r.clientLoaderModule)),n&&r.hydrateFallbackModule&&(o=o.concat(r.hydrateFallbackModule)),r.imports&&(o=o.concat(r.imports)),o}).flat(1))}function yb(e){return[...new Set(e)]}function xb(e){let t={},n=Object.keys(e).sort();for(let s of n)t[s]=e[s];return t}function vb(e,t){let n=new Set;return new Set(t),e.reduce((s,r)=>{let o=JSON.stringify(xb(r));return n.has(o)||(n.add(o),s.push({key:o,link:r})),s},[])}function Ll(){let e=y.useContext(ss);return Fl(e,"You must render this element inside a <DataRouterContext.Provider> element"),e}function wb(){let e=y.useContext(Ja);return Fl(e,"You must render this element inside a <DataRouterStateContext.Provider> element"),e}var Ol=y.createContext(void 0);Ol.displayName="FrameworkContext";function Za(){let e=y.useContext(Ol);return Fl(e,"You must render this element inside a <HydratedRouter> element"),e}function kb(e,t){let n=y.useContext(Ol),[s,r]=y.useState(!1),[o,i]=y.useState(!1),{onFocus:l,onBlur:c,onMouseEnter:d,onMouseLeave:u,onTouchStart:m}=t,f=y.useRef(null);y.useEffect(()=>{if(e==="render"&&i(!0),e==="viewport"){let x=p=>{p.forEach(h=>{i(h.isIntersecting)})},S=new IntersectionObserver(x,{threshold:.5});return f.current&&S.observe(f.current),()=>{S.disconnect()}}},[e]),y.useEffect(()=>{if(s){let x=setTimeout(()=>{i(!0)},100);return()=>{clearTimeout(x)}}},[s]);let b=()=>{r(!0)},w=()=>{r(!1),i(!1)};return n?e!=="intent"?[o,f,{}]:[o,f,{onFocus:bs(l,b),onBlur:bs(c,w),onMouseEnter:bs(d,b),onMouseLeave:bs(u,w),onTouchStart:bs(m,b)}]:[!1,f,{}]}function bs(e,t){return n=>{e&&e(n),n.defaultPrevented||t(n)}}function Sb({page:e,...t}){let n=Fg(),{nonce:s}=Za(),{router:r}=Ll(),o=y.useMemo(()=>Up(r.routes,e,r.basename),[r.routes,e,r.basename]);return o?(t.nonce==null&&s&&(t={...t,nonce:s}),n?y.createElement(Cb,{page:e,matches:o,...t}):y.createElement(jb,{page:e,matches:o,...t})):null}function Nb(e){let{manifest:t,routeModules:n}=Za(),[s,r]=y.useState([]);return y.useEffect(()=>{let o=!1;return gb(e,t,n).then(i=>{o||r(i)}),()=>{o=!0}},[e,t,n]),s}function Cb({page:e,matches:t,...n}){let s=ut(),{future:r}=Za(),{basename:o}=Ll(),i=y.useMemo(()=>{if(e===s.pathname+s.search+s.hash)return[];let l=am(e,o,r.v8_trailingSlashAwareDataRequests,"rsc"),c=!1,d=[];for(let u of t)typeof u.route.shouldRevalidate=="function"?c=!0:d.push(u.route.id);return c&&d.length>0&&l.searchParams.set("_routes",d.join(",")),[l.pathname+l.search]},[o,r.v8_trailingSlashAwareDataRequests,e,s,t]);return y.createElement(y.Fragment,null,i.map(l=>y.createElement("link",{key:l,rel:"prefetch",as:"fetch",href:l,...n})))}function jb({page:e,matches:t,...n}){let s=ut(),{future:r,manifest:o,routeModules:i}=Za(),{basename:l}=Ll(),{loaderData:c,matches:d}=wb(),u=y.useMemo(()=>md(e,t,d,o,s,"data"),[e,t,d,o,s]),m=y.useMemo(()=>md(e,t,d,o,s,"assets"),[e,t,d,o,s]),f=y.useMemo(()=>{if(e===s.pathname+s.search+s.hash)return[];let x=new Set,S=!1;if(t.forEach(h=>{var v;let g=o.routes[h.route.id];!g||!g.hasLoader||(!u.some(C=>C.route.id===h.route.id)&&h.route.id in c&&((v=i[h.route.id])!=null&&v.shouldRevalidate)||g.hasClientLoader?S=!0:x.add(h.route.id))}),x.size===0)return[];let p=am(e,l,r.v8_trailingSlashAwareDataRequests,"data");return S&&x.size>0&&p.searchParams.set("_routes",t.filter(h=>x.has(h.route.id)).map(h=>h.route.id).join(",")),[p.pathname+p.search]},[l,r.v8_trailingSlashAwareDataRequests,c,s,o,u,t,e,i]),b=y.useMemo(()=>bb(m,o),[m,o]),w=Nb(m);return y.createElement(y.Fragment,null,f.map(x=>y.createElement("link",{key:x,rel:"prefetch",as:"fetch",href:x,...n})),b.map(x=>y.createElement("link",{key:x,rel:"modulepreload",href:x,...n})),w.map(({key:x,link:S})=>y.createElement("link",{key:x,nonce:n.nonce,...S,crossOrigin:S.crossOrigin??n.crossOrigin})))}function Rb(...e){return t=>{e.forEach(n=>{typeof n=="function"?n(t):n!=null&&(n.current=t)})}}var Eb=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";try{Eb&&(window.__reactRouterVersion="7.18.1")}catch{}function _b({basename:e,children:t,useTransitions:n,window:s}){let r=y.useRef();r.current==null&&(r.current=cg({window:s,v5Compat:!0}));let o=r.current,[i,l]=y.useState({action:o.action,location:o.location}),c=y.useCallback(d=>{n===!1?l(d):y.startTransition(()=>l(d))},[n]);return y.useLayoutEffect(()=>o.listen(c),[o,c]),y.createElement(ab,{basename:e,children:t,location:i.location,navigationType:i.action,navigator:o,useTransitions:n})}var Wl=y.forwardRef(function({onClick:t,discover:n="render",prefetch:s="none",relative:r,reloadDocument:o,replace:i,mask:l,state:c,target:d,to:u,preventScrollReset:m,viewTransition:f,defaultShouldRevalidate:b,...w},x){let{basename:S,navigator:p,useTransitions:h}=y.useContext(Le),g=typeof u=="string"&&Al.test(u),v=Vp(u,S);u=v.to;let C=zg(u,{relative:r}),E=ut(),_=null;if(l){let O=Ya(l,[],E.mask?E.mask.pathname:"/",!0);S!=="/"&&(O.pathname=O.pathname==="/"?S:Xe([S,O.pathname])),_=p.createHref(O)}let[A,N,k]=kb(s,w),j=Pb(u,{replace:i,mask:l,state:c,target:d,preventScrollReset:m,relative:r,viewTransition:f,defaultShouldRevalidate:b,useTransitions:h});function I(O){t&&t(O),O.defaultPrevented||j(O)}let M=!(v.isExternal||o),D=y.createElement("a",{...w,...k,href:(M?_:void 0)||v.absoluteURL||C,onClick:M?I:t,ref:Rb(x,N),target:d,"data-discover":!g&&n==="render"?"true":void 0});return A&&!g?y.createElement(y.Fragment,null,D,y.createElement(Sb,{page:C})):D});Wl.displayName="Link";var Mb=y.forwardRef(function({"aria-current":t="page",caseSensitive:n=!1,className:s="",end:r=!1,style:o,to:i,viewTransition:l,children:c,...d},u){let m=dr(i,{relative:d.relative}),f=ut(),b=y.useContext(Ja),{navigator:w,basename:x}=y.useContext(Le),S=b!=null&&Lb(m)&&l===!0,p=w.encodeLocation?w.encodeLocation(m).pathname:m.pathname,h=f.pathname,g=b&&b.navigation&&b.navigation.location?b.navigation.location.pathname:null;n||(h=h.toLowerCase(),g=g?g.toLowerCase():null,p=p.toLowerCase()),g&&x&&(g=Ct(g,x)||g);const v=p!=="/"&&p.endsWith("/")?p.length-1:p.length;let C=h===p||!r&&h.startsWith(p)&&h.charAt(v)==="/",E=g!=null&&(g===p||!r&&g.startsWith(p)&&g.charAt(p.length)==="/"),_={isActive:C,isPending:E,isTransitioning:S},A=C?t:void 0,N;typeof s=="function"?N=s(_):N=[s,C?"active":null,E?"pending":null,S?"transitioning":null].filter(Boolean).join(" ");let k=typeof o=="function"?o(_):o;return y.createElement(Wl,{...d,"aria-current":A,className:N,ref:u,style:k,to:i,viewTransition:l},typeof c=="function"?c(_):c)});Mb.displayName="NavLink";var Tb=y.forwardRef(({discover:e="render",fetcherKey:t,navigate:n,reloadDocument:s,replace:r,state:o,method:i=ea,action:l,onSubmit:c,relative:d,preventScrollReset:u,viewTransition:m,defaultShouldRevalidate:f,...b},w)=>{let{useTransitions:x}=y.useContext(Le),S=Ib(),p=Fb(l,{relative:d}),h=i.toLowerCase()==="get"?"get":"post",g=typeof l=="string"&&Al.test(l),v=C=>{if(c&&c(C),C.defaultPrevented)return;C.preventDefault();let E=C.nativeEvent.submitter,_=(E==null?void 0:E.getAttribute("formmethod"))||i,A=()=>S(E||C.currentTarget,{fetcherKey:t,method:_,navigate:n,replace:r,state:o,relative:d,preventScrollReset:u,viewTransition:m,defaultShouldRevalidate:f});x&&n!==!1?y.startTransition(()=>A()):A()};return y.createElement("form",{ref:w,method:h,action:p,onSubmit:s?c:v,...b,"data-discover":!g&&e==="render"?"true":void 0})});Tb.displayName="Form";function Ab(e){return`${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function om(e){let t=y.useContext(ss);return J(t,Ab(e)),t}function Pb(e,{target:t,replace:n,mask:s,state:r,preventScrollReset:o,relative:i,viewTransition:l,defaultShouldRevalidate:c,useTransitions:d}={}){let u=Sn(),m=ut(),f=dr(e,{relative:i});return y.useCallback(b=>{if(db(b,t)){b.preventDefault();let w=n!==void 0?n:sr(m)===sr(f),x=()=>u(e,{replace:w,mask:s,state:r,preventScrollReset:o,relative:i,viewTransition:l,defaultShouldRevalidate:c});d?y.startTransition(()=>x()):x()}},[m,u,f,n,s,r,t,e,o,i,l,c,d])}var Db=0,Bb=()=>`__${String(++Db)}__`;function Ib(){let{router:e}=om("useSubmit"),{basename:t}=y.useContext(Le),n=tb(),s=e.fetch,r=e.navigate;return y.useCallback(async(o,i={})=>{let{action:l,method:c,encType:d,formData:u,body:m}=mb(o,t);if(i.navigate===!1){let f=i.fetcherKey||Bb();await s(f,n,i.action||l,{defaultShouldRevalidate:i.defaultShouldRevalidate,preventScrollReset:i.preventScrollReset,formData:u,body:m,formMethod:i.method||c,formEncType:i.encType||d,flushSync:i.flushSync})}else await r(i.action||l,{defaultShouldRevalidate:i.defaultShouldRevalidate,preventScrollReset:i.preventScrollReset,formData:u,body:m,formMethod:i.method||c,formEncType:i.encType||d,replace:i.replace,state:i.state,fromRouteId:n,flushSync:i.flushSync,viewTransition:i.viewTransition})},[s,r,t,n])}function Fb(e,{relative:t}={}){let{basename:n}=y.useContext(Le),s=y.useContext(dt);J(s,"useFormAction must be used inside a RouteContext");let[r]=s.matches.slice(-1),o={...dr(e||".",{relative:t})},i=ut();if(e==null){o.search=i.search;let l=new URLSearchParams(o.search),c=l.getAll("index");if(c.some(u=>u==="")){l.delete("index"),c.filter(m=>m).forEach(m=>l.append("index",m));let u=l.toString();o.search=u?`?${u}`:""}}return(!e||e===".")&&r.route.index&&(o.search=o.search?o.search.replace(/^\?/,"?index&"):"?index"),n!=="/"&&(o.pathname=o.pathname==="/"?n:Xe([n,o.pathname])),sr(o)}function Lb(e,{relative:t}={}){let n=y.useContext(Qp);J(n!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:s}=om("useViewTransitionState"),r=dr(e,{relative:t});if(!n.isTransitioning)return!1;let o=Ct(n.currentLocation.pathname,s)||n.currentLocation.pathname,i=Ct(n.nextLocation.pathname,s)||n.nextLocation.pathname;return Ra(r.pathname,i)!=null||Ra(r.pathname,o)!=null}function Zn(){if(typeof window>"u")return null;const e=window.__FACTORY_BOOTSTRAP__;return(e==null?void 0:e.mode)==="product"&&e.manifest&&e.clientId?e:null}function Ob(){return Zn()?"product":"studio"}function Ul(){return Ob()==="product"}function Hl(){const e=Zn();return e?`factory_crm_${e.clientId}`:"factory_project"}/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Wb={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ub=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),B=(e,t)=>{const n=y.forwardRef(({color:s="currentColor",size:r=24,strokeWidth:o=2,absoluteStrokeWidth:i,className:l="",children:c,...d},u)=>y.createElement("svg",{ref:u,...Wb,width:r,height:r,stroke:s,strokeWidth:i?Number(o)*24/Number(r):o,className:["lucide",`lucide-${Ub(e)}`,l].join(" "),...d},[...t.map(([m,f])=>y.createElement(m,f)),...Array.isArray(c)?c:[c]]));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hb=B("Activity",[["path",{d:"M22 12h-4l-3 9L9 3l-3 9H2",key:"d5dnw9"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const im=B("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _a=B("Archive",[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"M10 12h4",key:"a56b0p"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ql=B("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lm=B("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qb=B("BedDouble",[["path",{d:"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8",key:"1k78r4"}],["path",{d:"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",key:"fb3tl2"}],["path",{d:"M12 4v6",key:"1dcgq2"}],["path",{d:"M2 18h20",key:"ajqnye"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nn=B("Briefcase",[["rect",{width:"20",height:"14",x:"2",y:"7",rx:"2",ry:"2",key:"eto64e"}],["path",{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"zwj3tp"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zb=B("Building2",[["path",{d:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",key:"1b4qmf"}],["path",{d:"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",key:"i71pzd"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",key:"10jefs"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"M10 10h4",key:"tcdvrf"}],["path",{d:"M10 14h4",key:"kelpxr"}],["path",{d:"M10 18h4",key:"1ulq68"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cm=B("Building",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["path",{d:"M9 22v-4h6v4",key:"r93iot"}],["path",{d:"M8 6h.01",key:"1dz90k"}],["path",{d:"M16 6h.01",key:"1x0f13"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M8 14h.01",key:"6423bh"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $b=B("Calculator",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _t=B("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gb=B("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kb=B("Car",[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ct=B("CheckCircle2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ma=B("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vb=B("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dm=B("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xa=B("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yb=B("Code2",[["path",{d:"m18 16 4-4-4-4",key:"1inbqp"}],["path",{d:"m6 8-4 4 4 4",key:"15zrgr"}],["path",{d:"m14.5 4-5 16",key:"e7oirm"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const um=B("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jb=B("Dumbbell",[["path",{d:"m6.5 6.5 11 11",key:"f7oqzb"}],["path",{d:"m21 21-1-1",key:"cpc6if"}],["path",{d:"m3 3 1 1",key:"d3rpuf"}],["path",{d:"m18 22 4-4",key:"1e32o6"}],["path",{d:"m2 6 4-4",key:"189tqz"}],["path",{d:"m3 10 7-7",key:"1bxui2"}],["path",{d:"m14 21 7-7",key:"16x78n"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fd=B("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zl=B("Flame",[["path",{d:"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",key:"96xj49"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pm=B("Github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const as=B("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qb=B("GraduationCap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zb=B("Hand",[["path",{d:"M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0",key:"aigmz7"}],["path",{d:"M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2",key:"1n6bmn"}],["path",{d:"M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8",key:"a9iiix"}],["path",{d:"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",key:"1s1gnw"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xb=B("HardHat",[["path",{d:"M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z",key:"1dej2m"}],["path",{d:"M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5",key:"1p9q5i"}],["path",{d:"M4 15v-3a6 6 0 0 1 6-6h0",key:"1uc279"}],["path",{d:"M14 6h0a6 6 0 0 1 6 6v3",key:"1j9mnm"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e0=B("Home",[["path",{d:"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"y5dka4"}],["polyline",{points:"9 22 9 12 15 12 15 22",key:"e2us08"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t0=B("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n0=B("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jt=B("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bi=B("LayoutGrid",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s0=B("LayoutTemplate",[["rect",{width:"18",height:"7",x:"3",y:"3",rx:"1",key:"f1a2em"}],["rect",{width:"9",height:"7",x:"3",y:"14",rx:"1",key:"jqznyg"}],["rect",{width:"5",height:"7",x:"16",y:"14",rx:"1",key:"q5h2i8"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r0=B("Loader2",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rt=B("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vn=B("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a0=B("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qe=B("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o0=B("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i0=B("Package",[["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l0=B("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"12rzf8"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vt=B("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c0=B("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d0=B("Scale",[["path",{d:"m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"7g6ntu"}],["path",{d:"m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"ijws7r"}],["path",{d:"M7 21h10",key:"1b0cd5"}],["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2",key:"3gwbw2"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u0=B("Scissors",[["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M8.12 8.12 12 12",key:"1alkpv"}],["path",{d:"M20 4 8.12 15.88",key:"xgtan2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M14.8 14.8 20 20",key:"ptml3r"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hd=B("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mm=B("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p0=B("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m0=B("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f0=B("Sparkles",[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",key:"17u4zn"}],["path",{d:"M5 3v4",key:"bklmnn"}],["path",{d:"M19 17v4",key:"iiml17"}],["path",{d:"M3 5h4",key:"nem4j1"}],["path",{d:"M17 19h4",key:"lbex7p"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ue=B("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h0=B("Stethoscope",[["path",{d:"M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3",key:"1jd90r"}],["path",{d:"M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4",key:"126ukv"}],["circle",{cx:"20",cy:"10",r:"2",key:"ts1r5v"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nn=B("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g0=B("Truck",[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $l=B("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fm=B("UserCog",[["circle",{cx:"18",cy:"15",r:"3",key:"gjjjvw"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M10 15H6a4 4 0 0 0-4 4v2",key:"1nfge6"}],["path",{d:"m21.7 16.4-.9-.3",key:"12j9ji"}],["path",{d:"m15.2 13.9-.9-.3",key:"1fdjdi"}],["path",{d:"m16.6 18.7.3-.9",key:"heedtr"}],["path",{d:"m19.1 12.2.3-.9",key:"1af3ki"}],["path",{d:"m19.6 18.7-.4-1",key:"1x9vze"}],["path",{d:"m16.8 12.3-.4-1",key:"vqeiwj"}],["path",{d:"m14.3 16.6 1-.4",key:"1qlj63"}],["path",{d:"m20.7 13.8 1-.4",key:"1v5t8k"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b0=B("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ur=B("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y0=B("UtensilsCrossed",[["path",{d:"m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8",key:"n7qcjb"}],["path",{d:"M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7",key:"d0u48b"}],["path",{d:"m2.1 21.8 6.4-6.3",key:"yn04lh"}],["path",{d:"m19 5-7 7",key:"194lzd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x0=B("Wind",[["path",{d:"M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2",key:"1k4u03"}],["path",{d:"M9.6 4.6A2 2 0 1 1 11 8H2",key:"b7d0fd"}],["path",{d:"M12.6 19.4A2 2 0 1 0 14 16H2",key:"1p5cb3"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hm=B("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pr=B("Zap",[["polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2",key:"45s27k"}]]),Se=["hero","about","services","gallery","booking","testimonials","faq","contacts","google_maps","whatsapp","email_section"],Ne=["dashboard","customers","bookings","services","calendar","employees","notifications","settings","review_requests"],v0=[{key:"restaurant",builtIn:!0,labelEn:"Restaurant",labelDe:"Restaurant",labelRu:"Ресторан",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"modern_light",defaultBookingModule:"time_slots",defaultReviewModule:"google_review_link",defaultNotificationChannels:["whatsapp","email"],imageSourceKey:"pexels_restaurant"},{key:"dental_clinic",builtIn:!0,labelEn:"Dental Clinic",labelDe:"Zahnarztpraxis",labelRu:"Стоматология",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"classic",defaultBookingModule:"calendar_picker",defaultReviewModule:"google_review_link",defaultNotificationChannels:["whatsapp","email"],imageSourceKey:"pexels_dental"},{key:"beauty_salon",builtIn:!0,labelEn:"Beauty Salon",labelDe:"Schönheitssalon",labelRu:"Салон красоты",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"minimal",defaultBookingModule:"time_slots",defaultReviewModule:"whatsapp_review_request",defaultNotificationChannels:["whatsapp","email"],imageSourceKey:"pexels_beauty"},{key:"fitness",builtIn:!0,labelEn:"Fitness",labelDe:"Fitnessstudio",labelRu:"Фитнес",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"bold",defaultBookingModule:"time_slots",defaultReviewModule:"google_review_link",defaultNotificationChannels:["whatsapp","email"],imageSourceKey:"pexels_fitness"},{key:"barber",builtIn:!0,labelEn:"Barber",labelDe:"Barbier",labelRu:"Барбершоп",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"modern_dark",defaultBookingModule:"time_slots",defaultReviewModule:"google_review_link",defaultNotificationChannels:["whatsapp"],imageSourceKey:"pexels_barber"},{key:"massage",builtIn:!0,labelEn:"Massage",labelDe:"Massage",labelRu:"Массаж",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"minimal",defaultBookingModule:"time_slots",defaultReviewModule:"whatsapp_review_request",defaultNotificationChannels:["whatsapp","email"],imageSourceKey:"pexels_massage"},{key:"cleaning",builtIn:!0,labelEn:"Cleaning",labelDe:"Reinigung",labelRu:"Уборка",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"modern_light",defaultBookingModule:"simple_form",defaultReviewModule:"email_review_request",defaultNotificationChannels:["email","whatsapp"],imageSourceKey:"pexels_cleaning"},{key:"auto_service",builtIn:!0,labelEn:"Auto Service",labelDe:"Autowerkstatt",labelRu:"Автосервис",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"modern_dark",defaultBookingModule:"calendar_picker",defaultReviewModule:"google_review_link",defaultNotificationChannels:["whatsapp","email"],imageSourceKey:"pexels_auto"},{key:"hotel",builtIn:!0,labelEn:"Hotel",labelDe:"Hotel",labelRu:"Отель",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"classic",defaultBookingModule:"calendar_picker",defaultReviewModule:"google_review_link",defaultNotificationChannels:["email","whatsapp"],imageSourceKey:"pexels_hotel"},{key:"education",builtIn:!0,labelEn:"Education",labelDe:"Bildung",labelRu:"Образование",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"modern_light",defaultBookingModule:"simple_form",defaultReviewModule:"email_review_request",defaultNotificationChannels:["email"],imageSourceKey:"pexels_education"},{key:"real_estate",builtIn:!0,labelEn:"Real Estate",labelDe:"Immobilien",labelRu:"Недвижимость",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"classic",defaultBookingModule:"simple_form",defaultReviewModule:"google_review_link",defaultNotificationChannels:["email","whatsapp"],imageSourceKey:"pexels_real_estate"},{key:"construction",builtIn:!0,labelEn:"Construction",labelDe:"Bau",labelRu:"Строительство",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"bold",defaultBookingModule:"simple_form",defaultReviewModule:"email_review_request",defaultNotificationChannels:["email","whatsapp"],imageSourceKey:"pexels_construction"},{key:"accounting",builtIn:!0,labelEn:"Accounting",labelDe:"Buchhaltung",labelRu:"Бухгалтерия",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"classic",defaultBookingModule:"simple_form",defaultReviewModule:"email_review_request",defaultNotificationChannels:["email"],imageSourceKey:"pexels_office"},{key:"law_firm",builtIn:!0,labelEn:"Law Firm",labelDe:"Kanzlei",labelRu:"Юридическая фирма",defaultWebsiteSections:Se,defaultCrmModules:Ne,defaultTheme:"classic",defaultBookingModule:"simple_form",defaultReviewModule:"google_review_link",defaultNotificationChannels:["email"],imageSourceKey:"pexels_office"}],Ta=new Map(v0.map(e=>[e.key,e])),w0="factory_custom_sectors";function k0(){try{const e=localStorage.getItem(w0);if(!e)return;const t=JSON.parse(e);for(const n of t)Ta.has(n.key)||Ta.set(n.key,{...n,builtIn:!1})}catch{}}k0();function Gl(e){const t=Ta.get(e);if(!t)throw new Error(`Library key not found: sector "${e}"`);return t}function S0(){return Array.from(Ta.values())}const N0={hero:{key:"hero",label:{en:"Hero",de:"Hero",ru:"Главный экран"},description:{en:"Full-width headline banner with call-to-action",de:"Vollbreites Banner mit Handlungsaufforderung",ru:"Полноширинный баннер с призывом к действию"},required:!0},about:{key:"about",label:{en:"About",de:"Über uns",ru:"О нас"},description:{en:"Company story and values",de:"Unternehmensgeschichte und Werte",ru:"История компании и ценности"},required:!0},services:{key:"services",label:{en:"Services",de:"Leistungen",ru:"Услуги"},description:{en:"List of offered services with prices",de:"Liste der angebotenen Leistungen mit Preisen",ru:"Список предоставляемых услуг с ценами"},required:!0},gallery:{key:"gallery",label:{en:"Gallery",de:"Galerie",ru:"Галерея"},description:{en:"Photo gallery of work and premises",de:"Fotogalerie der Arbeiten und Räumlichkeiten",ru:"Фотогалерея работ и помещений"},required:!1},booking:{key:"booking",label:{en:"Booking",de:"Buchung",ru:"Запись"},description:{en:"Online appointment booking form",de:"Online-Terminbuchungsformular",ru:"Онлайн-форма записи на приём"},required:!0},testimonials:{key:"testimonials",label:{en:"Testimonials",de:"Bewertungen",ru:"Отзывы"},description:{en:"Customer reviews and ratings",de:"Kundenbewertungen und Bewertungen",ru:"Отзывы и оценки клиентов"},required:!1},faq:{key:"faq",label:{en:"FAQ",de:"FAQ",ru:"Вопросы и ответы"},description:{en:"Frequently asked questions",de:"Häufig gestellte Fragen",ru:"Часто задаваемые вопросы"},required:!1},contacts:{key:"contacts",label:{en:"Contacts",de:"Kontakt",ru:"Контакты"},description:{en:"Address, phone, and opening hours",de:"Adresse, Telefon und Öffnungszeiten",ru:"Адрес, телефон и часы работы"},required:!0},google_maps:{key:"google_maps",label:{en:"Google Maps",de:"Google Maps",ru:"Google Карты"},description:{en:"Embedded Google Maps location",de:"Eingebettete Google Maps-Karte",ru:"Встроенная карта Google"},required:!1},whatsapp:{key:"whatsapp",label:{en:"WhatsApp Button",de:"WhatsApp-Schaltfläche",ru:"Кнопка WhatsApp"},description:{en:"Floating WhatsApp contact button",de:"Schwebende WhatsApp-Kontaktschaltfläche",ru:"Плавающая кнопка WhatsApp"},required:!1},email_section:{key:"email_section",label:{en:"Email Contact",de:"E-Mail-Kontakt",ru:"Контакт по Email"},description:{en:"Email contact form",de:"E-Mail-Kontaktformular",ru:"Форма обратной связи по email"},required:!1}};function gm(e){const t=N0[e];if(!t)throw new Error(`Library key not found: website section "${e}"`);return t}const C0={dashboard:{key:"dashboard",label:{en:"Dashboard",de:"Dashboard",ru:"Дашборд"},description:{en:"Overview of key metrics and activity",de:"Übersicht der wichtigsten Kennzahlen",ru:"Обзор ключевых метрик и активности"},icon:"LayoutDashboard",required:!0},customers:{key:"customers",label:{en:"Customers",de:"Kunden",ru:"Клиенты"},description:{en:"Customer database and history",de:"Kundendatenbank und Verlauf",ru:"База клиентов и история"},icon:"Users",required:!0},bookings:{key:"bookings",label:{en:"Bookings",de:"Buchungen",ru:"Записи"},description:{en:"Appointment list and management",de:"Terminliste und Verwaltung",ru:"Список записей и управление"},icon:"CalendarCheck",required:!0},services:{key:"services",label:{en:"Services",de:"Leistungen",ru:"Услуги"},description:{en:"Service catalog with prices and durations",de:"Leistungskatalog mit Preisen und Dauer",ru:"Каталог услуг с ценами и длительностью"},icon:"Briefcase",required:!0},calendar:{key:"calendar",label:{en:"Calendar",de:"Kalender",ru:"Календарь"},description:{en:"Visual appointment calendar",de:"Visueller Terminkalender",ru:"Визуальный календарь записей"},icon:"Calendar",required:!1},employees:{key:"employees",label:{en:"Employees",de:"Mitarbeiter",ru:"Сотрудники"},description:{en:"Staff roster and schedules",de:"Mitarbeiterliste und Zeitpläne",ru:"Список сотрудников и расписание"},icon:"UserCog",required:!1},notifications:{key:"notifications",label:{en:"Notifications",de:"Benachrichtigungen",ru:"Уведомления"},description:{en:"WhatsApp and email notification log",de:"WhatsApp- und E-Mail-Benachrichtigungsprotokoll",ru:"Журнал уведомлений WhatsApp и email"},icon:"Bell",required:!1},settings:{key:"settings",label:{en:"Settings",de:"Einstellungen",ru:"Настройки"},description:{en:"Business profile and system configuration",de:"Unternehmensprofil und Systemkonfiguration",ru:"Профиль компании и настройки системы"},icon:"Settings",required:!0},review_requests:{key:"review_requests",label:{en:"Review Requests",de:"Bewertungsanfragen",ru:"Запросы отзывов"},description:{en:"Automated Google review request campaigns",de:"Automatisierte Google-Bewertungsanfragen",ru:"Автоматические запросы отзывов на Google"},icon:"Star",required:!1}};function bm(e){const t=C0[e];if(!t)throw new Error(`Library key not found: CRM module "${e}"`);return t}const ys={50:"#f9fafb",100:"#f3f4f6",200:"#e5e7eb",300:"#d1d5db",400:"#9ca3af",500:"#6b7280",600:"#4b5563",700:"#374151",800:"#1f2937",900:"#111827"},xs={50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d"},vs={50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",400:"#fbbf24",500:"#f59e0b",600:"#d97706",700:"#b45309",800:"#92400e",900:"#78350f"},ws={50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d"},j0={modern_light:{key:"modern_light",label:"Modern Light",fontFamily:"'Inter', sans-serif",borderRadius:"0.5rem",colors:{primary:{50:"#eff6ff",100:"#dbeafe",200:"#bfdbfe",300:"#93c5fd",400:"#60a5fa",500:"#3b82f6",600:"#2563eb",700:"#1d4ed8",800:"#1e40af",900:"#1e3a8a"},secondary:{50:"#f0f9ff",100:"#e0f2fe",200:"#bae6fd",300:"#7dd3fc",400:"#38bdf8",500:"#0ea5e9",600:"#0284c7",700:"#0369a1",800:"#075985",900:"#0c4a6e"},accent:{50:"#fdf4ff",100:"#fae8ff",200:"#f5d0fe",300:"#f0abfc",400:"#e879f9",500:"#d946ef",600:"#c026d3",700:"#a21caf",800:"#86198f",900:"#701a75"},success:xs,warning:vs,error:ws,neutral:ys},websiteBackground:"#ffffff",websiteForeground:"#111827",crmBackground:"#f9fafb",crmForeground:"#111827"},modern_dark:{key:"modern_dark",label:"Modern Dark",fontFamily:"'Inter', sans-serif",borderRadius:"0.5rem",colors:{primary:{50:"#ecfdf5",100:"#d1fae5",200:"#a7f3d0",300:"#6ee7b7",400:"#34d399",500:"#10b981",600:"#059669",700:"#047857",800:"#065f46",900:"#064e3b"},secondary:{50:"#f0fdfa",100:"#ccfbf1",200:"#99f6e4",300:"#5eead4",400:"#2dd4bf",500:"#14b8a6",600:"#0d9488",700:"#0f766e",800:"#115e59",900:"#134e4a"},accent:{50:"#fff7ed",100:"#ffedd5",200:"#fed7aa",300:"#fdba74",400:"#fb923c",500:"#f97316",600:"#ea580c",700:"#c2410c",800:"#9a3412",900:"#7c2d12"},success:xs,warning:vs,error:ws,neutral:ys},websiteBackground:"#0f172a",websiteForeground:"#f1f5f9",crmBackground:"#1e293b",crmForeground:"#f1f5f9"},classic:{key:"classic",label:"Classic",fontFamily:"'Playfair Display', serif",borderRadius:"0.25rem",colors:{primary:{50:"#fafaf9",100:"#f5f5f4",200:"#e7e5e4",300:"#d6d3d1",400:"#a8a29e",500:"#78716c",600:"#57534e",700:"#44403c",800:"#292524",900:"#1c1917"},secondary:{50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",400:"#fbbf24",500:"#f59e0b",600:"#d97706",700:"#b45309",800:"#92400e",900:"#78350f"},accent:{50:"#fdf2f8",100:"#fce7f3",200:"#fbcfe8",300:"#f9a8d4",400:"#f472b6",500:"#ec4899",600:"#db2777",700:"#be185d",800:"#9d174d",900:"#831843"},success:xs,warning:vs,error:ws,neutral:ys},websiteBackground:"#fafaf9",websiteForeground:"#1c1917",crmBackground:"#f5f5f4",crmForeground:"#1c1917"},minimal:{key:"minimal",label:"Minimal",fontFamily:"'DM Sans', sans-serif",borderRadius:"0.75rem",colors:{primary:{50:"#fafafa",100:"#f4f4f5",200:"#e4e4e7",300:"#d4d4d8",400:"#a1a1aa",500:"#71717a",600:"#52525b",700:"#3f3f46",800:"#27272a",900:"#18181b"},secondary:{50:"#f7f7f7",100:"#efefef",200:"#dfdfdf",300:"#c8c8c8",400:"#adadad",500:"#999999",600:"#888888",700:"#7b7b7b",800:"#676767",900:"#545454"},accent:{50:"#fdf4ff",100:"#fae8ff",200:"#f5d0fe",300:"#f0abfc",400:"#e879f9",500:"#d946ef",600:"#c026d3",700:"#a21caf",800:"#86198f",900:"#701a75"},success:xs,warning:vs,error:ws,neutral:ys},websiteBackground:"#ffffff",websiteForeground:"#18181b",crmBackground:"#fafafa",crmForeground:"#18181b"},bold:{key:"bold",label:"Bold",fontFamily:"'Oswald', sans-serif",borderRadius:"0rem",colors:{primary:{50:"#fff1f2",100:"#ffe4e6",200:"#fecdd3",300:"#fda4af",400:"#fb7185",500:"#f43f5e",600:"#e11d48",700:"#be123c",800:"#9f1239",900:"#881337"},secondary:{50:"#fafafa",100:"#f4f4f5",200:"#e4e4e7",300:"#d4d4d8",400:"#a1a1aa",500:"#71717a",600:"#52525b",700:"#3f3f46",800:"#27272a",900:"#18181b"},accent:{50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",400:"#fbbf24",500:"#f59e0b",600:"#d97706",700:"#b45309",800:"#92400e",900:"#78350f"},success:xs,warning:vs,error:ws,neutral:ys},websiteBackground:"#18181b",websiteForeground:"#fafafa",crmBackground:"#27272a",crmForeground:"#fafafa"}};function eo(e){const t=j0[e];if(!t)throw new Error(`Library key not found: theme "${e}"`);return t}const R0={pexels_restaurant:{key:"pexels_restaurant",hero:"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400"]},pexels_dental:{key:"pexels_dental",hero:"https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/6502152/pexels-photo-6502152.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/4269694/pexels-photo-4269694.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/6502153/pexels-photo-6502153.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400"]},pexels_beauty:{key:"pexels_beauty",hero:"https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/3761509/pexels-photo-3761509.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/3997392/pexels-photo-3997392.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/3738347/pexels-photo-3738347.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/3993467/pexels-photo-3993467.jpeg?auto=compress&cs=tinysrgb&w=400"]},pexels_fitness:{key:"pexels_fitness",hero:"https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/703016/pexels-photo-703016.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/1978505/pexels-photo-1978505.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg?auto=compress&cs=tinysrgb&w=400"]},pexels_barber:{key:"pexels_barber",hero:"https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1805600/pexels-photo-1805600.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/2531736/pexels-photo-2531736.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/2173872/pexels-photo-2173872.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/3998429/pexels-photo-3998429.jpeg?auto=compress&cs=tinysrgb&w=400"]},pexels_massage:{key:"pexels_massage",hero:"https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/3757954/pexels-photo-3757954.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/3997990/pexels-photo-3997990.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/3865670/pexels-photo-3865670.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/3757943/pexels-photo-3757943.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/3760275/pexels-photo-3760275.jpeg?auto=compress&cs=tinysrgb&w=400"]},pexels_cleaning:{key:"pexels_cleaning",hero:"https://images.pexels.com/photos/4099354/pexels-photo-4099354.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/4107279/pexels-photo-4107279.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/4107112/pexels-photo-4107112.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/6195122/pexels-photo-6195122.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/4099356/pexels-photo-4099356.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/4107281/pexels-photo-4107281.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/4099358/pexels-photo-4099358.jpeg?auto=compress&cs=tinysrgb&w=400"]},pexels_auto:{key:"pexels_auto",hero:"https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/3862127/pexels-photo-3862127.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/4315559/pexels-photo-4315559.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/3846205/pexels-photo-3846205.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/4315560/pexels-photo-4315560.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/3807465/pexels-photo-3807465.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/3807570/pexels-photo-3807570.jpeg?auto=compress&cs=tinysrgb&w=400"]},pexels_hotel:{key:"pexels_hotel",hero:"https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=400"]},pexels_education:{key:"pexels_education",hero:"https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400"]},pexels_real_estate:{key:"pexels_real_estate",hero:"https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=400"]},pexels_construction:{key:"pexels_construction",hero:"https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1275393/pexels-photo-1275393.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/1463917/pexels-photo-1463917.jpeg?auto=compress&cs=tinysrgb&w=400"]},pexels_office:{key:"pexels_office",hero:"https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",about:"https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",gallery:["https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"],services:["https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400","https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400"]}};function Fs(e){const t=R0[e];if(!t)throw new Error(`Library key not found: image source "${e}"`);return t}const sn="Settings",rn="Einstellungen",an="Настройки",on="Dashboard",ln="Dashboard",cn="Дашборд",E0={restaurant:{key:"restaurant",hasResources:!0,resourceSingular:{en:"Table",de:"Tisch",ru:"Стол"},appointmentStatusHint:{en:"Reservation status",de:"Reservierungsstatus",ru:"Статус брони"},icons:{dashboard:"LayoutDashboard",appointments:"CalendarCheck",clients:"Users",services:"UtensilsCrossed",resources:"LayoutGrid",staff:"UserCog",settings:"Settings"},tabs:{en:{dashboard:on,appointments:"Reservations",clients:"Guests",services:"Menu",resources:"Tables",staff:"Staff",settings:sn},de:{dashboard:ln,appointments:"Reservierungen",clients:"Gäste",services:"Menü",resources:"Tische",staff:"Personal",settings:rn},ru:{dashboard:cn,appointments:"Бронирования",clients:"Гости",services:"Меню",resources:"Столы",staff:"Персонал",settings:an}}},hotel:{key:"hotel",hasResources:!0,resourceSingular:{en:"Room",de:"Zimmer",ru:"Номер"},appointmentStatusHint:{en:"Booking status",de:"Buchungsstatus",ru:"Статус бронирования"},icons:{dashboard:"LayoutDashboard",appointments:"CalendarCheck",clients:"Users",services:"Briefcase",resources:"BedDouble",staff:"UserCog",settings:"Settings"},tabs:{en:{dashboard:on,appointments:"Bookings",clients:"Guests",services:"Services",resources:"Rooms",staff:"Staff",settings:sn},de:{dashboard:ln,appointments:"Buchungen",clients:"Gäste",services:"Leistungen",resources:"Zimmer",staff:"Personal",settings:rn},ru:{dashboard:cn,appointments:"Бронирования",clients:"Гости",services:"Услуги",resources:"Номера",staff:"Персонал",settings:an}}},beauty_salon:{key:"beauty_salon",hasResources:!1,resourceSingular:{en:"Station",de:"Platz",ru:"Место"},appointmentStatusHint:{en:"Appointment status",de:"Terminstatus",ru:"Статус записи"},icons:{dashboard:"LayoutDashboard",appointments:"CalendarCheck",clients:"Users",services:"Sparkles",resources:"LayoutGrid",staff:"UserCog",settings:"Settings"},tabs:{en:{dashboard:on,appointments:"Appointments",clients:"Clients",services:"Services",resources:"Stations",staff:"Masters",settings:sn},de:{dashboard:ln,appointments:"Termine",clients:"Kunden",services:"Leistungen",resources:"Plätze",staff:"Meister",settings:rn},ru:{dashboard:cn,appointments:"Записи",clients:"Клиенты",services:"Услуги",resources:"Места",staff:"Мастера",settings:an}}},dental_clinic:{key:"dental_clinic",hasResources:!1,resourceSingular:{en:"Chair",de:"Stuhl",ru:"Кресло"},appointmentStatusHint:{en:"Appointment status",de:"Terminstatus",ru:"Статус приёма"},icons:{dashboard:"LayoutDashboard",appointments:"CalendarCheck",clients:"Users",services:"Stethoscope",resources:"LayoutGrid",staff:"UserCog",settings:"Settings"},tabs:{en:{dashboard:on,appointments:"Appointments",clients:"Patients",services:"Procedures",resources:"Chairs",staff:"Doctors",settings:sn},de:{dashboard:ln,appointments:"Termine",clients:"Patienten",services:"Behandlungen",resources:"Stühle",staff:"Ärzte",settings:rn},ru:{dashboard:cn,appointments:"Приёмы",clients:"Пациенты",services:"Процедуры",resources:"Кресла",staff:"Врачи",settings:an}}},fitness:{key:"fitness",hasResources:!0,resourceSingular:{en:"Studio",de:"Studio",ru:"Зал"},appointmentStatusHint:{en:"Class / session status",de:"Kursstatus",ru:"Статус занятия"},icons:{dashboard:"LayoutDashboard",appointments:"CalendarCheck",clients:"Users",services:"Dumbbell",resources:"LayoutGrid",staff:"UserCog",settings:"Settings"},tabs:{en:{dashboard:on,appointments:"Sessions",clients:"Members",services:"Programs",resources:"Studios",staff:"Trainers",settings:sn},de:{dashboard:ln,appointments:"Sessions",clients:"Mitglieder",services:"Programme",resources:"Studios",staff:"Trainer",settings:rn},ru:{dashboard:cn,appointments:"Занятия",clients:"Участники",services:"Программы",resources:"Залы",staff:"Тренеры",settings:an}}},auto_service:{key:"auto_service",hasResources:!0,resourceSingular:{en:"Bay",de:"Box",ru:"Бокс"},appointmentStatusHint:{en:"Service order status",de:"Auftragsstatus",ru:"Статус заказа"},icons:{dashboard:"LayoutDashboard",appointments:"CalendarCheck",clients:"Users",services:"Wrench",resources:"LayoutGrid",staff:"UserCog",settings:"Settings"},tabs:{en:{dashboard:on,appointments:"Orders",clients:"Customers",services:"Services",resources:"Bays",staff:"Mechanics",settings:sn},de:{dashboard:ln,appointments:"Aufträge",clients:"Kunden",services:"Leistungen",resources:"Boxen",staff:"Mechaniker",settings:rn},ru:{dashboard:cn,appointments:"Заказы",clients:"Клиенты",services:"Услуги",resources:"Боксы",staff:"Механики",settings:an}}}},_0={key:"default",hasResources:!1,resourceSingular:{en:"Resource",de:"Ressource",ru:"Ресурс"},appointmentStatusHint:{en:"Appointment status",de:"Terminstatus",ru:"Статус записи"},icons:{dashboard:"LayoutDashboard",appointments:"CalendarCheck",clients:"Users",services:"Briefcase",resources:"LayoutGrid",staff:"UserCog",settings:"Settings"},tabs:{en:{dashboard:on,appointments:"Appointments",clients:"Clients",services:"Services",resources:"Resources",staff:"Staff",settings:sn},de:{dashboard:ln,appointments:"Termine",clients:"Kunden",services:"Leistungen",resources:"Ressourcen",staff:"Mitarbeiter",settings:rn},ru:{dashboard:cn,appointments:"Записи",clients:"Клиенты",services:"Услуги",resources:"Ресурсы",staff:"Сотрудники",settings:an}}},M0={fitness_club:"fitness",car_service:"auto_service",workshop:"auto_service",barber:"beauty_salon",massage:"beauty_salon"};function to(e){const t=String(e||"").toLowerCase(),n=M0[t]??t;return E0[n]??_0}function T0(e,t="en"){const n=to(e);return n.tabs[t]??n.tabs.en}function A0(e){return to(e).key}function Do(e,t){let n=5381;for(let s=0;s<e.length;s++)n=(n<<5)+n^e.charCodeAt(s),n=n>>>0;return`${t}_${n.toString(16).padStart(8,"0")}`}const P0="1.0.0",D0="1.0.0";function B0(e){const t=new Date().toISOString();return{projectId:Do(`${e.name}|${e.sector}|${e.city}`,"proj"),studioId:Do(e.studioBrand,"studio"),clientId:Do(e.email,"client"),createdAt:t,updatedAt:t,manifestVersion:D0,engineVersion:P0}}function I0(e){const t=e.toLowerCase().replace(/[^a-z0-9]/g,"-");return{apiKey:"AIzaSy-MOCK-KEY-REPLACE-WITH-REAL",authDomain:`${t}.firebaseapp.com`,projectId:t,storageBucket:`${t}.appspot.com`,messagingSenderId:"000000000000",appId:"1:000000000000:web:0000000000000000000000"}}function F0(e){const t=!!e.whatsapp;return{enabled:!0,googleMapsUrl:void 0,steps:[{stepKey:"booking_confirmation",delayHours:0,channel:"internal",enabled:!0},{stepKey:"crm_record",delayHours:0,channel:"internal",enabled:!0},{stepKey:"whatsapp_followup",delayHours:2,channel:"whatsapp",enabled:t},{stepKey:"email_followup",delayHours:24,channel:"email",enabled:!0},{stepKey:"google_review_request",delayHours:48,channel:"email",enabled:!0}]}}function L0(e){return{firebaseConfigMock:I0(e.name),readmeSections:["project_overview","firebase_setup","environment_variables","deployment","crm_access","customization"],actions:{zip:{status:"mock",label:"Download ZIP",mock:!0},github:{status:"mock",label:"Push to GitHub",mock:!0},firebase:{status:"mock",label:"Connect Firebase",mock:!0},deploy:{status:"mock",label:"Deploy to Hosting",mock:!0}}}}function O0(e){return{ownershipMode:e.ownershipMode,studioBrand:e.studioBrand,clientBrand:e.clientBrand,studioEmail:e.studioEmail,studioWebsite:e.studioWebsite}}function W0(e){const t=Gl(e.sector);return{schemaVersion:"1.0",generatedAt:new Date().toISOString(),metadata:B0(e),ownership:O0(e),business:{name:e.name,sector:e.sector,city:e.city,language:e.language,phone:e.phone,whatsapp:e.whatsapp,email:e.email,website:e.website,instagram:e.instagram,facebook:e.facebook},website:{sections:t.defaultWebsiteSections,themeKey:t.defaultTheme,imageSourceKey:t.imageSourceKey},crm:{modules:t.defaultCrmModules,bookingModule:t.defaultBookingModule,reviewModule:t.defaultReviewModule,notificationChannels:t.defaultNotificationChannels,reviewFlow:F0(e),vocabularyKey:A0(e.sector)},delivery:L0(e)}}function U0(e){var n,s,r,o,i,l,c;const t=[];if(e.schemaVersion||t.push({field:"schemaVersion",message:"schemaVersion is required"}),!e.metadata)t.push({field:"metadata",message:"metadata block is required"});else{const d=e.metadata;d.projectId||t.push({field:"metadata.projectId",message:"metadata.projectId is required"}),d.studioId||t.push({field:"metadata.studioId",message:"metadata.studioId is required"}),d.clientId||t.push({field:"metadata.clientId",message:"metadata.clientId is required"}),d.createdAt||t.push({field:"metadata.createdAt",message:"metadata.createdAt is required"}),d.updatedAt||t.push({field:"metadata.updatedAt",message:"metadata.updatedAt is required"}),d.manifestVersion||t.push({field:"metadata.manifestVersion",message:"metadata.manifestVersion is required"}),d.engineVersion||t.push({field:"metadata.engineVersion",message:"metadata.engineVersion is required"})}(n=e.business.name)!=null&&n.trim()||t.push({field:"business.name",message:"Business name is required"}),(s=e.business.email)!=null&&s.trim()||t.push({field:"business.email",message:"Business email is required"}),(o=(r=e.ownership)==null?void 0:r.studioBrand)!=null&&o.trim()||t.push({field:"ownership.studioBrand",message:"Studio brand is required"}),(l=(i=e.ownership)==null?void 0:i.clientBrand)!=null&&l.trim()||t.push({field:"ownership.clientBrand",message:"Client brand is required"});try{Gl(e.business.sector)}catch{t.push({field:"business.sector",message:`Library key not found: sector "${e.business.sector}"`})}for(const d of e.website.sections)try{gm(d)}catch{t.push({field:"website.sections",message:`Library key not found: website section "${d}"`})}try{eo(e.website.themeKey)}catch{t.push({field:"website.themeKey",message:`Library key not found: theme "${e.website.themeKey}"`})}try{Fs(e.website.imageSourceKey)}catch{t.push({field:"website.imageSourceKey",message:`Library key not found: image source "${e.website.imageSourceKey}"`})}for(const d of e.crm.modules)try{bm(d)}catch{t.push({field:"crm.modules",message:`Library key not found: CRM module "${d}"`})}return e.crm.reviewFlow||t.push({field:"crm.reviewFlow",message:"Review flow is required in manifest"}),(c=e.delivery)!=null&&c.actions||t.push({field:"delivery.actions",message:"Delivery actions block is required"}),t.length>0?{valid:!1,errors:t}:{valid:!0,manifest:e}}function H0(e){try{const t=W0(e);return U0(t)}catch(t){return{valid:!1,errors:[{field:"manifest",message:t instanceof Error?t.message:"Unknown error during manifest build"}]}}}const Kl={backend:"local",load(e){try{const t=localStorage.getItem(e);return t?JSON.parse(t):null}catch{return null}},save(e,t){try{return localStorage.setItem(e,JSON.stringify(t)),!0}catch(n){return console.warn("[localStorageAdapter] save failed",n),!1}},remove(e){try{localStorage.removeItem(e)}catch{}}};function Vl(){const e=Zn();return!!(e!=null&&e.firebaseReady)||!1?{configured:!0,ready:!0,message:"Firebase credentials detected. Cloud sync available as upgrade — LocalStorage is active by default."}:{configured:!1,ready:!1,message:"LocalStorage active. Connect Firebase for cloud backup (optional upgrade)."}}const q0={restaurant:{tagline:"Fine Dining & Exceptional Cuisine",subTagline:"Where every meal becomes a memory. Fresh ingredients, passionate chefs, unforgettable flavours.",cta:"Reserve a Table",aboutTitle:"A Passion for Food Since Day One",aboutText:"We believe great food brings people together. Our chefs source only the finest local and seasonal ingredients to craft dishes that celebrate flavour, tradition, and creativity. Whether it's a quiet dinner for two or a lively celebration, we're here to make it perfect.",services:[{name:"Breakfast & Brunch",desc:"Start your day with our freshly prepared morning menu",price:"from €12"},{name:"Lunch Menu",desc:"Three-course set menu with seasonal specials and daily soups",price:"from €18"},{name:"Dinner & À la Carte",desc:"Signature dishes, fine wines, and an unforgettable atmosphere",price:"from €28"}],testimonials:[{name:"Sophie M.",role:"Food Blogger",text:"Absolutely stunning food and impeccable service. Every dish was a work of art.",rating:5},{name:"Carlos R.",role:"Regular Guest",text:"My favourite restaurant in the city. The pasta is simply extraordinary.",rating:5},{name:"Anna K.",role:"Event Planner",text:"Hosted our company dinner here. Everything was perfectly arranged.",rating:5}],faq:[{q:"Do you accept reservations?",a:"Yes, we strongly recommend booking in advance, especially on weekends."},{q:"Do you cater for dietary requirements?",a:"Absolutely. We offer vegetarian, vegan and gluten-free options on every menu."},{q:"Is there parking available?",a:"We have a partnered car park 2 minutes from the restaurant with free validation."},{q:"Can you host private events?",a:"Yes, our private dining room seats up to 40 guests. Contact us for packages."}],hours:"08:00 – 23:00",openDays:"Mon – Sun"},dental_clinic:{tagline:"Your Smile, Our Priority",subTagline:"Advanced dental care in a calm and comfortable environment. Trusted by thousands of patients.",cta:"Book an Appointment",aboutTitle:"Gentle Care. Lasting Results.",aboutText:"Our clinic combines the latest dental technology with a compassionate, patient-first approach. From routine check-ups to complete smile makeovers, our experienced team is dedicated to making every visit comfortable and every result exceptional.",services:[{name:"Teeth Whitening",desc:"Professional whitening treatments for a brighter, confident smile",price:"from €149"},{name:"Dental Implants",desc:"Permanent, natural-looking solutions to replace missing teeth",price:"from €890"},{name:"Orthodontics",desc:"Invisible aligners and traditional braces for all ages",price:"from €1,200"}],testimonials:[{name:"Maria J.",role:"Patient",text:"I was terrified of the dentist, but this team made me feel completely at ease.",rating:5},{name:"Thomas B.",role:"Patient",text:"The whitening treatment gave me my confidence back. Amazing results.",rating:5},{name:"Elena S.",role:"Patient",text:"My implant looks and feels completely natural. Best decision I ever made.",rating:5}],faq:[{q:"Does treatment hurt?",a:"We use gentle anaesthetics and the latest techniques to ensure a pain-free experience."},{q:"Do you treat children?",a:"Yes, we welcome patients of all ages and have child-friendly treatment rooms."},{q:"Do you accept insurance?",a:"We work with most major dental insurance providers. Contact us to confirm coverage."},{q:"How often should I visit?",a:"We recommend a check-up and hygiene appointment every six months."}],hours:"09:00 – 18:00",openDays:"Mon – Sat"},beauty_salon:{tagline:"Beauty Redefined, Confidence Restored",subTagline:"Premium beauty treatments tailored to you. Step in, unwind, and step out radiant.",cta:"Book a Treatment",aboutTitle:"Where Beauty Meets Expertise",aboutText:"Our salon is a sanctuary of style and self-care. With a team of highly trained specialists and only the finest professional products, we craft beauty experiences that leave you looking and feeling your absolute best.",services:[{name:"Hair Colouring & Styling",desc:"Balayage, highlights, colour corrections, and precision cuts",price:"from €65"},{name:"Facials & Skincare",desc:"Customised facial treatments for every skin type and concern",price:"from €55"},{name:"Lashes & Brows",desc:"Extensions, lifts, tints, and perfectly shaped brows",price:"from €40"}],testimonials:[{name:"Lisa W.",role:"Regular Client",text:"Best balayage I've ever had. The results were exactly what I wanted.",rating:5},{name:"Priya N.",role:"Client",text:"The facial was deeply relaxing and my skin glowed for weeks afterwards.",rating:5},{name:"Zara A.",role:"Client",text:"My lash extensions look so natural. I get compliments everywhere I go.",rating:5}],faq:[{q:"Should I book in advance?",a:"Yes, especially for colour services. We recommend booking at least 48 hours ahead."},{q:"What brands do you use?",a:"We exclusively use premium professional brands including Oribe and Dermalogica."},{q:"Do you offer gift vouchers?",a:"Yes! Gift vouchers are available in any amount and make the perfect present."},{q:"What's your cancellation policy?",a:"We ask for 24 hours notice for cancellations to avoid a 50% fee."}],hours:"10:00 – 20:00",openDays:"Tue – Sun"},fitness:{tagline:"Train Hard. Live Strong.",subTagline:"State-of-the-art facilities, expert coaching, and a community that pushes you further.",cta:"Start Your Journey",aboutTitle:"Built for Every Body",aboutText:"Our gym is more than just equipment — it's a movement. We combine cutting-edge fitness technology with expert personal trainers and group classes designed to challenge, motivate, and transform. No matter your level, there's a place for you here.",services:[{name:"Personal Training",desc:"One-to-one coaching tailored to your goals and fitness level",price:"from €60 / session"},{name:"Group Classes",desc:"HIIT, yoga, spin, pilates, and more — 50+ classes weekly",price:"from €15 / class"},{name:"Nutrition Coaching",desc:"Personalised meal plans and ongoing nutritional guidance",price:"from €80 / month"}],testimonials:[{name:"Jake T.",role:"Member since 2022",text:"Lost 20kg in 6 months. The personal trainers here are genuinely incredible.",rating:5},{name:"Olivia P.",role:"Member",text:"The group classes are so much fun. I actually look forward to working out now.",rating:5},{name:"Marcus H.",role:"Member",text:"Top-tier equipment, clean facilities, and a brilliant community.",rating:5}],faq:[{q:"Is there a joining fee?",a:"No joining fee when you sign up online. Just your first month's membership."},{q:"Do you offer free trials?",a:"Yes! Visit us for a free 3-day trial to experience everything we offer."},{q:"Are classes included in membership?",a:"All group classes are included in Standard and Premium memberships."},{q:"Do you have locker rooms?",a:"Yes, we have fully equipped changing rooms with secure lockers and showers."}],hours:"06:00 – 22:00",openDays:"Mon – Sun"},barber:{tagline:"Sharp Cuts. Classic Style.",subTagline:"Traditional barbering meets modern technique. Walk in a guy, walk out a gentleman.",cta:"Book Your Cut",aboutTitle:"The Art of the Cut",aboutText:"We're not just a barber shop — we're a craft. Every cut, every shave, every trim is executed with precision and pride. Our barbers are masters of their trade, bringing a blend of timeless technique and contemporary style to every chair.",services:[{name:"Haircut & Style",desc:"Scissor or clipper cut with finish, including wash and dry",price:"from €25"},{name:"Hot Towel Shave",desc:"Classic straight razor shave with hot towels and premium products",price:"from €30"},{name:"Beard Trim & Shape",desc:"Expert shaping, lining, and conditioning for any beard style",price:"from €18"}],testimonials:[{name:"Ryan M.",role:"Regular",text:"Best fade in the city, no question. These guys know exactly what they're doing.",rating:5},{name:"Dave S.",role:"Customer",text:"The hot towel shave is an experience every man should try. Pure luxury.",rating:5},{name:"Luca B.",role:"Regular",text:"Consistent, fast, and always exactly how I want it. My only barbershop.",rating:5}],faq:[{q:"Do I need to book?",a:"Walk-ins are welcome but booking guarantees your slot and avoids the wait."},{q:"How long does a cut take?",a:"Most cuts take 25–40 minutes. Shaves and combos take 45–60 minutes."},{q:"What age do you start cutting from?",a:"We cut hair from age 3 upwards. Kids' cuts are available with adult pricing."},{q:"Do you sell products?",a:"Yes, we stock a curated range of premium grooming products at the counter."}],hours:"09:00 – 19:00",openDays:"Tue – Sun"},massage:{tagline:"Relax. Restore. Revive.",subTagline:"Expert therapeutic massage for body and mind. Your stress ends here.",cta:"Book a Session",aboutTitle:"Healing Touch, Expert Hands",aboutText:"We believe that true wellness begins with care. Our therapists are fully certified specialists who combine therapeutic expertise with genuine compassion. Each session is customised to your specific needs — tension, injury, stress or simply relaxation.",services:[{name:"Swedish Massage",desc:"Classic full-body relaxation with flowing strokes and gentle pressure",price:"from €65 / 60 min"},{name:"Deep Tissue Massage",desc:"Targets deep muscle layers for chronic tension and pain relief",price:"from €75 / 60 min"},{name:"Hot Stone Therapy",desc:"Warm basalt stones combined with therapeutic massage techniques",price:"from €90 / 75 min"}],testimonials:[{name:"Claire B.",role:"Client",text:"My chronic back pain has improved enormously since I started coming here.",rating:5},{name:"Stefan V.",role:"Client",text:"The hot stone treatment was the most relaxing 90 minutes of my life.",rating:5},{name:"Yuki T.",role:"Regular Client",text:"Professional, intuitive, and genuinely therapeutic. I leave feeling reborn.",rating:5}],faq:[{q:"What should I wear?",a:"You will be professionally draped throughout. Just arrive and relax."},{q:"Should I eat before a massage?",a:"Light eating is fine but avoid heavy meals for 2 hours before your session."},{q:"Can you treat injuries?",a:"Yes, our therapists specialise in sports injuries and rehabilitation massage."},{q:"How often should I come?",a:"For maintenance we recommend every 2–4 weeks; for pain relief, weekly initially."}],hours:"10:00 – 20:00",openDays:"Mon – Sat"},cleaning:{tagline:"Spotless Results, Every Time",subTagline:"Professional cleaning services for homes, offices, and commercial spaces. Fully insured, always reliable.",cta:"Get a Free Quote",aboutTitle:"We Take Cleaning Seriously",aboutText:"Our team of trained professionals brings precision, efficiency, and care to every clean. Using eco-friendly, hospital-grade products, we ensure your space is not just clean — it's pristine. Fully insured, background-checked, and trusted by hundreds of clients.",services:[{name:"Home Cleaning",desc:"Regular or one-off deep cleans for houses and apartments",price:"from €80"},{name:"Office Cleaning",desc:"Daily, weekly, or monthly commercial cleaning contracts",price:"from €120"},{name:"End of Tenancy Clean",desc:"Comprehensive cleaning to pass rental inspections and secure deposits",price:"from €200"}],testimonials:[{name:"Patricia L.",role:"Homeowner",text:"My flat has never looked so clean. They even cleaned places I forgot existed!",rating:5},{name:"James O.",role:"Office Manager",text:"We switched to this company 6 months ago and the difference is remarkable.",rating:5},{name:"Fiona M.",role:"Landlord",text:"The end-of-tenancy clean was flawless. Full deposit returned, no questions.",rating:5}],faq:[{q:"Do you bring your own products?",a:"Yes, we bring all equipment and eco-friendly cleaning products included in the price."},{q:"Are you insured?",a:"Fully insured for public liability and key holder insurance."},{q:"Do I need to be present?",a:"Not at all. Many of our clients provide a key or code for access."},{q:"How do I book a recurring clean?",a:"Simply book online or call us to set up weekly, bi-weekly, or monthly visits."}],hours:"08:00 – 18:00",openDays:"Mon – Sat"},auto_service:{tagline:"Expert Care for Your Vehicle",subTagline:"Fast, reliable, and transparent auto service. Your car is in safe hands.",cta:"Book a Service",aboutTitle:"Honest Mechanics, Expert Results",aboutText:"With over 15 years of experience, our certified technicians deliver quality you can trust. We use original-grade parts, provide transparent pricing with no hidden costs, and keep you updated at every step. Your vehicle's performance and your peace of mind are our priorities.",services:[{name:"Full Service & MOT",desc:"Comprehensive inspection and servicing with digital checklist report",price:"from €120"},{name:"Tyres & Wheels",desc:"Tyre fitting, balancing, alignment, and seasonal swaps",price:"from €40 / tyre"},{name:"Diagnostics & Repair",desc:"Computer diagnostics, fault codes, and all mechanical repairs",price:"from €80"}],testimonials:[{name:"Georg W.",role:"Customer",text:"Finally an honest garage. Clear pricing, no surprises, and done on time.",rating:5},{name:"Sabine K.",role:"Regular Customer",text:"They fixed an issue three other garages couldn't solve. Absolutely brilliant.",rating:5},{name:"Andrei P.",role:"Fleet Manager",text:"We service our entire company fleet here. Consistent and professional.",rating:5}],faq:[{q:"Do you provide courtesy cars?",a:"Yes, subject to availability. Please request when booking."},{q:"How long does a full service take?",a:"A full service typically takes 2–3 hours. We can do while-you-wait appointments."},{q:"Do you work on all car brands?",a:"Yes, we service all makes and models, including electric vehicles."},{q:"Do you offer a warranty on repairs?",a:"All our repairs come with a 12-month, 12,000km parts and labour warranty."}],hours:"08:00 – 18:00",openDays:"Mon – Fri, Sat 08:00 – 14:00"},hotel:{tagline:"Your Home Away from Home",subTagline:"Exceptional comfort, seamless service, and memories that last a lifetime.",cta:"Check Availability",aboutTitle:"Where Comfort Meets Excellence",aboutText:"Nestled in the heart of the city, our hotel offers a perfect blend of contemporary luxury and warm hospitality. Each room is thoughtfully designed for comfort, our restaurant serves outstanding cuisine, and our concierge is ready to make your stay truly unforgettable.",services:[{name:"Standard Rooms",desc:"Stylishly furnished rooms with king-size beds and city views",price:"from €89 / night"},{name:"Suite & Premium Rooms",desc:"Spacious suites with separate lounge, minibar, and butler service",price:"from €199 / night"},{name:"Conference & Events",desc:"Fully equipped meeting rooms for up to 200 delegates",price:"from €350 / half day"}],testimonials:[{name:"Helen V.",role:"Business Traveller",text:"Perfect location, comfortable room, and the breakfast was outstanding.",rating:5},{name:"Marco F.",role:"Guest",text:"The suite was simply magnificent. The staff went above and beyond.",rating:5},{name:"Nadia R.",role:"Guest",text:"We hold all our corporate events here. Always flawless execution.",rating:5}],faq:[{q:"What time is check-in and check-out?",a:"Check-in from 15:00, check-out by 11:00. Early/late options available."},{q:"Is breakfast included?",a:"Breakfast is optional and can be added to any room booking."},{q:"Is parking available?",a:"Yes, we have an underground car park. Rates from €15 per night."},{q:"Is the hotel pet-friendly?",a:"Yes, we welcome well-behaved pets. A small daily fee applies."}],hours:"24 / 7",openDays:"Every day"},education:{tagline:"Unlock Your Potential",subTagline:"Expert-led courses and personalised learning for a brighter future.",cta:"Enrol Now",aboutTitle:"Learning That Changes Lives",aboutText:"We believe education is the foundation of everything. Our experienced instructors design courses that combine rigorous academic standards with practical, real-world application. Small class sizes, individual support, and a genuine passion for teaching set us apart.",services:[{name:"Language Courses",desc:"English, German, French and Spanish for all levels — online and in-person",price:"from €120 / month"},{name:"Professional Certification",desc:"Industry-recognised qualifications in business, IT, and management",price:"from €450 / course"},{name:"Private Tutoring",desc:"One-to-one sessions tailored to school, university, or professional needs",price:"from €45 / hour"}],testimonials:[{name:"Nina L.",role:"Student",text:"Passed my C1 exam first time thanks to this programme. Couldn't be happier.",rating:5},{name:"Peter G.",role:"Professional",text:"The business management course transformed how I lead my team.",rating:5},{name:"Amara D.",role:"Parent",text:"My son's grades improved dramatically within 2 months of tutoring here.",rating:5}],faq:[{q:"Do you offer online classes?",a:"Yes, all our courses are available both in-person and via live video."},{q:"What is the class size?",a:"Group classes are limited to 8 students for maximum learning."},{q:"Can I join mid-course?",a:"Beginners must start from the beginning; intermediate learners can join at any point."},{q:"Is there a placement test?",a:"Yes, a free online assessment helps us place you in the right level."}],hours:"09:00 – 20:00",openDays:"Mon – Sat"},real_estate:{tagline:"Find Your Perfect Property",subTagline:"Expert property guidance for buyers, sellers, and investors. Trust the local specialists.",cta:"Book a Consultation",aboutTitle:"Your Property Goals, Our Mission",aboutText:"With deep local market knowledge and a client-first ethos, we guide you through every stage of your property journey. From first-time buyers to seasoned investors, our advisors provide honest, informed guidance that helps you make confident decisions.",services:[{name:"Residential Sales",desc:"Professional valuation, marketing, and sales support for homeowners",price:"Contact us"},{name:"Property Management",desc:"Full lettings management from tenant search to maintenance",price:"from 8% / month"},{name:"Investment Advice",desc:"Market analysis, yield forecasting, and portfolio strategy",price:"from €250 / consultation"}],testimonials:[{name:"Sarah P.",role:"First-Time Buyer",text:"They made the entire process easy to understand. Found us our dream home.",rating:5},{name:"Robert M.",role:"Investor",text:"Excellent market insight and very responsive. My properties are always let.",rating:5},{name:"Julia S.",role:"Seller",text:"Sold our house in 3 weeks above asking price. Remarkable team.",rating:5}],faq:[{q:"How do you value a property?",a:"We use recent comparable sales, local market data, and in-person assessment."},{q:"How long does it take to sell?",a:"Average time to sale is 4–8 weeks in our area, depending on pricing and market."},{q:"Do you manage commercial properties?",a:"Yes, we have a dedicated commercial property division."},{q:"What are your fees?",a:"Transparent fee structures with no hidden costs. We'll explain everything upfront."}],hours:"09:00 – 18:00",openDays:"Mon – Fri, Sat 10:00 – 14:00"},construction:{tagline:"Built to Last. Built Right.",subTagline:"From foundations to finish. Quality construction and renovation with zero compromise.",cta:"Request a Quote",aboutTitle:"Craftsmanship You Can Count On",aboutText:"We build with precision, manage with accountability, and deliver with pride. Our experienced team handles residential and commercial projects from initial planning through to handover — on time, on budget, and to the highest standard.",services:[{name:"New Build Construction",desc:"Residential and commercial builds from groundwork to handover",price:"Contact for estimate"},{name:"Renovation & Refurbishment",desc:"Full and partial renovations, extensions, and conversions",price:"from €180 / m²"},{name:"Roofing & Structural Works",desc:"Roof replacements, structural repairs, and waterproofing",price:"from €4,500"}],testimonials:[{name:"Karl D.",role:"Homeowner",text:"Our extension was completed on budget and two weeks early. Exceptional.",rating:5},{name:"Christine H.",role:"Developer",text:"We've completed 4 projects with this team. Consistent quality every time.",rating:5},{name:"Boris M.",role:"Commercial Client",text:"Transformed our office space completely. Professional from start to finish.",rating:5}],faq:[{q:"Do you handle planning permission?",a:"Yes, we manage all planning applications and building regulation approvals."},{q:"Are you insured?",a:"Fully insured for public liability, employer liability, and professional indemnity."},{q:"How do I get a quote?",a:"Book a free site survey and we'll provide a full, itemised quote within 5 days."},{q:"What guarantee do you offer?",a:"All our work comes with a 10-year structural guarantee and 2-year finishing warranty."}],hours:"08:00 – 17:00",openDays:"Mon – Fri"},accounting:{tagline:"Clarity in Every Number",subTagline:"Professional accounting, tax planning, and business advisory for individuals and companies.",cta:"Book a Consultation",aboutTitle:"Your Financial Partner",aboutText:"We go beyond the numbers. Our chartered accountants provide strategic insight alongside meticulous compliance — helping you reduce tax, manage cash flow, and grow your business with confidence. Approachable, responsive, and absolutely precise.",services:[{name:"Annual Accounts & Tax",desc:"Statutory accounts preparation and self-assessment / corporation tax returns",price:"from €600 / year"},{name:"VAT & Bookkeeping",desc:"Monthly bookkeeping, VAT returns, and management accounts",price:"from €150 / month"},{name:"Business Advisory",desc:"Growth strategy, cash flow forecasting, and financial planning",price:"from €180 / hour"}],testimonials:[{name:"Paul R.",role:"Business Owner",text:"Saved us over €12,000 in tax last year. Best investment we've ever made.",rating:5},{name:"Lisa C.",role:"Freelancer",text:"Finally an accountant who explains everything clearly. Completely stress-free.",rating:5},{name:"Mark T.",role:"Director",text:"Their business advisory helped us scale from 3 to 18 staff in 2 years.",rating:5}],faq:[{q:"Can you take over from another accountant?",a:"Yes, we handle all handover communications and transfers smoothly."},{q:"Do you use cloud accounting software?",a:"Yes, we use Xero and QuickBooks and can train your team to use them too."},{q:"How quickly do you respond?",a:"We guarantee a response within one business day for all client queries."},{q:"Do you offer a fixed fee?",a:"Yes, we provide clear fixed-fee packages so you always know exactly what you pay."}],hours:"09:00 – 17:30",openDays:"Mon – Fri"},law_firm:{tagline:"Expert Legal Advice You Can Trust",subTagline:"Protecting your rights, advancing your interests. Specialist lawyers in your corner.",cta:"Request a Consultation",aboutTitle:"Principled. Precise. Powerful.",aboutText:"Our firm has built its reputation on rigorous legal thinking, unwavering client commitment, and results that speak for themselves. Whether you're facing a personal matter or complex commercial dispute, our solicitors bring focus, experience, and tenacity to your case.",services:[{name:"Corporate Law",desc:"Company formation, contracts, M&A, and commercial agreements",price:"from €200 / hour"},{name:"Employment Law",desc:"Unfair dismissal, contracts, discrimination, and employment tribunals",price:"from €180 / hour"},{name:"Property Law",desc:"Conveyancing, landlord disputes, planning, and property development",price:"from €750 / matter"}],testimonials:[{name:"David K.",role:"CEO",text:"Outstanding corporate advice that protected our acquisition. Highly recommended.",rating:5},{name:"Amy N.",role:"Client",text:"My employment case was handled sensitively and won quickly. Thank you.",rating:5},{name:"George A.",role:"Property Developer",text:"Sharp, proactive, and never miss a deadline. Our trusted legal partners.",rating:5}],faq:[{q:"Is my consultation confidential?",a:"Absolutely. All consultations are strictly privileged and confidential."},{q:"Do you offer fixed fees?",a:"Yes, for many matters we offer fixed-fee options for cost certainty."},{q:"How quickly can you take on a case?",a:"We can typically start work within 48 hours of your initial consultation."},{q:"Do you represent individuals as well as businesses?",a:"Yes, we advise both private clients and businesses across all practice areas."}],hours:"09:00 – 17:30",openDays:"Mon – Fri"}},z0={tagline:"Professional Services You Can Rely On",subTagline:"Expert solutions tailored to your needs. Quality, reliability, and results.",cta:"Get in Touch",aboutTitle:"About Us",aboutText:"We are a dedicated team of professionals committed to delivering exceptional service and outstanding results. Our expertise, attention to detail, and genuine care for our clients set us apart in everything we do.",services:[{name:"Core Service",desc:"Our flagship offering, designed to meet your most important needs",price:"Contact us"},{name:"Premium Package",desc:"A comprehensive solution including all features and priority support",price:"Contact us"},{name:"Consultation",desc:"Expert advice and tailored recommendations for your specific situation",price:"Contact us"}],testimonials:[{name:"A. Johnson",role:"Client",text:"Outstanding service and remarkable attention to detail. Highly recommended.",rating:5},{name:"B. Smith",role:"Client",text:"Professional, reliable, and delivered exactly what was promised.",rating:5},{name:"C. Davis",role:"Client",text:"The best in their field. Will absolutely return and recommend to friends.",rating:5}],faq:[{q:"How do I get started?",a:"Simply book a consultation through our booking form and we'll be in touch within 24 hours."},{q:"What are your payment terms?",a:"We accept all major payment methods. Payment schedules can be arranged for larger projects."},{q:"Do you offer guarantees?",a:"Yes, we stand behind all our work. Ask us about our satisfaction guarantee."},{q:"How can I contact you?",a:"You can reach us by phone, email, or WhatsApp. We respond within one business day."}],hours:"09:00 – 18:00",openDays:"Mon – Fri"};function ym(e){return q0[e]??z0}function Tt(e){return`${e}_${crypto.randomUUID().slice(0,8)}`}function $0(e){const t=String(e);return t==="restaurant"?[{name:"Marco Rossi",role:"Head Chef",phone:"+49 170 1001001",email:"chef@example.com",active:!0},{name:"Elena Schmidt",role:"Front of House",phone:"+49 170 1001002",email:"foh@example.com",active:!0},{name:"Jonas Weber",role:"Sous Chef",phone:"+49 170 1001003",active:!0}]:t==="hotel"?[{name:"Anna Müller",role:"Front Desk Manager",phone:"+49 170 2002001",email:"desk@example.com",active:!0},{name:"David Chen",role:"Housekeeping Lead",phone:"+49 170 2002002",active:!0},{name:"Sofia Berg",role:"Concierge",phone:"+49 170 2002003",email:"concierge@example.com",active:!0}]:t==="beauty_salon"||t==="barber"||t==="massage"?[{name:"Lara Kim",role:"Master Stylist",phone:"+49 170 3003001",email:"lara@example.com",active:!0},{name:"Nina Volkov",role:"Color Specialist",phone:"+49 170 3003002",active:!0},{name:"Mia Hoffmann",role:"Nail Artist",phone:"+49 170 3003003",active:!0}]:t==="dental_clinic"?[{name:"Dr. Peter Braun",role:"Dentist",phone:"+49 170 4004001",email:"braun@example.com",active:!0},{name:"Dr. Iris Lang",role:"Orthodontist",phone:"+49 170 4004002",email:"lang@example.com",active:!0},{name:"Clara Weiss",role:"Hygienist",phone:"+49 170 4004003",active:!0}]:t==="fitness"||t==="fitness_club"?[{name:"Alex Rivera",role:"Head Trainer",phone:"+49 170 5005001",email:"alex@example.com",active:!0},{name:"Sam Ortiz",role:"Yoga Instructor",phone:"+49 170 5005002",active:!0},{name:"Jordan Lee",role:"Strength Coach",phone:"+49 170 5005003",active:!0}]:t==="auto_service"||t==="car_service"||t==="workshop"?[{name:"Tom Keller",role:"Lead Mechanic",phone:"+49 170 6006001",email:"tom@example.com",active:!0},{name:"Ralf Stein",role:"Diagnostic Tech",phone:"+49 170 6006002",active:!0},{name:"Uwe Brandt",role:"Service Advisor",phone:"+49 170 6006003",active:!0}]:[{name:"Alex Manager",role:"Manager",phone:"+49 170 7007001",email:"manager@example.com",active:!0},{name:"Sam Specialist",role:"Specialist",phone:"+49 170 7007002",active:!0},{name:"Jordan Assistant",role:"Assistant",phone:"+49 170 7007003",active:!0}]}function G0(e){const t=to(e),n=t.resourceSingular.en;return e==="restaurant"?[{name:"Table 1",capacity:2,status:"available",notes:"Window"},{name:"Table 2",capacity:4,status:"available",notes:"Garden view"},{name:"Table 3",capacity:6,status:"occupied",notes:"Private corner"},{name:"Table 4",capacity:8,status:"available",notes:"Banquet"}]:e==="hotel"?[{name:"Room 101",capacity:2,status:"available",notes:"Standard Twin"},{name:"Room 205",capacity:2,status:"occupied",notes:"Deluxe King"},{name:"Suite 301",capacity:4,status:"available",notes:"Family Suite"},{name:"Room 110",capacity:1,status:"maintenance",notes:"Single"}]:e==="fitness"||e==="fitness_club"?[{name:"Studio A",capacity:20,status:"available",notes:"Group classes"},{name:"Studio B",capacity:12,status:"available",notes:"Yoga"},{name:"PT Room 1",capacity:2,status:"occupied",notes:"Personal training"}]:e==="auto_service"||e==="car_service"||e==="workshop"?[{name:"Bay 1",capacity:1,status:"available",notes:"General service"},{name:"Bay 2",capacity:1,status:"occupied",notes:"Diagnostics"},{name:"Bay 3",capacity:1,status:"available",notes:"Tire & alignment"}]:t.hasResources||e==="dental_clinic"||e==="beauty_salon"||e==="barber"||e==="massage"?[{name:`${n} 1`,capacity:1,status:"available"},{name:`${n} 2`,capacity:1,status:"available"},{name:`${n} 3`,capacity:1,status:"occupied"}]:[{name:`${n} 1`,capacity:1,status:"available"},{name:`${n} 2`,capacity:1,status:"available"}]}function K0(){return[{name:"Sophie Martin",phone:"+49 151 1111111",email:"sophie@example.com",notes:"VIP"},{name:"Carlos Rivera",phone:"+49 151 2222222",email:"carlos@example.com"},{name:"Anna Kowalski",phone:"+49 151 3333333",email:"anna@example.com",notes:"Prefers mornings"},{name:"Thomas Berg",phone:"+49 151 4444444"}]}function Bo(e){const t=new Date;return t.setDate(t.getDate()+e),t.toISOString().slice(0,10)}function Ls(e){var d,u,m,f,b,w,x,S,p,h;const t=e.business.sector,n=ym(t),s=new Date().toISOString(),r=n.services.map(g=>({id:Tt("svc"),name:g.name,description:g.desc,price:g.price,durationMinutes:60,active:!0}));for(;r.length<3;)r.push({id:Tt("svc"),name:`Service ${r.length+1}`,description:"Professional service package",price:"from €49",durationMinutes:45,active:!0});const o=$0(t).map(g=>({...g,id:Tt("staff")})),i=G0(t).map(g=>({...g,id:Tt("res")})),l=K0().map(g=>({...g,id:Tt("cli"),createdAt:s}));return{appointments:[{id:Tt("apt"),clientId:l[0].id,clientName:l[0].name,clientPhone:l[0].phone,serviceId:r[0].id,serviceName:r[0].name,staffId:(d=o[0])==null?void 0:d.id,resourceId:(u=i[0])==null?void 0:u.id,date:Bo(0),time:"10:00",status:"Confirmed",notes:"Seed appointment",createdAt:s},{id:Tt("apt"),clientId:l[1].id,clientName:l[1].name,clientPhone:l[1].phone,serviceId:((m=r[1])==null?void 0:m.id)??r[0].id,serviceName:((f=r[1])==null?void 0:f.name)??r[0].name,staffId:((b=o[1])==null?void 0:b.id)??((w=o[0])==null?void 0:w.id),date:Bo(1),time:"14:30",status:"Pending",createdAt:s},{id:Tt("apt"),clientId:l[2].id,clientName:l[2].name,clientPhone:l[2].phone,serviceId:((x=r[2])==null?void 0:x.id)??r[0].id,serviceName:((S=r[2])==null?void 0:S.name)??r[0].name,date:Bo(2),time:"11:15",status:"Confirmed",createdAt:s}],clients:l,services:r,resources:i,staff:o,settings:{businessName:e.business.name,phone:e.business.phone,email:e.business.email,whatsapp:e.business.whatsapp,city:e.business.city,storageBackend:"local",firebaseReady:!!((h=(p=e.delivery)==null?void 0:p.firebaseConfigMock)!=null&&h.projectId)}}}function Aa(){return{appointments:[],clients:[],services:[],resources:[],staff:[],settings:{businessName:"",phone:"",email:"",storageBackend:"local",firebaseReady:!1}}}const Ii="factory-crm-export/1.0";function V0(e){const t={schema:Ii,exportedAt:new Date().toISOString(),manifest:e.manifest,entities:e.entities,questionnaire:e.questionnaire,step:e.step};return JSON.stringify(t,null,2)}function Y0(e){let t;try{t=JSON.parse(e)}catch{throw new Error("Invalid JSON")}if(!t||typeof t!="object")throw new Error("Invalid export payload");const n=t;if(n.schema!==Ii)throw new Error(`Unsupported schema: ${String(n.schema)}`);if(!n.manifest||typeof n.manifest!="object")throw new Error("Missing manifest in export");const s=n.entities&&typeof n.entities=="object"?{...Aa(),...n.entities}:Aa();return{schema:Ii,exportedAt:n.exportedAt??new Date().toISOString(),manifest:n.manifest,entities:s,questionnaire:n.questionnaire,step:n.step}}function J0(e,t){const n=new Blob([t],{type:"application/json"}),s=URL.createObjectURL(n),r=document.createElement("a");r.href=s,r.download=e,r.click(),URL.revokeObjectURL(s)}const Os={questionnaire:null,manifest:null,step:"questionnaire",bookings:[],entities:Aa(),seeded:!1};function Q0(e){var n;const t={...Os,...e};return t.entities||(t.entities=Aa()),(!t.entities.appointments||t.entities.appointments.length===0)&&((n=t.bookings)!=null&&n.length)&&(t.entities.appointments=t.bookings.map(s=>({...s,clientName:s.clientName??s.name??"Guest",clientPhone:s.clientPhone??s.phone??"",serviceName:s.serviceName??s.service??"Service",date:s.date,status:s.status,createdAt:s.createdAt,id:s.id}))),t.bookings=t.entities.appointments,t}function Z0(){try{const e=Hl(),t=Kl.load(e);if(!t){const r=Zn();if(r!=null&&r.manifest){const o=Ls(r.manifest),i=Vl();return o.settings.firebaseReady=i.ready||o.settings.firebaseReady,{...Os,manifest:r.manifest,step:"demo",entities:o,bookings:o.appointments,seeded:!0}}return Os}const n=Q0(t),s=Zn();return s!=null&&s.manifest&&!n.manifest&&(n.manifest=s.manifest,n.step="demo"),s!=null&&s.manifest&&!n.seeded&&n.entities.services.length===0&&(n.entities=Ls(s.manifest),n.bookings=n.entities.appointments,n.seeded=!0),n}catch{return Os}}function gd(e){return Kl.save(Hl(),e)}function X0(e,t){var s,r;const n={...e,...t};return t.photoOverrides&&(n.photoOverrides={...e==null?void 0:e.photoOverrides,...t.photoOverrides,gallery:t.photoOverrides.gallery??((s=e==null?void 0:e.photoOverrides)==null?void 0:s.gallery),services:t.photoOverrides.services??((r=e==null?void 0:e.photoOverrides)==null?void 0:r.services)}),n}function Br(e){return{...e,id:e.id??crypto.randomUUID()}}const xm=y.createContext(null);function ey({children:e}){const[t,n]=y.useState(Z0);y.useEffect(()=>{const N=Zn();N!=null&&N.manifest&&n(k=>{if(k.manifest&&k.seeded)return k;const j=k.seeded&&k.entities.services.length>0?k.entities:Ls(N.manifest),I={...k,manifest:N.manifest,step:"demo",entities:j,bookings:j.appointments,seeded:!0};return gd(I),I})},[]);const s=y.useCallback(N=>{n(k=>{const j=N(k);return j.bookings=j.entities.appointments,gd(j),j})},[]),r=y.useCallback(N=>{s(k=>({...k,questionnaire:N,step:"generating"}))},[s]),o=y.useCallback(N=>{s(k=>{const I=!k.seeded||k.entities.services.length===0?Ls(N):{...k.entities,settings:{...k.entities.settings,businessName:N.business.name,phone:N.business.phone,email:N.business.email,whatsapp:N.business.whatsapp,city:N.business.city,firebaseReady:Vl().ready||k.entities.settings.firebaseReady}};return{...k,manifest:N,step:"demo",entities:I,seeded:!0}})},[s]),i=y.useCallback(N=>{s(k=>k.manifest?{...k,manifest:{...k.manifest,branding:X0(k.manifest.branding,N)}}:k)},[s]),l=y.useCallback(N=>{s(k=>({...k,step:N}))},[s]),c=y.useCallback(N=>{const k={id:crypto.randomUUID(),createdAt:new Date().toISOString(),clientName:N.clientName??N.name??"Guest",clientPhone:N.clientPhone??N.phone??"",serviceName:N.serviceName??N.service??"Service",date:N.date,time:N.time,status:N.status??"Pending",clientId:N.clientId,serviceId:N.serviceId,staffId:N.staffId,resourceId:N.resourceId,notes:N.notes};s(j=>{let I=j.entities.clients;const M=I.find(D=>D.phone===k.clientPhone);if(!M&&k.clientPhone){const D={id:crypto.randomUUID(),name:k.clientName,phone:k.clientPhone,createdAt:k.createdAt};k.clientId=D.id,I=[D,...I]}else M&&(k.clientId=M.id);return{...j,entities:{...j.entities,appointments:[k,...j.entities.appointments],clients:I}}})},[s]),d=y.useCallback((N,k)=>{s(j=>({...j,entities:{...j.entities,appointments:j.entities.appointments.map(I=>I.id===N?{...I,...k}:I)}}))},[s]),u=y.useCallback(N=>{s(k=>({...k,entities:{...k.entities,appointments:k.entities.appointments.filter(j=>j.id!==N)}}))},[s]),m=y.useCallback(N=>{s(k=>{const j=Br({...N,createdAt:N.createdAt??new Date().toISOString()}),I=k.entities.clients.findIndex(D=>D.id===j.id),M=[...k.entities.clients];return I>=0?M[I]={...M[I],...j}:M.unshift(j),{...k,entities:{...k.entities,clients:M}}})},[s]),f=y.useCallback(N=>{s(k=>({...k,entities:{...k.entities,clients:k.entities.clients.filter(j=>j.id!==N)}}))},[s]),b=y.useCallback(N=>{s(k=>{const j=Br({description:"",price:"",durationMinutes:60,active:!0,...N}),I=k.entities.services.findIndex(D=>D.id===j.id),M=[...k.entities.services];return I>=0?M[I]={...M[I],...j}:M.unshift(j),{...k,entities:{...k.entities,services:M}}})},[s]),w=y.useCallback(N=>{s(k=>({...k,entities:{...k.entities,services:k.entities.services.filter(j=>j.id!==N)}}))},[s]),x=y.useCallback(N=>{s(k=>{const j=Br({capacity:1,status:"available",...N}),I=k.entities.resources.findIndex(D=>D.id===j.id),M=[...k.entities.resources];return I>=0?M[I]={...M[I],...j}:M.unshift(j),{...k,entities:{...k.entities,resources:M}}})},[s]),S=y.useCallback(N=>{s(k=>({...k,entities:{...k.entities,resources:k.entities.resources.filter(j=>j.id!==N)}}))},[s]),p=y.useCallback(N=>{s(k=>{const j=Br({active:!0,...N}),I=k.entities.staff.findIndex(D=>D.id===j.id),M=[...k.entities.staff];return I>=0?M[I]={...M[I],...j}:M.unshift(j),{...k,entities:{...k.entities,staff:M}}})},[s]),h=y.useCallback(N=>{s(k=>({...k,entities:{...k.entities,staff:k.entities.staff.filter(j=>j.id!==N)}}))},[s]),g=y.useCallback(N=>{s(k=>({...k,entities:{...k.entities,settings:{...k.entities.settings,...N}}}))},[s]),v=y.useCallback(()=>{s(N=>{if(!N.manifest||N.seeded)return N;const k=Ls(N.manifest);return{...N,entities:k,seeded:!0}})},[s]),C=y.useCallback(()=>{if(!t.manifest)return;const N=V0({manifest:t.manifest,entities:t.entities,questionnaire:t.questionnaire,step:t.step}),k=t.manifest.business.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,40);J0(`${k||"factory"}-crm-export.json`,N)},[t]),E=y.useCallback(N=>{const k=Y0(N);s(()=>({questionnaire:k.questionnaire??null,manifest:k.manifest,step:k.step??"demo",entities:k.entities,bookings:k.entities.appointments,seeded:!0}))},[s]),_=y.useCallback(()=>{n(Os),Kl.remove(Hl())},[]),A=y.useMemo(()=>({state:t,setQuestionnaire:r,setManifest:o,setBranding:i,setStep:l,addBooking:c,updateAppointment:d,deleteAppointment:u,upsertClient:m,deleteClient:f,upsertService:b,deleteService:w,upsertResource:x,deleteResource:S,upsertStaff:p,deleteStaff:h,updateSettings:g,seedIfNeeded:v,exportJson:C,importJson:E,reset:_}),[t,r,o,i,l,c,d,u,m,f,b,w,x,S,p,h,g,v,C,E,_]);return a.jsx(xm.Provider,{value:A,children:e})}function os(){const e=y.useContext(xm);if(!e)throw new Error("useProjectStore must be used within ProjectStoreProvider");return e}const ty={tagline:"Engine for web studios"},ny={title:"Website + CRM + Online Booking",titleAccent:"+ reviews on Google Maps",subtitle:"Engine for web studios: questionnaire → manifest → build → demo → payment → ready project.",flowSteps:["Google Maps","Website","Online Booking","CRM","WhatsApp","Email","Review Request","Google Reviews","New Clients"]},sy={"01":{title:"Business Sector",subtitle:"Select the industry that best matches your client's business."},"02":{title:"Business Details",subtitle:"Basic information about the client's business."},"03":{title:"Contact Details",subtitle:"Who is the main contact for this project?"},"04":{title:"Studio Settings",subtitle:"Your agency details and project ownership configuration."}},ry={businessName:"Business Name",city:"City",websiteLanguage:"Website Language",contactPerson:"Contact Person",phone:"Phone",whatsapp:"WhatsApp",email:"Email",agencyBrand:"Agency / Studio Brand",ownershipMode:"Ownership Mode"},ay={businessName:"e.g. Bella Vita Restaurant",city:"e.g. Berlin",contactPerson:"e.g. Marco Rossi",phone:"+49 30 12345678",whatsapp:"+49 171 9876543",email:"hello@bellavita.de",agencyBrand:"e.g. Bright Digital Agency",notes:"Additional notes (optional)"},oy={client_owned:{label:"Client Owned",desc:"Client manages their project"},studio_owned:{label:"Studio Owned",desc:"Studio retains full control"},white_label:{label:"White Label",desc:"Studio brand, client delivery"}},iy={nameRequired:"Business name is required",cityRequired:"City is required",sectorRequired:"Please select a sector",contactRequired:"Contact person is required",phoneRequired:"Phone is required",emailRequired:"Email is required",emailInvalid:"Invalid email address",studioRequired:"Studio name is required",fixFields:"Please fix the highlighted fields before continuing."},ly={createDemo:"Create free demo",creating:"Creating demo…"},cy="custom",dy={badge:"Studio SDK — customization panel",title:"Studio SDK",subtitle:"Customize your client's brand and contacts before previewing the manifest — no code required.",sections:{brandContacts:"Brand & Contacts",brandContactsSub:"Edit the business name and contact details shown on the client's website.",logo:"Logo",logoSub:"Upload the client's logo (optional). PNG or SVG recommended.",color:"Brand Color",colorSub:"Override the default theme color with the client's brand color.",photos:"Photos",photosSub:"Replace stock photos with your client's own images. Unchanged slots keep the default sector photos."},fields:{businessName:"Business Name",phone:"Phone",whatsapp:"WhatsApp",email:"Email",primaryColor:"Primary Color",hexValue:"HEX Value"},placeholders:{businessName:"e.g. Bella Vita Restaurant",phone:"+49 30 12345678",whatsapp:"+49 171 9876543",email:"hello@bellavita.de"},logo:{upload:"Choose logo file",remove:"Remove",previewAlt:"Logo preview"},photos:{hero:"Hero Image",about:"About Photo",gallery:"Gallery",services:"Service Photos",slot:"Photo {n}",upload:"Upload photo",resetStock:"Restore stock photo",previewAlt:"Photo preview"},colorPreviewLabel:"Live preview",colorPreview:"Aa",validation:{invalidHex:"Enter a valid HEX color (#RRGGBB)"},cta:{saveAndContinue:"Save and continue"}},uy={title:"Manifest Control Center",newProject:"New Project",generatedBadge:"Manifest Generated Successfully",generated:"Generated",metadata:"Manifest Metadata",projectId:"Project ID",studioId:"Studio ID",clientId:"Client ID",schema:"Schema",created:"Created",updated:"Updated",businessInfo:"Business Info",ownership:"Ownership",websiteSections:"Website Sections",crmModules:"CRM Modules",reviewFlow:"Review Flow",deliveryActions:"Delivery Actions",theme:"Theme",booking:"Booking",showJson:"Show raw JSON",hideJson:"Hide raw JSON",nextSteps:"Next Steps",rowLabels:{name:"Name",city:"City",language:"Language",phone:"Phone",whatsapp:"WhatsApp",email:"Email",studio:"Studio",client:"Client",mode:"Mode",studioEmail:"Studio Email"},nextItems:{website:{title:"Website Demo",desc:"Full website generated from the current Manifest — Hero, Services, Booking, Gallery and more.",badge:"Generated from Manifest"},crm:{title:"CRM Demo",desc:"Complete CRM with Dashboard, Customers, Bookings and Calendar — from the same Manifest.",badge:"Generated from Manifest"},delivery:{title:"Delivery",desc:"Download ZIP, README, push to GitHub, connect Firebase and deploy.",badge:"ZIP · README · GitHub · Firebase · Deploy"},sdk:{title:"Studio SDK",desc:"Customize the client's brand: name, contacts, logo, brand color and photos — no code required.",badge:"Brand Editor"}},openButton:"Open",openDelivery:"Open Delivery Center",comingNext:"Coming Next",stepLabels:{booking_confirmation:"Booking Confirmed",crm_record:"CRM Record Created",whatsapp_followup:"WhatsApp Follow-up",email_followup:"Email Follow-up",google_review_request:"Google Review Request"}},py={downloadZip:"Download ZIP",pushGithub:"Push to GitHub",deployHosting:"Deploy to Hosting",connectFirebase:"Connect Firebase cloud storage",clickToRun:"Click to run",completed:"Completed",allDoneTitle:"Project Delivery Completed",allDoneSub:"All delivery steps finished successfully.",downloadProject:"Download Project ZIP",openRepository:"Open Repository",openWebsite:"Open Website",done:"Done",repositoryUrl:"Repository URL",liveDemoUrl:"Live Demo URL",firebaseConnected:"Firebase Connected",configReady:"Configuration Ready",zipSteps:{preparing:"Preparing project...",packaging:"Packaging source...",archiving:"Creating archive...",ready:"Ready"},githubSteps:{creating:"Creating repository...",uploading:"Uploading files...",readme:"Creating README...",done:"Push completed."},deploySteps:{uploading:"Uploading...",building:"Building...",deploying:"Deploying...",ready:"Ready"},firebaseSteps:{config:"Generating config...",collections:"Creating collections...",rules:"Security Rules...",done:"Completed"},promo:{title:"Enter promo code",subtitle:"Enter your promo code to unlock delivery actions.",placeholder:"e.g. AGENCY-X7K4M9",apply:"Unlock",checking:"Checking…",unlockedTitle:"Promo code accepted",unlockedSub:"Delivery actions are unlocked for this session."}},my={title:"CRM Demo",tabs:{dashboard:"Dashboard",bookings:"Bookings",customers:"Customers"},stats:{bookingsToday:"Bookings Today",totalCustomers:"Total Customers",pending:"Pending",confirmed:"Confirmed"},recentBookings:"Recent Bookings",noBookingsHint:"Make a booking in Website Demo to see it here",allBookings:"All Bookings",allCustomers:"All Customers",total:"total",columns:{name:"Name",phone:"Phone",date:"Date",service:"Service",status:"Status",visits:"Visits"},empty:{bookings:"No bookings yet",bookingsSub:"Submit a booking in Website Demo to see it appear here.",bookingsTableSub:"Submit a booking in Website Demo — it will appear here instantly.",customers:"No customers yet",customersSub:"Customers are created automatically when a booking is submitted.",customersTableSub:"Customers appear automatically when bookings are created."},visit:"visit",visits:"visits",websiteDemo:"Website Demo",backManifest:"Manifest",refresh:"Refresh"},fy={backToManifest:"Back to Manifest",nav:{home:"Home",about:"About",services:"Services",gallery:"Gallery",booking:"Book",testimonials:"Reviews",faq:"FAQ",contacts:"Contact"},call:"Call",bookNow:"Book Now",floating:{call:"Call",whatsapp:"WhatsApp",book:"Book"}},hy={about:{label:"About Us",yearsLabel:"Years of Excellence",stats:{clients:"Happy Clients",experience:"Years Experience",satisfaction:"Satisfaction"},whatsapp:"WhatsApp"},services:{eyebrow:"What We Offer",title:"Our Services",bookNow:"Book Now"},gallery:{eyebrow:"Portfolio",title:"Gallery"},testimonials:{eyebrow:"Reviews",title:"What Our Clients Say",rating:"Excellent"},booking:{eyebrow:"Book Now",confirmed:"Booking Confirmed!",confirmedSub:"Here's what happens next — automatically.",crmRecord:"CRM Record Created",whatsappSent:"WhatsApp Confirmation Sent",emailSent:"Email Confirmation Sent",reviewScheduled:"Review Request Scheduled",submitAnother:"← Submit another booking",yourName:"Your Name",phoneNumber:"Phone Number",preferredDate:"Preferred Date",selectService:"Select Service",confirmBooking:"Confirm Booking",status:{done:"Done",delivered:"Delivered ✓✓",deliveredEmail:"Delivered"}},faq:{eyebrow:"FAQ",title:"Frequently Asked Questions"},contacts:{eyebrow:"Get in Touch",title:"Contact Us",labels:{phone:"Phone",whatsapp:"WhatsApp",email:"Email",address:"Address",hours:"Hours"},form:{title:"Send a Message",namePlaceholder:"Your Name",emailPlaceholder:"Email Address",subjectPlaceholder:"Subject",messagePlaceholder:"Your message…",send:"Send Message"},successTitle:"Message Sent!",successSub:"We'll get back to you within one business day.",sendAnother:"Send another"},footer:{services:"Services",contact:"Contact",rights:"All rights reserved."},maps:{eyebrow:"Location",title:"Find Us in",openMaps:"Open in Google Maps"},whatsapp:{title:"Chat with Us on WhatsApp",subtitle:"Quick answers, booking confirmations, and direct support — available via WhatsApp.",button:"Open WhatsApp"},email:{title:"Send Us an Email",subtitle:"We reply to all enquiries within one business day."}},gy={brand:"Factory Website+CRM",journey:"Customer Journey",title:"From Google Maps to 5-Star Reviews",subtitle:"Every touchpoint is automated. The client books online → CRM records it → WhatsApp & Email confirm it → a review request follows. More reviews = more clients.",mock:"Mock",pipeline:{maps:{label:"Google Maps",sub:"Client finds you"},website:{label:"Website",sub:"Explores your brand"},booking:{label:"Online Booking",sub:"Books an appointment"},crm:{label:"CRM",sub:"Record created automatically"},wa:{label:"WhatsApp",sub:"Confirmation sent"},email:{label:"Email",sub:"Confirmation + reminder"},review:{label:"Review Request",sub:"Automated after visit"},reviews:{label:"Google Reviews",sub:"5-star rating grows"},clients:{label:"New Clients",sub:"Organic growth loop"}},infoRows:{maps:'Client discovers {name} via Google Maps and taps "Visit Website".',website:'Visitor browses the website, sees services and prices, clicks "Book Now".',booking:"Booking submitted — CRM record created, notifications triggered automatically.",crm:"Record auto-created in CRM. Booking confirmed, review flow scheduled.",waEnabled:"Confirmation sent via WhatsApp. Status: Delivered ✓✓",waDisabled:"Enable WhatsApp in manifest to activate this step.",emailEnabled:"Confirmation email sent. Reminder will be sent 24h before the appointment.",emailDisabled:"Enable email in manifest to activate this step.",reviewEnabled:"Sent automatically {hours}h after the appointment via {channel}.",reviewDisabled:"Enable review requests in manifest to activate this step.",reviews:"5-star reviews grow organically. Higher Google ranking. New clients find you.",clients:"More reviews → better Google ranking → more clients discover you → full loop."},mockLabels:{maps:"Google Maps",website:"Website",booking:"Online Booking",bookingRequest:"New Booking Request",bookingSubmitted:"✓ Booking Submitted",crm:"CRM Record",customerRecord:"Customer Record",waConfirm:"WhatsApp Confirmation",waNotConfigured:"WhatsApp not configured in this manifest",emailConfirm:"Email Confirmation",emailNotEnabled:"Email notifications not enabled in this manifest",review:"Review Request",reviewNotEnabled:"Review request not enabled in this manifest's review flow",reviews:"Google Reviews",clients:"New Clients — Growth Loop",visitWebsite:"Visit Website",bookNow:"Book Now",services:"Services",confirmed:"Confirmed",source:"Online Booking",dear:"Dear Alex,",apptConfirmed:"Your appointment has been confirmed.",leaveReview:"Leave a Google Review →",afterVisit:"after visit",scheduled:"Scheduled · ✓✓",crmFields:{service:"Service",client:"Client",phone:"Phone",date:"Date",name:"Name",source:"Source",channel:"Channel",location:"Location"},stats:{newBookings:"New bookings this month",fromMaps:"From Google Maps",repeatClients:"Repeat clients",rating:"Review rating"}}},vm={header:ty,hero:ny,formSections:sy,fields:ry,placeholders:ay,ownership:oy,validation:iy,cta:ly,customBadge:cy,studioSdk:dy,manifest:uy,delivery:py,crm:my,websiteDemo:fy,sections:hy,reviewFlow:gy},by={tagline:"Движок для веб-студий"},yy={title:"Сайт + CRM + Онлайн-запись",titleAccent:"+ отзывы в Google Maps",subtitle:"Движок для веб-студий: анкета → манифест → сборка → демо → оплата → готовый проект.",flowSteps:["Google Maps","Сайт","Онлайн-запись","CRM","WhatsApp","Email","Запрос отзыва","Google Reviews","Новые клиенты"]},xy={"01":{title:"Отрасль бизнеса",subtitle:"Выберите сферу деятельности клиента."},"02":{title:"Данные бизнеса",subtitle:"Основная информация о бизнесе клиента."},"03":{title:"Контактные данные",subtitle:"Кто является основным контактом проекта?"},"04":{title:"Настройки студии",subtitle:"Данные вашего агентства и конфигурация владения проектом."}},vy={businessName:"Название бизнеса",city:"Город",websiteLanguage:"Язык сайта",contactPerson:"Контактное лицо",phone:"Телефон",whatsapp:"WhatsApp",email:"Email",agencyBrand:"Агентство / Студия",ownershipMode:"Режим владения"},wy={businessName:"напр. Ресторан Белла Вита",city:"напр. Москва",contactPerson:"напр. Иван Петров",phone:"+7 495 123-45-67",whatsapp:"+7 916 987-65-43",email:"hello@bellavita.ru",agencyBrand:"напр. Digital Agency",notes:"Дополнительные пожелания (необязательно)"},ky={client_owned:{label:"Клиентский",desc:"Клиент управляет проектом"},studio_owned:{label:"Студийный",desc:"Студия сохраняет полный контроль"},white_label:{label:"White Label",desc:"Бренд студии, доставка клиенту"}},Sy={nameRequired:"Название бизнеса обязательно",cityRequired:"Город обязателен",sectorRequired:"Выберите отрасль",contactRequired:"Контактное лицо обязательно",phoneRequired:"Телефон обязателен",emailRequired:"Email обязателен",emailInvalid:"Некорректный email",studioRequired:"Название студии обязательно",fixFields:"Пожалуйста, исправьте выделенные поля."},Ny={createDemo:"Создать бесплатное демо",creating:"Создаём демо…"},Cy="custom",jy={badge:"Studio SDK — панель кастомизации",title:"Studio SDK",subtitle:"Настройте бренд и контакты клиента перед просмотром манифеста — без правки кода.",sections:{brandContacts:"Бренд и контакты",brandContactsSub:"Редактируйте название компании и контактные данные для сайта клиента.",logo:"Логотип",logoSub:"Загрузите логотип клиента (необязательно). Рекомендуется PNG или SVG.",color:"Фирменный цвет",colorSub:"Замените цвет темы по умолчанию на фирменный цвет клиента.",photos:"Фото",photosSub:"Замените стоковые фото на свои. Неизменённые слоты сохраняют фото ниши по умолчанию."},fields:{businessName:"Название компании",phone:"Телефон",whatsapp:"WhatsApp",email:"Email",primaryColor:"Основной цвет",hexValue:"HEX-значение"},placeholders:{businessName:"напр. Ресторан Белла Вита",phone:"+7 495 123-45-67",whatsapp:"+7 916 987-65-43",email:"hello@bellavita.ru"},logo:{upload:"Выбрать файл логотипа",remove:"Удалить",previewAlt:"Превью логотипа"},photos:{hero:"Главное фото (Hero)",about:"Фото «О нас»",gallery:"Галерея",services:"Фото услуг",slot:"Фото {n}",upload:"Загрузить фото",resetStock:"Вернуть стоковое фото",previewAlt:"Превью фото"},colorPreviewLabel:"Превью",colorPreview:"Aa",validation:{invalidHex:"Введите корректный HEX-цвет (#RRGGBB)"},cta:{saveAndContinue:"Сохранить и продолжить"}},Ry={title:"Центр управления манифестом",newProject:"Новый проект",generatedBadge:"Манифест успешно создан",generated:"Создан",metadata:"Метаданные манифеста",projectId:"ID проекта",studioId:"ID студии",clientId:"ID клиента",schema:"Схема",created:"Создан",updated:"Обновлён",businessInfo:"Данные бизнеса",ownership:"Владение",websiteSections:"Разделы сайта",crmModules:"Модули CRM",reviewFlow:"Поток отзывов",deliveryActions:"Действия доставки",theme:"Тема",booking:"Бронирование",showJson:"Показать JSON",hideJson:"Скрыть JSON",nextSteps:"Следующие шаги",rowLabels:{name:"Имя",city:"Город",language:"Язык",phone:"Телефон",whatsapp:"WhatsApp",email:"Email",studio:"Студия",client:"Клиент",mode:"Режим",studioEmail:"Email студии"},nextItems:{website:{title:"Демо сайта",desc:"Полный сайт, сгенерированный из манифеста — Hero, Услуги, Запись, Галерея и многое другое.",badge:"Сгенерировано из манифеста"},crm:{title:"Демо CRM",desc:"Полноценная CRM с Дашбордом, Клиентами, Записями и Календарём — из того же манифеста.",badge:"Сгенерировано из манифеста"},delivery:{title:"Доставка",desc:"Скачать ZIP, README, отправить на GitHub, подключить Firebase и задеплоить.",badge:"ZIP · README · GitHub · Firebase · Deploy"},sdk:{title:"Studio SDK",desc:"Настройте бренд клиента: название, контакты, логотип, фирменный цвет и фото — без правки кода.",badge:"Редактор бренда"}},openButton:"Открыть",openDelivery:"Открыть центр доставки",comingNext:"Скоро",stepLabels:{booking_confirmation:"Запись подтверждена",crm_record:"Запись в CRM создана",whatsapp_followup:"WhatsApp-сообщение",email_followup:"Email-сообщение",google_review_request:"Запрос отзыва Google"}},Ey={downloadZip:"Скачать ZIP",pushGithub:"Push на GitHub",deployHosting:"Деплой на хостинг",connectFirebase:"Подключить облачное хранение Firebase",clickToRun:"Нажмите для запуска",completed:"Выполнено",allDoneTitle:"Доставка проекта завершена",allDoneSub:"Все шаги доставки успешно выполнены.",downloadProject:"Скачать ZIP проекта",openRepository:"Открыть репозиторий",openWebsite:"Открыть сайт",done:"Готово",repositoryUrl:"URL репозитория",liveDemoUrl:"URL живого демо",firebaseConnected:"Firebase подключён",configReady:"Конфигурация готова",zipSteps:{preparing:"Подготовка проекта...",packaging:"Упаковка исходников...",archiving:"Создание архива...",ready:"Готово"},githubSteps:{creating:"Создание репозитория...",uploading:"Загрузка файлов...",readme:"Создание README...",done:"Push завершён."},deploySteps:{uploading:"Загрузка...",building:"Сборка...",deploying:"Деплой...",ready:"Готово"},firebaseSteps:{config:"Генерация конфигурации...",collections:"Создание коллекций...",rules:"Правила безопасности...",done:"Завершено"},promo:{title:"Введите промокод",subtitle:"Введите промокод, чтобы разблокировать действия доставки.",placeholder:"напр. AGENCY-X7K4M9",apply:"Разблокировать",checking:"Проверка…",unlockedTitle:"Промокод принят",unlockedSub:"Действия доставки разблокированы для этой сессии."}},_y={title:"Демо CRM",tabs:{dashboard:"Дашборд",bookings:"Записи",customers:"Клиенты"},stats:{bookingsToday:"Записи сегодня",totalCustomers:"Всего клиентов",pending:"Ожидает",confirmed:"Подтверждено"},recentBookings:"Последние записи",noBookingsHint:"Сделайте запись в демо сайта, чтобы увидеть её здесь",allBookings:"Все записи",allCustomers:"Все клиенты",total:"всего",columns:{name:"Имя",phone:"Телефон",date:"Дата",service:"Услуга",status:"Статус",visits:"Визиты"},empty:{bookings:"Записей пока нет",bookingsSub:"Сделайте запись в демо сайта, чтобы она появилась здесь.",bookingsTableSub:"Сделайте запись в демо сайта — она появится здесь мгновенно.",customers:"Клиентов пока нет",customersSub:"Клиенты создаются автоматически при создании записи.",customersTableSub:"Клиенты появляются автоматически при создании записей."},visit:"визит",visits:"визитов",websiteDemo:"Демо сайта",backManifest:"Манифест",refresh:"Обновить"},My={backToManifest:"К манифесту",nav:{home:"Главная",about:"О нас",services:"Услуги",gallery:"Галерея",booking:"Записаться",testimonials:"Отзывы",faq:"FAQ",contacts:"Контакты"},call:"Позвонить",bookNow:"Записаться",floating:{call:"Позвонить",whatsapp:"WhatsApp",book:"Записаться"}},Ty={about:{label:"О нас",yearsLabel:"Лет опыта",stats:{clients:"Довольных клиентов",experience:"Лет опыта",satisfaction:"Удовлетворённость"},whatsapp:"WhatsApp"},services:{eyebrow:"Что мы предлагаем",title:"Наши услуги",bookNow:"Записаться"},gallery:{eyebrow:"Портфолио",title:"Галерея"},testimonials:{eyebrow:"Отзывы",title:"Что говорят наши клиенты",rating:"Отлично"},booking:{eyebrow:"Записаться",confirmed:"Запись подтверждена!",confirmedSub:"Вот что произойдёт дальше — автоматически.",crmRecord:"Запись в CRM создана",whatsappSent:"Подтверждение WhatsApp отправлено",emailSent:"Подтверждение Email отправлено",reviewScheduled:"Запрос отзыва запланирован",submitAnother:"← Отправить ещё одну запись",yourName:"Ваше имя",phoneNumber:"Номер телефона",preferredDate:"Желаемая дата",selectService:"Выберите услугу",confirmBooking:"Подтвердить запись",status:{done:"Готово",delivered:"Доставлено ✓✓",deliveredEmail:"Доставлено"}},faq:{eyebrow:"FAQ",title:"Часто задаваемые вопросы"},contacts:{eyebrow:"Связаться",title:"Контакты",labels:{phone:"Телефон",whatsapp:"WhatsApp",email:"Email",address:"Адрес",hours:"Часы работы"},form:{title:"Отправить сообщение",namePlaceholder:"Ваше имя",emailPlaceholder:"Email адрес",subjectPlaceholder:"Тема",messagePlaceholder:"Ваше сообщение…",send:"Отправить"},successTitle:"Сообщение отправлено!",successSub:"Мы ответим в течение одного рабочего дня.",sendAnother:"Отправить ещё"},footer:{services:"Услуги",contact:"Контакты",rights:"Все права защищены."},maps:{eyebrow:"Местоположение",title:"Найдите нас в",openMaps:"Открыть в Google Maps"},whatsapp:{title:"Напишите нам в WhatsApp",subtitle:"Быстрые ответы, подтверждения записей и поддержка — всё через WhatsApp.",button:"Открыть WhatsApp"},email:{title:"Напишите нам email",subtitle:"Мы отвечаем на все запросы в течение одного рабочего дня."}},Ay={brand:"Factory Website+CRM",journey:"Путь клиента",title:"От Google Maps до 5-звёздочных отзывов",subtitle:"Каждое касание автоматизировано. Клиент записывается онлайн → CRM фиксирует → WhatsApp и Email подтверждают → запрос отзыва следует автоматически.",mock:"Демо",pipeline:{maps:{label:"Google Maps",sub:"Клиент находит вас"},website:{label:"Сайт",sub:"Изучает ваш бренд"},booking:{label:"Онлайн-запись",sub:"Бронирует приём"},crm:{label:"CRM",sub:"Запись создаётся авто"},wa:{label:"WhatsApp",sub:"Подтверждение отправлено"},email:{label:"Email",sub:"Подтверждение + напомин."},review:{label:"Запрос отзыва",sub:"Авто после визита"},reviews:{label:"Google Reviews",sub:"Рейтинг растёт"},clients:{label:"Новые клиенты",sub:"Органический рост"}},infoRows:{maps:"Клиент находит {name} в Google Maps и нажимает «Перейти на сайт».",website:"Посетитель изучает сайт, смотрит услуги и цены, нажимает «Записаться».",booking:"Запись отправлена — запись в CRM создана, уведомления triggered автоматически.",crm:"Запись автоматически создана в CRM. Запись подтверждена, поток отзывов запущен.",waEnabled:"Подтверждение отправлено через WhatsApp. Статус: Доставлено ✓✓",waDisabled:"Включите WhatsApp в манифесте для активации этого шага.",emailEnabled:"Письмо-подтверждение отправлено. Напоминание придёт за 24ч до визита.",emailDisabled:"Включите email в манифесте для активации этого шага.",reviewEnabled:"Отправляется автоматически через {hours}ч после визита через {channel}.",reviewDisabled:"Включите запрос отзывов в манифесте для активации этого шага.",reviews:"5-звёздочные отзывы растут органически. Выше рейтинг в Google. Больше клиентов.",clients:"Больше отзывов → выше рейтинг → больше клиентов находят вас → полный цикл."},mockLabels:{maps:"Google Maps",website:"Сайт",booking:"Онлайн-запись",bookingRequest:"Новая запись",bookingSubmitted:"✓ Запись отправлена",crm:"Запись CRM",customerRecord:"Карточка клиента",waConfirm:"Подтверждение WhatsApp",waNotConfigured:"WhatsApp не настроен в этом манифесте",emailConfirm:"Подтверждение Email",emailNotEnabled:"Email-уведомления не включены в этом манифесте",review:"Запрос отзыва",reviewNotEnabled:"Запрос отзыва не включён в потоке отзывов манифеста",reviews:"Google Reviews",clients:"Новые клиенты — Цикл роста",visitWebsite:"Перейти на сайт",bookNow:"Записаться",services:"Услуги",confirmed:"Подтверждено",source:"Онлайн-запись",dear:"Здравствуйте, Алекс,",apptConfirmed:"Ваша запись подтверждена.",leaveReview:"Оставить отзыв в Google →",afterVisit:"после визита",scheduled:"Запланировано · ✓✓",crmFields:{service:"Услуга",client:"Клиент",phone:"Телефон",date:"Дата",name:"Имя",source:"Источник",channel:"Канал",location:"Город"},stats:{newBookings:"Новых записей в этом месяце",fromMaps:"Из Google Maps",repeatClients:"Повторные клиенты",rating:"Рейтинг отзывов"}}},Py={header:by,hero:yy,formSections:xy,fields:vy,placeholders:wy,ownership:ky,validation:Sy,cta:Ny,customBadge:Cy,studioSdk:jy,manifest:Ry,delivery:Ey,crm:_y,websiteDemo:My,sections:Ty,reviewFlow:Ay},Dy={tagline:"Engine für Web-Studios"},By={title:"Website + CRM + Online-Buchung",titleAccent:"+ Bewertungen bei Google Maps",subtitle:"Engine für Web-Studios: Fragebogen → Manifest → Build → Demo → Zahlung → fertiges Projekt.",flowSteps:["Google Maps","Website","Online-Buchung","CRM","WhatsApp","E-Mail","Bewertungsanfrage","Google Reviews","Neue Kunden"]},Iy={"01":{title:"Branche",subtitle:"Wählen Sie die Branche, die am besten zum Geschäft des Kunden passt."},"02":{title:"Geschäftsdaten",subtitle:"Grundlegende Informationen zum Kundenunternehmen."},"03":{title:"Kontaktdaten",subtitle:"Wer ist der Hauptansprechpartner für dieses Projekt?"},"04":{title:"Studio-Einstellungen",subtitle:"Ihre Agenturdetails und Projekteigentumseinstellungen."}},Fy={businessName:"Unternehmensname",city:"Stadt",websiteLanguage:"Website-Sprache",contactPerson:"Kontaktperson",phone:"Telefon",whatsapp:"WhatsApp",email:"E-Mail",agencyBrand:"Agentur / Studio",ownershipMode:"Eigentumsmodell"},Ly={businessName:"z. B. Ristorante Bella Vita",city:"z. B. Berlin",contactPerson:"z. B. Marco Rossi",phone:"+49 30 12345678",whatsapp:"+49 171 9876543",email:"hallo@bellavita.de",agencyBrand:"z. B. Bright Digital Agency",notes:"Zusätzliche Hinweise (optional)"},Oy={client_owned:{label:"Kundeneigentum",desc:"Kunde verwaltet sein Projekt"},studio_owned:{label:"Studio-Eigentum",desc:"Studio behält volle Kontrolle"},white_label:{label:"White Label",desc:"Studio-Brand, Auslieferung an Kunden"}},Wy={nameRequired:"Unternehmensname ist erforderlich",cityRequired:"Stadt ist erforderlich",sectorRequired:"Bitte wählen Sie eine Branche",contactRequired:"Kontaktperson ist erforderlich",phoneRequired:"Telefon ist erforderlich",emailRequired:"E-Mail ist erforderlich",emailInvalid:"Ungültige E-Mail-Adresse",studioRequired:"Studioname ist erforderlich",fixFields:"Bitte korrigieren Sie die markierten Felder."},Uy={createDemo:"Kostenlose Demo erstellen",creating:"Demo wird erstellt…"},Hy="custom",qy={badge:"Studio SDK — Anpassungspanel",title:"Studio SDK",subtitle:"Passen Sie Marke und Kontakte des Kunden an, bevor Sie das Manifest ansehen — ohne Code.",sections:{brandContacts:"Marke & Kontakte",brandContactsSub:"Bearbeiten Sie Unternehmensname und Kontaktdaten für die Kundenwebsite.",logo:"Logo",logoSub:"Laden Sie das Kundenlogo hoch (optional). PNG oder SVG empfohlen.",color:"Markenfarbe",colorSub:"Überschreiben Sie die Standard-Designfarbe mit der Markenfarbe des Kunden.",photos:"Fotos",photosSub:"Ersetzen Sie Stockfotos durch eigene Bilder des Kunden. Nicht geänderte Slots behalten die Standardfotos der Branche."},fields:{businessName:"Unternehmensname",phone:"Telefon",whatsapp:"WhatsApp",email:"E-Mail",primaryColor:"Primärfarbe",hexValue:"HEX-Wert"},placeholders:{businessName:"z. B. Ristorante Bella Vita",phone:"+49 30 12345678",whatsapp:"+49 171 9876543",email:"hallo@bellavita.de"},logo:{upload:"Logodatei wählen",remove:"Entfernen",previewAlt:"Logo-Vorschau"},photos:{hero:"Hauptfoto (Hero)",about:"Foto „Über uns“",gallery:"Galerie",services:"Leistungsfotos",slot:"Foto {n}",upload:"Foto hochladen",resetStock:"Stockfoto wiederherstellen",previewAlt:"Fotovorschau"},colorPreviewLabel:"Live-Vorschau",colorPreview:"Aa",validation:{invalidHex:"Geben Sie eine gültige HEX-Farbe ein (#RRGGBB)"},cta:{saveAndContinue:"Speichern und fortfahren"}},zy={title:"Manifest-Steuerzentrale",newProject:"Neues Projekt",generatedBadge:"Manifest erfolgreich erstellt",generated:"Erstellt",metadata:"Manifest-Metadaten",projectId:"Projekt-ID",studioId:"Studio-ID",clientId:"Kunden-ID",schema:"Schema",created:"Erstellt",updated:"Aktualisiert",businessInfo:"Geschäftsdaten",ownership:"Eigentum",websiteSections:"Website-Bereiche",crmModules:"CRM-Module",reviewFlow:"Bewertungsfluss",deliveryActions:"Lieferaktionen",theme:"Theme",booking:"Buchung",showJson:"Roh-JSON anzeigen",hideJson:"Roh-JSON ausblenden",nextSteps:"Nächste Schritte",rowLabels:{name:"Name",city:"Stadt",language:"Sprache",phone:"Telefon",whatsapp:"WhatsApp",email:"E-Mail",studio:"Studio",client:"Kunde",mode:"Modus",studioEmail:"Studio-E-Mail"},nextItems:{website:{title:"Website-Demo",desc:"Vollständige Website aus dem aktuellen Manifest — Hero, Leistungen, Buchung, Galerie und mehr.",badge:"Aus Manifest generiert"},crm:{title:"CRM-Demo",desc:"Vollständiges CRM mit Dashboard, Kunden, Buchungen und Kalender — aus demselben Manifest.",badge:"Aus Manifest generiert"},delivery:{title:"Auslieferung",desc:"ZIP herunterladen, README, auf GitHub pushen, Firebase verbinden und deployen.",badge:"ZIP · README · GitHub · Firebase · Deploy"},sdk:{title:"Studio SDK",desc:"Passen Sie die Marke des Kunden an: Name, Kontakte, Logo, Markenfarbe und Fotos — ohne Code.",badge:"Marken-Editor"}},openButton:"Öffnen",openDelivery:"Lieferzentrum öffnen",comingNext:"Demnächst",stepLabels:{booking_confirmation:"Buchung bestätigt",crm_record:"CRM-Eintrag erstellt",whatsapp_followup:"WhatsApp-Nachricht",email_followup:"E-Mail-Nachricht",google_review_request:"Google-Bewertungsanfrage"}},$y={downloadZip:"ZIP herunterladen",pushGithub:"Auf GitHub pushen",deployHosting:"Auf Hosting deployen",connectFirebase:"Firebase-Cloudspeicher verbinden",clickToRun:"Klicken zum Starten",completed:"Abgeschlossen",allDoneTitle:"Projektauslieferung abgeschlossen",allDoneSub:"Alle Lieferschritte erfolgreich abgeschlossen.",downloadProject:"Projekt-ZIP herunterladen",openRepository:"Repository öffnen",openWebsite:"Website öffnen",done:"Fertig",repositoryUrl:"Repository-URL",liveDemoUrl:"Live-Demo-URL",firebaseConnected:"Firebase verbunden",configReady:"Konfiguration bereit",zipSteps:{preparing:"Projekt wird vorbereitet...",packaging:"Quellen werden verpackt...",archiving:"Archiv wird erstellt...",ready:"Bereit"},githubSteps:{creating:"Repository wird erstellt...",uploading:"Dateien werden hochgeladen...",readme:"README wird erstellt...",done:"Push abgeschlossen."},deploySteps:{uploading:"Wird hochgeladen...",building:"Wird gebaut...",deploying:"Wird deployed...",ready:"Bereit"},firebaseSteps:{config:"Konfiguration wird generiert...",collections:"Collections werden erstellt...",rules:"Sicherheitsregeln...",done:"Abgeschlossen"},promo:{title:"Promo-Code eingeben",subtitle:"Geben Sie Ihren Promo-Code ein, um die Auslieferungsaktionen freizuschalten.",placeholder:"z. B. AGENCY-X7K4M9",apply:"Freischalten",checking:"Prüfen…",unlockedTitle:"Promo-Code akzeptiert",unlockedSub:"Auslieferungsaktionen sind für diese Sitzung freigeschaltet."}},Gy={title:"CRM-Demo",tabs:{dashboard:"Dashboard",bookings:"Buchungen",customers:"Kunden"},stats:{bookingsToday:"Buchungen heute",totalCustomers:"Kunden gesamt",pending:"Ausstehend",confirmed:"Bestätigt"},recentBookings:"Letzte Buchungen",noBookingsHint:"Erstellen Sie eine Buchung in der Website-Demo, um sie hier zu sehen",allBookings:"Alle Buchungen",allCustomers:"Alle Kunden",total:"gesamt",columns:{name:"Name",phone:"Telefon",date:"Datum",service:"Leistung",status:"Status",visits:"Besuche"},empty:{bookings:"Noch keine Buchungen",bookingsSub:"Buchung in der Website-Demo erstellen, um sie hier zu sehen.",bookingsTableSub:"Buchung in der Website-Demo erstellen — erscheint sofort hier.",customers:"Noch keine Kunden",customersSub:"Kunden werden automatisch erstellt, wenn eine Buchung eingereicht wird.",customersTableSub:"Kunden erscheinen automatisch, wenn Buchungen erstellt werden."},visit:"Besuch",visits:"Besuche",websiteDemo:"Website-Demo",backManifest:"Manifest",refresh:"Aktualisieren"},Ky={backToManifest:"Zurück zum Manifest",nav:{home:"Startseite",about:"Über uns",services:"Leistungen",gallery:"Galerie",booking:"Buchen",testimonials:"Bewertungen",faq:"FAQ",contacts:"Kontakt"},call:"Anrufen",bookNow:"Jetzt buchen",floating:{call:"Anrufen",whatsapp:"WhatsApp",book:"Buchen"}},Vy={about:{label:"Über uns",yearsLabel:"Jahre Erfahrung",stats:{clients:"Zufriedene Kunden",experience:"Jahre Erfahrung",satisfaction:"Zufriedenheit"},whatsapp:"WhatsApp"},services:{eyebrow:"Was wir anbieten",title:"Unsere Leistungen",bookNow:"Jetzt buchen"},gallery:{eyebrow:"Portfolio",title:"Galerie"},testimonials:{eyebrow:"Bewertungen",title:"Was unsere Kunden sagen",rating:"Ausgezeichnet"},booking:{eyebrow:"Jetzt buchen",confirmed:"Buchung bestätigt!",confirmedSub:"Das passiert als nächstes — automatisch.",crmRecord:"CRM-Eintrag erstellt",whatsappSent:"WhatsApp-Bestätigung gesendet",emailSent:"E-Mail-Bestätigung gesendet",reviewScheduled:"Bewertungsanfrage geplant",submitAnother:"← Weitere Buchung einreichen",yourName:"Ihr Name",phoneNumber:"Telefonnummer",preferredDate:"Gewünschtes Datum",selectService:"Leistung auswählen",confirmBooking:"Buchung bestätigen",status:{done:"Fertig",delivered:"Zugestellt ✓✓",deliveredEmail:"Zugestellt"}},faq:{eyebrow:"FAQ",title:"Häufig gestellte Fragen"},contacts:{eyebrow:"Kontakt aufnehmen",title:"Kontakt",labels:{phone:"Telefon",whatsapp:"WhatsApp",email:"E-Mail",address:"Adresse",hours:"Öffnungszeiten"},form:{title:"Nachricht senden",namePlaceholder:"Ihr Name",emailPlaceholder:"E-Mail-Adresse",subjectPlaceholder:"Betreff",messagePlaceholder:"Ihre Nachricht…",send:"Nachricht senden"},successTitle:"Nachricht gesendet!",successSub:"Wir antworten innerhalb eines Werktages.",sendAnother:"Weitere senden"},footer:{services:"Leistungen",contact:"Kontakt",rights:"Alle Rechte vorbehalten."},maps:{eyebrow:"Standort",title:"Finden Sie uns in",openMaps:"In Google Maps öffnen"},whatsapp:{title:"Schreiben Sie uns auf WhatsApp",subtitle:"Schnelle Antworten, Buchungsbestätigungen und direkter Support — über WhatsApp.",button:"WhatsApp öffnen"},email:{title:"Senden Sie uns eine E-Mail",subtitle:"Wir antworten auf alle Anfragen innerhalb eines Werktages."}},Yy={brand:"Factory Website+CRM",journey:"Customer Journey",title:"Von Google Maps zu 5-Sterne-Bewertungen",subtitle:"Jeder Kontaktpunkt ist automatisiert. Kunde bucht online → CRM erfasst es → WhatsApp & E-Mail bestätigen → Bewertungsanfrage folgt automatisch.",mock:"Mock",pipeline:{maps:{label:"Google Maps",sub:"Kunde findet Sie"},website:{label:"Website",sub:"Erkundet Ihre Marke"},booking:{label:"Online-Buchung",sub:"Bucht einen Termin"},crm:{label:"CRM",sub:"Eintrag automatisch erstellt"},wa:{label:"WhatsApp",sub:"Bestätigung gesendet"},email:{label:"E-Mail",sub:"Bestätigung + Erinnerung"},review:{label:"Bewertungsanfrage",sub:"Automatisch nach Besuch"},reviews:{label:"Google Reviews",sub:"5-Sterne-Rating wächst"},clients:{label:"Neue Kunden",sub:"Organische Wachstumsschleife"}},infoRows:{maps:"Kunde entdeckt {name} über Google Maps und tippt auf 'Website besuchen'.",website:"Besucher durchsucht die Website, sieht Leistungen und Preise, klickt 'Jetzt buchen'.",booking:"Buchung eingereicht — CRM-Eintrag erstellt, Benachrichtigungen automatisch ausgelöst.",crm:"Eintrag automatisch im CRM erstellt. Buchung bestätigt, Bewertungsfluss gestartet.",waEnabled:"Bestätigung per WhatsApp gesendet. Status: Zugestellt ✓✓",waDisabled:"WhatsApp im Manifest aktivieren, um diesen Schritt zu aktivieren.",emailEnabled:"Bestätigungs-E-Mail gesendet. Erinnerung wird 24h vor dem Termin gesendet.",emailDisabled:"E-Mail im Manifest aktivieren, um diesen Schritt zu aktivieren.",reviewEnabled:"Wird automatisch {hours}h nach dem Termin über {channel} gesendet.",reviewDisabled:"Bewertungsanfragen im Manifest aktivieren, um diesen Schritt zu aktivieren.",reviews:"5-Sterne-Bewertungen wachsen organisch. Höheres Google-Ranking. Neue Kunden finden Sie.",clients:"Mehr Bewertungen → besseres Google-Ranking → mehr Kunden entdecken Sie → voller Kreislauf."},mockLabels:{maps:"Google Maps",website:"Website",booking:"Online-Buchung",bookingRequest:"Neue Buchungsanfrage",bookingSubmitted:"✓ Buchung eingereicht",crm:"CRM-Eintrag",customerRecord:"Kundendatensatz",waConfirm:"WhatsApp-Bestätigung",waNotConfigured:"WhatsApp nicht in diesem Manifest konfiguriert",emailConfirm:"E-Mail-Bestätigung",emailNotEnabled:"E-Mail-Benachrichtigungen in diesem Manifest nicht aktiviert",review:"Bewertungsanfrage",reviewNotEnabled:"Bewertungsanfrage im Bewertungsfluss des Manifests nicht aktiviert",reviews:"Google Reviews",clients:"Neue Kunden — Wachstumsschleife",visitWebsite:"Website besuchen",bookNow:"Jetzt buchen",services:"Leistungen",confirmed:"Bestätigt",source:"Online-Buchung",dear:"Sehr geehrte/r Alex,",apptConfirmed:"Ihr Termin wurde bestätigt.",leaveReview:"Google-Bewertung hinterlassen →",afterVisit:"nach dem Besuch",scheduled:"Geplant · ✓✓",crmFields:{service:"Leistung",client:"Kunde",phone:"Telefon",date:"Datum",name:"Name",source:"Quelle",channel:"Kanal",location:"Stadt"},stats:{newBookings:"Neue Buchungen diesen Monat",fromMaps:"Über Google Maps",repeatClients:"Stammkunden",rating:"Bewertungsdurchschnitt"}}},Jy={header:Dy,hero:By,formSections:Iy,fields:Fy,placeholders:Ly,ownership:Oy,validation:Wy,cta:Uy,customBadge:Hy,studioSdk:qy,manifest:zy,delivery:$y,crm:Gy,websiteDemo:Ky,sections:Vy,reviewFlow:Yy},Qy={en:vm,ru:Py,de:Jy},wm=y.createContext({t:vm,language:"en",setLanguage:()=>{}});function Zy({children:e}){const[t,n]=y.useState(()=>{const r=localStorage.getItem("factory_ui_lang");return r==="ru"||r==="de"||r==="en"?r:"en"}),s=y.useCallback(r=>{localStorage.setItem("factory_ui_lang",r),n(r)},[]);return a.jsx(wm.Provider,{value:{t:Qy[t],language:t,setLanguage:s},children:e})}function se(){return y.useContext(wm)}function Yl(){const{language:e,setLanguage:t}=se(),n=["en","ru","de"];return a.jsx("div",{className:"flex items-center gap-1",children:n.map((s,r)=>a.jsxs("span",{className:"flex items-center gap-1",children:[r>0&&a.jsx("span",{className:"text-white/20 text-xs",children:"|"}),a.jsx("button",{onClick:()=>t(s),className:`text-xs font-bold transition-colors px-1 ${e===s?"text-white":"text-white/35 hover:text-white/70"}`,children:s.toUpperCase()})]},s))})}function Ir({number:e,title:t,subtitle:n,required:s,children:r}){return a.jsxs("div",{className:"mb-10 animate-fade-up",children:[a.jsxs("div",{className:"flex items-baseline gap-3 mb-6",children:[a.jsx("span",{className:"text-xs font-mono font-bold text-primary/50 tracking-widest",children:e}),a.jsxs("div",{children:[a.jsxs("h2",{className:"text-lg font-bold text-factory-dark",children:[t,s&&a.jsx("span",{className:"text-primary/60 ml-1 text-sm",children:"*"})]}),a.jsx("p",{className:"text-sm text-slate-400 mt-0.5",children:n})]})]}),r]})}function Ae({onChange:e,error:t,className:n="",...s}){return a.jsx("input",{onChange:r=>e==null?void 0:e(r.target.value),className:`w-full px-4 py-3 rounded-xl border-2 text-sm text-slate-800 placeholder-slate-300 transition-all duration-150 focus:outline-none ${t?"border-red-400 bg-red-50/50 focus:border-red-500":"border-factory-border bg-white focus:border-primary focus:shadow-glow-sm"} ${n}`,...s})}function Xy({error:e,className:t="",children:n,...s}){return a.jsxs("div",{className:"relative",children:[a.jsx("select",{className:`w-full appearance-none px-4 py-3 pr-10 rounded-xl border-2 bg-white text-slate-800 text-sm font-medium focus:outline-none transition-all cursor-pointer ${e?"border-red-400 focus:border-red-500":"border-factory-border focus:border-primary focus:shadow-glow-sm"} ${t}`,...s,children:n}),a.jsx(Ma,{className:"absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"})]})}function km({className:e="",children:t,...n}){return a.jsxs("button",{className:`group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-bold text-base transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-glow hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 overflow-hidden ${e}`,style:{background:"linear-gradient(135deg, #6C3BFF 0%, #00D4FF 100%)"},...n,children:[a.jsx("span",{className:"absolute inset-0 bg-card-shine pointer-events-none"}),t]})}function ex({className:e=""}){return a.jsx("span",{className:`inline-block rounded-full border-2 border-white/40 border-t-white animate-spin ${e}`,style:{width:16,height:16}})}const tx={restaurant:y0,dental_clinic:h0,beauty_salon:f0,fitness:Jb,barber:u0,massage:Zb,cleaning:x0,auto_service:Kb,hotel:qb,education:Qb,real_estate:e0,construction:Xb,accounting:$b,law_firm:d0},nx=[{key:"en",flag:"EN"},{key:"de",flag:"DE"},{key:"ru",flag:"RU"}];function sx(){const e=Sn(),{setQuestionnaire:t,setManifest:n}=os(),{t:s}=se(),r=S0(),[o,i]=y.useState({name:"",city:"",sector:"",language:"en",clientBrand:"",phone:"",whatsapp:"",email:"",studioBrand:"",ownershipMode:"client_owned"}),[l,c]=y.useState({}),[d,u]=y.useState(!1),[m,f]=y.useState(null),[b,w]=y.useState(!1),x=v=>{const C={};return v.name.trim()||(C.name=s.validation.nameRequired),v.city.trim()||(C.city=s.validation.cityRequired),v.sector||(C.sector=s.validation.sectorRequired),v.clientBrand.trim()||(C.clientBrand=s.validation.contactRequired),v.phone.trim()||(C.phone=s.validation.phoneRequired),v.email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)||(C.email=s.validation.emailInvalid):C.email=s.validation.emailRequired,v.studioBrand.trim()||(C.studioBrand=s.validation.studioRequired),C},S=(v,C)=>{const E={...o,[v]:C};i(E),d&&c(x(E))},p=[{key:"client_owned",label:s.ownership.client_owned.label,desc:s.ownership.client_owned.desc},{key:"studio_owned",label:s.ownership.studio_owned.label,desc:s.ownership.studio_owned.desc},{key:"white_label",label:s.ownership.white_label.label,desc:s.ownership.white_label.desc}],h=async()=>{u(!0);const v=x(o);if(c(v),Object.keys(v).length>0)return;w(!0),await new Promise(E=>setTimeout(E,600));const C=H0({name:o.name,sector:o.sector,city:o.city,language:o.language,phone:o.phone,whatsapp:o.whatsapp||void 0,email:o.email,studioBrand:o.studioBrand,clientBrand:o.clientBrand,ownershipMode:o.ownershipMode});if(!C.valid){w(!1),f(C.errors.map(E=>E.message).join(" · "));return}t({name:o.name,sector:o.sector,city:o.city,language:o.language,phone:o.phone,whatsapp:o.whatsapp||void 0,email:o.email,studioBrand:o.studioBrand,clientBrand:o.clientBrand,ownershipMode:o.ownershipMode}),n(C.manifest),e("/studio")},g=d&&Object.keys(l).length>0;return a.jsxs("div",{className:"min-h-screen bg-factory-bg",children:[a.jsx("header",{className:"fixed top-0 left-0 right-0 z-50 bg-factory-dark/95 backdrop-blur-md border-b border-white/5",children:a.jsxs("div",{className:"max-w-6xl mx-auto px-6 h-16 flex items-center justify-between",children:[a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:"w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-glow-sm",children:a.jsx(pr,{className:"w-4 h-4 text-white"})}),a.jsx("span",{className:"text-white font-bold text-lg tracking-tight",children:"Factory Website+CRM"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx("div",{className:"hidden sm:flex items-center gap-2 text-xs text-white/40",children:s.header.tagline}),a.jsx(Yl,{})]})]})}),a.jsx("div",{className:"bg-dark-surface pt-16",children:a.jsxs("div",{className:"max-w-6xl mx-auto px-6 py-14 text-center",children:[a.jsxs("h1",{className:"text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5 animate-fade-up",children:[s.hero.title,a.jsx("br",{}),a.jsx("span",{className:"gradient-text",children:s.hero.titleAccent})]}),a.jsx("p",{className:"text-white/50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed animate-fade-up delay-150 mb-8",children:s.hero.subtitle}),a.jsx("div",{className:"flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-white/35 animate-fade-up delay-300",children:s.hero.flowSteps.map((v,C,E)=>a.jsxs("span",{className:"flex items-center gap-1.5",children:[a.jsx("span",{className:"px-2 py-1 rounded-md bg-white/6 border border-white/10 text-white/50 font-medium whitespace-nowrap",children:v}),C<E.length-1&&a.jsx("span",{className:"text-white/20",children:"→"})]},v))})]})}),a.jsxs("main",{className:"max-w-6xl mx-auto px-6 py-12",children:[a.jsxs(Ir,{number:"01",title:s.formSections["01"].title,subtitle:s.formSections["01"].subtitle,required:!0,children:[a.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3",children:r.map((v,C)=>{const E=tx[v.key]??zb,_=o.sector===v.key;return a.jsxs("button",{type:"button",onClick:()=>S("sector",v.key),style:{animationDelay:`${C*35}ms`},className:`
                    animate-fade-up group relative flex flex-col items-center gap-2.5 p-4 rounded-2xl
                    border-2 transition-all duration-200 text-center cursor-pointer
                    ${_?"border-primary bg-primary/8 shadow-selected":"border-factory-border bg-white hover:border-primary/40 hover:shadow-card hover:-translate-y-0.5"}
                  `,children:[a.jsx("div",{className:`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-all
                    ${_?"bg-brand shadow-glow-sm":"bg-factory-bg group-hover:bg-brand-subtle"}
                  `,children:a.jsx(E,{className:`w-5 h-5 transition-colors ${_?"text-white":"text-primary/60 group-hover:text-primary"}`})}),a.jsx("span",{className:`text-xs font-semibold leading-tight ${_?"text-primary":"text-slate-600"}`,children:v.labelEn}),!v.builtIn&&a.jsx("span",{className:"absolute top-1.5 right-1.5 text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold",children:s.customBadge})]},v.key)})}),l.sector&&a.jsx(Sm,{message:l.sector})]}),a.jsxs("div",{className:"grid md:grid-cols-2 gap-8",children:[a.jsx(Ir,{number:"02",title:s.formSections["02"].title,subtitle:s.formSections["02"].subtitle,required:!0,children:a.jsxs("div",{className:"space-y-4",children:[a.jsx(pt,{label:s.fields.businessName,required:!0,error:l.name,icon:a.jsx(cm,{className:"w-4 h-4"}),children:a.jsx(Ae,{value:o.name,onChange:v=>S("name",v),placeholder:s.placeholders.businessName,error:!!l.name})}),a.jsx(pt,{label:s.fields.city,required:!0,error:l.city,icon:a.jsx(vn,{className:"w-4 h-4"}),children:a.jsx(Ae,{value:o.city,onChange:v=>S("city",v),placeholder:s.placeholders.city,error:!!l.city})}),a.jsx(pt,{label:s.fields.websiteLanguage,required:!0,children:a.jsx("div",{className:"grid grid-cols-3 gap-2",children:nx.map(v=>a.jsx("button",{type:"button",onClick:()=>S("language",v.key),className:`
                        py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border
                        ${o.language===v.key?"bg-brand text-white border-transparent shadow-glow-sm":"bg-white text-slate-500 border-factory-border hover:border-primary/40 hover:text-primary"}
                      `,children:v.flag},v.key))})})]})}),a.jsx(Ir,{number:"03",title:s.formSections["03"].title,subtitle:s.formSections["03"].subtitle,required:!0,children:a.jsxs("div",{className:"space-y-4",children:[a.jsx(pt,{label:s.fields.contactPerson,required:!0,error:l.clientBrand,icon:a.jsx(b0,{className:"w-4 h-4"}),children:a.jsx(Ae,{value:o.clientBrand,onChange:v=>S("clientBrand",v),placeholder:s.placeholders.contactPerson,error:!!l.clientBrand})}),a.jsx(pt,{label:s.fields.phone,required:!0,error:l.phone,icon:a.jsx(Vt,{className:"w-4 h-4"}),children:a.jsx(Ae,{value:o.phone,onChange:v=>S("phone",v),placeholder:s.placeholders.phone,error:!!l.phone})}),a.jsx(pt,{label:s.fields.whatsapp,icon:a.jsx(Vt,{className:"w-4 h-4"}),children:a.jsx(Ae,{value:o.whatsapp,onChange:v=>S("whatsapp",v),placeholder:s.placeholders.whatsapp})}),a.jsx(pt,{label:s.fields.email,required:!0,error:l.email,icon:a.jsx(Rt,{className:"w-4 h-4"}),children:a.jsx(Ae,{value:o.email,onChange:v=>S("email",v),placeholder:s.placeholders.email,error:!!l.email})})]})})]}),a.jsx(Ir,{number:"04",title:s.formSections["04"].title,subtitle:s.formSections["04"].subtitle,children:a.jsxs("div",{className:"grid md:grid-cols-2 gap-6",children:[a.jsx(pt,{label:s.fields.agencyBrand,required:!0,error:l.studioBrand,icon:a.jsx(as,{className:"w-4 h-4"}),children:a.jsx(Ae,{value:o.studioBrand,onChange:v=>S("studioBrand",v),placeholder:s.placeholders.agencyBrand,error:!!l.studioBrand})}),a.jsx(pt,{label:s.fields.ownershipMode,children:a.jsx(Xy,{value:o.ownershipMode,onChange:v=>S("ownershipMode",v.target.value),children:p.map(v=>a.jsxs("option",{value:v.key,children:[v.label," — ",v.desc]},v.key))})})]})}),(g||m)&&a.jsxs("div",{className:"mb-6 p-4 bg-red-50 border border-red-200/80 rounded-2xl flex items-start gap-3 animate-fade-in",children:[a.jsx(im,{className:"w-5 h-5 text-red-500 shrink-0 mt-0.5"}),a.jsx("p",{className:"text-sm text-red-700",children:m??s.validation.fixFields})]}),a.jsx("div",{className:"flex justify-end pb-12",children:a.jsx(km,{type:"button",onClick:h,disabled:b,children:b?a.jsxs(a.Fragment,{children:[a.jsx(ex,{}),s.cta.creating]}):a.jsxs(a.Fragment,{children:[s.cta.createDemo,a.jsx(lm,{className:"w-5 h-5 transition-transform group-hover:translate-x-1"})]})})})]})]})}function pt({label:e,required:t,error:n,icon:s,children:r}){return a.jsxs("div",{children:[a.jsxs("label",{className:"flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2",children:[s&&a.jsx("span",{className:"text-slate-400",children:s}),e,t&&a.jsx("span",{className:"text-primary text-xs ml-0.5",children:"*"})]}),r,n&&a.jsx(Sm,{message:n})]})}function Sm({message:e}){return a.jsxs("p",{className:"mt-1.5 text-xs text-red-600 flex items-center gap-1.5 animate-fade-in",children:[a.jsx(im,{className:"w-3.5 h-3.5 shrink-0"}),e]})}function rx(e){return{businessNameOverride:e.business.name,phoneOverride:e.business.phone,whatsappOverride:e.business.whatsapp,emailOverride:e.business.email}}function is(e){var t;return((t=e.branding)==null?void 0:t.businessNameOverride)??e.business.name}function ls(e){var t;return((t=e.branding)==null?void 0:t.phoneOverride)??e.business.phone}function no(e){var t;return((t=e.branding)==null?void 0:t.whatsappOverride)??e.business.whatsapp}function Jl(e){var t;return((t=e.branding)==null?void 0:t.emailOverride)??e.business.email}function Nm(e){var t;return(t=e.branding)==null?void 0:t.logoDataUrl}function bd(e,t){return t?e.map((n,s)=>t[s]??n):[...e]}function ax(e,t){return t?{...e,hero:t.hero??e.hero,about:t.about??e.about,gallery:bd(e.gallery,t.gallery),services:bd(e.services,t.services)}:{...e}}function Cm(e){try{return Fs(e.website.imageSourceKey)}catch{try{const t=Gl(e.business.sector);return Fs(t.imageSourceKey)}catch{return Fs("pexels_office")}}}const ox=1200,ix=.82;function yd(e,t=ox,n=ix){return new Promise((s,r)=>{const o=new FileReader;o.onload=()=>{const i=new Image;i.onload=()=>{const l=Math.min(1,t/Math.max(i.width,i.height)),c=Math.max(1,Math.round(i.width*l)),d=Math.max(1,Math.round(i.height*l)),u=document.createElement("canvas");u.width=c,u.height=d;const m=u.getContext("2d");if(!m){r(new Error("Canvas not available"));return}m.drawImage(i,0,0,c,d),s(u.toDataURL("image/jpeg",n))},i.onerror=()=>r(new Error("Failed to decode image")),i.src=o.result},o.onerror=()=>r(new Error("Failed to read file")),o.readAsDataURL(e)})}function at({icon:e,iconColor:t,title:n,children:s,fullWidth:r,className:o=""}){return a.jsxs("div",{className:`bg-white rounded-2xl border border-factory-border p-5 shadow-card hover:shadow-card-hover transition-shadow animate-fade-up ${r?"col-span-full":""} ${o}`,children:[a.jsxs("div",{className:"flex items-center gap-2.5 mb-4",children:[a.jsx("div",{className:"w-7 h-7 rounded-lg flex items-center justify-center shrink-0",style:{background:`${t}18`,color:t},children:e}),a.jsx("h3",{className:"text-sm font-bold text-factory-dark",children:n})]}),s]})}const lx={primary:"bg-brand text-white hover:opacity-90 hover:-translate-y-0.5 shadow-glow-sm",ghost:"glass text-white/60 hover:text-white hover:bg-white/10",outline:"border border-factory-border bg-white text-slate-700 hover:border-primary/40 hover:text-primary"},cx={sm:"px-3 py-1.5 text-xs rounded-lg",md:"px-4 py-2 text-sm rounded-xl",lg:"px-6 py-3 text-sm rounded-xl"};function jm({variant:e="primary",size:t="md",className:n="",children:s,...r}){return a.jsx("button",{className:`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${lx[e]} ${cx[t]} ${n}`,...r,children:s})}const dx=/^#[0-9A-Fa-f]{6}$/;function Fr(e){return dx.test(e)}function ux(e){const t=e.trim();return t.startsWith("#")?t:`#${t}`}function px(){var N,k,j,I;const e=Sn(),{state:t,setBranding:n}=os(),{t:s}=se(),r=s.studioSdk,o=t.manifest,i=y.useMemo(()=>o?eo(o.website.themeKey).colors.primary[500]:"#6C3BFF",[o]),l=y.useMemo(()=>o?{...rx(o),...o.branding}:{},[o]),c=y.useMemo(()=>o?Cm(o):null,[o]),[d,u]=y.useState(l),[m,f]=y.useState(()=>l.primaryColorHex??i),[b,w]=y.useState(!1);if(!o||!c)return e("/"),null;const x=r.photos,S=(M,D)=>{u(O=>({...O,photoOverrides:{...O.photoOverrides,[M]:D}}))},p=(M,D,O)=>{u(ke=>{const Me=ke.photoOverrides??{},T=[...Me[M]??[]];return O===void 0?delete T[D]:T[D]=O,{...ke,photoOverrides:{...Me,[M]:T}}})},h=(M,D)=>{M&&yd(M).then(D).catch(()=>{const O=new FileReader;O.onload=()=>{typeof O.result=="string"&&D(O.result)},O.readAsDataURL(M)})},g=(M,D)=>{u(O=>({...O,[M]:D}))},v=M=>{M&&yd(M,800,.9).then(D=>u(O=>({...O,logoDataUrl:D}))).catch(()=>{const D=new FileReader;D.onload=()=>{typeof D.result=="string"&&u(O=>({...O,logoDataUrl:D.result}))},D.readAsDataURL(M)})},C=M=>{f(M),w(!1)},E=M=>{const D=ux(M);f(D),w(D.length>0&&!Fr(D))},_=()=>{if(!Fr(m)){w(!0);return}n({...d,primaryColorHex:m}),e("/manifest")},A=(()=>{const M=m.replace("#","");if(M.length!==6)return"#ffffff";const D=parseInt(M.slice(0,2),16),O=parseInt(M.slice(2,4),16),ke=parseInt(M.slice(4,6),16);return(.299*D+.587*O+.114*ke)/255>.55?"#111827":"#ffffff"})();return a.jsxs("div",{className:"min-h-screen bg-factory-bg",children:[a.jsx("header",{className:"fixed top-0 left-0 right-0 z-50 bg-factory-dark/95 backdrop-blur-md border-b border-white/5",children:a.jsxs("div",{className:"max-w-6xl mx-auto px-6 h-16 flex items-center justify-between",children:[a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:"w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-glow-sm",children:a.jsx(pr,{className:"w-4 h-4 text-white"})}),a.jsx("span",{className:"text-white font-bold text-lg tracking-tight",children:"Factory Website+CRM"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx("div",{className:"hidden sm:flex items-center gap-2 text-xs text-white/40",children:r.badge}),a.jsx(Yl,{})]})]})}),a.jsx("div",{className:"bg-dark-surface pt-16",children:a.jsxs("div",{className:"max-w-6xl mx-auto px-6 py-12 text-center",children:[a.jsx("h1",{className:"text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 animate-fade-up",children:r.title}),a.jsx("p",{className:"text-white/50 text-base max-w-xl mx-auto leading-relaxed animate-fade-up delay-150",children:r.subtitle})]})}),a.jsxs("main",{className:"max-w-6xl mx-auto px-6 py-10 pb-16 space-y-6",children:[a.jsxs("div",{className:"grid md:grid-cols-2 gap-6",children:[a.jsxs(at,{icon:a.jsx(cm,{className:"w-4 h-4"}),iconColor:"#6C3BFF",title:r.sections.brandContacts,fullWidth:!0,children:[a.jsx("p",{className:"text-xs text-slate-500 mb-4",children:r.sections.brandContactsSub}),a.jsxs("div",{className:"grid sm:grid-cols-2 gap-4",children:[a.jsx(jn,{label:r.fields.businessName,children:a.jsx(Ae,{value:d.businessNameOverride??"",onChange:M=>g("businessNameOverride",M),placeholder:r.placeholders.businessName})}),a.jsx(jn,{label:r.fields.phone,children:a.jsx(Ae,{value:d.phoneOverride??"",onChange:M=>g("phoneOverride",M),placeholder:r.placeholders.phone})}),a.jsx(jn,{label:r.fields.whatsapp,children:a.jsx(Ae,{value:d.whatsappOverride??"",onChange:M=>g("whatsappOverride",M),placeholder:r.placeholders.whatsapp})}),a.jsx(jn,{label:r.fields.email,children:a.jsx(Ae,{value:d.emailOverride??"",onChange:M=>g("emailOverride",M),placeholder:r.placeholders.email,type:"email"})})]})]}),a.jsxs(at,{icon:a.jsx(t0,{className:"w-4 h-4"}),iconColor:"#00D4FF",title:r.sections.logo,children:[a.jsx("p",{className:"text-xs text-slate-500 mb-4",children:r.sections.logoSub}),a.jsxs("div",{className:"space-y-4",children:[a.jsxs("label",{className:"flex items-center justify-center gap-2 w-full px-4 py-6 rounded-xl border-2 border-dashed border-factory-border bg-factory-bg hover:border-primary/40 cursor-pointer transition-colors",children:[a.jsx($l,{className:"w-5 h-5 text-slate-400"}),a.jsx("span",{className:"text-sm font-semibold text-slate-600",children:r.logo.upload}),a.jsx("input",{type:"file",accept:"image/*",className:"hidden",onChange:M=>{var D;return v((D=M.target.files)==null?void 0:D[0])}})]}),d.logoDataUrl&&a.jsxs("div",{className:"flex items-center gap-4 p-4 rounded-xl border border-factory-border bg-factory-bg",children:[a.jsx("img",{src:d.logoDataUrl,alt:r.logo.previewAlt,className:"h-16 w-auto max-w-[160px] object-contain rounded-lg bg-white p-2"}),a.jsxs(jm,{variant:"outline",size:"sm",onClick:()=>u(M=>({...M,logoDataUrl:void 0})),children:[a.jsx(Nn,{className:"w-4 h-4"}),r.logo.remove]})]})]})]}),a.jsxs(at,{icon:a.jsx(l0,{className:"w-4 h-4"}),iconColor:"#FF6D00",title:r.sections.color,fullWidth:!0,children:[a.jsx("p",{className:"text-xs text-slate-500 mb-4",children:r.sections.colorSub}),a.jsxs("div",{className:"flex flex-col sm:flex-row gap-6 items-start",children:[a.jsxs("div",{className:"flex-1 space-y-4 w-full",children:[a.jsx(jn,{label:r.fields.primaryColor,children:a.jsx("input",{type:"color",value:Fr(m)?m:i,onChange:M=>C(M.target.value),className:"w-full h-12 rounded-xl border-2 border-factory-border cursor-pointer bg-white p-1"})}),a.jsx(jn,{label:r.fields.hexValue,error:b?r.validation.invalidHex:void 0,children:a.jsx(Ae,{value:m,onChange:E,placeholder:"#6C3BFF",error:b})})]}),a.jsxs("div",{className:"shrink-0",children:[a.jsx("p",{className:"text-xs font-semibold text-slate-500 mb-2",children:r.colorPreviewLabel}),a.jsx("div",{className:"w-28 h-28 rounded-2xl border border-factory-border flex items-center justify-center shadow-card",style:{backgroundColor:Fr(m)?m:i},children:a.jsx("span",{className:"text-3xl font-bold",style:{color:A},children:r.colorPreview})})]})]})]}),a.jsxs(at,{icon:a.jsx(Gb,{className:"w-4 h-4"}),iconColor:"#00C853",title:r.sections.photos,fullWidth:!0,children:[a.jsx("p",{className:"text-xs text-slate-500 mb-6",children:r.sections.photosSub}),a.jsxs("div",{className:"grid md:grid-cols-2 gap-6",children:[a.jsx(Lr,{label:x.hero,previewUrl:((N=d.photoOverrides)==null?void 0:N.hero)??c.hero,hasOverride:!!((k=d.photoOverrides)!=null&&k.hero),uploadLabel:x.upload,resetLabel:x.resetStock,previewAlt:x.previewAlt,onUpload:M=>h(M,D=>S("hero",D)),onReset:()=>S("hero",void 0)}),a.jsx(Lr,{label:x.about,previewUrl:((j=d.photoOverrides)==null?void 0:j.about)??c.about,hasOverride:!!((I=d.photoOverrides)!=null&&I.about),uploadLabel:x.upload,resetLabel:x.resetStock,previewAlt:x.previewAlt,onUpload:M=>h(M,D=>S("about",D)),onReset:()=>S("about",void 0)})]}),a.jsxs("div",{className:"mt-8",children:[a.jsx("h4",{className:"text-sm font-bold text-factory-dark mb-4",children:x.gallery}),a.jsx("div",{className:"grid sm:grid-cols-2 lg:grid-cols-4 gap-4",children:c.gallery.map((M,D)=>{var O,ke,Me,T;return a.jsx(Lr,{label:x.slot.replace("{n}",String(D+1)),previewUrl:((ke=(O=d.photoOverrides)==null?void 0:O.gallery)==null?void 0:ke[D])??M,hasOverride:!!((T=(Me=d.photoOverrides)==null?void 0:Me.gallery)!=null&&T[D]),uploadLabel:x.upload,resetLabel:x.resetStock,previewAlt:x.previewAlt,compact:!0,onUpload:F=>h(F,L=>p("gallery",D,L)),onReset:()=>p("gallery",D,void 0)},`gallery-${D}`)})})]}),a.jsxs("div",{className:"mt-8",children:[a.jsx("h4",{className:"text-sm font-bold text-factory-dark mb-4",children:x.services}),a.jsx("div",{className:"grid sm:grid-cols-3 gap-4",children:c.services.map((M,D)=>{var O,ke,Me,T;return a.jsx(Lr,{label:x.slot.replace("{n}",String(D+1)),previewUrl:((ke=(O=d.photoOverrides)==null?void 0:O.services)==null?void 0:ke[D])??M,hasOverride:!!((T=(Me=d.photoOverrides)==null?void 0:Me.services)!=null&&T[D]),uploadLabel:x.upload,resetLabel:x.resetStock,previewAlt:x.previewAlt,compact:!0,onUpload:F=>h(F,L=>p("services",D,L)),onReset:()=>p("services",D,void 0)},`services-${D}`)})})]})]})]}),a.jsx("div",{className:"flex justify-end pt-4",children:a.jsxs(km,{type:"button",onClick:_,children:[r.cta.saveAndContinue,a.jsx(lm,{className:"w-5 h-5 transition-transform group-hover:translate-x-1"})]})})]})]})}function Lr({label:e,previewUrl:t,hasOverride:n,uploadLabel:s,resetLabel:r,previewAlt:o,compact:i,onUpload:l,onReset:c}){return a.jsxs("div",{className:"rounded-xl border border-factory-border bg-factory-bg p-4 space-y-3",children:[a.jsx("p",{className:"text-sm font-semibold text-slate-700",children:e}),a.jsx("img",{src:t,alt:o,className:`w-full object-cover rounded-lg border border-factory-border bg-white ${i?"h-24":"h-32"}`}),a.jsxs("label",{className:"flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl border border-factory-border bg-white hover:border-primary/40 cursor-pointer transition-colors",children:[a.jsx($l,{className:"w-4 h-4 text-slate-400"}),a.jsx("span",{className:"text-xs font-semibold text-slate-600",children:s}),a.jsx("input",{type:"file",accept:"image/*",className:"hidden",onChange:d=>{var u;l((u=d.target.files)==null?void 0:u[0]),d.target.value=""}})]}),n&&a.jsxs(jm,{variant:"outline",size:"sm",className:"w-full",onClick:c,children:[a.jsx(Nn,{className:"w-4 h-4"}),r]})]})}function jn({label:e,error:t,children:n}){return a.jsxs("div",{children:[a.jsx("label",{className:"block text-sm font-semibold text-slate-700 mb-2",children:e}),n,t&&a.jsx("p",{className:"mt-1.5 text-xs text-red-600",children:t})]})}const mx=`import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isProductMode } from './lib/bootstrap';
import QuestionnairePage from './pages/QuestionnairePage';
import StudioSdkPage from './pages/StudioSdkPage';
import ManifestPreviewPage from './pages/ManifestPreviewPage';
import WebsiteDemoPage from './pages/WebsiteDemoPage';
import CrmDemoPage from './pages/CrmDemoPage';

function StudioRoutes() {
  return (
    <Routes>
      <Route path="/" element={<QuestionnairePage />} />
      <Route path="/studio" element={<StudioSdkPage />} />
      <Route path="/manifest" element={<ManifestPreviewPage />} />
      <Route path="/website-demo" element={<WebsiteDemoPage />} />
      <Route path="/crm-demo" element={<CrmDemoPage />} />
      <Route path="/website" element={<Navigate to="/website-demo" replace />} />
      <Route path="/crm" element={<Navigate to="/crm-demo" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ProductRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WebsiteDemoPage />} />
      <Route path="/website" element={<WebsiteDemoPage />} />
      <Route path="/website-demo" element={<WebsiteDemoPage />} />
      <Route path="/crm" element={<CrmDemoPage />} />
      <Route path="/crm-demo" element={<CrmDemoPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const product = isProductMode();
  return (
    <BrowserRouter>
      {product ? <ProductRoutes /> : <StudioRoutes />}
    </BrowserRouter>
  );
}
`,fx=`import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'info' | 'error';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const VARIANTS: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: '#dcfce7', text: '#15803d' },
  warning: { bg: '#fef3c7', text: '#b45309' },
  info:    { bg: '#dbeafe', text: '#1d4ed8' },
  error:   { bg: '#fee2e2', text: '#b91c1c' },
};

export function Badge({ variant = 'info', children, className = '' }: BadgeProps) {
  const s = VARIANTS[variant];
  return (
    <span
      className={\`px-2 py-0.5 rounded text-xs font-semibold \${className}\`}
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' }) {
  const map: Record<string, BadgeVariant> = {
    Confirmed: 'success',
    Pending:   'warning',
    Completed: 'info',
    Cancelled: 'error',
  };
  return <Badge variant={map[status] as BadgeVariant}>{status}</Badge>;
}
`,hx=`import { useState, useRef } from 'react';
import { CheckCircle2, MessageCircle, Mail, Calendar, Star, LayoutDashboard } from 'lucide-react';
import type { Manifest } from '../../types/manifest';
import type { ThemePalette } from '../../pages/website-demo/themeHelpers';
import type { SectorContent } from '../../pages/website-demo/sectorContent';
import { useProjectStore } from '../../store/projectStore';
import { useTranslations } from '../../lib/i18n';

interface BookingCardProps {
  manifest: Manifest;
  palette: ThemePalette;
  content: SectorContent;
}

function FlowCard({ icon, label, status, statusColor, children }: {
  icon: React.ReactNode; label: string; status: string; statusColor: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8">
        {icon}
        <span className="text-xs font-semibold text-white/80 flex-1">{label}</span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: statusColor + '22', color: statusColor }}
        >
          {status}
        </span>
      </div>
      <div className="px-4 py-3 space-y-1">{children}</div>
    </div>
  );
}

export function BookingCard({ manifest, palette, content }: BookingCardProps) {
  const [sent, setSent] = useState(false);
  const { addBooking } = useProjectStore();
  const { t } = useTranslations();
  const s = t.sections.booking;

  const nameRef    = useRef<HTMLInputElement>(null);
  const phoneRef   = useRef<HTMLInputElement>(null);
  const dateRef    = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const reviewStep   = manifest.crm.reviewFlow.steps.find(st => st.stepKey === 'google_review_request');
  const waEnabled    = manifest.crm.reviewFlow.steps.some(st => st.channel === 'whatsapp' && st.enabled);
  const emailEnabled = manifest.crm.reviewFlow.steps.some(st => st.channel === 'email' && st.enabled);
  const serviceName  = content.services[0]?.name ?? 'Appointment';

  const handleConfirm = () => {
    const name    = nameRef.current?.value.trim()  || 'Anonymous';
    const phone   = phoneRef.current?.value.trim() || '—';
    const date    = dateRef.current?.value          || today;
    const service = serviceRef.current?.value       || serviceName;
    addBooking({ name, phone, date, service, status: 'Confirmed' });
    setSent(true);
  };

  return (
    <section id="booking" className="py-24 relative overflow-hidden" style={{ fontFamily: palette.font }}>
      <div className="absolute inset-0" style={{ backgroundColor: palette.primary, opacity: 0.92 }} />
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 60%)' }}
      />

      <div className="relative max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70 mb-3">{s.eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">{content.cta}</h2>
          <p className="text-white/70 mt-3 text-sm">{content.hours} · {content.openDays}</p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{s.confirmed}</h3>
              <p className="text-white/60 text-sm mt-1">{s.confirmedSub}</p>
            </div>

            <FlowCard
              icon={<LayoutDashboard className="w-4 h-4 text-[#00C853]" />}
              label={s.crmRecord}
              status={s.status.done}
              statusColor="#00C853"
            >
              <p className="text-[11px] text-white/60">
                <span className="font-semibold text-white/80">Alex Johnson</span> · {serviceName} · {today} 15:30
              </p>
              <p className="text-[11px] text-white/40">
                Source: Online Booking · Notification channels: {manifest.crm.notificationChannels.join(', ')}
              </p>
            </FlowCard>

            {waEnabled && (
              <FlowCard
                icon={<MessageCircle className="w-4 h-4 text-[#25D366]" />}
                label={s.whatsappSent}
                status={s.status.delivered}
                statusColor="#25D366"
              >
                <p className="text-[11px] text-white/60 italic">
                  "Hi Alex! 👋 Your appointment at{' '}
                  <strong className="text-white/80">{manifest.business.name}</strong> is confirmed for{' '}
                  {today} at 15:30. Service: {serviceName}."
                </p>
              </FlowCard>
            )}

            {emailEnabled && (
              <FlowCard
                icon={<Mail className="w-4 h-4 text-[#00D4FF]" />}
                label={s.emailSent}
                status={s.status.deliveredEmail}
                statusColor="#00D4FF"
              >
                <p className="text-[11px] text-white/60 italic">
                  "Booking Confirmed ✓ — {manifest.business.name} · {serviceName} · {today}"
                </p>
              </FlowCard>
            )}

            {reviewStep?.enabled && (
              <FlowCard
                icon={<Star className="w-4 h-4 text-[#FFB300]" />}
                label={s.reviewScheduled}
                status={\`+\${reviewStep.delayHours}h\`}
                statusColor="#FFB300"
              >
                <p className="text-[11px] text-white/60 italic">
                  "Hi Alex! ⭐ How was your experience at {manifest.business.name}? Leave us a Google Review →"
                </p>
                <p className="text-[10px] text-white/30">
                  Sends automatically {reviewStep.delayHours}h after your visit via {reviewStep.channel}
                </p>
              </FlowCard>
            )}

            <button
              onClick={() => setSent(false)}
              className="w-full py-2.5 text-sm text-white/50 hover:text-white transition-colors text-center"
            >
              {s.submitAnother}
            </button>
          </div>
        ) : (
          <div className="p-8" style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: palette.radius }}>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <input
                ref={nameRef}
                type="text"
                placeholder={s.yourName}
                className="w-full px-4 py-3 bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors"
                style={{ borderRadius: '0.375rem' }}
              />
              <input
                ref={phoneRef}
                type="tel"
                placeholder={s.phoneNumber}
                className="w-full px-4 py-3 bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors"
                style={{ borderRadius: '0.375rem' }}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <input
                ref={dateRef}
                type="date"
                placeholder={s.preferredDate}
                className="w-full px-4 py-3 bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors"
                style={{ borderRadius: '0.375rem' }}
              />
              <select
                ref={serviceRef}
                className="w-full px-4 py-3 bg-white/15 border border-white/25 text-white text-sm focus:outline-none focus:border-white/60 transition-colors"
                style={{ borderRadius: palette.radius }}
                defaultValue=""
              >
                <option value="" disabled className="text-black">{s.selectService}</option>
                {content.services.map(sv => (
                  <option key={sv.name} value={sv.name} className="text-black">{sv.name}</option>
                ))}
              </select>
            </div>
            <textarea
              placeholder={t.placeholders.notes}
              rows={3}
              className="w-full px-4 py-3 bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors resize-none mb-4"
              style={{ borderRadius: palette.radius }}
            />
            <button
              onClick={handleConfirm}
              className="w-full py-4 font-bold text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ backgroundColor: 'white', color: palette.primary, borderRadius: palette.radius }}
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              {s.confirmBooking}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
`,gx=`import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:opacity-90 hover:-translate-y-0.5 shadow-glow-sm',
  ghost:   'glass text-white/60 hover:text-white hover:bg-white/10',
  outline: 'border border-factory-border bg-white text-slate-700 hover:border-primary/40 hover:text-primary',
};

const SIZE: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-sm rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={\`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed \${VARIANT[variant]} \${SIZE[size]} \${className}\`}
      {...props}
    >
      {children}
    </button>
  );
}
`,bx=`import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface CTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function CTA({ className = '', children, ...props }: CTAProps) {
  return (
    <button
      className={\`group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-bold text-base transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-glow hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 overflow-hidden \${className}\`}
      style={{ background: 'linear-gradient(135deg, #6C3BFF 0%, #00D4FF 100%)' }}
      {...props}
    >
      <span className="absolute inset-0 bg-card-shine pointer-events-none" />
      {children}
    </button>
  );
}
`,yx=`import type { ReactNode } from 'react';

interface CardProps {
  icon: ReactNode;
  iconColor: string;
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function Card({ icon, iconColor, title, children, fullWidth, className = '' }: CardProps) {
  return (
    <div
      className={\`bg-white rounded-2xl border border-factory-border p-5 shadow-card hover:shadow-card-hover transition-shadow animate-fade-up \${
        fullWidth ? 'col-span-full' : ''
      } \${className}\`}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: \`\${iconColor}18\`, color: iconColor }}
        >
          {icon}
        </div>
        <h3 className="text-sm font-bold text-factory-dark">{title}</h3>
      </div>
      {children}
    </div>
  );
}
`,xx=`import type { ElementType } from 'react';
import type { ThemePalette } from '../../pages/website-demo/themeHelpers';

interface ContactCardProps {
  icon: ElementType;
  label: string;
  value: string;
  href: string | null;
  palette: ThemePalette;
}

export function ContactCard({ icon: Icon, label, value, href, palette }: ContactCardProps) {
  const isExternal = href && !href.startsWith('mailto:') && !href.startsWith('tel:');
  const linkProps = href
    ? { href, ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
    : undefined;

  const inner = (
    <>
      <div
        className="w-10 h-10 flex items-center justify-center shrink-0"
        style={{ backgroundColor: palette.primaryLight, borderRadius: palette.radius }}
      >
        <Icon className="w-5 h-5" style={{ color: palette.primary }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: palette.fgMuted }}>
          {label}
        </p>
        <p className="text-sm font-semibold truncate" style={{ color: palette.fg }}>{value}</p>
      </div>
    </>
  );

  const sharedStyle = {
    backgroundColor: palette.cardBg,
    border: \`1px solid \${palette.cardBorder}\`,
    borderRadius: palette.radius,
    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
  };

  if (linkProps) {
    return (
      <a
        {...linkProps}
        className="flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5"
        style={sharedStyle}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4" style={sharedStyle}>
      {inner}
    </div>
  );
}
`,vx=`import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  label: string;
  sub: string;
}

export function EmptyState({ icon, label, sub }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-6">
      {icon}
      <p className="font-semibold text-slate-500 text-sm">{label}</p>
      <p className="text-xs text-slate-400 max-w-xs">{sub}</p>
    </div>
  );
}
`,wx=`import type { Manifest } from '../../types/manifest';
import type { ThemePalette } from '../../pages/website-demo/themeHelpers';
import type { SectorContent } from '../../pages/website-demo/sectorContent';
import { useTranslations } from '../../lib/i18n';

interface FooterProps {
  manifest: Manifest;
  palette: ThemePalette;
  content: SectorContent;
}

export function Footer({ manifest, palette, content }: FooterProps) {
  const { t } = useTranslations();
  const s = t.sections.footer;
  const year = new Date().getFullYear();
  const footerBg = palette.isDark ? palette.bg : '#111827';
  const footerFg = '#f9fafb';
  const footerMuted = 'rgba(249,250,251,0.45)';

  return (
    <footer id="footer" className="py-16" style={{ backgroundColor: footerBg, color: footerFg, fontFamily: palette.font }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-3">{manifest.business.name}</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: footerMuted }}>{content.tagline}</p>
            <p className="text-xs" style={{ color: footerMuted }}>{manifest.business.city}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: footerMuted }}>{s.services}</h4>
            <ul className="space-y-2">
              {content.services.map(sv => (
                <li key={sv.name}>
                  <a href="#services" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>{sv.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: footerMuted }}>{s.contact}</h4>
            <ul className="space-y-2 text-sm" style={{ color: footerMuted }}>
              {manifest.business.phone && (
                <li><a href={\`tel:\${manifest.business.phone}\`} className="hover:text-white transition-colors">{manifest.business.phone}</a></li>
              )}
              {manifest.business.email && (
                <li><a href={\`mailto:\${manifest.business.email}\`} className="hover:text-white transition-colors">{manifest.business.email}</a></li>
              )}
              <li>{content.openDays} · {content.hours}</li>
            </ul>
          </div>
        </div>
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs" style={{ color: footerMuted }}>
            © {year} {manifest.business.name}. {s.rights}
          </p>
          <p className="text-xs" style={{ color: footerMuted }}>
            {manifest.business.city} · {manifest.business.language.toUpperCase()}
          </p>
        </div>
      </div>
    </footer>
  );
}
`,kx=`import type { ImageSourceDefinition } from '../../lib/imageSources';
import type { ThemePalette } from '../../pages/website-demo/themeHelpers';
import { useTranslations } from '../../lib/i18n';
import { SectionHeader } from './SectionHeader';

interface GalleryProps {
  palette: ThemePalette;
  images: ImageSourceDefinition;
}

export function Gallery({ palette, images }: GalleryProps) {
  const { t } = useTranslations();
  const s = t.sections.gallery;
  const allImages = [...images.gallery];
  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: palette.bgAlt, color: palette.fg, fontFamily: palette.font }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} palette={palette} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {allImages.map((url, i) => (
            <div
              key={i}
              className={\`overflow-hidden group \${i === 0 ? 'row-span-2 col-span-2' : ''}\`}
              style={{ borderRadius: palette.radius }}
            >
              <img
                src={url}
                alt={\`Gallery \${i + 1}\`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ minHeight: i === 0 ? '300px' : '160px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,Sx=`import { Phone, Calendar } from 'lucide-react';
import type { Manifest } from '../../types/manifest';
import type { ImageSourceDefinition } from '../../lib/imageSources';
import type { ThemePalette } from '../../pages/website-demo/themeHelpers';
import type { SectorContent } from '../../pages/website-demo/sectorContent';
import { useTranslations } from '../../lib/i18n';

interface HeroProps {
  manifest: Manifest;
  palette: ThemePalette;
  content: SectorContent;
  images: ImageSourceDefinition;
}

export function Hero({ manifest, palette, content, images }: HeroProps) {
  const { t } = useTranslations();
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={images.hero} alt={manifest.business.name} className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: palette.isDark
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.8) 100%)'
              : 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />
      </div>
      <div className="relative max-w-5xl mx-auto px-6 text-center text-white">
        <p
          className="text-sm font-semibold uppercase tracking-[0.25em] mb-4 opacity-80"
          style={{ fontFamily: palette.font }}
        >
          {manifest.business.city}
        </p>
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: palette.font }}
        >
          {manifest.business.name}
        </h1>
        <p
          className="text-xl sm:text-2xl opacity-85 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: palette.font }}
        >
          {content.tagline}
        </p>
        <p
          className="text-base opacity-65 max-w-xl mx-auto mb-10"
          style={{ fontFamily: palette.font }}
        >
          {content.subTagline}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#booking"
            className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white rounded-lg transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
            style={{ backgroundColor: palette.primary, borderRadius: palette.radius, fontFamily: palette.font }}
          >
            <Calendar className="w-5 h-5" />
            {content.cta}
          </a>
          {manifest.business.phone && (
            <a
              href={\`tel:\${manifest.business.phone}\`}
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold border-2 border-white/60 text-white rounded-lg transition-all hover:bg-white/15 hover:-translate-y-0.5"
              style={{ borderRadius: palette.radius, fontFamily: palette.font }}
            >
              <Phone className="w-5 h-5" />
              {t.websiteDemo.call}
            </a>
          )}
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-6 h-10 rounded-full border-2 border-white/60 flex items-start justify-center pt-2">
            <div className="w-1.5 h-2.5 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
`,Nx=`import type { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
  error?: boolean;
}

export function Input({ onChange, error, className = '', ...props }: InputProps) {
  return (
    <input
      onChange={e => onChange?.(e.target.value)}
      className={\`w-full px-4 py-3 rounded-xl border-2 text-sm text-slate-800 placeholder-slate-300 transition-all duration-150 focus:outline-none \${
        error
          ? 'border-red-400 bg-red-50/50 focus:border-red-500'
          : 'border-factory-border bg-white focus:border-primary focus:shadow-glow-sm'
      } \${className}\`}
      {...props}
    />
  );
}
`,Cx=`import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export function Loader({ size = 16, color, className = '' }: LoaderProps) {
  return (
    <Loader2
      className={\`animate-spin \${className}\`}
      style={{ width: size, height: size, color }}
    />
  );
}

export function SpinnerRing({ className = '' }: { className?: string }) {
  return (
    <span
      className={\`inline-block rounded-full border-2 border-white/40 border-t-white animate-spin \${className}\`}
      style={{ width: 16, height: 16 }}
    />
  );
}
`,jx=`import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, icon, onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-bold text-sm text-slate-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
`,Rx=`import { useState } from 'react';
import { Phone, Calendar, Menu, X } from 'lucide-react';
import type { Manifest, WebsiteSectionKey } from '../../types/manifest';
import type { ThemePalette } from '../../pages/website-demo/themeHelpers';
import { getDisplayBusinessName, getDisplayLogo, getDisplayPhone } from '../../lib/brandingDefaults';

interface NavbarProps {
  manifest: Manifest;
  palette: ThemePalette;
  navLinks: WebsiteSectionKey[];
  navLabels: Partial<Record<WebsiteSectionKey, string>>;
  callLabel: string;
  bookLabel: string;
}

export function Navbar({ manifest, palette, navLinks, navLabels, callLabel, bookLabel }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const businessName = getDisplayBusinessName(manifest);
  const logoUrl = getDisplayLogo(manifest);
  const phone = getDisplayPhone(manifest);

  return (
    <nav
      className="sticky top-11 z-40 border-b"
      style={{
        backgroundColor: palette.isDark ? \`\${palette.bg}f0\` : \`\${palette.bg}f5\`,
        borderColor: palette.cardBorder,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2.5 font-bold text-lg" style={{ color: palette.fg }}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt={businessName}
              className="h-9 w-auto max-w-[140px] object-contain"
            />
          )}
          <span>{businessName}</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(key => (
            <a
              key={key}
              href={\`#\${key}\`}
              className="px-3 py-2 text-sm font-medium transition-colors"
              style={{ color: palette.fgMuted, borderRadius: palette.radius }}
              onMouseEnter={e => (e.currentTarget.style.color = palette.primary)}
              onMouseLeave={e => (e.currentTarget.style.color = palette.fgMuted)}
            >
              {navLabels[key]}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {phone && (
            <a
              href={\`tel:\${phone}\`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border transition-all hover:opacity-80"
              style={{ borderColor: palette.cardBorder, color: palette.fg, borderRadius: palette.radius }}
            >
              <Phone className="w-3.5 h-3.5" /> {callLabel}
            </a>
          )}
          <a
            href="#booking"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: palette.primary, color: palette.primaryFg, borderRadius: palette.radius }}
          >
            <Calendar className="w-3.5 h-3.5" /> {bookLabel}
          </a>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} style={{ color: palette.fg }}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div
          className="md:hidden border-t px-6 py-3 space-y-1"
          style={{ borderColor: palette.cardBorder, backgroundColor: palette.cardBg }}
        >
          {navLinks.map(key => (
            <a
              key={key}
              href={\`#\${key}\`}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium"
              style={{ color: palette.fg }}
            >
              {navLabels[key]}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
`,Ex=`import type { ReactNode } from 'react';

interface SectionProps {
  number: string;
  title: string;
  subtitle: string;
  required?: boolean;
  children: ReactNode;
}

export function Section({ number, title, subtitle, required, children }: SectionProps) {
  return (
    <div className="mb-10 animate-fade-up">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-xs font-mono font-bold text-primary/50 tracking-widest">{number}</span>
        <div>
          <h2 className="text-lg font-bold text-factory-dark">
            {title}{required && <span className="text-primary/60 ml-1 text-sm">*</span>}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
`,_x=`import type { ReactNode } from 'react';
import type { ThemePalette } from '../../pages/website-demo/themeHelpers';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  palette: ThemePalette;
  spacing?: 'normal' | 'tight';
  children?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  palette,
  spacing = 'normal',
  children,
}: SectionHeaderProps) {
  return (
    <div className={\`text-center \${spacing === 'tight' ? 'mb-10' : 'mb-14'}\`}>
      <p
        className="text-sm font-bold uppercase tracking-[0.2em] mb-3"
        style={{ color: palette.primary }}
      >
        {eyebrow}
      </p>
      <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
`,Mx=`import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: ReactNode;
}

export function Select({ error, className = '', children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={\`w-full appearance-none px-4 py-3 pr-10 rounded-xl border-2 bg-white text-slate-800 text-sm font-medium focus:outline-none transition-all cursor-pointer \${
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-factory-border focus:border-primary focus:shadow-glow-sm'
        } \${className}\`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}
`,Tx=`import type { ThemePalette } from '../../pages/website-demo/themeHelpers';

interface Service {
  name: string;
  desc: string;
  price: string;
}

interface ServiceCardProps {
  service: Service;
  imageUrl?: string;
  palette: ThemePalette;
  bookLabel: string;
}

export function ServiceCard({ service, imageUrl, palette, bookLabel }: ServiceCardProps) {
  return (
    <div
      className="group overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: palette.cardBg,
        border: \`1px solid \${palette.cardBorder}\`,
        borderRadius: palette.radius,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2" style={{ fontFamily: palette.font }}>{service.name}</h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: palette.fgMuted }}>{service.desc}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm" style={{ color: palette.primary }}>{service.price}</span>
          <a
            href="#booking"
            className="text-xs font-semibold px-3 py-1.5 transition-all hover:opacity-80"
            style={{ backgroundColor: palette.primaryLight, color: palette.primary, borderRadius: palette.radius }}
          >
            {bookLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
`,Ax=`import type { ElementType } from 'react';

interface StatisticCardProps {
  label: string;
  value: number | string;
  icon: ElementType;
  color: string;
  bg: string;
}

export function StatisticCard({ label, value, icon: Icon, color, bg }: StatisticCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: bg }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
`,Px=`import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={\`w-full px-4 py-3 rounded-xl border-2 text-sm text-slate-800 placeholder-slate-300 transition-all duration-150 focus:outline-none resize-none \${
        error
          ? 'border-red-400 bg-red-50/50 focus:border-red-500'
          : 'border-factory-border bg-white focus:border-primary focus:shadow-glow-sm'
      } \${className}\`}
      {...props}
    />
  );
}
`,Dx=`{
  "header": {
    "tagline": "Engine für Web-Studios"
  },
  "hero": {
    "title": "Website + CRM + Online-Buchung",
    "titleAccent": "+ Bewertungen bei Google Maps",
    "subtitle": "Engine für Web-Studios: Fragebogen → Manifest → Build → Demo → Zahlung → fertiges Projekt.",
    "flowSteps": ["Google Maps", "Website", "Online-Buchung", "CRM", "WhatsApp", "E-Mail", "Bewertungsanfrage", "Google Reviews", "Neue Kunden"]
  },
  "formSections": {
    "01": { "title": "Branche", "subtitle": "Wählen Sie die Branche, die am besten zum Geschäft des Kunden passt." },
    "02": { "title": "Geschäftsdaten", "subtitle": "Grundlegende Informationen zum Kundenunternehmen." },
    "03": { "title": "Kontaktdaten", "subtitle": "Wer ist der Hauptansprechpartner für dieses Projekt?" },
    "04": { "title": "Studio-Einstellungen", "subtitle": "Ihre Agenturdetails und Projekteigentumseinstellungen." }
  },
  "fields": {
    "businessName": "Unternehmensname",
    "city": "Stadt",
    "websiteLanguage": "Website-Sprache",
    "contactPerson": "Kontaktperson",
    "phone": "Telefon",
    "whatsapp": "WhatsApp",
    "email": "E-Mail",
    "agencyBrand": "Agentur / Studio",
    "ownershipMode": "Eigentumsmodell"
  },
  "placeholders": {
    "businessName": "z. B. Ristorante Bella Vita",
    "city": "z. B. Berlin",
    "contactPerson": "z. B. Marco Rossi",
    "phone": "+49 30 12345678",
    "whatsapp": "+49 171 9876543",
    "email": "hallo@bellavita.de",
    "agencyBrand": "z. B. Bright Digital Agency",
    "notes": "Zusätzliche Hinweise (optional)"
  },
  "ownership": {
    "client_owned": { "label": "Kundeneigentum", "desc": "Kunde verwaltet sein Projekt" },
    "studio_owned": { "label": "Studio-Eigentum", "desc": "Studio behält volle Kontrolle" },
    "white_label":  { "label": "White Label",     "desc": "Studio-Brand, Auslieferung an Kunden" }
  },
  "validation": {
    "nameRequired": "Unternehmensname ist erforderlich",
    "cityRequired": "Stadt ist erforderlich",
    "sectorRequired": "Bitte wählen Sie eine Branche",
    "contactRequired": "Kontaktperson ist erforderlich",
    "phoneRequired": "Telefon ist erforderlich",
    "emailRequired": "E-Mail ist erforderlich",
    "emailInvalid": "Ungültige E-Mail-Adresse",
    "studioRequired": "Studioname ist erforderlich",
    "fixFields": "Bitte korrigieren Sie die markierten Felder."
  },
  "cta": {
    "createDemo": "Kostenlose Demo erstellen",
    "creating": "Demo wird erstellt…"
  },
  "customBadge": "custom",
  "studioSdk": {
    "badge": "Studio SDK — Anpassungspanel",
    "title": "Studio SDK",
    "subtitle": "Passen Sie Marke und Kontakte des Kunden an, bevor Sie das Manifest ansehen — ohne Code.",
    "sections": {
      "brandContacts": "Marke & Kontakte",
      "brandContactsSub": "Bearbeiten Sie Unternehmensname und Kontaktdaten für die Kundenwebsite.",
      "logo": "Logo",
      "logoSub": "Laden Sie das Kundenlogo hoch (optional). PNG oder SVG empfohlen.",
      "color": "Markenfarbe",
      "colorSub": "Überschreiben Sie die Standard-Designfarbe mit der Markenfarbe des Kunden.",
      "photos": "Fotos",
      "photosSub": "Ersetzen Sie Stockfotos durch eigene Bilder des Kunden. Nicht geänderte Slots behalten die Standardfotos der Branche."
    },
    "fields": {
      "businessName": "Unternehmensname",
      "phone": "Telefon",
      "whatsapp": "WhatsApp",
      "email": "E-Mail",
      "primaryColor": "Primärfarbe",
      "hexValue": "HEX-Wert"
    },
    "placeholders": {
      "businessName": "z. B. Ristorante Bella Vita",
      "phone": "+49 30 12345678",
      "whatsapp": "+49 171 9876543",
      "email": "hallo@bellavita.de"
    },
    "logo": {
      "upload": "Logodatei wählen",
      "remove": "Entfernen",
      "previewAlt": "Logo-Vorschau"
    },
    "photos": {
      "hero": "Hauptfoto (Hero)",
      "about": "Foto „Über uns“",
      "gallery": "Galerie",
      "services": "Leistungsfotos",
      "slot": "Foto {n}",
      "upload": "Foto hochladen",
      "resetStock": "Stockfoto wiederherstellen",
      "previewAlt": "Fotovorschau"
    },
    "colorPreviewLabel": "Live-Vorschau",
    "colorPreview": "Aa",
    "validation": {
      "invalidHex": "Geben Sie eine gültige HEX-Farbe ein (#RRGGBB)"
    },
    "cta": {
      "saveAndContinue": "Speichern und fortfahren"
    }
  },
  "manifest": {
    "title": "Manifest-Steuerzentrale",
    "newProject": "Neues Projekt",
    "generatedBadge": "Manifest erfolgreich erstellt",
    "generated": "Erstellt",
    "metadata": "Manifest-Metadaten",
    "projectId": "Projekt-ID",
    "studioId": "Studio-ID",
    "clientId": "Kunden-ID",
    "schema": "Schema",
    "created": "Erstellt",
    "updated": "Aktualisiert",
    "businessInfo": "Geschäftsdaten",
    "ownership": "Eigentum",
    "websiteSections": "Website-Bereiche",
    "crmModules": "CRM-Module",
    "reviewFlow": "Bewertungsfluss",
    "deliveryActions": "Lieferaktionen",
    "theme": "Theme",
    "booking": "Buchung",
    "showJson": "Roh-JSON anzeigen",
    "hideJson": "Roh-JSON ausblenden",
    "nextSteps": "Nächste Schritte",
    "rowLabels": {
      "name": "Name",
      "city": "Stadt",
      "language": "Sprache",
      "phone": "Telefon",
      "whatsapp": "WhatsApp",
      "email": "E-Mail",
      "studio": "Studio",
      "client": "Kunde",
      "mode": "Modus",
      "studioEmail": "Studio-E-Mail"
    },
    "nextItems": {
      "website": {
        "title": "Website-Demo",
        "desc": "Vollständige Website aus dem aktuellen Manifest — Hero, Leistungen, Buchung, Galerie und mehr.",
        "badge": "Aus Manifest generiert"
      },
      "crm": {
        "title": "CRM-Demo",
        "desc": "Vollständiges CRM mit Dashboard, Kunden, Buchungen und Kalender — aus demselben Manifest.",
        "badge": "Aus Manifest generiert"
      },
      "delivery": {
        "title": "Auslieferung",
        "desc": "ZIP herunterladen, README, auf GitHub pushen, Firebase verbinden und deployen.",
        "badge": "ZIP · README · GitHub · Firebase · Deploy"
      },
      "sdk": {
        "title": "Studio SDK",
        "desc": "Passen Sie die Marke des Kunden an: Name, Kontakte, Logo, Markenfarbe und Fotos — ohne Code.",
        "badge": "Marken-Editor"
      }
    },
    "openButton": "Öffnen",
    "openDelivery": "Lieferzentrum öffnen",
    "comingNext": "Demnächst",
    "stepLabels": {
      "booking_confirmation": "Buchung bestätigt",
      "crm_record": "CRM-Eintrag erstellt",
      "whatsapp_followup": "WhatsApp-Nachricht",
      "email_followup": "E-Mail-Nachricht",
      "google_review_request": "Google-Bewertungsanfrage"
    }
  },
  "delivery": {
    "downloadZip": "ZIP herunterladen",
    "pushGithub": "Auf GitHub pushen",
    "deployHosting": "Auf Hosting deployen",
    "connectFirebase": "Firebase-Cloudspeicher verbinden",
    "clickToRun": "Klicken zum Starten",
    "completed": "Abgeschlossen",
    "allDoneTitle": "Projektauslieferung abgeschlossen",
    "allDoneSub": "Alle Lieferschritte erfolgreich abgeschlossen.",
    "downloadProject": "Projekt-ZIP herunterladen",
    "openRepository": "Repository öffnen",
    "openWebsite": "Website öffnen",
    "done": "Fertig",
    "repositoryUrl": "Repository-URL",
    "liveDemoUrl": "Live-Demo-URL",
    "firebaseConnected": "Firebase verbunden",
    "configReady": "Konfiguration bereit",
    "zipSteps": {
      "preparing": "Projekt wird vorbereitet...",
      "packaging": "Quellen werden verpackt...",
      "archiving": "Archiv wird erstellt...",
      "ready": "Bereit"
    },
    "githubSteps": {
      "creating": "Repository wird erstellt...",
      "uploading": "Dateien werden hochgeladen...",
      "readme": "README wird erstellt...",
      "done": "Push abgeschlossen."
    },
    "deploySteps": {
      "uploading": "Wird hochgeladen...",
      "building": "Wird gebaut...",
      "deploying": "Wird deployed...",
      "ready": "Bereit"
    },
    "firebaseSteps": {
      "config": "Konfiguration wird generiert...",
      "collections": "Collections werden erstellt...",
      "rules": "Sicherheitsregeln...",
      "done": "Abgeschlossen"
    },
    "promo": {
      "title": "Promo-Code eingeben",
      "subtitle": "Geben Sie Ihren Promo-Code ein, um die Auslieferungsaktionen freizuschalten.",
      "placeholder": "z. B. AGENCY-X7K4M9",
      "apply": "Freischalten",
      "checking": "Prüfen…",
      "unlockedTitle": "Promo-Code akzeptiert",
      "unlockedSub": "Auslieferungsaktionen sind für diese Sitzung freigeschaltet."
    }
  },
  "crm": {
    "title": "CRM-Demo",
    "tabs": {
      "dashboard": "Dashboard",
      "bookings": "Buchungen",
      "customers": "Kunden"
    },
    "stats": {
      "bookingsToday": "Buchungen heute",
      "totalCustomers": "Kunden gesamt",
      "pending": "Ausstehend",
      "confirmed": "Bestätigt"
    },
    "recentBookings": "Letzte Buchungen",
    "noBookingsHint": "Erstellen Sie eine Buchung in der Website-Demo, um sie hier zu sehen",
    "allBookings": "Alle Buchungen",
    "allCustomers": "Alle Kunden",
    "total": "gesamt",
    "columns": {
      "name": "Name",
      "phone": "Telefon",
      "date": "Datum",
      "service": "Leistung",
      "status": "Status",
      "visits": "Besuche"
    },
    "empty": {
      "bookings": "Noch keine Buchungen",
      "bookingsSub": "Buchung in der Website-Demo erstellen, um sie hier zu sehen.",
      "bookingsTableSub": "Buchung in der Website-Demo erstellen — erscheint sofort hier.",
      "customers": "Noch keine Kunden",
      "customersSub": "Kunden werden automatisch erstellt, wenn eine Buchung eingereicht wird.",
      "customersTableSub": "Kunden erscheinen automatisch, wenn Buchungen erstellt werden."
    },
    "visit": "Besuch",
    "visits": "Besuche",
    "websiteDemo": "Website-Demo",
    "backManifest": "Manifest",
    "refresh": "Aktualisieren"
  },
  "websiteDemo": {
    "backToManifest": "Zurück zum Manifest",
    "nav": {
      "home": "Startseite",
      "about": "Über uns",
      "services": "Leistungen",
      "gallery": "Galerie",
      "booking": "Buchen",
      "testimonials": "Bewertungen",
      "faq": "FAQ",
      "contacts": "Kontakt"
    },
    "call": "Anrufen",
    "bookNow": "Jetzt buchen",
    "floating": {
      "call": "Anrufen",
      "whatsapp": "WhatsApp",
      "book": "Buchen"
    }
  },
  "sections": {
    "about": {
      "label": "Über uns",
      "yearsLabel": "Jahre Erfahrung",
      "stats": {
        "clients": "Zufriedene Kunden",
        "experience": "Jahre Erfahrung",
        "satisfaction": "Zufriedenheit"
      },
      "whatsapp": "WhatsApp"
    },
    "services": {
      "eyebrow": "Was wir anbieten",
      "title": "Unsere Leistungen",
      "bookNow": "Jetzt buchen"
    },
    "gallery": {
      "eyebrow": "Portfolio",
      "title": "Galerie"
    },
    "testimonials": {
      "eyebrow": "Bewertungen",
      "title": "Was unsere Kunden sagen",
      "rating": "Ausgezeichnet"
    },
    "booking": {
      "eyebrow": "Jetzt buchen",
      "confirmed": "Buchung bestätigt!",
      "confirmedSub": "Das passiert als nächstes — automatisch.",
      "crmRecord": "CRM-Eintrag erstellt",
      "whatsappSent": "WhatsApp-Bestätigung gesendet",
      "emailSent": "E-Mail-Bestätigung gesendet",
      "reviewScheduled": "Bewertungsanfrage geplant",
      "submitAnother": "← Weitere Buchung einreichen",
      "yourName": "Ihr Name",
      "phoneNumber": "Telefonnummer",
      "preferredDate": "Gewünschtes Datum",
      "selectService": "Leistung auswählen",
      "confirmBooking": "Buchung bestätigen",
      "status": {
        "done": "Fertig",
        "delivered": "Zugestellt ✓✓",
        "deliveredEmail": "Zugestellt"
      }
    },
    "faq": {
      "eyebrow": "FAQ",
      "title": "Häufig gestellte Fragen"
    },
    "contacts": {
      "eyebrow": "Kontakt aufnehmen",
      "title": "Kontakt",
      "labels": {
        "phone": "Telefon",
        "whatsapp": "WhatsApp",
        "email": "E-Mail",
        "address": "Adresse",
        "hours": "Öffnungszeiten"
      },
      "form": {
        "title": "Nachricht senden",
        "namePlaceholder": "Ihr Name",
        "emailPlaceholder": "E-Mail-Adresse",
        "subjectPlaceholder": "Betreff",
        "messagePlaceholder": "Ihre Nachricht…",
        "send": "Nachricht senden"
      },
      "successTitle": "Nachricht gesendet!",
      "successSub": "Wir antworten innerhalb eines Werktages.",
      "sendAnother": "Weitere senden"
    },
    "footer": {
      "services": "Leistungen",
      "contact": "Kontakt",
      "rights": "Alle Rechte vorbehalten."
    },
    "maps": {
      "eyebrow": "Standort",
      "title": "Finden Sie uns in",
      "openMaps": "In Google Maps öffnen"
    },
    "whatsapp": {
      "title": "Schreiben Sie uns auf WhatsApp",
      "subtitle": "Schnelle Antworten, Buchungsbestätigungen und direkter Support — über WhatsApp.",
      "button": "WhatsApp öffnen"
    },
    "email": {
      "title": "Senden Sie uns eine E-Mail",
      "subtitle": "Wir antworten auf alle Anfragen innerhalb eines Werktages."
    }
  },
  "reviewFlow": {
    "brand": "Factory Website+CRM",
    "journey": "Customer Journey",
    "title": "Von Google Maps zu 5-Sterne-Bewertungen",
    "subtitle": "Jeder Kontaktpunkt ist automatisiert. Kunde bucht online → CRM erfasst es → WhatsApp & E-Mail bestätigen → Bewertungsanfrage folgt automatisch.",
    "mock": "Mock",
    "pipeline": {
      "maps":    { "label": "Google Maps",       "sub": "Kunde findet Sie" },
      "website": { "label": "Website",           "sub": "Erkundet Ihre Marke" },
      "booking": { "label": "Online-Buchung",    "sub": "Bucht einen Termin" },
      "crm":     { "label": "CRM",               "sub": "Eintrag automatisch erstellt" },
      "wa":      { "label": "WhatsApp",          "sub": "Bestätigung gesendet" },
      "email":   { "label": "E-Mail",            "sub": "Bestätigung + Erinnerung" },
      "review":  { "label": "Bewertungsanfrage", "sub": "Automatisch nach Besuch" },
      "reviews": { "label": "Google Reviews",    "sub": "5-Sterne-Rating wächst" },
      "clients": { "label": "Neue Kunden",       "sub": "Organische Wachstumsschleife" }
    },
    "infoRows": {
      "maps":    "Kunde entdeckt {name} über Google Maps und tippt auf 'Website besuchen'.",
      "website": "Besucher durchsucht die Website, sieht Leistungen und Preise, klickt 'Jetzt buchen'.",
      "booking": "Buchung eingereicht — CRM-Eintrag erstellt, Benachrichtigungen automatisch ausgelöst.",
      "crm":     "Eintrag automatisch im CRM erstellt. Buchung bestätigt, Bewertungsfluss gestartet.",
      "waEnabled":  "Bestätigung per WhatsApp gesendet. Status: Zugestellt ✓✓",
      "waDisabled": "WhatsApp im Manifest aktivieren, um diesen Schritt zu aktivieren.",
      "emailEnabled":  "Bestätigungs-E-Mail gesendet. Erinnerung wird 24h vor dem Termin gesendet.",
      "emailDisabled": "E-Mail im Manifest aktivieren, um diesen Schritt zu aktivieren.",
      "reviewEnabled":  "Wird automatisch {hours}h nach dem Termin über {channel} gesendet.",
      "reviewDisabled": "Bewertungsanfragen im Manifest aktivieren, um diesen Schritt zu aktivieren.",
      "reviews": "5-Sterne-Bewertungen wachsen organisch. Höheres Google-Ranking. Neue Kunden finden Sie.",
      "clients": "Mehr Bewertungen → besseres Google-Ranking → mehr Kunden entdecken Sie → voller Kreislauf."
    },
    "mockLabels": {
      "maps": "Google Maps",
      "website": "Website",
      "booking": "Online-Buchung",
      "bookingRequest": "Neue Buchungsanfrage",
      "bookingSubmitted": "✓ Buchung eingereicht",
      "crm": "CRM-Eintrag",
      "customerRecord": "Kundendatensatz",
      "waConfirm": "WhatsApp-Bestätigung",
      "waNotConfigured": "WhatsApp nicht in diesem Manifest konfiguriert",
      "emailConfirm": "E-Mail-Bestätigung",
      "emailNotEnabled": "E-Mail-Benachrichtigungen in diesem Manifest nicht aktiviert",
      "review": "Bewertungsanfrage",
      "reviewNotEnabled": "Bewertungsanfrage im Bewertungsfluss des Manifests nicht aktiviert",
      "reviews": "Google Reviews",
      "clients": "Neue Kunden — Wachstumsschleife",
      "visitWebsite": "Website besuchen",
      "bookNow": "Jetzt buchen",
      "services": "Leistungen",
      "confirmed": "Bestätigt",
      "source": "Online-Buchung",
      "dear": "Sehr geehrte/r Alex,",
      "apptConfirmed": "Ihr Termin wurde bestätigt.",
      "leaveReview": "Google-Bewertung hinterlassen →",
      "afterVisit": "nach dem Besuch",
      "scheduled": "Geplant · ✓✓",
      "crmFields": {
        "service": "Leistung",
        "client": "Kunde",
        "phone": "Telefon",
        "date": "Datum",
        "name": "Name",
        "source": "Quelle",
        "channel": "Kanal",
        "location": "Stadt"
      },
      "stats": {
        "newBookings": "Neue Buchungen diesen Monat",
        "fromMaps": "Über Google Maps",
        "repeatClients": "Stammkunden",
        "rating": "Bewertungsdurchschnitt"
      }
    }
  }
}
`,Bx=`{
  "header": {
    "tagline": "Engine for web studios"
  },
  "hero": {
    "title": "Website + CRM + Online Booking",
    "titleAccent": "+ reviews on Google Maps",
    "subtitle": "Engine for web studios: questionnaire → manifest → build → demo → payment → ready project.",
    "flowSteps": ["Google Maps", "Website", "Online Booking", "CRM", "WhatsApp", "Email", "Review Request", "Google Reviews", "New Clients"]
  },
  "formSections": {
    "01": { "title": "Business Sector", "subtitle": "Select the industry that best matches your client's business." },
    "02": { "title": "Business Details", "subtitle": "Basic information about the client's business." },
    "03": { "title": "Contact Details", "subtitle": "Who is the main contact for this project?" },
    "04": { "title": "Studio Settings", "subtitle": "Your agency details and project ownership configuration." }
  },
  "fields": {
    "businessName": "Business Name",
    "city": "City",
    "websiteLanguage": "Website Language",
    "contactPerson": "Contact Person",
    "phone": "Phone",
    "whatsapp": "WhatsApp",
    "email": "Email",
    "agencyBrand": "Agency / Studio Brand",
    "ownershipMode": "Ownership Mode"
  },
  "placeholders": {
    "businessName": "e.g. Bella Vita Restaurant",
    "city": "e.g. Berlin",
    "contactPerson": "e.g. Marco Rossi",
    "phone": "+49 30 12345678",
    "whatsapp": "+49 171 9876543",
    "email": "hello@bellavita.de",
    "agencyBrand": "e.g. Bright Digital Agency",
    "notes": "Additional notes (optional)"
  },
  "ownership": {
    "client_owned": { "label": "Client Owned", "desc": "Client manages their project" },
    "studio_owned": { "label": "Studio Owned", "desc": "Studio retains full control" },
    "white_label":  { "label": "White Label",  "desc": "Studio brand, client delivery" }
  },
  "validation": {
    "nameRequired": "Business name is required",
    "cityRequired": "City is required",
    "sectorRequired": "Please select a sector",
    "contactRequired": "Contact person is required",
    "phoneRequired": "Phone is required",
    "emailRequired": "Email is required",
    "emailInvalid": "Invalid email address",
    "studioRequired": "Studio name is required",
    "fixFields": "Please fix the highlighted fields before continuing."
  },
  "cta": {
    "createDemo": "Create free demo",
    "creating": "Creating demo…"
  },
  "customBadge": "custom",
  "studioSdk": {
    "badge": "Studio SDK — customization panel",
    "title": "Studio SDK",
    "subtitle": "Customize your client's brand and contacts before previewing the manifest — no code required.",
    "sections": {
      "brandContacts": "Brand & Contacts",
      "brandContactsSub": "Edit the business name and contact details shown on the client's website.",
      "logo": "Logo",
      "logoSub": "Upload the client's logo (optional). PNG or SVG recommended.",
      "color": "Brand Color",
      "colorSub": "Override the default theme color with the client's brand color.",
      "photos": "Photos",
      "photosSub": "Replace stock photos with your client's own images. Unchanged slots keep the default sector photos."
    },
    "fields": {
      "businessName": "Business Name",
      "phone": "Phone",
      "whatsapp": "WhatsApp",
      "email": "Email",
      "primaryColor": "Primary Color",
      "hexValue": "HEX Value"
    },
    "placeholders": {
      "businessName": "e.g. Bella Vita Restaurant",
      "phone": "+49 30 12345678",
      "whatsapp": "+49 171 9876543",
      "email": "hello@bellavita.de"
    },
    "logo": {
      "upload": "Choose logo file",
      "remove": "Remove",
      "previewAlt": "Logo preview"
    },
    "photos": {
      "hero": "Hero Image",
      "about": "About Photo",
      "gallery": "Gallery",
      "services": "Service Photos",
      "slot": "Photo {n}",
      "upload": "Upload photo",
      "resetStock": "Restore stock photo",
      "previewAlt": "Photo preview"
    },
    "colorPreviewLabel": "Live preview",
    "colorPreview": "Aa",
    "validation": {
      "invalidHex": "Enter a valid HEX color (#RRGGBB)"
    },
    "cta": {
      "saveAndContinue": "Save and continue"
    }
  },
  "manifest": {
    "title": "Manifest Control Center",
    "newProject": "New Project",
    "generatedBadge": "Manifest Generated Successfully",
    "generated": "Generated",
    "metadata": "Manifest Metadata",
    "projectId": "Project ID",
    "studioId": "Studio ID",
    "clientId": "Client ID",
    "schema": "Schema",
    "created": "Created",
    "updated": "Updated",
    "businessInfo": "Business Info",
    "ownership": "Ownership",
    "websiteSections": "Website Sections",
    "crmModules": "CRM Modules",
    "reviewFlow": "Review Flow",
    "deliveryActions": "Delivery Actions",
    "theme": "Theme",
    "booking": "Booking",
    "showJson": "Show raw JSON",
    "hideJson": "Hide raw JSON",
    "nextSteps": "Next Steps",
    "rowLabels": {
      "name": "Name",
      "city": "City",
      "language": "Language",
      "phone": "Phone",
      "whatsapp": "WhatsApp",
      "email": "Email",
      "studio": "Studio",
      "client": "Client",
      "mode": "Mode",
      "studioEmail": "Studio Email"
    },
    "nextItems": {
      "website": {
        "title": "Website Demo",
        "desc": "Full website generated from the current Manifest — Hero, Services, Booking, Gallery and more.",
        "badge": "Generated from Manifest"
      },
      "crm": {
        "title": "CRM Demo",
        "desc": "Complete CRM with Dashboard, Customers, Bookings and Calendar — from the same Manifest.",
        "badge": "Generated from Manifest"
      },
      "delivery": {
        "title": "Delivery",
        "desc": "Download ZIP, README, push to GitHub, connect Firebase and deploy.",
        "badge": "ZIP · README · GitHub · Firebase · Deploy"
      },
      "sdk": {
        "title": "Studio SDK",
        "desc": "Customize the client's brand: name, contacts, logo, brand color and photos — no code required.",
        "badge": "Brand Editor"
      }
    },
    "openButton": "Open",
    "openDelivery": "Open Delivery Center",
    "comingNext": "Coming Next",
    "stepLabels": {
      "booking_confirmation": "Booking Confirmed",
      "crm_record": "CRM Record Created",
      "whatsapp_followup": "WhatsApp Follow-up",
      "email_followup": "Email Follow-up",
      "google_review_request": "Google Review Request"
    }
  },
  "delivery": {
    "downloadZip": "Download ZIP",
    "pushGithub": "Push to GitHub",
    "deployHosting": "Deploy to Hosting",
    "connectFirebase": "Connect Firebase cloud storage",
    "clickToRun": "Click to run",
    "completed": "Completed",
    "allDoneTitle": "Project Delivery Completed",
    "allDoneSub": "All delivery steps finished successfully.",
    "downloadProject": "Download Project ZIP",
    "openRepository": "Open Repository",
    "openWebsite": "Open Website",
    "done": "Done",
    "repositoryUrl": "Repository URL",
    "liveDemoUrl": "Live Demo URL",
    "firebaseConnected": "Firebase Connected",
    "configReady": "Configuration Ready",
    "zipSteps": {
      "preparing": "Preparing project...",
      "packaging": "Packaging source...",
      "archiving": "Creating archive...",
      "ready": "Ready"
    },
    "githubSteps": {
      "creating": "Creating repository...",
      "uploading": "Uploading files...",
      "readme": "Creating README...",
      "done": "Push completed."
    },
    "deploySteps": {
      "uploading": "Uploading...",
      "building": "Building...",
      "deploying": "Deploying...",
      "ready": "Ready"
    },
    "firebaseSteps": {
      "config": "Generating config...",
      "collections": "Creating collections...",
      "rules": "Security Rules...",
      "done": "Completed"
    },
    "promo": {
      "title": "Enter promo code",
      "subtitle": "Enter your promo code to unlock delivery actions.",
      "placeholder": "e.g. AGENCY-X7K4M9",
      "apply": "Unlock",
      "checking": "Checking…",
      "unlockedTitle": "Promo code accepted",
      "unlockedSub": "Delivery actions are unlocked for this session."
    }
  },
  "crm": {
    "title": "CRM Demo",
    "tabs": {
      "dashboard": "Dashboard",
      "bookings": "Bookings",
      "customers": "Customers"
    },
    "stats": {
      "bookingsToday": "Bookings Today",
      "totalCustomers": "Total Customers",
      "pending": "Pending",
      "confirmed": "Confirmed"
    },
    "recentBookings": "Recent Bookings",
    "noBookingsHint": "Make a booking in Website Demo to see it here",
    "allBookings": "All Bookings",
    "allCustomers": "All Customers",
    "total": "total",
    "columns": {
      "name": "Name",
      "phone": "Phone",
      "date": "Date",
      "service": "Service",
      "status": "Status",
      "visits": "Visits"
    },
    "empty": {
      "bookings": "No bookings yet",
      "bookingsSub": "Submit a booking in Website Demo to see it appear here.",
      "bookingsTableSub": "Submit a booking in Website Demo — it will appear here instantly.",
      "customers": "No customers yet",
      "customersSub": "Customers are created automatically when a booking is submitted.",
      "customersTableSub": "Customers appear automatically when bookings are created."
    },
    "visit": "visit",
    "visits": "visits",
    "websiteDemo": "Website Demo",
    "backManifest": "Manifest",
    "refresh": "Refresh"
  },
  "websiteDemo": {
    "backToManifest": "Back to Manifest",
    "nav": {
      "home": "Home",
      "about": "About",
      "services": "Services",
      "gallery": "Gallery",
      "booking": "Book",
      "testimonials": "Reviews",
      "faq": "FAQ",
      "contacts": "Contact"
    },
    "call": "Call",
    "bookNow": "Book Now",
    "floating": {
      "call": "Call",
      "whatsapp": "WhatsApp",
      "book": "Book"
    }
  },
  "sections": {
    "about": {
      "label": "About Us",
      "yearsLabel": "Years of Excellence",
      "stats": {
        "clients": "Happy Clients",
        "experience": "Years Experience",
        "satisfaction": "Satisfaction"
      },
      "whatsapp": "WhatsApp"
    },
    "services": {
      "eyebrow": "What We Offer",
      "title": "Our Services",
      "bookNow": "Book Now"
    },
    "gallery": {
      "eyebrow": "Portfolio",
      "title": "Gallery"
    },
    "testimonials": {
      "eyebrow": "Reviews",
      "title": "What Our Clients Say",
      "rating": "Excellent"
    },
    "booking": {
      "eyebrow": "Book Now",
      "confirmed": "Booking Confirmed!",
      "confirmedSub": "Here's what happens next — automatically.",
      "crmRecord": "CRM Record Created",
      "whatsappSent": "WhatsApp Confirmation Sent",
      "emailSent": "Email Confirmation Sent",
      "reviewScheduled": "Review Request Scheduled",
      "submitAnother": "← Submit another booking",
      "yourName": "Your Name",
      "phoneNumber": "Phone Number",
      "preferredDate": "Preferred Date",
      "selectService": "Select Service",
      "confirmBooking": "Confirm Booking",
      "status": {
        "done": "Done",
        "delivered": "Delivered ✓✓",
        "deliveredEmail": "Delivered"
      }
    },
    "faq": {
      "eyebrow": "FAQ",
      "title": "Frequently Asked Questions"
    },
    "contacts": {
      "eyebrow": "Get in Touch",
      "title": "Contact Us",
      "labels": {
        "phone": "Phone",
        "whatsapp": "WhatsApp",
        "email": "Email",
        "address": "Address",
        "hours": "Hours"
      },
      "form": {
        "title": "Send a Message",
        "namePlaceholder": "Your Name",
        "emailPlaceholder": "Email Address",
        "subjectPlaceholder": "Subject",
        "messagePlaceholder": "Your message…",
        "send": "Send Message"
      },
      "successTitle": "Message Sent!",
      "successSub": "We'll get back to you within one business day.",
      "sendAnother": "Send another"
    },
    "footer": {
      "services": "Services",
      "contact": "Contact",
      "rights": "All rights reserved."
    },
    "maps": {
      "eyebrow": "Location",
      "title": "Find Us in",
      "openMaps": "Open in Google Maps"
    },
    "whatsapp": {
      "title": "Chat with Us on WhatsApp",
      "subtitle": "Quick answers, booking confirmations, and direct support — available via WhatsApp.",
      "button": "Open WhatsApp"
    },
    "email": {
      "title": "Send Us an Email",
      "subtitle": "We reply to all enquiries within one business day."
    }
  },
  "reviewFlow": {
    "brand": "Factory Website+CRM",
    "journey": "Customer Journey",
    "title": "From Google Maps to 5-Star Reviews",
    "subtitle": "Every touchpoint is automated. The client books online → CRM records it → WhatsApp & Email confirm it → a review request follows. More reviews = more clients.",
    "mock": "Mock",
    "pipeline": {
      "maps":    { "label": "Google Maps",    "sub": "Client finds you" },
      "website": { "label": "Website",        "sub": "Explores your brand" },
      "booking": { "label": "Online Booking", "sub": "Books an appointment" },
      "crm":     { "label": "CRM",            "sub": "Record created automatically" },
      "wa":      { "label": "WhatsApp",       "sub": "Confirmation sent" },
      "email":   { "label": "Email",          "sub": "Confirmation + reminder" },
      "review":  { "label": "Review Request", "sub": "Automated after visit" },
      "reviews": { "label": "Google Reviews", "sub": "5-star rating grows" },
      "clients": { "label": "New Clients",    "sub": "Organic growth loop" }
    },
    "infoRows": {
      "maps":    "Client discovers {name} via Google Maps and taps \\"Visit Website\\".",
      "website": "Visitor browses the website, sees services and prices, clicks \\"Book Now\\".",
      "booking": "Booking submitted — CRM record created, notifications triggered automatically.",
      "crm":     "Record auto-created in CRM. Booking confirmed, review flow scheduled.",
      "waEnabled":  "Confirmation sent via WhatsApp. Status: Delivered ✓✓",
      "waDisabled": "Enable WhatsApp in manifest to activate this step.",
      "emailEnabled":  "Confirmation email sent. Reminder will be sent 24h before the appointment.",
      "emailDisabled": "Enable email in manifest to activate this step.",
      "reviewEnabled":  "Sent automatically {hours}h after the appointment via {channel}.",
      "reviewDisabled": "Enable review requests in manifest to activate this step.",
      "reviews": "5-star reviews grow organically. Higher Google ranking. New clients find you.",
      "clients": "More reviews → better Google ranking → more clients discover you → full loop."
    },
    "mockLabels": {
      "maps": "Google Maps",
      "website": "Website",
      "booking": "Online Booking",
      "bookingRequest": "New Booking Request",
      "bookingSubmitted": "✓ Booking Submitted",
      "crm": "CRM Record",
      "customerRecord": "Customer Record",
      "waConfirm": "WhatsApp Confirmation",
      "waNotConfigured": "WhatsApp not configured in this manifest",
      "emailConfirm": "Email Confirmation",
      "emailNotEnabled": "Email notifications not enabled in this manifest",
      "review": "Review Request",
      "reviewNotEnabled": "Review request not enabled in this manifest's review flow",
      "reviews": "Google Reviews",
      "clients": "New Clients — Growth Loop",
      "visitWebsite": "Visit Website",
      "bookNow": "Book Now",
      "services": "Services",
      "confirmed": "Confirmed",
      "source": "Online Booking",
      "dear": "Dear Alex,",
      "apptConfirmed": "Your appointment has been confirmed.",
      "leaveReview": "Leave a Google Review →",
      "afterVisit": "after visit",
      "scheduled": "Scheduled · ✓✓",
      "crmFields": {
        "service": "Service",
        "client": "Client",
        "phone": "Phone",
        "date": "Date",
        "name": "Name",
        "source": "Source",
        "channel": "Channel",
        "location": "Location"
      },
      "stats": {
        "newBookings": "New bookings this month",
        "fromMaps": "From Google Maps",
        "repeatClients": "Repeat clients",
        "rating": "Review rating"
      }
    }
  }
}
`,Ix=`{
  "header": {
    "tagline": "Движок для веб-студий"
  },
  "hero": {
    "title": "Сайт + CRM + Онлайн-запись",
    "titleAccent": "+ отзывы в Google Maps",
    "subtitle": "Движок для веб-студий: анкета → манифест → сборка → демо → оплата → готовый проект.",
    "flowSteps": ["Google Maps", "Сайт", "Онлайн-запись", "CRM", "WhatsApp", "Email", "Запрос отзыва", "Google Reviews", "Новые клиенты"]
  },
  "formSections": {
    "01": { "title": "Отрасль бизнеса", "subtitle": "Выберите сферу деятельности клиента." },
    "02": { "title": "Данные бизнеса", "subtitle": "Основная информация о бизнесе клиента." },
    "03": { "title": "Контактные данные", "subtitle": "Кто является основным контактом проекта?" },
    "04": { "title": "Настройки студии", "subtitle": "Данные вашего агентства и конфигурация владения проектом." }
  },
  "fields": {
    "businessName": "Название бизнеса",
    "city": "Город",
    "websiteLanguage": "Язык сайта",
    "contactPerson": "Контактное лицо",
    "phone": "Телефон",
    "whatsapp": "WhatsApp",
    "email": "Email",
    "agencyBrand": "Агентство / Студия",
    "ownershipMode": "Режим владения"
  },
  "placeholders": {
    "businessName": "напр. Ресторан Белла Вита",
    "city": "напр. Москва",
    "contactPerson": "напр. Иван Петров",
    "phone": "+7 495 123-45-67",
    "whatsapp": "+7 916 987-65-43",
    "email": "hello@bellavita.ru",
    "agencyBrand": "напр. Digital Agency",
    "notes": "Дополнительные пожелания (необязательно)"
  },
  "ownership": {
    "client_owned": { "label": "Клиентский", "desc": "Клиент управляет проектом" },
    "studio_owned": { "label": "Студийный", "desc": "Студия сохраняет полный контроль" },
    "white_label":  { "label": "White Label",  "desc": "Бренд студии, доставка клиенту" }
  },
  "validation": {
    "nameRequired": "Название бизнеса обязательно",
    "cityRequired": "Город обязателен",
    "sectorRequired": "Выберите отрасль",
    "contactRequired": "Контактное лицо обязательно",
    "phoneRequired": "Телефон обязателен",
    "emailRequired": "Email обязателен",
    "emailInvalid": "Некорректный email",
    "studioRequired": "Название студии обязательно",
    "fixFields": "Пожалуйста, исправьте выделенные поля."
  },
  "cta": {
    "createDemo": "Создать бесплатное демо",
    "creating": "Создаём демо…"
  },
  "customBadge": "custom",
  "studioSdk": {
    "badge": "Studio SDK — панель кастомизации",
    "title": "Studio SDK",
    "subtitle": "Настройте бренд и контакты клиента перед просмотром манифеста — без правки кода.",
    "sections": {
      "brandContacts": "Бренд и контакты",
      "brandContactsSub": "Редактируйте название компании и контактные данные для сайта клиента.",
      "logo": "Логотип",
      "logoSub": "Загрузите логотип клиента (необязательно). Рекомендуется PNG или SVG.",
      "color": "Фирменный цвет",
      "colorSub": "Замените цвет темы по умолчанию на фирменный цвет клиента.",
      "photos": "Фото",
      "photosSub": "Замените стоковые фото на свои. Неизменённые слоты сохраняют фото ниши по умолчанию."
    },
    "fields": {
      "businessName": "Название компании",
      "phone": "Телефон",
      "whatsapp": "WhatsApp",
      "email": "Email",
      "primaryColor": "Основной цвет",
      "hexValue": "HEX-значение"
    },
    "placeholders": {
      "businessName": "напр. Ресторан Белла Вита",
      "phone": "+7 495 123-45-67",
      "whatsapp": "+7 916 987-65-43",
      "email": "hello@bellavita.ru"
    },
    "logo": {
      "upload": "Выбрать файл логотипа",
      "remove": "Удалить",
      "previewAlt": "Превью логотипа"
    },
    "photos": {
      "hero": "Главное фото (Hero)",
      "about": "Фото «О нас»",
      "gallery": "Галерея",
      "services": "Фото услуг",
      "slot": "Фото {n}",
      "upload": "Загрузить фото",
      "resetStock": "Вернуть стоковое фото",
      "previewAlt": "Превью фото"
    },
    "colorPreviewLabel": "Превью",
    "colorPreview": "Aa",
    "validation": {
      "invalidHex": "Введите корректный HEX-цвет (#RRGGBB)"
    },
    "cta": {
      "saveAndContinue": "Сохранить и продолжить"
    }
  },
  "manifest": {
    "title": "Центр управления манифестом",
    "newProject": "Новый проект",
    "generatedBadge": "Манифест успешно создан",
    "generated": "Создан",
    "metadata": "Метаданные манифеста",
    "projectId": "ID проекта",
    "studioId": "ID студии",
    "clientId": "ID клиента",
    "schema": "Схема",
    "created": "Создан",
    "updated": "Обновлён",
    "businessInfo": "Данные бизнеса",
    "ownership": "Владение",
    "websiteSections": "Разделы сайта",
    "crmModules": "Модули CRM",
    "reviewFlow": "Поток отзывов",
    "deliveryActions": "Действия доставки",
    "theme": "Тема",
    "booking": "Бронирование",
    "showJson": "Показать JSON",
    "hideJson": "Скрыть JSON",
    "nextSteps": "Следующие шаги",
    "rowLabels": {
      "name": "Имя",
      "city": "Город",
      "language": "Язык",
      "phone": "Телефон",
      "whatsapp": "WhatsApp",
      "email": "Email",
      "studio": "Студия",
      "client": "Клиент",
      "mode": "Режим",
      "studioEmail": "Email студии"
    },
    "nextItems": {
      "website": {
        "title": "Демо сайта",
        "desc": "Полный сайт, сгенерированный из манифеста — Hero, Услуги, Запись, Галерея и многое другое.",
        "badge": "Сгенерировано из манифеста"
      },
      "crm": {
        "title": "Демо CRM",
        "desc": "Полноценная CRM с Дашбордом, Клиентами, Записями и Календарём — из того же манифеста.",
        "badge": "Сгенерировано из манифеста"
      },
      "delivery": {
        "title": "Доставка",
        "desc": "Скачать ZIP, README, отправить на GitHub, подключить Firebase и задеплоить.",
        "badge": "ZIP · README · GitHub · Firebase · Deploy"
      },
      "sdk": {
        "title": "Studio SDK",
        "desc": "Настройте бренд клиента: название, контакты, логотип, фирменный цвет и фото — без правки кода.",
        "badge": "Редактор бренда"
      }
    },
    "openButton": "Открыть",
    "openDelivery": "Открыть центр доставки",
    "comingNext": "Скоро",
    "stepLabels": {
      "booking_confirmation": "Запись подтверждена",
      "crm_record": "Запись в CRM создана",
      "whatsapp_followup": "WhatsApp-сообщение",
      "email_followup": "Email-сообщение",
      "google_review_request": "Запрос отзыва Google"
    }
  },
  "delivery": {
    "downloadZip": "Скачать ZIP",
    "pushGithub": "Push на GitHub",
    "deployHosting": "Деплой на хостинг",
    "connectFirebase": "Подключить облачное хранение Firebase",
    "clickToRun": "Нажмите для запуска",
    "completed": "Выполнено",
    "allDoneTitle": "Доставка проекта завершена",
    "allDoneSub": "Все шаги доставки успешно выполнены.",
    "downloadProject": "Скачать ZIP проекта",
    "openRepository": "Открыть репозиторий",
    "openWebsite": "Открыть сайт",
    "done": "Готово",
    "repositoryUrl": "URL репозитория",
    "liveDemoUrl": "URL живого демо",
    "firebaseConnected": "Firebase подключён",
    "configReady": "Конфигурация готова",
    "zipSteps": {
      "preparing": "Подготовка проекта...",
      "packaging": "Упаковка исходников...",
      "archiving": "Создание архива...",
      "ready": "Готово"
    },
    "githubSteps": {
      "creating": "Создание репозитория...",
      "uploading": "Загрузка файлов...",
      "readme": "Создание README...",
      "done": "Push завершён."
    },
    "deploySteps": {
      "uploading": "Загрузка...",
      "building": "Сборка...",
      "deploying": "Деплой...",
      "ready": "Готово"
    },
    "firebaseSteps": {
      "config": "Генерация конфигурации...",
      "collections": "Создание коллекций...",
      "rules": "Правила безопасности...",
      "done": "Завершено"
    },
    "promo": {
      "title": "Введите промокод",
      "subtitle": "Введите промокод, чтобы разблокировать действия доставки.",
      "placeholder": "напр. AGENCY-X7K4M9",
      "apply": "Разблокировать",
      "checking": "Проверка…",
      "unlockedTitle": "Промокод принят",
      "unlockedSub": "Действия доставки разблокированы для этой сессии."
    }
  },
  "crm": {
    "title": "Демо CRM",
    "tabs": {
      "dashboard": "Дашборд",
      "bookings": "Записи",
      "customers": "Клиенты"
    },
    "stats": {
      "bookingsToday": "Записи сегодня",
      "totalCustomers": "Всего клиентов",
      "pending": "Ожидает",
      "confirmed": "Подтверждено"
    },
    "recentBookings": "Последние записи",
    "noBookingsHint": "Сделайте запись в демо сайта, чтобы увидеть её здесь",
    "allBookings": "Все записи",
    "allCustomers": "Все клиенты",
    "total": "всего",
    "columns": {
      "name": "Имя",
      "phone": "Телефон",
      "date": "Дата",
      "service": "Услуга",
      "status": "Статус",
      "visits": "Визиты"
    },
    "empty": {
      "bookings": "Записей пока нет",
      "bookingsSub": "Сделайте запись в демо сайта, чтобы она появилась здесь.",
      "bookingsTableSub": "Сделайте запись в демо сайта — она появится здесь мгновенно.",
      "customers": "Клиентов пока нет",
      "customersSub": "Клиенты создаются автоматически при создании записи.",
      "customersTableSub": "Клиенты появляются автоматически при создании записей."
    },
    "visit": "визит",
    "visits": "визитов",
    "websiteDemo": "Демо сайта",
    "backManifest": "Манифест",
    "refresh": "Обновить"
  },
  "websiteDemo": {
    "backToManifest": "К манифесту",
    "nav": {
      "home": "Главная",
      "about": "О нас",
      "services": "Услуги",
      "gallery": "Галерея",
      "booking": "Записаться",
      "testimonials": "Отзывы",
      "faq": "FAQ",
      "contacts": "Контакты"
    },
    "call": "Позвонить",
    "bookNow": "Записаться",
    "floating": {
      "call": "Позвонить",
      "whatsapp": "WhatsApp",
      "book": "Записаться"
    }
  },
  "sections": {
    "about": {
      "label": "О нас",
      "yearsLabel": "Лет опыта",
      "stats": {
        "clients": "Довольных клиентов",
        "experience": "Лет опыта",
        "satisfaction": "Удовлетворённость"
      },
      "whatsapp": "WhatsApp"
    },
    "services": {
      "eyebrow": "Что мы предлагаем",
      "title": "Наши услуги",
      "bookNow": "Записаться"
    },
    "gallery": {
      "eyebrow": "Портфолио",
      "title": "Галерея"
    },
    "testimonials": {
      "eyebrow": "Отзывы",
      "title": "Что говорят наши клиенты",
      "rating": "Отлично"
    },
    "booking": {
      "eyebrow": "Записаться",
      "confirmed": "Запись подтверждена!",
      "confirmedSub": "Вот что произойдёт дальше — автоматически.",
      "crmRecord": "Запись в CRM создана",
      "whatsappSent": "Подтверждение WhatsApp отправлено",
      "emailSent": "Подтверждение Email отправлено",
      "reviewScheduled": "Запрос отзыва запланирован",
      "submitAnother": "← Отправить ещё одну запись",
      "yourName": "Ваше имя",
      "phoneNumber": "Номер телефона",
      "preferredDate": "Желаемая дата",
      "selectService": "Выберите услугу",
      "confirmBooking": "Подтвердить запись",
      "status": {
        "done": "Готово",
        "delivered": "Доставлено ✓✓",
        "deliveredEmail": "Доставлено"
      }
    },
    "faq": {
      "eyebrow": "FAQ",
      "title": "Часто задаваемые вопросы"
    },
    "contacts": {
      "eyebrow": "Связаться",
      "title": "Контакты",
      "labels": {
        "phone": "Телефон",
        "whatsapp": "WhatsApp",
        "email": "Email",
        "address": "Адрес",
        "hours": "Часы работы"
      },
      "form": {
        "title": "Отправить сообщение",
        "namePlaceholder": "Ваше имя",
        "emailPlaceholder": "Email адрес",
        "subjectPlaceholder": "Тема",
        "messagePlaceholder": "Ваше сообщение…",
        "send": "Отправить"
      },
      "successTitle": "Сообщение отправлено!",
      "successSub": "Мы ответим в течение одного рабочего дня.",
      "sendAnother": "Отправить ещё"
    },
    "footer": {
      "services": "Услуги",
      "contact": "Контакты",
      "rights": "Все права защищены."
    },
    "maps": {
      "eyebrow": "Местоположение",
      "title": "Найдите нас в",
      "openMaps": "Открыть в Google Maps"
    },
    "whatsapp": {
      "title": "Напишите нам в WhatsApp",
      "subtitle": "Быстрые ответы, подтверждения записей и поддержка — всё через WhatsApp.",
      "button": "Открыть WhatsApp"
    },
    "email": {
      "title": "Напишите нам email",
      "subtitle": "Мы отвечаем на все запросы в течение одного рабочего дня."
    }
  },
  "reviewFlow": {
    "brand": "Factory Website+CRM",
    "journey": "Путь клиента",
    "title": "От Google Maps до 5-звёздочных отзывов",
    "subtitle": "Каждое касание автоматизировано. Клиент записывается онлайн → CRM фиксирует → WhatsApp и Email подтверждают → запрос отзыва следует автоматически.",
    "mock": "Демо",
    "pipeline": {
      "maps":    { "label": "Google Maps",    "sub": "Клиент находит вас" },
      "website": { "label": "Сайт",           "sub": "Изучает ваш бренд" },
      "booking": { "label": "Онлайн-запись",  "sub": "Бронирует приём" },
      "crm":     { "label": "CRM",            "sub": "Запись создаётся авто" },
      "wa":      { "label": "WhatsApp",       "sub": "Подтверждение отправлено" },
      "email":   { "label": "Email",          "sub": "Подтверждение + напомин." },
      "review":  { "label": "Запрос отзыва",  "sub": "Авто после визита" },
      "reviews": { "label": "Google Reviews", "sub": "Рейтинг растёт" },
      "clients": { "label": "Новые клиенты",  "sub": "Органический рост" }
    },
    "infoRows": {
      "maps":    "Клиент находит {name} в Google Maps и нажимает «Перейти на сайт».",
      "website": "Посетитель изучает сайт, смотрит услуги и цены, нажимает «Записаться».",
      "booking": "Запись отправлена — запись в CRM создана, уведомления triggered автоматически.",
      "crm":     "Запись автоматически создана в CRM. Запись подтверждена, поток отзывов запущен.",
      "waEnabled":  "Подтверждение отправлено через WhatsApp. Статус: Доставлено ✓✓",
      "waDisabled": "Включите WhatsApp в манифесте для активации этого шага.",
      "emailEnabled":  "Письмо-подтверждение отправлено. Напоминание придёт за 24ч до визита.",
      "emailDisabled": "Включите email в манифесте для активации этого шага.",
      "reviewEnabled":  "Отправляется автоматически через {hours}ч после визита через {channel}.",
      "reviewDisabled": "Включите запрос отзывов в манифесте для активации этого шага.",
      "reviews": "5-звёздочные отзывы растут органически. Выше рейтинг в Google. Больше клиентов.",
      "clients": "Больше отзывов → выше рейтинг → больше клиентов находят вас → полный цикл."
    },
    "mockLabels": {
      "maps": "Google Maps",
      "website": "Сайт",
      "booking": "Онлайн-запись",
      "bookingRequest": "Новая запись",
      "bookingSubmitted": "✓ Запись отправлена",
      "crm": "Запись CRM",
      "customerRecord": "Карточка клиента",
      "waConfirm": "Подтверждение WhatsApp",
      "waNotConfigured": "WhatsApp не настроен в этом манифесте",
      "emailConfirm": "Подтверждение Email",
      "emailNotEnabled": "Email-уведомления не включены в этом манифесте",
      "review": "Запрос отзыва",
      "reviewNotEnabled": "Запрос отзыва не включён в потоке отзывов манифеста",
      "reviews": "Google Reviews",
      "clients": "Новые клиенты — Цикл роста",
      "visitWebsite": "Перейти на сайт",
      "bookNow": "Записаться",
      "services": "Услуги",
      "confirmed": "Подтверждено",
      "source": "Онлайн-запись",
      "dear": "Здравствуйте, Алекс,",
      "apptConfirmed": "Ваша запись подтверждена.",
      "leaveReview": "Оставить отзыв в Google →",
      "afterVisit": "после визита",
      "scheduled": "Запланировано · ✓✓",
      "crmFields": {
        "service": "Услуга",
        "client": "Клиент",
        "phone": "Телефон",
        "date": "Дата",
        "name": "Имя",
        "source": "Источник",
        "channel": "Канал",
        "location": "Город"
      },
      "stats": {
        "newBookings": "Новых записей в этом месяце",
        "fromMaps": "Из Google Maps",
        "repeatClients": "Повторные клиенты",
        "rating": "Рейтинг отзывов"
      }
    }
  }
}
`,Fx=`@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  *, *::before, *::after { box-sizing: border-box; }
  body {
    background-color: #F7F8FC;
    color: #111827;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(108,59,255,0.25); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(108,59,255,0.45); }
}

@layer utilities {
  /* ── Gradient text ───────────────────────────────────────────────────────── */
  .gradient-text {
    background: linear-gradient(135deg, #6C3BFF 0%, #00D4FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Glass morphism ─────────────────────────────────────────────────────── */
  .glass {
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  .glass-light {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  /* ── Brand gradient border ──────────────────────────────────────────────── */
  .gradient-border {
    position: relative;
  }
  .gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, #6C3BFF, #00D4FF);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  /* ── Shimmer loading bar ────────────────────────────────────────────────── */
  .shimmer-bar {
    background: linear-gradient(
      90deg,
      rgba(108,59,255,0) 0%,
      rgba(108,59,255,0.35) 50%,
      rgba(0,212,255,0.35) 75%,
      rgba(0,212,255,0) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2.4s linear infinite;
  }

  /* ── Staggered animation delays ─────────────────────────────────────────── */
  .delay-75  { animation-delay: 75ms;  }
  .delay-150 { animation-delay: 150ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }
  .delay-500 { animation-delay: 500ms; }
}
`,Lx=`import type { Manifest } from '../types/manifest';

export type AppMode = 'studio' | 'product';

export interface FactoryBootstrap {
  clientId: string;
  mode: 'product';
  manifest: Manifest;
  siteUrl?: string;
  firebaseReady?: boolean;
}

declare global {
  interface Window {
    __FACTORY_BOOTSTRAP__?: FactoryBootstrap;
    __CRM_DEMO_CLIENT_ID__?: string;
  }
}

export function getFactoryBootstrap(): FactoryBootstrap | null {
  if (typeof window === 'undefined') return null;
  const boot = window.__FACTORY_BOOTSTRAP__;
  if (boot?.mode === 'product' && boot.manifest && boot.clientId) {
    return boot;
  }
  return null;
}

export function getAppMode(): AppMode {
  return getFactoryBootstrap() ? 'product' : 'studio';
}

export function isProductMode(): boolean {
  return getAppMode() === 'product';
}

export function getStorageKey(): string {
  const boot = getFactoryBootstrap();
  if (boot) return \`factory_crm_\${boot.clientId}\`;
  return 'factory_project';
}
`,Ox=`import type { Manifest, ManifestBranding } from '../types/manifest';

export function buildDefaultBranding(manifest: Manifest): ManifestBranding {
  return {
    businessNameOverride: manifest.business.name,
    phoneOverride: manifest.business.phone,
    whatsappOverride: manifest.business.whatsapp,
    emailOverride: manifest.business.email,
  };
}

export function getDisplayBusinessName(manifest: Manifest): string {
  return manifest.branding?.businessNameOverride ?? manifest.business.name;
}

export function getDisplayPhone(manifest: Manifest): string | undefined {
  return manifest.branding?.phoneOverride ?? manifest.business.phone;
}

export function getDisplayWhatsapp(manifest: Manifest): string | undefined {
  return manifest.branding?.whatsappOverride ?? manifest.business.whatsapp;
}

export function getDisplayEmail(manifest: Manifest): string | undefined {
  return manifest.branding?.emailOverride ?? manifest.business.email;
}

export function getDisplayLogo(manifest: Manifest): string | undefined {
  return manifest.branding?.logoDataUrl;
}
`,Wx=`import type { CrmModuleKey, Language } from '../types/manifest';

export interface CrmModuleDefinition {
  key: CrmModuleKey;
  label: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  required: boolean;
}

const CRM_MODULE_REGISTRY: Record<CrmModuleKey, CrmModuleDefinition> = {
  dashboard: {
    key: 'dashboard',
    label: { en: 'Dashboard', de: 'Dashboard', ru: 'Дашборд' },
    description: {
      en: 'Overview of key metrics and activity',
      de: 'Übersicht der wichtigsten Kennzahlen',
      ru: 'Обзор ключевых метрик и активности',
    },
    icon: 'LayoutDashboard',
    required: true,
  },
  customers: {
    key: 'customers',
    label: { en: 'Customers', de: 'Kunden', ru: 'Клиенты' },
    description: {
      en: 'Customer database and history',
      de: 'Kundendatenbank und Verlauf',
      ru: 'База клиентов и история',
    },
    icon: 'Users',
    required: true,
  },
  bookings: {
    key: 'bookings',
    label: { en: 'Bookings', de: 'Buchungen', ru: 'Записи' },
    description: {
      en: 'Appointment list and management',
      de: 'Terminliste und Verwaltung',
      ru: 'Список записей и управление',
    },
    icon: 'CalendarCheck',
    required: true,
  },
  services: {
    key: 'services',
    label: { en: 'Services', de: 'Leistungen', ru: 'Услуги' },
    description: {
      en: 'Service catalog with prices and durations',
      de: 'Leistungskatalog mit Preisen und Dauer',
      ru: 'Каталог услуг с ценами и длительностью',
    },
    icon: 'Briefcase',
    required: true,
  },
  calendar: {
    key: 'calendar',
    label: { en: 'Calendar', de: 'Kalender', ru: 'Календарь' },
    description: {
      en: 'Visual appointment calendar',
      de: 'Visueller Terminkalender',
      ru: 'Визуальный календарь записей',
    },
    icon: 'Calendar',
    required: false,
  },
  employees: {
    key: 'employees',
    label: { en: 'Employees', de: 'Mitarbeiter', ru: 'Сотрудники' },
    description: {
      en: 'Staff roster and schedules',
      de: 'Mitarbeiterliste und Zeitpläne',
      ru: 'Список сотрудников и расписание',
    },
    icon: 'UserCog',
    required: false,
  },
  notifications: {
    key: 'notifications',
    label: { en: 'Notifications', de: 'Benachrichtigungen', ru: 'Уведомления' },
    description: {
      en: 'WhatsApp and email notification log',
      de: 'WhatsApp- und E-Mail-Benachrichtigungsprotokoll',
      ru: 'Журнал уведомлений WhatsApp и email',
    },
    icon: 'Bell',
    required: false,
  },
  settings: {
    key: 'settings',
    label: { en: 'Settings', de: 'Einstellungen', ru: 'Настройки' },
    description: {
      en: 'Business profile and system configuration',
      de: 'Unternehmensprofil und Systemkonfiguration',
      ru: 'Профиль компании и настройки системы',
    },
    icon: 'Settings',
    required: true,
  },
  review_requests: {
    key: 'review_requests',
    label: { en: 'Review Requests', de: 'Bewertungsanfragen', ru: 'Запросы отзывов' },
    description: {
      en: 'Automated Google review request campaigns',
      de: 'Automatisierte Google-Bewertungsanfragen',
      ru: 'Автоматические запросы отзывов на Google',
    },
    icon: 'Star',
    required: false,
  },
};

export function getCrmModule(key: CrmModuleKey): CrmModuleDefinition {
  const module = CRM_MODULE_REGISTRY[key];
  if (!module) throw new Error(\`Library key not found: CRM module "\${key}"\`);
  return module;
}

export function getCrmModules(keys: CrmModuleKey[]): CrmModuleDefinition[] {
  return keys.map(getCrmModule);
}

export { CRM_MODULE_REGISTRY };
`,Ux=`import type { Manifest } from '../types/manifest';
import type { CrmEntities } from '../store/crmTypes';
import { emptyCrmEntities } from './crmSeed';

export const CRM_EXPORT_SCHEMA = 'factory-crm-export/1.0' as const;

export interface CrmExportPayload {
  schema: typeof CRM_EXPORT_SCHEMA;
  exportedAt: string;
  manifest: Manifest;
  entities: CrmEntities;
  questionnaire?: unknown;
  step?: string;
}

export function exportProjectJson(input: {
  manifest: Manifest;
  entities: CrmEntities;
  questionnaire?: unknown;
  step?: string;
}): string {
  const payload: CrmExportPayload = {
    schema: CRM_EXPORT_SCHEMA,
    exportedAt: new Date().toISOString(),
    manifest: input.manifest,
    entities: input.entities,
    questionnaire: input.questionnaire,
    step: input.step,
  };
  return JSON.stringify(payload, null, 2);
}

export function importProjectJson(raw: string): CrmExportPayload {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON');
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid export payload');
  }
  const obj = parsed as Partial<CrmExportPayload>;
  if (obj.schema !== CRM_EXPORT_SCHEMA) {
    throw new Error(\`Unsupported schema: \${String(obj.schema)}\`);
  }
  if (!obj.manifest || typeof obj.manifest !== 'object') {
    throw new Error('Missing manifest in export');
  }
  const entities = obj.entities && typeof obj.entities === 'object'
    ? { ...emptyCrmEntities(), ...obj.entities }
    : emptyCrmEntities();

  return {
    schema: CRM_EXPORT_SCHEMA,
    exportedAt: obj.exportedAt ?? new Date().toISOString(),
    manifest: obj.manifest as Manifest,
    entities,
    questionnaire: obj.questionnaire,
    step: obj.step,
  };
}

export function downloadJsonFile(filename: string, json: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
`,Hx=`import type { Manifest, SectorKey } from '../types/manifest';
import { getSectorContent } from '../pages/website-demo/sectorContent';
import { getCrmVocabulary } from './crmVocabulary';
import type {
  CrmAppointment,
  CrmClient,
  CrmResource,
  CrmServiceItem,
  CrmStaffMember,
  CrmEntities,
} from '../store/crmTypes';

function id(prefix: string): string {
  return \`\${prefix}_\${crypto.randomUUID().slice(0, 8)}\`;
}

function staffForSector(sector: SectorKey | string): Omit<CrmStaffMember, 'id'>[] {
  const s = String(sector);
  if (s === 'restaurant') {
    return [
      { name: 'Marco Rossi', role: 'Head Chef', phone: '+49 170 1001001', email: 'chef@example.com', active: true },
      { name: 'Elena Schmidt', role: 'Front of House', phone: '+49 170 1001002', email: 'foh@example.com', active: true },
      { name: 'Jonas Weber', role: 'Sous Chef', phone: '+49 170 1001003', active: true },
    ];
  }
  if (s === 'hotel') {
    return [
      { name: 'Anna Müller', role: 'Front Desk Manager', phone: '+49 170 2002001', email: 'desk@example.com', active: true },
      { name: 'David Chen', role: 'Housekeeping Lead', phone: '+49 170 2002002', active: true },
      { name: 'Sofia Berg', role: 'Concierge', phone: '+49 170 2002003', email: 'concierge@example.com', active: true },
    ];
  }
  if (s === 'beauty_salon' || s === 'barber' || s === 'massage') {
    return [
      { name: 'Lara Kim', role: 'Master Stylist', phone: '+49 170 3003001', email: 'lara@example.com', active: true },
      { name: 'Nina Volkov', role: 'Color Specialist', phone: '+49 170 3003002', active: true },
      { name: 'Mia Hoffmann', role: 'Nail Artist', phone: '+49 170 3003003', active: true },
    ];
  }
  if (s === 'dental_clinic') {
    return [
      { name: 'Dr. Peter Braun', role: 'Dentist', phone: '+49 170 4004001', email: 'braun@example.com', active: true },
      { name: 'Dr. Iris Lang', role: 'Orthodontist', phone: '+49 170 4004002', email: 'lang@example.com', active: true },
      { name: 'Clara Weiss', role: 'Hygienist', phone: '+49 170 4004003', active: true },
    ];
  }
  if (s === 'fitness' || s === 'fitness_club') {
    return [
      { name: 'Alex Rivera', role: 'Head Trainer', phone: '+49 170 5005001', email: 'alex@example.com', active: true },
      { name: 'Sam Ortiz', role: 'Yoga Instructor', phone: '+49 170 5005002', active: true },
      { name: 'Jordan Lee', role: 'Strength Coach', phone: '+49 170 5005003', active: true },
    ];
  }
  if (s === 'auto_service' || s === 'car_service' || s === 'workshop') {
    return [
      { name: 'Tom Keller', role: 'Lead Mechanic', phone: '+49 170 6006001', email: 'tom@example.com', active: true },
      { name: 'Ralf Stein', role: 'Diagnostic Tech', phone: '+49 170 6006002', active: true },
      { name: 'Uwe Brandt', role: 'Service Advisor', phone: '+49 170 6006003', active: true },
    ];
  }
  return [
    { name: 'Alex Manager', role: 'Manager', phone: '+49 170 7007001', email: 'manager@example.com', active: true },
    { name: 'Sam Specialist', role: 'Specialist', phone: '+49 170 7007002', active: true },
    { name: 'Jordan Assistant', role: 'Assistant', phone: '+49 170 7007003', active: true },
  ];
}

function resourcesForSector(sector: SectorKey | string): Omit<CrmResource, 'id'>[] {
  const vocab = getCrmVocabulary(sector);
  const label = vocab.resourceSingular.en;
  if (sector === 'restaurant') {
    return [
      { name: 'Table 1', capacity: 2, status: 'available', notes: 'Window' },
      { name: 'Table 2', capacity: 4, status: 'available', notes: 'Garden view' },
      { name: 'Table 3', capacity: 6, status: 'occupied', notes: 'Private corner' },
      { name: 'Table 4', capacity: 8, status: 'available', notes: 'Banquet' },
    ];
  }
  if (sector === 'hotel') {
    return [
      { name: 'Room 101', capacity: 2, status: 'available', notes: 'Standard Twin' },
      { name: 'Room 205', capacity: 2, status: 'occupied', notes: 'Deluxe King' },
      { name: 'Suite 301', capacity: 4, status: 'available', notes: 'Family Suite' },
      { name: 'Room 110', capacity: 1, status: 'maintenance', notes: 'Single' },
    ];
  }
  if (sector === 'fitness' || sector === 'fitness_club') {
    return [
      { name: 'Studio A', capacity: 20, status: 'available', notes: 'Group classes' },
      { name: 'Studio B', capacity: 12, status: 'available', notes: 'Yoga' },
      { name: 'PT Room 1', capacity: 2, status: 'occupied', notes: 'Personal training' },
    ];
  }
  if (sector === 'auto_service' || sector === 'car_service' || sector === 'workshop') {
    return [
      { name: 'Bay 1', capacity: 1, status: 'available', notes: 'General service' },
      { name: 'Bay 2', capacity: 1, status: 'occupied', notes: 'Diagnostics' },
      { name: 'Bay 3', capacity: 1, status: 'available', notes: 'Tire & alignment' },
    ];
  }
  if (vocab.hasResources || sector === 'dental_clinic' || sector === 'beauty_salon' || sector === 'barber' || sector === 'massage') {
    return [
      { name: \`\${label} 1\`, capacity: 1, status: 'available' },
      { name: \`\${label} 2\`, capacity: 1, status: 'available' },
      { name: \`\${label} 3\`, capacity: 1, status: 'occupied' },
    ];
  }
  return [
    { name: \`\${label} 1\`, capacity: 1, status: 'available' },
    { name: \`\${label} 2\`, capacity: 1, status: 'available' },
  ];
}

function clientsSeed(): Omit<CrmClient, 'id' | 'createdAt'>[] {
  return [
    { name: 'Sophie Martin', phone: '+49 151 1111111', email: 'sophie@example.com', notes: 'VIP' },
    { name: 'Carlos Rivera', phone: '+49 151 2222222', email: 'carlos@example.com' },
    { name: 'Anna Kowalski', phone: '+49 151 3333333', email: 'anna@example.com', notes: 'Prefers mornings' },
    { name: 'Thomas Berg', phone: '+49 151 4444444' },
  ];
}

function tomorrowIsoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/** Build niche-specific seed entities for CRM. Never returns empty catalogs. */
export function buildCrmSeed(manifest: Manifest): CrmEntities {
  const sector = manifest.business.sector;
  const content = getSectorContent(sector);
  const now = new Date().toISOString();

  const services: CrmServiceItem[] = content.services.map(s => ({
    id: id('svc'),
    name: s.name,
    description: s.desc,
    price: s.price,
    durationMinutes: 60,
    active: true,
  }));

  while (services.length < 3) {
    services.push({
      id: id('svc'),
      name: \`Service \${services.length + 1}\`,
      description: 'Professional service package',
      price: 'from €49',
      durationMinutes: 45,
      active: true,
    });
  }

  const staff: CrmStaffMember[] = staffForSector(sector).map(s => ({ ...s, id: id('staff') }));
  const resources: CrmResource[] = resourcesForSector(sector).map(r => ({ ...r, id: id('res') }));
  const clients: CrmClient[] = clientsSeed().map(c => ({ ...c, id: id('cli'), createdAt: now }));

  const appointments: CrmAppointment[] = [
    {
      id: id('apt'),
      clientId: clients[0].id,
      clientName: clients[0].name,
      clientPhone: clients[0].phone,
      serviceId: services[0].id,
      serviceName: services[0].name,
      staffId: staff[0]?.id,
      resourceId: resources[0]?.id,
      date: tomorrowIsoDate(0),
      time: '10:00',
      status: 'Confirmed',
      notes: 'Seed appointment',
      createdAt: now,
    },
    {
      id: id('apt'),
      clientId: clients[1].id,
      clientName: clients[1].name,
      clientPhone: clients[1].phone,
      serviceId: services[1]?.id ?? services[0].id,
      serviceName: services[1]?.name ?? services[0].name,
      staffId: staff[1]?.id ?? staff[0]?.id,
      date: tomorrowIsoDate(1),
      time: '14:30',
      status: 'Pending',
      createdAt: now,
    },
    {
      id: id('apt'),
      clientId: clients[2].id,
      clientName: clients[2].name,
      clientPhone: clients[2].phone,
      serviceId: services[2]?.id ?? services[0].id,
      serviceName: services[2]?.name ?? services[0].name,
      date: tomorrowIsoDate(2),
      time: '11:15',
      status: 'Confirmed',
      createdAt: now,
    },
  ];

  return {
    appointments,
    clients,
    services,
    resources,
    staff,
    settings: {
      businessName: manifest.business.name,
      phone: manifest.business.phone,
      email: manifest.business.email,
      whatsapp: manifest.business.whatsapp,
      city: manifest.business.city,
      storageBackend: 'local',
      firebaseReady: Boolean(manifest.delivery?.firebaseConfigMock?.projectId),
    },
  };
}

export function emptyCrmEntities(): CrmEntities {
  return {
    appointments: [],
    clients: [],
    services: [],
    resources: [],
    staff: [],
    settings: {
      businessName: '',
      phone: '',
      email: '',
      storageBackend: 'local',
      firebaseReady: false,
    },
  };
}
`,qx=`import type { Language, SectorKey } from '../types/manifest';

export type CrmTabKey =
  | 'dashboard'
  | 'appointments'
  | 'clients'
  | 'services'
  | 'resources'
  | 'staff'
  | 'settings';

export interface CrmTabLabels {
  dashboard: string;
  appointments: string;
  clients: string;
  services: string;
  resources: string;
  staff: string;
  settings: string;
}

export interface CrmVocabulary {
  key: string;
  tabs: Record<Language, CrmTabLabels>;
  /** Lucide icon names for tabs */
  icons: Record<CrmTabKey, string>;
  /** Whether resources tab is shown (tables/rooms) */
  hasResources: boolean;
  resourceSingular: Record<Language, string>;
  appointmentStatusHint: Record<Language, string>;
}

const SETTINGS_EN = 'Settings';
const SETTINGS_DE = 'Einstellungen';
const SETTINGS_RU = 'Настройки';
const DASH_EN = 'Dashboard';
const DASH_DE = 'Dashboard';
const DASH_RU = 'Дашборд';

const VOCABULARIES: Record<string, CrmVocabulary> = {
  restaurant: {
    key: 'restaurant',
    hasResources: true,
    resourceSingular: { en: 'Table', de: 'Tisch', ru: 'Стол' },
    appointmentStatusHint: { en: 'Reservation status', de: 'Reservierungsstatus', ru: 'Статус брони' },
    icons: {
      dashboard: 'LayoutDashboard',
      appointments: 'CalendarCheck',
      clients: 'Users',
      services: 'UtensilsCrossed',
      resources: 'LayoutGrid',
      staff: 'UserCog',
      settings: 'Settings',
    },
    tabs: {
      en: {
        dashboard: DASH_EN,
        appointments: 'Reservations',
        clients: 'Guests',
        services: 'Menu',
        resources: 'Tables',
        staff: 'Staff',
        settings: SETTINGS_EN,
      },
      de: {
        dashboard: DASH_DE,
        appointments: 'Reservierungen',
        clients: 'Gäste',
        services: 'Menü',
        resources: 'Tische',
        staff: 'Personal',
        settings: SETTINGS_DE,
      },
      ru: {
        dashboard: DASH_RU,
        appointments: 'Бронирования',
        clients: 'Гости',
        services: 'Меню',
        resources: 'Столы',
        staff: 'Персонал',
        settings: SETTINGS_RU,
      },
    },
  },

  hotel: {
    key: 'hotel',
    hasResources: true,
    resourceSingular: { en: 'Room', de: 'Zimmer', ru: 'Номер' },
    appointmentStatusHint: { en: 'Booking status', de: 'Buchungsstatus', ru: 'Статус бронирования' },
    icons: {
      dashboard: 'LayoutDashboard',
      appointments: 'CalendarCheck',
      clients: 'Users',
      services: 'Briefcase',
      resources: 'BedDouble',
      staff: 'UserCog',
      settings: 'Settings',
    },
    tabs: {
      en: {
        dashboard: DASH_EN,
        appointments: 'Bookings',
        clients: 'Guests',
        services: 'Services',
        resources: 'Rooms',
        staff: 'Staff',
        settings: SETTINGS_EN,
      },
      de: {
        dashboard: DASH_DE,
        appointments: 'Buchungen',
        clients: 'Gäste',
        services: 'Leistungen',
        resources: 'Zimmer',
        staff: 'Personal',
        settings: SETTINGS_DE,
      },
      ru: {
        dashboard: DASH_RU,
        appointments: 'Бронирования',
        clients: 'Гости',
        services: 'Услуги',
        resources: 'Номера',
        staff: 'Персонал',
        settings: SETTINGS_RU,
      },
    },
  },

  beauty_salon: {
    key: 'beauty_salon',
    hasResources: false,
    resourceSingular: { en: 'Station', de: 'Platz', ru: 'Место' },
    appointmentStatusHint: { en: 'Appointment status', de: 'Terminstatus', ru: 'Статус записи' },
    icons: {
      dashboard: 'LayoutDashboard',
      appointments: 'CalendarCheck',
      clients: 'Users',
      services: 'Sparkles',
      resources: 'LayoutGrid',
      staff: 'UserCog',
      settings: 'Settings',
    },
    tabs: {
      en: {
        dashboard: DASH_EN,
        appointments: 'Appointments',
        clients: 'Clients',
        services: 'Services',
        resources: 'Stations',
        staff: 'Masters',
        settings: SETTINGS_EN,
      },
      de: {
        dashboard: DASH_DE,
        appointments: 'Termine',
        clients: 'Kunden',
        services: 'Leistungen',
        resources: 'Plätze',
        staff: 'Meister',
        settings: SETTINGS_DE,
      },
      ru: {
        dashboard: DASH_RU,
        appointments: 'Записи',
        clients: 'Клиенты',
        services: 'Услуги',
        resources: 'Места',
        staff: 'Мастера',
        settings: SETTINGS_RU,
      },
    },
  },

  dental_clinic: {
    key: 'dental_clinic',
    hasResources: false,
    resourceSingular: { en: 'Chair', de: 'Stuhl', ru: 'Кресло' },
    appointmentStatusHint: { en: 'Appointment status', de: 'Terminstatus', ru: 'Статус приёма' },
    icons: {
      dashboard: 'LayoutDashboard',
      appointments: 'CalendarCheck',
      clients: 'Users',
      services: 'Stethoscope',
      resources: 'LayoutGrid',
      staff: 'UserCog',
      settings: 'Settings',
    },
    tabs: {
      en: {
        dashboard: DASH_EN,
        appointments: 'Appointments',
        clients: 'Patients',
        services: 'Procedures',
        resources: 'Chairs',
        staff: 'Doctors',
        settings: SETTINGS_EN,
      },
      de: {
        dashboard: DASH_DE,
        appointments: 'Termine',
        clients: 'Patienten',
        services: 'Behandlungen',
        resources: 'Stühle',
        staff: 'Ärzte',
        settings: SETTINGS_DE,
      },
      ru: {
        dashboard: DASH_RU,
        appointments: 'Приёмы',
        clients: 'Пациенты',
        services: 'Процедуры',
        resources: 'Кресла',
        staff: 'Врачи',
        settings: SETTINGS_RU,
      },
    },
  },

  fitness: {
    key: 'fitness',
    hasResources: true,
    resourceSingular: { en: 'Studio', de: 'Studio', ru: 'Зал' },
    appointmentStatusHint: { en: 'Class / session status', de: 'Kursstatus', ru: 'Статус занятия' },
    icons: {
      dashboard: 'LayoutDashboard',
      appointments: 'CalendarCheck',
      clients: 'Users',
      services: 'Dumbbell',
      resources: 'LayoutGrid',
      staff: 'UserCog',
      settings: 'Settings',
    },
    tabs: {
      en: {
        dashboard: DASH_EN,
        appointments: 'Sessions',
        clients: 'Members',
        services: 'Programs',
        resources: 'Studios',
        staff: 'Trainers',
        settings: SETTINGS_EN,
      },
      de: {
        dashboard: DASH_DE,
        appointments: 'Sessions',
        clients: 'Mitglieder',
        services: 'Programme',
        resources: 'Studios',
        staff: 'Trainer',
        settings: SETTINGS_DE,
      },
      ru: {
        dashboard: DASH_RU,
        appointments: 'Занятия',
        clients: 'Участники',
        services: 'Программы',
        resources: 'Залы',
        staff: 'Тренеры',
        settings: SETTINGS_RU,
      },
    },
  },

  auto_service: {
    key: 'auto_service',
    hasResources: true,
    resourceSingular: { en: 'Bay', de: 'Box', ru: 'Бокс' },
    appointmentStatusHint: { en: 'Service order status', de: 'Auftragsstatus', ru: 'Статус заказа' },
    icons: {
      dashboard: 'LayoutDashboard',
      appointments: 'CalendarCheck',
      clients: 'Users',
      services: 'Wrench',
      resources: 'LayoutGrid',
      staff: 'UserCog',
      settings: 'Settings',
    },
    tabs: {
      en: {
        dashboard: DASH_EN,
        appointments: 'Orders',
        clients: 'Customers',
        services: 'Services',
        resources: 'Bays',
        staff: 'Mechanics',
        settings: SETTINGS_EN,
      },
      de: {
        dashboard: DASH_DE,
        appointments: 'Aufträge',
        clients: 'Kunden',
        services: 'Leistungen',
        resources: 'Boxen',
        staff: 'Mechaniker',
        settings: SETTINGS_DE,
      },
      ru: {
        dashboard: DASH_RU,
        appointments: 'Заказы',
        clients: 'Клиенты',
        services: 'Услуги',
        resources: 'Боксы',
        staff: 'Механики',
        settings: SETTINGS_RU,
      },
    },
  },
};

const DEFAULT_VOCAB: CrmVocabulary = {
  key: 'default',
  hasResources: false,
  resourceSingular: { en: 'Resource', de: 'Ressource', ru: 'Ресурс' },
  appointmentStatusHint: { en: 'Appointment status', de: 'Terminstatus', ru: 'Статус записи' },
  icons: {
    dashboard: 'LayoutDashboard',
    appointments: 'CalendarCheck',
    clients: 'Users',
    services: 'Briefcase',
    resources: 'LayoutGrid',
    staff: 'UserCog',
    settings: 'Settings',
  },
  tabs: {
    en: {
      dashboard: DASH_EN,
      appointments: 'Appointments',
      clients: 'Clients',
      services: 'Services',
      resources: 'Resources',
      staff: 'Staff',
      settings: SETTINGS_EN,
    },
    de: {
      dashboard: DASH_DE,
      appointments: 'Termine',
      clients: 'Kunden',
      services: 'Leistungen',
      resources: 'Ressourcen',
      staff: 'Mitarbeiter',
      settings: SETTINGS_DE,
    },
    ru: {
      dashboard: DASH_RU,
      appointments: 'Записи',
      clients: 'Клиенты',
      services: 'Услуги',
      resources: 'Ресурсы',
      staff: 'Сотрудники',
      settings: SETTINGS_RU,
    },
  },
};

/** Map aliases used by funnel businessType → Factory sector vocabulary */
const ALIASES: Record<string, string> = {
  fitness_club: 'fitness',
  car_service: 'auto_service',
  workshop: 'auto_service',
  barber: 'beauty_salon',
  massage: 'beauty_salon',
};

export function getCrmVocabulary(sector: SectorKey | string): CrmVocabulary {
  const key = String(sector || '').toLowerCase();
  const resolved = ALIASES[key] ?? key;
  return VOCABULARIES[resolved] ?? DEFAULT_VOCAB;
}

export function getCrmTabLabels(
  sector: SectorKey | string,
  language: Language = 'en',
): CrmTabLabels {
  const vocab = getCrmVocabulary(sector);
  return vocab.tabs[language] ?? vocab.tabs.en;
}

export function resolveVocabularyKey(sector: SectorKey | string): string {
  return getCrmVocabulary(sector).key;
}
`,zx=`import type { UILanguage } from './i18n';

const WHATSAPP_NUMBER = '4915258400610';

const FIREBASE_WHATSAPP_MESSAGES: Record<UILanguage, string> = {
  ru: 'Здравствуйте! Хочу подключить облачное хранение Firebase для моего Website+CRM.',
  en: "Hi! I'd like to connect Firebase cloud storage for my Website+CRM.",
  de: 'Hallo! Ich möchte Firebase-Cloud-Speicher für meine Website+CRM anschließen.',
};

export function buildFirebaseWhatsAppUrl(language: UILanguage): string {
  const text = FIREBASE_WHATSAPP_MESSAGES[language] ?? FIREBASE_WHATSAPP_MESSAGES.en;
  return \`https://wa.me/\${WHATSAPP_NUMBER}?text=\${encodeURIComponent(text)}\`;
}

export function openFirebaseWhatsAppChat(language: UILanguage): void {
  window.open(buildFirebaseWhatsAppUrl(language), '_blank', 'noopener,noreferrer');
}
`,$x=`import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import en from '../i18n/en.json';
import ru from '../i18n/ru.json';
import de from '../i18n/de.json';

export type UILanguage = 'en' | 'ru' | 'de';

const TRANSLATIONS: Record<UILanguage, typeof en> = { en, ru: ru as typeof en, de: de as typeof en };

interface I18nCtx {
  t: typeof en;
  language: UILanguage;
  setLanguage: (l: UILanguage) => void;
}

const I18nContext = createContext<I18nCtx>({
  t: en,
  language: 'en',
  setLanguage: () => undefined,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageSt] = useState<UILanguage>(() => {
    const stored = localStorage.getItem('factory_ui_lang');
    return (stored === 'ru' || stored === 'de' || stored === 'en') ? stored : 'en';
  });

  const setLanguage = useCallback((l: UILanguage) => {
    localStorage.setItem('factory_ui_lang', l);
    setLanguageSt(l);
  }, []);

  return (
    <I18nContext.Provider value={{ t: TRANSLATIONS[language], language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslations() {
  return useContext(I18nContext);
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslations();
  const langs: UILanguage[] = ['en', 'ru', 'de'];
  return (
    <div className="flex items-center gap-1">
      {langs.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-white/20 text-xs">|</span>}
          <button
            onClick={() => setLanguage(l)}
            className={\`text-xs font-bold transition-colors px-1 \${
              language === l ? 'text-white' : 'text-white/35 hover:text-white/70'
            }\`}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
`,Gx=`const DEFAULT_MAX_EDGE = 1200;
const DEFAULT_QUALITY = 0.82;

/** Resize and compress an image file to a JPEG data URL for localStorage. */
export function compressImageFile(
  file: File,
  maxEdge = DEFAULT_MAX_EDGE,
  quality = DEFAULT_QUALITY,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not available'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
`,Kx=`import { getImageSource } from './imageSources';
import type { ImageSourceDefinition } from './imageSources';
import { getSector } from './sectors';
import type { Manifest, ManifestBranding } from '../types/manifest';

function mergeImageArray(base: string[], overrides?: string[]): string[] {
  if (!overrides) return [...base];
  return base.map((url, index) => overrides[index] ?? url);
}

export function resolveImages(
  baseImages: ImageSourceDefinition,
  overrides?: ManifestBranding['photoOverrides'],
): ImageSourceDefinition {
  if (!overrides) return { ...baseImages };

  return {
    ...baseImages,
    hero: overrides.hero ?? baseImages.hero,
    about: overrides.about ?? baseImages.about,
    gallery: mergeImageArray(baseImages.gallery, overrides.gallery),
    services: mergeImageArray(baseImages.services, overrides.services),
  };
}

export function getBaseImagesForManifest(manifest: Manifest): ImageSourceDefinition {
  try {
    return getImageSource(manifest.website.imageSourceKey);
  } catch {
    try {
      const sector = getSector(manifest.business.sector);
      return getImageSource(sector.imageSourceKey);
    } catch {
      return getImageSource('pexels_office');
    }
  }
}
`,Vx=`import type { SectorKey } from '../types/manifest';

export interface ImageSourceDefinition {
  key: string;
  hero: string;
  about: string;
  gallery: string[];
  services: string[];
}

const IMAGE_SOURCE_REGISTRY: Record<string, ImageSourceDefinition> = {
  pexels_restaurant: {
    key: 'pexels_restaurant',
    hero: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
  pexels_dental: {
    key: 'pexels_dental',
    hero: 'https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/6502152/pexels-photo-6502152.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4269694/pexels-photo-4269694.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/6502153/pexels-photo-6502153.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
  pexels_beauty: {
    key: 'pexels_beauty',
    hero: 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3761509/pexels-photo-3761509.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/3997392/pexels-photo-3997392.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3738347/pexels-photo-3738347.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3993467/pexels-photo-3993467.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
  pexels_fitness: {
    key: 'pexels_fitness',
    hero: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/703016/pexels-photo-703016.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/1978505/pexels-photo-1978505.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
  pexels_barber: {
    key: 'pexels_barber',
    hero: 'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1805600/pexels-photo-1805600.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2531736/pexels-photo-2531736.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/2173872/pexels-photo-2173872.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3998429/pexels-photo-3998429.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
  pexels_massage: {
    key: 'pexels_massage',
    hero: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3757954/pexels-photo-3757954.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3997990/pexels-photo-3997990.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3865670/pexels-photo-3865670.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3757943/pexels-photo-3757943.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3760275/pexels-photo-3760275.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
  pexels_cleaning: {
    key: 'pexels_cleaning',
    hero: 'https://images.pexels.com/photos/4099354/pexels-photo-4099354.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/4107279/pexels-photo-4107279.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4107112/pexels-photo-4107112.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6195122/pexels-photo-6195122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/4099356/pexels-photo-4099356.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/4107281/pexels-photo-4107281.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/4099358/pexels-photo-4099358.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
  pexels_auto: {
    key: 'pexels_auto',
    hero: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3862127/pexels-photo-3862127.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4315559/pexels-photo-4315559.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3846205/pexels-photo-3846205.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/4315560/pexels-photo-4315560.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3807465/pexels-photo-3807465.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3807570/pexels-photo-3807570.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
  pexels_hotel: {
    key: 'pexels_hotel',
    hero: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
  pexels_education: {
    key: 'pexels_education',
    hero: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
  pexels_real_estate: {
    key: 'pexels_real_estate',
    hero: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
  pexels_construction: {
    key: 'pexels_construction',
    hero: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1275393/pexels-photo-1275393.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1463917/pexels-photo-1463917.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
  pexels_office: {
    key: 'pexels_office',
    hero: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600',
    about: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: [
      'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  },
};

export function getImageSource(key: string): ImageSourceDefinition {
  const source = IMAGE_SOURCE_REGISTRY[key];
  if (!source) throw new Error(\`Library key not found: image source "\${key}"\`);
  return source;
}

export function getImageSourceForSector(sector: SectorKey): ImageSourceDefinition {
  const keyMap: Record<SectorKey, string> = {
    restaurant: 'pexels_restaurant',
    dental_clinic: 'pexels_dental',
    beauty_salon: 'pexels_beauty',
    fitness: 'pexels_fitness',
    barber: 'pexels_barber',
    massage: 'pexels_massage',
    cleaning: 'pexels_cleaning',
    auto_service: 'pexels_auto',
    hotel: 'pexels_hotel',
    education: 'pexels_education',
    real_estate: 'pexels_real_estate',
    construction: 'pexels_construction',
    accounting: 'pexels_office',
    law_firm: 'pexels_office',
  };
  return getImageSource(keyMap[sector]);
}

export { IMAGE_SOURCE_REGISTRY };
`,Yx=`import type {
  Manifest,
  ManifestMetadata,
  QuestionnaireInput,
  ManifestValidationResult,
  ManifestValidationError,
  FirebaseConfigMock,
  ManifestReviewFlow,
  ManifestOwnership,
  ManifestDelivery,
} from '../types/manifest';
import { getSector } from './sectors';
import { getWebsiteSection } from './websiteSections';
import { getCrmModule } from './crmModules';
import { getTheme } from './themes';
import { getImageSource } from './imageSources';
import { resolveVocabularyKey } from './crmVocabulary';

// ─── Deterministic local ID (djb2 hash, no external deps) ────────────────────

function deterministicId(input: string, prefix: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
    hash = hash >>> 0;
  }
  return \`\${prefix}_\${hash.toString(16).padStart(8, '0')}\`;
}

// ─── Metadata builder ─────────────────────────────────────────────────────────

const ENGINE_VERSION = '1.0.0';
const MANIFEST_VERSION = '1.0.0';

function buildMetadata(input: QuestionnaireInput): ManifestMetadata {
  const now = new Date().toISOString();
  return {
    projectId: deterministicId(\`\${input.name}|\${input.sector}|\${input.city}\`, 'proj'),
    studioId: deterministicId(input.studioBrand, 'studio'),
    clientId: deterministicId(input.email, 'client'),
    createdAt: now,
    updatedAt: now,
    manifestVersion: MANIFEST_VERSION,
    engineVersion: ENGINE_VERSION,
  };
}

// ─── Firebase mock ────────────────────────────────────────────────────────────

function buildFirebaseMock(projectName: string): FirebaseConfigMock {
  const slug = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return {
    apiKey: 'AIzaSy-MOCK-KEY-REPLACE-WITH-REAL',
    authDomain: \`\${slug}.firebaseapp.com\`,
    projectId: slug,
    storageBucket: \`\${slug}.appspot.com\`,
    messagingSenderId: '000000000000',
    appId: '1:000000000000:web:0000000000000000000000',
  };
}

// ─── Review Flow builder (Req 7) ──────────────────────────────────────────────

function buildReviewFlow(input: QuestionnaireInput): ManifestReviewFlow {
  const hasWhatsapp = Boolean(input.whatsapp);

  return {
    enabled: true,
    googleMapsUrl: undefined,
    steps: [
      {
        stepKey: 'booking_confirmation',
        delayHours: 0,
        channel: 'internal',
        enabled: true,
      },
      {
        stepKey: 'crm_record',
        delayHours: 0,
        channel: 'internal',
        enabled: true,
      },
      {
        stepKey: 'whatsapp_followup',
        delayHours: 2,
        channel: 'whatsapp',
        enabled: hasWhatsapp,
      },
      {
        stepKey: 'email_followup',
        delayHours: 24,
        channel: 'email',
        enabled: true,
      },
      {
        stepKey: 'google_review_request',
        delayHours: 48,
        channel: 'email',
        enabled: true,
      },
    ],
  };
}

// ─── Delivery layer (Req 8) ───────────────────────────────────────────────────

function buildDelivery(input: QuestionnaireInput): ManifestDelivery {
  return {
    firebaseConfigMock: buildFirebaseMock(input.name),
    readmeSections: [
      'project_overview',
      'firebase_setup',
      'environment_variables',
      'deployment',
      'crm_access',
      'customization',
    ],
    actions: {
      zip: { status: 'mock', label: 'Download ZIP', mock: true },
      github: { status: 'mock', label: 'Push to GitHub', mock: true },
      firebase: { status: 'mock', label: 'Connect Firebase', mock: true },
      deploy: { status: 'mock', label: 'Deploy to Hosting', mock: true },
    },
  };
}

// ─── Ownership builder (Req 10) ───────────────────────────────────────────────

function buildOwnership(input: QuestionnaireInput): ManifestOwnership {
  return {
    ownershipMode: input.ownershipMode,
    studioBrand: input.studioBrand,
    clientBrand: input.clientBrand,
    studioEmail: input.studioEmail,
    studioWebsite: input.studioWebsite,
  };
}

// ─── Main builder ─────────────────────────────────────────────────────────────

export function buildManifest(input: QuestionnaireInput): Manifest {
  const sector = getSector(input.sector);

  return {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    metadata: buildMetadata(input),
    ownership: buildOwnership(input),
    business: {
      name: input.name,
      sector: input.sector,
      city: input.city,
      language: input.language,
      phone: input.phone,
      whatsapp: input.whatsapp,
      email: input.email,
      website: input.website,
      instagram: input.instagram,
      facebook: input.facebook,
    },
    website: {
      sections: sector.defaultWebsiteSections,
      themeKey: sector.defaultTheme,
      imageSourceKey: sector.imageSourceKey,
    },
    crm: {
      modules: sector.defaultCrmModules,
      bookingModule: sector.defaultBookingModule,
      reviewModule: sector.defaultReviewModule,
      notificationChannels: sector.defaultNotificationChannels,
      reviewFlow: buildReviewFlow(input),
      vocabularyKey: resolveVocabularyKey(input.sector),
    },
    delivery: buildDelivery(input),
  };
}

// ─── Validator ────────────────────────────────────────────────────────────────

export function validateManifest(manifest: Manifest): ManifestValidationResult {
  const errors: ManifestValidationError[] = [];

  if (!manifest.schemaVersion) {
    errors.push({ field: 'schemaVersion', message: 'schemaVersion is required' });
  }

  if (!manifest.metadata) {
    errors.push({ field: 'metadata', message: 'metadata block is required' });
  } else {
    const m = manifest.metadata;
    if (!m.projectId) errors.push({ field: 'metadata.projectId', message: 'metadata.projectId is required' });
    if (!m.studioId) errors.push({ field: 'metadata.studioId', message: 'metadata.studioId is required' });
    if (!m.clientId) errors.push({ field: 'metadata.clientId', message: 'metadata.clientId is required' });
    if (!m.createdAt) errors.push({ field: 'metadata.createdAt', message: 'metadata.createdAt is required' });
    if (!m.updatedAt) errors.push({ field: 'metadata.updatedAt', message: 'metadata.updatedAt is required' });
    if (!m.manifestVersion) errors.push({ field: 'metadata.manifestVersion', message: 'metadata.manifestVersion is required' });
    if (!m.engineVersion) errors.push({ field: 'metadata.engineVersion', message: 'metadata.engineVersion is required' });
  }

  if (!manifest.business.name?.trim()) {
    errors.push({ field: 'business.name', message: 'Business name is required' });
  }

  if (!manifest.business.email?.trim()) {
    errors.push({ field: 'business.email', message: 'Business email is required' });
  }

  if (!manifest.ownership?.studioBrand?.trim()) {
    errors.push({ field: 'ownership.studioBrand', message: 'Studio brand is required' });
  }

  if (!manifest.ownership?.clientBrand?.trim()) {
    errors.push({ field: 'ownership.clientBrand', message: 'Client brand is required' });
  }

  try {
    getSector(manifest.business.sector);
  } catch {
    errors.push({ field: 'business.sector', message: \`Library key not found: sector "\${manifest.business.sector}"\` });
  }

  for (const sectionKey of manifest.website.sections) {
    try {
      getWebsiteSection(sectionKey);
    } catch {
      errors.push({ field: 'website.sections', message: \`Library key not found: website section "\${sectionKey}"\` });
    }
  }

  try {
    getTheme(manifest.website.themeKey);
  } catch {
    errors.push({ field: 'website.themeKey', message: \`Library key not found: theme "\${manifest.website.themeKey}"\` });
  }

  try {
    getImageSource(manifest.website.imageSourceKey);
  } catch {
    errors.push({ field: 'website.imageSourceKey', message: \`Library key not found: image source "\${manifest.website.imageSourceKey}"\` });
  }

  for (const moduleKey of manifest.crm.modules) {
    try {
      getCrmModule(moduleKey);
    } catch {
      errors.push({ field: 'crm.modules', message: \`Library key not found: CRM module "\${moduleKey}"\` });
    }
  }

  if (!manifest.crm.reviewFlow) {
    errors.push({ field: 'crm.reviewFlow', message: 'Review flow is required in manifest' });
  }

  if (!manifest.delivery?.actions) {
    errors.push({ field: 'delivery.actions', message: 'Delivery actions block is required' });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, manifest };
}

export function buildAndValidateManifest(input: QuestionnaireInput): ManifestValidationResult {
  try {
    const manifest = buildManifest(input);
    return validateManifest(manifest);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error during manifest build';
    return { valid: false, errors: [{ field: 'manifest', message }] };
  }
}
`,Jx=`export const PERMANENT_PROMO_CODE = 'serafim01';

export interface PromoRedeemResult {
  valid: boolean;
  permanent?: boolean;
  error?: string;
}

const INVALID_MESSAGE = {
  en: 'Invalid or already used promo code',
  de: 'Ungültiger oder bereits verwendeter Promo-Code',
  ru: 'Неверный или уже использованный промокод',
};

export function getPromoErrorMessage(language: 'en' | 'de' | 'ru'): string {
  return INVALID_MESSAGE[language];
}

export async function redeemPromoCode(code: string): Promise<PromoRedeemResult> {
  const trimmed = code.trim();
  if (!trimmed) {
    return { valid: false, error: 'empty' };
  }

  try {
    const res = await fetch('/.netlify/functions/redeem-promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: trimmed }),
    });

    const data = (await res.json()) as PromoRedeemResult & { error?: string };

    if (res.ok && data.valid) {
      return { valid: true, permanent: data.permanent };
    }

    return { valid: false, error: data.error ?? 'invalid' };
  } catch {
    return { valid: false, error: 'network' };
  }
}

const UNLOCK_KEY = 'factory_promo_unlocked';

export function isPromoUnlocked(): boolean {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

export function setPromoUnlocked(): void {
  try {
    sessionStorage.setItem(UNLOCK_KEY, '1');
  } catch {
    // sessionStorage unavailable
  }
}
`,Qx=`import type { Manifest } from '../types/manifest';
import type { ImageSourceDefinition } from './imageSources';
import { getImageSource } from './imageSources';
import { getBaseImagesForManifest } from './imageOverrides';

/** Funnel image-library niche folder names → Factory sector keys */
const SECTOR_TO_NICHE_FOLDER: Record<string, string> = {
  restaurant: 'restaurant',
  hotel: 'hotel',
  beauty_salon: 'beauty',
  dental_clinic: 'dental',
  fitness: 'fitness',
  fitness_club: 'fitness',
  barber: 'barber',
  massage: 'massage',
  cleaning: 'cleaning',
  auto_service: 'auto',
  car_service: 'auto',
  workshop: 'auto',
  education: 'education',
  real_estate: 'real_estate',
  construction: 'construction',
  accounting: 'office',
  law_firm: 'office',
};

function nicheAsset(sector: string, file: string): string {
  const folder = SECTOR_TO_NICHE_FOLDER[sector] ?? 'office';
  return \`/assets/niches/\${folder}/\${file}\`;
}

/**
 * Prefer Orchestrator-injected image-library paths when present in dist.
 * Falls back to Pexels registry from imageSources.
 */
export function resolveNicheImages(manifest: Manifest): ImageSourceDefinition {
  const sector = String(manifest.business.sector);
  const folder = SECTOR_TO_NICHE_FOLDER[sector];

  if (folder) {
    const libraryPack: ImageSourceDefinition = {
      key: \`image_library_\${folder}\`,
      hero: nicheAsset(sector, 'hero.jpg'),
      about: nicheAsset(sector, 'about.jpg'),
      gallery: [
        nicheAsset(sector, 'gallery-1.jpg'),
        nicheAsset(sector, 'gallery-2.jpg'),
        nicheAsset(sector, 'gallery-3.jpg'),
        nicheAsset(sector, 'gallery-4.jpg'),
      ],
      services: [
        nicheAsset(sector, 'service-1.jpg'),
        nicheAsset(sector, 'service-2.jpg'),
        nicheAsset(sector, 'service-3.jpg'),
      ],
    };
    // In browser we cannot sync-check file existence; Orchestrator copies image-library.
    // Studio mode without library still works via getBaseImagesForManifest fallback below
    // when preferLibrary is false — product mode always prefers library paths.
    if (typeof window !== 'undefined' && window.__FACTORY_BOOTSTRAP__) {
      return libraryPack;
    }
  }

  try {
    return getBaseImagesForManifest(manifest);
  } catch {
    return getImageSource('pexels_office');
  }
}
`,Zx=`import type {
  SectorKey,
  WebsiteSectionKey,
  CrmModuleKey,
  ThemeKey,
  BookingModuleKey,
  ReviewModuleKey,
  NotificationChannelKey,
} from '../types/manifest';

export interface SectorDefinition {
  key: SectorKey;
  labelEn: string;
  labelDe: string;
  labelRu: string;
  defaultWebsiteSections: WebsiteSectionKey[];
  defaultCrmModules: CrmModuleKey[];
  defaultTheme: ThemeKey;
  defaultBookingModule: BookingModuleKey;
  defaultReviewModule: ReviewModuleKey;
  defaultNotificationChannels: NotificationChannelKey[];
  imageSourceKey: string;
  /** true for built-in sectors; false for studio-registered sectors */
  builtIn: boolean;
}

const ALL_WEBSITE_SECTIONS: WebsiteSectionKey[] = [
  'hero', 'about', 'services', 'gallery', 'booking',
  'testimonials', 'faq', 'contacts', 'google_maps', 'whatsapp', 'email_section',
];

const ALL_CRM_MODULES: CrmModuleKey[] = [
  'dashboard', 'customers', 'bookings', 'services', 'calendar',
  'employees', 'notifications', 'settings', 'review_requests',
];

// ─── Built-in sector definitions ─────────────────────────────────────────────

const BUILT_IN_SECTORS: SectorDefinition[] = [
  {
    key: 'restaurant', builtIn: true,
    labelEn: 'Restaurant', labelDe: 'Restaurant', labelRu: 'Ресторан',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'modern_light', defaultBookingModule: 'time_slots',
    defaultReviewModule: 'google_review_link', defaultNotificationChannels: ['whatsapp', 'email'],
    imageSourceKey: 'pexels_restaurant',
  },
  {
    key: 'dental_clinic', builtIn: true,
    labelEn: 'Dental Clinic', labelDe: 'Zahnarztpraxis', labelRu: 'Стоматология',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'classic', defaultBookingModule: 'calendar_picker',
    defaultReviewModule: 'google_review_link', defaultNotificationChannels: ['whatsapp', 'email'],
    imageSourceKey: 'pexels_dental',
  },
  {
    key: 'beauty_salon', builtIn: true,
    labelEn: 'Beauty Salon', labelDe: 'Schönheitssalon', labelRu: 'Салон красоты',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'minimal', defaultBookingModule: 'time_slots',
    defaultReviewModule: 'whatsapp_review_request', defaultNotificationChannels: ['whatsapp', 'email'],
    imageSourceKey: 'pexels_beauty',
  },
  {
    key: 'fitness', builtIn: true,
    labelEn: 'Fitness', labelDe: 'Fitnessstudio', labelRu: 'Фитнес',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'bold', defaultBookingModule: 'time_slots',
    defaultReviewModule: 'google_review_link', defaultNotificationChannels: ['whatsapp', 'email'],
    imageSourceKey: 'pexels_fitness',
  },
  {
    key: 'barber', builtIn: true,
    labelEn: 'Barber', labelDe: 'Barbier', labelRu: 'Барбершоп',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'modern_dark', defaultBookingModule: 'time_slots',
    defaultReviewModule: 'google_review_link', defaultNotificationChannels: ['whatsapp'],
    imageSourceKey: 'pexels_barber',
  },
  {
    key: 'massage', builtIn: true,
    labelEn: 'Massage', labelDe: 'Massage', labelRu: 'Массаж',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'minimal', defaultBookingModule: 'time_slots',
    defaultReviewModule: 'whatsapp_review_request', defaultNotificationChannels: ['whatsapp', 'email'],
    imageSourceKey: 'pexels_massage',
  },
  {
    key: 'cleaning', builtIn: true,
    labelEn: 'Cleaning', labelDe: 'Reinigung', labelRu: 'Уборка',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'modern_light', defaultBookingModule: 'simple_form',
    defaultReviewModule: 'email_review_request', defaultNotificationChannels: ['email', 'whatsapp'],
    imageSourceKey: 'pexels_cleaning',
  },
  {
    key: 'auto_service', builtIn: true,
    labelEn: 'Auto Service', labelDe: 'Autowerkstatt', labelRu: 'Автосервис',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'modern_dark', defaultBookingModule: 'calendar_picker',
    defaultReviewModule: 'google_review_link', defaultNotificationChannels: ['whatsapp', 'email'],
    imageSourceKey: 'pexels_auto',
  },
  {
    key: 'hotel', builtIn: true,
    labelEn: 'Hotel', labelDe: 'Hotel', labelRu: 'Отель',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'classic', defaultBookingModule: 'calendar_picker',
    defaultReviewModule: 'google_review_link', defaultNotificationChannels: ['email', 'whatsapp'],
    imageSourceKey: 'pexels_hotel',
  },
  {
    key: 'education', builtIn: true,
    labelEn: 'Education', labelDe: 'Bildung', labelRu: 'Образование',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'modern_light', defaultBookingModule: 'simple_form',
    defaultReviewModule: 'email_review_request', defaultNotificationChannels: ['email'],
    imageSourceKey: 'pexels_education',
  },
  {
    key: 'real_estate', builtIn: true,
    labelEn: 'Real Estate', labelDe: 'Immobilien', labelRu: 'Недвижимость',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'classic', defaultBookingModule: 'simple_form',
    defaultReviewModule: 'google_review_link', defaultNotificationChannels: ['email', 'whatsapp'],
    imageSourceKey: 'pexels_real_estate',
  },
  {
    key: 'construction', builtIn: true,
    labelEn: 'Construction', labelDe: 'Bau', labelRu: 'Строительство',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'bold', defaultBookingModule: 'simple_form',
    defaultReviewModule: 'email_review_request', defaultNotificationChannels: ['email', 'whatsapp'],
    imageSourceKey: 'pexels_construction',
  },
  {
    key: 'accounting', builtIn: true,
    labelEn: 'Accounting', labelDe: 'Buchhaltung', labelRu: 'Бухгалтерия',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'classic', defaultBookingModule: 'simple_form',
    defaultReviewModule: 'email_review_request', defaultNotificationChannels: ['email'],
    imageSourceKey: 'pexels_office',
  },
  {
    key: 'law_firm', builtIn: true,
    labelEn: 'Law Firm', labelDe: 'Kanzlei', labelRu: 'Юридическая фирма',
    defaultWebsiteSections: ALL_WEBSITE_SECTIONS, defaultCrmModules: ALL_CRM_MODULES,
    defaultTheme: 'classic', defaultBookingModule: 'simple_form',
    defaultReviewModule: 'google_review_link', defaultNotificationChannels: ['email'],
    imageSourceKey: 'pexels_office',
  },
];

// ─── Runtime-extensible registry (Req 9: Studio Admin) ───────────────────────

const SECTOR_REGISTRY = new Map<string, SectorDefinition>(
  BUILT_IN_SECTORS.map(s => [s.key, s]),
);

const CUSTOM_SECTORS_STORAGE_KEY = 'factory_custom_sectors';

/** Load studio-registered sectors from localStorage on module init */
function loadCustomSectors(): void {
  try {
    const raw = localStorage.getItem(CUSTOM_SECTORS_STORAGE_KEY);
    if (!raw) return;
    const sectors = JSON.parse(raw) as SectorDefinition[];
    for (const s of sectors) {
      if (!SECTOR_REGISTRY.has(s.key)) {
        SECTOR_REGISTRY.set(s.key, { ...s, builtIn: false });
      }
    }
  } catch {
    // corrupted storage — ignore
  }
}

loadCustomSectors();

/** Register a new sector at runtime (Studio Admin, Req 9).
 *  Does NOT overwrite built-in sectors. Persists to localStorage. */
export function registerSector(definition: Omit<SectorDefinition, 'builtIn'>): void {
  if (SECTOR_REGISTRY.get(definition.key)?.builtIn) {
    throw new Error(\`Cannot override built-in sector "\${definition.key}"\`);
  }
  const entry: SectorDefinition = { ...definition, builtIn: false };
  SECTOR_REGISTRY.set(definition.key, entry);

  const customs = getAllCustomSectors();
  const idx = customs.findIndex(s => s.key === definition.key);
  if (idx >= 0) customs[idx] = entry; else customs.push(entry);
  try {
    localStorage.setItem(CUSTOM_SECTORS_STORAGE_KEY, JSON.stringify(customs));
  } catch { /* noop */ }
}

export function unregisterCustomSector(key: string): void {
  const sector = SECTOR_REGISTRY.get(key);
  if (!sector) return;
  if (sector.builtIn) throw new Error(\`Cannot remove built-in sector "\${key}"\`);
  SECTOR_REGISTRY.delete(key);
  const customs = getAllCustomSectors().filter(s => s.key !== key);
  try {
    localStorage.setItem(CUSTOM_SECTORS_STORAGE_KEY, JSON.stringify(customs));
  } catch { /* noop */ }
}

export function getSector(key: SectorKey): SectorDefinition {
  const sector = SECTOR_REGISTRY.get(key);
  if (!sector) throw new Error(\`Library key not found: sector "\${key}"\`);
  return sector;
}

export function getAllSectors(): SectorDefinition[] {
  return Array.from(SECTOR_REGISTRY.values());
}

export function getAllCustomSectors(): SectorDefinition[] {
  return Array.from(SECTOR_REGISTRY.values()).filter(s => !s.builtIn);
}

export { SECTOR_REGISTRY };
`,Xx=`import type { CrmStorageAdapter, FirebaseReadiness } from './types';
import { getFactoryBootstrap } from '../bootstrap';

/**
 * Firebase readiness adapter — does not sync live data in v1.
 * Detects VITE_FIREBASE_* / bootstrap.firebaseReady and soft-fails writes.
 */
export function getFirebaseReadiness(): FirebaseReadiness {
  const boot = getFactoryBootstrap();
  const envReady =
    Boolean(import.meta.env.VITE_FIREBASE_API_KEY) &&
    Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
  const configured = Boolean(boot?.firebaseReady) || envReady;

  if (configured) {
    return {
      configured: true,
      ready: true,
      message: 'Firebase credentials detected. Cloud sync available as upgrade — LocalStorage is active by default.',
    };
  }
  return {
    configured: false,
    ready: false,
    message: 'LocalStorage active. Connect Firebase for cloud backup (optional upgrade).',
  };
}

export const firebaseAdapter: CrmStorageAdapter = {
  backend: 'firebase',
  load() {
    console.info('[firebaseAdapter] Cloud sync not active in v1 — use LocalStorage.');
    return null;
  },
  save() {
    console.info('[firebaseAdapter] Cloud sync not active in v1 — writes stay local.');
    return false;
  },
  remove() {
    /* noop */
  },
};
`,ev=`import type { CrmStorageAdapter } from './types';

export const localStorageAdapter: CrmStorageAdapter = {
  backend: 'local',
  load<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  save<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn('[localStorageAdapter] save failed', err);
      return false;
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  },
};
`,tv=`export type StorageBackend = 'local' | 'firebase';

export interface CrmStorageAdapter {
  readonly backend: StorageBackend;
  load<T>(key: string): T | null;
  save<T>(key: string, value: T): boolean;
  remove(key: string): void;
}

export interface FirebaseReadiness {
  configured: boolean;
  ready: boolean;
  message: string;
}
`,nv=`import type { ThemeKey } from '../types/manifest';

export interface ColorRamp {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ThemeColors {
  primary: ColorRamp;
  secondary: ColorRamp;
  accent: ColorRamp;
  success: ColorRamp;
  warning: ColorRamp;
  error: ColorRamp;
  neutral: ColorRamp;
}

export interface ThemeDefinition {
  key: ThemeKey;
  label: string;
  fontFamily: string;
  borderRadius: string;
  colors: ThemeColors;
  websiteBackground: string;
  websiteForeground: string;
  crmBackground: string;
  crmForeground: string;
}

const grayNeutral: ColorRamp = {
  50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
  400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151',
  800: '#1f2937', 900: '#111827',
};

const successGreen: ColorRamp = {
  50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
  400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
  800: '#166534', 900: '#14532d',
};

const warningAmber: ColorRamp = {
  50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
  400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
  800: '#92400e', 900: '#78350f',
};

const errorRed: ColorRamp = {
  50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
  400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
  800: '#991b1b', 900: '#7f1d1d',
};

const THEME_REGISTRY: Record<ThemeKey, ThemeDefinition> = {
  modern_light: {
    key: 'modern_light',
    label: 'Modern Light',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '0.5rem',
    colors: {
      primary: {
        50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
        400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
        800: '#1e40af', 900: '#1e3a8a',
      },
      secondary: {
        50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc',
        400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1',
        800: '#075985', 900: '#0c4a6e',
      },
      accent: {
        50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc',
        400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf',
        800: '#86198f', 900: '#701a75',
      },
      success: successGreen,
      warning: warningAmber,
      error: errorRed,
      neutral: grayNeutral,
    },
    websiteBackground: '#ffffff',
    websiteForeground: '#111827',
    crmBackground: '#f9fafb',
    crmForeground: '#111827',
  },
  modern_dark: {
    key: 'modern_dark',
    label: 'Modern Dark',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '0.5rem',
    colors: {
      primary: {
        50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
        400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
        800: '#065f46', 900: '#064e3b',
      },
      secondary: {
        50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4',
        400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e',
        800: '#115e59', 900: '#134e4a',
      },
      accent: {
        50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
        400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
        800: '#9a3412', 900: '#7c2d12',
      },
      success: successGreen,
      warning: warningAmber,
      error: errorRed,
      neutral: grayNeutral,
    },
    websiteBackground: '#0f172a',
    websiteForeground: '#f1f5f9',
    crmBackground: '#1e293b',
    crmForeground: '#f1f5f9',
  },
  classic: {
    key: 'classic',
    label: 'Classic',
    fontFamily: "'Playfair Display', serif",
    borderRadius: '0.25rem',
    colors: {
      primary: {
        50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1',
        400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c',
        800: '#292524', 900: '#1c1917',
      },
      secondary: {
        50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
        400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
        800: '#92400e', 900: '#78350f',
      },
      accent: {
        50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4',
        400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d',
        800: '#9d174d', 900: '#831843',
      },
      success: successGreen,
      warning: warningAmber,
      error: errorRed,
      neutral: grayNeutral,
    },
    websiteBackground: '#fafaf9',
    websiteForeground: '#1c1917',
    crmBackground: '#f5f5f4',
    crmForeground: '#1c1917',
  },
  minimal: {
    key: 'minimal',
    label: 'Minimal',
    fontFamily: "'DM Sans', sans-serif",
    borderRadius: '0.75rem',
    colors: {
      primary: {
        50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8',
        400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46',
        800: '#27272a', 900: '#18181b',
      },
      secondary: {
        50: '#f7f7f7', 100: '#efefef', 200: '#dfdfdf', 300: '#c8c8c8',
        400: '#adadad', 500: '#999999', 600: '#888888', 700: '#7b7b7b',
        800: '#676767', 900: '#545454',
      },
      accent: {
        50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc',
        400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf',
        800: '#86198f', 900: '#701a75',
      },
      success: successGreen,
      warning: warningAmber,
      error: errorRed,
      neutral: grayNeutral,
    },
    websiteBackground: '#ffffff',
    websiteForeground: '#18181b',
    crmBackground: '#fafafa',
    crmForeground: '#18181b',
  },
  bold: {
    key: 'bold',
    label: 'Bold',
    fontFamily: "'Oswald', sans-serif",
    borderRadius: '0rem',
    colors: {
      primary: {
        50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
        400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c',
        800: '#9f1239', 900: '#881337',
      },
      secondary: {
        50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8',
        400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46',
        800: '#27272a', 900: '#18181b',
      },
      accent: {
        50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
        400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
        800: '#92400e', 900: '#78350f',
      },
      success: successGreen,
      warning: warningAmber,
      error: errorRed,
      neutral: grayNeutral,
    },
    websiteBackground: '#18181b',
    websiteForeground: '#fafafa',
    crmBackground: '#27272a',
    crmForeground: '#fafafa',
  },
};

export function getTheme(key: ThemeKey): ThemeDefinition {
  const theme = THEME_REGISTRY[key];
  if (!theme) throw new Error(\`Library key not found: theme "\${key}"\`);
  return theme;
}

export function getAllThemes(): ThemeDefinition[] {
  return Object.values(THEME_REGISTRY);
}

export { THEME_REGISTRY };
`,sv=`import type { WebsiteSectionKey, Language } from '../types/manifest';

export interface WebsiteSectionDefinition {
  key: WebsiteSectionKey;
  label: Record<Language, string>;
  description: Record<Language, string>;
  required: boolean;
}

const WEBSITE_SECTION_REGISTRY: Record<WebsiteSectionKey, WebsiteSectionDefinition> = {
  hero: {
    key: 'hero',
    label: { en: 'Hero', de: 'Hero', ru: 'Главный экран' },
    description: {
      en: 'Full-width headline banner with call-to-action',
      de: 'Vollbreites Banner mit Handlungsaufforderung',
      ru: 'Полноширинный баннер с призывом к действию',
    },
    required: true,
  },
  about: {
    key: 'about',
    label: { en: 'About', de: 'Über uns', ru: 'О нас' },
    description: {
      en: 'Company story and values',
      de: 'Unternehmensgeschichte und Werte',
      ru: 'История компании и ценности',
    },
    required: true,
  },
  services: {
    key: 'services',
    label: { en: 'Services', de: 'Leistungen', ru: 'Услуги' },
    description: {
      en: 'List of offered services with prices',
      de: 'Liste der angebotenen Leistungen mit Preisen',
      ru: 'Список предоставляемых услуг с ценами',
    },
    required: true,
  },
  gallery: {
    key: 'gallery',
    label: { en: 'Gallery', de: 'Galerie', ru: 'Галерея' },
    description: {
      en: 'Photo gallery of work and premises',
      de: 'Fotogalerie der Arbeiten und Räumlichkeiten',
      ru: 'Фотогалерея работ и помещений',
    },
    required: false,
  },
  booking: {
    key: 'booking',
    label: { en: 'Booking', de: 'Buchung', ru: 'Запись' },
    description: {
      en: 'Online appointment booking form',
      de: 'Online-Terminbuchungsformular',
      ru: 'Онлайн-форма записи на приём',
    },
    required: true,
  },
  testimonials: {
    key: 'testimonials',
    label: { en: 'Testimonials', de: 'Bewertungen', ru: 'Отзывы' },
    description: {
      en: 'Customer reviews and ratings',
      de: 'Kundenbewertungen und Bewertungen',
      ru: 'Отзывы и оценки клиентов',
    },
    required: false,
  },
  faq: {
    key: 'faq',
    label: { en: 'FAQ', de: 'FAQ', ru: 'Вопросы и ответы' },
    description: {
      en: 'Frequently asked questions',
      de: 'Häufig gestellte Fragen',
      ru: 'Часто задаваемые вопросы',
    },
    required: false,
  },
  contacts: {
    key: 'contacts',
    label: { en: 'Contacts', de: 'Kontakt', ru: 'Контакты' },
    description: {
      en: 'Address, phone, and opening hours',
      de: 'Adresse, Telefon und Öffnungszeiten',
      ru: 'Адрес, телефон и часы работы',
    },
    required: true,
  },
  google_maps: {
    key: 'google_maps',
    label: { en: 'Google Maps', de: 'Google Maps', ru: 'Google Карты' },
    description: {
      en: 'Embedded Google Maps location',
      de: 'Eingebettete Google Maps-Karte',
      ru: 'Встроенная карта Google',
    },
    required: false,
  },
  whatsapp: {
    key: 'whatsapp',
    label: { en: 'WhatsApp Button', de: 'WhatsApp-Schaltfläche', ru: 'Кнопка WhatsApp' },
    description: {
      en: 'Floating WhatsApp contact button',
      de: 'Schwebende WhatsApp-Kontaktschaltfläche',
      ru: 'Плавающая кнопка WhatsApp',
    },
    required: false,
  },
  email_section: {
    key: 'email_section',
    label: { en: 'Email Contact', de: 'E-Mail-Kontakt', ru: 'Контакт по Email' },
    description: {
      en: 'Email contact form',
      de: 'E-Mail-Kontaktformular',
      ru: 'Форма обратной связи по email',
    },
    required: false,
  },
};

export function getWebsiteSection(key: WebsiteSectionKey): WebsiteSectionDefinition {
  const section = WEBSITE_SECTION_REGISTRY[key];
  if (!section) throw new Error(\`Library key not found: website section "\${key}"\`);
  return section;
}

export function getWebsiteSections(keys: WebsiteSectionKey[]): WebsiteSectionDefinition[] {
  return keys.map(getWebsiteSection);
}

export { WEBSITE_SECTION_REGISTRY };
`,rv=`import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { I18nProvider } from './lib/i18n.tsx';
import { ProjectStoreProvider } from './store/projectStore';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <ProjectStoreProvider>
        <App />
      </ProjectStoreProvider>
    </I18nProvider>
  </StrictMode>
);
`,av=`import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, LayoutDashboard, Users, Calendar, CheckCircle2,
  Clock, Phone, Zap, Briefcase, LayoutGrid, UserCog,
  Settings, Plus, Trash2, Download, Upload, Flame,
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import type {
  AppointmentStatus, CrmAppointment, CrmClient, CrmResource,
  CrmServiceItem, CrmStaffMember, ResourceStatus,
} from '../store/crmTypes';
import { useTranslations } from '../lib/i18n';
import { getDisplayBusinessName, getDisplayLogo } from '../lib/brandingDefaults';
import { buildBrandedPalette } from './website-demo/themeHelpers';
import { StatusBadge } from '../components/ui/Badge';
import { StatisticCard } from '../components/ui/StatisticCard';
import { EmptyState } from '../components/ui/EmptyState';
import { getCrmTabLabels, getCrmVocabulary, type CrmTabKey } from '../lib/crmVocabulary';
import { isProductMode } from '../lib/bootstrap';
import { getFirebaseReadiness } from '../lib/storage/firebaseAdapter';
import { openFirebaseWhatsAppChat } from '../lib/firebaseWhatsApp';

type Tab = CrmTabKey;

const ICON_MAP = {
  LayoutDashboard,
  CalendarCheck: Calendar,
  Users,
  Briefcase,
  LayoutGrid,
  UserCog,
  Settings,
  UtensilsCrossed: Briefcase,
  Sparkles: Briefcase,
  Stethoscope: Briefcase,
  Dumbbell: Briefcase,
  Wrench: Briefcase,
  BedDouble: LayoutGrid,
} as const;

export default function CrmDemoPage() {
  const navigate = useNavigate();
  const store = useProjectStore();
  const { state } = store;
  const { t, language } = useTranslations();
  const c = t.crm;
  const [tab, setTab] = useState<Tab>('dashboard');
  const product = isProductMode();
  const fileRef = useRef<HTMLInputElement>(null);

  if (!state.manifest) {
    navigate(product ? '/' : '/');
    return null;
  }

  const manifest = state.manifest;
  const sector = manifest.crm.vocabularyKey ?? manifest.business.sector;
  const labels = getCrmTabLabels(sector, language);
  const vocab = getCrmVocabulary(sector);
  const entities = state.entities;
  const appointments = entities.appointments;
  const businessName = getDisplayBusinessName(manifest);
  const logoUrl = getDisplayLogo(manifest);
  const palette = buildBrandedPalette(manifest);
  const brandColor = palette.primary;
  const brandColorLight = palette.primaryLight;

  const today = new Date().toDateString();
  const todayAppts = appointments.filter(b => new Date(b.createdAt).toDateString() === today || b.date === new Date().toISOString().slice(0, 10));
  const confirmed = appointments.filter(b => b.status === 'Confirmed').length;
  const pending = appointments.filter(b => b.status === 'Pending').length;

  const tabs: { id: Tab; label: string; iconKey: string }[] = [
    { id: 'dashboard', label: labels.dashboard, iconKey: vocab.icons.dashboard },
    { id: 'appointments', label: labels.appointments, iconKey: vocab.icons.appointments },
    { id: 'clients', label: labels.clients, iconKey: vocab.icons.clients },
    { id: 'services', label: labels.services, iconKey: vocab.icons.services },
    { id: 'resources', label: labels.resources, iconKey: vocab.icons.resources },
    { id: 'staff', label: labels.staff, iconKey: vocab.icons.staff },
    { id: 'settings', label: labels.settings, iconKey: vocab.icons.settings },
  ];

  const firebase = getFirebaseReadiness();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={businessName} className="h-8 w-auto max-w-[120px] object-contain" />
            ) : (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: brandColor }}>
                <LayoutDashboard className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <span className="font-bold text-slate-800 text-sm">{c.title}</span>
          </div>
          <span className="text-slate-300">·</span>
          <span className="text-sm text-slate-500 font-medium truncate">{businessName}</span>
          {!product && (
            <>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <span className="hidden sm:inline text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Factory Website+CRM
              </span>
            </>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate(product ? '/' : '/website-demo')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
            >
              {c.websiteDemo}
            </button>
            {!product && (
              <button
                onClick={() => navigate('/manifest')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> {c.backManifest}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 w-full overflow-x-auto shadow-sm">
          {tabs.map(tb => {
            const Icon = ICON_MAP[tb.iconKey as keyof typeof ICON_MAP] ?? LayoutDashboard;
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={\`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap \${
                  tab === tb.id ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }\`}
                style={tab === tb.id ? { backgroundColor: brandColor } : undefined}
              >
                <Icon className="w-4 h-4" />
                {tb.label}
                {tb.id === 'appointments' && appointments.length > 0 && (
                  <span className={\`ml-1 text-xs font-bold px-1.5 py-0.5 rounded-full \${tab === tb.id ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'}\`}>
                    {appointments.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatisticCard label={labels.appointments} value={todayAppts.length} icon={Calendar} color={brandColor} bg={brandColorLight} />
              <StatisticCard label={labels.clients} value={entities.clients.length} icon={Users} color="#2563eb" bg="#dbeafe" />
              <StatisticCard label={c.stats.pending} value={pending} icon={Clock} color="#d97706" bg="#fef3c7" />
              <StatisticCard label={c.stats.confirmed} value={confirmed} icon={CheckCircle2} color="#059669" bg="#d1fae5" />
            </div>
            <EntityCard title={labels.appointments} count={appointments.length}>
              <AppointmentsTable
                items={appointments.slice(0, 8)}
                onUpdate={store.updateAppointment}
                onDelete={store.deleteAppointment}
                columns={c.columns}
              />
            </EntityCard>
          </div>
        )}

        {tab === 'appointments' && (
          <CrudSection
            title={labels.appointments}
            onAdd={() => store.addBooking({
              name: 'New Guest',
              phone: '+49 150 0000000',
              date: new Date().toISOString().slice(0, 10),
              service: entities.services[0]?.name ?? 'Service',
              status: 'Pending',
            })}
            addLabel={\`+ \${labels.appointments}\`}
          >
            <AppointmentsTable
              items={appointments}
              onUpdate={store.updateAppointment}
              onDelete={store.deleteAppointment}
              columns={c.columns}
            />
          </CrudSection>
        )}

        {tab === 'clients' && (
          <CrudSection
            title={labels.clients}
            onAdd={() => store.upsertClient({ name: 'New Client', phone: \`+49 15\${String(Date.now()).slice(-8)}\` })}
            addLabel={\`+ \${labels.clients}\`}
          >
            <ClientsTable
              items={entities.clients}
              onUpdate={store.upsertClient}
              onDelete={store.deleteClient}
              columns={c.columns}
            />
          </CrudSection>
        )}

        {tab === 'services' && (
          <CrudSection
            title={labels.services}
            onAdd={() => store.upsertService({ name: 'New Service', description: 'Description', price: 'from €49', durationMinutes: 45, active: true })}
            addLabel={\`+ \${labels.services}\`}
          >
            <ServicesTable items={entities.services} onUpdate={store.upsertService} onDelete={store.deleteService} />
          </CrudSection>
        )}

        {tab === 'resources' && (
          <CrudSection
            title={labels.resources}
            onAdd={() => store.upsertResource({ name: \`\${vocab.resourceSingular.en} \${entities.resources.length + 1}\`, capacity: 2, status: 'available' })}
            addLabel={\`+ \${labels.resources}\`}
          >
            <ResourcesTable items={entities.resources} onUpdate={store.upsertResource} onDelete={store.deleteResource} />
          </CrudSection>
        )}

        {tab === 'staff' && (
          <CrudSection
            title={labels.staff}
            onAdd={() => store.upsertStaff({ name: 'New Staff', role: 'Specialist', active: true })}
            addLabel={\`+ \${labels.staff}\`}
          >
            <StaffTable items={entities.staff} onUpdate={store.upsertStaff} onDelete={store.deleteStaff} />
          </CrudSection>
        )}

        {tab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Settings className="w-4 h-4" /> {labels.settings}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Business name" value={entities.settings.businessName} onChange={v => store.updateSettings({ businessName: v })} />
                <Field label="Phone" value={entities.settings.phone} onChange={v => store.updateSettings({ phone: v })} />
                <Field label="Email" value={entities.settings.email} onChange={v => store.updateSettings({ email: v })} />
                <Field label="WhatsApp" value={entities.settings.whatsapp ?? ''} onChange={v => store.updateSettings({ whatsapp: v })} />
                <Field label="City" value={entities.settings.city ?? ''} onChange={v => store.updateSettings({ city: v })} />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">Storage</h3>
              <p className="text-xs text-slate-500">
                Active backend: <strong>LocalStorage</strong>
                {firebase.ready ? ' · Firebase ready to connect' : ' · Firebase optional upgrade'}
              </p>
              <p className="text-xs text-slate-400">{firebase.message}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => store.exportJson()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Export JSON
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold"
                >
                  <Upload className="w-3.5 h-3.5" /> Import JSON
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const text = await file.text();
                    try {
                      store.importJson(text);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'Import failed');
                    }
                    e.target.value = '';
                  }}
                />
                <button
                  type="button"
                  onClick={() => openFirebaseWhatsAppChat(language)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 text-xs font-semibold"
                >
                  <Flame className="w-3.5 h-3.5" /> Firebase upgrade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CrudSection({ title, onAdd, addLabel, children }: {
  title: string; onAdd: () => void; addLabel: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5" /> {addLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

function EntityCard({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        <span className="text-xs text-slate-400">{count}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-xs space-y-1">
      <span className="font-semibold text-slate-500">{label}</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800"
      />
    </label>
  );
}

function AppointmentsTable({
  items, onUpdate, onDelete, columns,
}: {
  items: CrmAppointment[];
  onUpdate: (id: string, patch: Partial<CrmAppointment>) => void;
  onDelete: (id: string) => void;
  columns: { name: string; phone: string; date: string; service: string; status: string; visits: string };
}) {
  if (items.length === 0) {
    return <EmptyState icon={<Calendar className="w-8 h-8 text-slate-300" />} label="No records" sub="Add a record or book from the website." />;
  }
  const statuses: AppointmentStatus[] = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <Th>{columns.name}</Th>
            <Th>{columns.phone}</Th>
            <Th>{columns.date}</Th>
            <Th>{columns.service}</Th>
            <Th>{columns.status}</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map(b => (
            <tr key={b.id} className="hover:bg-slate-50">
              <Td>
                <input
                  className="font-medium text-slate-700 bg-transparent border-b border-transparent focus:border-slate-300 w-full"
                  value={b.clientName}
                  onChange={e => onUpdate(b.id, { clientName: e.target.value })}
                />
              </Td>
              <Td>
                <span className="flex items-center gap-1 text-slate-500">
                  <Phone className="w-3 h-3" />
                  <input
                    className="bg-transparent border-b border-transparent focus:border-slate-300 w-28"
                    value={b.clientPhone}
                    onChange={e => onUpdate(b.id, { clientPhone: e.target.value })}
                  />
                </span>
              </Td>
              <Td>
                <input
                  type="date"
                  className="bg-transparent border-b border-transparent focus:border-slate-300"
                  value={b.date}
                  onChange={e => onUpdate(b.id, { date: e.target.value })}
                />
              </Td>
              <Td>
                <input
                  className="bg-transparent border-b border-transparent focus:border-slate-300 w-full"
                  value={b.serviceName}
                  onChange={e => onUpdate(b.id, { serviceName: e.target.value })}
                />
              </Td>
              <Td>
                <select
                  className="text-xs border border-slate-200 rounded-md px-2 py-1"
                  value={b.status}
                  onChange={e => onUpdate(b.id, { status: e.target.value as AppointmentStatus })}
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="mt-1"><StatusBadge status={b.status} /></div>
              </Td>
              <Td>
                <button type="button" onClick={() => onDelete(b.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ClientsTable({
  items, onUpdate, onDelete, columns,
}: {
  items: CrmClient[];
  onUpdate: (c: CrmClient) => void;
  onDelete: (id: string) => void;
  columns: { name: string; phone: string; visits: string; date: string; service: string; status: string };
}) {
  if (items.length === 0) {
    return <EmptyState icon={<Users className="w-8 h-8 text-slate-300" />} label="No clients" sub="Add a client to get started." />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <Th>{columns.name}</Th>
            <Th>{columns.phone}</Th>
            <Th>Email</Th>
            <Th>Notes</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map(cu => (
            <tr key={cu.id} className="hover:bg-slate-50">
              <Td>
                <input className="font-medium bg-transparent border-b border-transparent focus:border-slate-300 w-full" value={cu.name} onChange={e => onUpdate({ ...cu, name: e.target.value })} />
              </Td>
              <Td>
                <input className="bg-transparent border-b border-transparent focus:border-slate-300 w-32" value={cu.phone} onChange={e => onUpdate({ ...cu, phone: e.target.value })} />
              </Td>
              <Td>
                <input className="bg-transparent border-b border-transparent focus:border-slate-300 w-40" value={cu.email ?? ''} onChange={e => onUpdate({ ...cu, email: e.target.value })} />
              </Td>
              <Td>
                <input className="bg-transparent border-b border-transparent focus:border-slate-300 w-full" value={cu.notes ?? ''} onChange={e => onUpdate({ ...cu, notes: e.target.value })} />
              </Td>
              <Td>
                <button type="button" onClick={() => onDelete(cu.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ServicesTable({
  items, onUpdate, onDelete,
}: {
  items: CrmServiceItem[];
  onUpdate: (s: CrmServiceItem) => void;
  onDelete: (id: string) => void;
}) {
  if (items.length === 0) {
    return <EmptyState icon={<Briefcase className="w-8 h-8 text-slate-300" />} label="No services" sub="Add a service." />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Price</Th>
            <Th>Duration</Th>
            <Th>Active</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map(s => (
            <tr key={s.id}>
              <Td><input className="font-medium bg-transparent border-b border-transparent focus:border-slate-300 w-full" value={s.name} onChange={e => onUpdate({ ...s, name: e.target.value })} /></Td>
              <Td><input className="bg-transparent border-b border-transparent focus:border-slate-300 w-full" value={s.description} onChange={e => onUpdate({ ...s, description: e.target.value })} /></Td>
              <Td><input className="bg-transparent border-b border-transparent focus:border-slate-300 w-24" value={s.price} onChange={e => onUpdate({ ...s, price: e.target.value })} /></Td>
              <Td><input type="number" className="bg-transparent border-b border-transparent focus:border-slate-300 w-16" value={s.durationMinutes} onChange={e => onUpdate({ ...s, durationMinutes: Number(e.target.value) || 0 })} /></Td>
              <Td>
                <input type="checkbox" checked={s.active} onChange={e => onUpdate({ ...s, active: e.target.checked })} />
              </Td>
              <Td>
                <button type="button" onClick={() => onDelete(s.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResourcesTable({
  items, onUpdate, onDelete,
}: {
  items: CrmResource[];
  onUpdate: (r: CrmResource) => void;
  onDelete: (id: string) => void;
}) {
  if (items.length === 0) {
    return <EmptyState icon={<LayoutGrid className="w-8 h-8 text-slate-300" />} label="No resources" sub="Add a table, room, or bay." />;
  }
  const statuses: ResourceStatus[] = ['available', 'occupied', 'maintenance'];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <Th>Name</Th>
            <Th>Capacity</Th>
            <Th>Status</Th>
            <Th>Notes</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map(r => (
            <tr key={r.id}>
              <Td><input className="font-medium bg-transparent border-b border-transparent focus:border-slate-300 w-full" value={r.name} onChange={e => onUpdate({ ...r, name: e.target.value })} /></Td>
              <Td><input type="number" className="bg-transparent border-b border-transparent focus:border-slate-300 w-16" value={r.capacity} onChange={e => onUpdate({ ...r, capacity: Number(e.target.value) || 1 })} /></Td>
              <Td>
                <select className="text-xs border border-slate-200 rounded-md px-2 py-1" value={r.status} onChange={e => onUpdate({ ...r, status: e.target.value as ResourceStatus })}>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Td>
              <Td><input className="bg-transparent border-b border-transparent focus:border-slate-300 w-full" value={r.notes ?? ''} onChange={e => onUpdate({ ...r, notes: e.target.value })} /></Td>
              <Td>
                <button type="button" onClick={() => onDelete(r.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StaffTable({
  items, onUpdate, onDelete,
}: {
  items: CrmStaffMember[];
  onUpdate: (s: CrmStaffMember) => void;
  onDelete: (id: string) => void;
}) {
  if (items.length === 0) {
    return <EmptyState icon={<UserCog className="w-8 h-8 text-slate-300" />} label="No staff" sub="Add a team member." />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <Th>Name</Th>
            <Th>Role</Th>
            <Th>Phone</Th>
            <Th>Email</Th>
            <Th>Active</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map(s => (
            <tr key={s.id}>
              <Td><input className="font-medium bg-transparent border-b border-transparent focus:border-slate-300 w-full" value={s.name} onChange={e => onUpdate({ ...s, name: e.target.value })} /></Td>
              <Td><input className="bg-transparent border-b border-transparent focus:border-slate-300 w-full" value={s.role} onChange={e => onUpdate({ ...s, role: e.target.value })} /></Td>
              <Td><input className="bg-transparent border-b border-transparent focus:border-slate-300 w-32" value={s.phone ?? ''} onChange={e => onUpdate({ ...s, phone: e.target.value })} /></Td>
              <Td><input className="bg-transparent border-b border-transparent focus:border-slate-300 w-40" value={s.email ?? ''} onChange={e => onUpdate({ ...s, email: e.target.value })} /></Td>
              <Td><input type="checkbox" checked={s.active} onChange={e => onUpdate({ ...s, active: e.target.checked })} /></Td>
              <Td>
                <button type="button" onClick={() => onDelete(s.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}
`,ov=`import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, ArrowLeft, ChevronDown, ChevronUp, Globe, LayoutDashboard,
  Star, Package, Shield, CheckCircle2, Mail, MessageCircle,
  LayoutTemplate, Monitor, Smartphone, Truck, Code2, Info,
  Clock, RefreshCw, Activity,
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { getWebsiteSection } from '../lib/websiteSections';
import { getCrmModule } from '../lib/crmModules';
import { getTheme } from '../lib/themes';
import type { Manifest, ReviewFlowStep } from '../types/manifest';
import { DeliveryCenter } from './manifest-preview/DeliveryCenter';
import { useTranslations, LanguageSwitcher } from '../lib/i18n';
import { Card } from '../components/ui/Card';

const CHANNEL_ICONS: Record<string, React.ElementType> = {
  whatsapp: MessageCircle, email: Mail, sms: Smartphone, internal: CheckCircle2,
};

export default function ManifestPreviewPage() {
  const navigate = useNavigate();
  const { state, reset } = useProjectStore();
  const { t } = useTranslations();
  const m = t.manifest;
  const [showJson, setShowJson] = useState(false);

  if (!state.manifest) {
    navigate('/');
    return null;
  }

  const manifest: Manifest = state.manifest;
  const theme = getTheme(manifest.website.themeKey);

  const NEXT_ITEMS = [
    {
      icon: Monitor,      color: '#00D4FF', bg: 'rgba(0,212,255,0.12)',
      title: m.nextItems.website.title,
      desc:  m.nextItems.website.desc,
      badge: m.nextItems.website.badge,
      route: '/website-demo',
      active: true,
    },
    {
      icon: LayoutDashboard, color: '#00C853', bg: 'rgba(0,200,83,0.12)',
      title: m.nextItems.crm.title,
      desc:  m.nextItems.crm.desc,
      badge: m.nextItems.crm.badge,
      route: '/crm-demo',
      active: true,
    },
    {
      icon: Truck,  color: '#FFB300', bg: 'rgba(255,179,0,0.12)',
      title: m.nextItems.delivery.title,
      desc:  m.nextItems.delivery.desc,
      badge: m.nextItems.delivery.badge,
      route: null,
      scrollTo: 'delivery-actions',
      active: true,
    },
    {
      icon: Code2,  color: '#6C3BFF', bg: 'rgba(108,59,255,0.12)',
      title: m.nextItems.sdk.title,
      desc:  m.nextItems.sdk.desc,
      badge: m.nextItems.sdk.badge,
      route: '/studio',
      active: true,
    },
  ];

  return (
    <div className="min-h-screen bg-factory-bg">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-factory-dark/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-glow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Factory Website+CRM</span>
            <span className="mx-2 text-white/10">·</span>
            <span className="text-white/40 text-sm">{m.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => { reset(); navigate('/'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-white/60 hover:text-white text-sm font-medium transition-all hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> {m.newProject}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <div className="bg-dark-surface">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-green-500/15 border border-green-500/25 rounded-full px-3 py-1.5 text-xs text-green-400 font-semibold mb-4">
                <CheckCircle2 className="w-3.5 h-3.5" /> {m.generatedBadge}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{manifest.business.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/40">
                <span>{manifest.business.city}</span>
                <span className="text-white/15">·</span>
                <span className="capitalize">{manifest.business.sector.replace(/_/g, ' ')}</span>
                <span className="text-white/15">·</span>
                <span>{manifest.business.language.toUpperCase()}</span>
                <span className="text-white/15">·</span>
                <span className="font-mono text-xs bg-white/8 px-2 py-0.5 rounded-full">
                  schema v{manifest.schemaVersion}
                </span>
              </div>
            </div>
            <div className="glass rounded-2xl px-5 py-4 text-right animate-fade-in">
              <p className="text-xs text-white/35 mb-0.5">{m.generated}</p>
              <p className="font-mono text-xs text-white/60">{new Date(manifest.generatedAt).toLocaleString()}</p>
              <div className="flex items-center gap-1.5 justify-end mt-2">
                <Activity className="w-3 h-3 text-accent animate-pulse-soft" />
                <span className="text-[11px] text-accent font-medium">Engine v{manifest.metadata.engineVersion}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ── CARDS GRID ─────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-5 mb-6">

          {/* Metadata */}
          <div
            className="rounded-3xl p-6 text-white overflow-hidden relative col-span-full animate-fade-up"
            style={{ background: 'linear-gradient(135deg, #111827 0%, #1e0f47 60%, #0f1a2e 100%)' }}
          >
            <div className="absolute inset-0 opacity-30"
              style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(108,59,255,0.3) 0%, transparent 60%)' }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <Info className="w-4 h-4 text-white/70" />
                </div>
                <h3 className="font-bold text-white/90">{m.metadata}</h3>
                <span className="ml-auto text-xs font-mono text-white/30 bg-white/5 px-2 py-1 rounded-lg">
                  manifest v{manifest.metadata.manifestVersion}
                </span>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <MetaId label={m.projectId} value={manifest.metadata.projectId} />
                <MetaId label={m.studioId}  value={manifest.metadata.studioId} />
                <MetaId label={m.clientId}  value={manifest.metadata.clientId} />
              </div>
              <div className="grid sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/8">
                <div><p className="text-[10px] text-white/35 uppercase tracking-wider mb-1">{m.schema}</p>
                  <p className="text-sm font-semibold text-white/80">v{manifest.schemaVersion}</p></div>
                <div><p className="text-[10px] text-white/35 uppercase tracking-wider mb-1">{m.created}</p>
                  <p className="text-xs font-mono text-white/60">{new Date(manifest.metadata.createdAt).toLocaleString()}</p></div>
                <div><p className="text-[10px] text-white/35 uppercase tracking-wider mb-1">{m.updated}</p>
                  <p className="text-xs font-mono text-white/60">{new Date(manifest.metadata.updatedAt).toLocaleString()}</p></div>
              </div>
            </div>
          </div>

          {/* Business */}
          <Card icon={<Globe className="w-4 h-4" />} iconColor="#00D4FF" title={m.businessInfo}>
            <Row label={m.rowLabels.name}     value={manifest.business.name} />
            <Row label={m.rowLabels.city}     value={manifest.business.city} />
            <Row label={m.rowLabels.language} value={manifest.business.language.toUpperCase()} />
            <Row label={m.rowLabels.phone}    value={manifest.business.phone} />
            {manifest.business.whatsapp && <Row label={m.rowLabels.whatsapp} value={manifest.business.whatsapp} />}
            <Row label={m.rowLabels.email}    value={manifest.business.email} />
          </Card>

          {/* Ownership */}
          <Card icon={<Shield className="w-4 h-4" />} iconColor="#6C3BFF" title={m.ownership}>
            <Row label={m.rowLabels.studio} value={manifest.ownership.studioBrand} />
            <Row label={m.rowLabels.client} value={manifest.ownership.clientBrand} />
            <Row label={m.rowLabels.mode}   value={manifest.ownership.ownershipMode.replace(/_/g, ' ')} capitalize />
            {manifest.ownership.studioEmail && <Row label={m.rowLabels.studioEmail} value={manifest.ownership.studioEmail} />}
          </Card>

          {/* Website Sections */}
          <Card icon={<LayoutTemplate className="w-4 h-4" />} iconColor="#8B5CFF" title={m.websiteSections}>
            <p className="text-xs text-slate-400 mb-3">
              {m.theme}: <span className="font-semibold text-slate-700">{theme.label}</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {manifest.website.sections.map(key => {
                const section = getWebsiteSection(key);
                return (
                  <span key={key} className="text-xs bg-primary/8 text-primary border border-primary/15 px-2.5 py-1 rounded-full font-medium">
                    {section.label.en}
                  </span>
                );
              })}
            </div>
          </Card>

          {/* CRM Modules */}
          <Card icon={<LayoutDashboard className="w-4 h-4" />} iconColor="#00C853" title={m.crmModules}>
            <p className="text-xs text-slate-400 mb-3">
              {m.booking}: <span className="font-semibold text-slate-700">{manifest.crm.bookingModule.replace(/_/g, ' ')}</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {manifest.crm.modules.map(key => {
                const mod = getCrmModule(key);
                return (
                  <span key={key} className="text-xs bg-[#00C853]/10 text-[#008a39] border border-[#00C853]/20 px-2.5 py-1 rounded-full font-medium">
                    {mod.label.en}
                  </span>
                );
              })}
            </div>
          </Card>

          {/* Review Flow */}
          <Card icon={<Star className="w-4 h-4" />} iconColor="#FFB300" title={m.reviewFlow} fullWidth>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
              {manifest.crm.reviewFlow.steps.map((step: ReviewFlowStep, i) => {
                const Icon = CHANNEL_ICONS[step.channel] ?? Clock;
                const isLast = i === manifest.crm.reviewFlow.steps.length - 1;
                const stepLabel = m.stepLabels[step.stepKey as keyof typeof m.stepLabels] ?? step.stepKey;
                return (
                  <div key={step.stepKey} className="flex items-center gap-2">
                    <div className={\`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all \${
                      step.enabled
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-slate-50 border-slate-100 text-slate-400 opacity-50'
                    }\`}>
                      <div className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-200 text-amber-800 text-[9px] font-bold shrink-0">
                        {i + 1}
                      </div>
                      <Icon className="w-3 h-3 shrink-0" />
                      <span className="text-xs font-medium whitespace-nowrap">{stepLabel}</span>
                      {step.delayHours > 0 && (
                        <span className="text-[10px] opacity-60">+{step.delayHours}h</span>
                      )}
                    </div>
                    {!isLast && <ChevronDown className="w-3.5 h-3.5 text-slate-300 sm:rotate-[-90deg] shrink-0" />}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Delivery Actions */}
          <div id="delivery-actions">
            <Card icon={<Package className="w-4 h-4" />} iconColor="#FF5C5C" title={m.deliveryActions}>
              <DeliveryCenter manifest={manifest} />
            </Card>
          </div>

        </div>

        {/* ── JSON TOGGLE ─────────────────────────────────────────────────── */}
        <div className="mb-12">
          <button
            onClick={() => setShowJson(v => !v)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-factory-border bg-white text-sm font-medium text-slate-500 hover:text-primary hover:border-primary/30 transition-all"
          >
            {showJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showJson ? m.hideJson : m.showJson}
          </button>
          {showJson && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/5 shadow-card-xl animate-fade-in">
              <div className="flex items-center gap-2 px-5 py-3 bg-factory-dark border-b border-white/5">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-white/30 font-mono ml-2">manifest.json</span>
              </div>
              <pre className="p-5 bg-[#0d1117] text-green-400 text-xs overflow-x-auto leading-relaxed">
                {JSON.stringify(manifest, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* ── NEXT STEPS ──────────────────────────────────────────────────── */}
        <div className="pb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">{m.nextSteps}</h2>
            <div className="flex-1 h-px bg-factory-border" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NEXT_ITEMS.map((item, i) => (
            <div
              key={item.title}
              style={{ animationDelay: \`\${i * 80}ms\` }}
              className={\`animate-fade-up bg-white rounded-2xl border border-factory-border p-5 flex flex-col gap-4 shadow-card \${item.active ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all' : 'opacity-55 pointer-events-none select-none'}\`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.bg }}>
                  <item.icon className="w-4.5 h-4.5" style={{ color: item.color, width: 18, height: 18 }} />
                </div>
                <h3 className="text-sm font-bold text-factory-dark">{item.title}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed flex-1">{item.desc}</p>
              <div>
                <p className="text-[10px] text-slate-400 mb-2 truncate">{item.badge}</p>
                {item.active && item.route ? (
                  <button
                    onClick={() => navigate(item.route!)}
                    className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white transition-all hover:opacity-90"
                    style={{ background: \`linear-gradient(135deg, \${item.color}cc, \${item.color})\` }}
                  >
                    {m.openButton} {item.title}
                  </button>
                ) : item.active && 'scrollTo' in item ? (
                  <button
                    onClick={() => document.getElementById((item as { scrollTo: string }).scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white transition-all hover:opacity-90"
                    style={{ background: \`linear-gradient(135deg, \${item.color}cc, \${item.color})\` }}
                  >
                    {m.openDelivery}
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-xl bg-factory-bg border border-factory-border text-center text-xs font-semibold text-slate-400">
                    {m.comingNext}
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Local UI helpers ─────────────────────────────────────────────────────────

function Row({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-400 shrink-0">{label}</span>
      <span className={\`text-xs font-semibold text-slate-800 text-right ml-4 \${capitalize ? 'capitalize' : ''}\`}>{value}</span>
    </div>
  );
}

function MetaId({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-xl p-3 border border-white/8">
      <p className="text-[10px] text-white/35 uppercase tracking-widest mb-1.5">{label}</p>
      <p className="font-mono text-xs text-accent/80 truncate">{value}</p>
    </div>
  );
}

// Suppress unused import warning — used indirectly through NEXT_ITEMS icon references
void RefreshCw;
`,iv=`import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, UtensilsCrossed, Stethoscope, Sparkles, Dumbbell,
  Scissors, Hand, Wind, Car, BedDouble, GraduationCap, Home,
  HardHat, Calculator, Scale, ArrowRight, AlertCircle, Zap, User,
  Phone, Mail, MapPin, Globe, Building,
} from 'lucide-react';
import { getAllSectors, type SectorDefinition } from '../lib/sectors';
import { buildAndValidateManifest } from '../lib/manifestBuilder';
import { useProjectStore } from '../store/projectStore';
import { useTranslations, LanguageSwitcher } from '../lib/i18n';
import { Section } from '../components/ui/Section';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { CTA } from '../components/ui/CTA';
import { SpinnerRing } from '../components/ui/Loader';
import type { Language, OwnershipMode, SectorKey } from '../types/manifest';

const SECTOR_ICONS: Record<string, React.ElementType> = {
  restaurant: UtensilsCrossed, dental_clinic: Stethoscope, beauty_salon: Sparkles,
  fitness: Dumbbell, barber: Scissors, massage: Hand, cleaning: Wind,
  auto_service: Car, hotel: BedDouble, education: GraduationCap,
  real_estate: Home, construction: HardHat, accounting: Calculator, law_firm: Scale,
};

interface FormState {
  name: string; city: string; sector: SectorKey | ''; language: Language;
  clientBrand: string; phone: string; whatsapp: string; email: string;
  studioBrand: string; ownershipMode: OwnershipMode;
}
interface FormErrors {
  name?: string; city?: string; sector?: string;
  clientBrand?: string; phone?: string; email?: string; studioBrand?: string;
}

const WEBSITE_LANGS: { key: Language; flag: string }[] = [
  { key: 'en', flag: 'EN' },
  { key: 'de', flag: 'DE' },
  { key: 'ru', flag: 'RU' },
];

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const { setQuestionnaire, setManifest } = useProjectStore();
  const { t } = useTranslations();
  const sectors: SectorDefinition[] = getAllSectors();

  const [form, setFormState] = useState<FormState>({
    name: '', city: '', sector: '', language: 'en',
    clientBrand: '', phone: '', whatsapp: '', email: '',
    studioBrand: '', ownershipMode: 'client_owned',
  });
  const [errors, setErrors]         = useState<FormErrors>({});
  const [submitted, setSubmitted]   = useState(false);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const validate = (f: FormState): FormErrors => {
    const e: FormErrors = {};
    if (!f.name.trim())        e.name        = t.validation.nameRequired;
    if (!f.city.trim())        e.city        = t.validation.cityRequired;
    if (!f.sector)             e.sector      = t.validation.sectorRequired;
    if (!f.clientBrand.trim()) e.clientBrand = t.validation.contactRequired;
    if (!f.phone.trim())       e.phone       = t.validation.phoneRequired;
    if (!f.email.trim())       e.email       = t.validation.emailRequired;
    else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(f.email)) e.email = t.validation.emailInvalid;
    if (!f.studioBrand.trim()) e.studioBrand = t.validation.studioRequired;
    return e;
  };

  const set = (field: keyof FormState, value: string) => {
    const next = { ...form, [field]: value };
    setFormState(next);
    if (submitted) setErrors(validate(next));
  };

  const ownershipModes: { key: OwnershipMode; label: string; desc: string }[] = [
    { key: 'client_owned', label: t.ownership.client_owned.label, desc: t.ownership.client_owned.desc },
    { key: 'studio_owned', label: t.ownership.studio_owned.label, desc: t.ownership.studio_owned.desc },
    { key: 'white_label',  label: t.ownership.white_label.label,  desc: t.ownership.white_label.desc },
  ];

  const handleSubmit = async () => {
    setSubmitted(true);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setGenerating(true);
    await new Promise(r => setTimeout(r, 600));

    const result = buildAndValidateManifest({
      name: form.name, sector: form.sector as SectorKey, city: form.city,
      language: form.language, phone: form.phone,
      whatsapp: form.whatsapp || undefined, email: form.email,
      studioBrand: form.studioBrand, clientBrand: form.clientBrand,
      ownershipMode: form.ownershipMode,
    });

    if (!result.valid) {
      setGenerating(false);
      setManifestError(result.errors.map(e => e.message).join(' · '));
      return;
    }

    setQuestionnaire({
      name: form.name, sector: form.sector as SectorKey, city: form.city,
      language: form.language, phone: form.phone, whatsapp: form.whatsapp || undefined,
      email: form.email, studioBrand: form.studioBrand, clientBrand: form.clientBrand,
      ownershipMode: form.ownershipMode,
    });
    setManifest(result.manifest);
    navigate('/studio');
  };

  const hasErrors = submitted && Object.keys(errors).length > 0;

  return (
    <div className="min-h-screen bg-factory-bg">
      {/* ── Fixed Header ─────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-factory-dark/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-glow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Factory Website+CRM</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/40">
              {t.header.tagline}
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-dark-surface pt-16">
        <div className="max-w-6xl mx-auto px-6 py-14 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5 animate-fade-up">
            {t.hero.title}<br />
            <span className="gradient-text">{t.hero.titleAccent}</span>
          </h1>
          <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed animate-fade-up delay-150 mb-8">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-white/35 animate-fade-up delay-300">
            {t.hero.flowSteps.map((step: string, i: number, arr: string[]) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className="px-2 py-1 rounded-md bg-white/6 border border-white/10 text-white/50 font-medium whitespace-nowrap">
                  {step}
                </span>
                {i < arr.length - 1 && <span className="text-white/20">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main form ────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* ── SECTOR GRID ──────────────────────────────────────────────── */}
        <Section
          number="01"
          title={t.formSections['01'].title}
          subtitle={t.formSections['01'].subtitle}
          required
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sectors.map((sector, i) => {
              const Icon = SECTOR_ICONS[sector.key] ?? Building2;
              const selected = form.sector === sector.key;
              return (
                <button
                  key={sector.key}
                  type="button"
                  onClick={() => set('sector', sector.key)}
                  style={{ animationDelay: \`\${i * 35}ms\` }}
                  className={\`
                    animate-fade-up group relative flex flex-col items-center gap-2.5 p-4 rounded-2xl
                    border-2 transition-all duration-200 text-center cursor-pointer
                    \${selected
                      ? 'border-primary bg-primary/8 shadow-selected'
                      : 'border-factory-border bg-white hover:border-primary/40 hover:shadow-card hover:-translate-y-0.5'}
                  \`}
                >
                  <div className={\`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-all
                    \${selected
                      ? 'bg-brand shadow-glow-sm'
                      : 'bg-factory-bg group-hover:bg-brand-subtle'}
                  \`}>
                    <Icon className={\`w-5 h-5 transition-colors \${selected ? 'text-white' : 'text-primary/60 group-hover:text-primary'}\`} />
                  </div>
                  <span className={\`text-xs font-semibold leading-tight \${selected ? 'text-primary' : 'text-slate-600'}\`}>
                    {sector.labelEn}
                  </span>
                  {!sector.builtIn && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                      {t.customBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {errors.sector && <FieldError message={errors.sector} />}
        </Section>

        {/* ── DETAILS + CONTACTS ───────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-8">
          <Section number="02" title={t.formSections['02'].title} subtitle={t.formSections['02'].subtitle} required>
            <div className="space-y-4">
              <Field label={t.fields.businessName} required error={errors.name} icon={<Building className="w-4 h-4" />}>
                <Input value={form.name} onChange={v => set('name', v)} placeholder={t.placeholders.businessName} error={!!errors.name} />
              </Field>
              <Field label={t.fields.city} required error={errors.city} icon={<MapPin className="w-4 h-4" />}>
                <Input value={form.city} onChange={v => set('city', v)} placeholder={t.placeholders.city} error={!!errors.city} />
              </Field>
              <Field label={t.fields.websiteLanguage} required>
                <div className="grid grid-cols-3 gap-2">
                  {WEBSITE_LANGS.map(lang => (
                    <button
                      key={lang.key}
                      type="button"
                      onClick={() => set('language', lang.key)}
                      className={\`
                        py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border
                        \${form.language === lang.key
                          ? 'bg-brand text-white border-transparent shadow-glow-sm'
                          : 'bg-white text-slate-500 border-factory-border hover:border-primary/40 hover:text-primary'}
                      \`}
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </Section>

          <Section number="03" title={t.formSections['03'].title} subtitle={t.formSections['03'].subtitle} required>
            <div className="space-y-4">
              <Field label={t.fields.contactPerson} required error={errors.clientBrand} icon={<User className="w-4 h-4" />}>
                <Input value={form.clientBrand} onChange={v => set('clientBrand', v)} placeholder={t.placeholders.contactPerson} error={!!errors.clientBrand} />
              </Field>
              <Field label={t.fields.phone} required error={errors.phone} icon={<Phone className="w-4 h-4" />}>
                <Input value={form.phone} onChange={v => set('phone', v)} placeholder={t.placeholders.phone} error={!!errors.phone} />
              </Field>
              <Field label={t.fields.whatsapp} icon={<Phone className="w-4 h-4" />}>
                <Input value={form.whatsapp} onChange={v => set('whatsapp', v)} placeholder={t.placeholders.whatsapp} />
              </Field>
              <Field label={t.fields.email} required error={errors.email} icon={<Mail className="w-4 h-4" />}>
                <Input value={form.email} onChange={v => set('email', v)} placeholder={t.placeholders.email} error={!!errors.email} />
              </Field>
            </div>
          </Section>
        </div>

        {/* ── STUDIO SETTINGS ──────────────────────────────────────────── */}
        <Section number="04" title={t.formSections['04'].title} subtitle={t.formSections['04'].subtitle}>
          <div className="grid md:grid-cols-2 gap-6">
            <Field label={t.fields.agencyBrand} required error={errors.studioBrand} icon={<Globe className="w-4 h-4" />}>
              <Input value={form.studioBrand} onChange={v => set('studioBrand', v)} placeholder={t.placeholders.agencyBrand} error={!!errors.studioBrand} />
            </Field>
            <Field label={t.fields.ownershipMode}>
              <Select
                value={form.ownershipMode}
                onChange={e => set('ownershipMode', e.target.value)}
              >
                {ownershipModes.map(m => (
                  <option key={m.key} value={m.key}>{m.label} — {m.desc}</option>
                ))}
              </Select>
            </Field>
          </div>
        </Section>

        {/* ── ERRORS ───────────────────────────────────────────────────── */}
        {(hasErrors || manifestError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200/80 rounded-2xl flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              {manifestError ?? t.validation.fixFields}
            </p>
          </div>
        )}

        {/* ── SUBMIT ───────────────────────────────────────────────────── */}
        <div className="flex justify-end pb-12">
          <CTA type="button" onClick={handleSubmit} disabled={generating}>
            {generating ? (
              <>
                <SpinnerRing />
                {t.cta.creating}
              </>
            ) : (
              <>
                {t.cta.createDemo}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </CTA>
        </div>
      </main>
    </div>
  );
}

// ─── Local helpers ────────────────────────────────────────────────────────────

function Field({ label, required, error, icon, children }: {
  label: string; required?: boolean; error?: string; icon?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
        {required && <span className="text-primary text-xs ml-0.5">*</span>}
      </label>
      {children}
      {error && <FieldError message={error} />}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5 animate-fade-in">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />{message}
    </p>
  );
}
`,lv=`import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, ArrowRight, Building, Image, Palette, Camera,
  Upload, Trash2,
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useTranslations, LanguageSwitcher } from '../lib/i18n';
import { buildDefaultBranding } from '../lib/brandingDefaults';
import { getBaseImagesForManifest } from '../lib/imageOverrides';
import { compressImageFile } from '../lib/imageCompression';
import { getTheme } from '../lib/themes';
import type { ManifestBranding } from '../types/manifest';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CTA } from '../components/ui/CTA';

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

function isValidHex(hex: string): boolean {
  return HEX_PATTERN.test(hex);
}

function normalizeHex(hex: string): string {
  const trimmed = hex.trim();
  if (!trimmed.startsWith('#')) return \`#\${trimmed}\`;
  return trimmed;
}

export default function StudioSdkPage() {
  const navigate = useNavigate();
  const { state, setBranding } = useProjectStore();
  const { t } = useTranslations();
  const s = t.studioSdk;

  const manifest = state.manifest;

  const defaultColor = useMemo(() => {
    if (!manifest) return '#6C3BFF';
    const theme = getTheme(manifest.website.themeKey);
    return theme.colors.primary[500];
  }, [manifest]);

  const initialBranding = useMemo((): ManifestBranding => {
    if (!manifest) return {};
    return {
      ...buildDefaultBranding(manifest),
      ...manifest.branding,
    };
  }, [manifest]);

  const baseImages = useMemo(() => {
    if (!manifest) return null;
    return getBaseImagesForManifest(manifest);
  }, [manifest]);

  const [branding, setBrandingState] = useState<ManifestBranding>(initialBranding);
  const [primaryColorHex, setPrimaryColorHex] = useState(
    () => initialBranding.primaryColorHex ?? defaultColor,
  );
  const [hexError, setHexError] = useState(false);

  if (!manifest || !baseImages) {
    navigate('/');
    return null;
  }

  const p = s.photos;

  const setPhotoOverride = (key: 'hero' | 'about', value: string | undefined) => {
    setBrandingState(prev => ({
      ...prev,
      photoOverrides: {
        ...prev.photoOverrides,
        [key]: value,
      },
    }));
  };

  const setArrayPhotoOverride = (
    key: 'gallery' | 'services',
    index: number,
    value: string | undefined,
  ) => {
    setBrandingState(prev => {
      const photoOverrides = prev.photoOverrides ?? {};
      const current = [...(photoOverrides[key] ?? [])];
      if (value === undefined) {
        delete current[index];
      } else {
        current[index] = value;
      }
      return {
        ...prev,
        photoOverrides: {
          ...photoOverrides,
          [key]: current,
        },
      };
    });
  };

  const handlePhotoUpload = (
    file: File | undefined,
    onLoaded: (dataUrl: string) => void,
  ) => {
    if (!file) return;
    compressImageFile(file)
      .then(onLoaded)
      .catch(() => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') onLoaded(reader.result);
        };
        reader.readAsDataURL(file);
      });
  };

  const setField = (field: keyof ManifestBranding, value: string) => {
    setBrandingState(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (file: File | undefined) => {
    if (!file) return;
    compressImageFile(file, 800, 0.9)
      .then(dataUrl => setBrandingState(prev => ({ ...prev, logoDataUrl: dataUrl })))
      .catch(() => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setBrandingState(prev => ({ ...prev, logoDataUrl: reader.result as string }));
          }
        };
        reader.readAsDataURL(file);
      });
  };

  const handleColorPickerChange = (value: string) => {
    setPrimaryColorHex(value);
    setHexError(false);
  };

  const handleHexInputChange = (value: string) => {
    const normalized = normalizeHex(value);
    setPrimaryColorHex(normalized);
    setHexError(normalized.length > 0 && !isValidHex(normalized));
  };

  const handleSave = () => {
    if (!isValidHex(primaryColorHex)) {
      setHexError(true);
      return;
    }

    setBranding({
      ...branding,
      primaryColorHex,
    });
    navigate('/manifest');
  };

  const contrastTextColor = (() => {
    const hex = primaryColorHex.replace('#', '');
    if (hex.length !== 6) return '#ffffff';
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.55 ? '#111827' : '#ffffff';
  })();

  return (
    <div className="min-h-screen bg-factory-bg">
      <header className="fixed top-0 left-0 right-0 z-50 bg-factory-dark/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-glow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Factory Website+CRM</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/40">
              {s.badge}
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="bg-dark-surface pt-16">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 animate-fade-up">
            {s.title}
          </h1>
          <p className="text-white/50 text-base max-w-xl mx-auto leading-relaxed animate-fade-up delay-150">
            {s.subtitle}
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 pb-16 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            icon={<Building className="w-4 h-4" />}
            iconColor="#6C3BFF"
            title={s.sections.brandContacts}
            fullWidth
          >
            <p className="text-xs text-slate-500 mb-4">{s.sections.brandContactsSub}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={s.fields.businessName}>
                <Input
                  value={branding.businessNameOverride ?? ''}
                  onChange={v => setField('businessNameOverride', v)}
                  placeholder={s.placeholders.businessName}
                />
              </Field>
              <Field label={s.fields.phone}>
                <Input
                  value={branding.phoneOverride ?? ''}
                  onChange={v => setField('phoneOverride', v)}
                  placeholder={s.placeholders.phone}
                />
              </Field>
              <Field label={s.fields.whatsapp}>
                <Input
                  value={branding.whatsappOverride ?? ''}
                  onChange={v => setField('whatsappOverride', v)}
                  placeholder={s.placeholders.whatsapp}
                />
              </Field>
              <Field label={s.fields.email}>
                <Input
                  value={branding.emailOverride ?? ''}
                  onChange={v => setField('emailOverride', v)}
                  placeholder={s.placeholders.email}
                  type="email"
                />
              </Field>
            </div>
          </Card>

          <Card
            icon={<Image className="w-4 h-4" />}
            iconColor="#00D4FF"
            title={s.sections.logo}
          >
            <p className="text-xs text-slate-500 mb-4">{s.sections.logoSub}</p>
            <div className="space-y-4">
              <label className="flex items-center justify-center gap-2 w-full px-4 py-6 rounded-xl border-2 border-dashed border-factory-border bg-factory-bg hover:border-primary/40 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-semibold text-slate-600">{s.logo.upload}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleLogoUpload(e.target.files?.[0])}
                />
              </label>

              {branding.logoDataUrl && (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-factory-border bg-factory-bg">
                  <img
                    src={branding.logoDataUrl}
                    alt={s.logo.previewAlt}
                    className="h-16 w-auto max-w-[160px] object-contain rounded-lg bg-white p-2"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBrandingState(prev => ({ ...prev, logoDataUrl: undefined }))}
                  >
                    <Trash2 className="w-4 h-4" />
                    {s.logo.remove}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card
            icon={<Palette className="w-4 h-4" />}
            iconColor="#FF6D00"
            title={s.sections.color}
            fullWidth
          >
            <p className="text-xs text-slate-500 mb-4">{s.sections.colorSub}</p>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1 space-y-4 w-full">
                <Field label={s.fields.primaryColor}>
                  <input
                    type="color"
                    value={isValidHex(primaryColorHex) ? primaryColorHex : defaultColor}
                    onChange={e => handleColorPickerChange(e.target.value)}
                    className="w-full h-12 rounded-xl border-2 border-factory-border cursor-pointer bg-white p-1"
                  />
                </Field>
                <Field label={s.fields.hexValue} error={hexError ? s.validation.invalidHex : undefined}>
                  <Input
                    value={primaryColorHex}
                    onChange={handleHexInputChange}
                    placeholder="#6C3BFF"
                    error={hexError}
                  />
                </Field>
              </div>

              <div className="shrink-0">
                <p className="text-xs font-semibold text-slate-500 mb-2">{s.colorPreviewLabel}</p>
                <div
                  className="w-28 h-28 rounded-2xl border border-factory-border flex items-center justify-center shadow-card"
                  style={{ backgroundColor: isValidHex(primaryColorHex) ? primaryColorHex : defaultColor }}
                >
                  <span
                    className="text-3xl font-bold"
                    style={{ color: contrastTextColor }}
                  >
                    {s.colorPreview}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card
            icon={<Camera className="w-4 h-4" />}
            iconColor="#00C853"
            title={s.sections.photos}
            fullWidth
          >
            <p className="text-xs text-slate-500 mb-6">{s.sections.photosSub}</p>
            <div className="grid md:grid-cols-2 gap-6">
              <PhotoSlot
                label={p.hero}
                previewUrl={branding.photoOverrides?.hero ?? baseImages.hero}
                hasOverride={!!branding.photoOverrides?.hero}
                uploadLabel={p.upload}
                resetLabel={p.resetStock}
                previewAlt={p.previewAlt}
                onUpload={file => handlePhotoUpload(file, url => setPhotoOverride('hero', url))}
                onReset={() => setPhotoOverride('hero', undefined)}
              />
              <PhotoSlot
                label={p.about}
                previewUrl={branding.photoOverrides?.about ?? baseImages.about}
                hasOverride={!!branding.photoOverrides?.about}
                uploadLabel={p.upload}
                resetLabel={p.resetStock}
                previewAlt={p.previewAlt}
                onUpload={file => handlePhotoUpload(file, url => setPhotoOverride('about', url))}
                onReset={() => setPhotoOverride('about', undefined)}
              />
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-bold text-factory-dark mb-4">{p.gallery}</h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {baseImages.gallery.map((stockUrl, index) => (
                  <PhotoSlot
                    key={\`gallery-\${index}\`}
                    label={p.slot.replace('{n}', String(index + 1))}
                    previewUrl={branding.photoOverrides?.gallery?.[index] ?? stockUrl}
                    hasOverride={!!branding.photoOverrides?.gallery?.[index]}
                    uploadLabel={p.upload}
                    resetLabel={p.resetStock}
                    previewAlt={p.previewAlt}
                    compact
                    onUpload={file => handlePhotoUpload(file, url => setArrayPhotoOverride('gallery', index, url))}
                    onReset={() => setArrayPhotoOverride('gallery', index, undefined)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-bold text-factory-dark mb-4">{p.services}</h4>
              <div className="grid sm:grid-cols-3 gap-4">
                {baseImages.services.map((stockUrl, index) => (
                  <PhotoSlot
                    key={\`services-\${index}\`}
                    label={p.slot.replace('{n}', String(index + 1))}
                    previewUrl={branding.photoOverrides?.services?.[index] ?? stockUrl}
                    hasOverride={!!branding.photoOverrides?.services?.[index]}
                    uploadLabel={p.upload}
                    resetLabel={p.resetStock}
                    previewAlt={p.previewAlt}
                    compact
                    onUpload={file => handlePhotoUpload(file, url => setArrayPhotoOverride('services', index, url))}
                    onReset={() => setArrayPhotoOverride('services', index, undefined)}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <CTA type="button" onClick={handleSave}>
            {s.cta.saveAndContinue}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </CTA>
        </div>
      </main>
    </div>
  );
}

function PhotoSlot({
  label,
  previewUrl,
  hasOverride,
  uploadLabel,
  resetLabel,
  previewAlt,
  compact,
  onUpload,
  onReset,
}: {
  label: string;
  previewUrl: string;
  hasOverride: boolean;
  uploadLabel: string;
  resetLabel: string;
  previewAlt: string;
  compact?: boolean;
  onUpload: (file: File | undefined) => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-xl border border-factory-border bg-factory-bg p-4 space-y-3">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <img
        src={previewUrl}
        alt={previewAlt}
        className={\`w-full object-cover rounded-lg border border-factory-border bg-white \${compact ? 'h-24' : 'h-32'}\`}
      />
      <label className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl border border-factory-border bg-white hover:border-primary/40 cursor-pointer transition-colors">
        <Upload className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-600">{uploadLabel}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            onUpload(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </label>
      {hasOverride && (
        <Button variant="outline" size="sm" className="w-full" onClick={onReset}>
          <Trash2 className="w-4 h-4" />
          {resetLabel}
        </Button>
      )}
    </div>
  );
}

function Field({ label, error, children }: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
`,cv=`import { Link, useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, Calendar, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { getDisplayPhone, getDisplayWhatsapp } from '../lib/brandingDefaults';
import { resolveImages } from '../lib/imageOverrides';
import { resolveNicheImages } from '../lib/resolveNicheImages';
import { buildBrandedPalette } from './website-demo/themeHelpers';
import { getSectorContent } from './website-demo/sectorContent';
import { HeroSection, AboutSection, GoogleMapsSection, WhatsAppSection, EmailSection } from './website-demo/HeroAboutSections';
import { ServicesSection, GallerySection, TestimonialsSection } from './website-demo/ServicesSections';
import { BookingSection, FaqSection, ContactsSection, FooterSection } from './website-demo/BookingFaqContactSections';
import { ReviewFlowSection } from './website-demo/ReviewFlowSection';
import { Navbar } from '../components/ui/Navbar';
import { useTranslations } from '../lib/i18n';
import { isProductMode } from '../lib/bootstrap';
import type { WebsiteSectionKey } from '../types/manifest';

export default function WebsiteDemoPage() {
  const navigate = useNavigate();
  const { state } = useProjectStore();
  const { t } = useTranslations();
  const product = isProductMode();

  if (!state.manifest) {
    if (!product) navigate('/');
    return null;
  }

  const manifest = state.manifest;
  const palette  = buildBrandedPalette(manifest);
  const phone    = getDisplayPhone(manifest);
  const whatsapp = getDisplayWhatsapp(manifest);
  const content  = getSectorContent(manifest.business.sector);

  let images = resolveNicheImages(manifest);
  images = resolveImages(images, manifest.branding?.photoOverrides);

  const sectionKeys = manifest.website.sections as WebsiteSectionKey[];

  // Nav labels respect website language (manifest.business.language)
  const NAV_LABELS: Partial<Record<WebsiteSectionKey, string>> = {
    hero:         t.websiteDemo.nav.home,
    about:        t.websiteDemo.nav.about,
    services:     t.websiteDemo.nav.services,
    gallery:      t.websiteDemo.nav.gallery,
    booking:      t.websiteDemo.nav.booking,
    testimonials: t.websiteDemo.nav.testimonials,
    faq:          t.websiteDemo.nav.faq,
    contacts:     t.websiteDemo.nav.contacts,
  };

  const navLinks = sectionKeys.filter(k => NAV_LABELS[k]);
  const sectionProps = { manifest, palette, content, images };

  return (
    <div style={{ fontFamily: palette.font }}>

      {!product && (
        <div
          className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 h-11"
          style={{ background: 'linear-gradient(135deg, #111827 0%, #1a0f3e 100%)', color: 'white' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white/90 tracking-tight">Factory Website+CRM</span>
            <span className="text-white/15">·</span>
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-white/40">
              <span className="capitalize">{manifest.business.sector.replace(/_/g, ' ')}</span>
              <span className="text-white/15">·</span>
              <span>{manifest.business.language.toUpperCase()}</span>
              <span className="text-white/15">·</span>
              <span>Manifest v{manifest.metadata.manifestVersion}</span>
              <span className="text-white/15">·</span>
              <span>Engine v{manifest.metadata.engineVersion}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/manifest')}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.websiteDemo.backToManifest}
          </button>
        </div>
      )}

      {product && (
        <div className="sticky top-0 z-50 flex items-center justify-end px-4 sm:px-6 h-10 bg-white/90 backdrop-blur border-b border-slate-100">
          <Link
            to="/crm"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Open CRM
          </Link>
        </div>
      )}

      {!product && <ReviewFlowSection manifest={manifest} palette={palette} content={content} />}

      <Navbar
        manifest={manifest}
        palette={palette}
        navLinks={navLinks}
        navLabels={NAV_LABELS}
        callLabel={t.websiteDemo.call}
        bookLabel={t.websiteDemo.bookNow}
      />

      {/* ── WEBSITE SECTIONS ─────────────────────────────────────────────── */}
      {sectionKeys.map(key => {
        switch (key) {
          case 'hero':          return <HeroSection         key={key} {...sectionProps} />;
          case 'about':         return <AboutSection        key={key} {...sectionProps} />;
          case 'services':      return <ServicesSection     key={key} {...sectionProps} />;
          case 'gallery':       return <GallerySection      key={key} {...sectionProps} />;
          case 'booking':       return <BookingSection      key={key} {...sectionProps} />;
          case 'testimonials':  return <TestimonialsSection key={key} {...sectionProps} />;
          case 'faq':           return <FaqSection          key={key} {...sectionProps} />;
          case 'contacts':      return <ContactsSection     key={key} {...sectionProps} />;
          case 'google_maps':   return <GoogleMapsSection   key={key} {...sectionProps} />;
          case 'whatsapp':      return <WhatsAppSection     key={key} {...sectionProps} />;
          case 'email_section': return <EmailSection        key={key} {...sectionProps} />;
          default:              return null;
        }
      })}

      <FooterSection {...sectionProps} />

      {/* ── FLOATING ACTIONS ─────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {phone && (
          <FloatBtn href={\`tel:\${phone}\`} label={t.websiteDemo.floating.call} color="#22c55e">
            <Phone className="w-5 h-5" />
          </FloatBtn>
        )}
        {whatsapp && (
          <FloatBtn href={\`https://wa.me/\${whatsapp.replace(/\\D/g, '')}\`} label={t.websiteDemo.floating.whatsapp} color="#25D366">
            <MessageCircle className="w-5 h-5" />
          </FloatBtn>
        )}
        <FloatBtn href="#booking" label={t.websiteDemo.floating.book} color={palette.primary}>
          <Calendar className="w-5 h-5" />
        </FloatBtn>
      </div>
    </div>
  );
}

function FloatBtn({ href, color, label, children }: {
  href: string; color: string; label: string; children: React.ReactNode;
}) {
  return (
    <a href={href} title={label} className="group flex items-center gap-2 justify-end">
      <span
        className="hidden group-hover:block px-2.5 py-1 rounded-full text-xs font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        {label}
      </span>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
        style={{ backgroundColor: color }}
      >
        {children}
      </div>
    </a>
  );
}
`,dv=`import { useState, useEffect, useRef } from 'react';
import {
  Archive, Github, Globe, Flame, CheckCircle2,
  Download, ExternalLink, Loader2, Zap,
} from 'lucide-react';
import type { Manifest } from '../../types/manifest';
import { generateDemoZip, toSlug } from '../../lib/zipGenerator';
import { useTranslations } from '../../lib/i18n';
import { openFirebaseWhatsAppChat } from '../../lib/firebaseWhatsApp';
import { redeemPromoCode, isPromoUnlocked, setPromoUnlocked, getPromoErrorMessage } from '../../lib/promoCode';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

interface Props { manifest: Manifest; }

type ActionKey = 'zip' | 'github' | 'deploy' | 'firebase';

interface ActionState {
  done: boolean;
  completedAt: string | null;
}

export function DeliveryCenter({ manifest }: Props) {
  const { t, language } = useTranslations();
  const d = t.delivery;

  const SEQUENCES: Record<ActionKey, { label: string; duration: number }[]> = {
    zip: [
      { label: d.zipSteps.preparing, duration: 800 },
      { label: d.zipSteps.packaging, duration: 900 },
      { label: d.zipSteps.archiving, duration: 700 },
      { label: d.zipSteps.ready,     duration: 0   },
    ],
    github: [
      { label: d.githubSteps.creating, duration: 900  },
      { label: d.githubSteps.uploading, duration: 1100 },
      { label: d.githubSteps.readme,   duration: 600  },
      { label: d.githubSteps.done,     duration: 0    },
    ],
    deploy: [
      { label: d.deploySteps.uploading, duration: 800  },
      { label: d.deploySteps.building,  duration: 1200 },
      { label: d.deploySteps.deploying, duration: 900  },
      { label: d.deploySteps.ready,     duration: 0    },
    ],
    firebase: [
      { label: d.firebaseSteps.config,      duration: 700  },
      { label: d.firebaseSteps.collections, duration: 1000 },
      { label: d.firebaseSteps.rules,       duration: 800  },
      { label: d.firebaseSteps.done,        duration: 0    },
    ],
  };

  const ACTIONS: { key: ActionKey; icon: React.ElementType; label: string; color: string; bg: string }[] = [
    { key: 'zip',      icon: Archive, label: d.downloadZip,      color: '#6C3BFF', bg: 'rgba(108,59,255,0.10)' },
    { key: 'github',   icon: Github,  label: d.pushGithub,       color: '#111827', bg: 'rgba(17,24,39,0.08)'   },
    { key: 'deploy',   icon: Globe,   label: d.deployHosting,    color: '#00D4FF', bg: 'rgba(0,212,255,0.10)'  },
    { key: 'firebase', icon: Flame,   label: d.connectFirebase,  color: '#FF6D00', bg: 'rgba(255,109,0,0.10)'  },
  ];

  const [states, setStates] = useState<Record<ActionKey, ActionState>>({
    zip:      { done: false, completedAt: null },
    github:   { done: false, completedAt: null },
    deploy:   { done: false, completedAt: null },
    firebase: { done: false, completedAt: null },
  });
  const [active, setActive] = useState<ActionKey | null>(null);
  const [promoUnlocked, setPromoUnlockedState] = useState(isPromoUnlocked);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const allDone = Object.values(states).every(s => s.done);

  const handlePromoSubmit = async () => {
    setPromoLoading(true);
    setPromoError(null);
    const result = await redeemPromoCode(promoInput);
    setPromoLoading(false);
    if (result.valid) {
      setPromoUnlocked();
      setPromoUnlockedState(true);
      setPromoInput('');
      return;
    }
    setPromoError(getPromoErrorMessage(language));
  };

  const tryOpenAction = (action: ActionKey) => {
    if (!promoUnlocked) {
      setPromoError(getPromoErrorMessage(language));
      return;
    }
    if (action === 'firebase') {
      openFirebaseWhatsAppChat(language);
      return;
    }
    setActive(action);
  };

  const markDone = (key: ActionKey) => {
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setStates(prev => ({ ...prev, [key]: { done: true, completedAt: now } }));
  };

  const slug = toSlug(manifest.business.name, manifest.metadata.projectId.slice(0, 12));
  const repoUrl = \`https://github.com/demo/\${slug}\`;
  const siteUrl = \`https://\${slug}-demo.netlify.app\`;

  return (
    <div className="space-y-4">
      {allDone && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-green-200 bg-green-50 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-700">{d.allDoneTitle}</p>
            <p className="text-xs text-green-600">{d.allDoneSub}</p>
          </div>
          <Zap className="w-4 h-4 text-green-400 ml-auto" />
        </div>
      )}

      <div className={\`rounded-xl border p-4 space-y-3 \${promoUnlocked ? 'border-green-200 bg-green-50' : 'border-factory-border bg-white'}\`}>
        <div className="flex items-center gap-2">
          {promoUnlocked
            ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            : <Archive className="w-4 h-4 text-primary shrink-0" />}
          <p className="text-sm font-bold text-slate-800">
            {promoUnlocked ? d.promo.unlockedTitle : d.promo.title}
          </p>
        </div>
        {!promoUnlocked && (
          <>
            <p className="text-xs text-slate-500">{d.promo.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={promoInput}
                onChange={setPromoInput}
                placeholder={d.promo.placeholder}
                error={!!promoError}
                className="flex-1"
              />
              <button
                type="button"
                onClick={handlePromoSubmit}
                disabled={promoLoading || !promoInput.trim()}
                className="px-5 py-3 rounded-xl text-sm font-bold text-white bg-brand hover:opacity-90 disabled:opacity-60 transition-all shrink-0"
              >
                {promoLoading ? d.promo.checking : d.promo.apply}
              </button>
            </div>
            {promoError && (
              <p className="text-xs text-red-600">{promoError}</p>
            )}
          </>
        )}
        {promoUnlocked && (
          <p className="text-xs text-green-700">{d.promo.unlockedSub}</p>
        )}
      </div>

      <div className={\`grid grid-cols-2 gap-3 \${!promoUnlocked ? 'opacity-50 pointer-events-none' : ''}\`}>
        {ACTIONS.map(action => {
          const s = states[action.key];
          return (
            <button
              key={action.key}
              onClick={() => tryOpenAction(action.key)}
              className={\`relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all hover:-translate-y-0.5 \${
                s.done
                  ? 'border-green-200 bg-green-50 hover:bg-green-100'
                  : 'border-factory-border bg-factory-bg hover:border-slate-300 hover:bg-white'
              }\`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: s.done ? 'rgba(34,197,94,0.12)' : action.bg }}
              >
                {s.done
                  ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                  : <action.icon className="w-4 h-4" style={{ color: action.color }} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={\`text-xs font-semibold truncate \${s.done ? 'text-green-700' : 'text-slate-700'}\`}>
                  {action.label}
                </p>
                {s.done
                  ? <p className="text-[10px] text-green-500">✓ {d.completed} · {s.completedAt}</p>
                  : <p className="text-[10px] text-slate-400">{d.clickToRun}</p>
                }
              </div>
            </button>
          );
        })}
      </div>

      {active === 'zip'      && <ZipModal      manifest={manifest} sequences={SEQUENCES} onDone={() => { markDone('zip');      setActive(null); }} onClose={() => setActive(null)} />}
      {active === 'github'   && <ProgressModal action="github"   sequences={SEQUENCES} repoUrl={repoUrl} onDone={() => { markDone('github');   setActive(null); }} onClose={() => setActive(null)} actionLabels={{ zip: d.downloadZip, github: d.pushGithub, deploy: d.deployHosting, firebase: d.connectFirebase }} resultLabels={{ repositoryUrl: d.repositoryUrl, liveDemoUrl: d.liveDemoUrl, firebaseConnected: d.firebaseConnected, configReady: d.configReady, openRepository: d.openRepository, openWebsite: d.openWebsite, done: d.done }} />}
      {active === 'deploy'   && <ProgressModal action="deploy"   sequences={SEQUENCES} siteUrl={siteUrl}  onDone={() => { markDone('deploy');   setActive(null); }} onClose={() => setActive(null)} actionLabels={{ zip: d.downloadZip, github: d.pushGithub, deploy: d.deployHosting, firebase: d.connectFirebase }} resultLabels={{ repositoryUrl: d.repositoryUrl, liveDemoUrl: d.liveDemoUrl, firebaseConnected: d.firebaseConnected, configReady: d.configReady, openRepository: d.openRepository, openWebsite: d.openWebsite, done: d.done }} />}
    </div>
  );
}

// ─── ZIP Modal ────────────────────────────────────────────────────────────────

function ZipModal({ manifest, sequences, onDone, onClose }: {
  manifest: Manifest;
  sequences: Record<ActionKey, { label: string; duration: number }[]>;
  onDone: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslations();
  const d = t.delivery;
  const [stepIndex, setStepIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const zipRef = useRef<Blob | null>(null);
  const seq = sequences.zip;

  useEffect(() => {
    let i = 0;
    const run = () => {
      if (i >= seq.length - 1) {
        zipRef.current = generateDemoZip(manifest);
        setReady(true);
        return;
      }
      const delay = seq[i].duration;
      i++;
      setStepIndex(i);
      setTimeout(run, delay);
    };
    const timer = setTimeout(run, seq[0].duration);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = () => {
    if (!zipRef.current) return;
    const url = URL.createObjectURL(zipRef.current);
    const a = document.createElement('a');
    const slug = toSlug(manifest.business.name, manifest.metadata.projectId.slice(0, 12));
    a.href = url;
    a.download = \`\${slug}-factory-website-crm.zip\`;
    a.click();
    URL.revokeObjectURL(url);
    onDone();
  };

  return (
    <Modal title={d.downloadZip} icon={<Archive className="w-4 h-4 text-[#6C3BFF]" />} onClose={onClose}>
      <ProgressSteps seq={seq} stepIndex={stepIndex} ready={ready} color="#6C3BFF" />
      {ready && (
        <button
          onClick={handleDownload}
          className="w-full mt-4 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6C3BFF, #00D4FF)' }}
        >
          <Download className="w-4 h-4" />
          {d.downloadProject}
        </button>
      )}
    </Modal>
  );
}

// ─── Generic Progress Modal ───────────────────────────────────────────────────

function ProgressModal({
  action, sequences, repoUrl, siteUrl, onDone, onClose, actionLabels, resultLabels,
}: {
  action: ActionKey;
  sequences: Record<ActionKey, { label: string; duration: number }[]>;
  repoUrl?: string; siteUrl?: string;
  onDone: () => void; onClose: () => void;
  actionLabels: Record<ActionKey, string>;
  resultLabels: { repositoryUrl: string; liveDemoUrl: string; firebaseConnected: string; configReady: string; openRepository: string; openWebsite: string; done: string };
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const seq = sequences[action];

  const META: Record<ActionKey, { icon: React.ElementType; color: string }> = {
    zip:      { icon: Archive, color: '#6C3BFF' },
    github:   { icon: Github,  color: '#111827' },
    deploy:   { icon: Globe,   color: '#00D4FF' },
    firebase: { icon: Flame,   color: '#FF6D00' },
  };
  const meta = META[action];
  const title = actionLabels[action];

  useEffect(() => {
    let i = 0;
    const run = () => {
      if (i >= seq.length - 1) { setReady(true); return; }
      const delay = seq[i].duration;
      i++;
      setStepIndex(i);
      setTimeout(run, delay);
    };
    const timer = setTimeout(run, seq[0].duration);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal title={title} icon={<meta.icon className="w-4 h-4" style={{ color: meta.color }} />} onClose={onClose}>
      <ProgressSteps seq={seq} stepIndex={stepIndex} ready={ready} color={meta.color} />
      {ready && (
        <div className="mt-4 space-y-3">
          {action === 'github' && repoUrl && (
            <ResultBlock label={resultLabels.repositoryUrl} value={repoUrl} color={meta.color}>
              <a href={repoUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                style={{ background: '#111827' }}
                onClick={onDone}
              >
                <ExternalLink className="w-3.5 h-3.5" /> {resultLabels.openRepository}
              </a>
            </ResultBlock>
          )}
          {action === 'deploy' && siteUrl && (
            <ResultBlock label={resultLabels.liveDemoUrl} value={siteUrl} color={meta.color}>
              <a href={siteUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                style={{ background: \`linear-gradient(135deg, #00D4FF88, #00D4FF)\` }}
                onClick={onDone}
              >
                <ExternalLink className="w-3.5 h-3.5" /> {resultLabels.openWebsite}
              </a>
            </ResultBlock>
          )}
          {action === 'firebase' && (
            <ResultBlock label={resultLabels.firebaseConnected} value={resultLabels.configReady} color={meta.color}>
              <button
                onClick={onDone}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                style={{ background: '#FF6D00' }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> {resultLabels.done}
              </button>
            </ResultBlock>
          )}
          {action === 'github' && !repoUrl && (
            <button onClick={onDone} className="w-full mt-2 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:opacity-90 transition-all">
              {resultLabels.done}
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function ProgressSteps({ seq, stepIndex, ready, color }: {
  seq: { label: string; duration: number }[]; stepIndex: number; ready: boolean; color: string;
}) {
  return (
    <div className="space-y-2">
      {seq.map((s, i) => {
        const isPast    = i < stepIndex;
        const isCurrent = i === stepIndex && !ready;
        const isLast    = i === seq.length - 1;
        const isDone    = ready && isLast;
        return (
          <div key={s.label} className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              {isDone || isPast ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 animate-spin" style={{ color }} />
              ) : (
                <div className="w-3 h-3 rounded-full border-2 border-slate-200" />
              )}
            </div>
            <span className={\`text-sm \${
              isDone || isPast ? 'text-slate-700 font-medium' :
              isCurrent        ? 'font-semibold text-slate-800' :
                                 'text-slate-400'
            }\`}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ResultBlock({ label, value, color, children }: {
  label: string; value: string; color: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4 space-y-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-mono font-semibold truncate" style={{ color }}>{value}</p>
      </div>
      {children}
    </div>
  );
}
`,uv=`import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Phone, MessageCircle, Mail, MapPin, Clock, Calendar, Send, CheckCircle2, LayoutDashboard, Star } from 'lucide-react';
import type { Manifest } from '../../types/manifest';
import type { ImageSourceDefinition } from '../../lib/imageSources';
import type { ThemePalette } from './themeHelpers';
import type { SectorContent } from './sectorContent';
import { useProjectStore } from '../../store/projectStore';
import { useTranslations } from '../../lib/i18n';
import {
  getDisplayBusinessName,
  getDisplayEmail,
  getDisplayPhone,
  getDisplayWhatsapp,
} from '../../lib/brandingDefaults';
import { ContactCard } from '../../components/ui/ContactCard';
import { SectionHeader } from '../../components/ui/SectionHeader';

interface P { manifest: Manifest; palette: ThemePalette; content: SectorContent; images: ImageSourceDefinition; }

// ─── Booking Section ──────────────────────────────────────────────────────────

export function BookingSection({ manifest, palette, content }: P) {
  const [sent, setSent] = useState(false);
  const { addBooking } = useProjectStore();
  const { t } = useTranslations();
  const s = t.sections.booking;

  const nameRef    = useRef<HTMLInputElement>(null);
  const phoneRef   = useRef<HTMLInputElement>(null);
  const dateRef    = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const reviewStep   = manifest.crm.reviewFlow.steps.find(st => st.stepKey === 'google_review_request');
  const waEnabled    = manifest.crm.reviewFlow.steps.some(st => st.channel === 'whatsapp' && st.enabled);
  const emailEnabled = manifest.crm.reviewFlow.steps.some(st => st.channel === 'email' && st.enabled);
  const serviceName  = content.services[0]?.name ?? 'Appointment';
  const businessName = getDisplayBusinessName(manifest);

  const handleConfirm = () => {
    const name    = nameRef.current?.value.trim()    || 'Anonymous';
    const phone   = phoneRef.current?.value.trim()   || '—';
    const date    = dateRef.current?.value            || today;
    const service = serviceRef.current?.value        || serviceName;
    addBooking({ name, phone, date, service, status: 'Confirmed' });
    setSent(true);
  };

  return (
    <section id="booking" className="py-24 relative overflow-hidden" style={{ fontFamily: palette.font }}>
      <div className="absolute inset-0" style={{ backgroundColor: palette.primary, opacity: 0.92 }} />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 60%)' }} />

      <div className="relative max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70 mb-3">{s.eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">{content.cta}</h2>
          <p className="text-white/70 mt-3 text-sm">{content.hours} · {content.openDays}</p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{s.confirmed}</h3>
              <p className="text-white/60 text-sm mt-1">{s.confirmedSub}</p>
            </div>

            <FlowCard icon={<LayoutDashboard className="w-4 h-4 text-[#00C853]" />} label={s.crmRecord} status={s.status.done} statusColor="#00C853">
              <p className="text-[11px] text-white/60">
                <span className="font-semibold text-white/80">Alex Johnson</span> · {serviceName} · {today} 15:30
              </p>
              <p className="text-[11px] text-white/40">Source: Online Booking · Notification channels: {manifest.crm.notificationChannels.join(', ')}</p>
            </FlowCard>

            {waEnabled && (
              <FlowCard icon={<MessageCircle className="w-4 h-4 text-[#25D366]" />} label={s.whatsappSent} status={s.status.delivered} statusColor="#25D366">
                <p className="text-[11px] text-white/60 italic">
                  "Hi Alex! 👋 Your appointment at <strong className="text-white/80">{businessName}</strong> is confirmed for {today} at 15:30. Service: {serviceName}."
                </p>
              </FlowCard>
            )}

            {emailEnabled && (
              <FlowCard icon={<Mail className="w-4 h-4 text-[#00D4FF]" />} label={s.emailSent} status={s.status.deliveredEmail} statusColor="#00D4FF">
                <p className="text-[11px] text-white/60 italic">
                  "Booking Confirmed ✓ — {businessName} · {serviceName} · {today}"
                </p>
              </FlowCard>
            )}

            {reviewStep?.enabled && (
              <FlowCard icon={<Star className="w-4 h-4 text-[#FFB300]" />} label={s.reviewScheduled} status={\`+\${reviewStep.delayHours}h\`} statusColor="#FFB300">
                <p className="text-[11px] text-white/60 italic">
                  "Hi Alex! ⭐ How was your experience at {businessName}? Leave us a Google Review →"
                </p>
                <p className="text-[10px] text-white/30">Sends automatically {reviewStep.delayHours}h after your visit via {reviewStep.channel}</p>
              </FlowCard>
            )}

            <button onClick={() => setSent(false)} className="w-full py-2.5 text-sm text-white/50 hover:text-white transition-colors text-center">
              {s.submitAnother}
            </button>
          </div>
        ) : (
          <div className="p-8" style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: palette.radius }}>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <input ref={nameRef}  type="text" placeholder={s.yourName}    className="w-full px-4 py-3 bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors" style={{ borderRadius: '0.375rem' }} />
              <input ref={phoneRef} type="tel"  placeholder={s.phoneNumber} className="w-full px-4 py-3 bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors" style={{ borderRadius: '0.375rem' }} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <input ref={dateRef}  type="date" placeholder={s.preferredDate} className="w-full px-4 py-3 bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors" style={{ borderRadius: '0.375rem' }} />
              <select
                ref={serviceRef}
                className="w-full px-4 py-3 bg-white/15 border border-white/25 text-white text-sm focus:outline-none focus:border-white/60 transition-colors"
                style={{ borderRadius: palette.radius }}
                defaultValue=""
              >
                <option value="" disabled className="text-black">{s.selectService}</option>
                {content.services.map(sv => (
                  <option key={sv.name} value={sv.name} className="text-black">{sv.name}</option>
                ))}
              </select>
            </div>
            <textarea
              placeholder={t.placeholders.notes}
              rows={3}
              className="w-full px-4 py-3 bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors resize-none mb-4"
              style={{ borderRadius: palette.radius }}
            />
            <button
              onClick={handleConfirm}
              className="w-full py-4 font-bold text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ backgroundColor: 'white', color: palette.primary, borderRadius: palette.radius }}
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              {s.confirmBooking}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function FlowCard({ icon, label, status, statusColor, children }: {
  icon: React.ReactNode; label: string; status: string; statusColor: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8">
        {icon}
        <span className="text-xs font-semibold text-white/80 flex-1">{label}</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: statusColor + '22', color: statusColor }}>
          {status}
        </span>
      </div>
      <div className="px-4 py-3 space-y-1">{children}</div>
    </div>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────

export function FaqSection({ palette, content }: P) {
  const [open, setOpen] = useState<number | null>(null);
  const { t } = useTranslations();
  const s = t.sections.faq;
  return (
    <section id="faq" className="py-24" style={{ backgroundColor: palette.bgAlt, color: palette.fg, fontFamily: palette.font }}>
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} palette={palette} />
        <div className="space-y-3">
          {content.faq.map((item, i) => (
            <div
              key={i}
              className="overflow-hidden transition-all"
              style={{ backgroundColor: palette.cardBg, border: \`1px solid \${palette.cardBorder}\`, borderRadius: palette.radius }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-semibold text-sm pr-4">{item.q}</span>
                {open === i
                  ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: palette.primary }} />
                  : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: palette.fgMuted }} />
                }
              </button>
              {open === i && (
                <div
                  className="px-6 pb-5 text-sm leading-relaxed"
                  style={{ color: palette.fgMuted, borderTop: \`1px solid \${palette.cardBorder}\`, paddingTop: '1rem' }}
                >
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contacts Section ─────────────────────────────────────────────────────────

export function ContactsSection({ manifest, palette, content }: P) {
  const [sent, setSent] = useState(false);
  const { t } = useTranslations();
  const s = t.sections.contacts;
  const phone = getDisplayPhone(manifest);
  const whatsapp = getDisplayWhatsapp(manifest);
  const email = getDisplayEmail(manifest);

  const contacts = [
    phone    && { icon: Phone,         label: s.labels.phone,    value: phone,    href: \`tel:\${phone}\` },
    whatsapp && { icon: MessageCircle, label: s.labels.whatsapp, value: whatsapp, href: \`https://wa.me/\${whatsapp.replace(/\\D/g, '')}\` },
    email    && { icon: Mail,          label: s.labels.email,    value: email,    href: \`mailto:\${email}\` },
    { icon: MapPin, label: s.labels.address, value: manifest.business.city, href: \`https://maps.google.com?q=\${encodeURIComponent(manifest.business.city)}\` },
    { icon: Clock,  label: s.labels.hours,   value: \`\${content.openDays} · \${content.hours}\`, href: null },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href: string | null }[];

  return (
    <section id="contacts" className="py-24" style={{ backgroundColor: palette.bg, color: palette.fg, fontFamily: palette.font }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} palette={palette} />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            {contacts.map(c => (
              <ContactCard key={c.label} icon={c.icon} label={c.label} value={c.value} href={c.href} palette={palette} />
            ))}
          </div>

          {sent ? (
            <div
              className="flex flex-col items-center justify-center gap-4 p-8 text-center"
              style={{ backgroundColor: palette.cardBg, border: \`1px solid \${palette.cardBorder}\`, borderRadius: palette.radius }}
            >
              <Send className="w-10 h-10" style={{ color: palette.primary }} />
              <h3 className="font-bold text-lg">{s.successTitle}</h3>
              <p className="text-sm" style={{ color: palette.fgMuted }}>{s.successSub}</p>
              <button onClick={() => setSent(false)} className="text-xs underline" style={{ color: palette.fgMuted }}>{s.sendAnother}</button>
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); setSent(true); }}
              className="p-6 space-y-4"
              style={{ backgroundColor: palette.cardBg, border: \`1px solid \${palette.cardBorder}\`, borderRadius: palette.radius }}
            >
              <h3 className="font-bold text-lg mb-4">{s.form.title}</h3>
              {[
                { placeholder: s.form.namePlaceholder,    type: 'text' },
                { placeholder: s.form.emailPlaceholder,   type: 'email' },
                { placeholder: s.form.subjectPlaceholder, type: 'text' },
              ].map(f => (
                <input
                  key={f.placeholder}
                  type={f.type}
                  placeholder={f.placeholder}
                  required
                  className="w-full px-4 py-3 text-sm border focus:outline-none transition-colors"
                  style={{ backgroundColor: palette.bgAlt, borderColor: palette.cardBorder, borderRadius: palette.radius, color: palette.fg }}
                />
              ))}
              <textarea
                placeholder={s.form.messagePlaceholder}
                rows={4}
                required
                className="w-full px-4 py-3 text-sm border focus:outline-none transition-colors resize-none"
                style={{ backgroundColor: palette.bgAlt, borderColor: palette.cardBorder, borderRadius: palette.radius, color: palette.fg }}
              />
              <button
                type="submit"
                className="w-full py-3 font-bold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: palette.primary, color: palette.primaryFg, borderRadius: palette.radius }}
              >
                <Send className="w-4 h-4 inline mr-2" />
                {s.form.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Footer Section ───────────────────────────────────────────────────────────

export function FooterSection({ manifest, palette, content }: P) {
  const { t } = useTranslations();
  const s = t.sections.footer;
  const year = new Date().getFullYear();
  const businessName = getDisplayBusinessName(manifest);
  const phone = getDisplayPhone(manifest);
  const email = getDisplayEmail(manifest);
  const footerBg = palette.isDark ? palette.bg : '#111827';
  const footerFg = '#f9fafb';
  const footerMuted = 'rgba(249,250,251,0.45)';

  return (
    <footer id="footer" className="py-16" style={{ backgroundColor: footerBg, color: footerFg, fontFamily: palette.font }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-3">{businessName}</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: footerMuted }}>{content.tagline}</p>
            <p className="text-xs" style={{ color: footerMuted }}>{manifest.business.city}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: footerMuted }}>{s.services}</h4>
            <ul className="space-y-2">
              {content.services.map(sv => (
                <li key={sv.name}>
                  <a href="#services" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>{sv.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: footerMuted }}>{s.contact}</h4>
            <ul className="space-y-2 text-sm" style={{ color: footerMuted }}>
              {phone && <li><a href={\`tel:\${phone}\`} className="hover:text-white transition-colors">{phone}</a></li>}
              {email && <li><a href={\`mailto:\${email}\`} className="hover:text-white transition-colors">{email}</a></li>}
              <li>{content.openDays} · {content.hours}</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: footerMuted }}>
            © {year} {businessName}. {s.rights}
          </p>
          <p className="text-xs" style={{ color: footerMuted }}>
            {manifest.business.city} · {manifest.business.language.toUpperCase()}
          </p>
        </div>
      </div>
    </footer>
  );
}
`,pv=`import { Phone, MessageCircle, Calendar, MapPin, Mail } from 'lucide-react';
import type { Manifest } from '../../types/manifest';
import type { ImageSourceDefinition } from '../../lib/imageSources';
import type { ThemePalette } from './themeHelpers';
import type { SectorContent } from './sectorContent';
import { useTranslations } from '../../lib/i18n';
import {
  getDisplayBusinessName,
  getDisplayEmail,
  getDisplayPhone,
  getDisplayWhatsapp,
} from '../../lib/brandingDefaults';

interface P { manifest: Manifest; palette: ThemePalette; content: SectorContent; images: ImageSourceDefinition; }

// ─── Hero Section ─────────────────────────────────────────────────────────────

export function HeroSection({ manifest, palette, content }: P) {
  const { images } = arguments[0] as P;
  const { t } = useTranslations();
  const businessName = getDisplayBusinessName(manifest);
  const phone = getDisplayPhone(manifest);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={images.hero} alt={businessName} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{
          background: palette.isDark
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.8) 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.7) 100%)',
        }} />
      </div>
      <div className="relative max-w-5xl mx-auto px-6 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] mb-4 opacity-80" style={{ fontFamily: palette.font }}>
          {manifest.business.city}
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: palette.font }}>
          {businessName}
        </h1>
        <p className="text-xl sm:text-2xl opacity-85 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ fontFamily: palette.font }}>
          {content.tagline}
        </p>
        <p className="text-base opacity-65 max-w-xl mx-auto mb-10" style={{ fontFamily: palette.font }}>
          {content.subTagline}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#booking"
            className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white rounded-lg transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
            style={{ backgroundColor: palette.primary, borderRadius: palette.radius, fontFamily: palette.font }}
          >
            <Calendar className="w-5 h-5" />
            {content.cta}
          </a>
          {phone && (
            <a
              href={\`tel:\${phone}\`}
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold border-2 border-white/60 text-white rounded-lg transition-all hover:bg-white/15 hover:-translate-y-0.5"
              style={{ borderRadius: palette.radius, fontFamily: palette.font }}
            >
              <Phone className="w-5 h-5" />
              {t.websiteDemo.call}
            </a>
          )}
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-6 h-10 rounded-full border-2 border-white/60 flex items-start justify-center pt-2">
            <div className="w-1.5 h-2.5 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

export function AboutSection({ manifest, palette, content, images }: P) {
  const { t } = useTranslations();
  const s = t.sections.about;
  const phone = getDisplayPhone(manifest);
  const whatsapp = getDisplayWhatsapp(manifest);

  return (
    <section id="about" className="py-24" style={{ backgroundColor: palette.bgAlt, color: palette.fg, fontFamily: palette.font }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <img src={images.about} alt={s.label} className="w-full h-80 md:h-[480px] object-cover shadow-2xl" style={{ borderRadius: palette.radius }} />
            <div
              className="absolute -bottom-6 -right-6 hidden md:flex flex-col items-center justify-center w-28 h-28 shadow-xl"
              style={{ backgroundColor: palette.primary, borderRadius: palette.radius, color: palette.primaryFg }}
            >
              <span className="text-3xl font-bold">15+</span>
              <span className="text-xs text-center leading-tight opacity-90 mt-1">{s.yearsLabel}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: palette.primary }}>
              {s.label}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-6" style={{ fontFamily: palette.font }}>
              {content.aboutTitle}
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: palette.fgMuted }}>{content.aboutText}</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { n: '500+', l: s.stats.clients },
                { n: '15+',  l: s.stats.experience },
                { n: '100%', l: s.stats.satisfaction },
              ].map(stat => (
                <div key={stat.l} className="text-center">
                  <p className="text-2xl font-bold" style={{ color: palette.primary }}>{stat.n}</p>
                  <p className="text-xs mt-1" style={{ color: palette.fgMuted }}>{stat.l}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {phone && (
                <a
                  href={\`tel:\${phone}\`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-80"
                  style={{ backgroundColor: palette.primary, color: palette.primaryFg, borderRadius: palette.radius }}
                >
                  <Phone className="w-4 h-4" /> {phone}
                </a>
              )}
              {whatsapp && (
                <a
                  href={\`https://wa.me/\${whatsapp.replace(/\\D/g, '')}\`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border transition-all hover:opacity-80"
                  style={{ borderColor: palette.cardBorder, color: palette.fg, borderRadius: palette.radius }}
                >
                  <MessageCircle className="w-4 h-4 text-green-500" /> {s.whatsapp}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Google Maps placeholder Section ─────────────────────────────────────────

export function GoogleMapsSection({ manifest, palette }: P) {
  const { t } = useTranslations();
  const s = t.sections.maps;
  const businessName = getDisplayBusinessName(manifest);

  return (
    <section id="google_maps" className="py-20" style={{ backgroundColor: palette.bg, color: palette.fg, fontFamily: palette.font }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: palette.primary }}>{s.eyebrow}</p>
          <h2 className="text-3xl font-bold">{s.title} {manifest.business.city}</h2>
        </div>
        <div
          className="w-full h-64 md:h-80 flex flex-col items-center justify-center gap-4 border-2 border-dashed"
          style={{ backgroundColor: palette.bgAlt, borderColor: palette.cardBorder, borderRadius: palette.radius }}
        >
          <MapPin className="w-10 h-10" style={{ color: palette.primary }} />
          <div className="text-center">
            <p className="font-semibold">{businessName}</p>
            <p className="text-sm" style={{ color: palette.fgMuted }}>{manifest.business.city}</p>
          </div>
          <a
            href={\`https://maps.google.com?q=\${encodeURIComponent(businessName + ' ' + manifest.business.city)}\`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold transition-all hover:opacity-80"
            style={{ backgroundColor: palette.primary, color: palette.primaryFg, borderRadius: palette.radius }}
          >
            <MapPin className="w-4 h-4" /> {s.openMaps}
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── WhatsApp Section ─────────────────────────────────────────────────────────

export function WhatsAppSection({ manifest, palette }: P) {
  const { t } = useTranslations();
  const s = t.sections.whatsapp;
  const whatsapp = getDisplayWhatsapp(manifest);
  if (!whatsapp) return null;
  return (
    <section id="whatsapp" className="py-16" style={{ backgroundColor: palette.bgAlt, fontFamily: palette.font }}>
      <div className="max-w-xl mx-auto px-6 text-center">
        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-bold mb-3" style={{ color: palette.fg }}>{s.title}</h2>
        <p className="mb-6 text-sm" style={{ color: palette.fgMuted }}>{s.subtitle}</p>
        <a
          href={\`https://wa.me/\${whatsapp.replace(/\\D/g, '')}\`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 text-white font-bold rounded-lg bg-green-500 hover:bg-green-600 transition-colors"
          style={{ borderRadius: palette.radius }}
        >
          <MessageCircle className="w-5 h-5" /> {s.button}
        </a>
      </div>
    </section>
  );
}

// ─── Email Section ────────────────────────────────────────────────────────────

export function EmailSection({ manifest, palette }: P) {
  const { t } = useTranslations();
  const s = t.sections.email;
  const email = getDisplayEmail(manifest);

  return (
    <section id="email_section" className="py-16" style={{ backgroundColor: palette.bg, fontFamily: palette.font }}>
      <div className="max-w-xl mx-auto px-6 text-center">
        <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: palette.primary }} />
        <h2 className="text-2xl font-bold mb-3" style={{ color: palette.fg }}>{s.title}</h2>
        <p className="mb-6 text-sm" style={{ color: palette.fgMuted }}>{s.subtitle}</p>
        <a
          href={\`mailto:\${email}\`}
          className="inline-flex items-center gap-2 px-8 py-3 text-white font-bold transition-all hover:opacity-90"
          style={{ backgroundColor: palette.primary, borderRadius: palette.radius }}
        >
          <Mail className="w-5 h-5" /> {email}
        </a>
      </div>
    </section>
  );
}
`,mv=`import { useState } from 'react';
import {
  MapPin, Globe, Calendar, LayoutDashboard, MessageCircle,
  Mail, Star, Users, ChevronRight, CheckCircle2, Clock,
} from 'lucide-react';
import type { Manifest } from '../../types/manifest';
import type { ThemePalette } from './themeHelpers';
import type { SectorContent } from './sectorContent';
import { useTranslations } from '../../lib/i18n';

interface Props { manifest: Manifest; palette: ThemePalette; content: SectorContent; }

const PIPELINE_DEFS = [
  { id: 'maps',    icon: MapPin,          color: '#4285F4' },
  { id: 'website', icon: Globe,           color: '#6C3BFF' },
  { id: 'booking', icon: Calendar,        color: '#8B5CFF' },
  { id: 'crm',     icon: LayoutDashboard, color: '#00C853' },
  { id: 'wa',      icon: MessageCircle,   color: '#25D366' },
  { id: 'email',   icon: Mail,            color: '#00D4FF' },
  { id: 'review',  icon: Star,            color: '#FFB300' },
  { id: 'reviews', icon: Star,            color: '#4285F4' },
  { id: 'clients', icon: Users,           color: '#00C853' },
] as const;

type StepId = typeof PIPELINE_DEFS[number]['id'];

export function ReviewFlowSection({ manifest, content }: Props) {
  const [active, setActive] = useState<StepId>('crm');
  const { t } = useTranslations();
  const rf = t.reviewFlow;

  const biz = manifest.business;
  const hasWa        = !!biz.whatsapp;
  const waEnabled    = manifest.crm.reviewFlow.steps.some(s => s.channel === 'whatsapp' && s.enabled);
  const emailEnabled = manifest.crm.reviewFlow.steps.some(s => s.channel === 'email' && s.enabled);
  const reviewStep   = manifest.crm.reviewFlow.steps.find(s => s.stepKey === 'google_review_request');
  const serviceName  = content.services[0]?.name ?? 'Appointment';
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const ml = rf.mockLabels;
  const cf = ml.crmFields;

  const MOCKS: Record<StepId, React.ReactNode> = {
    maps: (
      <MockPanel title={rf.pipeline.maps.label} icon={<MapPin className="w-4 h-4 text-[#4285F4]" />} mockLabel={rf.mock}>
        <div className="rounded-xl overflow-hidden border border-white/10">
          <div className="h-28 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1a2332,#1e3a5f)' }}>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-[#4285F4] mx-auto mb-1" />
              <p className="text-xs text-white/60">{biz.city}</p>
            </div>
          </div>
          <div className="p-3 text-xs space-y-1.5">
            <p className="font-bold text-white">{biz.name}</p>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#FFB300] text-[#FFB300]" />)}
              <span className="text-white/50 ml-1">4.9 · 127 reviews</span>
            </div>
            {biz.phone && <p className="text-white/50">{biz.phone}</p>}
            <a href="#website" className="inline-block mt-1 px-3 py-1 bg-[#4285F4] text-white rounded text-[10px] font-semibold">
              {ml.visitWebsite}
            </a>
          </div>
        </div>
        <InfoRow>{rf.infoRows.maps.replace('{name}', biz.name)}</InfoRow>
      </MockPanel>
    ),
    website: (
      <MockPanel title={rf.pipeline.website.label} icon={<Globe className="w-4 h-4 text-[#6C3BFF]" />} mockLabel={rf.mock}>
        <BrowserFrame url={\`\${biz.name.toLowerCase().replace(/\\s+/g, '')}.com\`}>
          <div className="h-20 flex items-center justify-center text-center px-4" style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)' }}>
            <div>
              <p className="text-white font-bold text-xs">{biz.name}</p>
              <p className="text-white/50 text-[10px] mt-0.5">{content.tagline}</p>
            </div>
          </div>
          <div className="p-2 flex gap-1.5">
            <a href="#booking" className="flex-1 py-1.5 rounded text-[10px] font-bold text-center text-white" style={{ background: '#6C3BFF' }}>
              {ml.bookNow}
            </a>
            <a href="#services" className="flex-1 py-1.5 rounded text-[10px] font-semibold text-center border border-white/20 text-white/70">
              {ml.services}
            </a>
          </div>
        </BrowserFrame>
        <InfoRow>{rf.infoRows.website}</InfoRow>
      </MockPanel>
    ),
    booking: (
      <MockPanel title={rf.pipeline.booking.label} icon={<Calendar className="w-4 h-4 text-[#8B5CFF]" />} mockLabel={rf.mock}>
        <div className="rounded-xl overflow-hidden border border-white/10 text-xs">
          <div className="px-3 py-2 font-semibold text-white/80 border-b border-white/10 bg-white/5">
            {ml.bookingRequest}
          </div>
          <div className="p-3 space-y-2">
            {[
              [cf.service, serviceName],
              [cf.client, 'Alex Johnson'],
              [cf.phone, biz.phone || '+49 170 0000000'],
              [cf.date, today + ' · 15:30'],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <span className="text-white/40">{l}</span>
                <span className="text-white/80 font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="px-3 pb-3">
            <div className="w-full py-2 rounded-lg text-center text-[10px] font-bold text-white" style={{ background: '#8B5CFF' }}>
              {ml.bookingSubmitted}
            </div>
          </div>
        </div>
        <InfoRow>{rf.infoRows.booking}</InfoRow>
      </MockPanel>
    ),
    crm: (
      <MockPanel title={rf.mockLabels.crm} icon={<LayoutDashboard className="w-4 h-4 text-[#00C853]" />} mockLabel={rf.mock}>
        <div className="rounded-xl overflow-hidden border border-white/10 text-xs">
          <div className="px-3 py-2 flex items-center justify-between bg-white/5 border-b border-white/10">
            <span className="font-semibold text-white/80">{ml.customerRecord}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">{ml.confirmed}</span>
          </div>
          <div className="p-3 space-y-2">
            {[
              [cf.name, 'Alex Johnson'],
              [cf.service, serviceName],
              [cf.date, today + ' · 15:30'],
              [cf.source, ml.source],
              [cf.channel, manifest.crm.notificationChannels.join(', ')],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <span className="text-white/40">{l}</span>
                <span className="text-white/80 font-medium truncate ml-2 max-w-[60%] text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <InfoRow>{rf.infoRows.crm}</InfoRow>
      </MockPanel>
    ),
    wa: (
      <MockPanel title={ml.waConfirm} icon={<MessageCircle className="w-4 h-4 text-[#25D366]" />} mockLabel={rf.mock}>
        {(hasWa || waEnabled) ? (
          <div className="rounded-xl overflow-hidden border border-white/10 bg-[#075e54]">
            <div className="px-3 py-2 bg-[#128c7e] flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-white">{biz.name}</span>
            </div>
            <div className="p-3">
              <div className="bg-white/10 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-white/90 leading-relaxed">
                Hi Alex! 👋 Your appointment at <strong>{biz.name}</strong> is confirmed for <strong>{today} at 15:30</strong>.
                <br /><br />
                Service: <strong>{serviceName}</strong>
                <br />
                Need to reschedule? Just reply here.
                <div className="text-right text-[10px] text-white/40 mt-1.5">{today} · ✓✓</div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyMock icon={<MessageCircle className="w-6 h-6 text-white/20" />} label={ml.waNotConfigured} />
        )}
        <InfoRow>{waEnabled ? rf.infoRows.waEnabled : rf.infoRows.waDisabled}</InfoRow>
      </MockPanel>
    ),
    email: (
      <MockPanel title={ml.emailConfirm} icon={<Mail className="w-4 h-4 text-[#00D4FF]" />} mockLabel={rf.mock}>
        {emailEnabled ? (
          <div className="rounded-xl overflow-hidden border border-white/10 text-xs">
            <div className="px-3 py-2 bg-white/5 border-b border-white/10 space-y-0.5">
              <p className="text-white/40">From: <span className="text-white/70">{biz.email}</span></p>
              <p className="text-white/40">To: <span className="text-white/70">alex.johnson@example.com</span></p>
              <p className="text-white/40">Subject: <span className="text-white/80 font-semibold">✓ Booking Confirmed — {biz.name}</span></p>
            </div>
            <div className="p-3 text-white/80 leading-relaxed space-y-2">
              <p>{ml.dear}</p>
              <p>{ml.apptConfirmed}</p>
              <div className="rounded-lg p-2 bg-white/5 border border-white/10 space-y-1">
                <p><span className="text-white/40">{cf.service}:</span> {serviceName}</p>
                <p><span className="text-white/40">{cf.date}:</span> {today} · 15:30</p>
                <p><span className="text-white/40">{cf.location}:</span> {biz.city}</p>
              </div>
              <p className="text-white/50">Questions? Contact us: {biz.phone || biz.email}</p>
            </div>
          </div>
        ) : (
          <EmptyMock icon={<Mail className="w-6 h-6 text-white/20" />} label={ml.emailNotEnabled} />
        )}
        <InfoRow>{emailEnabled ? rf.infoRows.emailEnabled : rf.infoRows.emailDisabled}</InfoRow>
      </MockPanel>
    ),
    review: (
      <MockPanel title={ml.review} icon={<Star className="w-4 h-4 text-[#FFB300]" />} mockLabel={rf.mock}>
        {reviewStep?.enabled ? (
          <div className="rounded-xl overflow-hidden border border-white/10 bg-[#075e54]">
            <div className="px-3 py-2 bg-[#128c7e] flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-white">{biz.name}</span>
              <span className="ml-auto text-[10px] text-white/50 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                +{reviewStep.delayHours}h {ml.afterVisit}
              </span>
            </div>
            <div className="p-3">
              <div className="bg-white/10 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-white/90 leading-relaxed">
                Hi Alex! ⭐ How was your experience at <strong>{biz.name}</strong>?
                <br /><br />
                We'd love to hear your feedback. It only takes 30 seconds and helps us a lot.
                <br />
                <a href="#" className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-[#FFB300] text-black font-bold text-[10px]">
                  {ml.leaveReview}
                </a>
                <div className="text-right text-[10px] text-white/40 mt-1.5">{ml.scheduled}</div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyMock icon={<Star className="w-6 h-6 text-white/20" />} label={ml.reviewNotEnabled} />
        )}
        <InfoRow>
          {reviewStep?.enabled
            ? rf.infoRows.reviewEnabled.replace('{hours}', String(reviewStep.delayHours)).replace('{channel}', reviewStep.channel)
            : rf.infoRows.reviewDisabled}
        </InfoRow>
      </MockPanel>
    ),
    reviews: (
      <MockPanel title={ml.reviews} icon={<Star className="w-4 h-4 text-[#4285F4]" />} mockLabel={rf.mock}>
        <div className="rounded-xl border border-white/10 p-3 space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#FFB300] text-[#FFB300]" />)}
            </div>
            <span className="font-bold text-white">4.9</span>
            <span className="text-white/40">· 127 reviews</span>
          </div>
          {[
            { name: 'Alex J.',  text: 'Excellent service! Booked online, came on time. Highly recommend.', stars: 5 },
            { name: 'Maria K.', text: 'Very professional team. Will definitely come back again.', stars: 5 },
          ].map(r => (
            <div key={r.name} className="border-t border-white/10 pt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white/80">{r.name}</span>
                <div className="flex gap-0.5">
                  {Array.from({length: r.stars}).map((_,i) => <Star key={i} className="w-3 h-3 fill-[#FFB300] text-[#FFB300]" />)}
                </div>
              </div>
              <p className="text-white/50 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
        <InfoRow>{rf.infoRows.reviews}</InfoRow>
      </MockPanel>
    ),
    clients: (
      <MockPanel title={ml.clients} icon={<Users className="w-4 h-4 text-[#00C853]" />} mockLabel={rf.mock}>
        <div className="rounded-xl border border-white/10 p-4 space-y-3 text-xs">
          {[
            { label: ml.stats.newBookings, value: '+34%', color: '#00C853' },
            { label: ml.stats.fromMaps,    value: '47%',  color: '#4285F4' },
            { label: ml.stats.repeatClients, value: '68%', color: '#8B5CFF' },
            { label: ml.stats.rating,      value: '4.9 ★', color: '#FFB300' },
          ].map(stat => (
            <div key={stat.label} className="flex justify-between items-center">
              <span className="text-white/50">{stat.label}</span>
              <span className="font-bold" style={{ color: stat.color }}>{stat.value}</span>
            </div>
          ))}
        </div>
        <InfoRow>{rf.infoRows.clients}</InfoRow>
      </MockPanel>
    ),
  };

  return (
    <section className="py-16 border-b border-white/5" style={{ background: 'linear-gradient(160deg, #0d1117 0%, #1a0f3e 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF]">{rf.brand}</span>
            <span className="text-white/15">·</span>
            <span className="text-xs text-white/40">{rf.journey}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{rf.title}</h2>
          <p className="text-white/45 text-sm max-w-xl">{rf.subtitle}</p>
        </div>

        <div className="overflow-x-auto pb-4 mb-8">
          <div className="flex items-center gap-0 min-w-max">
            {PIPELINE_DEFS.map((step, i) => {
              const pipeLabel = rf.pipeline[step.id as keyof typeof rf.pipeline];
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setActive(step.id)}
                    className={\`group flex flex-col items-center gap-2 px-3 py-3 rounded-xl transition-all border \${
                      active === step.id
                        ? 'border-white/20 bg-white/10'
                        : 'border-transparent hover:bg-white/5 hover:border-white/10'
                    }\`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: active === step.id ? step.color + '30' : 'rgba(255,255,255,0.06)',
                        border: \`1px solid \${active === step.id ? step.color + '60' : 'transparent'}\`,
                      }}
                    >
                      <step.icon
                        className="w-5 h-5 transition-colors"
                        style={{ color: active === step.id ? step.color : 'rgba(255,255,255,0.35)' }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold whitespace-nowrap" style={{ color: active === step.id ? 'white' : 'rgba(255,255,255,0.45)' }}>
                        {pipeLabel.label}
                      </p>
                      <p className="text-[9px] whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {pipeLabel.sub}
                      </p>
                    </div>
                  </button>
                  {i < PIPELINE_DEFS.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 mx-0.5 shrink-0" style={{ color: 'rgba(255,255,255,0.15)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="animate-fade-in">{MOCKS[active]}</div>

        <div className="flex items-center justify-center gap-1.5 mt-6">
          {PIPELINE_DEFS.map(step => (
            <button
              key={step.id}
              onClick={() => setActive(step.id)}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{ backgroundColor: active === step.id ? step.color : 'rgba(255,255,255,0.15)' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Local helpers ────────────────────────────────────────────────────────────

function MockPanel({ title, icon, mockLabel, children }: { title: string; icon: React.ReactNode; mockLabel: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
        <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
        <span className="text-xs font-semibold text-white/70">{title}</span>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-green-400 font-semibold">
          <CheckCircle2 className="w-3 h-3" /> {mockLabel}
        </div>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 text-xs">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-white/8 border-b border-white/10">
        <div className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <span className="flex-1 text-center text-[9px] text-white/30 truncate">{url}</span>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-white/40 leading-relaxed">{children}</p>;
}

function EmptyMock({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 py-8 flex flex-col items-center gap-2 text-center">
      {icon}
      <p className="text-[11px] text-white/30 max-w-xs">{label}</p>
    </div>
  );
}
`,fv=`import { Star } from 'lucide-react';
import type { Manifest } from '../../types/manifest';
import type { ImageSourceDefinition } from '../../lib/imageSources';
import type { ThemePalette } from './themeHelpers';
import type { SectorContent } from './sectorContent';
import { useTranslations } from '../../lib/i18n';
import { ServiceCard } from '../../components/ui/ServiceCard';
import { SectionHeader } from '../../components/ui/SectionHeader';

interface P { manifest: Manifest; palette: ThemePalette; content: SectorContent; images: ImageSourceDefinition; }

// ─── Services Section ─────────────────────────────────────────────────────────

export function ServicesSection({ palette, content, images }: P) {
  const { t } = useTranslations();
  const s = t.sections.services;
  return (
    <section id="services" className="py-24" style={{ backgroundColor: palette.bg, color: palette.fg, fontFamily: palette.font }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} palette={palette} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.services.map((service, i) => (
            <ServiceCard
              key={service.name}
              service={service}
              imageUrl={images.services[i]}
              palette={palette}
              bookLabel={s.bookNow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────

export function GallerySection({ palette, images }: P) {
  const { t } = useTranslations();
  const s = t.sections.gallery;
  const allImages = [...images.gallery];
  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: palette.bgAlt, color: palette.fg, fontFamily: palette.font }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} palette={palette} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {allImages.map((url, i) => (
            <div key={i} className={\`overflow-hidden group \${i === 0 ? 'row-span-2 col-span-2' : ''}\`} style={{ borderRadius: palette.radius }}>
              <img
                src={url}
                alt={\`Gallery \${i + 1}\`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ minHeight: i === 0 ? '300px' : '160px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ─────────────────────────────────────────────────────

export function TestimonialsSection({ palette, content }: P) {
  const { t } = useTranslations();
  const s = t.sections.testimonials;
  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: palette.bg, color: palette.fg, fontFamily: palette.font }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} palette={palette}>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" style={{ color: '#FFB300' }} />)}
            <span className="ml-2 text-sm font-semibold" style={{ color: palette.fgMuted }}>5.0 · {s.rating}</span>
          </div>
        </SectionHeader>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.testimonials.map((item) => (
            <div
              key={item.name}
              className="p-6 relative"
              style={{
                backgroundColor: palette.cardBg,
                border: \`1px solid \${palette.cardBorder}\`,
                borderRadius: palette.radius,
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              }}
            >
              <div className="text-5xl font-serif leading-none mb-3 opacity-25" style={{ color: palette.primary }}>"</div>
              <p className="text-sm leading-relaxed mb-6 italic" style={{ color: palette.fgMuted }}>{item.text}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs" style={{ color: palette.fgMuted }}>{item.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: '#FFB300' }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,hv=`import type { SectorKey } from '../../types/manifest';

export interface ServiceItem { name: string; desc: string; price: string; }
export interface Testimonial  { name: string; role: string; text: string; rating: number; }
export interface FaqItem       { q: string; a: string; }

export interface SectorContent {
  tagline:    string;
  subTagline: string;
  cta:        string;
  aboutTitle: string;
  aboutText:  string;
  services:   ServiceItem[];
  testimonials: Testimonial[];
  faq:        FaqItem[];
  hours:      string;
  openDays:   string;
}

const CONTENT: Partial<Record<string, SectorContent>> = {
  restaurant: {
    tagline: 'Fine Dining & Exceptional Cuisine',
    subTagline: 'Where every meal becomes a memory. Fresh ingredients, passionate chefs, unforgettable flavours.',
    cta: 'Reserve a Table',
    aboutTitle: 'A Passion for Food Since Day One',
    aboutText: 'We believe great food brings people together. Our chefs source only the finest local and seasonal ingredients to craft dishes that celebrate flavour, tradition, and creativity. Whether it\\'s a quiet dinner for two or a lively celebration, we\\'re here to make it perfect.',
    services: [
      { name: 'Breakfast & Brunch', desc: 'Start your day with our freshly prepared morning menu', price: 'from €12' },
      { name: 'Lunch Menu', desc: 'Three-course set menu with seasonal specials and daily soups', price: 'from €18' },
      { name: 'Dinner & À la Carte', desc: 'Signature dishes, fine wines, and an unforgettable atmosphere', price: 'from €28' },
    ],
    testimonials: [
      { name: 'Sophie M.', role: 'Food Blogger', text: 'Absolutely stunning food and impeccable service. Every dish was a work of art.', rating: 5 },
      { name: 'Carlos R.', role: 'Regular Guest', text: 'My favourite restaurant in the city. The pasta is simply extraordinary.', rating: 5 },
      { name: 'Anna K.', role: 'Event Planner', text: 'Hosted our company dinner here. Everything was perfectly arranged.', rating: 5 },
    ],
    faq: [
      { q: 'Do you accept reservations?', a: 'Yes, we strongly recommend booking in advance, especially on weekends.' },
      { q: 'Do you cater for dietary requirements?', a: 'Absolutely. We offer vegetarian, vegan and gluten-free options on every menu.' },
      { q: 'Is there parking available?', a: 'We have a partnered car park 2 minutes from the restaurant with free validation.' },
      { q: 'Can you host private events?', a: 'Yes, our private dining room seats up to 40 guests. Contact us for packages.' },
    ],
    hours: '08:00 – 23:00', openDays: 'Mon – Sun',
  },

  dental_clinic: {
    tagline: 'Your Smile, Our Priority',
    subTagline: 'Advanced dental care in a calm and comfortable environment. Trusted by thousands of patients.',
    cta: 'Book an Appointment',
    aboutTitle: 'Gentle Care. Lasting Results.',
    aboutText: 'Our clinic combines the latest dental technology with a compassionate, patient-first approach. From routine check-ups to complete smile makeovers, our experienced team is dedicated to making every visit comfortable and every result exceptional.',
    services: [
      { name: 'Teeth Whitening', desc: 'Professional whitening treatments for a brighter, confident smile', price: 'from €149' },
      { name: 'Dental Implants', desc: 'Permanent, natural-looking solutions to replace missing teeth', price: 'from €890' },
      { name: 'Orthodontics', desc: 'Invisible aligners and traditional braces for all ages', price: 'from €1,200' },
    ],
    testimonials: [
      { name: 'Maria J.', role: 'Patient', text: 'I was terrified of the dentist, but this team made me feel completely at ease.', rating: 5 },
      { name: 'Thomas B.', role: 'Patient', text: 'The whitening treatment gave me my confidence back. Amazing results.', rating: 5 },
      { name: 'Elena S.', role: 'Patient', text: 'My implant looks and feels completely natural. Best decision I ever made.', rating: 5 },
    ],
    faq: [
      { q: 'Does treatment hurt?', a: 'We use gentle anaesthetics and the latest techniques to ensure a pain-free experience.' },
      { q: 'Do you treat children?', a: 'Yes, we welcome patients of all ages and have child-friendly treatment rooms.' },
      { q: 'Do you accept insurance?', a: 'We work with most major dental insurance providers. Contact us to confirm coverage.' },
      { q: 'How often should I visit?', a: 'We recommend a check-up and hygiene appointment every six months.' },
    ],
    hours: '09:00 – 18:00', openDays: 'Mon – Sat',
  },

  beauty_salon: {
    tagline: 'Beauty Redefined, Confidence Restored',
    subTagline: 'Premium beauty treatments tailored to you. Step in, unwind, and step out radiant.',
    cta: 'Book a Treatment',
    aboutTitle: 'Where Beauty Meets Expertise',
    aboutText: 'Our salon is a sanctuary of style and self-care. With a team of highly trained specialists and only the finest professional products, we craft beauty experiences that leave you looking and feeling your absolute best.',
    services: [
      { name: 'Hair Colouring & Styling', desc: 'Balayage, highlights, colour corrections, and precision cuts', price: 'from €65' },
      { name: 'Facials & Skincare', desc: 'Customised facial treatments for every skin type and concern', price: 'from €55' },
      { name: 'Lashes & Brows', desc: 'Extensions, lifts, tints, and perfectly shaped brows', price: 'from €40' },
    ],
    testimonials: [
      { name: 'Lisa W.', role: 'Regular Client', text: 'Best balayage I\\'ve ever had. The results were exactly what I wanted.', rating: 5 },
      { name: 'Priya N.', role: 'Client', text: 'The facial was deeply relaxing and my skin glowed for weeks afterwards.', rating: 5 },
      { name: 'Zara A.', role: 'Client', text: 'My lash extensions look so natural. I get compliments everywhere I go.', rating: 5 },
    ],
    faq: [
      { q: 'Should I book in advance?', a: 'Yes, especially for colour services. We recommend booking at least 48 hours ahead.' },
      { q: 'What brands do you use?', a: 'We exclusively use premium professional brands including Oribe and Dermalogica.' },
      { q: 'Do you offer gift vouchers?', a: 'Yes! Gift vouchers are available in any amount and make the perfect present.' },
      { q: 'What\\'s your cancellation policy?', a: 'We ask for 24 hours notice for cancellations to avoid a 50% fee.' },
    ],
    hours: '10:00 – 20:00', openDays: 'Tue – Sun',
  },

  fitness: {
    tagline: 'Train Hard. Live Strong.',
    subTagline: 'State-of-the-art facilities, expert coaching, and a community that pushes you further.',
    cta: 'Start Your Journey',
    aboutTitle: 'Built for Every Body',
    aboutText: 'Our gym is more than just equipment — it\\'s a movement. We combine cutting-edge fitness technology with expert personal trainers and group classes designed to challenge, motivate, and transform. No matter your level, there\\'s a place for you here.',
    services: [
      { name: 'Personal Training', desc: 'One-to-one coaching tailored to your goals and fitness level', price: 'from €60 / session' },
      { name: 'Group Classes', desc: 'HIIT, yoga, spin, pilates, and more — 50+ classes weekly', price: 'from €15 / class' },
      { name: 'Nutrition Coaching', desc: 'Personalised meal plans and ongoing nutritional guidance', price: 'from €80 / month' },
    ],
    testimonials: [
      { name: 'Jake T.', role: 'Member since 2022', text: 'Lost 20kg in 6 months. The personal trainers here are genuinely incredible.', rating: 5 },
      { name: 'Olivia P.', role: 'Member', text: 'The group classes are so much fun. I actually look forward to working out now.', rating: 5 },
      { name: 'Marcus H.', role: 'Member', text: 'Top-tier equipment, clean facilities, and a brilliant community.', rating: 5 },
    ],
    faq: [
      { q: 'Is there a joining fee?', a: 'No joining fee when you sign up online. Just your first month\\'s membership.' },
      { q: 'Do you offer free trials?', a: 'Yes! Visit us for a free 3-day trial to experience everything we offer.' },
      { q: 'Are classes included in membership?', a: 'All group classes are included in Standard and Premium memberships.' },
      { q: 'Do you have locker rooms?', a: 'Yes, we have fully equipped changing rooms with secure lockers and showers.' },
    ],
    hours: '06:00 – 22:00', openDays: 'Mon – Sun',
  },

  barber: {
    tagline: 'Sharp Cuts. Classic Style.',
    subTagline: 'Traditional barbering meets modern technique. Walk in a guy, walk out a gentleman.',
    cta: 'Book Your Cut',
    aboutTitle: 'The Art of the Cut',
    aboutText: 'We\\'re not just a barber shop — we\\'re a craft. Every cut, every shave, every trim is executed with precision and pride. Our barbers are masters of their trade, bringing a blend of timeless technique and contemporary style to every chair.',
    services: [
      { name: 'Haircut & Style', desc: 'Scissor or clipper cut with finish, including wash and dry', price: 'from €25' },
      { name: 'Hot Towel Shave', desc: 'Classic straight razor shave with hot towels and premium products', price: 'from €30' },
      { name: 'Beard Trim & Shape', desc: 'Expert shaping, lining, and conditioning for any beard style', price: 'from €18' },
    ],
    testimonials: [
      { name: 'Ryan M.', role: 'Regular', text: 'Best fade in the city, no question. These guys know exactly what they\\'re doing.', rating: 5 },
      { name: 'Dave S.', role: 'Customer', text: 'The hot towel shave is an experience every man should try. Pure luxury.', rating: 5 },
      { name: 'Luca B.', role: 'Regular', text: 'Consistent, fast, and always exactly how I want it. My only barbershop.', rating: 5 },
    ],
    faq: [
      { q: 'Do I need to book?', a: 'Walk-ins are welcome but booking guarantees your slot and avoids the wait.' },
      { q: 'How long does a cut take?', a: 'Most cuts take 25–40 minutes. Shaves and combos take 45–60 minutes.' },
      { q: 'What age do you start cutting from?', a: 'We cut hair from age 3 upwards. Kids\\' cuts are available with adult pricing.' },
      { q: 'Do you sell products?', a: 'Yes, we stock a curated range of premium grooming products at the counter.' },
    ],
    hours: '09:00 – 19:00', openDays: 'Tue – Sun',
  },

  massage: {
    tagline: 'Relax. Restore. Revive.',
    subTagline: 'Expert therapeutic massage for body and mind. Your stress ends here.',
    cta: 'Book a Session',
    aboutTitle: 'Healing Touch, Expert Hands',
    aboutText: 'We believe that true wellness begins with care. Our therapists are fully certified specialists who combine therapeutic expertise with genuine compassion. Each session is customised to your specific needs — tension, injury, stress or simply relaxation.',
    services: [
      { name: 'Swedish Massage', desc: 'Classic full-body relaxation with flowing strokes and gentle pressure', price: 'from €65 / 60 min' },
      { name: 'Deep Tissue Massage', desc: 'Targets deep muscle layers for chronic tension and pain relief', price: 'from €75 / 60 min' },
      { name: 'Hot Stone Therapy', desc: 'Warm basalt stones combined with therapeutic massage techniques', price: 'from €90 / 75 min' },
    ],
    testimonials: [
      { name: 'Claire B.', role: 'Client', text: 'My chronic back pain has improved enormously since I started coming here.', rating: 5 },
      { name: 'Stefan V.', role: 'Client', text: 'The hot stone treatment was the most relaxing 90 minutes of my life.', rating: 5 },
      { name: 'Yuki T.', role: 'Regular Client', text: 'Professional, intuitive, and genuinely therapeutic. I leave feeling reborn.', rating: 5 },
    ],
    faq: [
      { q: 'What should I wear?', a: 'You will be professionally draped throughout. Just arrive and relax.' },
      { q: 'Should I eat before a massage?', a: 'Light eating is fine but avoid heavy meals for 2 hours before your session.' },
      { q: 'Can you treat injuries?', a: 'Yes, our therapists specialise in sports injuries and rehabilitation massage.' },
      { q: 'How often should I come?', a: 'For maintenance we recommend every 2–4 weeks; for pain relief, weekly initially.' },
    ],
    hours: '10:00 – 20:00', openDays: 'Mon – Sat',
  },

  cleaning: {
    tagline: 'Spotless Results, Every Time',
    subTagline: 'Professional cleaning services for homes, offices, and commercial spaces. Fully insured, always reliable.',
    cta: 'Get a Free Quote',
    aboutTitle: 'We Take Cleaning Seriously',
    aboutText: 'Our team of trained professionals brings precision, efficiency, and care to every clean. Using eco-friendly, hospital-grade products, we ensure your space is not just clean — it\\'s pristine. Fully insured, background-checked, and trusted by hundreds of clients.',
    services: [
      { name: 'Home Cleaning', desc: 'Regular or one-off deep cleans for houses and apartments', price: 'from €80' },
      { name: 'Office Cleaning', desc: 'Daily, weekly, or monthly commercial cleaning contracts', price: 'from €120' },
      { name: 'End of Tenancy Clean', desc: 'Comprehensive cleaning to pass rental inspections and secure deposits', price: 'from €200' },
    ],
    testimonials: [
      { name: 'Patricia L.', role: 'Homeowner', text: 'My flat has never looked so clean. They even cleaned places I forgot existed!', rating: 5 },
      { name: 'James O.', role: 'Office Manager', text: 'We switched to this company 6 months ago and the difference is remarkable.', rating: 5 },
      { name: 'Fiona M.', role: 'Landlord', text: 'The end-of-tenancy clean was flawless. Full deposit returned, no questions.', rating: 5 },
    ],
    faq: [
      { q: 'Do you bring your own products?', a: 'Yes, we bring all equipment and eco-friendly cleaning products included in the price.' },
      { q: 'Are you insured?', a: 'Fully insured for public liability and key holder insurance.' },
      { q: 'Do I need to be present?', a: 'Not at all. Many of our clients provide a key or code for access.' },
      { q: 'How do I book a recurring clean?', a: 'Simply book online or call us to set up weekly, bi-weekly, or monthly visits.' },
    ],
    hours: '08:00 – 18:00', openDays: 'Mon – Sat',
  },

  auto_service: {
    tagline: 'Expert Care for Your Vehicle',
    subTagline: 'Fast, reliable, and transparent auto service. Your car is in safe hands.',
    cta: 'Book a Service',
    aboutTitle: 'Honest Mechanics, Expert Results',
    aboutText: 'With over 15 years of experience, our certified technicians deliver quality you can trust. We use original-grade parts, provide transparent pricing with no hidden costs, and keep you updated at every step. Your vehicle\\'s performance and your peace of mind are our priorities.',
    services: [
      { name: 'Full Service & MOT', desc: 'Comprehensive inspection and servicing with digital checklist report', price: 'from €120' },
      { name: 'Tyres & Wheels', desc: 'Tyre fitting, balancing, alignment, and seasonal swaps', price: 'from €40 / tyre' },
      { name: 'Diagnostics & Repair', desc: 'Computer diagnostics, fault codes, and all mechanical repairs', price: 'from €80' },
    ],
    testimonials: [
      { name: 'Georg W.', role: 'Customer', text: 'Finally an honest garage. Clear pricing, no surprises, and done on time.', rating: 5 },
      { name: 'Sabine K.', role: 'Regular Customer', text: 'They fixed an issue three other garages couldn\\'t solve. Absolutely brilliant.', rating: 5 },
      { name: 'Andrei P.', role: 'Fleet Manager', text: 'We service our entire company fleet here. Consistent and professional.', rating: 5 },
    ],
    faq: [
      { q: 'Do you provide courtesy cars?', a: 'Yes, subject to availability. Please request when booking.' },
      { q: 'How long does a full service take?', a: 'A full service typically takes 2–3 hours. We can do while-you-wait appointments.' },
      { q: 'Do you work on all car brands?', a: 'Yes, we service all makes and models, including electric vehicles.' },
      { q: 'Do you offer a warranty on repairs?', a: 'All our repairs come with a 12-month, 12,000km parts and labour warranty.' },
    ],
    hours: '08:00 – 18:00', openDays: 'Mon – Fri, Sat 08:00 – 14:00',
  },

  hotel: {
    tagline: 'Your Home Away from Home',
    subTagline: 'Exceptional comfort, seamless service, and memories that last a lifetime.',
    cta: 'Check Availability',
    aboutTitle: 'Where Comfort Meets Excellence',
    aboutText: 'Nestled in the heart of the city, our hotel offers a perfect blend of contemporary luxury and warm hospitality. Each room is thoughtfully designed for comfort, our restaurant serves outstanding cuisine, and our concierge is ready to make your stay truly unforgettable.',
    services: [
      { name: 'Standard Rooms', desc: 'Stylishly furnished rooms with king-size beds and city views', price: 'from €89 / night' },
      { name: 'Suite & Premium Rooms', desc: 'Spacious suites with separate lounge, minibar, and butler service', price: 'from €199 / night' },
      { name: 'Conference & Events', desc: 'Fully equipped meeting rooms for up to 200 delegates', price: 'from €350 / half day' },
    ],
    testimonials: [
      { name: 'Helen V.', role: 'Business Traveller', text: 'Perfect location, comfortable room, and the breakfast was outstanding.', rating: 5 },
      { name: 'Marco F.', role: 'Guest', text: 'The suite was simply magnificent. The staff went above and beyond.', rating: 5 },
      { name: 'Nadia R.', role: 'Guest', text: 'We hold all our corporate events here. Always flawless execution.', rating: 5 },
    ],
    faq: [
      { q: 'What time is check-in and check-out?', a: 'Check-in from 15:00, check-out by 11:00. Early/late options available.' },
      { q: 'Is breakfast included?', a: 'Breakfast is optional and can be added to any room booking.' },
      { q: 'Is parking available?', a: 'Yes, we have an underground car park. Rates from €15 per night.' },
      { q: 'Is the hotel pet-friendly?', a: 'Yes, we welcome well-behaved pets. A small daily fee applies.' },
    ],
    hours: '24 / 7', openDays: 'Every day',
  },

  education: {
    tagline: 'Unlock Your Potential',
    subTagline: 'Expert-led courses and personalised learning for a brighter future.',
    cta: 'Enrol Now',
    aboutTitle: 'Learning That Changes Lives',
    aboutText: 'We believe education is the foundation of everything. Our experienced instructors design courses that combine rigorous academic standards with practical, real-world application. Small class sizes, individual support, and a genuine passion for teaching set us apart.',
    services: [
      { name: 'Language Courses', desc: 'English, German, French and Spanish for all levels — online and in-person', price: 'from €120 / month' },
      { name: 'Professional Certification', desc: 'Industry-recognised qualifications in business, IT, and management', price: 'from €450 / course' },
      { name: 'Private Tutoring', desc: 'One-to-one sessions tailored to school, university, or professional needs', price: 'from €45 / hour' },
    ],
    testimonials: [
      { name: 'Nina L.', role: 'Student', text: 'Passed my C1 exam first time thanks to this programme. Couldn\\'t be happier.', rating: 5 },
      { name: 'Peter G.', role: 'Professional', text: 'The business management course transformed how I lead my team.', rating: 5 },
      { name: 'Amara D.', role: 'Parent', text: 'My son\\'s grades improved dramatically within 2 months of tutoring here.', rating: 5 },
    ],
    faq: [
      { q: 'Do you offer online classes?', a: 'Yes, all our courses are available both in-person and via live video.' },
      { q: 'What is the class size?', a: 'Group classes are limited to 8 students for maximum learning.' },
      { q: 'Can I join mid-course?', a: 'Beginners must start from the beginning; intermediate learners can join at any point.' },
      { q: 'Is there a placement test?', a: 'Yes, a free online assessment helps us place you in the right level.' },
    ],
    hours: '09:00 – 20:00', openDays: 'Mon – Sat',
  },

  real_estate: {
    tagline: 'Find Your Perfect Property',
    subTagline: 'Expert property guidance for buyers, sellers, and investors. Trust the local specialists.',
    cta: 'Book a Consultation',
    aboutTitle: 'Your Property Goals, Our Mission',
    aboutText: 'With deep local market knowledge and a client-first ethos, we guide you through every stage of your property journey. From first-time buyers to seasoned investors, our advisors provide honest, informed guidance that helps you make confident decisions.',
    services: [
      { name: 'Residential Sales', desc: 'Professional valuation, marketing, and sales support for homeowners', price: 'Contact us' },
      { name: 'Property Management', desc: 'Full lettings management from tenant search to maintenance', price: 'from 8% / month' },
      { name: 'Investment Advice', desc: 'Market analysis, yield forecasting, and portfolio strategy', price: 'from €250 / consultation' },
    ],
    testimonials: [
      { name: 'Sarah P.', role: 'First-Time Buyer', text: 'They made the entire process easy to understand. Found us our dream home.', rating: 5 },
      { name: 'Robert M.', role: 'Investor', text: 'Excellent market insight and very responsive. My properties are always let.', rating: 5 },
      { name: 'Julia S.', role: 'Seller', text: 'Sold our house in 3 weeks above asking price. Remarkable team.', rating: 5 },
    ],
    faq: [
      { q: 'How do you value a property?', a: 'We use recent comparable sales, local market data, and in-person assessment.' },
      { q: 'How long does it take to sell?', a: 'Average time to sale is 4–8 weeks in our area, depending on pricing and market.' },
      { q: 'Do you manage commercial properties?', a: 'Yes, we have a dedicated commercial property division.' },
      { q: 'What are your fees?', a: 'Transparent fee structures with no hidden costs. We\\'ll explain everything upfront.' },
    ],
    hours: '09:00 – 18:00', openDays: 'Mon – Fri, Sat 10:00 – 14:00',
  },

  construction: {
    tagline: 'Built to Last. Built Right.',
    subTagline: 'From foundations to finish. Quality construction and renovation with zero compromise.',
    cta: 'Request a Quote',
    aboutTitle: 'Craftsmanship You Can Count On',
    aboutText: 'We build with precision, manage with accountability, and deliver with pride. Our experienced team handles residential and commercial projects from initial planning through to handover — on time, on budget, and to the highest standard.',
    services: [
      { name: 'New Build Construction', desc: 'Residential and commercial builds from groundwork to handover', price: 'Contact for estimate' },
      { name: 'Renovation & Refurbishment', desc: 'Full and partial renovations, extensions, and conversions', price: 'from €180 / m²' },
      { name: 'Roofing & Structural Works', desc: 'Roof replacements, structural repairs, and waterproofing', price: 'from €4,500' },
    ],
    testimonials: [
      { name: 'Karl D.', role: 'Homeowner', text: 'Our extension was completed on budget and two weeks early. Exceptional.', rating: 5 },
      { name: 'Christine H.', role: 'Developer', text: 'We\\'ve completed 4 projects with this team. Consistent quality every time.', rating: 5 },
      { name: 'Boris M.', role: 'Commercial Client', text: 'Transformed our office space completely. Professional from start to finish.', rating: 5 },
    ],
    faq: [
      { q: 'Do you handle planning permission?', a: 'Yes, we manage all planning applications and building regulation approvals.' },
      { q: 'Are you insured?', a: 'Fully insured for public liability, employer liability, and professional indemnity.' },
      { q: 'How do I get a quote?', a: 'Book a free site survey and we\\'ll provide a full, itemised quote within 5 days.' },
      { q: 'What guarantee do you offer?', a: 'All our work comes with a 10-year structural guarantee and 2-year finishing warranty.' },
    ],
    hours: '08:00 – 17:00', openDays: 'Mon – Fri',
  },

  accounting: {
    tagline: 'Clarity in Every Number',
    subTagline: 'Professional accounting, tax planning, and business advisory for individuals and companies.',
    cta: 'Book a Consultation',
    aboutTitle: 'Your Financial Partner',
    aboutText: 'We go beyond the numbers. Our chartered accountants provide strategic insight alongside meticulous compliance — helping you reduce tax, manage cash flow, and grow your business with confidence. Approachable, responsive, and absolutely precise.',
    services: [
      { name: 'Annual Accounts & Tax', desc: 'Statutory accounts preparation and self-assessment / corporation tax returns', price: 'from €600 / year' },
      { name: 'VAT & Bookkeeping', desc: 'Monthly bookkeeping, VAT returns, and management accounts', price: 'from €150 / month' },
      { name: 'Business Advisory', desc: 'Growth strategy, cash flow forecasting, and financial planning', price: 'from €180 / hour' },
    ],
    testimonials: [
      { name: 'Paul R.', role: 'Business Owner', text: 'Saved us over €12,000 in tax last year. Best investment we\\'ve ever made.', rating: 5 },
      { name: 'Lisa C.', role: 'Freelancer', text: 'Finally an accountant who explains everything clearly. Completely stress-free.', rating: 5 },
      { name: 'Mark T.', role: 'Director', text: 'Their business advisory helped us scale from 3 to 18 staff in 2 years.', rating: 5 },
    ],
    faq: [
      { q: 'Can you take over from another accountant?', a: 'Yes, we handle all handover communications and transfers smoothly.' },
      { q: 'Do you use cloud accounting software?', a: 'Yes, we use Xero and QuickBooks and can train your team to use them too.' },
      { q: 'How quickly do you respond?', a: 'We guarantee a response within one business day for all client queries.' },
      { q: 'Do you offer a fixed fee?', a: 'Yes, we provide clear fixed-fee packages so you always know exactly what you pay.' },
    ],
    hours: '09:00 – 17:30', openDays: 'Mon – Fri',
  },

  law_firm: {
    tagline: 'Expert Legal Advice You Can Trust',
    subTagline: 'Protecting your rights, advancing your interests. Specialist lawyers in your corner.',
    cta: 'Request a Consultation',
    aboutTitle: 'Principled. Precise. Powerful.',
    aboutText: 'Our firm has built its reputation on rigorous legal thinking, unwavering client commitment, and results that speak for themselves. Whether you\\'re facing a personal matter or complex commercial dispute, our solicitors bring focus, experience, and tenacity to your case.',
    services: [
      { name: 'Corporate Law', desc: 'Company formation, contracts, M&A, and commercial agreements', price: 'from €200 / hour' },
      { name: 'Employment Law', desc: 'Unfair dismissal, contracts, discrimination, and employment tribunals', price: 'from €180 / hour' },
      { name: 'Property Law', desc: 'Conveyancing, landlord disputes, planning, and property development', price: 'from €750 / matter' },
    ],
    testimonials: [
      { name: 'David K.', role: 'CEO', text: 'Outstanding corporate advice that protected our acquisition. Highly recommended.', rating: 5 },
      { name: 'Amy N.', role: 'Client', text: 'My employment case was handled sensitively and won quickly. Thank you.', rating: 5 },
      { name: 'George A.', role: 'Property Developer', text: 'Sharp, proactive, and never miss a deadline. Our trusted legal partners.', rating: 5 },
    ],
    faq: [
      { q: 'Is my consultation confidential?', a: 'Absolutely. All consultations are strictly privileged and confidential.' },
      { q: 'Do you offer fixed fees?', a: 'Yes, for many matters we offer fixed-fee options for cost certainty.' },
      { q: 'How quickly can you take on a case?', a: 'We can typically start work within 48 hours of your initial consultation.' },
      { q: 'Do you represent individuals as well as businesses?', a: 'Yes, we advise both private clients and businesses across all practice areas.' },
    ],
    hours: '09:00 – 17:30', openDays: 'Mon – Fri',
  },
};

const DEFAULT_CONTENT: SectorContent = {
  tagline:    'Professional Services You Can Rely On',
  subTagline: 'Expert solutions tailored to your needs. Quality, reliability, and results.',
  cta:        'Get in Touch',
  aboutTitle: 'About Us',
  aboutText:  'We are a dedicated team of professionals committed to delivering exceptional service and outstanding results. Our expertise, attention to detail, and genuine care for our clients set us apart in everything we do.',
  services: [
    { name: 'Core Service',       desc: 'Our flagship offering, designed to meet your most important needs', price: 'Contact us' },
    { name: 'Premium Package',    desc: 'A comprehensive solution including all features and priority support', price: 'Contact us' },
    { name: 'Consultation',       desc: 'Expert advice and tailored recommendations for your specific situation', price: 'Contact us' },
  ],
  testimonials: [
    { name: 'A. Johnson', role: 'Client', text: 'Outstanding service and remarkable attention to detail. Highly recommended.', rating: 5 },
    { name: 'B. Smith',   role: 'Client', text: 'Professional, reliable, and delivered exactly what was promised.', rating: 5 },
    { name: 'C. Davis',   role: 'Client', text: 'The best in their field. Will absolutely return and recommend to friends.', rating: 5 },
  ],
  faq: [
    { q: 'How do I get started?',    a: 'Simply book a consultation through our booking form and we\\'ll be in touch within 24 hours.' },
    { q: 'What are your payment terms?', a: 'We accept all major payment methods. Payment schedules can be arranged for larger projects.' },
    { q: 'Do you offer guarantees?', a: 'Yes, we stand behind all our work. Ask us about our satisfaction guarantee.' },
    { q: 'How can I contact you?',   a: 'You can reach us by phone, email, or WhatsApp. We respond within one business day.' },
  ],
  hours:    '09:00 – 18:00',
  openDays: 'Mon – Fri',
};

export function getSectorContent(sector: SectorKey): SectorContent {
  return CONTENT[sector as string] ?? DEFAULT_CONTENT;
}
`,gv=`import { getTheme } from '../../lib/themes';
import type { ThemeDefinition } from '../../lib/themes';
import type { Manifest, ManifestBranding } from '../../types/manifest';

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function parseHex(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '');
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function toHex(r: number, g: number, b: number): string {
  return \`#\${[r, g, b].map(channel => clampChannel(channel).toString(16).padStart(2, '0')).join('')}\`;
}

function mixWithWhite(hex: string, weight: number): string {
  const [r, g, b] = parseHex(hex);
  return toHex(
    r + (255 - r) * weight,
    g + (255 - g) * weight,
    b + (255 - b) * weight,
  );
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex);
  const factor = 1 - amount;
  return toHex(r * factor, g * factor, b * factor);
}

export function applyBrandingOverride(
  theme: ThemeDefinition,
  branding?: ManifestBranding,
): ThemeDefinition {
  const hex = branding?.primaryColorHex;
  if (!hex || !HEX_PATTERN.test(hex)) return theme;

  const primary = theme.colors.primary;
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary: {
        ...primary,
        500: hex,
        600: darken(hex, 0.12),
        700: darken(hex, 0.24),
        100: mixWithWhite(hex, 0.88),
      },
    },
  };
}

export function buildBrandedPalette(manifest: Manifest): ThemePalette {
  const theme = getTheme(manifest.website.themeKey);
  const brandedTheme = applyBrandingOverride(theme, manifest.branding);
  return buildPalette(brandedTheme);
}

export interface ThemePalette {
  bg:           string;
  bgAlt:        string;
  cardBg:       string;
  cardBorder:   string;
  fg:           string;
  fgMuted:      string;
  primary:      string;
  primaryHover: string;
  primaryLight: string;
  primaryFg:    string; // text on primary background
  radius:       string;
  font:         string;
  isDark:       boolean;
}

export function buildPalette(theme: ThemeDefinition): ThemePalette {
  const isDark = ['#0f172a', '#18181b', '#1e1b4b'].includes(
    theme.websiteBackground.toLowerCase()
  );
  const p = theme.colors.primary;
  const n = theme.colors.neutral;

  return {
    bg:           theme.websiteBackground,
    bgAlt:        isDark ? n[800] : n[50],
    cardBg:       isDark ? n[800] : '#ffffff',
    cardBorder:   isDark ? n[700] : n[200],
    fg:           theme.websiteForeground,
    fgMuted:      isDark ? n[400] : n[500],
    primary:      p[600],
    primaryHover: p[700],
    primaryLight: p[100],
    primaryFg:    '#ffffff',
    radius:       theme.borderRadius || '0.5rem',
    font:         theme.fontFamily,
    isDark,
  };
}

export type { ThemeDefinition };
`,bv=`export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';

export interface CrmAppointment {
  id: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  serviceId?: string;
  serviceName: string;
  staffId?: string;
  resourceId?: string;
  date: string;
  time?: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface CrmClient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

export interface CrmServiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  durationMinutes: number;
  active: boolean;
}

export type ResourceStatus = 'available' | 'occupied' | 'maintenance';

export interface CrmResource {
  id: string;
  name: string;
  capacity: number;
  status: ResourceStatus;
  notes?: string;
}

export interface CrmStaffMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  active: boolean;
}

export interface CrmSettings {
  businessName: string;
  phone: string;
  email: string;
  whatsapp?: string;
  city?: string;
  storageBackend: 'local' | 'firebase';
  firebaseReady: boolean;
}

export interface CrmEntities {
  appointments: CrmAppointment[];
  clients: CrmClient[];
  services: CrmServiceItem[];
  resources: CrmResource[];
  staff: CrmStaffMember[];
  settings: CrmSettings;
}

/** @deprecated Use CrmAppointment — kept for Website booking bridge */
export type CrmBooking = CrmAppointment;
`,yv=`import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import type { Manifest, ManifestBranding, QuestionnaireInput } from '../types/manifest';
import { getFactoryBootstrap, getStorageKey } from '../lib/bootstrap';
import { localStorageAdapter } from '../lib/storage/localStorageAdapter';
import { getFirebaseReadiness } from '../lib/storage/firebaseAdapter';
import { buildCrmSeed, emptyCrmEntities } from '../lib/crmSeed';
import { exportProjectJson, importProjectJson, downloadJsonFile } from '../lib/crmPersistence';
import type {
  AppointmentStatus,
  CrmAppointment,
  CrmBooking,
  CrmClient,
  CrmEntities,
  CrmResource,
  CrmServiceItem,
  CrmSettings,
  CrmStaffMember,
} from './crmTypes';

export type { CrmBooking, CrmAppointment, CrmClient, CrmServiceItem, CrmResource, CrmStaffMember, CrmSettings, CrmEntities };

export interface ProjectState {
  questionnaire: QuestionnaireInput | null;
  manifest: Manifest | null;
  step: 'questionnaire' | 'generating' | 'demo' | 'result';
  /** @deprecated Prefer entities.appointments — kept for migration */
  bookings: CrmBooking[];
  entities: CrmEntities;
  seeded: boolean;
}

const DEFAULT_STATE: ProjectState = {
  questionnaire: null,
  manifest: null,
  step: 'questionnaire',
  bookings: [],
  entities: emptyCrmEntities(),
  seeded: false,
};

function migrateLoaded(parsed: Partial<ProjectState>): ProjectState {
  const base: ProjectState = { ...DEFAULT_STATE, ...parsed };
  if (!base.entities) {
    base.entities = emptyCrmEntities();
  }
  // Migrate legacy bookings → appointments
  if ((!base.entities.appointments || base.entities.appointments.length === 0) && base.bookings?.length) {
    base.entities.appointments = base.bookings.map(b => ({
      ...b,
      clientName: b.clientName ?? (b as { name?: string }).name ?? 'Guest',
      clientPhone: b.clientPhone ?? (b as { phone?: string }).phone ?? '',
      serviceName: b.serviceName ?? (b as { service?: string }).service ?? 'Service',
      date: b.date,
      status: b.status,
      createdAt: b.createdAt,
      id: b.id,
    }));
  }
  base.bookings = base.entities.appointments;
  return base;
}

function loadFromStorage(): ProjectState {
  try {
    const key = getStorageKey();
    const parsed = localStorageAdapter.load<Partial<ProjectState>>(key);
    if (!parsed) {
      const boot = getFactoryBootstrap();
      if (boot?.manifest) {
        const entities = buildCrmSeed(boot.manifest);
        const firebase = getFirebaseReadiness();
        entities.settings.firebaseReady = firebase.ready || entities.settings.firebaseReady;
        return {
          ...DEFAULT_STATE,
          manifest: boot.manifest,
          step: 'demo',
          entities,
          bookings: entities.appointments,
          seeded: true,
        };
      }
      return DEFAULT_STATE;
    }
    const migrated = migrateLoaded(parsed);
    const boot = getFactoryBootstrap();
    if (boot?.manifest && !migrated.manifest) {
      migrated.manifest = boot.manifest;
      migrated.step = 'demo';
    }
    if (boot?.manifest && !migrated.seeded && migrated.entities.services.length === 0) {
      migrated.entities = buildCrmSeed(boot.manifest);
      migrated.bookings = migrated.entities.appointments;
      migrated.seeded = true;
    }
    return migrated;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveToStorage(state: ProjectState): boolean {
  return localStorageAdapter.save(getStorageKey(), state);
}

function mergeBranding(
  existing: ManifestBranding | undefined,
  incoming: ManifestBranding,
): ManifestBranding {
  const merged: ManifestBranding = { ...existing, ...incoming };
  if (incoming.photoOverrides) {
    merged.photoOverrides = {
      ...existing?.photoOverrides,
      ...incoming.photoOverrides,
      gallery: incoming.photoOverrides.gallery ?? existing?.photoOverrides?.gallery,
      services: incoming.photoOverrides.services ?? existing?.photoOverrides?.services,
    };
  }
  return merged;
}

function withId<T extends { id?: string }>(item: T): T & { id: string } {
  return { ...item, id: item.id ?? crypto.randomUUID() };
}

interface ProjectStoreValue {
  state: ProjectState;
  setQuestionnaire: (input: QuestionnaireInput) => void;
  setManifest: (manifest: Manifest) => void;
  setBranding: (branding: ManifestBranding) => void;
  setStep: (step: ProjectState['step']) => void;
  addBooking: (booking: {
    name?: string;
    phone?: string;
    service?: string;
    clientName?: string;
    clientPhone?: string;
    serviceName?: string;
    date: string;
    time?: string;
    status?: AppointmentStatus;
    clientId?: string;
    serviceId?: string;
    staffId?: string;
    resourceId?: string;
    notes?: string;
  }) => void;
  updateAppointment: (id: string, patch: Partial<CrmAppointment>) => void;
  deleteAppointment: (id: string) => void;
  upsertClient: (client: Partial<CrmClient> & { name: string; phone: string }) => void;
  deleteClient: (id: string) => void;
  upsertService: (service: Partial<CrmServiceItem> & { name: string }) => void;
  deleteService: (id: string) => void;
  upsertResource: (resource: Partial<CrmResource> & { name: string }) => void;
  deleteResource: (id: string) => void;
  upsertStaff: (member: Partial<CrmStaffMember> & { name: string; role: string }) => void;
  deleteStaff: (id: string) => void;
  updateSettings: (patch: Partial<CrmSettings>) => void;
  seedIfNeeded: () => void;
  exportJson: () => void;
  importJson: (raw: string) => void;
  reset: () => void;
}

const ProjectStoreContext = createContext<ProjectStoreValue | null>(null);

export function ProjectStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProjectState>(loadFromStorage);

  useEffect(() => {
    const boot = getFactoryBootstrap();
    if (!boot?.manifest) return;
    setState(prev => {
      if (prev.manifest && prev.seeded) return prev;
      const entities = prev.seeded && prev.entities.services.length > 0
        ? prev.entities
        : buildCrmSeed(boot.manifest);
      const next: ProjectState = {
        ...prev,
        manifest: boot.manifest,
        step: 'demo',
        entities,
        bookings: entities.appointments,
        seeded: true,
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const commit = useCallback((updater: (prev: ProjectState) => ProjectState) => {
    setState(prev => {
      const next = updater(prev);
      next.bookings = next.entities.appointments;
      saveToStorage(next);
      return next;
    });
  }, []);

  const setQuestionnaire = useCallback((input: QuestionnaireInput) => {
    commit(prev => ({ ...prev, questionnaire: input, step: 'generating' }));
  }, [commit]);

  const setManifest = useCallback((manifest: Manifest) => {
    commit(prev => {
      const shouldSeed = !prev.seeded || prev.entities.services.length === 0;
      const entities = shouldSeed ? buildCrmSeed(manifest) : {
        ...prev.entities,
        settings: {
          ...prev.entities.settings,
          businessName: manifest.business.name,
          phone: manifest.business.phone,
          email: manifest.business.email,
          whatsapp: manifest.business.whatsapp,
          city: manifest.business.city,
          firebaseReady: getFirebaseReadiness().ready || prev.entities.settings.firebaseReady,
        },
      };
      return {
        ...prev,
        manifest,
        step: 'demo',
        entities,
        seeded: true,
      };
    });
  }, [commit]);

  const setBranding = useCallback((branding: ManifestBranding) => {
    commit(prev => {
      if (!prev.manifest) return prev;
      return {
        ...prev,
        manifest: {
          ...prev.manifest,
          branding: mergeBranding(prev.manifest.branding, branding),
        },
      };
    });
  }, [commit]);

  const setStep = useCallback((step: ProjectState['step']) => {
    commit(prev => ({ ...prev, step }));
  }, [commit]);

  const addBooking = useCallback((booking: {
    name?: string;
    phone?: string;
    service?: string;
    clientName?: string;
    clientPhone?: string;
    serviceName?: string;
    date: string;
    time?: string;
    status?: AppointmentStatus;
    clientId?: string;
    serviceId?: string;
    staffId?: string;
    resourceId?: string;
    notes?: string;
  }) => {
    const entry: CrmAppointment = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      clientName: booking.clientName ?? booking.name ?? 'Guest',
      clientPhone: booking.clientPhone ?? booking.phone ?? '',
      serviceName: booking.serviceName ?? booking.service ?? 'Service',
      date: booking.date,
      time: booking.time,
      status: booking.status ?? 'Pending',
      clientId: booking.clientId,
      serviceId: booking.serviceId,
      staffId: booking.staffId,
      resourceId: booking.resourceId,
      notes: booking.notes,
    };
    commit(prev => {
      let clients = prev.entities.clients;
      const existing = clients.find(c => c.phone === entry.clientPhone);
      if (!existing && entry.clientPhone) {
        const client: CrmClient = {
          id: crypto.randomUUID(),
          name: entry.clientName,
          phone: entry.clientPhone,
          createdAt: entry.createdAt,
        };
        entry.clientId = client.id;
        clients = [client, ...clients];
      } else if (existing) {
        entry.clientId = existing.id;
      }
      return {
        ...prev,
        entities: {
          ...prev.entities,
          appointments: [entry, ...prev.entities.appointments],
          clients,
        },
      };
    });
  }, [commit]);

  const updateAppointment = useCallback((id: string, patch: Partial<CrmAppointment>) => {
    commit(prev => ({
      ...prev,
      entities: {
        ...prev.entities,
        appointments: prev.entities.appointments.map(a => (a.id === id ? { ...a, ...patch } : a)),
      },
    }));
  }, [commit]);

  const deleteAppointment = useCallback((id: string) => {
    commit(prev => ({
      ...prev,
      entities: {
        ...prev.entities,
        appointments: prev.entities.appointments.filter(a => a.id !== id),
      },
    }));
  }, [commit]);

  const upsertClient = useCallback((client: Partial<CrmClient> & { name: string; phone: string }) => {
    commit(prev => {
      const next = withId({ ...client, createdAt: client.createdAt ?? new Date().toISOString() });
      const idx = prev.entities.clients.findIndex(c => c.id === next.id);
      const clients = [...prev.entities.clients];
      if (idx >= 0) clients[idx] = { ...clients[idx], ...next };
      else clients.unshift(next as CrmClient);
      return { ...prev, entities: { ...prev.entities, clients } };
    });
  }, [commit]);

  const deleteClient = useCallback((id: string) => {
    commit(prev => ({
      ...prev,
      entities: { ...prev.entities, clients: prev.entities.clients.filter(c => c.id !== id) },
    }));
  }, [commit]);

  const upsertService = useCallback((service: Partial<CrmServiceItem> & { name: string }) => {
    commit(prev => {
      const next = withId({
        description: '',
        price: '',
        durationMinutes: 60,
        active: true,
        ...service,
      });
      const idx = prev.entities.services.findIndex(s => s.id === next.id);
      const services = [...prev.entities.services];
      if (idx >= 0) services[idx] = { ...services[idx], ...next };
      else services.unshift(next as CrmServiceItem);
      return { ...prev, entities: { ...prev.entities, services } };
    });
  }, [commit]);

  const deleteService = useCallback((id: string) => {
    commit(prev => ({
      ...prev,
      entities: { ...prev.entities, services: prev.entities.services.filter(s => s.id !== id) },
    }));
  }, [commit]);

  const upsertResource = useCallback((resource: Partial<CrmResource> & { name: string }) => {
    commit(prev => {
      const next = withId({ capacity: 1, status: 'available' as const, ...resource });
      const idx = prev.entities.resources.findIndex(r => r.id === next.id);
      const resources = [...prev.entities.resources];
      if (idx >= 0) resources[idx] = { ...resources[idx], ...next };
      else resources.unshift(next as CrmResource);
      return { ...prev, entities: { ...prev.entities, resources } };
    });
  }, [commit]);

  const deleteResource = useCallback((id: string) => {
    commit(prev => ({
      ...prev,
      entities: { ...prev.entities, resources: prev.entities.resources.filter(r => r.id !== id) },
    }));
  }, [commit]);

  const upsertStaff = useCallback((member: Partial<CrmStaffMember> & { name: string; role: string }) => {
    commit(prev => {
      const next = withId({ active: true, ...member });
      const idx = prev.entities.staff.findIndex(s => s.id === next.id);
      const staff = [...prev.entities.staff];
      if (idx >= 0) staff[idx] = { ...staff[idx], ...next };
      else staff.unshift(next as CrmStaffMember);
      return { ...prev, entities: { ...prev.entities, staff } };
    });
  }, [commit]);

  const deleteStaff = useCallback((id: string) => {
    commit(prev => ({
      ...prev,
      entities: { ...prev.entities, staff: prev.entities.staff.filter(s => s.id !== id) },
    }));
  }, [commit]);

  const updateSettings = useCallback((patch: Partial<CrmSettings>) => {
    commit(prev => ({
      ...prev,
      entities: { ...prev.entities, settings: { ...prev.entities.settings, ...patch } },
    }));
  }, [commit]);

  const seedIfNeeded = useCallback(() => {
    commit(prev => {
      if (!prev.manifest || prev.seeded) return prev;
      const entities = buildCrmSeed(prev.manifest);
      return { ...prev, entities, seeded: true };
    });
  }, [commit]);

  const exportJson = useCallback(() => {
    if (!state.manifest) return;
    const json = exportProjectJson({
      manifest: state.manifest,
      entities: state.entities,
      questionnaire: state.questionnaire,
      step: state.step,
    });
    const slug = state.manifest.business.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    downloadJsonFile(\`\${slug || 'factory'}-crm-export.json\`, json);
  }, [state]);

  const importJson = useCallback((raw: string) => {
    const payload = importProjectJson(raw);
    commit(() => ({
      questionnaire: (payload.questionnaire as QuestionnaireInput | null) ?? null,
      manifest: payload.manifest,
      step: (payload.step as ProjectState['step']) ?? 'demo',
      entities: payload.entities,
      bookings: payload.entities.appointments,
      seeded: true,
    }));
  }, [commit]);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorageAdapter.remove(getStorageKey());
  }, []);

  const value = useMemo(
    () => ({
      state,
      setQuestionnaire,
      setManifest,
      setBranding,
      setStep,
      addBooking,
      updateAppointment,
      deleteAppointment,
      upsertClient,
      deleteClient,
      upsertService,
      deleteService,
      upsertResource,
      deleteResource,
      upsertStaff,
      deleteStaff,
      updateSettings,
      seedIfNeeded,
      exportJson,
      importJson,
      reset,
    }),
    [
      state, setQuestionnaire, setManifest, setBranding, setStep, addBooking,
      updateAppointment, deleteAppointment, upsertClient, deleteClient,
      upsertService, deleteService, upsertResource, deleteResource,
      upsertStaff, deleteStaff, updateSettings, seedIfNeeded, exportJson, importJson, reset,
    ],
  );

  return (
    <ProjectStoreContext.Provider value={value}>
      {children}
    </ProjectStoreContext.Provider>
  );
}

export function useProjectStore(): ProjectStoreValue {
  const ctx = useContext(ProjectStoreContext);
  if (!ctx) {
    throw new Error('useProjectStore must be used within ProjectStoreProvider');
  }
  return ctx;
}
`,xv=`export type Language = 'en' | 'de' | 'ru';

export type SectorKey =
  | 'restaurant'
  | 'dental_clinic'
  | 'beauty_salon'
  | 'fitness'
  | 'barber'
  | 'massage'
  | 'cleaning'
  | 'auto_service'
  | 'hotel'
  | 'education'
  | 'real_estate'
  | 'construction'
  | 'accounting'
  | 'law_firm'
  | (string & {}); // allows runtime-registered custom sectors while keeping autocomplete for known keys

export type WebsiteSectionKey =
  | 'hero'
  | 'about'
  | 'services'
  | 'gallery'
  | 'booking'
  | 'testimonials'
  | 'faq'
  | 'contacts'
  | 'google_maps'
  | 'whatsapp'
  | 'email_section';

export type CrmModuleKey =
  | 'dashboard'
  | 'customers'
  | 'bookings'
  | 'services'
  | 'calendar'
  | 'employees'
  | 'notifications'
  | 'settings'
  | 'review_requests';

export type ThemeKey =
  | 'modern_light'
  | 'modern_dark'
  | 'classic'
  | 'minimal'
  | 'bold';

export type BookingModuleKey = 'simple_form' | 'calendar_picker' | 'time_slots';

export type ReviewModuleKey = 'google_review_link' | 'whatsapp_review_request' | 'email_review_request';

export type NotificationChannelKey = 'whatsapp' | 'email' | 'sms';

export type OwnershipMode = 'studio_owned' | 'client_owned' | 'white_label';

// ─── Ownership / White-label (Req 10) ────────────────────────────────────────

export interface ManifestOwnership {
  ownershipMode: OwnershipMode;
  studioBrand: string;
  clientBrand: string;
  studioEmail?: string;
  studioWebsite?: string;
}

// ─── Business ────────────────────────────────────────────────────────────────

export interface ManifestBusiness {
  name: string;
  sector: SectorKey;
  city: string;
  language: Language;
  phone: string;
  whatsapp?: string;
  email: string;
  website?: string;
  instagram?: string;
  facebook?: string;
}

// ─── Website ─────────────────────────────────────────────────────────────────

export interface ManifestWebsite {
  sections: WebsiteSectionKey[];
  themeKey: ThemeKey;
  imageSourceKey: string;
}

// ─── Review Flow (Req 7) ─────────────────────────────────────────────────────

export interface ManifestReviewFlow {
  enabled: boolean;
  steps: ReviewFlowStep[];
  googleMapsUrl?: string;
}

export type ReviewFlowStepKey =
  | 'booking_confirmation'
  | 'crm_record'
  | 'whatsapp_followup'
  | 'email_followup'
  | 'google_review_request';

export interface ReviewFlowStep {
  stepKey: ReviewFlowStepKey;
  delayHours: number;
  channel: NotificationChannelKey | 'internal';
  enabled: boolean;
}

// ─── CRM ─────────────────────────────────────────────────────────────────────

export interface ManifestCrm {
  modules: CrmModuleKey[];
  bookingModule: BookingModuleKey;
  reviewModule: ReviewModuleKey;
  notificationChannels: NotificationChannelKey[];
  reviewFlow: ManifestReviewFlow;
  /** Niche CRM vocabulary key (restaurant, hotel, beauty_salon, …) */
  vocabularyKey?: string;
}

// ─── Delivery (Req 8) ────────────────────────────────────────────────────────

export type DeliveryActionStatus = 'pending' | 'mock';

export interface FirebaseConfigMock {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface ManifestDelivery {
  firebaseConfigMock: FirebaseConfigMock;
  readmeSections: string[];
  actions: DeliveryActions;
}

export interface DeliveryActions {
  zip: DeliveryAction;
  github: DeliveryAction;
  firebase: DeliveryAction;
  deploy: DeliveryAction;
}

export interface DeliveryAction {
  status: DeliveryActionStatus;
  label: string;
  mock: true;
}

// ─── Metadata (Req: final core patch) ────────────────────────────────────────

export interface ManifestMetadata {
  projectId: string;
  studioId: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  manifestVersion: string;
  engineVersion: string;
}

// ─── Branding (Studio SDK) ────────────────────────────────────────────────────

export interface ManifestBranding {
  logoDataUrl?: string;
  primaryColorHex?: string;
  businessNameOverride?: string;
  phoneOverride?: string;
  whatsappOverride?: string;
  emailOverride?: string;
  photoOverrides?: {
    hero?: string;
    about?: string;
    gallery?: string[];
    services?: string[];
  };
}

// ─── Root Manifest ────────────────────────────────────────────────────────────

export interface Manifest {
  schemaVersion: '1.0';
  generatedAt: string;
  metadata: ManifestMetadata;
  ownership: ManifestOwnership;
  business: ManifestBusiness;
  website: ManifestWebsite;
  crm: ManifestCrm;
  delivery: ManifestDelivery;
  branding?: ManifestBranding;
}

// ─── Questionnaire Input ──────────────────────────────────────────────────────

export interface QuestionnaireInput {
  // Business
  name: string;
  sector: SectorKey;
  city: string;
  language: Language;
  phone: string;
  whatsapp?: string;
  email: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  // Ownership
  studioBrand: string;
  clientBrand: string;
  ownershipMode: OwnershipMode;
  studioEmail?: string;
  studioWebsite?: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ManifestValidationError {
  field: string;
  message: string;
}

export type ManifestValidationResult =
  | { valid: true; manifest: Manifest }
  | { valid: false; errors: ManifestValidationError[] };
`,vv=`/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
`,wv=`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title data-default>Vite + React + TS</title>
    <meta property="og:image" content="https://bolt.new/static/og_default.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://bolt.new/static/og_default.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"><\/script>
  </body>
</html>
`,kv=`{
  "name": "vite-react-typescript-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:template": "vite build",
    "export:template": "bash scripts/export-template-dist.sh",
    "lint": "eslint .",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit -p tsconfig.app.json",
    "promo:create": "node scripts/create-promo.mjs"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "@types/react-router-dom": "^5.3.3",
    "firebase-admin": "^13.0.2",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.18.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
`,Sv=`export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,Nv=`/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6C3BFF', light: '#8B5CFF', dark: '#4F1FE8', faint: '#F0EBFF' },
        accent:  { DEFAULT: '#00D4FF', dark: '#00A8CC', faint: '#E0FAFF' },
        factory: { dark: '#111827', card: '#FFFFFF', bg: '#F7F8FC', border: '#E8EAF2' },
      },
      backgroundImage: {
        'brand':        'linear-gradient(135deg, #6C3BFF 0%, #00D4FF 100%)',
        'brand-dark':   'linear-gradient(135deg, #4F1FE8 0%, #0099BB 100%)',
        'brand-subtle': 'linear-gradient(135deg, rgba(108,59,255,0.08) 0%, rgba(0,212,255,0.08) 100%)',
        'dark-surface': 'linear-gradient(160deg, #111827 0%, #1a0f3e 100%)',
        'card-shine':   'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)',
      },
      boxShadow: {
        'glow':       '0 0 40px rgba(108, 59, 255, 0.18)',
        'glow-sm':    '0 0 16px rgba(108, 59, 255, 0.14)',
        'glow-cyan':  '0 0 30px rgba(0, 212, 255, 0.15)',
        'card':       '0 2px 16px rgba(17, 24, 39, 0.06)',
        'card-hover': '0 8px 32px rgba(17, 24, 39, 0.12)',
        'card-xl':    '0 4px 32px rgba(17, 24, 39, 0.08)',
        'selected':   '0 0 0 3px rgba(108, 59, 255, 0.25)',
      },
      animation: {
        'fade-up':     'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':     'fadeIn 0.35s ease both',
        'slide-right': 'slideRight 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'shimmer':     'shimmer 2.4s linear infinite',
        'pulse-soft':  'pulseSoft 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.7' },
          '50%':      { opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
`,Cv=`{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
`,jv=`{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`,Rv=`{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
`,Ev=`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
`,_v=Object.assign({"/src/App.tsx":mx,"/src/components/ui/Badge.tsx":fx,"/src/components/ui/BookingCard.tsx":hx,"/src/components/ui/Button.tsx":gx,"/src/components/ui/CTA.tsx":bx,"/src/components/ui/Card.tsx":yx,"/src/components/ui/ContactCard.tsx":xx,"/src/components/ui/EmptyState.tsx":vx,"/src/components/ui/Footer.tsx":wx,"/src/components/ui/Gallery.tsx":kx,"/src/components/ui/Hero.tsx":Sx,"/src/components/ui/Input.tsx":Nx,"/src/components/ui/Loader.tsx":Cx,"/src/components/ui/Modal.tsx":jx,"/src/components/ui/Navbar.tsx":Rx,"/src/components/ui/Section.tsx":Ex,"/src/components/ui/SectionHeader.tsx":_x,"/src/components/ui/Select.tsx":Mx,"/src/components/ui/ServiceCard.tsx":Tx,"/src/components/ui/StatisticCard.tsx":Ax,"/src/components/ui/Textarea.tsx":Px,"/src/i18n/de.json":Dx,"/src/i18n/en.json":Bx,"/src/i18n/ru.json":Ix,"/src/index.css":Fx,"/src/lib/bootstrap.ts":Lx,"/src/lib/brandingDefaults.ts":Ox,"/src/lib/crmModules.ts":Wx,"/src/lib/crmPersistence.ts":Ux,"/src/lib/crmSeed.ts":Hx,"/src/lib/crmVocabulary.ts":qx,"/src/lib/firebaseWhatsApp.ts":zx,"/src/lib/i18n.tsx":$x,"/src/lib/imageCompression.ts":Gx,"/src/lib/imageOverrides.ts":Kx,"/src/lib/imageSources.ts":Vx,"/src/lib/manifestBuilder.ts":Yx,"/src/lib/promoCode.ts":Jx,"/src/lib/resolveNicheImages.ts":Qx,"/src/lib/sectors.ts":Zx,"/src/lib/storage/firebaseAdapter.ts":Xx,"/src/lib/storage/localStorageAdapter.ts":ev,"/src/lib/storage/types.ts":tv,"/src/lib/themes.ts":nv,"/src/lib/websiteSections.ts":sv,"/src/main.tsx":rv,"/src/pages/CrmDemoPage.tsx":av,"/src/pages/ManifestPreviewPage.tsx":ov,"/src/pages/QuestionnairePage.tsx":iv,"/src/pages/StudioSdkPage.tsx":lv,"/src/pages/WebsiteDemoPage.tsx":cv,"/src/pages/manifest-preview/DeliveryCenter.tsx":dv,"/src/pages/website-demo/BookingFaqContactSections.tsx":uv,"/src/pages/website-demo/HeroAboutSections.tsx":pv,"/src/pages/website-demo/ReviewFlowSection.tsx":mv,"/src/pages/website-demo/ServicesSections.tsx":fv,"/src/pages/website-demo/sectorContent.ts":hv,"/src/pages/website-demo/themeHelpers.ts":gv,"/src/store/crmTypes.ts":bv,"/src/store/projectStore.tsx":yv,"/src/types/manifest.ts":xv,"/src/vite-env.d.ts":vv}),xd=Object.assign({"/index.html":wv,"/package.json":kv,"/postcss.config.js":Sv,"/tailwind.config.js":Nv,"/tsconfig.app.json":Cv,"/tsconfig.json":jv,"/tsconfig.node.json":Rv,"/vite.config.ts":Ev}),Mv=`node_modules
dist
dist-ssr
*.local
.env
.env.local
.env.*.local
.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,Tv=`// Portable project ZIP generator.
// Uses Vite's import.meta.glob with { query: '?raw', import: 'default', eager: true }
// to embed actual source files at build time — no manual copy-paste of file content.
// .gitignore and zipGenerator.ts itself are included as hardcoded constants below
// because import.meta.glob cannot match dotfiles or reliably self-reference the
// file that calls it.

import type { Manifest } from '../types/manifest';

// ─── Embed source files via Vite glob ────────────────────────────────────────

// Vite replaces these at build time; the keys are relative paths from /src.
// NOTE: '.json' is included so files like src/i18n/*.json are captured too.
const SRC_FILES = import.meta.glob(
  [
    '/src/**/*.ts',
    '/src/**/*.tsx',
    '/src/**/*.css',
    '/src/**/*.json',
  ],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

// Root-level config files (relative to project root)
const ROOT_FILES = import.meta.glob(
  [
    '/index.html',
    '/vite.config.ts',
    '/tsconfig.json',
    '/tsconfig.app.json',
    '/tsconfig.node.json',
    '/tailwind.config.js',
    '/postcss.config.js',
    '/package.json',
  ],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

// ─── Hardcoded files that import.meta.glob cannot reliably capture ──────────
// .gitignore: dotfiles are not matched by the glob patterns above.
const GITIGNORE_CONTENT = \`node_modules
dist
dist-ssr
*.local
.env
.env.local
.env.*.local
.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
\`;

// zipGenerator.ts: self-referencing via import.meta.glob inside the same file
// that performs the glob causes a circular self-import at build time, so this
// file's own source is hardcoded here as a fallback note in the README instead
// of embedded verbatim. (Kept out of SRC_FILES on purpose — see note in DELIVERY.md.)

// ─── Slug helper ──────────────────────────────────────────────────────────────

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

function transliterate(input: string): string {
  return input
    .toLowerCase()
    .split('')
    .map((ch) => (ch in CYRILLIC_TO_LATIN ? CYRILLIC_TO_LATIN[ch] : ch))
    .join('');
}

/**
 * Converts a business name into a URL/filename-safe slug.
 * Transliterates Cyrillic to Latin before stripping non [a-z0-9-] characters.
 * Falls back to \`fallback\` (e.g. a short projectId) if the result is empty.
 */
export function toSlug(name: string, fallback: string): string {
  const slug = transliterate(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
}

// ─── Minimal pure-JS ZIP builder (no dependencies) ───────────────────────────

function u8(n: number, bytes: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < bytes; i++) { out.push(n & 0xff); n >>= 8; }
  return out;
}

function makeCrcTable(): Uint32Array {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
}
const CRC_TABLE = makeCrcTable();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const enc = new TextEncoder();

function makeEntry(name: string, content: string): {
  local: Uint8Array; centralFixed: Uint8Array; nameBytes: Uint8Array; size: number;
} {
  const nameBytes = enc.encode(name);
  const dataBytes = enc.encode(content);
  const crc       = crc32(dataBytes);
  const size      = dataBytes.length;

  const localHeader = new Uint8Array([
    0x50, 0x4b, 0x03, 0x04,
    ...u8(20, 2),
    ...u8(0, 2),
    ...u8(0, 2),
    ...u8(0x6000, 2),
    ...u8(0x5640, 2),
    ...u8(crc, 4),
    ...u8(size, 4),
    ...u8(size, 4),
    ...u8(nameBytes.length, 2),
    ...u8(0, 2),
  ]);

  const local = new Uint8Array(localHeader.length + nameBytes.length + dataBytes.length);
  local.set(localHeader, 0);
  local.set(nameBytes, localHeader.length);
  local.set(dataBytes, localHeader.length + nameBytes.length);

  const centralFixed = new Uint8Array([
    0x50, 0x4b, 0x01, 0x02,
    ...u8(20, 2), ...u8(20, 2),
    ...u8(0, 2),
    ...u8(0, 2),
    ...u8(0x6000, 2),
    ...u8(0x5640, 2),
    ...u8(crc, 4),
    ...u8(size, 4),
    ...u8(size, 4),
    ...u8(nameBytes.length, 2),
    ...u8(0, 2), ...u8(0, 2),
    ...u8(0, 2),
    ...u8(0, 2),
    ...u8(0, 4),
    0x00, 0x00, 0x00, 0x00,
  ]);

  return { local, centralFixed, nameBytes, size };
}

function buildZip(files: [string, string][]): Blob {
  type EntryData = ReturnType<typeof makeEntry> & { offset: number };
  const entries: EntryData[] = [];
  let offset = 0;

  for (const [name, content] of files) {
    const e = makeEntry(name, content) as EntryData;
    e.offset = offset;
    offset += e.local.length;
    entries.push(e);
  }

  const centralParts: Uint8Array[] = entries.map((e) => {
    const rec = new Uint8Array(e.centralFixed.length + e.nameBytes.length);
    rec.set(e.centralFixed, 0);
    const ov = u8(e.offset, 4);
    rec[e.centralFixed.length - 4] = ov[0];
    rec[e.centralFixed.length - 3] = ov[1];
    rec[e.centralFixed.length - 2] = ov[2];
    rec[e.centralFixed.length - 1] = ov[3];
    rec.set(e.nameBytes, e.centralFixed.length);
    return rec;
  });

  const centralSize  = centralParts.reduce((s, p) => s + p.length, 0);
  const centralStart = offset;

  const eocd = new Uint8Array([
    0x50, 0x4b, 0x05, 0x06,
    ...u8(0, 2), ...u8(0, 2),
    ...u8(entries.length, 2), ...u8(entries.length, 2),
    ...u8(centralSize, 4),
    ...u8(centralStart, 4),
    ...u8(0, 2),
  ]);

  const total = entries.reduce((s, e) => s + e.local.length, 0)
    + centralParts.reduce((s, p) => s + p.length, 0)
    + eocd.length;
  const out = new Uint8Array(total);
  let pos = 0;
  for (const e of entries)      { out.set(e.local, pos); pos += e.local.length; }
  for (const p of centralParts) { out.set(p, pos);        pos += p.length;       }
  out.set(eocd, pos);

  return new Blob([out], { type: 'application/zip' });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateDemoZip(manifest: Manifest): Blob {
  const files: [string, string][] = [];

  files.push(['.gitignore', GITIGNORE_CONTENT]);

  const rootMap: Record<string, string> = {
    '/index.html':         'index.html',
    '/vite.config.ts':     'vite.config.ts',
    '/tsconfig.json':      'tsconfig.json',
    '/tsconfig.app.json':  'tsconfig.app.json',
    '/tsconfig.node.json': 'tsconfig.node.json',
    '/tailwind.config.js': 'tailwind.config.js',
    '/postcss.config.js':  'postcss.config.js',
  };

  for (const [globKey, zipPath] of Object.entries(rootMap)) {
    const content = ROOT_FILES[globKey];
    if (content !== undefined) files.push([zipPath, content]);
  }

  const pkgRaw = ROOT_FILES['/package.json'];
  const slug = toSlug(manifest.business.name, manifest.metadata.projectId.slice(0, 12));
  if (pkgRaw) {
    try {
      const pkg = JSON.parse(pkgRaw);
      pkg.name = slug || pkg.name;
      files.push(['package.json', JSON.stringify(pkg, null, 2)]);
    } catch {
      files.push(['package.json', pkgRaw]);
    }
  }

  for (const [globKey, content] of Object.entries(SRC_FILES)) {
    const zipPath = globKey.replace(/^\\//, '');
    files.push([zipPath, content]);
  }

  files.push(['manifest.json', JSON.stringify(manifest, null, 2)]);
  files.push(['.env.example',  generateEnvExample()]);
  files.push(['README.md',     generateReadme(manifest)]);
  files.push(['DELIVERY.md',   generateDelivery(manifest)]);

  return buildZip(files);
}

// ─── Content generators ───────────────────────────────────────────────────────

function generateReadme(m: Manifest): string {
  return \`# \${m.business.name}

Generated by **Factory Website+CRM**
Manifest v\${m.metadata.manifestVersion} · Engine v\${m.metadata.engineVersion}

## Business
| Field | Value |
|---|---|
| Sector | \${m.business.sector} |
| City | \${m.business.city} |
| Language | \${m.business.language.toUpperCase()} |
| Phone | \${m.business.phone} |
| Email | \${m.business.email} |

## Stack
- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- React Router DOM 7
- Lucide React (icons)

## Getting Started

\\\`\\\`\\\`bash
npm install
npm run dev
\\\`\\\`\\\`

## Build

\\\`\\\`\\\`bash
npm run build
npm run preview
\\\`\\\`\\\`

## Deploy to Railway / Netlify / Vercel

1. Push to GitHub
2. Connect repo in Railway / Netlify / Vercel
3. Set build command: \\\`npm run build\\\`
4. Set publish directory: \\\`dist\\\`
5. Add environment variables from \\\`.env.example\\\`

---
Factory Website+CRM — \${new Date().toISOString().split('T')[0]}
\`;
}

function generateEnvExample(): string {
  return \`# Factory Website+CRM — Environment Variables
# Copy this file to .env and fill in your values

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BUSINESS_NAME=Your Business Name
VITE_WHATSAPP_NUMBER=+1234567890
\`;
}

function generateDelivery(m: Manifest): string {
  return \`# Delivery Notes — \${m.business.name}

Generated: \${new Date().toISOString()}
Project ID: \${m.metadata.projectId}

## Delivery Checklist
- [x] Manifest generated
- [x] Website Demo ready
- [x] CRM Dashboard ready
- [x] Review Flow configured
- [x] Full source code included in ZIP
- [ ] Connect to production database
- [ ] Configure WhatsApp Business API
- [ ] Configure email SMTP
- [ ] Connect Google Business Profile

## Files in this ZIP
- \\\`src/\\\` — Full React/TypeScript source (including src/i18n/*.json translations)
- \\\`.gitignore\\\` — hardcoded (not glob-matched, dotfiles excluded by Vite glob)
- \\\`index.html\\\` — Entry HTML
- \\\`vite.config.ts\\\` — Vite configuration
- \\\`tsconfig*.json\\\` — TypeScript config
- \\\`tailwind.config.js\\\` — Tailwind CSS config
- \\\`package.json\\\` — Dependencies (name field set to project slug)
- \\\`manifest.json\\\` — Factory manifest
- \\\`.env.example\\\` — Environment variable template

## Note for future edits to this file
zipGenerator.ts cannot glob itself (import.meta.glob self-reference causes
a circular embed at build time), so it must always be added to the exported
ZIP manually if a full copy of the generator source is required in the
delivered project. Currently it is NOT included in the ZIP output — only
referenced here for transparency.

## Support
Factory Website+CRM — web studio delivery platform
\`;
}
`,vd={а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"};function Av(e){return e.toLowerCase().split("").map(t=>t in vd?vd[t]:t).join("")}function Ql(e,t){return Av(e).replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||t}function U(e,t){const n=[];for(let s=0;s<t;s++)n.push(e&255),e>>=8;return n}function Pv(){const e=new Uint32Array(256);for(let t=0;t<256;t++){let n=t;for(let s=0;s<8;s++)n=n&1?3988292384^n>>>1:n>>>1;e[t]=n}return e}const Dv=Pv();function Bv(e){let t=4294967295;for(let n=0;n<e.length;n++)t=Dv[(t^e[n])&255]^t>>>8;return(t^4294967295)>>>0}const wd=new TextEncoder;function Iv(e,t){const n=wd.encode(e),s=wd.encode(t),r=Bv(s),o=s.length,i=new Uint8Array([80,75,3,4,...U(20,2),...U(0,2),...U(0,2),...U(24576,2),...U(22080,2),...U(r,4),...U(o,4),...U(o,4),...U(n.length,2),...U(0,2)]),l=new Uint8Array(i.length+n.length+s.length);l.set(i,0),l.set(n,i.length),l.set(s,i.length+n.length);const c=new Uint8Array([80,75,1,2,...U(20,2),...U(20,2),...U(0,2),...U(0,2),...U(24576,2),...U(22080,2),...U(r,4),...U(o,4),...U(o,4),...U(n.length,2),...U(0,2),...U(0,2),...U(0,2),...U(0,2),...U(0,4),0,0,0,0]);return{local:l,centralFixed:c,nameBytes:n,size:o}}function Fv(e){const t=[];let n=0;for(const[u,m]of e){const f=Iv(u,m);f.offset=n,n+=f.local.length,t.push(f)}const s=t.map(u=>{const m=new Uint8Array(u.centralFixed.length+u.nameBytes.length);m.set(u.centralFixed,0);const f=U(u.offset,4);return m[u.centralFixed.length-4]=f[0],m[u.centralFixed.length-3]=f[1],m[u.centralFixed.length-2]=f[2],m[u.centralFixed.length-1]=f[3],m.set(u.nameBytes,u.centralFixed.length),m}),r=s.reduce((u,m)=>u+m.length,0),o=n,i=new Uint8Array([80,75,5,6,...U(0,2),...U(0,2),...U(t.length,2),...U(t.length,2),...U(r,4),...U(o,4),...U(0,2)]),l=t.reduce((u,m)=>u+m.local.length,0)+s.reduce((u,m)=>u+m.length,0)+i.length,c=new Uint8Array(l);let d=0;for(const u of t)c.set(u.local,d),d+=u.local.length;for(const u of s)c.set(u,d),d+=u.length;return c.set(i,d),new Blob([c],{type:"application/zip"})}function Lv(e){const t=[];t.push([".gitignore",Mv]);const n={"/index.html":"index.html","/vite.config.ts":"vite.config.ts","/tsconfig.json":"tsconfig.json","/tsconfig.app.json":"tsconfig.app.json","/tsconfig.node.json":"tsconfig.node.json","/tailwind.config.js":"tailwind.config.js","/postcss.config.js":"postcss.config.js"};for(const[o,i]of Object.entries(n)){const l=xd[o];l!==void 0&&t.push([i,l])}const s=xd["/package.json"],r=Ql(e.business.name,e.metadata.projectId.slice(0,12));if(s)try{const o=JSON.parse(s);o.name=r||o.name,t.push(["package.json",JSON.stringify(o,null,2)])}catch{t.push(["package.json",s])}for(const[o,i]of Object.entries(_v)){const l=o.replace(/^\//,"");l!=="src/lib/zipGenerator.ts"&&t.push([l,i])}return t.push(["src/lib/zipGenerator.ts",Tv]),t.push(["manifest.json",JSON.stringify(e,null,2)]),t.push([".env.example",Wv()]),t.push(["README.md",Ov(e)]),t.push(["DELIVERY.md",Uv(e)]),Fv(t)}function Ov(e){return`# ${e.business.name}

Generated by **Factory Website+CRM**
Manifest v${e.metadata.manifestVersion} · Engine v${e.metadata.engineVersion}

## Business
| Field | Value |
|---|---|
| Sector | ${e.business.sector} |
| City | ${e.business.city} |
| Language | ${e.business.language.toUpperCase()} |
| Phone | ${e.business.phone} |
| Email | ${e.business.email} |

## Stack
- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- React Router DOM 7
- Lucide React (icons)

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Deploy to Railway / Netlify / Vercel

1. Push to GitHub
2. Connect repo in Railway / Netlify / Vercel
3. Set build command: \`npm run build\`
4. Set publish directory: \`dist\`
5. Add environment variables from \`.env.example\`

---
Factory Website+CRM — ${new Date().toISOString().split("T")[0]}
`}function Wv(){return`# Factory Website+CRM — Environment Variables
# Copy this file to .env and fill in your values

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BUSINESS_NAME=Your Business Name
VITE_WHATSAPP_NUMBER=+1234567890
`}function Uv(e){return`# Delivery Notes — ${e.business.name}

Generated: ${new Date().toISOString()}
Project ID: ${e.metadata.projectId}

## Delivery Checklist
- [x] Manifest generated
- [x] Website Demo ready
- [x] CRM Dashboard ready
- [x] Review Flow configured
- [x] Full source code included in ZIP
- [ ] Connect to production database
- [ ] Configure WhatsApp Business API
- [ ] Configure email SMTP
- [ ] Connect Google Business Profile

## Files in this ZIP
- \`src/\` — Full React/TypeScript source (including src/i18n/*.json translations)
- \`.gitignore\` — hardcoded (not glob-matched, dotfiles excluded by Vite glob)
- \`index.html\` — Entry HTML
- \`vite.config.ts\` — Vite configuration
- \`tsconfig*.json\` — TypeScript config
- \`tailwind.config.js\` — Tailwind CSS config
- \`package.json\` — Dependencies (name field set to project slug)
- \`manifest.json\` — Factory manifest
- \`.env.example\` — Environment variable template

## Note for future edits to this file
zipGenerator.ts cannot glob itself (import.meta.glob self-reference causes
a circular embed at build time), so it must always be added to the exported
ZIP manually if a full copy of the generator source is required in the
delivered project. Currently it is NOT included in the ZIP output — only
referenced here for transparency.

## Support
Factory Website+CRM — web studio delivery platform
`}const Hv="4915258400610",kd={ru:"Здравствуйте! Хочу подключить облачное хранение Firebase для моего Website+CRM.",en:"Hi! I'd like to connect Firebase cloud storage for my Website+CRM.",de:"Hallo! Ich möchte Firebase-Cloud-Speicher für meine Website+CRM anschließen."};function qv(e){const t=kd[e]??kd.en;return`https://wa.me/${Hv}?text=${encodeURIComponent(t)}`}function Rm(e){window.open(qv(e),"_blank","noopener,noreferrer")}const zv={en:"Invalid or already used promo code",de:"Ungültiger oder bereits verwendeter Promo-Code",ru:"Неверный или уже использованный промокод"};function Sd(e){return zv[e]}async function $v(e){const t=e.trim();if(!t)return{valid:!1,error:"empty"};try{const n=await fetch("/.netlify/functions/redeem-promo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:t})}),s=await n.json();return n.ok&&s.valid?{valid:!0,permanent:s.permanent}:{valid:!1,error:s.error??"invalid"}}catch{return{valid:!1,error:"network"}}}const Em="factory_promo_unlocked";function Gv(){try{return sessionStorage.getItem(Em)==="1"}catch{return!1}}function Kv(){try{sessionStorage.setItem(Em,"1")}catch{}}function _m({title:e,icon:t,onClose:n,children:s}){return a.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",style:{backgroundColor:"rgba(0,0,0,0.55)"},children:a.jsxs("div",{className:"bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-up",onClick:r=>r.stopPropagation(),children:[a.jsxs("div",{className:"flex items-center justify-between px-5 py-4 border-b border-slate-100",children:[a.jsxs("div",{className:"flex items-center gap-2",children:[t,a.jsx("h3",{className:"font-bold text-sm text-slate-800",children:e})]}),a.jsx("button",{onClick:n,className:"p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors",children:a.jsx(hm,{className:"w-4 h-4"})})]}),a.jsx("div",{className:"p-5",children:s})]})})}function Vv({manifest:e}){const{t,language:n}=se(),s=t.delivery,r={zip:[{label:s.zipSteps.preparing,duration:800},{label:s.zipSteps.packaging,duration:900},{label:s.zipSteps.archiving,duration:700},{label:s.zipSteps.ready,duration:0}],github:[{label:s.githubSteps.creating,duration:900},{label:s.githubSteps.uploading,duration:1100},{label:s.githubSteps.readme,duration:600},{label:s.githubSteps.done,duration:0}],deploy:[{label:s.deploySteps.uploading,duration:800},{label:s.deploySteps.building,duration:1200},{label:s.deploySteps.deploying,duration:900},{label:s.deploySteps.ready,duration:0}],firebase:[{label:s.firebaseSteps.config,duration:700},{label:s.firebaseSteps.collections,duration:1e3},{label:s.firebaseSteps.rules,duration:800},{label:s.firebaseSteps.done,duration:0}]},o=[{key:"zip",icon:_a,label:s.downloadZip,color:"#6C3BFF",bg:"rgba(108,59,255,0.10)"},{key:"github",icon:pm,label:s.pushGithub,color:"#111827",bg:"rgba(17,24,39,0.08)"},{key:"deploy",icon:as,label:s.deployHosting,color:"#00D4FF",bg:"rgba(0,212,255,0.10)"},{key:"firebase",icon:zl,label:s.connectFirebase,color:"#FF6D00",bg:"rgba(255,109,0,0.10)"}],[i,l]=y.useState({zip:{done:!1,completedAt:null},github:{done:!1,completedAt:null},deploy:{done:!1,completedAt:null},firebase:{done:!1,completedAt:null}}),[c,d]=y.useState(null),[u,m]=y.useState(Gv),[f,b]=y.useState(""),[w,x]=y.useState(null),[S,p]=y.useState(!1),h=Object.values(i).every(N=>N.done),g=async()=>{p(!0),x(null);const N=await $v(f);if(p(!1),N.valid){Kv(),m(!0),b("");return}x(Sd(n))},v=N=>{if(!u){x(Sd(n));return}if(N==="firebase"){Rm(n);return}d(N)},C=N=>{const k=new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit"});l(j=>({...j,[N]:{done:!0,completedAt:k}}))},E=Ql(e.business.name,e.metadata.projectId.slice(0,12)),_=`https://github.com/demo/${E}`,A=`https://${E}-demo.netlify.app`;return a.jsxs("div",{className:"space-y-4",children:[h&&a.jsxs("div",{className:"flex items-center gap-3 px-4 py-3 rounded-xl border border-green-200 bg-green-50 animate-fade-in",children:[a.jsx(ct,{className:"w-5 h-5 text-green-500 shrink-0"}),a.jsxs("div",{children:[a.jsx("p",{className:"text-sm font-bold text-green-700",children:s.allDoneTitle}),a.jsx("p",{className:"text-xs text-green-600",children:s.allDoneSub})]}),a.jsx(pr,{className:"w-4 h-4 text-green-400 ml-auto"})]}),a.jsxs("div",{className:`rounded-xl border p-4 space-y-3 ${u?"border-green-200 bg-green-50":"border-factory-border bg-white"}`,children:[a.jsxs("div",{className:"flex items-center gap-2",children:[u?a.jsx(ct,{className:"w-4 h-4 text-green-500 shrink-0"}):a.jsx(_a,{className:"w-4 h-4 text-primary shrink-0"}),a.jsx("p",{className:"text-sm font-bold text-slate-800",children:u?s.promo.unlockedTitle:s.promo.title})]}),!u&&a.jsxs(a.Fragment,{children:[a.jsx("p",{className:"text-xs text-slate-500",children:s.promo.subtitle}),a.jsxs("div",{className:"flex flex-col sm:flex-row gap-2",children:[a.jsx(Ae,{value:f,onChange:b,placeholder:s.promo.placeholder,error:!!w,className:"flex-1"}),a.jsx("button",{type:"button",onClick:g,disabled:S||!f.trim(),className:"px-5 py-3 rounded-xl text-sm font-bold text-white bg-brand hover:opacity-90 disabled:opacity-60 transition-all shrink-0",children:S?s.promo.checking:s.promo.apply})]}),w&&a.jsx("p",{className:"text-xs text-red-600",children:w})]}),u&&a.jsx("p",{className:"text-xs text-green-700",children:s.promo.unlockedSub})]}),a.jsx("div",{className:`grid grid-cols-2 gap-3 ${u?"":"opacity-50 pointer-events-none"}`,children:o.map(N=>{const k=i[N.key];return a.jsxs("button",{onClick:()=>v(N.key),className:`relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all hover:-translate-y-0.5 ${k.done?"border-green-200 bg-green-50 hover:bg-green-100":"border-factory-border bg-factory-bg hover:border-slate-300 hover:bg-white"}`,children:[a.jsx("div",{className:"w-8 h-8 rounded-lg flex items-center justify-center shrink-0",style:{background:k.done?"rgba(34,197,94,0.12)":N.bg},children:k.done?a.jsx(ct,{className:"w-4 h-4 text-green-500"}):a.jsx(N.icon,{className:"w-4 h-4",style:{color:N.color}})}),a.jsxs("div",{className:"flex-1 min-w-0",children:[a.jsx("p",{className:`text-xs font-semibold truncate ${k.done?"text-green-700":"text-slate-700"}`,children:N.label}),k.done?a.jsxs("p",{className:"text-[10px] text-green-500",children:["✓ ",s.completed," · ",k.completedAt]}):a.jsx("p",{className:"text-[10px] text-slate-400",children:s.clickToRun})]})]},N.key)})}),c==="zip"&&a.jsx(Yv,{manifest:e,sequences:r,onDone:()=>{C("zip"),d(null)},onClose:()=>d(null)}),c==="github"&&a.jsx(Nd,{action:"github",sequences:r,repoUrl:_,onDone:()=>{C("github"),d(null)},onClose:()=>d(null),actionLabels:{zip:s.downloadZip,github:s.pushGithub,deploy:s.deployHosting,firebase:s.connectFirebase},resultLabels:{repositoryUrl:s.repositoryUrl,liveDemoUrl:s.liveDemoUrl,firebaseConnected:s.firebaseConnected,configReady:s.configReady,openRepository:s.openRepository,openWebsite:s.openWebsite,done:s.done}}),c==="deploy"&&a.jsx(Nd,{action:"deploy",sequences:r,siteUrl:A,onDone:()=>{C("deploy"),d(null)},onClose:()=>d(null),actionLabels:{zip:s.downloadZip,github:s.pushGithub,deploy:s.deployHosting,firebase:s.connectFirebase},resultLabels:{repositoryUrl:s.repositoryUrl,liveDemoUrl:s.liveDemoUrl,firebaseConnected:s.firebaseConnected,configReady:s.configReady,openRepository:s.openRepository,openWebsite:s.openWebsite,done:s.done}})]})}function Yv({manifest:e,sequences:t,onDone:n,onClose:s}){const{t:r}=se(),o=r.delivery,[i,l]=y.useState(0),[c,d]=y.useState(!1),u=y.useRef(null),m=t.zip;y.useEffect(()=>{let b=0;const w=()=>{if(b>=m.length-1){u.current=Lv(e),d(!0);return}const S=m[b].duration;b++,l(b),setTimeout(w,S)},x=setTimeout(w,m[0].duration);return()=>clearTimeout(x)},[]);const f=()=>{if(!u.current)return;const b=URL.createObjectURL(u.current),w=document.createElement("a"),x=Ql(e.business.name,e.metadata.projectId.slice(0,12));w.href=b,w.download=`${x}-factory-website-crm.zip`,w.click(),URL.revokeObjectURL(b),n()};return a.jsxs(_m,{title:o.downloadZip,icon:a.jsx(_a,{className:"w-4 h-4 text-[#6C3BFF]"}),onClose:s,children:[a.jsx(Mm,{seq:m,stepIndex:i,ready:c,color:"#6C3BFF"}),c&&a.jsxs("button",{onClick:f,className:"w-full mt-4 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90",style:{background:"linear-gradient(135deg, #6C3BFF, #00D4FF)"},children:[a.jsx(um,{className:"w-4 h-4"}),o.downloadProject]})]})}function Nd({action:e,sequences:t,repoUrl:n,siteUrl:s,onDone:r,onClose:o,actionLabels:i,resultLabels:l}){const[c,d]=y.useState(0),[u,m]=y.useState(!1),f=t[e],w={zip:{icon:_a,color:"#6C3BFF"},github:{icon:pm,color:"#111827"},deploy:{icon:as,color:"#00D4FF"},firebase:{icon:zl,color:"#FF6D00"}}[e],x=i[e];return y.useEffect(()=>{let S=0;const p=()=>{if(S>=f.length-1){m(!0);return}const g=f[S].duration;S++,d(S),setTimeout(p,g)},h=setTimeout(p,f[0].duration);return()=>clearTimeout(h)},[]),a.jsxs(_m,{title:x,icon:a.jsx(w.icon,{className:"w-4 h-4",style:{color:w.color}}),onClose:o,children:[a.jsx(Mm,{seq:f,stepIndex:c,ready:u,color:w.color}),u&&a.jsxs("div",{className:"mt-4 space-y-3",children:[e==="github"&&n&&a.jsx(Io,{label:l.repositoryUrl,value:n,color:w.color,children:a.jsxs("a",{href:n,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90",style:{background:"#111827"},onClick:r,children:[a.jsx(fd,{className:"w-3.5 h-3.5"})," ",l.openRepository]})}),e==="deploy"&&s&&a.jsx(Io,{label:l.liveDemoUrl,value:s,color:w.color,children:a.jsxs("a",{href:s,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90",style:{background:"linear-gradient(135deg, #00D4FF88, #00D4FF)"},onClick:r,children:[a.jsx(fd,{className:"w-3.5 h-3.5"})," ",l.openWebsite]})}),e==="firebase"&&a.jsx(Io,{label:l.firebaseConnected,value:l.configReady,color:w.color,children:a.jsxs("button",{onClick:r,className:"inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90",style:{background:"#FF6D00"},children:[a.jsx(ct,{className:"w-3.5 h-3.5"})," ",l.done]})}),e==="github"&&!n&&a.jsx("button",{onClick:r,className:"w-full mt-2 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:opacity-90 transition-all",children:l.done})]})]})}function Mm({seq:e,stepIndex:t,ready:n,color:s}){return a.jsx("div",{className:"space-y-2",children:e.map((r,o)=>{const i=o<t,l=o===t&&!n,c=o===e.length-1,d=n&&c;return a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:"w-5 h-5 flex items-center justify-center shrink-0",children:d||i?a.jsx(ct,{className:"w-4 h-4 text-green-500"}):l?a.jsx(r0,{className:"w-4 h-4 animate-spin",style:{color:s}}):a.jsx("div",{className:"w-3 h-3 rounded-full border-2 border-slate-200"})}),a.jsx("span",{className:`text-sm ${d||i?"text-slate-700 font-medium":l?"font-semibold text-slate-800":"text-slate-400"}`,children:r.label})]},r.label)})})}function Io({label:e,value:t,color:n,children:s}){return a.jsxs("div",{className:"rounded-xl border border-slate-100 p-4 space-y-3",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1",children:e}),a.jsx("p",{className:"text-sm font-mono font-semibold truncate",style:{color:n},children:t})]}),s]})}const Jv={whatsapp:qe,email:Rt,sms:m0,internal:ct};function Qv(){const e=Sn(),{state:t,reset:n}=os(),{t:s}=se(),r=s.manifest,[o,i]=y.useState(!1);if(!t.manifest)return e("/"),null;const l=t.manifest,c=eo(l.website.themeKey),d=[{icon:o0,color:"#00D4FF",bg:"rgba(0,212,255,0.12)",title:r.nextItems.website.title,desc:r.nextItems.website.desc,badge:r.nextItems.website.badge,route:"/website-demo",active:!0},{icon:jt,color:"#00C853",bg:"rgba(0,200,83,0.12)",title:r.nextItems.crm.title,desc:r.nextItems.crm.desc,badge:r.nextItems.crm.badge,route:"/crm-demo",active:!0},{icon:g0,color:"#FFB300",bg:"rgba(255,179,0,0.12)",title:r.nextItems.delivery.title,desc:r.nextItems.delivery.desc,badge:r.nextItems.delivery.badge,route:null,scrollTo:"delivery-actions",active:!0},{icon:Yb,color:"#6C3BFF",bg:"rgba(108,59,255,0.12)",title:r.nextItems.sdk.title,desc:r.nextItems.sdk.desc,badge:r.nextItems.sdk.badge,route:"/studio",active:!0}];return a.jsxs("div",{className:"min-h-screen bg-factory-bg",children:[a.jsx("header",{className:"sticky top-0 z-50 bg-factory-dark/95 backdrop-blur-md border-b border-white/5",children:a.jsxs("div",{className:"max-w-6xl mx-auto px-6 h-16 flex items-center justify-between",children:[a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:"w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-glow-sm",children:a.jsx(pr,{className:"w-4 h-4 text-white"})}),a.jsx("span",{className:"text-white font-bold text-lg tracking-tight",children:"Factory Website+CRM"}),a.jsx("span",{className:"mx-2 text-white/10",children:"·"}),a.jsx("span",{className:"text-white/40 text-sm",children:r.title})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(Yl,{}),a.jsxs("button",{onClick:()=>{n(),e("/")},className:"flex items-center gap-2 px-4 py-2 rounded-xl glass text-white/60 hover:text-white text-sm font-medium transition-all hover:bg-white/10",children:[a.jsx(ql,{className:"w-4 h-4"})," ",r.newProject]})]})]})}),a.jsx("div",{className:"bg-dark-surface",children:a.jsx("div",{className:"max-w-6xl mx-auto px-6 py-10",children:a.jsxs("div",{className:"flex items-start justify-between flex-wrap gap-6",children:[a.jsxs("div",{className:"animate-fade-up",children:[a.jsxs("div",{className:"inline-flex items-center gap-2 bg-green-500/15 border border-green-500/25 rounded-full px-3 py-1.5 text-xs text-green-400 font-semibold mb-4",children:[a.jsx(ct,{className:"w-3.5 h-3.5"})," ",r.generatedBadge]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-bold text-white mb-2",children:l.business.name}),a.jsxs("div",{className:"flex flex-wrap items-center gap-3 text-sm text-white/40",children:[a.jsx("span",{children:l.business.city}),a.jsx("span",{className:"text-white/15",children:"·"}),a.jsx("span",{className:"capitalize",children:l.business.sector.replace(/_/g," ")}),a.jsx("span",{className:"text-white/15",children:"·"}),a.jsx("span",{children:l.business.language.toUpperCase()}),a.jsx("span",{className:"text-white/15",children:"·"}),a.jsxs("span",{className:"font-mono text-xs bg-white/8 px-2 py-0.5 rounded-full",children:["schema v",l.schemaVersion]})]})]}),a.jsxs("div",{className:"glass rounded-2xl px-5 py-4 text-right animate-fade-in",children:[a.jsx("p",{className:"text-xs text-white/35 mb-0.5",children:r.generated}),a.jsx("p",{className:"font-mono text-xs text-white/60",children:new Date(l.generatedAt).toLocaleString()}),a.jsxs("div",{className:"flex items-center gap-1.5 justify-end mt-2",children:[a.jsx(Hb,{className:"w-3 h-3 text-accent animate-pulse-soft"}),a.jsxs("span",{className:"text-[11px] text-accent font-medium",children:["Engine v",l.metadata.engineVersion]})]})]})]})})}),a.jsxs("main",{className:"max-w-6xl mx-auto px-6 py-10",children:[a.jsxs("div",{className:"grid md:grid-cols-2 gap-5 mb-6",children:[a.jsxs("div",{className:"rounded-3xl p-6 text-white overflow-hidden relative col-span-full animate-fade-up",style:{background:"linear-gradient(135deg, #111827 0%, #1e0f47 60%, #0f1a2e 100%)"},children:[a.jsx("div",{className:"absolute inset-0 opacity-30",style:{background:"radial-gradient(ellipse at 80% 20%, rgba(108,59,255,0.3) 0%, transparent 60%)"}}),a.jsxs("div",{className:"relative",children:[a.jsxs("div",{className:"flex items-center gap-2 mb-5",children:[a.jsx("div",{className:"w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center",children:a.jsx(n0,{className:"w-4 h-4 text-white/70"})}),a.jsx("h3",{className:"font-bold text-white/90",children:r.metadata}),a.jsxs("span",{className:"ml-auto text-xs font-mono text-white/30 bg-white/5 px-2 py-1 rounded-lg",children:["manifest v",l.metadata.manifestVersion]})]}),a.jsxs("div",{className:"grid sm:grid-cols-3 gap-4",children:[a.jsx(Fo,{label:r.projectId,value:l.metadata.projectId}),a.jsx(Fo,{label:r.studioId,value:l.metadata.studioId}),a.jsx(Fo,{label:r.clientId,value:l.metadata.clientId})]}),a.jsxs("div",{className:"grid sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/8",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] text-white/35 uppercase tracking-wider mb-1",children:r.schema}),a.jsxs("p",{className:"text-sm font-semibold text-white/80",children:["v",l.schemaVersion]})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] text-white/35 uppercase tracking-wider mb-1",children:r.created}),a.jsx("p",{className:"text-xs font-mono text-white/60",children:new Date(l.metadata.createdAt).toLocaleString()})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] text-white/35 uppercase tracking-wider mb-1",children:r.updated}),a.jsx("p",{className:"text-xs font-mono text-white/60",children:new Date(l.metadata.updatedAt).toLocaleString()})]})]})]})]}),a.jsxs(at,{icon:a.jsx(as,{className:"w-4 h-4"}),iconColor:"#00D4FF",title:r.businessInfo,children:[a.jsx(st,{label:r.rowLabels.name,value:l.business.name}),a.jsx(st,{label:r.rowLabels.city,value:l.business.city}),a.jsx(st,{label:r.rowLabels.language,value:l.business.language.toUpperCase()}),a.jsx(st,{label:r.rowLabels.phone,value:l.business.phone}),l.business.whatsapp&&a.jsx(st,{label:r.rowLabels.whatsapp,value:l.business.whatsapp}),a.jsx(st,{label:r.rowLabels.email,value:l.business.email})]}),a.jsxs(at,{icon:a.jsx(p0,{className:"w-4 h-4"}),iconColor:"#6C3BFF",title:r.ownership,children:[a.jsx(st,{label:r.rowLabels.studio,value:l.ownership.studioBrand}),a.jsx(st,{label:r.rowLabels.client,value:l.ownership.clientBrand}),a.jsx(st,{label:r.rowLabels.mode,value:l.ownership.ownershipMode.replace(/_/g," "),capitalize:!0}),l.ownership.studioEmail&&a.jsx(st,{label:r.rowLabels.studioEmail,value:l.ownership.studioEmail})]}),a.jsxs(at,{icon:a.jsx(s0,{className:"w-4 h-4"}),iconColor:"#8B5CFF",title:r.websiteSections,children:[a.jsxs("p",{className:"text-xs text-slate-400 mb-3",children:[r.theme,": ",a.jsx("span",{className:"font-semibold text-slate-700",children:c.label})]}),a.jsx("div",{className:"flex flex-wrap gap-1.5",children:l.website.sections.map(u=>{const m=gm(u);return a.jsx("span",{className:"text-xs bg-primary/8 text-primary border border-primary/15 px-2.5 py-1 rounded-full font-medium",children:m.label.en},u)})})]}),a.jsxs(at,{icon:a.jsx(jt,{className:"w-4 h-4"}),iconColor:"#00C853",title:r.crmModules,children:[a.jsxs("p",{className:"text-xs text-slate-400 mb-3",children:[r.booking,": ",a.jsx("span",{className:"font-semibold text-slate-700",children:l.crm.bookingModule.replace(/_/g," ")})]}),a.jsx("div",{className:"flex flex-wrap gap-1.5",children:l.crm.modules.map(u=>{const m=bm(u);return a.jsx("span",{className:"text-xs bg-[#00C853]/10 text-[#008a39] border border-[#00C853]/20 px-2.5 py-1 rounded-full font-medium",children:m.label.en},u)})})]}),a.jsx(at,{icon:a.jsx(Ue,{className:"w-4 h-4"}),iconColor:"#FFB300",title:r.reviewFlow,fullWidth:!0,children:a.jsx("div",{className:"flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap",children:l.crm.reviewFlow.steps.map((u,m)=>{const f=Jv[u.channel]??Xa,b=m===l.crm.reviewFlow.steps.length-1,w=r.stepLabels[u.stepKey]??u.stepKey;return a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsxs("div",{className:`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${u.enabled?"bg-amber-50 border-amber-200 text-amber-800":"bg-slate-50 border-slate-100 text-slate-400 opacity-50"}`,children:[a.jsx("div",{className:"flex items-center justify-center w-4 h-4 rounded-full bg-amber-200 text-amber-800 text-[9px] font-bold shrink-0",children:m+1}),a.jsx(f,{className:"w-3 h-3 shrink-0"}),a.jsx("span",{className:"text-xs font-medium whitespace-nowrap",children:w}),u.delayHours>0&&a.jsxs("span",{className:"text-[10px] opacity-60",children:["+",u.delayHours,"h"]})]}),!b&&a.jsx(Ma,{className:"w-3.5 h-3.5 text-slate-300 sm:rotate-[-90deg] shrink-0"})]},u.stepKey)})})}),a.jsx("div",{id:"delivery-actions",children:a.jsx(at,{icon:a.jsx(i0,{className:"w-4 h-4"}),iconColor:"#FF5C5C",title:r.deliveryActions,children:a.jsx(Vv,{manifest:l})})})]}),a.jsxs("div",{className:"mb-12",children:[a.jsxs("button",{onClick:()=>i(u=>!u),className:"flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-factory-border bg-white text-sm font-medium text-slate-500 hover:text-primary hover:border-primary/30 transition-all",children:[o?a.jsx(dm,{className:"w-4 h-4"}):a.jsx(Ma,{className:"w-4 h-4"}),o?r.hideJson:r.showJson]}),o&&a.jsxs("div",{className:"mt-3 rounded-2xl overflow-hidden border border-white/5 shadow-card-xl animate-fade-in",children:[a.jsxs("div",{className:"flex items-center gap-2 px-5 py-3 bg-factory-dark border-b border-white/5",children:[a.jsxs("div",{className:"flex gap-1.5",children:[a.jsx("span",{className:"w-3 h-3 rounded-full bg-red-500/70"}),a.jsx("span",{className:"w-3 h-3 rounded-full bg-amber-400/70"}),a.jsx("span",{className:"w-3 h-3 rounded-full bg-green-500/70"})]}),a.jsx("span",{className:"text-xs text-white/30 font-mono ml-2",children:"manifest.json"})]}),a.jsx("pre",{className:"p-5 bg-[#0d1117] text-green-400 text-xs overflow-x-auto leading-relaxed",children:JSON.stringify(l,null,2)})]})]}),a.jsxs("div",{className:"pb-12",children:[a.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[a.jsx("h2",{className:"text-sm font-bold text-slate-700 uppercase tracking-widest",children:r.nextSteps}),a.jsx("div",{className:"flex-1 h-px bg-factory-border"})]}),a.jsx("div",{className:"grid sm:grid-cols-2 lg:grid-cols-4 gap-4",children:d.map((u,m)=>a.jsxs("div",{style:{animationDelay:`${m*80}ms`},className:`animate-fade-up bg-white rounded-2xl border border-factory-border p-5 flex flex-col gap-4 shadow-card ${u.active?"cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all":"opacity-55 pointer-events-none select-none"}`,children:[a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:"w-9 h-9 rounded-xl flex items-center justify-center shrink-0",style:{background:u.bg},children:a.jsx(u.icon,{className:"w-4.5 h-4.5",style:{color:u.color,width:18,height:18}})}),a.jsx("h3",{className:"text-sm font-bold text-factory-dark",children:u.title})]}),a.jsx("p",{className:"text-xs text-slate-500 leading-relaxed flex-1",children:u.desc}),a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] text-slate-400 mb-2 truncate",children:u.badge}),u.active&&u.route?a.jsxs("button",{onClick:()=>e(u.route),className:"w-full py-2.5 rounded-xl text-center text-xs font-bold text-white transition-all hover:opacity-90",style:{background:`linear-gradient(135deg, ${u.color}cc, ${u.color})`},children:[r.openButton," ",u.title]}):u.active&&"scrollTo"in u?a.jsx("button",{onClick:()=>{var f;return(f=document.getElementById(u.scrollTo))==null?void 0:f.scrollIntoView({behavior:"smooth",block:"start"})},className:"w-full py-2.5 rounded-xl text-center text-xs font-bold text-white transition-all hover:opacity-90",style:{background:`linear-gradient(135deg, ${u.color}cc, ${u.color})`},children:r.openDelivery}):a.jsx("div",{className:"w-full py-2.5 rounded-xl bg-factory-bg border border-factory-border text-center text-xs font-semibold text-slate-400",children:r.comingNext})]})]},u.title))})]})]})]})}function st({label:e,value:t,capitalize:n}){return a.jsxs("div",{className:"flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0",children:[a.jsx("span",{className:"text-xs text-slate-400 shrink-0",children:e}),a.jsx("span",{className:`text-xs font-semibold text-slate-800 text-right ml-4 ${n?"capitalize":""}`,children:t})]})}function Fo({label:e,value:t}){return a.jsxs("div",{className:"bg-white/5 rounded-xl p-3 border border-white/8",children:[a.jsx("p",{className:"text-[10px] text-white/35 uppercase tracking-widest mb-1.5",children:e}),a.jsx("p",{className:"font-mono text-xs text-accent/80 truncate",children:t})]})}const Tm={restaurant:"restaurant",hotel:"hotel",beauty_salon:"beauty",dental_clinic:"dental",fitness:"fitness",fitness_club:"fitness",barber:"barber",massage:"massage",cleaning:"cleaning",auto_service:"auto",car_service:"auto",workshop:"auto",education:"education",real_estate:"real_estate",construction:"construction",accounting:"office",law_firm:"office"};function mt(e,t){return`/assets/niches/${Tm[e]??"office"}/${t}`}function Zv(e){const t=String(e.business.sector),n=Tm[t];if(n){const s={key:`image_library_${n}`,hero:mt(t,"hero.jpg"),about:mt(t,"about.jpg"),gallery:[mt(t,"gallery-1.jpg"),mt(t,"gallery-2.jpg"),mt(t,"gallery-3.jpg"),mt(t,"gallery-4.jpg")],services:[mt(t,"service-1.jpg"),mt(t,"service-2.jpg"),mt(t,"service-3.jpg")]};if(typeof window<"u"&&window.__FACTORY_BOOTSTRAP__)return s}try{return Cm(e)}catch{return Fs("pexels_office")}}const Xv=/^#[0-9A-Fa-f]{6}$/;function ew(e){return Math.max(0,Math.min(255,Math.round(e)))}function Am(e){const t=e.replace("#","");return[parseInt(t.slice(0,2),16),parseInt(t.slice(2,4),16),parseInt(t.slice(4,6),16)]}function Pm(e,t,n){return`#${[e,t,n].map(s=>ew(s).toString(16).padStart(2,"0")).join("")}`}function tw(e,t){const[n,s,r]=Am(e);return Pm(n+(255-n)*t,s+(255-s)*t,r+(255-r)*t)}function Cd(e,t){const[n,s,r]=Am(e),o=1-t;return Pm(n*o,s*o,r*o)}function nw(e,t){const n=t==null?void 0:t.primaryColorHex;if(!n||!Xv.test(n))return e;const s=e.colors.primary;return{...e,colors:{...e.colors,primary:{...s,500:n,600:Cd(n,.12),700:Cd(n,.24),100:tw(n,.88)}}}}function Dm(e){const t=eo(e.website.themeKey),n=nw(t,e.branding);return sw(n)}function sw(e){const t=["#0f172a","#18181b","#1e1b4b"].includes(e.websiteBackground.toLowerCase()),n=e.colors.primary,s=e.colors.neutral;return{bg:e.websiteBackground,bgAlt:t?s[800]:s[50],cardBg:t?s[800]:"#ffffff",cardBorder:t?s[700]:s[200],fg:e.websiteForeground,fgMuted:t?s[400]:s[500],primary:n[600],primaryHover:n[700],primaryLight:n[100],primaryFg:"#ffffff",radius:e.borderRadius||"0.5rem",font:e.fontFamily,isDark:t}}function rw({manifest:e,palette:t,content:n}){const{images:s}=arguments[0],{t:r}=se(),o=is(e),i=ls(e);return a.jsxs("section",{id:"hero",className:"relative min-h-screen flex items-center justify-center overflow-hidden",children:[a.jsxs("div",{className:"absolute inset-0",children:[a.jsx("img",{src:s.hero,alt:o,className:"w-full h-full object-cover"}),a.jsx("div",{className:"absolute inset-0",style:{background:t.isDark?"linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.8) 100%)":"linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.7) 100%)"}})]}),a.jsxs("div",{className:"relative max-w-5xl mx-auto px-6 text-center text-white",children:[a.jsx("p",{className:"text-sm font-semibold uppercase tracking-[0.25em] mb-4 opacity-80",style:{fontFamily:t.font},children:e.business.city}),a.jsx("h1",{className:"text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6",style:{fontFamily:t.font},children:o}),a.jsx("p",{className:"text-xl sm:text-2xl opacity-85 max-w-2xl mx-auto mb-10 leading-relaxed",style:{fontFamily:t.font},children:n.tagline}),a.jsx("p",{className:"text-base opacity-65 max-w-xl mx-auto mb-10",style:{fontFamily:t.font},children:n.subTagline}),a.jsxs("div",{className:"flex flex-wrap items-center justify-center gap-4",children:[a.jsxs("a",{href:"#booking",className:"inline-flex items-center gap-2 px-8 py-4 font-bold text-white rounded-lg transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg",style:{backgroundColor:t.primary,borderRadius:t.radius,fontFamily:t.font},children:[a.jsx(_t,{className:"w-5 h-5"}),n.cta]}),i&&a.jsxs("a",{href:`tel:${i}`,className:"inline-flex items-center gap-2 px-8 py-4 font-semibold border-2 border-white/60 text-white rounded-lg transition-all hover:bg-white/15 hover:-translate-y-0.5",style:{borderRadius:t.radius,fontFamily:t.font},children:[a.jsx(Vt,{className:"w-5 h-5"}),r.websiteDemo.call]})]}),a.jsx("div",{className:"absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50",children:a.jsx("div",{className:"w-6 h-10 rounded-full border-2 border-white/60 flex items-start justify-center pt-2",children:a.jsx("div",{className:"w-1.5 h-2.5 bg-white rounded-full"})})})]})]})}function aw({manifest:e,palette:t,content:n,images:s}){const{t:r}=se(),o=r.sections.about,i=ls(e),l=no(e);return a.jsx("section",{id:"about",className:"py-24",style:{backgroundColor:t.bgAlt,color:t.fg,fontFamily:t.font},children:a.jsx("div",{className:"max-w-6xl mx-auto px-6",children:a.jsxs("div",{className:"grid md:grid-cols-2 gap-12 lg:gap-20 items-center",children:[a.jsxs("div",{className:"relative",children:[a.jsx("img",{src:s.about,alt:o.label,className:"w-full h-80 md:h-[480px] object-cover shadow-2xl",style:{borderRadius:t.radius}}),a.jsxs("div",{className:"absolute -bottom-6 -right-6 hidden md:flex flex-col items-center justify-center w-28 h-28 shadow-xl",style:{backgroundColor:t.primary,borderRadius:t.radius,color:t.primaryFg},children:[a.jsx("span",{className:"text-3xl font-bold",children:"15+"}),a.jsx("span",{className:"text-xs text-center leading-tight opacity-90 mt-1",children:o.yearsLabel})]})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-sm font-bold uppercase tracking-[0.2em] mb-3",style:{color:t.primary},children:o.label}),a.jsx("h2",{className:"text-3xl sm:text-4xl font-bold leading-tight mb-6",style:{fontFamily:t.font},children:n.aboutTitle}),a.jsx("p",{className:"text-base leading-relaxed mb-6",style:{color:t.fgMuted},children:n.aboutText}),a.jsx("div",{className:"grid grid-cols-3 gap-4 mb-8",children:[{n:"500+",l:o.stats.clients},{n:"15+",l:o.stats.experience},{n:"100%",l:o.stats.satisfaction}].map(c=>a.jsxs("div",{className:"text-center",children:[a.jsx("p",{className:"text-2xl font-bold",style:{color:t.primary},children:c.n}),a.jsx("p",{className:"text-xs mt-1",style:{color:t.fgMuted},children:c.l})]},c.l))}),a.jsxs("div",{className:"flex flex-wrap gap-3",children:[i&&a.jsxs("a",{href:`tel:${i}`,className:"inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-80",style:{backgroundColor:t.primary,color:t.primaryFg,borderRadius:t.radius},children:[a.jsx(Vt,{className:"w-4 h-4"})," ",i]}),l&&a.jsxs("a",{href:`https://wa.me/${l.replace(/\D/g,"")}`,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border transition-all hover:opacity-80",style:{borderColor:t.cardBorder,color:t.fg,borderRadius:t.radius},children:[a.jsx(qe,{className:"w-4 h-4 text-green-500"})," ",o.whatsapp]})]})]})]})})})}function ow({manifest:e,palette:t}){const{t:n}=se(),s=n.sections.maps,r=is(e);return a.jsx("section",{id:"google_maps",className:"py-20",style:{backgroundColor:t.bg,color:t.fg,fontFamily:t.font},children:a.jsxs("div",{className:"max-w-6xl mx-auto px-6",children:[a.jsxs("div",{className:"text-center mb-10",children:[a.jsx("p",{className:"text-sm font-bold uppercase tracking-[0.2em] mb-3",style:{color:t.primary},children:s.eyebrow}),a.jsxs("h2",{className:"text-3xl font-bold",children:[s.title," ",e.business.city]})]}),a.jsxs("div",{className:"w-full h-64 md:h-80 flex flex-col items-center justify-center gap-4 border-2 border-dashed",style:{backgroundColor:t.bgAlt,borderColor:t.cardBorder,borderRadius:t.radius},children:[a.jsx(vn,{className:"w-10 h-10",style:{color:t.primary}}),a.jsxs("div",{className:"text-center",children:[a.jsx("p",{className:"font-semibold",children:r}),a.jsx("p",{className:"text-sm",style:{color:t.fgMuted},children:e.business.city})]}),a.jsxs("a",{href:`https://maps.google.com?q=${encodeURIComponent(r+" "+e.business.city)}`,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold transition-all hover:opacity-80",style:{backgroundColor:t.primary,color:t.primaryFg,borderRadius:t.radius},children:[a.jsx(vn,{className:"w-4 h-4"})," ",s.openMaps]})]})]})})}function iw({manifest:e,palette:t}){const{t:n}=se(),s=n.sections.whatsapp,r=no(e);return r?a.jsx("section",{id:"whatsapp",className:"py-16",style:{backgroundColor:t.bgAlt,fontFamily:t.font},children:a.jsxs("div",{className:"max-w-xl mx-auto px-6 text-center",children:[a.jsx(qe,{className:"w-12 h-12 mx-auto mb-4 text-green-500"}),a.jsx("h2",{className:"text-2xl font-bold mb-3",style:{color:t.fg},children:s.title}),a.jsx("p",{className:"mb-6 text-sm",style:{color:t.fgMuted},children:s.subtitle}),a.jsxs("a",{href:`https://wa.me/${r.replace(/\D/g,"")}`,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-2 px-8 py-3 text-white font-bold rounded-lg bg-green-500 hover:bg-green-600 transition-colors",style:{borderRadius:t.radius},children:[a.jsx(qe,{className:"w-5 h-5"})," ",s.button]})]})}):null}function lw({manifest:e,palette:t}){const{t:n}=se(),s=n.sections.email,r=Jl(e);return a.jsx("section",{id:"email_section",className:"py-16",style:{backgroundColor:t.bg,fontFamily:t.font},children:a.jsxs("div",{className:"max-w-xl mx-auto px-6 text-center",children:[a.jsx(Rt,{className:"w-12 h-12 mx-auto mb-4",style:{color:t.primary}}),a.jsx("h2",{className:"text-2xl font-bold mb-3",style:{color:t.fg},children:s.title}),a.jsx("p",{className:"mb-6 text-sm",style:{color:t.fgMuted},children:s.subtitle}),a.jsxs("a",{href:`mailto:${r}`,className:"inline-flex items-center gap-2 px-8 py-3 text-white font-bold transition-all hover:opacity-90",style:{backgroundColor:t.primary,borderRadius:t.radius},children:[a.jsx(Rt,{className:"w-5 h-5"})," ",r]})]})})}function cw({service:e,imageUrl:t,palette:n,bookLabel:s}){return a.jsxs("div",{className:"group overflow-hidden transition-all duration-300 hover:-translate-y-1",style:{backgroundColor:n.cardBg,border:`1px solid ${n.cardBorder}`,borderRadius:n.radius,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"},children:[t&&a.jsx("div",{className:"h-48 overflow-hidden",children:a.jsx("img",{src:t,alt:e.name,className:"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"})}),a.jsxs("div",{className:"p-6",children:[a.jsx("h3",{className:"text-lg font-bold mb-2",style:{fontFamily:n.font},children:e.name}),a.jsx("p",{className:"text-sm leading-relaxed mb-4",style:{color:n.fgMuted},children:e.desc}),a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{className:"font-bold text-sm",style:{color:n.primary},children:e.price}),a.jsx("a",{href:"#booking",className:"text-xs font-semibold px-3 py-1.5 transition-all hover:opacity-80",style:{backgroundColor:n.primaryLight,color:n.primary,borderRadius:n.radius},children:s})]})]})]})}function mr({eyebrow:e,title:t,palette:n,spacing:s="normal",children:r}){return a.jsxs("div",{className:`text-center ${s==="tight"?"mb-10":"mb-14"}`,children:[a.jsx("p",{className:"text-sm font-bold uppercase tracking-[0.2em] mb-3",style:{color:n.primary},children:e}),a.jsx("h2",{className:"text-3xl sm:text-4xl font-bold",children:t}),r]})}function dw({palette:e,content:t,images:n}){const{t:s}=se(),r=s.sections.services;return a.jsx("section",{id:"services",className:"py-24",style:{backgroundColor:e.bg,color:e.fg,fontFamily:e.font},children:a.jsxs("div",{className:"max-w-6xl mx-auto px-6",children:[a.jsx(mr,{eyebrow:r.eyebrow,title:r.title,palette:e}),a.jsx("div",{className:"grid sm:grid-cols-2 lg:grid-cols-3 gap-6",children:t.services.map((o,i)=>a.jsx(cw,{service:o,imageUrl:n.services[i],palette:e,bookLabel:r.bookNow},o.name))})]})})}function uw({palette:e,images:t}){const{t:n}=se(),s=n.sections.gallery,r=[...t.gallery];return a.jsx("section",{id:"gallery",className:"py-24",style:{backgroundColor:e.bgAlt,color:e.fg,fontFamily:e.font},children:a.jsxs("div",{className:"max-w-6xl mx-auto px-6",children:[a.jsx(mr,{eyebrow:s.eyebrow,title:s.title,palette:e}),a.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3",children:r.map((o,i)=>a.jsx("div",{className:`overflow-hidden group ${i===0?"row-span-2 col-span-2":""}`,style:{borderRadius:e.radius},children:a.jsx("img",{src:o,alt:`Gallery ${i+1}`,className:"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",style:{minHeight:i===0?"300px":"160px"}})},i))})]})})}function pw({palette:e,content:t}){const{t:n}=se(),s=n.sections.testimonials;return a.jsx("section",{id:"testimonials",className:"py-24",style:{backgroundColor:e.bg,color:e.fg,fontFamily:e.font},children:a.jsxs("div",{className:"max-w-6xl mx-auto px-6",children:[a.jsx(mr,{eyebrow:s.eyebrow,title:s.title,palette:e,children:a.jsxs("div",{className:"flex items-center justify-center gap-1 mt-4",children:[[1,2,3,4,5].map(r=>a.jsx(Ue,{className:"w-5 h-5 fill-current",style:{color:"#FFB300"}},r)),a.jsxs("span",{className:"ml-2 text-sm font-semibold",style:{color:e.fgMuted},children:["5.0 · ",s.rating]})]})}),a.jsx("div",{className:"grid sm:grid-cols-2 lg:grid-cols-3 gap-6",children:t.testimonials.map(r=>a.jsxs("div",{className:"p-6 relative",style:{backgroundColor:e.cardBg,border:`1px solid ${e.cardBorder}`,borderRadius:e.radius,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"},children:[a.jsx("div",{className:"text-5xl font-serif leading-none mb-3 opacity-25",style:{color:e.primary},children:'"'}),a.jsx("p",{className:"text-sm leading-relaxed mb-6 italic",style:{color:e.fgMuted},children:r.text}),a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsxs("div",{children:[a.jsx("p",{className:"font-bold text-sm",children:r.name}),a.jsx("p",{className:"text-xs",style:{color:e.fgMuted},children:r.role})]}),a.jsx("div",{className:"flex gap-0.5",children:Array.from({length:r.rating}).map((o,i)=>a.jsx(Ue,{className:"w-3.5 h-3.5 fill-current",style:{color:"#FFB300"}},i))})]})]},r.name))})]})})}function mw({icon:e,label:t,value:n,href:s,palette:r}){const o=s&&!s.startsWith("mailto:")&&!s.startsWith("tel:"),i=s?{href:s,...o?{target:"_blank",rel:"noopener noreferrer"}:{}}:void 0,l=a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"w-10 h-10 flex items-center justify-center shrink-0",style:{backgroundColor:r.primaryLight,borderRadius:r.radius},children:a.jsx(e,{className:"w-5 h-5",style:{color:r.primary}})}),a.jsxs("div",{className:"flex-1 min-w-0",children:[a.jsx("p",{className:"text-xs font-semibold uppercase tracking-wider mb-0.5",style:{color:r.fgMuted},children:t}),a.jsx("p",{className:"text-sm font-semibold truncate",style:{color:r.fg},children:n})]})]}),c={backgroundColor:r.cardBg,border:`1px solid ${r.cardBorder}`,borderRadius:r.radius,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"};return i?a.jsx("a",{...i,className:"flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5",style:c,children:l}):a.jsx("div",{className:"flex items-center gap-4 p-4",style:c,children:l})}function fw({manifest:e,palette:t,content:n}){var g;const[s,r]=y.useState(!1),{addBooking:o}=os(),{t:i}=se(),l=i.sections.booking,c=y.useRef(null),d=y.useRef(null),u=y.useRef(null),m=y.useRef(null),f=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),b=e.crm.reviewFlow.steps.find(v=>v.stepKey==="google_review_request"),w=e.crm.reviewFlow.steps.some(v=>v.channel==="whatsapp"&&v.enabled),x=e.crm.reviewFlow.steps.some(v=>v.channel==="email"&&v.enabled),S=((g=n.services[0])==null?void 0:g.name)??"Appointment",p=is(e),h=()=>{var A,N,k,j;const v=((A=c.current)==null?void 0:A.value.trim())||"Anonymous",C=((N=d.current)==null?void 0:N.value.trim())||"—",E=((k=u.current)==null?void 0:k.value)||f,_=((j=m.current)==null?void 0:j.value)||S;o({name:v,phone:C,date:E,service:_,status:"Confirmed"}),r(!0)};return a.jsxs("section",{id:"booking",className:"py-24 relative overflow-hidden",style:{fontFamily:t.font},children:[a.jsx("div",{className:"absolute inset-0",style:{backgroundColor:t.primary,opacity:.92}}),a.jsx("div",{className:"absolute inset-0 opacity-10",style:{backgroundImage:"radial-gradient(circle at 30% 50%, white 0%, transparent 60%)"}}),a.jsxs("div",{className:"relative max-w-3xl mx-auto px-6",children:[a.jsxs("div",{className:"text-center mb-10",children:[a.jsx("p",{className:"text-sm font-bold uppercase tracking-[0.2em] text-white/70 mb-3",children:l.eyebrow}),a.jsx("h2",{className:"text-3xl sm:text-4xl font-bold text-white",children:n.cta}),a.jsxs("p",{className:"text-white/70 mt-3 text-sm",children:[n.hours," · ",n.openDays]})]}),s?a.jsxs("div",{className:"space-y-4",children:[a.jsxs("div",{className:"text-center mb-6",children:[a.jsx("div",{className:"w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3",children:a.jsx(ct,{className:"w-7 h-7 text-white"})}),a.jsx("h3",{className:"text-xl font-bold text-white",children:l.confirmed}),a.jsx("p",{className:"text-white/60 text-sm mt-1",children:l.confirmedSub})]}),a.jsxs(Or,{icon:a.jsx(jt,{className:"w-4 h-4 text-[#00C853]"}),label:l.crmRecord,status:l.status.done,statusColor:"#00C853",children:[a.jsxs("p",{className:"text-[11px] text-white/60",children:[a.jsx("span",{className:"font-semibold text-white/80",children:"Alex Johnson"})," · ",S," · ",f," 15:30"]}),a.jsxs("p",{className:"text-[11px] text-white/40",children:["Source: Online Booking · Notification channels: ",e.crm.notificationChannels.join(", ")]})]}),w&&a.jsx(Or,{icon:a.jsx(qe,{className:"w-4 h-4 text-[#25D366]"}),label:l.whatsappSent,status:l.status.delivered,statusColor:"#25D366",children:a.jsxs("p",{className:"text-[11px] text-white/60 italic",children:['"Hi Alex! 👋 Your appointment at ',a.jsx("strong",{className:"text-white/80",children:p})," is confirmed for ",f," at 15:30. Service: ",S,'."']})}),x&&a.jsx(Or,{icon:a.jsx(Rt,{className:"w-4 h-4 text-[#00D4FF]"}),label:l.emailSent,status:l.status.deliveredEmail,statusColor:"#00D4FF",children:a.jsxs("p",{className:"text-[11px] text-white/60 italic",children:['"Booking Confirmed ✓ — ',p," · ",S," · ",f,'"']})}),(b==null?void 0:b.enabled)&&a.jsxs(Or,{icon:a.jsx(Ue,{className:"w-4 h-4 text-[#FFB300]"}),label:l.reviewScheduled,status:`+${b.delayHours}h`,statusColor:"#FFB300",children:[a.jsxs("p",{className:"text-[11px] text-white/60 italic",children:['"Hi Alex! ⭐ How was your experience at ',p,'? Leave us a Google Review →"']}),a.jsxs("p",{className:"text-[10px] text-white/30",children:["Sends automatically ",b.delayHours,"h after your visit via ",b.channel]})]}),a.jsx("button",{onClick:()=>r(!1),className:"w-full py-2.5 text-sm text-white/50 hover:text-white transition-colors text-center",children:l.submitAnother})]}):a.jsxs("div",{className:"p-8",style:{backgroundColor:"rgba(255,255,255,0.12)",borderRadius:t.radius},children:[a.jsxs("div",{className:"grid sm:grid-cols-2 gap-4 mb-4",children:[a.jsx("input",{ref:c,type:"text",placeholder:l.yourName,className:"w-full px-4 py-3 bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors",style:{borderRadius:"0.375rem"}}),a.jsx("input",{ref:d,type:"tel",placeholder:l.phoneNumber,className:"w-full px-4 py-3 bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors",style:{borderRadius:"0.375rem"}})]}),a.jsxs("div",{className:"grid sm:grid-cols-2 gap-4 mb-4",children:[a.jsx("input",{ref:u,type:"date",placeholder:l.preferredDate,className:"w-full px-4 py-3 bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors",style:{borderRadius:"0.375rem"}}),a.jsxs("select",{ref:m,className:"w-full px-4 py-3 bg-white/15 border border-white/25 text-white text-sm focus:outline-none focus:border-white/60 transition-colors",style:{borderRadius:t.radius},defaultValue:"",children:[a.jsx("option",{value:"",disabled:!0,className:"text-black",children:l.selectService}),n.services.map(v=>a.jsx("option",{value:v.name,className:"text-black",children:v.name},v.name))]})]}),a.jsx("textarea",{placeholder:i.placeholders.notes,rows:3,className:"w-full px-4 py-3 bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors resize-none mb-4",style:{borderRadius:t.radius}}),a.jsxs("button",{onClick:h,className:"w-full py-4 font-bold text-base transition-all hover:opacity-90 hover:-translate-y-0.5",style:{backgroundColor:"white",color:t.primary,borderRadius:t.radius},children:[a.jsx(_t,{className:"w-5 h-5 inline mr-2"}),l.confirmBooking]})]})]})]})}function Or({icon:e,label:t,status:n,statusColor:s,children:r}){return a.jsxs("div",{className:"rounded-xl border border-white/10 overflow-hidden",style:{backgroundColor:"rgba(255,255,255,0.08)"},children:[a.jsxs("div",{className:"flex items-center gap-2 px-4 py-2.5 border-b border-white/8",children:[e,a.jsx("span",{className:"text-xs font-semibold text-white/80 flex-1",children:t}),a.jsx("span",{className:"text-[10px] font-bold px-2 py-0.5 rounded-full",style:{backgroundColor:s+"22",color:s},children:n})]}),a.jsx("div",{className:"px-4 py-3 space-y-1",children:r})]})}function hw({palette:e,content:t}){const[n,s]=y.useState(null),{t:r}=se(),o=r.sections.faq;return a.jsx("section",{id:"faq",className:"py-24",style:{backgroundColor:e.bgAlt,color:e.fg,fontFamily:e.font},children:a.jsxs("div",{className:"max-w-3xl mx-auto px-6",children:[a.jsx(mr,{eyebrow:o.eyebrow,title:o.title,palette:e}),a.jsx("div",{className:"space-y-3",children:t.faq.map((i,l)=>a.jsxs("div",{className:"overflow-hidden transition-all",style:{backgroundColor:e.cardBg,border:`1px solid ${e.cardBorder}`,borderRadius:e.radius},children:[a.jsxs("button",{onClick:()=>s(n===l?null:l),className:"w-full flex items-center justify-between px-6 py-4 text-left",children:[a.jsx("span",{className:"font-semibold text-sm pr-4",children:i.q}),n===l?a.jsx(dm,{className:"w-4 h-4 shrink-0",style:{color:e.primary}}):a.jsx(Ma,{className:"w-4 h-4 shrink-0",style:{color:e.fgMuted}})]}),n===l&&a.jsx("div",{className:"px-6 pb-5 text-sm leading-relaxed",style:{color:e.fgMuted,borderTop:`1px solid ${e.cardBorder}`,paddingTop:"1rem"},children:i.a})]},l))})]})})}function gw({manifest:e,palette:t,content:n}){const[s,r]=y.useState(!1),{t:o}=se(),i=o.sections.contacts,l=ls(e),c=no(e),d=Jl(e),u=[l&&{icon:Vt,label:i.labels.phone,value:l,href:`tel:${l}`},c&&{icon:qe,label:i.labels.whatsapp,value:c,href:`https://wa.me/${c.replace(/\D/g,"")}`},d&&{icon:Rt,label:i.labels.email,value:d,href:`mailto:${d}`},{icon:vn,label:i.labels.address,value:e.business.city,href:`https://maps.google.com?q=${encodeURIComponent(e.business.city)}`},{icon:Xa,label:i.labels.hours,value:`${n.openDays} · ${n.hours}`,href:null}].filter(Boolean);return a.jsx("section",{id:"contacts",className:"py-24",style:{backgroundColor:t.bg,color:t.fg,fontFamily:t.font},children:a.jsxs("div",{className:"max-w-6xl mx-auto px-6",children:[a.jsx(mr,{eyebrow:i.eyebrow,title:i.title,palette:t}),a.jsxs("div",{className:"grid md:grid-cols-2 gap-12",children:[a.jsx("div",{className:"space-y-4",children:u.map(m=>a.jsx(mw,{icon:m.icon,label:m.label,value:m.value,href:m.href,palette:t},m.label))}),s?a.jsxs("div",{className:"flex flex-col items-center justify-center gap-4 p-8 text-center",style:{backgroundColor:t.cardBg,border:`1px solid ${t.cardBorder}`,borderRadius:t.radius},children:[a.jsx(hd,{className:"w-10 h-10",style:{color:t.primary}}),a.jsx("h3",{className:"font-bold text-lg",children:i.successTitle}),a.jsx("p",{className:"text-sm",style:{color:t.fgMuted},children:i.successSub}),a.jsx("button",{onClick:()=>r(!1),className:"text-xs underline",style:{color:t.fgMuted},children:i.sendAnother})]}):a.jsxs("form",{onSubmit:m=>{m.preventDefault(),r(!0)},className:"p-6 space-y-4",style:{backgroundColor:t.cardBg,border:`1px solid ${t.cardBorder}`,borderRadius:t.radius},children:[a.jsx("h3",{className:"font-bold text-lg mb-4",children:i.form.title}),[{placeholder:i.form.namePlaceholder,type:"text"},{placeholder:i.form.emailPlaceholder,type:"email"},{placeholder:i.form.subjectPlaceholder,type:"text"}].map(m=>a.jsx("input",{type:m.type,placeholder:m.placeholder,required:!0,className:"w-full px-4 py-3 text-sm border focus:outline-none transition-colors",style:{backgroundColor:t.bgAlt,borderColor:t.cardBorder,borderRadius:t.radius,color:t.fg}},m.placeholder)),a.jsx("textarea",{placeholder:i.form.messagePlaceholder,rows:4,required:!0,className:"w-full px-4 py-3 text-sm border focus:outline-none transition-colors resize-none",style:{backgroundColor:t.bgAlt,borderColor:t.cardBorder,borderRadius:t.radius,color:t.fg}}),a.jsxs("button",{type:"submit",className:"w-full py-3 font-bold text-sm transition-all hover:opacity-90",style:{backgroundColor:t.primary,color:t.primaryFg,borderRadius:t.radius},children:[a.jsx(hd,{className:"w-4 h-4 inline mr-2"}),i.form.send]})]})]})]})})}function bw({manifest:e,palette:t,content:n}){const{t:s}=se(),r=s.sections.footer,o=new Date().getFullYear(),i=is(e),l=ls(e),c=Jl(e),d=t.isDark?t.bg:"#111827",u="#f9fafb",m="rgba(249,250,251,0.45)";return a.jsx("footer",{id:"footer",className:"py-16",style:{backgroundColor:d,color:u,fontFamily:t.font},children:a.jsxs("div",{className:"max-w-6xl mx-auto px-6",children:[a.jsxs("div",{className:"grid sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12",children:[a.jsxs("div",{children:[a.jsx("h3",{className:"text-xl font-bold mb-3",children:i}),a.jsx("p",{className:"text-sm leading-relaxed mb-4",style:{color:m},children:n.tagline}),a.jsx("p",{className:"text-xs",style:{color:m},children:e.business.city})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"font-semibold mb-4 text-sm uppercase tracking-widest",style:{color:m},children:r.services}),a.jsx("ul",{className:"space-y-2",children:n.services.map(f=>a.jsx("li",{children:a.jsx("a",{href:"#services",className:"text-sm hover:text-white transition-colors",style:{color:m},children:f.name})},f.name))})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"font-semibold mb-4 text-sm uppercase tracking-widest",style:{color:m},children:r.contact}),a.jsxs("ul",{className:"space-y-2 text-sm",style:{color:m},children:[l&&a.jsx("li",{children:a.jsx("a",{href:`tel:${l}`,className:"hover:text-white transition-colors",children:l})}),c&&a.jsx("li",{children:a.jsx("a",{href:`mailto:${c}`,className:"hover:text-white transition-colors",children:c})}),a.jsxs("li",{children:[n.openDays," · ",n.hours]})]})]})]}),a.jsxs("div",{className:"pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t",style:{borderColor:"rgba(255,255,255,0.08)"},children:[a.jsxs("p",{className:"text-xs",style:{color:m},children:["© ",o," ",i,". ",r.rights]}),a.jsxs("p",{className:"text-xs",style:{color:m},children:[e.business.city," · ",e.business.language.toUpperCase()]})]})]})})}const Lo=[{id:"maps",icon:vn,color:"#4285F4"},{id:"website",icon:as,color:"#6C3BFF"},{id:"booking",icon:_t,color:"#8B5CFF"},{id:"crm",icon:jt,color:"#00C853"},{id:"wa",icon:qe,color:"#25D366"},{id:"email",icon:Rt,color:"#00D4FF"},{id:"review",icon:Ue,color:"#FFB300"},{id:"reviews",icon:Ue,color:"#4285F4"},{id:"clients",icon:ur,color:"#00C853"}];function yw({manifest:e,content:t}){var S;const[n,s]=y.useState("crm"),{t:r}=se(),o=r.reviewFlow,i=e.business,l=!!i.whatsapp,c=e.crm.reviewFlow.steps.some(p=>p.channel==="whatsapp"&&p.enabled),d=e.crm.reviewFlow.steps.some(p=>p.channel==="email"&&p.enabled),u=e.crm.reviewFlow.steps.find(p=>p.stepKey==="google_review_request"),m=((S=t.services[0])==null?void 0:S.name)??"Appointment",f=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),b=o.mockLabels,w=b.crmFields,x={maps:a.jsxs(ft,{title:o.pipeline.maps.label,icon:a.jsx(vn,{className:"w-4 h-4 text-[#4285F4]"}),mockLabel:o.mock,children:[a.jsxs("div",{className:"rounded-xl overflow-hidden border border-white/10",children:[a.jsx("div",{className:"h-28 flex items-center justify-center",style:{background:"linear-gradient(135deg,#1a2332,#1e3a5f)"},children:a.jsxs("div",{className:"text-center",children:[a.jsx(vn,{className:"w-8 h-8 text-[#4285F4] mx-auto mb-1"}),a.jsx("p",{className:"text-xs text-white/60",children:i.city})]})}),a.jsxs("div",{className:"p-3 text-xs space-y-1.5",children:[a.jsx("p",{className:"font-bold text-white",children:i.name}),a.jsxs("div",{className:"flex items-center gap-1",children:[[1,2,3,4,5].map(p=>a.jsx(Ue,{className:"w-3 h-3 fill-[#FFB300] text-[#FFB300]"},p)),a.jsx("span",{className:"text-white/50 ml-1",children:"4.9 · 127 reviews"})]}),i.phone&&a.jsx("p",{className:"text-white/50",children:i.phone}),a.jsx("a",{href:"#website",className:"inline-block mt-1 px-3 py-1 bg-[#4285F4] text-white rounded text-[10px] font-semibold",children:b.visitWebsite})]})]}),a.jsx(ht,{children:o.infoRows.maps.replace("{name}",i.name)})]}),website:a.jsxs(ft,{title:o.pipeline.website.label,icon:a.jsx(as,{className:"w-4 h-4 text-[#6C3BFF]"}),mockLabel:o.mock,children:[a.jsxs(xw,{url:`${i.name.toLowerCase().replace(/\s+/g,"")}.com`,children:[a.jsx("div",{className:"h-20 flex items-center justify-center text-center px-4",style:{background:"linear-gradient(135deg,#1e1b4b,#312e81)"},children:a.jsxs("div",{children:[a.jsx("p",{className:"text-white font-bold text-xs",children:i.name}),a.jsx("p",{className:"text-white/50 text-[10px] mt-0.5",children:t.tagline})]})}),a.jsxs("div",{className:"p-2 flex gap-1.5",children:[a.jsx("a",{href:"#booking",className:"flex-1 py-1.5 rounded text-[10px] font-bold text-center text-white",style:{background:"#6C3BFF"},children:b.bookNow}),a.jsx("a",{href:"#services",className:"flex-1 py-1.5 rounded text-[10px] font-semibold text-center border border-white/20 text-white/70",children:b.services})]})]}),a.jsx(ht,{children:o.infoRows.website})]}),booking:a.jsxs(ft,{title:o.pipeline.booking.label,icon:a.jsx(_t,{className:"w-4 h-4 text-[#8B5CFF]"}),mockLabel:o.mock,children:[a.jsxs("div",{className:"rounded-xl overflow-hidden border border-white/10 text-xs",children:[a.jsx("div",{className:"px-3 py-2 font-semibold text-white/80 border-b border-white/10 bg-white/5",children:b.bookingRequest}),a.jsx("div",{className:"p-3 space-y-2",children:[[w.service,m],[w.client,"Alex Johnson"],[w.phone,i.phone||"+49 170 0000000"],[w.date,f+" · 15:30"]].map(([p,h])=>a.jsxs("div",{className:"flex justify-between",children:[a.jsx("span",{className:"text-white/40",children:p}),a.jsx("span",{className:"text-white/80 font-medium",children:h})]},p))}),a.jsx("div",{className:"px-3 pb-3",children:a.jsx("div",{className:"w-full py-2 rounded-lg text-center text-[10px] font-bold text-white",style:{background:"#8B5CFF"},children:b.bookingSubmitted})})]}),a.jsx(ht,{children:o.infoRows.booking})]}),crm:a.jsxs(ft,{title:o.mockLabels.crm,icon:a.jsx(jt,{className:"w-4 h-4 text-[#00C853]"}),mockLabel:o.mock,children:[a.jsxs("div",{className:"rounded-xl overflow-hidden border border-white/10 text-xs",children:[a.jsxs("div",{className:"px-3 py-2 flex items-center justify-between bg-white/5 border-b border-white/10",children:[a.jsx("span",{className:"font-semibold text-white/80",children:b.customerRecord}),a.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold",children:b.confirmed})]}),a.jsx("div",{className:"p-3 space-y-2",children:[[w.name,"Alex Johnson"],[w.service,m],[w.date,f+" · 15:30"],[w.source,b.source],[w.channel,e.crm.notificationChannels.join(", ")]].map(([p,h])=>a.jsxs("div",{className:"flex justify-between",children:[a.jsx("span",{className:"text-white/40",children:p}),a.jsx("span",{className:"text-white/80 font-medium truncate ml-2 max-w-[60%] text-right",children:h})]},p))})]}),a.jsx(ht,{children:o.infoRows.crm})]}),wa:a.jsxs(ft,{title:b.waConfirm,icon:a.jsx(qe,{className:"w-4 h-4 text-[#25D366]"}),mockLabel:o.mock,children:[l||c?a.jsxs("div",{className:"rounded-xl overflow-hidden border border-white/10 bg-[#075e54]",children:[a.jsxs("div",{className:"px-3 py-2 bg-[#128c7e] flex items-center gap-2",children:[a.jsx("div",{className:"w-6 h-6 rounded-full bg-white/20 flex items-center justify-center",children:a.jsx(qe,{className:"w-3.5 h-3.5 text-white"})}),a.jsx("span",{className:"text-xs font-semibold text-white",children:i.name})]}),a.jsx("div",{className:"p-3",children:a.jsxs("div",{className:"bg-white/10 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-white/90 leading-relaxed",children:["Hi Alex! 👋 Your appointment at ",a.jsx("strong",{children:i.name})," is confirmed for ",a.jsxs("strong",{children:[f," at 15:30"]}),".",a.jsx("br",{}),a.jsx("br",{}),"Service: ",a.jsx("strong",{children:m}),a.jsx("br",{}),"Need to reschedule? Just reply here.",a.jsxs("div",{className:"text-right text-[10px] text-white/40 mt-1.5",children:[f," · ✓✓"]})]})})]}):a.jsx(Oo,{icon:a.jsx(qe,{className:"w-6 h-6 text-white/20"}),label:b.waNotConfigured}),a.jsx(ht,{children:c?o.infoRows.waEnabled:o.infoRows.waDisabled})]}),email:a.jsxs(ft,{title:b.emailConfirm,icon:a.jsx(Rt,{className:"w-4 h-4 text-[#00D4FF]"}),mockLabel:o.mock,children:[d?a.jsxs("div",{className:"rounded-xl overflow-hidden border border-white/10 text-xs",children:[a.jsxs("div",{className:"px-3 py-2 bg-white/5 border-b border-white/10 space-y-0.5",children:[a.jsxs("p",{className:"text-white/40",children:["From: ",a.jsx("span",{className:"text-white/70",children:i.email})]}),a.jsxs("p",{className:"text-white/40",children:["To: ",a.jsx("span",{className:"text-white/70",children:"alex.johnson@example.com"})]}),a.jsxs("p",{className:"text-white/40",children:["Subject: ",a.jsxs("span",{className:"text-white/80 font-semibold",children:["✓ Booking Confirmed — ",i.name]})]})]}),a.jsxs("div",{className:"p-3 text-white/80 leading-relaxed space-y-2",children:[a.jsx("p",{children:b.dear}),a.jsx("p",{children:b.apptConfirmed}),a.jsxs("div",{className:"rounded-lg p-2 bg-white/5 border border-white/10 space-y-1",children:[a.jsxs("p",{children:[a.jsxs("span",{className:"text-white/40",children:[w.service,":"]})," ",m]}),a.jsxs("p",{children:[a.jsxs("span",{className:"text-white/40",children:[w.date,":"]})," ",f," · 15:30"]}),a.jsxs("p",{children:[a.jsxs("span",{className:"text-white/40",children:[w.location,":"]})," ",i.city]})]}),a.jsxs("p",{className:"text-white/50",children:["Questions? Contact us: ",i.phone||i.email]})]})]}):a.jsx(Oo,{icon:a.jsx(Rt,{className:"w-6 h-6 text-white/20"}),label:b.emailNotEnabled}),a.jsx(ht,{children:d?o.infoRows.emailEnabled:o.infoRows.emailDisabled})]}),review:a.jsxs(ft,{title:b.review,icon:a.jsx(Ue,{className:"w-4 h-4 text-[#FFB300]"}),mockLabel:o.mock,children:[u!=null&&u.enabled?a.jsxs("div",{className:"rounded-xl overflow-hidden border border-white/10 bg-[#075e54]",children:[a.jsxs("div",{className:"px-3 py-2 bg-[#128c7e] flex items-center gap-2",children:[a.jsx("div",{className:"w-6 h-6 rounded-full bg-white/20 flex items-center justify-center",children:a.jsx(qe,{className:"w-3.5 h-3.5 text-white"})}),a.jsx("span",{className:"text-xs font-semibold text-white",children:i.name}),a.jsxs("span",{className:"ml-auto text-[10px] text-white/50 flex items-center gap-1",children:[a.jsx(Xa,{className:"w-3 h-3"}),"+",u.delayHours,"h ",b.afterVisit]})]}),a.jsx("div",{className:"p-3",children:a.jsxs("div",{className:"bg-white/10 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-white/90 leading-relaxed",children:["Hi Alex! ⭐ How was your experience at ",a.jsx("strong",{children:i.name}),"?",a.jsx("br",{}),a.jsx("br",{}),"We'd love to hear your feedback. It only takes 30 seconds and helps us a lot.",a.jsx("br",{}),a.jsx("a",{href:"#",className:"inline-block mt-2 px-3 py-1.5 rounded-lg bg-[#FFB300] text-black font-bold text-[10px]",children:b.leaveReview}),a.jsx("div",{className:"text-right text-[10px] text-white/40 mt-1.5",children:b.scheduled})]})})]}):a.jsx(Oo,{icon:a.jsx(Ue,{className:"w-6 h-6 text-white/20"}),label:b.reviewNotEnabled}),a.jsx(ht,{children:u!=null&&u.enabled?o.infoRows.reviewEnabled.replace("{hours}",String(u.delayHours)).replace("{channel}",u.channel):o.infoRows.reviewDisabled})]}),reviews:a.jsxs(ft,{title:b.reviews,icon:a.jsx(Ue,{className:"w-4 h-4 text-[#4285F4]"}),mockLabel:o.mock,children:[a.jsxs("div",{className:"rounded-xl border border-white/10 p-3 space-y-3 text-xs",children:[a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("div",{className:"flex gap-0.5",children:[1,2,3,4,5].map(p=>a.jsx(Ue,{className:"w-3.5 h-3.5 fill-[#FFB300] text-[#FFB300]"},p))}),a.jsx("span",{className:"font-bold text-white",children:"4.9"}),a.jsx("span",{className:"text-white/40",children:"· 127 reviews"})]}),[{name:"Alex J.",text:"Excellent service! Booked online, came on time. Highly recommend.",stars:5},{name:"Maria K.",text:"Very professional team. Will definitely come back again.",stars:5}].map(p=>a.jsxs("div",{className:"border-t border-white/10 pt-3",children:[a.jsxs("div",{className:"flex items-center justify-between mb-1",children:[a.jsx("span",{className:"font-semibold text-white/80",children:p.name}),a.jsx("div",{className:"flex gap-0.5",children:Array.from({length:p.stars}).map((h,g)=>a.jsx(Ue,{className:"w-3 h-3 fill-[#FFB300] text-[#FFB300]"},g))})]}),a.jsx("p",{className:"text-white/50 leading-relaxed",children:p.text})]},p.name))]}),a.jsx(ht,{children:o.infoRows.reviews})]}),clients:a.jsxs(ft,{title:b.clients,icon:a.jsx(ur,{className:"w-4 h-4 text-[#00C853]"}),mockLabel:o.mock,children:[a.jsx("div",{className:"rounded-xl border border-white/10 p-4 space-y-3 text-xs",children:[{label:b.stats.newBookings,value:"+34%",color:"#00C853"},{label:b.stats.fromMaps,value:"47%",color:"#4285F4"},{label:b.stats.repeatClients,value:"68%",color:"#8B5CFF"},{label:b.stats.rating,value:"4.9 ★",color:"#FFB300"}].map(p=>a.jsxs("div",{className:"flex justify-between items-center",children:[a.jsx("span",{className:"text-white/50",children:p.label}),a.jsx("span",{className:"font-bold",style:{color:p.color},children:p.value})]},p.label))}),a.jsx(ht,{children:o.infoRows.clients})]})};return a.jsx("section",{className:"py-16 border-b border-white/5",style:{background:"linear-gradient(160deg, #0d1117 0%, #1a0f3e 100%)"},children:a.jsxs("div",{className:"max-w-6xl mx-auto px-6",children:[a.jsxs("div",{className:"mb-10",children:[a.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[a.jsx("span",{className:"text-xs font-bold uppercase tracking-widest text-[#00D4FF]",children:o.brand}),a.jsx("span",{className:"text-white/15",children:"·"}),a.jsx("span",{className:"text-xs text-white/40",children:o.journey})]}),a.jsx("h2",{className:"text-2xl sm:text-3xl font-bold text-white mb-2",children:o.title}),a.jsx("p",{className:"text-white/45 text-sm max-w-xl",children:o.subtitle})]}),a.jsx("div",{className:"overflow-x-auto pb-4 mb-8",children:a.jsx("div",{className:"flex items-center gap-0 min-w-max",children:Lo.map((p,h)=>{const g=o.pipeline[p.id];return a.jsxs("div",{className:"flex items-center",children:[a.jsxs("button",{onClick:()=>s(p.id),className:`group flex flex-col items-center gap-2 px-3 py-3 rounded-xl transition-all border ${n===p.id?"border-white/20 bg-white/10":"border-transparent hover:bg-white/5 hover:border-white/10"}`,children:[a.jsx("div",{className:"w-10 h-10 rounded-xl flex items-center justify-center transition-all",style:{backgroundColor:n===p.id?p.color+"30":"rgba(255,255,255,0.06)",border:`1px solid ${n===p.id?p.color+"60":"transparent"}`},children:a.jsx(p.icon,{className:"w-5 h-5 transition-colors",style:{color:n===p.id?p.color:"rgba(255,255,255,0.35)"}})}),a.jsxs("div",{className:"text-center",children:[a.jsx("p",{className:"text-[10px] font-bold whitespace-nowrap",style:{color:n===p.id?"white":"rgba(255,255,255,0.45)"},children:g.label}),a.jsx("p",{className:"text-[9px] whitespace-nowrap",style:{color:"rgba(255,255,255,0.25)"},children:g.sub})]})]}),h<Lo.length-1&&a.jsx(Vb,{className:"w-3.5 h-3.5 mx-0.5 shrink-0",style:{color:"rgba(255,255,255,0.15)"}})]},p.id)})})}),a.jsx("div",{className:"animate-fade-in",children:x[n]}),a.jsx("div",{className:"flex items-center justify-center gap-1.5 mt-6",children:Lo.map(p=>a.jsx("button",{onClick:()=>s(p.id),className:"w-1.5 h-1.5 rounded-full transition-all",style:{backgroundColor:n===p.id?p.color:"rgba(255,255,255,0.15)"}},p.id))})]})})}function ft({title:e,icon:t,mockLabel:n,children:s}){return a.jsxs("div",{className:"rounded-2xl border border-white/10 overflow-hidden",style:{backgroundColor:"rgba(255,255,255,0.04)"},children:[a.jsxs("div",{className:"flex items-center gap-2 px-4 py-3 border-b border-white/8",children:[a.jsx("div",{className:"w-5 h-5 flex items-center justify-center",children:t}),a.jsx("span",{className:"text-xs font-semibold text-white/70",children:e}),a.jsxs("div",{className:"ml-auto flex items-center gap-1.5 text-[10px] text-green-400 font-semibold",children:[a.jsx(ct,{className:"w-3 h-3"})," ",n]})]}),a.jsx("div",{className:"p-4 space-y-3",children:s})]})}function xw({url:e,children:t}){return a.jsxs("div",{className:"rounded-xl overflow-hidden border border-white/10 text-xs",children:[a.jsxs("div",{className:"flex items-center gap-1.5 px-3 py-2 bg-white/8 border-b border-white/10",children:[a.jsxs("div",{className:"flex gap-1",children:[a.jsx("span",{className:"w-2.5 h-2.5 rounded-full bg-red-400/60"}),a.jsx("span",{className:"w-2.5 h-2.5 rounded-full bg-yellow-400/60"}),a.jsx("span",{className:"w-2.5 h-2.5 rounded-full bg-green-400/60"})]}),a.jsx("span",{className:"flex-1 text-center text-[9px] text-white/30 truncate",children:e})]}),t]})}function ht({children:e}){return a.jsx("p",{className:"text-[11px] text-white/40 leading-relaxed",children:e})}function Oo({icon:e,label:t}){return a.jsxs("div",{className:"rounded-xl border border-dashed border-white/15 py-8 flex flex-col items-center gap-2 text-center",children:[e,a.jsx("p",{className:"text-[11px] text-white/30 max-w-xs",children:t})]})}function vw({manifest:e,palette:t,navLinks:n,navLabels:s,callLabel:r,bookLabel:o}){const[i,l]=y.useState(!1),c=is(e),d=Nm(e),u=ls(e);return a.jsxs("nav",{className:"sticky top-11 z-40 border-b",style:{backgroundColor:t.isDark?`${t.bg}f0`:`${t.bg}f5`,borderColor:t.cardBorder,backdropFilter:"blur(12px)"},children:[a.jsxs("div",{className:"max-w-6xl mx-auto px-6 h-16 flex items-center justify-between",children:[a.jsxs("a",{href:"#hero",className:"flex items-center gap-2.5 font-bold text-lg",style:{color:t.fg},children:[d&&a.jsx("img",{src:d,alt:c,className:"h-9 w-auto max-w-[140px] object-contain"}),a.jsx("span",{children:c})]}),a.jsx("div",{className:"hidden md:flex items-center gap-1",children:n.map(m=>a.jsx("a",{href:`#${m}`,className:"px-3 py-2 text-sm font-medium transition-colors",style:{color:t.fgMuted,borderRadius:t.radius},onMouseEnter:f=>f.currentTarget.style.color=t.primary,onMouseLeave:f=>f.currentTarget.style.color=t.fgMuted,children:s[m]},m))}),a.jsxs("div",{className:"hidden md:flex items-center gap-2",children:[u&&a.jsxs("a",{href:`tel:${u}`,className:"inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border transition-all hover:opacity-80",style:{borderColor:t.cardBorder,color:t.fg,borderRadius:t.radius},children:[a.jsx(Vt,{className:"w-3.5 h-3.5"})," ",r]}),a.jsxs("a",{href:"#booking",className:"inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all hover:opacity-90",style:{backgroundColor:t.primary,color:t.primaryFg,borderRadius:t.radius},children:[a.jsx(_t,{className:"w-3.5 h-3.5"})," ",o]})]}),a.jsx("button",{className:"md:hidden p-2",onClick:()=>l(!i),style:{color:t.fg},children:i?a.jsx(hm,{className:"w-5 h-5"}):a.jsx(a0,{className:"w-5 h-5"})})]}),i&&a.jsx("div",{className:"md:hidden border-t px-6 py-3 space-y-1",style:{borderColor:t.cardBorder,backgroundColor:t.cardBg},children:n.map(m=>a.jsx("a",{href:`#${m}`,onClick:()=>l(!1),className:"block px-3 py-2 text-sm font-medium",style:{color:t.fg},children:s[m]},m))})]})}function na(){var w;const e=Sn(),{state:t}=os(),{t:n}=se(),s=Ul();if(!t.manifest)return s||e("/"),null;const r=t.manifest,o=Dm(r),i=ls(r),l=no(r),c=ym(r.business.sector);let d=Zv(r);d=ax(d,(w=r.branding)==null?void 0:w.photoOverrides);const u=r.website.sections,m={hero:n.websiteDemo.nav.home,about:n.websiteDemo.nav.about,services:n.websiteDemo.nav.services,gallery:n.websiteDemo.nav.gallery,booking:n.websiteDemo.nav.booking,testimonials:n.websiteDemo.nav.testimonials,faq:n.websiteDemo.nav.faq,contacts:n.websiteDemo.nav.contacts},f=u.filter(x=>m[x]),b={manifest:r,palette:o,content:c,images:d};return a.jsxs("div",{style:{fontFamily:o.font},children:[!s&&a.jsxs("div",{className:"sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 h-11",style:{background:"linear-gradient(135deg, #111827 0%, #1a0f3e 100%)",color:"white"},children:[a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("span",{className:"text-xs font-bold text-white/90 tracking-tight",children:"Factory Website+CRM"}),a.jsx("span",{className:"text-white/15",children:"·"}),a.jsxs("div",{className:"hidden sm:flex items-center gap-2 text-[10px] text-white/40",children:[a.jsx("span",{className:"capitalize",children:r.business.sector.replace(/_/g," ")}),a.jsx("span",{className:"text-white/15",children:"·"}),a.jsx("span",{children:r.business.language.toUpperCase()}),a.jsx("span",{className:"text-white/15",children:"·"}),a.jsxs("span",{children:["Manifest v",r.metadata.manifestVersion]}),a.jsx("span",{className:"text-white/15",children:"·"}),a.jsxs("span",{children:["Engine v",r.metadata.engineVersion]})]})]}),a.jsxs("button",{onClick:()=>e("/manifest"),className:"flex items-center gap-1.5 text-[11px] font-semibold text-white/60 hover:text-white transition-colors",children:[a.jsx(ql,{className:"w-3.5 h-3.5"}),n.websiteDemo.backToManifest]})]}),s&&a.jsx("div",{className:"sticky top-0 z-50 flex items-center justify-end px-4 sm:px-6 h-10 bg-white/90 backdrop-blur border-b border-slate-100",children:a.jsxs(Wl,{to:"/crm",className:"inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900",children:[a.jsx(jt,{className:"w-3.5 h-3.5"}),"Open CRM"]})}),!s&&a.jsx(yw,{manifest:r,palette:o,content:c}),a.jsx(vw,{manifest:r,palette:o,navLinks:f,navLabels:m,callLabel:n.websiteDemo.call,bookLabel:n.websiteDemo.bookNow}),u.map(x=>{switch(x){case"hero":return a.jsx(rw,{...b},x);case"about":return a.jsx(aw,{...b},x);case"services":return a.jsx(dw,{...b},x);case"gallery":return a.jsx(uw,{...b},x);case"booking":return a.jsx(fw,{...b},x);case"testimonials":return a.jsx(pw,{...b},x);case"faq":return a.jsx(hw,{...b},x);case"contacts":return a.jsx(gw,{...b},x);case"google_maps":return a.jsx(ow,{...b},x);case"whatsapp":return a.jsx(iw,{...b},x);case"email_section":return a.jsx(lw,{...b},x);default:return null}}),a.jsx(bw,{...b}),a.jsxs("div",{className:"fixed bottom-6 right-6 flex flex-col gap-3 z-40",children:[i&&a.jsx(Wo,{href:`tel:${i}`,label:n.websiteDemo.floating.call,color:"#22c55e",children:a.jsx(Vt,{className:"w-5 h-5"})}),l&&a.jsx(Wo,{href:`https://wa.me/${l.replace(/\D/g,"")}`,label:n.websiteDemo.floating.whatsapp,color:"#25D366",children:a.jsx(qe,{className:"w-5 h-5"})}),a.jsx(Wo,{href:"#booking",label:n.websiteDemo.floating.book,color:o.primary,children:a.jsx(_t,{className:"w-5 h-5"})})]})]})}function Wo({href:e,color:t,label:n,children:s}){return a.jsxs("a",{href:e,title:n,className:"group flex items-center gap-2 justify-end",children:[a.jsx("span",{className:"hidden group-hover:block px-2.5 py-1 rounded-full text-xs font-semibold text-white",style:{backgroundColor:t},children:n}),a.jsx("div",{className:"w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform",style:{backgroundColor:t},children:s})]})}const ww={success:{bg:"#dcfce7",text:"#15803d"},warning:{bg:"#fef3c7",text:"#b45309"},info:{bg:"#dbeafe",text:"#1d4ed8"},error:{bg:"#fee2e2",text:"#b91c1c"}};function kw({variant:e="info",children:t,className:n=""}){const s=ww[e];return a.jsx("span",{className:`px-2 py-0.5 rounded text-xs font-semibold ${n}`,style:{backgroundColor:s.bg,color:s.text},children:t})}function Sw({status:e}){const t={Confirmed:"success",Pending:"warning",Completed:"info",Cancelled:"error"};return a.jsx(kw,{variant:t[e],children:e})}function Wr({label:e,value:t,icon:n,color:s,bg:r}){return a.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 p-4 shadow-sm",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("p",{className:"text-xs font-medium text-slate-500",children:e}),a.jsx("div",{className:"w-7 h-7 rounded-lg flex items-center justify-center",style:{backgroundColor:r},children:a.jsx(n,{className:"w-3.5 h-3.5",style:{color:s}})})]}),a.jsx("p",{className:"text-2xl font-bold text-slate-800",children:t})]})}function fr({icon:e,label:t,sub:n}){return a.jsxs("div",{className:"flex flex-col items-center justify-center py-12 gap-2 text-center px-6",children:[e,a.jsx("p",{className:"font-semibold text-slate-500 text-sm",children:t}),a.jsx("p",{className:"text-xs text-slate-400 max-w-xs",children:n})]})}const Nw={LayoutDashboard:jt,CalendarCheck:_t,Users:ur,Briefcase:nn,LayoutGrid:Bi,UserCog:fm,Settings:mm,UtensilsCrossed:nn,Sparkles:nn,Stethoscope:nn,Dumbbell:nn,Wrench:nn,BedDouble:Bi};function Fi(){const e=Sn(),t=os(),{state:n}=t,{t:s,language:r}=se(),o=s.crm,[i,l]=y.useState("dashboard"),c=Ul(),d=y.useRef(null);if(!n.manifest)return e("/"),null;const u=n.manifest,m=u.crm.vocabularyKey??u.business.sector,f=T0(m,r),b=to(m),w=n.entities,x=w.appointments,S=is(u),p=Nm(u),h=Dm(u),g=h.primary,v=h.primaryLight,C=new Date().toDateString(),E=x.filter(j=>new Date(j.createdAt).toDateString()===C||j.date===new Date().toISOString().slice(0,10)),_=x.filter(j=>j.status==="Confirmed").length,A=x.filter(j=>j.status==="Pending").length,N=[{id:"dashboard",label:f.dashboard,iconKey:b.icons.dashboard},{id:"appointments",label:f.appointments,iconKey:b.icons.appointments},{id:"clients",label:f.clients,iconKey:b.icons.clients},{id:"services",label:f.services,iconKey:b.icons.services},{id:"resources",label:f.resources,iconKey:b.icons.resources},{id:"staff",label:f.staff,iconKey:b.icons.staff},{id:"settings",label:f.settings,iconKey:b.icons.settings}],k=Vl();return a.jsxs("div",{className:"min-h-screen",style:{backgroundColor:"#f1f5f9",fontFamily:"'Inter', sans-serif"},children:[a.jsx("header",{className:"sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm",children:a.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4",children:[a.jsxs("div",{className:"flex items-center gap-2",children:[p?a.jsx("img",{src:p,alt:S,className:"h-8 w-auto max-w-[120px] object-contain"}):a.jsx("div",{className:"w-7 h-7 rounded-lg flex items-center justify-center",style:{backgroundColor:g},children:a.jsx(jt,{className:"w-3.5 h-3.5 text-white"})}),a.jsx("span",{className:"font-bold text-slate-800 text-sm",children:o.title})]}),a.jsx("span",{className:"text-slate-300",children:"·"}),a.jsx("span",{className:"text-sm text-slate-500 font-medium truncate",children:S}),!c&&a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"text-slate-300 hidden sm:inline",children:"·"}),a.jsxs("span",{className:"hidden sm:inline text-xs font-semibold text-slate-400 flex items-center gap-1",children:[a.jsx(pr,{className:"w-3 h-3"})," Factory Website+CRM"]})]}),a.jsxs("div",{className:"ml-auto flex items-center gap-2",children:[a.jsx("button",{onClick:()=>e(c?"/":"/website-demo"),className:"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors",children:o.websiteDemo}),!c&&a.jsxs("button",{onClick:()=>e("/manifest"),className:"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-semibold transition-colors",children:[a.jsx(ql,{className:"w-3 h-3"})," ",o.backManifest]})]})]})}),a.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 py-6",children:[a.jsx("div",{className:"flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 w-full overflow-x-auto shadow-sm",children:N.map(j=>{const I=Nw[j.iconKey]??jt;return a.jsxs("button",{onClick:()=>l(j.id),className:`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${i===j.id?"text-white shadow-sm":"text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`,style:i===j.id?{backgroundColor:g}:void 0,children:[a.jsx(I,{className:"w-4 h-4"}),j.label,j.id==="appointments"&&x.length>0&&a.jsx("span",{className:`ml-1 text-xs font-bold px-1.5 py-0.5 rounded-full ${i===j.id?"bg-white/25 text-white":"bg-slate-100 text-slate-600"}`,children:x.length})]},j.id)})}),i==="dashboard"&&a.jsxs("div",{className:"space-y-6",children:[a.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-4",children:[a.jsx(Wr,{label:f.appointments,value:E.length,icon:_t,color:g,bg:v}),a.jsx(Wr,{label:f.clients,value:w.clients.length,icon:ur,color:"#2563eb",bg:"#dbeafe"}),a.jsx(Wr,{label:o.stats.pending,value:A,icon:Xa,color:"#d97706",bg:"#fef3c7"}),a.jsx(Wr,{label:o.stats.confirmed,value:_,icon:ct,color:"#059669",bg:"#d1fae5"})]}),a.jsx(Cw,{title:f.appointments,count:x.length,children:a.jsx(jd,{items:x.slice(0,8),onUpdate:t.updateAppointment,onDelete:t.deleteAppointment,columns:o.columns})})]}),i==="appointments"&&a.jsx(ks,{title:f.appointments,onAdd:()=>{var j;return t.addBooking({name:"New Guest",phone:"+49 150 0000000",date:new Date().toISOString().slice(0,10),service:((j=w.services[0])==null?void 0:j.name)??"Service",status:"Pending"})},addLabel:`+ ${f.appointments}`,children:a.jsx(jd,{items:x,onUpdate:t.updateAppointment,onDelete:t.deleteAppointment,columns:o.columns})}),i==="clients"&&a.jsx(ks,{title:f.clients,onAdd:()=>t.upsertClient({name:"New Client",phone:`+49 15${String(Date.now()).slice(-8)}`}),addLabel:`+ ${f.clients}`,children:a.jsx(jw,{items:w.clients,onUpdate:t.upsertClient,onDelete:t.deleteClient,columns:o.columns})}),i==="services"&&a.jsx(ks,{title:f.services,onAdd:()=>t.upsertService({name:"New Service",description:"Description",price:"from €49",durationMinutes:45,active:!0}),addLabel:`+ ${f.services}`,children:a.jsx(Rw,{items:w.services,onUpdate:t.upsertService,onDelete:t.deleteService})}),i==="resources"&&a.jsx(ks,{title:f.resources,onAdd:()=>t.upsertResource({name:`${b.resourceSingular.en} ${w.resources.length+1}`,capacity:2,status:"available"}),addLabel:`+ ${f.resources}`,children:a.jsx(Ew,{items:w.resources,onUpdate:t.upsertResource,onDelete:t.deleteResource})}),i==="staff"&&a.jsx(ks,{title:f.staff,onAdd:()=>t.upsertStaff({name:"New Staff",role:"Specialist",active:!0}),addLabel:`+ ${f.staff}`,children:a.jsx(_w,{items:w.staff,onUpdate:t.upsertStaff,onDelete:t.deleteStaff})}),i==="settings"&&a.jsxs("div",{className:"space-y-4",children:[a.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4",children:[a.jsxs("h2",{className:"text-sm font-semibold text-slate-700 flex items-center gap-2",children:[a.jsx(mm,{className:"w-4 h-4"})," ",f.settings]}),a.jsxs("div",{className:"grid sm:grid-cols-2 gap-3",children:[a.jsx(Ss,{label:"Business name",value:w.settings.businessName,onChange:j=>t.updateSettings({businessName:j})}),a.jsx(Ss,{label:"Phone",value:w.settings.phone,onChange:j=>t.updateSettings({phone:j})}),a.jsx(Ss,{label:"Email",value:w.settings.email,onChange:j=>t.updateSettings({email:j})}),a.jsx(Ss,{label:"WhatsApp",value:w.settings.whatsapp??"",onChange:j=>t.updateSettings({whatsapp:j})}),a.jsx(Ss,{label:"City",value:w.settings.city??"",onChange:j=>t.updateSettings({city:j})})]})]}),a.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3",children:[a.jsx("h3",{className:"text-sm font-semibold text-slate-700",children:"Storage"}),a.jsxs("p",{className:"text-xs text-slate-500",children:["Active backend: ",a.jsx("strong",{children:"LocalStorage"}),k.ready?" · Firebase ready to connect":" · Firebase optional upgrade"]}),a.jsx("p",{className:"text-xs text-slate-400",children:k.message}),a.jsxs("div",{className:"flex flex-wrap gap-2",children:[a.jsxs("button",{type:"button",onClick:()=>t.exportJson(),className:"inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold",children:[a.jsx(um,{className:"w-3.5 h-3.5"})," Export JSON"]}),a.jsxs("button",{type:"button",onClick:()=>{var j;return(j=d.current)==null?void 0:j.click()},className:"inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold",children:[a.jsx($l,{className:"w-3.5 h-3.5"})," Import JSON"]}),a.jsx("input",{ref:d,type:"file",accept:"application/json,.json",className:"hidden",onChange:async j=>{var D;const I=(D=j.target.files)==null?void 0:D[0];if(!I)return;const M=await I.text();try{t.importJson(M)}catch(O){alert(O instanceof Error?O.message:"Import failed")}j.target.value=""}}),a.jsxs("button",{type:"button",onClick:()=>Rm(r),className:"inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 text-xs font-semibold",children:[a.jsx(zl,{className:"w-3.5 h-3.5"})," Firebase upgrade"]})]})]})]})]})]})}function ks({title:e,onAdd:t,addLabel:n,children:s}){return a.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",children:[a.jsxs("div",{className:"flex items-center justify-between px-5 py-4 border-b border-slate-100",children:[a.jsx("h2",{className:"text-sm font-semibold text-slate-700",children:e}),a.jsxs("button",{type:"button",onClick:t,className:"inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold",children:[a.jsx(c0,{className:"w-3.5 h-3.5"})," ",n]})]}),s]})}function Cw({title:e,count:t,children:n}){return a.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",children:[a.jsxs("div",{className:"flex items-center justify-between px-5 py-4 border-b border-slate-100",children:[a.jsx("h2",{className:"text-sm font-semibold text-slate-700",children:e}),a.jsx("span",{className:"text-xs text-slate-400",children:t})]}),n]})}function Ss({label:e,value:t,onChange:n}){return a.jsxs("label",{className:"block text-xs space-y-1",children:[a.jsx("span",{className:"font-semibold text-slate-500",children:e}),a.jsx("input",{value:t,onChange:s=>n(s.target.value),className:"w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800"})]})}function jd({items:e,onUpdate:t,onDelete:n,columns:s}){if(e.length===0)return a.jsx(fr,{icon:a.jsx(_t,{className:"w-8 h-8 text-slate-300"}),label:"No records",sub:"Add a record or book from the website."});const r=["Pending","Confirmed","Completed","Cancelled"];return a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"w-full text-sm",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"bg-slate-50 border-b border-slate-100",children:[a.jsx(z,{children:s.name}),a.jsx(z,{children:s.phone}),a.jsx(z,{children:s.date}),a.jsx(z,{children:s.service}),a.jsx(z,{children:s.status}),a.jsx(z,{children:"Actions"})]})}),a.jsx("tbody",{className:"divide-y divide-slate-50",children:e.map(o=>a.jsxs("tr",{className:"hover:bg-slate-50",children:[a.jsx($,{children:a.jsx("input",{className:"font-medium text-slate-700 bg-transparent border-b border-transparent focus:border-slate-300 w-full",value:o.clientName,onChange:i=>t(o.id,{clientName:i.target.value})})}),a.jsx($,{children:a.jsxs("span",{className:"flex items-center gap-1 text-slate-500",children:[a.jsx(Vt,{className:"w-3 h-3"}),a.jsx("input",{className:"bg-transparent border-b border-transparent focus:border-slate-300 w-28",value:o.clientPhone,onChange:i=>t(o.id,{clientPhone:i.target.value})})]})}),a.jsx($,{children:a.jsx("input",{type:"date",className:"bg-transparent border-b border-transparent focus:border-slate-300",value:o.date,onChange:i=>t(o.id,{date:i.target.value})})}),a.jsx($,{children:a.jsx("input",{className:"bg-transparent border-b border-transparent focus:border-slate-300 w-full",value:o.serviceName,onChange:i=>t(o.id,{serviceName:i.target.value})})}),a.jsxs($,{children:[a.jsx("select",{className:"text-xs border border-slate-200 rounded-md px-2 py-1",value:o.status,onChange:i=>t(o.id,{status:i.target.value}),children:r.map(i=>a.jsx("option",{value:i,children:i},i))}),a.jsx("div",{className:"mt-1",children:a.jsx(Sw,{status:o.status})})]}),a.jsx($,{children:a.jsx("button",{type:"button",onClick:()=>n(o.id),className:"p-1.5 text-red-500 hover:bg-red-50 rounded",children:a.jsx(Nn,{className:"w-3.5 h-3.5"})})})]},o.id))})]})})}function jw({items:e,onUpdate:t,onDelete:n,columns:s}){return e.length===0?a.jsx(fr,{icon:a.jsx(ur,{className:"w-8 h-8 text-slate-300"}),label:"No clients",sub:"Add a client to get started."}):a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"w-full text-sm",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"bg-slate-50 border-b border-slate-100",children:[a.jsx(z,{children:s.name}),a.jsx(z,{children:s.phone}),a.jsx(z,{children:"Email"}),a.jsx(z,{children:"Notes"}),a.jsx(z,{children:"Actions"})]})}),a.jsx("tbody",{className:"divide-y divide-slate-50",children:e.map(r=>a.jsxs("tr",{className:"hover:bg-slate-50",children:[a.jsx($,{children:a.jsx("input",{className:"font-medium bg-transparent border-b border-transparent focus:border-slate-300 w-full",value:r.name,onChange:o=>t({...r,name:o.target.value})})}),a.jsx($,{children:a.jsx("input",{className:"bg-transparent border-b border-transparent focus:border-slate-300 w-32",value:r.phone,onChange:o=>t({...r,phone:o.target.value})})}),a.jsx($,{children:a.jsx("input",{className:"bg-transparent border-b border-transparent focus:border-slate-300 w-40",value:r.email??"",onChange:o=>t({...r,email:o.target.value})})}),a.jsx($,{children:a.jsx("input",{className:"bg-transparent border-b border-transparent focus:border-slate-300 w-full",value:r.notes??"",onChange:o=>t({...r,notes:o.target.value})})}),a.jsx($,{children:a.jsx("button",{type:"button",onClick:()=>n(r.id),className:"p-1.5 text-red-500 hover:bg-red-50 rounded",children:a.jsx(Nn,{className:"w-3.5 h-3.5"})})})]},r.id))})]})})}function Rw({items:e,onUpdate:t,onDelete:n}){return e.length===0?a.jsx(fr,{icon:a.jsx(nn,{className:"w-8 h-8 text-slate-300"}),label:"No services",sub:"Add a service."}):a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"w-full text-sm",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"bg-slate-50 border-b border-slate-100",children:[a.jsx(z,{children:"Name"}),a.jsx(z,{children:"Description"}),a.jsx(z,{children:"Price"}),a.jsx(z,{children:"Duration"}),a.jsx(z,{children:"Active"}),a.jsx(z,{children:"Actions"})]})}),a.jsx("tbody",{className:"divide-y divide-slate-50",children:e.map(s=>a.jsxs("tr",{children:[a.jsx($,{children:a.jsx("input",{className:"font-medium bg-transparent border-b border-transparent focus:border-slate-300 w-full",value:s.name,onChange:r=>t({...s,name:r.target.value})})}),a.jsx($,{children:a.jsx("input",{className:"bg-transparent border-b border-transparent focus:border-slate-300 w-full",value:s.description,onChange:r=>t({...s,description:r.target.value})})}),a.jsx($,{children:a.jsx("input",{className:"bg-transparent border-b border-transparent focus:border-slate-300 w-24",value:s.price,onChange:r=>t({...s,price:r.target.value})})}),a.jsx($,{children:a.jsx("input",{type:"number",className:"bg-transparent border-b border-transparent focus:border-slate-300 w-16",value:s.durationMinutes,onChange:r=>t({...s,durationMinutes:Number(r.target.value)||0})})}),a.jsx($,{children:a.jsx("input",{type:"checkbox",checked:s.active,onChange:r=>t({...s,active:r.target.checked})})}),a.jsx($,{children:a.jsx("button",{type:"button",onClick:()=>n(s.id),className:"p-1.5 text-red-500 hover:bg-red-50 rounded",children:a.jsx(Nn,{className:"w-3.5 h-3.5"})})})]},s.id))})]})})}function Ew({items:e,onUpdate:t,onDelete:n}){if(e.length===0)return a.jsx(fr,{icon:a.jsx(Bi,{className:"w-8 h-8 text-slate-300"}),label:"No resources",sub:"Add a table, room, or bay."});const s=["available","occupied","maintenance"];return a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"w-full text-sm",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"bg-slate-50 border-b border-slate-100",children:[a.jsx(z,{children:"Name"}),a.jsx(z,{children:"Capacity"}),a.jsx(z,{children:"Status"}),a.jsx(z,{children:"Notes"}),a.jsx(z,{children:"Actions"})]})}),a.jsx("tbody",{className:"divide-y divide-slate-50",children:e.map(r=>a.jsxs("tr",{children:[a.jsx($,{children:a.jsx("input",{className:"font-medium bg-transparent border-b border-transparent focus:border-slate-300 w-full",value:r.name,onChange:o=>t({...r,name:o.target.value})})}),a.jsx($,{children:a.jsx("input",{type:"number",className:"bg-transparent border-b border-transparent focus:border-slate-300 w-16",value:r.capacity,onChange:o=>t({...r,capacity:Number(o.target.value)||1})})}),a.jsx($,{children:a.jsx("select",{className:"text-xs border border-slate-200 rounded-md px-2 py-1",value:r.status,onChange:o=>t({...r,status:o.target.value}),children:s.map(o=>a.jsx("option",{value:o,children:o},o))})}),a.jsx($,{children:a.jsx("input",{className:"bg-transparent border-b border-transparent focus:border-slate-300 w-full",value:r.notes??"",onChange:o=>t({...r,notes:o.target.value})})}),a.jsx($,{children:a.jsx("button",{type:"button",onClick:()=>n(r.id),className:"p-1.5 text-red-500 hover:bg-red-50 rounded",children:a.jsx(Nn,{className:"w-3.5 h-3.5"})})})]},r.id))})]})})}function _w({items:e,onUpdate:t,onDelete:n}){return e.length===0?a.jsx(fr,{icon:a.jsx(fm,{className:"w-8 h-8 text-slate-300"}),label:"No staff",sub:"Add a team member."}):a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"w-full text-sm",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"bg-slate-50 border-b border-slate-100",children:[a.jsx(z,{children:"Name"}),a.jsx(z,{children:"Role"}),a.jsx(z,{children:"Phone"}),a.jsx(z,{children:"Email"}),a.jsx(z,{children:"Active"}),a.jsx(z,{children:"Actions"})]})}),a.jsx("tbody",{className:"divide-y divide-slate-50",children:e.map(s=>a.jsxs("tr",{children:[a.jsx($,{children:a.jsx("input",{className:"font-medium bg-transparent border-b border-transparent focus:border-slate-300 w-full",value:s.name,onChange:r=>t({...s,name:r.target.value})})}),a.jsx($,{children:a.jsx("input",{className:"bg-transparent border-b border-transparent focus:border-slate-300 w-full",value:s.role,onChange:r=>t({...s,role:r.target.value})})}),a.jsx($,{children:a.jsx("input",{className:"bg-transparent border-b border-transparent focus:border-slate-300 w-32",value:s.phone??"",onChange:r=>t({...s,phone:r.target.value})})}),a.jsx($,{children:a.jsx("input",{className:"bg-transparent border-b border-transparent focus:border-slate-300 w-40",value:s.email??"",onChange:r=>t({...s,email:r.target.value})})}),a.jsx($,{children:a.jsx("input",{type:"checkbox",checked:s.active,onChange:r=>t({...s,active:r.target.checked})})}),a.jsx($,{children:a.jsx("button",{type:"button",onClick:()=>n(s.id),className:"p-1.5 text-red-500 hover:bg-red-50 rounded",children:a.jsx(Nn,{className:"w-3.5 h-3.5"})})})]},s.id))})]})})}function z({children:e}){return a.jsx("th",{className:"px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider",children:e})}function $({children:e}){return a.jsx("td",{className:"px-4 py-3",children:e})}function Mw(){return a.jsxs(rm,{children:[a.jsx(ye,{path:"/",element:a.jsx(sx,{})}),a.jsx(ye,{path:"/studio",element:a.jsx(px,{})}),a.jsx(ye,{path:"/manifest",element:a.jsx(Qv,{})}),a.jsx(ye,{path:"/website-demo",element:a.jsx(na,{})}),a.jsx(ye,{path:"/crm-demo",element:a.jsx(Fi,{})}),a.jsx(ye,{path:"/website",element:a.jsx(Xr,{to:"/website-demo",replace:!0})}),a.jsx(ye,{path:"/crm",element:a.jsx(Xr,{to:"/crm-demo",replace:!0})}),a.jsx(ye,{path:"*",element:a.jsx(Xr,{to:"/",replace:!0})})]})}function Tw(){return a.jsxs(rm,{children:[a.jsx(ye,{path:"/",element:a.jsx(na,{})}),a.jsx(ye,{path:"/website",element:a.jsx(na,{})}),a.jsx(ye,{path:"/website-demo",element:a.jsx(na,{})}),a.jsx(ye,{path:"/crm",element:a.jsx(Fi,{})}),a.jsx(ye,{path:"/crm-demo",element:a.jsx(Fi,{})}),a.jsx(ye,{path:"*",element:a.jsx(Xr,{to:"/",replace:!0})})]})}function Aw(){const e=Ul();return a.jsx(_b,{children:e?a.jsx(Tw,{}):a.jsx(Mw,{})})}Op(document.getElementById("root")).render(a.jsx(y.StrictMode,{children:a.jsx(Zy,{children:a.jsx(ey,{children:a.jsx(Aw,{})})})}));
