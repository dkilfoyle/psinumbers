webpackJsonp([8],{27:function(t,e,a){"use strict";function r(t){a(50)}Object.defineProperty(e,"__esModule",{value:!0});var n=a(36),s=a(52),o=a(4),l=r,i=o(n.a,s.a,!1,l,null,null);e.default=i.exports},36:function(t,e,a){"use strict";e.a={name:"custom-param-table",components:{},props:["params","population"],data:function(){return{}}}},50:function(t,e,a){var r=a(51);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a(26)("15135867",r,!0)},51:function(t,e,a){e=t.exports=a(25)(void 0),e.push([t.i,"",""])},52:function(t,e,a){"use strict";var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"customParamTable"},[a("h6",{staticStyle:{color:"#757575"}},[t._v("Custom Parameters")]),a("table",{staticClass:"q-table horizonal-separator bordered",staticStyle:{"margin-bottom":"20px"}},[t._m(0),a("tbody",[a("tr",[a("td",[t._v("DHBs")]),a("td",[t._v(t._s(t.population.dhbs.join(", ")))])]),t._l(t.params,function(e){return e.val!==e.default?a("tr",[a("td",[t._v(t._s(e.label))]),a("td",[t._v(t._s(e.val))])]):t._e()}),void 0===Object.values(t.params).find(function(t){return t.val===t.default})?a("tr",[a("td",[t._v("No custom parameters")])]):t._e()],2)])])},n=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("thead",[a("tr",[a("th",[t._v("Parameter")]),a("th",[t._v("Setting")])])])}],s={render:r,staticRenderFns:n};e.a=s}});