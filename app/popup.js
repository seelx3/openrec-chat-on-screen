var __awaiter=this&&this.__awaiter||function(d,e,f,h){function c(l){return l instanceof f?l:new f(function(g){g(l)})}return new (f||(f=Promise))(function(l,g){function b(k){try{a(h.next(k))}catch(n){g(n)}}function m(k){try{a(h["throw"](k))}catch(n){g(n)}}function a(k){k.done?l(k.value):c(k.value).then(b,m)}a((h=h.apply(d,e||[])).next())})},__generator=this&&this.__generator||function(d,e){function f(a){return function(k){return h([a,k])}}function h(a){if(l)throw new TypeError("Generator is already executing.");
for(;c;)try{if(l=1,g&&(b=a[0]&2?g["return"]:a[0]?g["throw"]||((b=g["return"])&&b.call(g),0):g.next)&&!(b=b.call(g,a[1])).done)return b;if(g=0,b)a=[a[0]&2,b.value];switch(a[0]){case 0:case 1:b=a;break;case 4:return c.label++,{value:a[1],done:!1};case 5:c.label++;g=a[1];a=[0];continue;case 7:a=c.ops.pop();c.trys.pop();continue;default:if(!(b=c.trys,b=0<b.length&&b[b.length-1])&&(6===a[0]||2===a[0])){c=0;continue}if(3===a[0]&&(!b||a[1]>b[0]&&a[1]<b[3]))c.label=a[1];else if(6===a[0]&&c.label<b[1])c.label=
b[1],b=a;else if(b&&c.label<b[2])c.label=b[2],c.ops.push(a);else{b[2]&&c.ops.pop();c.trys.pop();continue}}a=e.call(d,c)}catch(k){a=[6,k],g=0}finally{l=b=0}if(a[0]&5)throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}var c={label:0,sent:function(){if(b[0]&1)throw b[1];return b[1]},trys:[],ops:[]},l,g,b,m;return m={next:f(0),"throw":f(1),"return":f(2)},"function"===typeof Symbol&&(m[Symbol.iterator]=function(){return this}),m},_this=this,onOff=document.getElementById("onoff-btn"),linesNum=document.getElementById("num-of-lines"),
opacityNum=document.getElementById("opacity");chrome.storage.local.get({isRunning:!1},function(d){onOff&&(onOff.checked=d.isRunning?!0:!1)});chrome.storage.local.get({numOfLines:14},function(d){linesNum&&(linesNum.value=d.numOfLines,setCurrentLines(d.numOfLines))});chrome.storage.local.get({opacity:50},function(d){opacityNum.value=d.opacity;setCurrentOpacity(d.opacity)});
function switchOnOff(){return __awaiter(this,void 0,void 0,function(){var d,e;return __generator(this,function(f){switch(f.label){case 0:return[4,chrome.tabs.query({active:!0,currentWindow:!0})];case 1:d=f.sent();e=d[0].id;if(!e)return[2];chrome.tabs.sendMessage(e,{message:"switchOnOff",isRunning:onOff.checked});chrome.storage.local.set({isRunning:onOff.checked});return[2]}})})}onOff.addEventListener("click",switchOnOff);
var curLines=document.getElementById("current-lines"),setCurrentLines=function(d){curLines&&(curLines.innerText=d)},rangeOnChangeLines=function(d){return __awaiter(_this,void 0,void 0,function(){var e,f,h;return __generator(this,function(c){switch(c.label){case 0:return e=d.target,setCurrentLines(e.value),chrome.storage.local.set({numOfLines:e.value}),[4,chrome.tabs.query({active:!0,currentWindow:!0})];case 1:f=c.sent();h=f[0].id;if(!h)return[2];chrome.tabs.sendMessage(h,{message:"changeNumOfLines",
numOfLines:e.value});console.log("send message: changeNumOfLines",e.value);return[2]}})})};linesNum.addEventListener("change",rangeOnChangeLines);
var curOpacity=document.getElementById("current-opacity"),setCurrentOpacity=function(d){curOpacity&&(curOpacity.innerText=d)},rangeOnChangeOpacity=function(d){return __awaiter(_this,void 0,void 0,function(){var e,f,h;return __generator(this,function(c){switch(c.label){case 0:return e=d.target,setCurrentOpacity(e.value),chrome.storage.local.set({opacity:e.value}),[4,chrome.tabs.query({active:!0,currentWindow:!0})];case 1:f=c.sent();h=f[0].id;if(!h)return[2];chrome.tabs.sendMessage(h,{message:"changeOpacity",
opacity:e.value});console.log("send message: changeOpacity",e.value);return[2]}})})};opacityNum.addEventListener("change",rangeOnChangeOpacity);