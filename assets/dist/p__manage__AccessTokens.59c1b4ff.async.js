(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[22],{IzEo:function(e,t,n){"use strict";n("cIOH"),n("lnY3"),n("Znn+"),n("14J3"),n("jCWc")},NJEC:function(e,t,n){"use strict";var a=n("pVnL"),c=n.n(a),r=n("J4zp"),l=n.n(r),o=n("q1tI"),i=n("TSYQ"),s=n.n(i),u=n("sKbD"),m=n.n(u),p=n("4IlW"),d=n("3S7+"),f=n("2/Rp"),b=n("zvFY"),v=n("YMnH"),E=n("ZvpZ"),y=n("H84U"),g=n("bogI"),O=n("0n0R"),C=void 0,h=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var c=0;for(a=Object.getOwnPropertySymbols(e);c<a.length;c++)t.indexOf(a[c])<0&&Object.prototype.propertyIsEnumerable.call(e,a[c])&&(n[a[c]]=e[a[c]])}return n},x=o["forwardRef"]((function(e,t){var n=o["useState"](e.visible),a=l()(n,2),r=a[0],i=a[1];o["useEffect"]((function(){"visible"in e&&i(e.visible)}),[e.visible]),o["useEffect"]((function(){"defaultVisible"in e&&i(e.defaultVisible)}),[e.defaultVisible]);var u=function(t,n){"visible"in e||i(t),e.onVisibleChange&&e.onVisibleChange(t,n)},m=function(t){u(!1,t),e.onConfirm&&e.onConfirm.call(C,t)},x=function(t){u(!1,t),e.onCancel&&e.onCancel.call(C,t)},N=function(e){e.keyCode===p["a"].ESC&&r&&u(!1,e)},j=function(t){var n=e.disabled;n||u(t)},P=function(t,n){var a=e.okButtonProps,r=e.cancelButtonProps,l=e.title,i=e.cancelText,s=e.okText,u=e.okType,p=e.icon;return o["createElement"]("div",{className:"".concat(t,"-inner-content")},o["createElement"]("div",{className:"".concat(t,"-message")},p,o["createElement"]("div",{className:"".concat(t,"-message-title")},Object(g["a"])(l))),o["createElement"]("div",{className:"".concat(t,"-buttons")},o["createElement"](f["a"],c()({onClick:x,size:"small"},r),i||n.cancelText),o["createElement"](f["a"],c()({onClick:m},Object(b["a"])(u),{size:"small"},a),s||n.okText)))},k=o["useContext"](y["b"]),S=k.getPrefixCls,w=e.prefixCls,T=e.placement,I=e.children,z=e.overlayClassName,L=h(e,["prefixCls","placement","children","overlayClassName"]),V=S("popover",w),K=S("popconfirm",w),B=s()(K,z),J=o["createElement"](v["a"],{componentName:"Popconfirm",defaultLocale:E["a"].Popconfirm},(function(e){return P(V,e)}));return o["createElement"](d["a"],c()({},L,{prefixCls:V,placement:T,onVisibleChange:j,visible:r,overlay:J,overlayClassName:B,ref:t}),Object(O["a"])(I,{onKeyDown:function(e){var t,n;null===(n=null===I||void 0===I?void 0:(t=I.props).onKeyDown)||void 0===n||n.call(t,e),N(e)}}))}));x.defaultProps={transitionName:"zoom-big",placement:"top",trigger:"click",okType:"primary",icon:o["createElement"](m.a,null),disabled:!1},t["a"]=x},NLJq:function(e,t,n){"use strict";n.r(t);n("IzEo");var a=n("bx4M"),c=(n("Mwp2"),n("VXEj")),r=(n("P2fV"),n("NJEC")),l=(n("14J3"),n("BMrR")),o=(n("jCWc"),n("kPKH")),i=(n("+L6B"),n("2/Rp")),s=(n("miYZ"),n("tsqr")),u=(n("2qtc"),n("kLXV")),m=(n("y8nQ"),n("Vl3Y")),p=n("tJVT"),d=n("q1tI"),f=n.n(d),b=n("Hx5s"),v=n("5CnO"),E=n("9BLJ"),y=n("5rEg"),g=n("z9pb"),O=n("MuoO"),C=n("71ry");function h(e){var t=e.onOk,n=e.visible,a=e.onCancel,c=m["a"].useForm(),r=Object(p["a"])(c,1),l=r[0],o=Object(d["useRef"])(null);return Object(d["useEffect"])((function(){var e;n&&(o.current&&(null===(e=o.current)||void 0===e||e.focus()))}),[n]),f.a.createElement(u["a"],{title:"\u65b0\u5efaAccess Token",visible:n,onOk:function(){l.submit()},onCancel:a},f.a.createElement(m["a"],{form:l,onFinish:function(e){t({name:e.name})}},f.a.createElement(m["a"].Item,{label:"\u540d\u79f0",name:"name",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u540d\u79f0"}]},f.a.createElement(y["a"],{ref:o}))))}function x(e){var t=e.pagination,n=e.dispatch,u=e.listLoading,m=e.list,y=Object(d["useState"])(!1),O=Object(p["a"])(y,2),x=O[0],N=O[1],j=Object(d["useState"])(""),P=Object(p["a"])(j,2),k=P[0],S=P[1],w=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10;n({type:"accessToken/fetchList",payload:{page:e,pageSize:t}})};Object(d["useEffect"])((function(){w(0,10)}),[]);var T=function(e){Object(g["a"])(e).then((function(e){0===e.code?(w(),N(!1),s["b"].success("\u521b\u5efa\u6210\u529f")):s["b"].error("\u521b\u5efa\u5931\u8d25:"+e.msg)}))},I=function(e){Object(g["b"])(e).then((function(e){0!==e.code?s["b"].error("\u5220\u9664\u5931\u8d25:"+e.msg):s["b"].success("\u5220\u9664\u6210\u529f"),w(t.current,t.pageSize)}))};return f.a.createElement(b["b"],null,f.a.createElement(a["a"],null,f.a.createElement(l["a"],null,f.a.createElement(o["a"],null,f.a.createElement(i["a"],{onClick:function(){return N(!0)}},f.a.createElement(v["a"],null),"\u65b0\u5efa"))),f.a.createElement(c["b"],{style:{marginTop:"10px"},loading:u,pagination:{onChange:function(e,t){w(e-1,t)},current:t.current+1,pageSize:t.pageSize,total:t.total},dataSource:m,renderItem:function(e){return f.a.createElement(c["b"].Item,{extra:f.a.createElement(r["a"],{title:"\u8bf7\u8c28\u614e\u64cd\u4f5c\uff0c\u5220\u9664\u540e\u8be5\u7b2c\u4e09\u65b9\u5e94\u7528\u65e0\u6cd5\u901a\u8fc7Open API\u8bbf\u95ee\u672c\u7cfb\u7edf.\u786e\u8ba4\u5220\u9664?",onConfirm:function(){I(e.app_id)}},f.a.createElement(i["a"],{danger:!0},"\u5220\u9664"))},f.a.createElement(c["b"].Item.Meta,{title:e.name,description:f.a.createElement("div",null,f.a.createElement("div",null,"App ID: ",e.app_id),f.a.createElement("div",null,"App Secret: ",k===e.app_id?e.app_secret:"*".repeat(e.app_secret.length),f.a.createElement(i["a"],{type:"link",onClick:function(){return S(k!==e.app_id?e.app_id:"")}},k===e.app_id?f.a.createElement(E["a"],null):f.a.createElement(C["EyeInvisibleOutlined"],null))))}))}})),f.a.createElement(h,{visible:x,onCancel:function(){return N(!1)},onOk:T}))}var N=function(e){var t=e.accessToken;return{list:t.list,listLoading:t.listLoading,pagination:t.pagination}};t["default"]=Object(O["connect"])(N)(x)},P2fV:function(e,t,n){"use strict";n("cIOH"),n("Q9mQ"),n("+L6B"),n("sE09")},bx4M:function(e,t,n){"use strict";var a=n("lSNA"),c=n.n(a),r=n("pVnL"),l=n.n(r),o=n("q1tI"),i=n("TSYQ"),s=n.n(i),u=n("6UMo"),m=n("H84U"),p=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var c=0;for(a=Object.getOwnPropertySymbols(e);c<a.length;c++)t.indexOf(a[c])<0&&Object.prototype.propertyIsEnumerable.call(e,a[c])&&(n[a[c]]=e[a[c]])}return n},d=function(e){return o["createElement"](m["a"],null,(function(t){var n=t.getPrefixCls,a=e.prefixCls,r=e.className,i=e.hoverable,u=void 0===i||i,m=p(e,["prefixCls","className","hoverable"]),d=n("card",a),f=s()("".concat(d,"-grid"),r,c()({},"".concat(d,"-grid-hoverable"),u));return o["createElement"]("div",l()({},m,{className:f}))}))},f=d,b=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var c=0;for(a=Object.getOwnPropertySymbols(e);c<a.length;c++)t.indexOf(a[c])<0&&Object.prototype.propertyIsEnumerable.call(e,a[c])&&(n[a[c]]=e[a[c]])}return n},v=function(e){return o["createElement"](m["a"],null,(function(t){var n=t.getPrefixCls,a=e.prefixCls,c=e.className,r=e.avatar,i=e.title,u=e.description,m=b(e,["prefixCls","className","avatar","title","description"]),p=n("card",a),d=s()("".concat(p,"-meta"),c),f=r?o["createElement"]("div",{className:"".concat(p,"-meta-avatar")},r):null,v=i?o["createElement"]("div",{className:"".concat(p,"-meta-title")},i):null,E=u?o["createElement"]("div",{className:"".concat(p,"-meta-description")},u):null,y=v||E?o["createElement"]("div",{className:"".concat(p,"-meta-detail")},v,E):null;return o["createElement"]("div",l()({},m,{className:d}),f,y)}))},E=v,y=n("ZTPi"),g=n("BMrR"),O=n("kPKH"),C=n("3Nzz"),h=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var c=0;for(a=Object.getOwnPropertySymbols(e);c<a.length;c++)t.indexOf(a[c])<0&&Object.prototype.propertyIsEnumerable.call(e,a[c])&&(n[a[c]]=e[a[c]])}return n};function x(e){var t=e.map((function(t,n){return o["createElement"]("li",{style:{width:"".concat(100/e.length,"%")},key:"action-".concat(n)},o["createElement"]("span",null,t))}));return t}var N=function(e){var t,n,a,r=o["useContext"](m["b"]),i=r.getPrefixCls,p=r.direction,d=o["useContext"](C["b"]),b=function(t){e.onTabChange&&e.onTabChange(t)},v=function(){var t;return o["Children"].forEach(e.children,(function(e){e&&e.type&&e.type===f&&(t=!0)})),t},E=e.prefixCls,N=e.className,j=e.extra,P=e.headStyle,k=void 0===P?{}:P,S=e.bodyStyle,w=void 0===S?{}:S,T=e.title,I=e.loading,z=e.bordered,L=void 0===z||z,V=e.size,K=e.type,B=e.cover,J=e.actions,M=e.tabList,A=e.children,H=e.activeTabKey,Y=e.defaultActiveTabKey,_=e.tabBarExtraContent,q=e.hoverable,R=e.tabProps,Q=void 0===R?{}:R,Z=h(e,["prefixCls","className","extra","headStyle","bodyStyle","title","loading","bordered","size","type","cover","actions","tabList","children","activeTabKey","defaultActiveTabKey","tabBarExtraContent","hoverable","tabProps"]),D=i("card",E),F=0===w.padding||"0px"===w.padding?{padding:24}:void 0,U=o["createElement"]("div",{className:"".concat(D,"-loading-block")}),W=o["createElement"]("div",{className:"".concat(D,"-loading-content"),style:F},o["createElement"](g["a"],{gutter:8},o["createElement"](O["a"],{span:22},U)),o["createElement"](g["a"],{gutter:8},o["createElement"](O["a"],{span:8},U),o["createElement"](O["a"],{span:15},U)),o["createElement"](g["a"],{gutter:8},o["createElement"](O["a"],{span:6},U),o["createElement"](O["a"],{span:18},U)),o["createElement"](g["a"],{gutter:8},o["createElement"](O["a"],{span:13},U),o["createElement"](O["a"],{span:9},U)),o["createElement"](g["a"],{gutter:8},o["createElement"](O["a"],{span:4},U),o["createElement"](O["a"],{span:3},U),o["createElement"](O["a"],{span:16},U))),X=void 0!==H,G=l()(l()({},Q),(t={},c()(t,X?"activeKey":"defaultActiveKey",X?H:Y),c()(t,"tabBarExtraContent",_),t)),$=M&&M.length?o["createElement"](y["a"],l()({size:"large"},G,{className:"".concat(D,"-head-tabs"),onChange:b}),M.map((function(e){return o["createElement"](y["a"].TabPane,{tab:e.tab,disabled:e.disabled,key:e.key})}))):null;(T||j||$)&&(a=o["createElement"]("div",{className:"".concat(D,"-head"),style:k},o["createElement"]("div",{className:"".concat(D,"-head-wrapper")},T&&o["createElement"]("div",{className:"".concat(D,"-head-title")},T),j&&o["createElement"]("div",{className:"".concat(D,"-extra")},j)),$));var ee=B?o["createElement"]("div",{className:"".concat(D,"-cover")},B):null,te=o["createElement"]("div",{className:"".concat(D,"-body"),style:w},I?W:A),ne=J&&J.length?o["createElement"]("ul",{className:"".concat(D,"-actions")},x(J)):null,ae=Object(u["a"])(Z,["onTabChange"]),ce=V||d,re=s()(D,N,(n={},c()(n,"".concat(D,"-loading"),I),c()(n,"".concat(D,"-bordered"),L),c()(n,"".concat(D,"-hoverable"),q),c()(n,"".concat(D,"-contain-grid"),v()),c()(n,"".concat(D,"-contain-tabs"),M&&M.length),c()(n,"".concat(D,"-").concat(ce),ce),c()(n,"".concat(D,"-type-").concat(K),!!K),c()(n,"".concat(D,"-rtl"),"rtl"===p),n));return o["createElement"]("div",l()({},ae,{className:re}),a,ee,te,ne)};N.Grid=f,N.Meta=E;t["a"]=N},lnY3:function(e,t,n){},sE09:function(e,t,n){}}]);