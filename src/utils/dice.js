var r1=function(s){return Math.floor(Math.random()*s)+1};var rN=function(c,s){return Array.from({length:c},function(){return r1(s)})};var sm=function(a){return a.reduce(function(x,y){return x+y},0)};var nw=function(){return new Date().toLocaleTimeString()};var pk=function(a){return a[Math.floor(Math.random()*a.length)]};function genCode(){var c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",o="";for(var i=0;i<6;i++)o+=c[Math.floor(Math.random()*c.length)];return o}
var _uc=0;function uid(){return Date.now().toString(36)+"_"+(_uc++).toString(36)+Math.floor(Math.random()*1296).toString(36)}

export { r1, rN, sm, nw, pk, genCode, uid };
