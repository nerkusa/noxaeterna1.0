import { NAMES_P } from '../data/lore';
import { SD, SKD } from '../data/stats';
import { pk } from './dice';
import { getRaces } from './raceStore';
import { getProfs } from './profStore';
import { getTraits } from './traitStore';

function iS(){var s={};SD.forEach(function(x){s[x.key]=1});return s}function iSk(){var s={};Object.values(SKD).flat().forEach(function(x){s[x.name]=0});return s}function uSP(s){return Object.values(s).reduce(function(a,b){return a+b},0)}function uSkP(s){var t=0;Object.values(SKD).flat().forEach(function(x){t+=x.x2?(s[x.name]||0)*2:(s[x.name]||0)});return t}function gE(b,bo){var r=Object.assign({},b);Object.entries(bo||{}).forEach(function(e){r[e[0]]=(r[e[0]]||0)+e[1]});return r}
/* Суммарные бонусы/штрафы от всех выбранных черт персонажа (черта может давать
   сразу несколько эффектов — бонус к навыку И характеристике, минус нескольким навыкам и т.д.) */
function traitBonuses(c){var tb={st:{},sk:{},hp:0};var ids=(c&&c.traits)||[];var T=getTraits();ids.forEach(function(tid){var t=T.find(function(x){return x.id===tid});if(!t)return;(t.effects||[]).forEach(function(e){if(e.type==="stat_bonus")tb.st[e.stat]=(tb.st[e.stat]||0)+(e.amount||0);else if(e.type==="skill_bonus")tb.sk[e.skill]=(tb.sk[e.skill]||0)+(e.amount||0);else if(e.type==="hp_flat")tb.hp+=(e.amount||0)});});return tb}
function cF(c){var R=getRaces();var rc=R.find(function(r){return r.id===c.raceId})||R[0];var tb=traitBonuses(c);var es=gE(gE(c.stats||iS(),rc.st),tb.st);if(rc.fp&&c.humanBonusStat)es[c.humanBonusStat]=(es[c.humanBonusStat]||0)+1;es.__hpBonus=tb.hp;return{race:rc,fs:es,eSk:gE(gE(c.skills||iSk(),rc.sk),tb.sk)}}function mHP(f){return((f.BODY||0)+(f.WILL||0))*2+((f&&f.__hpBonus)||0)}
function nC(name){return{name:name||"",level:1,profId:"none",raceId:"none",humanBonusStat:"",portrait:"",hair:"",bio:"",stats:iS(),skills:iSk(),traits:[],locked:false,curHp:null,hpOv:null,curWill:null,willOv:null,weapons:[],lvlPts:0,spentLvlPts:0,xp:0,armors:[],equippedHead:null,equippedBody:null,shield:null,shieldHp:0,shieldMaxHp:0,equippedWeapon:null,weaponMode:"1h",inventory:[],gold:0}}

/* Опыт до следующего уровня растёт на 100 за уровень: 1→2 нужно 100, 2→3 ещё
   200 (итого 300), 3→4 ещё 300 (итого 600) и т.д. xpForLevel(N) — сколько
   опыта суммарно нужно набрать с нуля, чтобы достичь уровня N. */
function xpForLevel(level){var total=0;for(var i=1;i<level;i++)total+=i*100;return total}
function xpProgress(c){var lvl=c.level||1;var have=c.xp||0;var curThresh=xpForLevel(lvl);var nextThresh=xpForLevel(lvl+1);var need=Math.max(1,nextThresh-curThresh);var got=Math.max(0,Math.min(need,have-curThresh));return{level:lvl,have:have,curThresh:curThresh,nextThresh:nextThresh,need:need,got:got,pct:Math.min(100,(got/need)*100),ready:have>=nextThresh}}

/* Генерация случайных статов/навыков для заданной расы и профессии (имя/раса/класс не трогаются) */
function rndCore(pr,rc){var st=iS();var rem=33;var pb=Math.floor(rem*0.7);var sp=0;if(pr.pS.length>0)for(var i=0;i<pb;i++){var cn=pr.pS.filter(function(k){return st[k]<8});if(!cn.length)break;st[pk(cn)]++;sp++}var lf=rem-sp;var ak=SD.map(function(s){return s.key});for(var j=0;j<lf;j++){var c2=ak.filter(function(k){return st[k]<8});if(!c2.length)break;st[pk(c2)]++}var sk=iSk();var aS=Object.values(SKD).flat();var co=function(n){var d=aS.find(function(s){return s.name===n});return d&&d.x2?2:1};var bk=rc.bsp?1:0;var sB=60+bk;var sp2=Math.floor(sB*0.7);var ss=0;if(pr.pSk.length>0)for(var x=0;x<200&&ss<sp2;x++){var c3=pr.pSk.filter(function(n){return sk[n]<8&&co(n)<=(sB-ss)});if(!c3.length)break;var n2=pk(c3);sk[n2]++;ss+=co(n2)}var sl=sB-ss;for(var y=0;y<200&&sl>0;y++){var c4=aS.map(function(s){return s.name}).filter(function(n){return sk[n]<6&&co(n)<=sl});if(!c4.length)break;var n3=pk(c4);sk[n3]++;sl-=co(n3)}var hb="";if(rc.fp&&pr.pS.length>0)hb=pk(pr.pS);return{humanBonusStat:hb,stats:st,skills:sk}}

/* Полный рандом: случайная раса + имя + статы/навыки */
function rnd(pId){var P=getProfs();var pr=P.find(function(p){return p.id===pId})||P[0];var rc=pk(getRaces().filter(function(r){return r.id!=="none"}));var core=rndCore(pr,rc);return{name:pk(NAMES_P),raceId:rc.id,humanBonusStat:core.humanBonusStat,stats:core.stats,skills:core.skills}}

/* Рандом только цифр: имя/класс/раса сохраняются */
function rndStats(pId,raceId){var P=getProfs();var pr=P.find(function(p){return p.id===pId})||P[0];var R=getRaces();var rc=R.find(function(r){return r.id===raceId})||R[0];return rndCore(pr,rc)}

export { iS, iSk, uSP, uSkP, gE, cF, mHP, nC, rnd, rndStats, xpForLevel, xpProgress };
