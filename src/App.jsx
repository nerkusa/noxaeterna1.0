import React, { useState, useEffect } from 'react';
import { db, ref, set, get, onValue, update, remove } from './firebase';

/* ── helpers ── */
var r1=function(s){return Math.floor(Math.random()*s)+1};var rN=function(c,s){return Array.from({length:c},function(){return r1(s)})};var sm=function(a){return a.reduce(function(x,y){return x+y},0)};var nw=function(){return new Date().toLocaleTimeString()};var pk=function(a){return a[Math.floor(Math.random()*a.length)]};function genCode(){var c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",o="";for(var i=0;i<6;i++)o+=c[Math.floor(Math.random()*c.length)];return o}

var CSS='@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Nunito:wght@400;600;700&display=swap");@keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes popIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#c4b8a4;border-radius:3px}';
var IconChar=function(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>};var IconBattle=function(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/></svg>};var IconInv=function(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>};var IconLib=function(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>};

var SD=[{key:"INT",full:"Интеллект",color:"#6366f1",emoji:"🧠"},{key:"REF",full:"Рефлексы",color:"#f59e0b",emoji:"⚡"},{key:"DEX",full:"Ловкость",color:"#10b981",emoji:"🏹"},{key:"BODY",full:"Тело",color:"#ef4444",emoji:"💪"},{key:"EMP",full:"Эмпатия",color:"#ec4899",emoji:"💜"},{key:"CRA",full:"Крафт",color:"#f97316",emoji:"🔨"},{key:"WILL",full:"Воля",color:"#8b5cf6",emoji:"🔥"}];
var SKD={INT:[{name:"Awareness",x2:false},{name:"Teaching",x2:true},{name:"Streetwise",x2:false},{name:"Lore",x2:false},{name:"Gambling",x2:false},{name:"Wilderness Survival",x2:false},{name:"Navigating",x2:false}],REF:[{name:"Battle Weapon",x2:true},{name:"Simple Weapon",x2:false},{name:"Guns",x2:true},{name:"Archery",x2:true}],DEX:[{name:"Acrobatics",x2:false},{name:"Ride-Drive",x2:false},{name:"Sleight of Hands",x2:false},{name:"Stealth",x2:false},{name:"Dodge",x2:true}],BODY:[{name:"Brawl",x2:false},{name:"Resistance",x2:false},{name:"Athletics",x2:false},{name:"Swimming",x2:false}],EMP:[{name:"Charisma",x2:false},{name:"Deception",x2:false},{name:"Performance",x2:false},{name:"Seduction",x2:true}],CRA:[{name:"Alchemy",x2:false},{name:"Blacksmithing",x2:false},{name:"Jewel Crafting",x2:true},{name:"Tinkering",x2:true}],WILL:[{name:"Spellcasting",x2:true},{name:"Magic Resist",x2:true}]};
var WS={Battle:"Battle Weapon",Simple:"Simple Weapon",Guns:"Guns",Archery:"Archery"};var DT=["К","Р","Д","С","П"];var WT=["Battle","Simple","Guns","Archery"];
var ZONES=[{r:1,name:"Голова",mult:3,e:"🧠",slot:"head",ignoreArmor:true},{r:2,name:"Шея",mult:2,e:"🫁",slot:"body",ignoreArmor:false},{r:3,name:"Торс",mult:1,e:"🫀",slot:"body",ignoreArmor:false},{r:4,name:"Руки",mult:1,e:"💪",slot:"body",ignoreArmor:false},{r:5,name:"Пах",mult:2,e:"⚠️",slot:"body",ignoreArmor:true},{r:6,name:"Ноги",mult:1,e:"🦵",slot:"body",ignoreArmor:false}];
var ARMOR_T=[{id:"none",name:"Нет",bodyReq:0,desc:""},{id:"light",name:"Лёгкая",bodyReq:4,desc:"К—полный, Р—½бр½HP, Д—полный, С—полный, П—полный"},{id:"medium",name:"Средняя",bodyReq:6,desc:"К—25%бр50%HP, Р—50%бр50%HP, Д—полный, С—полный бр½HP, П—полный"},{id:"heavy",name:"Тяжёлая",bodyReq:8,desc:"К—25%бр50%HP, Р—50%бр50%HP, Д—полный, С—½бр→HP, П—полный"}];
var PROFS=[{id:"none",name:"— Нет —",ab:"",abN:"",pS:[],pSk:[]},{id:"merchant",name:"Купец",ab:"+5 Charisma/день",abN:"Мастер Обмена",pS:["EMP","INT"],pSk:["Charisma","Deception","Streetwise","Gambling","Ride-Drive"]},{id:"warrior",name:"Воин",ab:"+5 атака/день",abN:"Стойкость",pS:["REF","BODY"],pSk:["Battle Weapon","Resistance","Athletics","Dodge","Simple Weapon"]},{id:"priest",name:"Священник",ab:"Воля Судьбы",abN:"Воля Судьбы",pS:["WILL","EMP"],pSk:["Spellcasting","Performance","Lore","Magic Resist","Charisma"]},{id:"artisan",name:"Ремесленник",ab:"Оценка механизмов",abN:"Рука Мастера",pS:["CRA","INT"],pSk:["Blacksmithing","Tinkering","Alchemy","Jewel Crafting","Lore"]},{id:"sensitive",name:"Чувствительный",ab:"+1d6 урона",abN:"Хаот. Всплеск",pS:["WILL","EMP"],pSk:["Spellcasting","Magic Resist","Awareness","Lore","Performance"]}];
var RACES=[{id:"none",name:"— Нет —",st:{},sk:{},sp:null,fp:false,bsp:false},{id:"human",name:"Человек",st:{EMP:1},sk:{Streetwise:2,"Ride-Drive":1},sp:"+1 навык",fp:true,bsp:true},{id:"elf_sun",name:"Эльф (Солн.)",st:{WILL:1,INT:1,BODY:-1},sk:{Spellcasting:2,Lore:1,Performance:1},sp:null,fp:false,bsp:false},{id:"elf_wood",name:"Эльф (Лесн.)",st:{DEX:1,REF:1,WILL:-1},sk:{Archery:2,Stealth:1,"Wilderness Survival":1},sp:null,fp:false,bsp:false},{id:"dwarf_high",name:"Гном (Воит.)",st:{BODY:1,REF:1,EMP:-1},sk:{"Battle Weapon":2,Resistance:1},sp:null,fp:false,bsp:false},{id:"dwarf_deep",name:"Гном (Рем.)",st:{CRA:2,DEX:-1},sk:{Blacksmithing:2,"Jewel Crafting":1,Lore:1},sp:null,fp:false,bsp:false},{id:"dwarf_dark",name:"Гном (Тёмн.)",st:{INT:1,DEX:1,EMP:-2},sk:{Awareness:2,"Wilderness Survival":2},sp:"Слепота",fp:false,bsp:false},{id:"azgul",name:"Азгул",st:{BODY:2,WILL:-1,EMP:-1},sk:{Resistance:2,"Battle Weapon":1,Athletics:1},sp:null,fp:false,bsp:false},{id:"dragonborn",name:"Драконорожд.",st:{BODY:1,WILL:1,DEX:-1},sk:{"Battle Weapon":2,Resistance:1},sp:"Breath 1d8",fp:false,bsp:false},{id:"kobold",name:"Кобольд",st:{DEX:1,CRA:1,BODY:-2},sk:{Tinkering:2,Stealth:2,"Sleight of Hands":1},sp:null,fp:false,bsp:false},{id:"drow",name:"Дроу",st:{DEX:1,INT:1,EMP:-1},sk:{Alchemy:1,Spellcasting:1,Deception:1,Stealth:1},sp:null,fp:false,bsp:false}];
var RACE_DESC={
  none:"",
  human:"Жители Аэтернии, строители городов и создатели сложной феодальной иерархии. Адаптивные, амбициозные и дипломатичные.",
  elf_sun:"Древние, мудрые, живущие в изоляции и гармонии. Пацифисты, вынужденные защищаться.",
  elf_wood:"Отказавшиеся от магии ради физического совершенства и выживания. Жестокие, прагматичные охотники на драконов и детей мятежного бога.",
  dwarf_high:"Жители верхних уровней Карак-Зара. Милитаристы, стражи врат, ориентированные на оборону и торговлю оружием.",
  dwarf_deep:"Жители сердца горы. Хранители храмов и величайшие кузнецы, создающие шедевры.",
  dwarf_dark:"Мутировавшие жители 8-го уровня. Бледные, слепые (видят эхолокацией), живут в полной темноте, питаются грибами и тварями.",
  azgul:"Искаженные эльфы, превращенные в идеальных солдат. Не чувствуют боли, дисциплинированы, служат в тяжелой пехоте. Ненавидимы эльфами.",
  dragonborn:"Неудавшийся эксперимент по созданию идеальных воинов. Имеют внутреннее пламя, честь наёмников и стремление к порядку. Breath Weapon — гарантированная атака вблизи (1d8).",
  kobold:"Мелкие, суетливые создания, «отходы» творения. Живут в тенях, мастера механизмов, ловушек и выживания в канализациях.",
  drow:"Жители самых глубоких недр. Матриархат, интриги, яды и поклонение хаосу. Жестокие и хитрые."
};
var PROF_DESC={
  none:{desc:"",abilityDesc:""},
  merchant:{desc:"Мастер торговли, процветающий на рынках Аэтериона и караванных путях Торгового Союза.",abilityDesc:"Один раз в день: +5 к Charisma для выторговывания редких товаров или информации.",abilityType:"roll_charisma"},
  warrior:{desc:"Непреклонный боец, закалённый в битвах Железных Холмов или дуэлях Южных Герцогств.",abilityDesc:"Один раз в день: +5 к атаке в одном ходу.",abilityType:"bonus_attack"},
  priest:{desc:"Духовный наставник, чтящий традиции без обращения к богам. Вдохновляет песнями и ритуалами.",abilityDesc:"«Что вершит судьбу человечества в этом мире? Некое незримое существо или закон, подобно Длани Господней, парящей над миром? По крайней мере истинно то, что человек не властен даже над своей волей.»",abilityType:"flavor"},
  artisan:{desc:"Искусный творец аркебуз, механизмов и инструментов в кузницах Мелких Королевств.",abilityDesc:"Мгновенно оцените и улучшите любой механизм или оружие, отражая гордость за наследие.",abilityType:"check"},
  sensitive:{desc:"Интуитивный искатель, чувствующий скрытые энергии природы. Использует хаотическую магию.",abilityDesc:"+1d6 урона к заклинаниям. Действует до первой неудачи, затем вызывает диссонанс.",abilityType:"toggle"}
};
var NAMES_P=["Альдрик","Бранн","Каэль","Дариен","Фенрис","Горан","Хальдор","Игнис","Кайлен","Мирон","Раэль","Сигмар","Аэлла","Бриана","Элара","Фрейя","Гвен","Кайра","Лианна","Равенна","Рен","Эш","Морган","Сторм"];
var LORE_CH=[{id:"map",title:"Карта Аэтернии",icon:"🗺️",color:"#10b981"},{id:"intro",title:"Введение",icon:"📜",color:"#3b82f6"},{id:"peoples",title:"Народы Аэтернии",icon:"👥",color:"#8b5cf6"},{id:"trade",title:"Торговые Маршруты",icon:"🛒",color:"#f59e0b"},{id:"world",title:"Особенности мира",icon:"🌍",color:"#10b981"},{id:"eastfal",title:"Ист-Фаль",icon:"🏰",color:"#ef4444"},{id:"westfal",title:"Вестфаль",icon:"🏰",color:"#3b82f6"},{id:"ergaria",title:"Ближняя Эргария",icon:"🌊",color:"#06b6d4"},{id:"elves",title:"Эльфы Эргария",icon:"🧝",color:"#10b981"},{id:"dwarves",title:"Дварфы Эргария",icon:"⛏️",color:"#f97316"},{id:"zarmakhal",title:"Зар-Махаль",icon:"🌙",color:"#8b5cf6"},{id:"raksi",title:"Ракси Ашкандара",icon:"🐎",color:"#d97706"},{id:"dragonborn_lore",title:"Драконорождённые",icon:"🐉",color:"#ef4444"},{id:"rebel",title:"Мятежный Бог",icon:"⚡",color:"#7c3aed"},{id:"iznanka",title:"Изнанка",icon:"💀",color:"#1f2937"}];

function iS(){var s={};SD.forEach(function(x){s[x.key]=1});return s}function iSk(){var s={};Object.values(SKD).flat().forEach(function(x){s[x.name]=0});return s}function uSP(s){return Object.values(s).reduce(function(a,b){return a+b},0)}function uSkP(s){var t=0;Object.values(SKD).flat().forEach(function(x){t+=x.x2?(s[x.name]||0)*2:(s[x.name]||0)});return t}function gE(b,bo){var r=Object.assign({},b);Object.entries(bo||{}).forEach(function(e){r[e[0]]=(r[e[0]]||0)+e[1]});return r}function cF(c){var rc=RACES.find(function(r){return r.id===c.raceId})||RACES[0];var es=gE(c.stats||iS(),rc.st);if(rc.fp&&c.humanBonusStat)es[c.humanBonusStat]=(es[c.humanBonusStat]||0)+1;return{race:rc,fs:es,eSk:gE(c.skills||iSk(),rc.sk)}}function mHP(f){return((f.BODY||0)+(f.WILL||0))*2}
function nC(name){return{name:name||"",level:1,profId:"none",raceId:"none",humanBonusStat:"",portrait:"",hair:"",bio:"",stats:iS(),skills:iSk(),locked:false,curHp:null,hpOv:null,curWill:null,willOv:null,weapons:[],lvlPts:0,spentLvlPts:0,armors:[],equippedHead:null,equippedBody:null,inventory:[],gold:0}}
function rnd(pId){var pr=PROFS.find(function(p){return p.id===pId})||PROFS[0];var rc=pk(RACES.filter(function(r){return r.id!=="none"}));var st=iS();var rem=33;var pb=Math.floor(rem*0.7);var sp=0;if(pr.pS.length>0)for(var i=0;i<pb;i++){var cn=pr.pS.filter(function(k){return st[k]<8});if(!cn.length)break;st[pk(cn)]++;sp++}var lf=rem-sp;var ak=SD.map(function(s){return s.key});for(var j=0;j<lf;j++){var c2=ak.filter(function(k){return st[k]<8});if(!c2.length)break;st[pk(c2)]++}var sk=iSk();var aS=Object.values(SKD).flat();var co=function(n){var d=aS.find(function(s){return s.name===n});return d&&d.x2?2:1};var bk=rc.bsp?1:0;var sB=60+bk;var sp2=Math.floor(sB*0.7);var ss=0;if(pr.pSk.length>0)for(var x=0;x<200&&ss<sp2;x++){var c3=pr.pSk.filter(function(n){return sk[n]<8&&co(n)<=(sB-ss)});if(!c3.length)break;var n2=pk(c3);sk[n2]++;ss+=co(n2)}var sl=sB-ss;for(var y=0;y<200&&sl>0;y++){var c4=aS.map(function(s){return s.name}).filter(function(n){return sk[n]<6&&co(n)<=sl});if(!c4.length)break;var n3=pk(c4);sk[n3]++;sl-=co(n3)}var hb="";if(rc.fp&&pr.pS.length>0)hb=pk(pr.pS);return{name:pk(NAMES_P),raceId:rc.id,humanBonusStat:hb,stats:st,skills:sk}}

/* ── calcAE: урон по броне/HP по типу урона ── */
/* Голова(×3) и Пах(×2) ignoreArmor — броня не считается, урон идёт напрямую в HP с множителем */
function calcAE(at,dt,rd){
  /* at=тип брони, dt=тип урона (К/Р/Д/С/П), rd=урон после множителя зоны */
  if(at==="none")return{ad:0,hd:rd,desc:"Без брони → HP:"+rd};
  /* К Колющий: 25% по броне, 50% по HP — все типы брони одинаково */
  if(dt==="К"){var ab=Math.floor(rd*0.25);var hb=Math.floor(rd*0.5);return{ad:ab,hd:hb,desc:"К: бр−"+ab+", HP−"+hb}}
  /* Р Режущий: 50% по броне, 50% по HP — все типы брони */
  if(dt==="Р"){var ab2=Math.floor(rd*0.5);var hb2=Math.floor(rd*0.5);return{ad:ab2,hd:hb2,desc:"Р: бр−"+ab2+", HP−"+hb2}}
  /* Д Дробящий: полный урон и по броне и по HP */
  if(dt==="Д"){return{ad:rd,hd:rd,desc:"Д: бр−"+rd+", HP−"+rd}}
  /* С Стрела: зависит от типа брони */
  if(dt==="С"){
    if(at==="light"){return{ad:rd,hd:rd,desc:"С+лёгк: бр−"+rd+", HP−"+rd}}
    if(at==="medium"){var hm=Math.floor(rd*0.5);return{ad:rd,hd:hm,desc:"С+средн: бр−"+rd+", HP−"+hm}}
    if(at==="heavy"){var ah=Math.floor(rd*0.5);return{ad:ah,hd:0,desc:"С+тяж: бр−"+ah+", HP блок"}}
  }
  /* П Пуля: полный урон и по броне и по HP */
  if(dt==="П"){return{ad:rd,hd:rd,desc:"П: бр−"+rd+", HP−"+rd}}
  return{ad:0,hd:rd,desc:"→HP:"+rd}
}

/* ── applyDmgToNpc: применить урон к заспавненному NPC ── */
function applyDmgToNpc(npc,rawDmg,dmgType,zoneName,saveSpawnedFn,spawnedAll,npcId,addLog,who,onNpcDeath){
  var z=ZONES.find(function(x){return x.name===zoneName})||ZONES[2];
  var multiplied=Math.floor(rawDmg*z.mult);
  var ignArmor=z.ignoreArmor;
  /* Определяем броню по слоту зоны */
  var armorType="none",armorHp=0,armorMaxHp=0,armorHpKey="",armorName="";
  if(z.slot==="head"){
    armorType=npc.armorHead||"none";
    armorHp=npc.armorHeadHp||0;
    armorMaxHp=npc.armorHeadMaxHp||armorHp;
    armorHpKey="armorHeadHp";
    armorName=npc.armorHead||"";
  } else {
    armorType=npc.armorBody||"none";
    armorHp=npc.armorBodyHp||0;
    armorMaxHp=npc.armorBodyMaxHp||armorHp;
    armorHpKey="armorBodyHp";
    armorName=npc.armorBody||"";
  }
  var ae;
  if(ignArmor){
    /* Голова/Пах игнорируют броню полностью */
    ae={ad:0,hd:multiplied,desc:"🔓 "+z.name+" ×"+z.mult+" (игнор брони) → HP−"+multiplied};
  } else {
    ae=calcAE(armorType,dmgType,multiplied);
  }
  /* Если броня уже сломана (hp=0) весь урон идёт в HP */
  if(!ignArmor&&armorType!=="none"&&armorHp<=0){
    ae={ad:0,hd:multiplied,desc:"Броня сломана → HP−"+multiplied};
  }
  var newArmorHp=Math.max(0,armorHp-ae.ad);
  var curHp=npc.hp!==undefined?npc.hp:(npc.maxHp||0);
  var newHp=Math.max(0,curHp-ae.hd);
  var upd=Object.assign({},npc,{hp:newHp});
  if(armorHpKey&&ae.ad>0)upd[armorHpKey]=newArmorHp;
  var sp=Object.assign({},spawnedAll);sp[npcId]=upd;
  saveSpawnedFn(sp);
  addLog({
    who:who,type:"dmg_npc",
    label:"💥 "+npc.name+" ["+z.e+z.name+" ×"+z.mult+"] "+dmgType,
    detail:ae.desc+(ae.ad>0?" | "+armorName+" "+armorHp+"→"+newArmorHp:"")+" | ❤️ "+curHp+"→"+newHp,
    total:ae.hd
  });
  if(newHp<=0&&onNpcDeath){onNpcDeath({npcName:npc.name});}
}

/* ── PendingAttackPopup — показывается игроку когда NPC атакует ── */
function PendingAttackPopup(pr){
  var attacks=pr.attacks||{};
  var myId=pr.myId;var myChar=pr.myChar;var addLog=pr.addLog;var onRoll=pr.onRoll;
  var pending=Object.entries(attacks).filter(function(e){return e[1].targetId===myId&&e[1].status==="pending_dodge";});
  if(pending.length===0)return null;
  var entry=pending[0];var id=entry[0];var atk=entry[1];
  var inf=cF(myChar);var fs=inf.fs;var es=inf.eSk;
  function doDodge(){
    var d=r1(10);var dv=fs.DEX||0;var dg=es.Dodge||0;var t=d+dv+dg;
    var dodged=t>=atk.hitRoll;
    update(ref(db,"rooms/"+pr.room+"/pendingAttacks/"+id),{dodgeRoll:t,dodgeDetail:"d10("+d+")+DEX("+dv+")+Dodge("+dg+")="+t,status:dodged?"done":"pending_dmg"});
    addLog({who:myChar.name||"???",type:"dodge",label:(dodged?"✅ Уклонился от ":"❌ Не уклонился от ")+atk.attackerName,detail:"🎲"+d+" + DEX("+dv+") + Dodge("+dg+") = "+t+" vs "+atk.hitRoll,total:t});
    onRoll({label:"🛡️ Уклонение",d10:d,parts:[{label:"DEX",value:dv},{label:"Dodge",value:dg}],total:t,subtext:"Атака: "+atk.hitRoll+" | Уклонение: "+t+(dodged?" ✅ УКЛОНИЛСЯ":" ❌ ПОПАЛО")});
  }
  function acceptHit(){
    update(ref(db,"rooms/"+pr.room+"/pendingAttacks/"+id),{dodgeRoll:0,status:"pending_dmg"});
  }
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:998,animation:"fadeIn 0.2s"}}>
    <div style={{background:"#fef2f2",border:"3px solid #ef4444",borderRadius:16,padding:"18px 22px",textAlign:"center",minWidth:270,maxWidth:340,boxShadow:"0 20px 60px rgba(0,0,0,0.5)",animation:"popIn 0.3s"}}>
      {pending.length>1&&<div style={{fontSize:9,color:"#8b7e6a",marginBottom:4}}>{"Атака 1 из "+pending.length}</div>}
      <div style={{fontSize:26,marginBottom:4}}>⚔️</div>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:15,color:"#dc2626",marginBottom:8}}>{atk.attackerName} атакует!</div>
      <div style={{background:"#fff",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
        <div style={{fontSize:9,color:"#6b7280",marginBottom:2}}>Бросок на попадание</div>
        <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:36,color:"#dc2626"}}>{atk.hitRoll}</div>
        {atk.weaponName&&<div style={{fontSize:9,color:"#8b7e6a",marginTop:2}}>{atk.weaponName+" · "+atk.dmgType+" · "+atk.zone}</div>}
      </div>
      <div style={{fontSize:10,color:"#5c5548",marginBottom:10}}>Бросок на уклонение: d10 + DEX + Dodge</div>
      <button onClick={doDodge} style={{width:"100%",padding:"10px",borderRadius:9,border:"none",background:"#10b981",color:"#fff",fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:14,cursor:"pointer",marginBottom:6}}>🛡️ Уклониться</button>
      <button onClick={acceptHit} style={{width:"100%",padding:6,borderRadius:7,border:"2px solid #ef444440",background:"none",color:"#ef4444",fontWeight:700,fontSize:10,cursor:"pointer"}}>Принять удар</button>
    </div>
  </div>)}

/* ── GMAttackPanel: ГМ видит сцену NPC→Игрок ── */
function GMAttackPanel(pr){
  var attacks=pr.attacks||{};
  var addLog=pr.addLog;var onRoll=pr.onRoll;var characters=pr.characters||[];
  var active=Object.entries(attacks).filter(function(e){
    return !e[1].fromPlayer&&(e[1].status==="pending_dodge"||e[1].status==="pending_dmg");
  });
  if(active.length===0)return null;
  var entry=active[0];var id=entry[0];var atk=entry[1];
  var waiting=atk.status==="pending_dodge";
  var dodged=!waiting&&(atk.dodgeRoll||0)>=(atk.hitRoll||0);
  var tgtChar=characters.find(function(x){return x._fbId===atk.targetId;});
  /* Детали броска атаки */
  var atkD=atk.atkD||"?";
  var atkREF=atk.atkREF||0;
  var atkSkill=atk.atkSkill||0;
  var atkBonus=atk.atkBonus||0;
  var atkSkillName=atk.atkSkillName||"Skill";
  /* Детали уклонения (если пришли) */
  var dodgeDetail=atk.dodgeDetail||"";

  function doRollDmg(){
    if(!tgtChar)return;
    var zoneD=r1(6);var zoneObj=ZONES[zoneD-1];
    var m=(atk.dmgDice||"1d6").match(/(\d+)d(\d+)/);if(!m)return;
    var dice=rN(parseInt(m[1]),parseInt(m[2]));
    var rawDmg=sm(dice)+(atk.dmgBonus||0);
    var multiplied=Math.floor(rawDmg*zoneObj.mult);
    var pArmorId=zoneObj.slot==="head"?tgtChar.equippedHead:tgtChar.equippedBody;
    var pArmorObj=(tgtChar.armors||[]).find(function(a){return a.id===pArmorId;});
    var pArmorType=pArmorObj?(pArmorObj.hp>0?pArmorObj.type:"none"):"none";
    var ae=zoneObj.ignoreArmor?{ad:0,hd:multiplied,desc:"🔓"+zoneObj.name+"×"+zoneObj.mult+" игнор→HP−"+multiplied}:calcAE(pArmorType,atk.dmgType||"Р",multiplied);
    var inf2=cF(tgtChar);var pMx=tgtChar.hpOv||mHP(inf2.fs);
    var pCur=tgtChar.curHp!==null&&tgtChar.curHp!==undefined?tgtChar.curHp:pMx;
    var newHp=Math.max(0,pCur-ae.hd);
    var updP=Object.assign({},tgtChar,{curHp:newHp});
    if(pArmorObj&&ae.ad>0){updP.armors=(tgtChar.armors||[]).map(function(a){return a.id===pArmorId?Object.assign({},a,{hp:Math.max(0,a.hp-ae.ad)}):a;});}
    delete updP._fbId;
    set(ref(db,"rooms/"+pr.room+"/characters/"+tgtChar._fbId),updP);
    if(ae.hd>0){set(ref(db,"rooms/"+pr.room+"/dmgEvents/"+tgtChar._fbId),{attackerName:atk.attackerName,dmg:ae.hd,oldHp:pCur,newHp:newHp,maxHp:pMx,ts:Date.now()});}
    addLog({who:atk.attackerName,type:"dmg_npc",label:"💥 "+atk.weaponName+" → "+atk.targetName+" ["+zoneObj.e+zoneObj.name+"] "+ae.hd+" HP",detail:"1d6="+zoneD+" "+zoneObj.name+" | "+ae.desc+" | ❤️ "+pCur+"→"+newHp,total:ae.hd});
    onRoll({label:atk.attackerName+" 💥 Урон",d10:null,parts:[{label:atk.dmgDice||"1d6",value:sm(dice)},{label:"Бнс",value:atk.dmgBonus||0}],total:rawDmg,subtext:zoneObj.e+" "+zoneObj.name+" ×"+zoneObj.mult+(zoneObj.ignoreArmor?" 🔓":"")+"\n"+ae.desc+"\n→ "+atk.targetName+": "+pCur+"→"+newHp+" HP"});
    remove(ref(db,"rooms/"+pr.room+"/pendingAttacks/"+id));
  }
  function skipDmg(){remove(ref(db,"rooms/"+pr.room+"/pendingAttacks/"+id));}

  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:997,animation:"fadeIn 0.2s"}}>
    <div style={{background:"#fefcf5",border:"3px solid "+(waiting?"#f59e0b":dodged?"#10b981":"#ef4444"),borderRadius:16,padding:"18px 22px",textAlign:"center",minWidth:270,maxWidth:350,boxShadow:"0 20px 60px rgba(0,0,0,0.5)",animation:"popIn 0.3s"}}>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:2}}><button onClick={skipDmg} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#8b7e6a",lineHeight:1}}>✕</button></div>
      {active.length>1&&<div style={{fontSize:9,color:"#8b7e6a",marginBottom:4}}>{"Сцена 1 из "+active.length}</div>}
      <div style={{fontSize:24,marginBottom:4}}>{waiting?"⚔️":dodged?"🛡️":"💥"}</div>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:15,color:"#dc2626",marginBottom:8}}>{atk.attackerName+" атакует "+atk.targetName+"!"}</div>

      {/* Бросок атаки с деталями */}
      <div style={{background:"#fff",border:"1px solid #e8e0d4",borderRadius:10,padding:"8px 12px",marginBottom:10}}>
        <div style={{fontSize:8,color:"#6b7280",marginBottom:4}}>Бросок на попадание</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,flexWrap:"wrap",marginBottom:6}}>
          <span style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:900,color:atkD===10?"#d97706":atkD===1?"#dc2626":"#3b82f6"}}>{"🎲"+atkD}</span>
          <span style={{color:"#8b7e6a"}}>+</span>
          <span style={{background:"#f5f0e8",borderRadius:5,padding:"2px 6px",textAlign:"center"}}>
            <span style={{color:"#8b7e6a",fontSize:7,display:"block"}}>REF</span>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700}}>{atkREF}</span>
          </span>
          <span style={{color:"#8b7e6a"}}>+</span>
          <span style={{background:"#f5f0e8",borderRadius:5,padding:"2px 6px",textAlign:"center"}}>
            <span style={{color:"#8b7e6a",fontSize:7,display:"block"}}>{atkSkillName}</span>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700}}>{atkSkill}</span>
          </span>
          {atkBonus!==0&&<span style={{color:"#8b7e6a"}}>+</span>}
          {atkBonus!==0&&<span style={{background:"#f5f0e8",borderRadius:5,padding:"2px 6px",textAlign:"center"}}>
            <span style={{color:"#8b7e6a",fontSize:7,display:"block"}}>Бнс</span>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700}}>{atkBonus}</span>
          </span>}
        </div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:32,fontWeight:900,color:"#dc2626"}}>{"= "+atk.hitRoll}</div>
        <div style={{fontSize:9,color:"#8b7e6a",marginTop:2}}>{atk.weaponName+" · "+atk.dmgDice+" · "+atk.dmgType}</div>
      </div>

      {/* Уклонение — ждём или показываем */}
      <div style={{background:"#fff",border:"1px solid "+(waiting?"#d1d5db":"#10b98140"),borderRadius:10,padding:"8px 12px",marginBottom:10}}>
        <div style={{fontSize:8,color:"#6b7280",marginBottom:4}}>Уклонение {atk.targetName}</div>
        {waiting
          ?<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"6px 0"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#f59e0b",animation:"fadeIn 0.5s infinite alternate"}}/>
            <span style={{fontSize:12,color:"#9ca3af",fontStyle:"italic"}}>ждём броска игрока...</span>
          </div>
          :<div>
            <div style={{fontSize:9,color:"#6b7280",marginBottom:4}}>{dodgeDetail}</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:32,fontWeight:900,color:dodged?"#10b981":"#ef4444"}}>{atk.dodgeRoll||0}</div>
            <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13,color:dodged?"#065f46":"#991b1b",marginTop:4}}>
              {dodged?"✅ Уклонился!":"❌ Попало!"}
            </div>
          </div>
        }
      </div>

      {/* Кнопки */}
      {waiting&&<div style={{fontSize:9,color:"#8b7e6a",fontStyle:"italic"}}>Ожидаем действия игрока...</div>}
      {!waiting&&(dodged
        ?<button onClick={skipDmg} style={{width:"100%",padding:8,borderRadius:8,border:"none",background:"#10b981",color:"#fff",fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:13,cursor:"pointer"}}>✅ Закрыть</button>
        :<button onClick={doRollDmg} style={{width:"100%",padding:10,borderRadius:8,border:"none",background:"#ef4444",color:"#fff",fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:14,cursor:"pointer"}}>💥 Бросить урон + зону!</button>
      )}
    </div>
  </div>)}

/* ── PlayerAttackNotif: ГМ видит сцену Игрок→NPC (кидает уклонение / авто-урон) ── */
function PlayerAttackNotif(pr){
  var attacks=pr.attacks||{};
  var spawned=pr.spawned||{};var saveSpawned=pr.saveSpawned;
  var addLog=pr.addLog;var onRoll=pr.onRoll;
  /* Сначала pending_dodge — нужно уклонение */
  var needDodge=Object.entries(attacks).filter(function(e){return e[1].fromPlayer&&e[1].status==="pending_dodge";});
  /* Потом pending_dmg — уклонение пришло, считаем урон автоматически */
  var needDmg=Object.entries(attacks).filter(function(e){return e[1].fromPlayer&&e[1].status==="pending_dmg";});
  /* Авто-применяем урон для всех pending_dmg */
  needDmg.forEach(function(entry){
    var id=entry[0];var atk=entry[1];
    var npc=spawned[atk.npcId];
    if(!npc)return;
    var dodged=(atk.dodgeRoll||0)>=(atk.hitRoll||0);
    if(dodged){
      /* NPC уклонился — просто закрываем */
      remove(ref(db,"rooms/"+pr.room+"/pendingAttacks/"+id));
      return;
    }
    /* Применяем урон к NPC автоматически */
    var zoneD=r1(6);var zoneObj=ZONES[zoneD-1];
    var m=(atk.dmgDice||"1d6").match(/(\d+)d(\d+)/);if(!m)return;
    var dice=rN(parseInt(m[1]),parseInt(m[2]));
    var rawDmg=sm(dice)+(atk.dmgBonus||0);
    var multiplied=Math.floor(rawDmg*zoneObj.mult);
    var npcArmorType=zoneObj.slot==="head"?(npc.armorHead||"none"):(npc.armorBody||"none");
    var npcArmorHp=zoneObj.slot==="head"?(npc.armorHeadHp||0):(npc.armorBodyHp||0);
    if(npcArmorHp<=0)npcArmorType="none";
    var ae=zoneObj.ignoreArmor?{ad:0,hd:multiplied,desc:"🔓"+zoneObj.name+"×"+zoneObj.mult}:calcAE(npcArmorType,atk.dmgType||"Р",multiplied);
    var newNpcHp=Math.max(0,(npc.hp||0)-ae.hd);
    var updNpc=Object.assign({},npc,{hp:newNpcHp});
    if(ae.ad>0){
      if(zoneObj.slot==="head")updNpc.armorHeadHp=Math.max(0,(npc.armorHeadHp||0)-ae.ad);
      else updNpc.armorBodyHp=Math.max(0,(npc.armorBodyHp||0)-ae.ad);
    }
    var spAll=Object.assign({},spawned);spAll[atk.npcId]=updNpc;
    saveSpawned(spAll);
    addLog({who:atk.attackerName,type:"dmg",label:"💥 "+atk.weaponName+" → "+atk.npcName+" ["+zoneObj.e+zoneObj.name+"] "+ae.hd+" HP",detail:"1d6="+zoneD+" "+zoneObj.name+" | "+ae.desc+" | ❤️ "+(npc.hp||0)+"→"+newNpcHp,total:ae.hd});
    onRoll&&onRoll({label:atk.attackerName+" 💥 Урон",d10:null,parts:[{label:atk.dmgDice||"1d6",value:sm(dice)},{label:"Бнс",value:atk.dmgBonus||0}],total:rawDmg,subtext:zoneObj.e+" "+zoneObj.name+" ×"+zoneObj.mult+(zoneObj.ignoreArmor?" 🔓":"")+"\n"+ae.desc+"\n→ "+atk.npcName+": "+(npc.hp||0)+"→"+newNpcHp+" HP"});
    remove(ref(db,"rooms/"+pr.room+"/pendingAttacks/"+id));
  });
  if(needDodge.length===0)return null;
  var entry=needDodge[0];var id=entry[0];var atk=entry[1];
  var npc=spawned[atk.npcId];
  function doDodge(){
    if(!npc)return;
    var st=npc.stats||{};var sk=npc.skills||{};
    var d=r1(10);var dv=st.DEX||0;var dg=sk.dodge||0;var t=d+dv+dg;
    var dodged=t>=atk.hitRoll;
    update(ref(db,"rooms/"+pr.room+"/pendingAttacks/"+id),{dodgeRoll:t,status:dodged?"done":"pending_dmg",dodgeDetail:"d10("+d+")+DEX("+dv+")+Dodge("+dg+")="+t});
    addLog({who:npc.name,type:"dodge",label:(dodged?"✅ Уклонился от ":"❌ Не уклонился от ")+atk.attackerName,detail:"d10("+d+")+DEX("+dv+")+Dodge("+dg+") = "+t+" vs "+atk.hitRoll,total:t});
    if(onRoll)onRoll({label:npc.name+" — Уклонение",d10:d,parts:[{label:"DEX",value:dv},{label:"Dodge",value:dg}],total:t,subtext:"Атака: "+atk.hitRoll+" vs Уклон: "+t+(dodged?" ✅ УКЛОНИЛСЯ":" ❌ ПОПАЛО")});
  }
  function acceptHit(){
    update(ref(db,"rooms/"+pr.room+"/pendingAttacks/"+id),{dodgeRoll:0,status:"pending_dmg"});
  }
  var atkD2=atk.atkD||"?";var atkREF2=atk.atkREF||0;var atkSkill2=atk.atkSkill||0;var atkBonus2=atk.atkBonus||0;var atkSkillName2=atk.atkSkillName||"Навык";
  var npcDex=npc?(npc.stats||{}).DEX||0:0;var npcDodge=npc?(npc.skills||{}).dodge||0:0;
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:998,animation:"fadeIn 0.2s"}}>
    <div style={{background:"#fefcf5",border:"3px solid #3b82f6",borderRadius:16,padding:"18px 22px",textAlign:"center",minWidth:270,maxWidth:350,boxShadow:"0 20px 60px rgba(0,0,0,0.5)",animation:"popIn 0.3s"}}>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:2}}><button onClick={acceptHit} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#8b7e6a",lineHeight:1}}>✕</button></div>
      {needDodge.length>1&&<div style={{fontSize:9,color:"#8b7e6a",marginBottom:4}}>{"Атака 1 из "+needDodge.length}</div>}
      <div style={{fontSize:24,marginBottom:4}}>🎯</div>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:15,color:"#1d4ed8",marginBottom:8}}>{atk.attackerName+" атакует "+atk.npcName+"!"}</div>
      {/* Бросок атаки с деталями */}
      <div style={{background:"#fff",border:"1px solid #e8e0d4",borderRadius:10,padding:"8px 12px",marginBottom:10}}>
        <div style={{fontSize:8,color:"#6b7280",marginBottom:4}}>Бросок на попадание</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,flexWrap:"wrap",marginBottom:6}}>
          <span style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:900,color:atkD2===10?"#d97706":atkD2===1?"#dc2626":"#3b82f6"}}>{"🎲"+atkD2}</span>
          <span style={{color:"#8b7e6a"}}>+</span>
          <span style={{background:"#f5f0e8",borderRadius:5,padding:"2px 6px",textAlign:"center"}}><span style={{color:"#8b7e6a",fontSize:7,display:"block"}}>REF</span><span style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700}}>{atkREF2}</span></span>
          <span style={{color:"#8b7e6a"}}>+</span>
          <span style={{background:"#f5f0e8",borderRadius:5,padding:"2px 6px",textAlign:"center"}}><span style={{color:"#8b7e6a",fontSize:7,display:"block"}}>{atkSkillName2}</span><span style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700}}>{atkSkill2}</span></span>
          {atkBonus2!==0&&<span style={{color:"#8b7e6a"}}>+</span>}
          {atkBonus2!==0&&<span style={{background:"#f5f0e8",borderRadius:5,padding:"2px 6px",textAlign:"center"}}><span style={{color:"#8b7e6a",fontSize:7,display:"block"}}>Бнс</span><span style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700}}>{atkBonus2}</span></span>}
        </div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:32,fontWeight:900,color:"#1d4ed8"}}>{"= "+atk.hitRoll}</div>
        <div style={{fontSize:9,color:"#8b7e6a",marginTop:2}}>{(atk.weaponName||"")+(atk.dmgType?" · "+atk.dmgType:"")}</div>
      </div>
      {/* Уклонение NPC */}
      <div style={{background:"#fff",border:"1px solid #e8e0d4",borderRadius:10,padding:"8px 12px",marginBottom:10}}>
        <div style={{fontSize:8,color:"#6b7280",marginBottom:4}}>Уклонение {atk.npcName}</div>
        <div style={{fontSize:9,color:"#8b7e6a",marginBottom:6}}>d10 + DEX({npcDex}) + Dodge({npcDodge})</div>
        <button onClick={doDodge} style={{width:"100%",padding:"10px",borderRadius:9,border:"none",background:"#10b981",color:"#fff",fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:14,cursor:"pointer"}}>🛡️ Бросить уклонение!</button>
      </div>
      <button onClick={acceptHit} style={{width:"100%",padding:6,borderRadius:7,border:"2px solid #3b82f640",background:"none",color:"#8b7e6a",fontWeight:700,fontSize:10,cursor:"pointer"}}>Принять удар без уклонения</button>
    </div>
  </div>)}

/* ── DamagePopup — показывается игроку при получении урона ── */
function DamagePopup(pr){
  var ev=pr.event;
  if(!ev)return null;
  var dead=ev.newHp<=0;
  var pct=ev.maxHp>0?(ev.newHp/ev.maxHp)*100:0;
  return(<div style={{position:"fixed",inset:0,background:dead?"rgba(0,0,0,0.85)":"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:996,animation:"fadeIn 0.15s"}} onClick={pr.onClose}>
    <div onClick={function(e){e.stopPropagation()}} style={{background:dead?"linear-gradient(135deg,#1f2937,#374151)":"linear-gradient(135deg,#fee2e2,#fecaca)",border:"3px solid "+(dead?"#6b7280":"#ef4444"),borderRadius:16,padding:"18px 24px",textAlign:"center",minWidth:250,maxWidth:320,boxShadow:"0 20px 60px rgba(0,0,0,0.6)",animation:"popIn 0.3s"}}>
      <div style={{fontSize:40,marginBottom:6}}>{dead?"💀":"🩸"}</div>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:18,color:dead?"#f9fafb":"#dc2626",marginBottom:4}}>{dead?"ПОГИБ":"РАНЕН"}</div>
      <div style={{background:dead?"rgba(255,255,255,0.1)":"#fff",borderRadius:10,padding:"8px 14px",marginBottom:10}}>
        <div style={{fontSize:9,color:dead?"#9ca3af":"#6b7280",marginBottom:2}}>{ev.attackerName+" нанёс "+ev.dmg+" урона"}</div>
        <div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}>
          <span style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:22,color:dead?"#6b7280":"#ef4444",textDecoration:dead?"line-through":"none"}}>{ev.oldHp}</span>
          <span style={{fontSize:14,color:dead?"#9ca3af":"#8b7e6a"}}>→</span>
          <span style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:28,color:dead?"#374151":"#dc2626"}}>{ev.newHp}</span>
          <span style={{fontSize:10,color:dead?"#6b7280":"#8b7e6a"}}>{"/ "+ev.maxHp}</span>
        </div>
        {!dead&&<div style={{marginTop:6,background:"#f0f0f0",borderRadius:4,height:8,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:pct<=25?"#dc2626":pct<=50?"#f59e0b":"#10b981",borderRadius:4,transition:"width 0.5s"}}/></div>}
      </div>
      {dead&&<div style={{fontSize:10,color:"#9ca3af",marginBottom:10}}>Персонаж потерял сознание или погиб</div>}
      <button onClick={pr.onClose} style={{width:"100%",padding:8,borderRadius:8,border:"none",background:dead?"#374151":"#ef4444",color:"#fff",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>OK</button>
    </div>
  </div>)}

/* ── NpcDeathPopup ── */
function NpcDeathPopup(pr){
  var ev=pr.event;if(!ev)return null;
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:996,animation:"fadeIn 0.15s"}} onClick={pr.onClose}>
    <div onClick={function(e){e.stopPropagation()}} style={{background:"linear-gradient(135deg,#fefcf5,#f5efe3)",border:"3px solid #1f2937",borderRadius:16,padding:"16px 22px",textAlign:"center",minWidth:240,boxShadow:"0 20px 60px rgba(0,0,0,0.4)",animation:"popIn 0.3s"}}>
      <div style={{fontSize:36,marginBottom:4}}>💀</div>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:16,marginBottom:4}}>{ev.npcName}</div>
      <div style={{fontSize:11,color:"#6b7280",marginBottom:12}}>повержен!</div>
      <button onClick={pr.onClose} style={{width:"100%",padding:8,borderRadius:8,border:"2px solid #1f2937",background:"#1f2937",color:"#fff",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>OK</button>
    </div>
  </div>)}


function RollPopup(p){if(!p.roll)return null;var r=p.roll;var iC=r.d10===10;var iF=r.d10===1;var isDmg=r.d10===null;
return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,animation:"fadeIn 0.2s"}} onClick={p.onClose}><div onClick={function(e){e.stopPropagation()}} style={{background:isDmg?"linear-gradient(135deg,#fef2f2,#fee2e2)":iC?"linear-gradient(135deg,#fef3c7,#fde68a)":iF?"linear-gradient(135deg,#fee2e2,#fecaca)":"linear-gradient(135deg,#fefcf5,#f5efe3)",border:isDmg?"3px solid #ef4444":iC?"3px solid #f59e0b":iF?"3px solid #ef4444":"3px solid #c4b8a4",borderRadius:16,padding:"16px 22px",textAlign:"center",minWidth:240,maxWidth:350,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",animation:"popIn 0.3s"}}><div style={{fontSize:12,color:"#5c5548",fontWeight:700,marginBottom:4}}>{r.label}</div><div style={{background:"#fff",border:"2px solid #e8e0d4",borderRadius:10,padding:"8px 10px",marginBottom:8}}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,flexWrap:"wrap"}}>{!isDmg&&<span style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:900,color:iC?"#d97706":iF?"#dc2626":"#3b82f6"}}>{"🎲"+r.d10}</span>}{(r.parts||[]).map(function(pt,i){return <span key={i} style={{display:"flex",alignItems:"center",gap:2}}><span style={{color:"#8b7e6a",fontSize:13}}>+</span><span style={{background:"#f5f0e8",borderRadius:5,padding:"2px 6px",textAlign:"center"}}><span style={{color:"#8b7e6a",fontSize:7,display:"block"}}>{pt.label}</span><span style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700}}>{pt.value}</span></span></span>})}</div></div><div style={{fontFamily:"'Cinzel',serif",fontSize:30,fontWeight:900,color:isDmg?"#dc2626":iC?"#d97706":iF?"#dc2626":"#2d2a24"}}>{"= "+r.total}</div>{iC&&<div style={{fontSize:13,color:"#d97706",fontWeight:700}}>🌟 КРИТ!</div>}{iF&&<div style={{fontSize:13,color:"#dc2626",fontWeight:700}}>💀 ПРОВАЛ!</div>}{r.subtext&&<div style={{fontSize:10,marginTop:3,color:"#6b21a8",fontWeight:600,whiteSpace:"pre-line"}}>{r.subtext}</div>}<button onClick={p.onClose} style={{marginTop:10,padding:"4px 18px",borderRadius:6,border:"2px solid #c4b8a4",background:"#fefdfb",fontWeight:700,fontSize:11,cursor:"pointer"}}>OK</button></div></div>)}

/* ── LOBBY ── */
function Lobby(pr){var _m=useState("menu"),md=_m[0],sM=_m[1];var _c=useState(""),cd=_c[0],sC=_c[1];var _n=useState(""),nm=_n[0],sN=_n[1];var _p=useState(""),ps=_p[0],sP=_p[1];var _e=useState(""),er=_e[0],sE=_e[1];var _l=useState(false),ld=_l[0],sL=_l[1];
var lb=function(c){return{width:"100%",padding:14,borderRadius:12,border:"2px solid "+c+"40",background:c+"10",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:15,color:c,cursor:"pointer"}};
var li={width:"100%",padding:"10px 12px",border:"2px solid #e8e0d4",borderRadius:8,fontSize:14,fontFamily:"'Nunito',sans-serif",background:"#fefdfb",outline:"none",textAlign:"center"};
return(<div style={{fontFamily:"'Nunito',sans-serif",background:"linear-gradient(180deg,#fefcf5,#f5efe3)",minHeight:"100vh",maxWidth:520,margin:"0 auto",display:"flex",flexDirection:"column",justifyContent:"center",padding:"20px 16px"}}><style>{CSS}</style><div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:28,fontFamily:"'Cinzel',serif",fontWeight:900,color:"#2d2a24"}}>✦ Nox Aeterna</div><div style={{fontSize:14,fontFamily:"'Cinzel',serif",color:"#8b7e6a",marginTop:4}}>Fantasy Companion</div></div>
{md==="menu"&&<div style={{display:"flex",flexDirection:"column",gap:10}}><button onClick={function(){sM("join");sE("")}} style={lb("#3b82f6")}>🎮 Войти в комнату</button><button onClick={function(){sM("create");sE("")}} style={lb("#10b981")}>🏰 Создать комнату (ГМ)</button><button onClick={function(){sM("gm");sE("")}} style={lb("#8b5cf6")}>🎭 Войти как ГМ</button></div>}
{md==="join"&&<div style={{display:"flex",flexDirection:"column",gap:10,background:"#fff",border:"2px solid #e8e0d4",borderRadius:14,padding:"20px 16px"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:17,textAlign:"center"}}>🎮 Войти</div><input style={li} value={cd} onChange={function(e){sC(e.target.value.toUpperCase())}} placeholder="Код комнаты" maxLength={6}/><input style={li} value={nm} onChange={function(e){sN(e.target.value)}} placeholder="Твоё имя"/>{er&&<div style={{color:"#ef4444",fontSize:11,textAlign:"center"}}>{er}</div>}<button onClick={function(){if(!cd.trim()||!nm.trim()){sE("Заполни все поля");return}sL(true);get(ref(db,"rooms/"+cd.trim())).then(function(s){sL(false);if(!s.exists()){sE("Не найдена");return}pr.onJoin(cd.trim(),nm.trim(),false)}).catch(function(e){sL(false);sE(e.message)})}} disabled={ld} style={lb("#3b82f6")}>{ld?"⏳...":"Войти"}</button><button onClick={function(){sM("menu")}} style={{background:"none",border:"none",color:"#8b7e6a",cursor:"pointer",fontSize:12}}>← Назад</button></div>}
{md==="create"&&<div style={{display:"flex",flexDirection:"column",gap:10,background:"#fff",border:"2px solid #e8e0d4",borderRadius:14,padding:"20px 16px"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:17,textAlign:"center"}}>🏰 Создать</div><input style={li} type="password" value={ps} onChange={function(e){sP(e.target.value)}} placeholder="Пароль ГМ"/>{er&&<div style={{color:"#ef4444",fontSize:11,textAlign:"center"}}>{er}</div>}<button onClick={function(){if(!ps.trim()){sE("Введи пароль");return}sL(true);var rc=genCode();set(ref(db,"rooms/"+rc),{gmPassword:ps.trim(),created:new Date().toISOString()}).then(function(){sL(false);pr.onJoin(rc,null,true)}).catch(function(e){sL(false);sE(e.message)})}} disabled={ld} style={lb("#10b981")}>{ld?"⏳...":"Создать"}</button><button onClick={function(){sM("menu")}} style={{background:"none",border:"none",color:"#8b7e6a",cursor:"pointer",fontSize:12}}>← Назад</button></div>}
{md==="gm"&&<div style={{display:"flex",flexDirection:"column",gap:10,background:"#fff",border:"2px solid #e8e0d4",borderRadius:14,padding:"20px 16px"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:17,textAlign:"center"}}>🎭 ГМ</div><input style={li} value={cd} onChange={function(e){sC(e.target.value.toUpperCase())}} placeholder="Код комнаты" maxLength={6}/><input style={li} type="password" value={ps} onChange={function(e){sP(e.target.value)}} placeholder="Пароль ГМ"/>{er&&<div style={{color:"#ef4444",fontSize:11,textAlign:"center"}}>{er}</div>}<button onClick={function(){if(!cd.trim()||!ps.trim()){sE("Заполни");return}sL(true);get(ref(db,"rooms/"+cd.trim())).then(function(s){sL(false);if(!s.exists()){sE("Не найдена");return}if(s.val().gmPassword!==ps.trim()){sE("Неверный пароль");return}pr.onJoin(cd.trim(),null,true)}).catch(function(e){sL(false);sE(e.message)})}} disabled={ld} style={lb("#8b5cf6")}>{ld?"⏳...":"Войти"}</button><button onClick={function(){sM("menu")}} style={{background:"none",border:"none",color:"#8b7e6a",cursor:"pointer",fontSize:12}}>← Назад</button></div>}
</div>)}

/* ── CharTab ── */
function RaceInfo(pr){var rc=pr.race;var _ro=useState(false);var rOpen=_ro[0];var sROpen=_ro[1];var desc=RACE_DESC[rc.id]||"";return(<div style={{background:"#f0f9ff",border:"1px solid #38bdf828",borderRadius:8,overflow:"hidden"}}><button onClick={function(){sROpen(!rOpen)}} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 7px",border:"none",background:"none",cursor:"pointer",textAlign:"left"}}><b style={{color:"#0369a1",fontSize:9}}>{rc.name}</b><span style={{fontSize:8,color:"#0369a1",transform:rOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span></button>{rOpen&&desc&&<div style={{padding:"4px 8px 6px",fontSize:9,color:"#0c4a6e",lineHeight:1.5,borderTop:"1px solid #bae6fd"}}>{desc}</div>}</div>)}
function ProfInfo(pr){var pf=pr.prof;var c=pr.char;var sv=pr.save;var fs=pr.finalStats;var es=pr.finalSkills;var oR=pr.onRoll;var _po=useState(false);var pOpen=_po[0];var sPOpen=_po[1];var pd=PROF_DESC[pf.id]||{};var merchantAlreadyUsed=!!c.merchantUsed;return(<div style={{background:"#fdf4ff",border:"1px solid #c084fc28",borderRadius:8,overflow:"hidden"}}><button onClick={function(){sPOpen(!pOpen)}} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 7px",border:"none",background:"none",cursor:"pointer"}}><span><b style={{color:"#7c3aed",fontSize:9}}>{pf.name}</b><span style={{fontSize:8,color:"#8b7e6a",marginLeft:4}}>{pf.ab}</span></span><span style={{fontSize:8,color:"#7c3aed",transform:pOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span></button>{pOpen&&<div style={{padding:"4px 8px 8px",borderTop:"1px solid #e9d5ff",display:"flex",flexDirection:"column",gap:5}}>{pd.desc&&<div style={{fontSize:9,color:"#4c1d95",lineHeight:1.5}}>{pd.desc}</div>}{pd.abilityDesc&&<div style={{background:"#f5f3ff",borderRadius:6,padding:"4px 7px"}}><div style={{fontSize:8,fontWeight:700,color:"#6d28d9",marginBottom:3}}>✨ {pf.abN}</div><div style={{fontSize:8,color:"#5b21b6",lineHeight:1.5,marginBottom:pd.abilityType!=="flavor"?6:0}}>{pd.abilityDesc}</div>{pd.abilityType==="roll_charisma"&&<button disabled={merchantAlreadyUsed} onClick={function(){if(merchantAlreadyUsed)return;sv(Object.assign({},c,{merchantUsed:true}));var d=r1(10);var ev=fs.EMP||0;var sk=es.Charisma||0;var t=d+ev+sk+5;if(pr.addLog)pr.addLog({who:c.name||"???",type:"skill",label:"💰 Мастер Обмена: Charisma +5",detail:"d10("+d+")+EMP("+ev+")+Charisma("+sk+")+5 = "+t,total:t});oR({label:"💰 Charisma (+5)",d10:d,parts:[{label:"EMP",value:ev},{label:"Charisma",value:sk},{label:"+5",value:5}],total:t})}} style={{width:"100%",padding:"5px",borderRadius:6,border:"none",background:merchantAlreadyUsed?"#e5e7eb":"#7c3aed",color:merchantAlreadyUsed?"#9ca3af":"#fff",fontWeight:700,fontSize:9,cursor:merchantAlreadyUsed?"not-allowed":"pointer"}}>{merchantAlreadyUsed?"✓ Использовано (отдых сбросит)":"💰 Бросить Charisma (+5)"}</button>}{pd.abilityType==="bonus_attack"&&<div style={{fontSize:8,color:"#6d28d9",fontStyle:"italic",padding:"2px 0"}}>⚔️ Кнопка активации во вкладке Бой</div>}{pd.abilityType==="check"&&<button onClick={function(){var d=r1(10);var hit=d>=6;if(pr.addLog)pr.addLog({who:c.name||"???",type:"skill",label:"🔨 Рука Мастера: оценка механизма",detail:"d10="+d+(hit?" ✅ Успех":" ❌ Неудача"),total:d});oR({label:"🔨 Рука Мастера",d10:d,parts:[],total:d,subtext:hit?"✅ Успех — оценено!":"❌ Неудача"})}} style={{width:"100%",padding:"5px",borderRadius:6,border:"none",background:"#f97316",color:"#fff",fontWeight:700,fontSize:9,cursor:"pointer"}}>🔨 Проверить механизм</button>}{pd.abilityType==="toggle"&&<div style={{fontSize:8,color:"#6d28d9",fontStyle:"italic",padding:"2px 0"}}>🔮 Кнопка активации во вкладке Бой</div>}</div>}</div>}</div>)}
function ArmorSection(pr){var c=pr.char;var sv=pr.save;var fs=pr.finalStats;var _saa=useState(false);var saa=_saa[0];var sSAA=_saa[1];var _an=useState("");var an=_an[0];var sAN=_an[1];var _at=useState("light");var at=_at[0];var sAT=_at[1];var _ah=useState(10);var ah=_ah[0];var sAH=_ah[1];var eqH=(c.armors||[]).find(function(a){return a.id===c.equippedHead});var eqB=(c.armors||[]).find(function(a){return a.id===c.equippedBody});
return <div style={{background:"#f8fafc",border:"2px solid #64748b18",borderRadius:9,padding:"7px 8px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><label style={S.lb}>🛡️ Броня</label><button onClick={function(){sSAA(!saa)}} style={{fontSize:8,background:"none",border:"none",cursor:"pointer",color:"#10b981",fontWeight:700}}>{saa?"✕":"+ Добавить"}</button></div>
{saa&&<div style={{background:"#f0f0ea",borderRadius:7,padding:6,marginBottom:5,display:"flex",flexDirection:"column",gap:3}}><input style={S.inp} value={an} onChange={function(e){sAN(e.target.value)}} placeholder="Название брони"/><div style={{display:"flex",gap:3}}><div style={{flex:1}}><select value={at} onChange={function(e){sAT(e.target.value)}} style={Object.assign({},S.inp,{fontSize:9,padding:3,cursor:"pointer"})}>{ARMOR_T.filter(function(a){return a.id!=="none"}).map(function(a){return <option key={a.id} value={a.id}>{a.name+" (Body\u2265"+a.bodyReq+")"}</option>})}</select></div><div style={{width:45}}><input style={Object.assign({},S.inp,{fontSize:9,padding:3})} type="number" value={ah} onChange={function(e){sAH(parseInt(e.target.value)||1)}} placeholder="HP"/></div></div><button onClick={function(){if(!an.trim())return;var at2=ARMOR_T.find(function(a){return a.id===at})||ARMOR_T[0];if(fs.BODY<at2.bodyReq){alert("BODY("+fs.BODY+")<"+at2.bodyReq);return}sv(Object.assign({},c,{armors:(c.armors||[]).concat([{id:Date.now(),name:an.trim(),type:at,hp:ah,maxHp:ah}])}));sAN("");sSAA(false)}} style={{padding:5,borderRadius:5,border:"none",background:"#10b981",color:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}>Добавить</button></div>}
{["head","body"].map(function(slot){var eq=slot==="head"?eqH:eqB;var atD=eq?ARMOR_T.find(function(a){return a.id===eq.type})||ARMOR_T[0]:null;var pct=eq&&eq.maxHp>0?(eq.hp/eq.maxHp)*100:0;return <div key={slot} style={{marginTop:4,padding:"4px 6px",background:eq?"#f0fdf4":"#fefdfb",border:"1px solid "+(eq?"#10b98120":"#e8e0d4"),borderRadius:6}}><div style={{fontSize:8,fontWeight:700,color:"#64748b"}}>{slot==="head"?"🧠 Голова":"🫀 Тело"}</div>{eq?<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:10,fontWeight:700}}>{eq.name} <span style={{fontSize:8,color:"#64748b"}}>{atD?atD.name:""}</span></span><div style={{display:"flex",alignItems:"center",gap:2}}><button onClick={function(){sv(Object.assign({},c,{armors:(c.armors||[]).map(function(a){return a.id===eq.id?Object.assign({},a,{hp:Math.max(0,a.hp-1)}):a})}))}} style={Object.assign({},S.sm,{width:16,height:16,fontSize:8})}>−</button><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11,color:eq.hp<=0?"#ef4444":"#10b981"}}>{eq.hp+"/"+eq.maxHp}</span><button onClick={function(){sv(Object.assign({},c,{armors:(c.armors||[]).map(function(a){return a.id===eq.id?Object.assign({},a,{hp:Math.min(a.maxHp,a.hp+1)}):a})}))}} style={Object.assign({},S.sm,{width:16,height:16,fontSize:8})}>+</button><button onClick={function(){var u={};u[slot==="head"?"equippedHead":"equippedBody"]=null;sv(Object.assign({},c,u))}} style={{fontSize:8,background:"#fee2e2",border:"1px solid #ef444420",borderRadius:4,padding:"1px 5px",cursor:"pointer",color:"#ef4444",fontWeight:700}}>Снять</button></div></div><div style={{background:"#fff",borderRadius:3,height:6,overflow:"hidden",marginTop:2}}><div style={{height:"100%",width:pct+"%",background:eq.hp<=0?"#ef4444":"#10b981",borderRadius:3}}/></div>{atD&&atD.desc&&<div style={{fontSize:7,color:"#64748b",marginTop:1}}>{atD.desc}</div>}</div>:<div style={{fontSize:9,color:"#8b7e6a",fontStyle:"italic"}}>Пусто</div>}</div>})}
{(c.armors||[]).length>0&&<div style={{marginTop:5}}><div style={{fontSize:8,fontWeight:700,color:"#64748b",marginBottom:2}}>Инвентарь брони:</div>{(c.armors||[]).map(function(a){var isEq=a.id===c.equippedHead||a.id===c.equippedBody;var atD2=ARMOR_T.find(function(x){return x.id===a.type})||ARMOR_T[0];return <div key={a.id} style={{display:"flex",alignItems:"center",gap:3,padding:"2px 4px",borderRadius:4,background:isEq?"#dbeafe":"#fefdfb",marginBottom:2,fontSize:9}}><span style={{flex:1,fontWeight:isEq?700:400}}>{a.name} <span style={{fontSize:7,color:"#64748b"}}>{atD2.name} {a.hp+"/"+a.maxHp}</span>{isEq&&<span style={{fontSize:7,color:"#3b82f6"}}> ЭКИП</span>}</span>{!isEq&&<button onClick={function(){if(fs.BODY<atD2.bodyReq){alert("BODY<"+atD2.bodyReq);return}sv(Object.assign({},c,{equippedHead:a.id}))}} style={{fontSize:7,padding:"1px 4px",borderRadius:3,border:"1px solid #3b82f620",background:"#eff6ff",cursor:"pointer",color:"#1d4ed8"}}>Гол</button>}{!isEq&&<button onClick={function(){if(fs.BODY<atD2.bodyReq){alert("BODY<"+atD2.bodyReq);return}sv(Object.assign({},c,{equippedBody:a.id}))}} style={{fontSize:7,padding:"1px 4px",borderRadius:3,border:"1px solid #3b82f620",background:"#eff6ff",cursor:"pointer",color:"#1d4ed8"}}>Тело</button>}<button onClick={function(){sv(Object.assign({},c,{armors:(c.armors||[]).filter(function(x){return x.id!==a.id}),equippedHead:c.equippedHead===a.id?null:c.equippedHead,equippedBody:c.equippedBody===a.id?null:c.equippedBody}))}} style={{fontSize:8,background:"none",border:"none",color:"#ef4444",cursor:"pointer"}}>✕</button></div>})}</div>}
</div>}
function CharTab(pr){var c=pr.char;var sv=pr.save;var oR=pr.onRoll;var gm=pr.isGM;var inf=cF(c);var rc=inf.race;var fs=inf.fs;var es=inf.eSk;var pf=PROFS.find(function(p){return p.id===c.profId})||PROFS[0];var stL=40-uSP(c.stats||{});var bsk=rc.bsp?1:0;var skL=(60+bsk)-uSkP(c.skills||{});var _os=useState(null);var oSt=_os[0];var sOS=_os[1];var avL=(c.lvlPts||0)-(c.spentLvlPts||0);var _un=useState(null);var undo=_un[0];var sU=_un[1];
function uS(k,d){var stats=Object.assign({},c.stats);if(c.locked&&!gm){if(d<0)return;if(avL<5)return;stats[k]=(stats[k]||0)+1;if(stats[k]>10)return;sv(Object.assign({},c,{stats:stats,spentLvlPts:(c.spentLvlPts||0)+5}));return}if(c.locked)return;stats[k]=(stats[k]||0)+d;if(stats[k]<1||stats[k]>8)return;if(uSP(stats)>40)return;sv(Object.assign({},c,{stats:stats}))}
function uSk(n,d){var skills=Object.assign({},c.skills);if(c.locked&&!gm){if(d<0)return;var sd=Object.values(SKD).flat().find(function(s){return s.name===n});var cost=sd&&sd.x2?4:2;if(avL<cost)return;skills[n]=(skills[n]||0)+1;if(skills[n]>10)return;sv(Object.assign({},c,{skills:skills,spentLvlPts:(c.spentLvlPts||0)+cost}));return}if(c.locked)return;skills[n]=(skills[n]||0)+d;if(skills[n]<0||skills[n]>10)return;if(uSkP(skills)>60+bsk)return;sv(Object.assign({},c,{skills:skills}))}
return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
<div style={{display:"flex",gap:4}}>{!c.locked&&<button onClick={function(){sU({name:c.name,raceId:c.raceId,humanBonusStat:c.humanBonusStat,stats:Object.assign({},c.stats),skills:Object.assign({},c.skills)});var r=rnd(c.profId);sv(Object.assign({},c,r,{curHp:null,curWill:null}))}} style={{flex:1,padding:8,borderRadius:8,border:"2px solid #f59e0b40",background:"#fef3c7",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:12,color:"#92400e",cursor:"pointer"}}>🎲 Рандом</button>}{!c.locked&&undo&&<button onClick={function(){sv(Object.assign({},c,undo,{curHp:null,curWill:null}));sU(null)}} style={{padding:"8px 12px",borderRadius:8,border:"2px solid #3b82f640",background:"#eff6ff",fontWeight:700,fontSize:12,color:"#3b82f6",cursor:"pointer"}}>↩️</button>}<button onClick={function(){sv(Object.assign({},c,{locked:!c.locked}))}} style={{padding:"8px 12px",borderRadius:8,border:c.locked?"2px solid #ef444440":"2px solid #10b98140",background:c.locked?"#fef2f2":"#ecfdf5",fontWeight:700,fontSize:12,cursor:"pointer",color:c.locked?"#ef4444":"#10b981",fontFamily:"'Cinzel',serif"}}>{c.locked?"🔒":"🔓"}</button></div>
{c.locked&&avL>0&&<div style={{background:"#fffbeb",border:"2px solid #f59e0b40",borderRadius:8,padding:"5px 8px",fontSize:10,fontWeight:700,color:"#92400e"}}>{"⬆️ Очки: "+avL}</div>}
<div style={{display:"flex",gap:5,flexWrap:"wrap"}}><div style={{flex:2,minWidth:120}}><label style={S.lb}>Имя</label><input style={S.inp} value={c.name||""} disabled={c.locked&&!gm} onChange={function(e){sv(Object.assign({},c,{name:e.target.value}))}}/></div><div style={{flex:1,minWidth:50}}><label style={S.lb}>Ур.</label><input style={Object.assign({},S.inp,{background:"#f0f0f0"})} value={c.level} disabled/></div></div>
<div><label style={S.lb}>Раса</label><select value={c.raceId} disabled={c.locked&&!gm} onChange={function(e){sv(Object.assign({},c,{raceId:e.target.value,curHp:null}))}} style={Object.assign({},S.inp,{cursor:"pointer"})}>{RACES.map(function(r){return <option key={r.id} value={r.id}>{r.name}</option>})}</select></div>
{rc.id!=="none"&&<RaceInfo race={rc}/>}
<div><label style={S.lb}>Профессия</label><select value={c.profId} disabled={c.locked&&!gm} onChange={function(e){sv(Object.assign({},c,{profId:e.target.value}))}} style={Object.assign({},S.inp,{cursor:"pointer"})}>{PROFS.map(function(p){return <option key={p.id} value={p.id}>{p.name}</option>})}</select></div>
{pf.id!=="none"&&<ProfInfo prof={pf} char={c} save={sv} finalStats={fs} finalSkills={es} onRoll={oR} addLog={pr.addLog}/>}
{!c.locked&&<div style={Object.assign({},S.bud,{background:stL===0?"#d1fae5":"#eff6ff",borderColor:stL===0?"#10b98140":"#3b82f640"})}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10}}>Статы</span><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13,color:stL===0?"#10b981":"#3b82f6"}}>{stL+"/40"}</span></div>}
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(95px,1fr))",gap:3}}>{SD.map(function(st){var b=(c.stats||{})[st.key]||1;var e=fs[st.key];var rb=e-b;return(<div key={st.key} style={{background:st.color+"08",border:"2px solid "+st.color+"18",borderRadius:8,padding:"4px 2px",textAlign:"center"}}><div style={{fontSize:11}}>{st.emoji}<span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:9,color:st.color,marginLeft:2}}>{st.key}</span></div><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2}}><button onClick={function(){uS(st.key,-1)}} style={Object.assign({},S.sm,{width:18,height:18,fontSize:9})}>−</button><button onClick={function(){var d=r1(10);var t=d+e;if(pr.addLog)pr.addLog({who:c.name||"???",type:"skill",label:"Бросок "+st.key,detail:"🎲"+d+" + "+st.key+"("+e+") = "+t,total:t});oR({label:st.key,d10:d,parts:[{label:st.key,value:e}],total:t})}} style={{fontFamily:"'Cinzel',serif",fontSize:17,fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>{e}</button><button onClick={function(){uS(st.key,1)}} style={Object.assign({},S.sm,{width:18,height:18,fontSize:9,color:st.color})}>+</button></div>{rb!==0&&<div style={{fontSize:7,color:rb>0?"#059669":"#dc2626",fontWeight:700}}>{"("+b+(rb>0?"+":"")+rb+")"}</div>}</div>)})}</div>
{!c.locked&&<div style={Object.assign({},S.bud,{background:skL===0?"#d1fae5":"#fef3c7",borderColor:skL===0?"#10b98140":"#f59e0b40"})}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10}}>Навыки</span><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13,color:skL===0?"#10b981":"#d97706"}}>{skL+"/"+(60+bsk)}</span></div>}
{SD.map(function(st){var sks=SKD[st.key];if(!sks)return null;var op=oSt===st.key;return(<div key={st.key} style={{border:"1px solid "+st.color+"15",borderRadius:8,overflow:"hidden"}}><button onClick={function(){sOS(op?null:st.key)}} style={{width:"100%",display:"flex",justifyContent:"space-between",padding:"5px 8px",background:st.color+"06",border:"none",cursor:"pointer"}}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:9,color:st.color}}>{st.emoji+" "+st.key}</span><span style={{fontSize:9,color:"#8b7e6a",transform:op?"rotate(180deg)":"none"}}>▼</span></button>{op&&<div style={{padding:"2px 5px 4px",display:"flex",flexDirection:"column",gap:1}}>{sks.map(function(sk){var ev=es[sk.name]||0;return(<div key={sk.name} style={{display:"flex",alignItems:"center",gap:2,padding:"2px 3px",borderRadius:4}}><button onClick={function(){var d=r1(10);var sv2=fs[st.key];var t=d+sv2+ev;if(pr.addLog)pr.addLog({who:c.name||"???",type:"skill",label:"Бросок "+sk.name,detail:"🎲"+d+" + "+st.key+"("+sv2+") + "+sk.name+"("+ev+") = "+t,total:t});oR({label:sk.name,d10:d,parts:[{label:st.key,value:sv2},{label:sk.name,value:ev}],total:t})}} style={{background:"none",border:"none",cursor:"pointer",fontSize:9,padding:0,opacity:ev>0?1:0.3}}>🎲</button><span style={{flex:1,fontSize:8,fontWeight:ev>0?700:400}}>{sk.name}{sk.x2&&<span style={{color:"#ef4444",fontSize:7}}>×2</span>}</span><span style={{fontSize:6,color:"#aaa"}}>{"d10+"+fs[st.key]+"+"+ev}</span><button onClick={function(){uSk(sk.name,-1)}} style={Object.assign({},S.sm,{width:16,height:16,fontSize:7})}>−</button><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11,minWidth:12,textAlign:"center",color:ev>0?st.color:"#ccc"}}>{ev}</span><button onClick={function(){uSk(sk.name,1)}} style={Object.assign({},S.sm,{width:16,height:16,fontSize:7,color:st.color})}>+</button></div>)})}</div>}</div>)})}
<div style={{border:"2px solid #e8e0d4",borderRadius:9,padding:8,background:"#fefdfb"}}><label style={S.lb}>📋 Профиль</label><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,marginTop:4}}><label style={{width:180,height:180,borderRadius:10,background:c.portrait?"none":"linear-gradient(135deg,#e8e0d4,#d4c4a0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:c.portrait?0:48,flexShrink:0,border:"2px solid #c4b8a4",cursor:"pointer",overflow:"hidden",position:"relative"}}>{c.portrait?<img src={c.portrait} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{textAlign:"center"}}><div>{(c.name||"?")[0]}</div><div style={{fontSize:10,color:"#8b7e6a",marginTop:4}}>📷 Загрузить фото</div></div>}<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){var file=e.target.files&&e.target.files[0];if(!file)return;if(file.size>500000){alert("Файл слишком большой! Макс. 500KB");return}var reader=new FileReader();reader.onload=function(ev){sv(Object.assign({},c,{portrait:ev.target.result}))};reader.readAsDataURL(file)}}/></label>{c.portrait&&<button onClick={function(){sv(Object.assign({},c,{portrait:""}))}} style={{fontSize:9,background:"none",border:"none",color:"#ef4444",cursor:"pointer"}}>✕ Удалить фото</button>}</div><div style={{marginTop:3}}><label style={{fontSize:6,fontWeight:700,color:"#5c5548"}}>Био</label><textarea style={Object.assign({},S.inp,{minHeight:45,resize:"vertical",fontSize:9,padding:3})} value={c.bio||""} onChange={function(e){sv(Object.assign({},c,{bio:e.target.value}))}}/></div></div>
{["friends","enemies"].map(function(lk){var isF=lk==="friends";var items=c[lk]||[];return <ContactList key={lk} label={isF?"🤝 Друзья":"⚔️ Враги"} color={isF?"#10b981":"#ef4444"} bg={isF?"#ecfdf5":"#fef2f2"} items={items} onChange={function(ni){sv(Object.assign({},c,function(){var o={};o[lk]=ni;return o}()))}}/>})}
</div>)}

/* ── ContactList ── */
function ContactList(pr){var _s=useState(false);var sa=_s[0];var sSA=_s[1];var _n=useState("");var cn=_n[0];var sCN=_n[1];var _r=useState("");var cr=_r[0];var sCR=_r[1];var _b=useState("");var cb=_b[0];var sCB=_b[1];var _re=useState("");var cre=_re[0];var sCRE=_re[1];var _ed=useState(null);var eid=_ed[0];var sEid=_ed[1];
function addC(){if(!cn.trim())return;if(eid){pr.onChange(pr.items.map(function(it){return it.id===eid?Object.assign({},it,{name:cn.trim(),race:cr.trim(),bio:cb.trim(),reason:cre.trim()}):it}));sEid(null)}else{pr.onChange(pr.items.concat([{id:Date.now(),name:cn.trim(),race:cr.trim(),bio:cb.trim(),reason:cre.trim()}]))}sCN("");sCR("");sCB("");sCRE("");sSA(false)}
function startEdit(it){sCN(it.name);sCR(it.race||"");sCB(it.bio||"");sCRE(it.reason||"");sEid(it.id);sSA(true)}
return(<div style={{border:"2px solid "+pr.color+"20",borderRadius:9,padding:"6px 8px",background:pr.bg+"60"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}><label style={Object.assign({},S.lb,{color:pr.color})}>{pr.label}</label><button onClick={function(){sSA(!sa);sEid(null);sCN("");sCR("");sCB("");sCRE("")}} style={{fontSize:8,background:"none",border:"none",cursor:"pointer",color:pr.color,fontWeight:700}}>{sa?"✕":"+ Добавить"}</button></div>
{sa&&<div style={{background:"#fff",borderRadius:6,padding:5,marginBottom:4,display:"flex",flexDirection:"column",gap:3,border:"1px solid #e8e0d4"}}><div style={{display:"flex",gap:3}}><div style={{flex:2}}><label style={{fontSize:6,fontWeight:700,color:"#5c5548"}}>Имя</label><input style={Object.assign({},S.inp,{fontSize:9,padding:3})} value={cn} onChange={function(e){sCN(e.target.value)}}/></div><div style={{flex:1}}><label style={{fontSize:6,fontWeight:700,color:"#5c5548"}}>Раса</label><input style={Object.assign({},S.inp,{fontSize:9,padding:3})} value={cr} onChange={function(e){sCR(e.target.value)}}/></div></div><div><label style={{fontSize:6,fontWeight:700,color:"#5c5548"}}>Био</label><input style={Object.assign({},S.inp,{fontSize:9,padding:3})} value={cb} onChange={function(e){sCB(e.target.value)}}/></div><div><label style={{fontSize:6,fontWeight:700,color:"#5c5548"}}>Причина</label><input style={Object.assign({},S.inp,{fontSize:9,padding:3})} value={cre} onChange={function(e){sCRE(e.target.value)}}/></div><button onClick={addC} style={{padding:4,borderRadius:4,border:"none",background:pr.color,color:"#fff",fontWeight:700,fontSize:9,cursor:"pointer"}}>{eid?"Сохранить":"Добавить"}</button></div>}
{pr.items.length===0&&!sa&&<div style={{textAlign:"center",padding:6,color:"#8b7e6a",fontStyle:"italic",fontSize:8}}>Пусто</div>}
{pr.items.map(function(it){return <div key={it.id} style={{display:"flex",alignItems:"flex-start",gap:4,padding:"4px 5px",borderRadius:5,background:"#fff",marginBottom:2,border:"1px solid #e8e0d4"}}><div style={{flex:1}}><div style={{fontSize:10,fontWeight:700}}>{it.name}{it.race&&<span style={{fontSize:8,color:"#8b7e6a",marginLeft:3}}>{it.race}</span>}</div>{it.bio&&<div style={{fontSize:8,color:"#6b7280"}}>{it.bio}</div>}{it.reason&&<div style={{fontSize:8,color:pr.color,fontStyle:"italic"}}>{it.reason}</div>}</div><button onClick={function(){startEdit(it)}} style={{background:"none",border:"none",fontSize:9,cursor:"pointer",color:"#3b82f6"}}>✏️</button><button onClick={function(){pr.onChange(pr.items.filter(function(x){return x.id!==it.id}))}} style={{background:"none",border:"none",fontSize:9,cursor:"pointer",color:"#ef4444"}}>✕</button></div>})}
</div>)}

/* ── CombatTab ── */
function CombatTab(pr){
var c=pr.char;var sv=pr.save;var oR=pr.onRoll;var inf=cF(c);var fs=inf.fs;var es=inf.eSk;
var pf=PROFS.find(function(p){return p.id===c.profId})||PROFS[0];
var _sa=useState(false);var sa=_sa[0];var sSA=_sa[1];
var _wn=useState("");var wn=_wn[0];var sWN=_wn[1];
var _wt=useState("Battle");var wt=_wt[0];var sWT=_wt[1];
var _wdt=useState("Р");var wdt=_wdt[0];var sWDT=_wdt[1];
var _wb=useState(0);var wb=_wb[0];var sWB=_wb[1];
var _wdi=useState("1d6");var wdi=_wdi[0];var sWDI=_wdi[1];
/* weapon edit state */
var _wed=useState(null);var editWId=_wed[0];var sEditWId=_wed[1];
var _wen=useState("");var editWn=_wen[0];var sEditWn=_wen[1];
var _wedi=useState("1d6");var editWdi=_wedi[0];var sEditWdi=_wedi[1];
var _wedt=useState("Р");var editWdt=_wedt[0];var sEditWdt=_wedt[1];
var _wet=useState("Battle");var editWt=_wet[0];var sEditWt=_wet[1];
var _web=useState(0);var editWb=_web[0];var sEditWb=_web[1];
function startEditW(w){sEditWId(w.id);sEditWn(w.name);sEditWdi(w.dmgDice||"1d6");sEditWdt(w.dmgType||"Р");sEditWt(w.type||"Battle");sEditWb(w.bonus||0);}
function saveEditW(){if(!editWId)return;sv(Object.assign({},c,{weapons:(c.weapons||[]).map(function(w){return w.id===editWId?Object.assign({},w,{name:editWn,dmgDice:editWdi,dmgType:editWdt,type:editWt,bonus:editWb}):w})}));sEditWId(null);}
var _tgt=useState(null);var tgtId=_tgt[0];var sTgt=_tgt[1];
var _zone=useState("Торс");var selZone=_zone[0];var sZone=_zone[1];
var spawned=pr.spawned||{};var saveSpawned=pr.saveSpawned;
var spawnedArr=Object.entries(spawned).filter(function(e){var hp=e[1].hp!==undefined?e[1].hp:e[1].maxHp;return hp>0});
var tgtNpc=tgtId?spawned[tgtId]:null;
var mx=c.hpOv||mHP(fs);var curHp=c.curHp!==null&&c.curHp!==undefined?c.curHp:mx;
var mxW=c.willOv||fs.WILL||1;var curW=c.curWill!==null&&c.curWill!==undefined?c.curWill:mxW;
var hpP=mx>0?(curHp/mx)*100:0;
var isGM=pr.isGM;
var visibleLogs=(pr.logs||[]).filter(function(l){return isGM||(l.type!=="dmg_npc"&&l.type!=="spawn")});
return(<div style={{display:"flex",flexDirection:"column",gap:8}}>

<div style={{background:"#fef2f2",border:"2px solid #ef444418",borderRadius:9,padding:"7px 9px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11}}>❤️ HP</span><div style={{display:"flex",alignItems:"center",gap:3}}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:14,color:"#ef4444"}}>{curHp}</span><span style={{color:"#8b7e6a"}}>/</span><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:14}}>{mx}</span></div></div>
<div style={{background:"#fff",borderRadius:4,height:10,overflow:"hidden"}}><div style={{height:"100%",width:hpP+"%",background:"#ef4444",borderRadius:4,transition:"width 0.3s"}}/></div>
<div style={{display:"flex",gap:2,justifyContent:"center",marginTop:4}}>{[-10,-5,-1,1,5,10].map(function(d){return <button key={d} onClick={function(){sv(Object.assign({},c,{curHp:Math.max(0,Math.min(mx,curHp+d))}))}} style={Object.assign({},S.ab,{background:d<0?"#ef444412":"#ef444420",color:"#ef4444",border:"1px solid #ef444418"})}>{d>0?"+"+d:d}</button>})}</div>
</div>

<div style={{display:"flex",gap:4}}>
<div style={{flex:1,background:"#f5f3ff",border:"2px solid #8b5cf618",borderRadius:9,padding:"5px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11}}>🔥 WILL</span>
<div style={{display:"flex",alignItems:"center",gap:2}}><button onClick={function(){sv(Object.assign({},c,{curWill:Math.max(0,curW-1)}))}} style={S.sm}>−</button><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13,color:"#8b5cf6"}}>{curW+"/"+mxW}</span><button onClick={function(){sv(Object.assign({},c,{curWill:Math.min(mxW,curW+1)}))}} style={S.sm}>+</button></div>
</div>
<button onClick={function(){sv(Object.assign({},c,{curHp:mx,curWill:mxW,warriorBonus:false,warriorBonusUsed:false,sensitiveBonus:false,merchantUsed:false}));pr.addLog({who:c.name||"???",type:"rest",label:"💤 Отдых — способности восстановлены",detail:"",total:0})}} style={{padding:"5px 10px",borderRadius:9,border:"2px solid #10b98120",background:"#ecfdf5",fontWeight:700,fontSize:10,color:"#065f46",cursor:"pointer"}}>💤</button>
</div>

{/* Броня игрока */}
<ArmorSection char={c} save={sv} finalStats={fs}/>

{/* NPC цели — видны всем игрокам */}
{spawnedArr.length>0&&<div style={{border:"2px solid #ef444428",borderRadius:9,padding:"6px 8px",background:"#fef2f2"}}>
<label style={Object.assign({},S.lb,{color:"#ef4444"})}>⚔️ Враги на поле боя</label>
<div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:3}}>
{spawnedArr.map(function(e){var nid=e[0];var n=e[1];var nHp=n.hp!==undefined?n.hp:n.maxHp;var hpPct=n.maxHp>0?(nHp/n.maxHp)*100:0;var isSel=tgtId===nid;
return <button key={nid} onClick={function(){sTgt(isSel?null:nid)}} style={{padding:"4px 8px",borderRadius:7,border:"2px solid "+(isSel?"#ef4444":"#e8e0d4"),background:isSel?"#fee2e2":"#fefdfb",fontSize:9,fontWeight:isSel?700:400,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:60}}>
<span style={{fontWeight:700}}>{n.name}</span>
<div style={{width:50,height:5,background:"#f0f0f0",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:hpPct+"%",background:hpPct<=25?"#ef4444":hpPct<=50?"#f59e0b":"#10b981",borderRadius:3}}/></div>
<span style={{fontSize:7,color:"#8b7e6a"}}>{nHp+"/"+n.maxHp+" HP"}</span>
</button>})}
</div>
{tgtNpc&&<div style={{marginTop:5,paddingTop:5,borderTop:"1px solid #fecaca"}}>
<label style={Object.assign({},S.lb,{color:"#ef4444",marginBottom:3})}>🎯 Зона удара → {tgtNpc.name}</label>
<div style={{display:"flex",flexWrap:"wrap",gap:2}}>
{ZONES.map(function(z){var isSel=selZone===z.name;return <button key={z.name} onClick={function(){sZone(z.name)}} style={{padding:"2px 6px",borderRadius:5,border:"2px solid "+(isSel?"#f59e0b":"#e8e0d4"),background:isSel?"#fffbeb":"#fefdfb",fontSize:8,fontWeight:isSel?700:400,cursor:"pointer"}}>{z.e+" "+z.name+(z.ignoreArmor?" 🔓":"")+" ×"+z.mult}</button>})}
</div>
</div>}
</div>}


{/* Способности профессий — Воин и Чувствительный */}
{(function(){
  if(pf.id==="warrior"){
    var warActive=c.warriorBonus;
    var warUsed=c.warriorBonusUsed;
    return(<div style={{background:"#fef2f2",border:"2px solid #ef444428",borderRadius:9,padding:"7px 9px"}}>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10,color:"#ef4444",marginBottom:4}}>⚔️ Стойкость Дуэлянта</div>
      <div style={{fontSize:8,color:"#6b7280",marginBottom:6}}>{warActive?"Активен — следующая атака +5":"Один раз в день: +5 к атаке в одном ходу"}</div>
      <div style={{display:"flex",gap:4}}>
        <button disabled={warUsed} onClick={function(){sv(Object.assign({},c,{warriorBonus:true,warriorBonusUsed:true}))}} style={{flex:1,padding:"6px",borderRadius:7,border:"none",background:warUsed?"#e5e7eb":warActive?"#10b981":"#ef4444",color:warUsed?"#9ca3af":"#fff",fontWeight:700,fontSize:10,cursor:warUsed?"not-allowed":"pointer"}}>{warUsed?(warActive?"⚔️ +5 активен":"✓ Использовано сегодня"):"⚔️ Активировать +5"}</button>
        {warActive&&<button onClick={function(){sv(Object.assign({},c,{warriorBonus:false}))}} style={{padding:"6px 10px",borderRadius:7,border:"1px solid #e8e0d4",background:"#fefdfb",fontSize:9,cursor:"pointer",color:"#8b7e6a"}}>Снять</button>}
        {warUsed&&<button onClick={function(){sv(Object.assign({},c,{warriorBonus:false,warriorBonusUsed:false}))}} title="Сбросить (новый день)" style={{padding:"6px 8px",borderRadius:7,border:"1px solid #e8e0d4",background:"#fefdfb",fontSize:9,cursor:"pointer",color:"#8b7e6a"}}>🔄</button>}
      </div>
    </div>);
  }
  if(pf.id==="sensitive"){
    var senActive=c.sensitiveBonus;
    return(<div style={{background:"#fdf4ff",border:"2px solid #7c3aed28",borderRadius:9,padding:"7px 9px"}}>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10,color:"#7c3aed",marginBottom:4}}>🔮 Хаотический Всплеск</div>
      <div style={{fontSize:8,color:"#6b7280",marginBottom:6}}>{senActive?"+1d6 к заклинаниям активен (до провала)":"Добавляет +1d6 к урону заклинаний до первой неудачи"}</div>
      <button onClick={function(){sv(Object.assign({},c,{sensitiveBonus:!senActive}))}} style={{width:"100%",padding:"6px",borderRadius:7,border:"none",background:senActive?"#10b981":"#7c3aed",color:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}>{senActive?"🟢 +1d6 активен — нажать чтобы снять":"🔮 Активировать Хаот. Всплеск"}</button>
    </div>);
  }
  return null;
})()}

<div style={{display:"flex",gap:3}}>
<button onClick={function(){var d=r1(6);var z=ZONES[d-1];sZone(z.name);pr.addLog({who:c.name||"???",type:"zone",label:z.e+" "+z.name+" ×"+z.mult,detail:"1d6="+d,total:d});oR({label:"🎯 Зона",d10:d,parts:[],total:d,subtext:z.e+" "+z.name+" ×"+z.mult+(z.ignoreArmor?" (игнор брони)":"")})}} style={{flex:1,padding:7,borderRadius:7,border:"2px solid #f59e0b28",background:"#fffbeb",cursor:"pointer",fontWeight:700,fontSize:10,color:"#92400e"}}>🎯 Зона</button>
<button onClick={function(){var d=r1(10);var dv=fs.DEX||0;var dg=es.Dodge||0;var t=d+dv+dg;pr.addLog({who:c.name||"???",type:"dodge",label:"🛡️ Уклонение",detail:"🎲"+d+" + DEX("+dv+") + Dodge("+dg+") = "+t,total:t});oR({label:"🛡️ Уклонение",d10:d,parts:[{label:"DEX",value:dv},{label:"Dodge",value:dg}],total:t})}} style={{flex:1,padding:7,borderRadius:7,border:"2px solid #10b98128",background:"#ecfdf5",cursor:"pointer",fontWeight:700,fontSize:10,color:"#065f46"}}>🛡️ Уклон.</button>
</div>

{/* Чувствительный */}
{pf.id==="sensitive"&&<button onClick={function(){
  if(curW<=0){alert("Нет WILL!");return}
  sv(Object.assign({},c,{curWill:curW-1}));
  var dmg=rN(3,12);var dT=sm(dmg);var bon=rN(1,6);var bT=sm(bon);var extraD6=c.sensitiveBonus?r1(6):0;var ft=dT+bT+extraD6;
  var hit=r1(6);var ok=hit<=3;var sub="";
  if(ok){
    /* Попадание — урон по выбранному NPC */
    if(tgtNpc&&tgtId&&saveSpawned){
      applyDmgToNpc(tgtNpc,ft,"Д",selZone,saveSpawned,spawned,tgtId,pr.addLog,c.name||"???",pr.onNpcDeath);
    }
    sub="✨ ПОПАД! "+ft+"\n−1 WILL"+(tgtNpc?" → "+tgtNpc.name:" (нет цели)");
    pr.addLog({who:c.name||"???",type:"magic",label:"🔮 Заклинание ПОПАД!"+(tgtNpc?" → "+tgtNpc.name:""),detail:"3d12+1d6="+ft,total:ft});
  } else {
    var cat2=r1(2);
    if(cat2===1){
      /* Обратный — урон себе, сбросить бонус */
      sv(Object.assign({},c,{curHp:Math.max(0,curHp-ft),curWill:Math.max(0,curW-1),sensitiveBonus:false}));
      sub="💥 ОБРАТНЫЙ! "+ft+" урона СЕБЕ\n−1 WILL";
      pr.addLog({who:c.name||"???",type:"magic_fail",label:"💥 Обратный! Урон себе: "+ft,detail:"",total:ft});
    } else {
      /* Дружественный — урон случайному активному союзнику */
      var actAllies=(pr.characters||[]).filter(function(x){return x._fbId!==c._fbId&&x.active});
      if(!actAllies.length)actAllies=(pr.characters||[]).filter(function(x){return x._fbId!==c._fbId});
      var ally=actAllies.length>0?pk(actAllies):null;
      if(ally&&pr.room){
        var aInf=cF(ally);var aFs=aInf.fs;
        var aMx=ally.hpOv||mHP(aFs);
        var aCur=ally.curHp!==null&&ally.curHp!==undefined?ally.curHp:aMx;
        var aNewHp=Math.max(0,aCur-ft);
        var aUpd=Object.assign({},ally,{curHp:aNewHp});delete aUpd._fbId;
        set(ref(db,"rooms/"+pr.room+"/characters/"+ally._fbId),aUpd);
        set(ref(db,"rooms/"+pr.room+"/dmgEvents/"+ally._fbId),{attackerName:(c.name||"???")+' (магия)',dmg:ft,oldHp:aCur,newHp:aNewHp,maxHp:aMx,ts:Date.now()});
      }
      sub="🔥 ДРУЖЕСТВ! "+ft+(ally?" → "+ally.name:"")+"\n−1 WILL";
      pr.addLog({who:c.name||"???",type:"magic_fail",label:"🔥 Дружественный огонь!"+(ally?" → "+ally.name:""),detail:"Урон: "+ft,total:ft});
    }
  }
  oR({label:"🔮 Закл.",d10:hit,parts:[{label:"3d12",value:dT},{label:"1d6",value:bT}],total:ft,subtext:sub});
}} style={{padding:7,borderRadius:7,border:"2px solid #7c3aed20",background:"#fdf4ff",cursor:"pointer",fontWeight:700,fontSize:10,color:"#7c3aed"}}>{"🔮 Закл. (−1W) "+(curW<=0?"⛔":"")+(tgtNpc?" → "+tgtNpc.name:"")}</button>}

{/* Оружие */}
<div>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><label style={S.lb}>⚔️ Оружие</label><button onClick={function(){sSA(!sa)}} style={{fontSize:8,background:"none",border:"none",cursor:"pointer",color:"#10b981",fontWeight:700}}>{sa?"✕":"+"}</button></div>
{sa&&<div style={{background:"#f8f6f0",border:"1px solid #e8e0d4",borderRadius:8,padding:6,marginBottom:4,display:"flex",flexDirection:"column",gap:3}}><input style={S.inp} value={wn} onChange={function(e){sWN(e.target.value)}} placeholder="Название"/><div style={{display:"flex",gap:3}}><select value={wt} onChange={function(e){sWT(e.target.value)}} style={Object.assign({},S.inp,{flex:1,fontSize:9,padding:3})}>{WT.map(function(t){return <option key={t} value={t}>{t}</option>})}</select><select value={wdt} onChange={function(e){sWDT(e.target.value)}} style={Object.assign({},S.inp,{width:38,fontSize:9,padding:3})}>{DT.map(function(t){return <option key={t} value={t}>{t}</option>})}</select></div><div style={{display:"flex",gap:3}}><input style={Object.assign({},S.inp,{flex:1,fontSize:9,padding:3})} value={wdi} onChange={function(e){sWDI(e.target.value)}} placeholder="1d6"/><input style={Object.assign({},S.inp,{width:40,fontSize:9,padding:3})} type="number" value={wb} onChange={function(e){sWB(parseInt(e.target.value)||0)}} placeholder="Бнс"/></div><button onClick={function(){if(!wn.trim())return;sv(Object.assign({},c,{weapons:(c.weapons||[]).concat([{id:Date.now(),name:wn.trim(),type:wt,dmgType:wdt,bonus:wb,dmgDice:wdi}])}));sWN("");sSA(false)}} style={{padding:5,borderRadius:5,border:"none",background:"#10b981",color:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}>Добавить</button></div>}
{(c.weapons||[]).map(function(w){var sk=WS[w.type]||"Simple Weapon";return(<div key={w.id} style={{background:"#fefdfb",border:"1px solid #e8e0d4",borderRadius:8,padding:"5px 7px",marginBottom:3}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11}}>{w.name} <span style={{fontSize:7,color:"#8b7e6a"}}>{w.type+" "+w.dmgDice+" "+w.dmgType}</span></span><button onClick={function(){sv(Object.assign({},c,{weapons:(c.weapons||[]).filter(function(x){return x.id!==w.id})}))}} style={{background:"none",border:"none",color:"#ef4444",fontSize:10,cursor:"pointer"}}>✕</button></div>
<div style={{display:"flex",gap:3}}>
<button onClick={function(){var d=r1(10);var rv=fs.REF||0;var sv2=es[sk]||0;var warBon=(c.warriorBonus&&pf.id==="warrior")?5:0;if(warBon)sv(Object.assign({},c,{warriorBonus:false}));var t=d+rv+sv2+(w.bonus||0)+warBon;pr.addLog({who:c.name||"???",type:"hit",label:"🎯 "+w.name+(tgtNpc?" → "+tgtNpc.name:"")+(warBon?" ⚔️+5":""),detail:"🎲"+d+" + REF("+rv+") + "+sk+"("+sv2+") + бонус("+(w.bonus||0)+") = "+t,total:t});
if(tgtNpc&&tgtId&&pr.savePendingAttack){pr.savePendingAttack({id:"atk_"+Date.now(),fromPlayer:true,attackerName:c.name||"???",npcId:tgtId,npcName:tgtNpc.name,hitRoll:t,atkD:d,atkREF:rv,atkSkill:sv2,atkSkillName:sk,atkBonus:w.bonus||0,weaponName:w.name,dmgDice:w.dmgDice||"1d6",dmgType:w.dmgType||"Р",dmgBonus:w.bonus||0,zone:selZone,status:"pending_dodge",ts:Date.now()});}
oR({label:w.name+" Попад.",d10:d,parts:[{label:"REF",value:rv},{label:sk,value:sv2},{label:"Бнс",value:w.bonus||0}],total:t})}} style={{flex:1,padding:4,borderRadius:5,border:"1px solid #3b82f620",background:"#eff6ff",cursor:"pointer",fontWeight:700,fontSize:9,color:"#1d4ed8",textAlign:"center"}}>{"🎯"+(tgtNpc?" →"+tgtNpc.name.slice(0,8):"")}</button>
<button onClick={function(){
  var m=w.dmgDice.match(/(\d+)d(\d+)/);if(!m)return;
  var dice=rN(parseInt(m[1]),parseInt(m[2]));
  var warDmgBon=(c.warriorBonus&&pf.id==="warrior")?5:0;
  if(warDmgBon)sv(Object.assign({},c,{warriorBonus:false}));
  var rawDmg=sm(dice)+(w.bonus||0)+warDmgBon;
  if(tgtNpc&&tgtId&&saveSpawned){
    applyDmgToNpc(tgtNpc,rawDmg,w.dmgType,selZone,saveSpawned,spawned,tgtId,pr.addLog,c.name||"???",pr.onNpcDeath);
  } else {
    pr.addLog({who:c.name||"???",type:"dmg",label:"💥 "+w.name+" ("+w.dmgType+")"+(warDmgBon?" ⚔️+5":""),detail:w.dmgDice+"["+dice.join(",")+"]"+(w.bonus||0?"+бнс("+(w.bonus||0)+")":"")+(warDmgBon?"+⚔️5":"")+" = "+rawDmg,total:rawDmg});
  }
  /* Попап урона — без d10, просто кубики + итог */
  oR({label:w.name+" 💥 Урон",d10:null,parts:[{label:w.dmgDice,value:sm(dice)},{label:"Бнс",value:(w.bonus||0)+warDmgBon}],total:rawDmg,subtext:"Тип: "+w.dmgType+(warDmgBon?" ⚔️+5":"")+(tgtNpc?" → "+tgtNpc.name+"\nЗона: "+selZone:" (нет цели)")});
}} style={{flex:1,padding:4,borderRadius:5,border:"1px solid #ef444420",background:"#fef2f2",cursor:"pointer",fontWeight:700,fontSize:9,color:"#dc2626",textAlign:"center"}}>{"💥"+(tgtNpc?" →"+tgtNpc.name.slice(0,8):"")}</button>
</div></div>)})}
</div>

<div><label style={S.lb}>📜 Лог</label><div style={{maxHeight:120,overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>{visibleLogs.length===0&&<div style={{textAlign:"center",padding:8,color:"#8b7e6a",fontSize:9}}>Пусто</div>}{visibleLogs.map(function(l,i){return <div key={i} style={{background:"#fefdfb",border:"1px solid #e8e0d420",borderRadius:4,padding:"3px 5px",fontSize:8}}><b>{(l.who||"")}: {l.label}</b>{l.detail&&<div style={{fontSize:7,color:"#6b7280"}}>{l.detail}</div>}{l.total>0&&<div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:12}}>{"= "+l.total}</div>}</div>})}</div></div>
</div>)}

/* ── InvTab ── */
function InvTab(pr){var c=pr.char;var sv=pr.save;var _a=useState("");var ni=_a[0];var sNI=_a[1];
return(<div style={{display:"flex",flexDirection:"column",gap:6}}><div style={{display:"flex",gap:3}}><input style={Object.assign({},S.inp,{flex:2})} value={ni} onChange={function(e){sNI(e.target.value)}} placeholder="Предмет..." onKeyDown={function(e){if(e.key==="Enter"&&ni.trim()){sv(Object.assign({},c,{inventory:(c.inventory||[]).concat([{id:Date.now(),name:ni.trim(),qty:1,equipped:false}])}));sNI("")}}}/><button onClick={function(){if(!ni.trim())return;sv(Object.assign({},c,{inventory:(c.inventory||[]).concat([{id:Date.now(),name:ni.trim(),qty:1,equipped:false}])}));sNI("")}} style={Object.assign({},S.ab,{background:"#10b981",color:"#fff",fontWeight:700,border:"none"})}>+</button></div>
<div style={{background:"#fef3c7",borderRadius:8,padding:"5px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10}}>💰</span><div style={{display:"flex",alignItems:"center",gap:2}}>{[-10,-1].map(function(d){return <button key={d} onClick={function(){sv(Object.assign({},c,{gold:Math.max(0,(c.gold||0)+d)}))}} style={S.sm}>{d}</button>})}<span style={{fontFamily:"'Cinzel',serif",fontSize:14,fontWeight:700,color:"#d97706",minWidth:24,textAlign:"center"}}>{c.gold||0}</span>{[1,10].map(function(d){return <button key={d} onClick={function(){sv(Object.assign({},c,{gold:(c.gold||0)+d}))}} style={S.sm}>{"+"+d}</button>})}</div></div>
{(c.inventory||[]).map(function(it){return <div key={it.id} style={{display:"flex",alignItems:"center",gap:3,background:it.equipped?"#dbeafe":"#fefdfb",border:"1px solid #e8e0d4",borderRadius:5,padding:"3px 6px"}}><button onClick={function(){sv(Object.assign({},c,{inventory:(c.inventory||[]).map(function(i){return i.id===it.id?Object.assign({},i,{equipped:!i.equipped}):i})}))}} style={{background:"none",border:"none",fontSize:11,cursor:"pointer"}}>{it.equipped?"🛡️":"📦"}</button><span style={{flex:1,fontSize:9}}>{it.name}</span><button onClick={function(){sv(Object.assign({},c,{inventory:(c.inventory||[]).map(function(i){return i.id===it.id?Object.assign({},i,{qty:Math.max(0,i.qty-1)}):i}).filter(function(i){return i.qty>0})}))}} style={Object.assign({},S.sm,{width:16,height:16,fontSize:7})}>−</button><span style={{fontSize:9,fontWeight:700}}>{it.qty}</span><button onClick={function(){sv(Object.assign({},c,{inventory:(c.inventory||[]).map(function(i){return i.id===it.id?Object.assign({},i,{qty:i.qty+1}):i})}))}} style={Object.assign({},S.sm,{width:16,height:16,fontSize:7})}>+</button><button onClick={function(){sv(Object.assign({},c,{inventory:(c.inventory||[]).filter(function(i){return i.id!==it.id})}))}} style={{background:"none",border:"none",color:"#ef4444",fontSize:9,cursor:"pointer"}}>✕</button></div>})}
</div>)}

/* ── MapView ── */
var TOKEN_COLORS=["#ef4444","#f97316","#f59e0b","#eab308","#84cc16","#10b981","#06b6d4","#3b82f6","#6366f1","#8b5cf6","#ec4899","#1f2937","#ffffff","#a16207","#0f766e","#7c3aed","#be185d","#b45309","#374151","#dc2626"];
function MapView(pr){var md=pr.mapData||{};var sMD=pr.saveMap;var chars=pr.characters||[];var isGM=pr.isGM;var cId=pr.charId;var img=md.image||"";var tokens=md.tokens||[];
var _dr=useState(null);var drId=_dr[0];var sDrId=_dr[1];
var _off=useState({x:0,y:0});var drOff=_off[0];var sDrOff=_off[1];
var _sn=useState(false);var sn=_sn[0];var sSN=_sn[1];
var _nn=useState("");var nn=_nn[0];var sNN=_nn[1];
var _nc=useState("#ef4444");var nc=_nc[0];var sNC=_nc[1];
var _ns=useState(6);var ns=_ns[0];var sNS=_ns[1];
var _zoom=useState(1);var zoom=_zoom[0];var sZoom=_zoom[1];
var allT=tokens.slice();
function saveTk(nt){if(sMD)sMD(Object.assign({},md,{tokens:nt}))}
function canDr(t){return isGM||(t.charId&&t.charId===cId)}
var _imgEl=useState(null);var imgEl=_imgEl[0];var sImgEl=_imgEl[1];
/* Перевести экранные координаты в % относительно натурального (не зумированного) размера картинки */
function toPct(e){
  if(!imgEl)return null;
  var r=imgEl.getBoundingClientRect();
  var cx=e.touches?e.touches[0].clientX:e.clientX;
  var cy=e.touches?e.touches[0].clientY:e.clientY;
  /* r.width уже зумированный = natW*zoom, r.height = natH*zoom */
  return{
    x:Math.max(0,Math.min(100,((cx-r.left)/r.width)*100)),
    y:Math.max(0,Math.min(100,((cy-r.top)/r.height)*100))
  };
}
function startDr(e,t){if(!canDr(t))return;e.preventDefault();var p=toPct(e);if(!p)return;sDrId(t.id);sDrOff({x:p.x-t.x,y:p.y-t.y})}
function onMv(e){if(!drId)return;e.preventDefault();var p=toPct(e);if(!p)return;saveTk(allT.map(function(t){return t.id===drId?Object.assign({},t,{x:Math.max(0,Math.min(100,p.x-drOff.x)),y:Math.max(0,Math.min(100,p.y-drOff.y))}):t}))}
function endDr(){sDrId(null)}
if(!img)return <div style={{textAlign:"center",padding:"30px 10px"}}><div style={{fontSize:40}}>🗺️</div><div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:14}}>Карта Аэтернии</div>{isGM?<label style={{display:"inline-block",marginTop:10,padding:"10px 20px",borderRadius:8,border:"2px dashed #10b981",background:"#ecfdf5",fontWeight:700,fontSize:12,color:"#065f46",cursor:"pointer"}}>📁 Загрузить карту<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){if(sMD)sMD(Object.assign({},md,{image:ev.target.result}))};r.readAsDataURL(f)}}/></label>:<div style={{fontSize:10,color:"#8b7e6a",marginTop:8}}>Мастер ещё не загрузил карту</div>}</div>;
return <div style={{display:"flex",flexDirection:"column",gap:6}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
  <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13}}>🗺️ Карта</div>
  <div style={{display:"flex",alignItems:"center",gap:4}}>
    <button onClick={function(){sZoom(function(z){return Math.max(0.25,+(z-0.25).toFixed(2))})}} style={{width:24,height:24,borderRadius:5,border:"1px solid #e8e0d4",background:"#fefdfb",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
    <span style={{fontSize:9,fontWeight:700,minWidth:32,textAlign:"center"}}>{Math.round(zoom*100)+"%"}</span>
    <button onClick={function(){sZoom(function(z){return Math.min(5,+(z+0.25).toFixed(2))})}} style={{width:24,height:24,borderRadius:5,border:"1px solid #e8e0d4",background:"#fefdfb",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
    <button onClick={function(){sZoom(1)}} style={{padding:"2px 6px",borderRadius:5,border:"1px solid #e8e0d4",background:"#fefdfb",fontSize:8,cursor:"pointer",color:"#8b7e6a"}}>1:1</button>
  </div>
</div>
<div style={{overflow:"auto",borderRadius:10,border:"2px solid #e8e0d4",background:"#1a1a2e",maxHeight:500,touchAction:"none",userSelect:"none"}} onMouseMove={onMv} onMouseUp={endDr} onMouseLeave={endDr} onTouchMove={onMv} onTouchEnd={endDr}>
  {/* Единственный контейнер — картинка с position:relative, токены absolute внутри неё */}
  <div style={{position:"relative",display:"inline-block",lineHeight:0}}>
    <img ref={function(el){sImgEl(el)}} src={img}
      style={{
        display:"block",
        width:(imgEl?imgEl.naturalWidth*zoom:300)+"px",
        maxWidth:"none",
        pointerEvents:"none"
      }} alt="map"/>
    {allT.map(function(t){
      var sz=Math.max(2,t.size||6);
      return <div key={t.id}
        onMouseDown={function(e){startDr(e,t)}}
        onTouchStart={function(e){startDr(e,t)}}
        style={{
          position:"absolute",
          left:t.x+"%",
          top:t.y+"%",
          width:sz+"px",
          height:sz+"px",
          borderRadius:"50%",
          background:t.color||"#3b82f6",
          border:sz>=4?"1.5px solid rgba(255,255,255,0.85)":"none",
          boxShadow:drId===t.id?"0 0 0 2px #fff,0 0 6px rgba(255,255,255,0.5)":"0 1px 3px rgba(0,0,0,0.8)",
          transform:"translate(-50%,-50%)",
          cursor:canDr(t)?"grab":"default",
          zIndex:drId===t.id?50:10,
          pointerEvents:"all"
        }} title={t.name}/>
    })}
  </div>
</div>
<div style={{display:"flex",flexWrap:"wrap",gap:3}}>{allT.map(function(t){var sz=t.size||6;return <div key={t.id} style={{display:"flex",alignItems:"center",gap:3,background:"#fefdfb",border:"1px solid #e8e0d4",borderRadius:5,padding:"2px 5px",fontSize:8}}><div style={{width:8,height:8,borderRadius:"50%",background:t.color||"#3b82f6",border:"1px solid #e8e0d4",flexShrink:0}}/><span style={{fontWeight:600}}>{t.name}</span>{(isGM||t.charId===cId)&&<span style={{display:"flex",gap:1,alignItems:"center"}}><button onClick={function(){saveTk(allT.map(function(x){return x.id===t.id?Object.assign({},x,{size:Math.max(2,sz-1)}):x}))}} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#8b7e6a",lineHeight:1}}>−</button><span style={{fontSize:7,minWidth:16,textAlign:"center"}}>{sz}px</span><button onClick={function(){saveTk(allT.map(function(x){return x.id===t.id?Object.assign({},x,{size:Math.min(60,sz+1)}):x}))}} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#8b7e6a",lineHeight:1}}>+</button></span>}{isGM&&<button onClick={function(){saveTk(allT.filter(function(x){return x.id!==t.id}))}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:8}}>✕</button>}</div>})}</div>
{!isGM&&cId&&!allT.find(function(t){return t.charId===cId})&&<button onClick={function(){var me=chars.find(function(c2){return(c2._fbId||c2.id)===cId});saveTk(allT.concat([{id:"ch-"+cId,charId:cId,name:me?me.name:"?",x:50,y:50,color:"#3b82f6",size:6,type:"player"}]))}} style={{padding:"6px 12px",borderRadius:7,border:"2px solid #3b82f630",background:"#eff6ff",fontWeight:700,fontSize:10,color:"#1d4ed8",cursor:"pointer",width:"100%"}}>📍 Создать мой жетон на карте</button>}
{isGM&&<div style={{display:"flex",gap:3}}><button onClick={function(){sSN(!sn)}} style={{flex:1,padding:6,borderRadius:6,border:"2px solid #ef444420",background:"#fef2f2",fontWeight:700,fontSize:9,color:"#ef4444",cursor:"pointer"}}>{sn?"✕":"👹 + NPC"}</button><label style={{padding:"6px 10px",borderRadius:6,border:"2px solid #10b98120",background:"#ecfdf5",fontWeight:700,fontSize:9,color:"#065f46",cursor:"pointer",textAlign:"center"}}>🖼️ Сменить<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){if(sMD)sMD(Object.assign({},md,{image:ev.target.result}))};r.readAsDataURL(f)}}/></label></div>}
{isGM&&sn&&<div style={{background:"#fef2f2",border:"1px solid #ef444420",borderRadius:7,padding:6,display:"flex",flexDirection:"column",gap:4}}><input style={S.inp} value={nn} onChange={function(e){sNN(e.target.value)}} placeholder="Имя токена"/>
<div style={{display:"flex",gap:2,flexWrap:"wrap"}}>{TOKEN_COLORS.map(function(cl){return <button key={cl} onClick={function(){sNC(cl)}} style={{width:18,height:18,borderRadius:"50%",background:cl,border:nc===cl?"3px solid #374151":"1.5px solid #ddd",boxShadow:nc===cl?"0 0 0 2px "+cl:"none",cursor:"pointer",flexShrink:0}}/>})}</div>
<div style={{display:"flex",gap:3,alignItems:"center"}}><label style={{fontSize:8,fontWeight:700,color:"#5c5548",whiteSpace:"nowrap"}}>Размер (px):</label><input style={Object.assign({},S.inp,{width:50,fontSize:9,padding:2,textAlign:"center"})} type="number" min={2} max={60} value={ns} onChange={function(e){sNS(parseInt(e.target.value)||4)}}/><span style={{fontSize:8,color:"#8b7e6a"}}>мин 2, макс 60</span></div>
<button onClick={function(){if(!nn.trim())return;saveTk(allT.concat([{id:"npc-"+Date.now(),name:nn.trim(),x:50,y:50,color:nc,size:ns,type:"npc"}]));sNN("");sSN(false)}} style={{padding:5,borderRadius:5,border:"none",background:"#ef4444",color:"#fff",fontWeight:700,fontSize:9,cursor:"pointer"}}>Добавить токен</button></div>}
</div>}

function LibTab(pr){var lore=pr.lore||{};var _s=useState(null);var oid=_s[0];var sO=_s[1];var ch=oid?LORE_CH.find(function(x){return x.id===oid}):null;
if(ch&&ch.id==="map")return <div style={{display:"flex",flexDirection:"column",gap:8}}><button onClick={function(){sO(null)}} style={{alignSelf:"flex-start",padding:"4px 10px",borderRadius:6,border:"2px solid #e8e0d4",background:"#fefdfb",fontWeight:700,fontSize:10,cursor:"pointer"}}>← Назад</button><MapView mapData={pr.mapData} saveMap={pr.saveMap} characters={pr.characters} isGM={pr.isGM} charId={pr.charId}/></div>;
if(ch){var ct=lore[ch.id]||"";return(<div style={{display:"flex",flexDirection:"column",gap:8}}><button onClick={function(){sO(null)}} style={{alignSelf:"flex-start",padding:"4px 10px",borderRadius:6,border:"2px solid #e8e0d4",background:"#fefdfb",fontWeight:700,fontSize:10,cursor:"pointer"}}>← Назад</button><div style={{textAlign:"center"}}><div style={{fontSize:28}}>{ch.icon}</div><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:15,color:ch.color,marginTop:4}}>{ch.title}</div></div>{ct.trim()?<div style={{background:"#fff",border:"2px solid #e8e0d4",borderRadius:10,padding:"12px 10px"}}>{ct.split("\n").map(function(l,i){if(l.startsWith("### "))return <div key={i} style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13,marginTop:8}}>{l.slice(4)}</div>;if(l.startsWith("## "))return <div key={i} style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:15,color:ch.color,marginTop:10}}>{l.slice(3)}</div>;if(l.startsWith("# "))return <div key={i} style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:17,marginTop:12}}>{l.slice(2)}</div>;if(l.startsWith("---"))return <hr key={i} style={{border:"none",borderTop:"1px solid #e8e0d4",margin:"8px 0"}}/>;if(l.startsWith("- "))return <div key={i} style={{fontSize:10,paddingLeft:12}}>• {l.slice(2)}</div>;if(!l.trim())return <div key={i} style={{height:6}}/>;return <div key={i} style={{fontSize:10,lineHeight:1.6}}>{l}</div>})}</div>:<div style={{textAlign:"center",padding:20,color:"#8b7e6a"}}><div style={{fontSize:24}}>📜</div><div style={{fontSize:12,fontWeight:700}}>Готовится</div></div>}</div>)}
return(<div style={{display:"flex",flexDirection:"column",gap:5}}><div style={{textAlign:"center",padding:"8px 0"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:16}}>📚 Лорбук</div></div>{LORE_CH.map(function(ch){var has=lore[ch.id]&&lore[ch.id].trim();return <button key={ch.id} onClick={function(){sO(ch.id)}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:9,border:"2px solid "+ch.color+"18",background:ch.color+"06",cursor:"pointer",textAlign:"left",opacity:has?1:0.6}}><div style={{width:30,height:30,borderRadius:6,background:ch.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{ch.icon}</div><div style={{flex:1}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10}}>{ch.title}</div></div><span style={{color:"#c4b8a4"}}>›</span></button>})}</div>)}

/* ── LoreEditor ── */
function LoreEditor(pr){var lore=pr.lore||{};var sLore=pr.saveLore;var _s=useState(null);var eid=_s[0];var sE=_s[1];var ch=eid?LORE_CH.find(function(x){return x.id===eid}):null;
if(ch&&ch.id==="map")return <div style={{display:"flex",flexDirection:"column",gap:8}}><button onClick={function(){sE(null)}} style={{alignSelf:"flex-start",padding:"4px 10px",borderRadius:6,border:"2px solid #e8e0d4",background:"#fefdfb",fontWeight:700,fontSize:10,cursor:"pointer"}}>← Назад</button><MapView mapData={pr.mapData} saveMap={pr.saveMap} characters={pr.characters} isGM={true}/></div>;
if(ch){return(<div style={{display:"flex",flexDirection:"column",gap:8}}><button onClick={function(){sE(null)}} style={{alignSelf:"flex-start",padding:"4px 10px",borderRadius:6,border:"2px solid #e8e0d4",background:"#fefdfb",fontWeight:700,fontSize:10,cursor:"pointer"}}>← Назад</button><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:20}}>{ch.icon}</span><span style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:14,color:ch.color}}>{ch.title}</span></div><textarea style={Object.assign({},S.inp,{minHeight:300,resize:"vertical",fontSize:10,padding:8,lineHeight:1.5})} value={lore[ch.id]||""} onChange={function(e){var n=Object.assign({},lore);n[ch.id]=e.target.value;sLore(n)}}/></div>)}
return(<div style={{display:"flex",flexDirection:"column",gap:5}}><div style={{textAlign:"center",padding:"6px 0"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:15,color:"#7c3aed"}}>📚 Редактор</div></div>{LORE_CH.map(function(ch){var len=(lore[ch.id]||"").length;return <button key={ch.id} onClick={function(){sE(ch.id)}} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 9px",borderRadius:8,border:"2px solid "+ch.color+"18",background:len>0?ch.color+"08":"#fefdfb",cursor:"pointer",textAlign:"left"}}><div style={{width:26,height:26,borderRadius:5,background:ch.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{ch.icon}</div><div style={{flex:1}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10}}>{ch.title}</div><div style={{fontSize:7,color:len>0?"#10b981":"#8b7e6a"}}>{ch.id==="map"?"🗺️ Карта мира":len>0?"✓ "+len+" симв.":"Пусто"}</div></div><span style={{color:"#7c3aed"}}>✏️</span></button>})}</div>)}

/* ── GameView ── */
function GameView(pr){var c=pr.char;var _t=useState("character");var tab=_t[0];var sT=_t[1];var _r=useState(null);var rP=_r[0];var sRP=_r[1];
var _de=useState(null);var dmgEv=_de[0];var sDmgEv=_de[1];
var _nd=useState(null);var npcDeathEv=_nd[0];var sNpcDeathEv=_nd[1];
var tabs=[{id:"character",l:"Перс.",ic:<IconChar/>},{id:"combat",l:"Бой",ic:<IconBattle/>},{id:"inventory",l:"Инв.",ic:<IconInv/>},{id:"library",l:"Лор",ic:<IconLib/>}];
var pendAtk=pr.pendAtk||{};var clearPA=pr.clearPendingAttack;var isGMv=pr.isGM;
return(<div style={{flex:1,display:"flex",flexDirection:"column"}}><RollPopup roll={rP} onClose={function(){sRP(null)}}/>{!isGMv&&<PendingAttackPopup attacks={pendAtk} myId={pr.char._fbId} myChar={pr.char} clearPendingAttack={clearPA} addLog={pr.addLog} onRoll={sRP} room={pr.room}/>}{isGMv&&<GMAttackPanel attacks={pendAtk} clearPendingAttack={clearPA} characters={pr.characters||[]} room={pr.room} addLog={pr.addLog} onRoll={sRP}/>}{!isGMv&&(function(){var myEvs=Object.entries(pr.dmgEvents||{}).filter(function(e){return e[1]&&pr.char._fbId===e[0]});if(myEvs.length===0)return null;var ev=myEvs[0];return <DamagePopup event={ev[1]} onClose={function(){if(pr.clearDmgEvent)pr.clearDmgEvent(ev[0]);sDmgEv(null);}}/>;})()}{isGMv&&npcDeathEv&&<NpcDeathPopup event={npcDeathEv} onClose={function(){sNpcDeathEv(null)}}/>}{isGMv&&<PlayerAttackNotif attacks={pendAtk} clearPendingAttack={clearPA} spawned={pr.spawned||{}} saveSpawned={pr.saveSpawned} addLog={pr.addLog} onRoll={sRP} room={pr.room}/>}
<div style={{display:"flex",alignItems:"center",padding:"6px 8px 2px",borderBottom:"2px solid #e8e0d4",background:"#fefcf5",gap:5}}>{pr.onBack&&<button onClick={pr.onBack} style={{background:"none",border:"none",fontSize:14,cursor:"pointer",color:"#8b7e6a"}}>←</button>}<div style={{flex:1,textAlign:"center"}}><div style={{fontSize:12,fontFamily:"'Cinzel',serif",fontWeight:900}}>{c.name||"Герой"}{pr.isGM&&<span style={{fontSize:8,color:"#7c3aed",marginLeft:3}}>ГМ</span>}</div><div style={{fontSize:8,color:"#8b7e6a"}}>Ур.{c.level}</div></div></div>
<div style={{display:"flex",gap:1,padding:"2px 2px 0",background:"#faf6ee",borderBottom:"1px solid #e8e0d4"}}>{tabs.map(function(t){return <button key={t.id} onClick={function(){sT(t.id)}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"4px 1px",border:"none",borderRadius:"6px 6px 0 0",cursor:"pointer",fontFamily:"'Nunito',sans-serif",background:tab===t.id?"#f5e6c8":"transparent",color:tab===t.id?"#5c4a2a":"#8b7e6a",fontWeight:tab===t.id?700:500,fontSize:8}}>{t.ic}<span>{t.l}</span></button>})}</div>
<div style={{flex:1,padding:8,overflowY:"auto"}}>
{tab==="character"&&<CharTab char={c} save={pr.save} onRoll={sRP} isGM={pr.isGM} addLog={pr.addLog}/>}
{tab==="combat"&&<CombatTab char={c} save={pr.save} logs={pr.logs} addLog={pr.addLog} onRoll={sRP} spawned={pr.spawned} saveSpawned={pr.saveSpawned} characters={pr.characters} isGM={pr.isGM} onDmgEvent={sDmgEv} onNpcDeath={sNpcDeathEv} savePendingAttack={pr.savePendingAttack} room={pr.room} logs={pr.logs}/>}
{tab==="inventory"&&<InvTab char={c} save={pr.save}/>}
{tab==="library"&&<LibTab lore={pr.lore} mapData={pr.mapData} saveMap={pr.saveMap} characters={pr.characters} isGM={pr.isGM} charId={c._fbId}/>}
</div></div>)}

/* ── BestiaryEditor — ГМ видит попап с броском ── */
function BestiaryEditor(pr){
var templ=pr.npcTempl||{};var spawned=pr.spawned||{};
var _cat=useState(null);var selCat=_cat[0];var sCat=_cat[1];
var _cn=useState("");var catName=_cn[0];var sCatName=_cn[1];
/* roll popup для ГМ в бестиарии */
var _rp=useState(null);var rollP=_rp[0];var sRollP=_rp[1];
/* target selection for NPC attacks */
var _ptgt=useState(null);var playerTgtId=_ptgt[0];var sPlayerTgt=_ptgt[1];
var _pzone=useState("Торс");var playerZone=_pzone[0];var sPlayerZone=_pzone[1];
/* NPC form state */
var _nn=useState("");var nn=_nn[0];var sNN=_nn[1];var _nl=useState(1);var nl=_nl[0];var sNL=_nl[1];var _nhp=useState(20);var nhp=_nhp[0];var sNHP=_nhp[1];
var _nstats=useState({INT:3,REF:3,DEX:3,BODY:3,EMP:1,CRA:1,WILL:3});var nstats=_nstats[0];var sNStats=_nstats[1];
var _nskills=useState({dodge:2,resist:2});var nskills=_nskills[0];var sNSkills=_nskills[1];
var _nweapons=useState([]);var nweapons=_nweapons[0];var sNWeapons=_nweapons[1];
var _nar=useState("none");var nar=_nar[0];var sNAR=_nar[1];var _narh=useState(10);var narh=_narh[0];var sNARH=_narh[1];
var _narbod=useState("none");var narbod=_narbod[0];var sNARBOD=_narbod[1];var _narbh=useState(10);var narbh=_narbh[0];var sNARBH=_narbh[1];
var _twn=useState("");var twn=_twn[0];var sTWN=_twn[1];var _twd=useState("1d6");var twd=_twd[0];var sTWD=_twd[1];var _twt=useState("Battle");var twt=_twt[0];var sTWT=_twt[1];var _twdt=useState("Р");var twdt=_twdt[0];var sTWDT=_twdt[1];var _twb=useState(0);var twb=_twb[0];var sTWB=_twb[1];
var _editNpc=useState(null);var editNpc=_editNpc[0];var sEditNpc=_editNpc[1];
var cats=Object.keys(templ);
var playerChars=(pr.characters||[]).filter(function(x){return x.active});
var allPlayerChars=pr.characters||[];

function addCat(){if(!catName.trim())return;var n=Object.assign({},templ);n[catName.trim()]={_created:Date.now()};pr.saveNpcTempl(n);sCatName("")}
function delCat(c2){var n=Object.assign({},templ);delete n[c2];pr.saveNpcTempl(n)}
function resetForm(){sNN("");sNL(1);sNHP(20);sNStats({INT:3,REF:3,DEX:3,BODY:3,EMP:1,CRA:1,WILL:3});sNSkills({dodge:2,resist:2});sNWeapons([]);sNAR("none");sNARH(10);sNARBOD("none");sNARBH(10);sEditNpc(null)}
function loadNpcToForm(n){sNN(n.name||"");sNL(n.level||1);sNHP(n.maxHp||20);sNStats(n.stats||{INT:3,REF:3,DEX:3,BODY:3,EMP:1,CRA:1,WILL:3});sNSkills(n.skills||{dodge:2,resist:2});sNWeapons(n.weapons||[]);sNAR(n.armorHead||"none");sNARH(n.armorHeadHp||10);sNARBOD(n.armorBody||"none");sNARBH(n.armorBodyHp||10)}
function saveNpc(){if(!nn.trim()||!selCat)return;var n=Object.assign({},templ);if(!n[selCat])n[selCat]={_created:Date.now()};var id=editNpc||("npc_"+Date.now());n[selCat][id]={name:nn.trim(),level:nl,hp:nhp,maxHp:nhp,stats:Object.assign({},nstats),skills:Object.assign({},nskills),weapons:nweapons.slice(),armorHead:nar,armorHeadHp:narh,armorHeadMaxHp:narh,armorBody:narbod,armorBodyHp:narbh,armorBodyMaxHp:narbh};pr.saveNpcTempl(n);resetForm()}
function delNpc(cat,id){var n=Object.assign({},templ);if(n[cat])delete n[cat][id];pr.saveNpcTempl(n)}
function addTmpWeapon(){if(!twn.trim())return;sNWeapons(nweapons.concat([{id:Date.now(),name:twn.trim(),dice:twd,type:twt,dmgType:twdt,bonus:twb}]));sTWN("")}
function spawnNpc(cat,id){var t=templ[cat]&&templ[cat][id];if(!t)return;var sp=Object.assign({},spawned);var sid="s_"+Date.now();sp[sid]=Object.assign({},t,{_catId:cat,_tmplId:id,spawnedAt:Date.now()});pr.saveSpawned(sp);pr.addLog({who:"ГМ",type:"spawn",label:"👹 "+t.name+" появился!",detail:"",total:0})}
function despawn(id){var sp=Object.assign({},spawned);delete sp[id];pr.saveSpawned(sp)}
function updateSpawned(id,data){var sp=Object.assign({},spawned);sp[id]=data;pr.saveSpawned(sp)}

/* Применить урон к игроку (с учётом брони и зоны) */
function applyDmgToPlayer(ptgt,rawDmg,dmgType,zoneName,who){
  var inf2=cF(ptgt);var fs2=inf2.fs;
  var pMx=ptgt.hpOv||mHP(fs2);
  var pCur=ptgt.curHp!==null&&ptgt.curHp!==undefined?ptgt.curHp:pMx;
  var pZone=ZONES.find(function(x){return x.name===zoneName})||ZONES[2];
  var multiplied=Math.floor(rawDmg*pZone.mult);
  var pArmorId=pZone.slot==="head"?ptgt.equippedHead:ptgt.equippedBody;
  var pArmorObj=(ptgt.armors||[]).find(function(a){return a.id===pArmorId});
  var pArmorType=pArmorObj?(pArmorObj.hp>0?pArmorObj.type:"none"):"none";
  var ae=pZone.ignoreArmor?{ad:0,hd:multiplied,desc:"🔓 "+pZone.name+" ×"+pZone.mult+" игнор брони → HP−"+multiplied}:calcAE(pArmorType,dmgType,multiplied);
  var newPHp=Math.max(0,pCur-ae.hd);
  var updP=Object.assign({},ptgt,{curHp:newPHp});
  if(pArmorObj&&ae.ad>0){
    var newArmHp=Math.max(0,pArmorObj.hp-ae.ad);
    updP.armors=(ptgt.armors||[]).map(function(a){return a.id===pArmorId?Object.assign({},a,{hp:newArmHp}):a});
  }
  delete updP._fbId;
  set(ref(db,"rooms/"+pr.roomCode+"/characters/"+ptgt._fbId),updP);
  pr.addLog({who:who,type:"dmg_npc",label:"💥 "+ptgt.name+" ["+pZone.e+pZone.name+"] "+dmgType,detail:ae.desc+(ae.ad>0?" | бр: "+(pArmorObj?pArmorObj.hp:0)+"→"+Math.max(0,(pArmorObj?pArmorObj.hp:0)-ae.ad):"")+" | ❤️ "+pCur+"→"+newPHp,total:ae.hd});
  /* Записываем событие урона в Firebase чтобы игрок увидел попап */
  if(ae.hd>0){set(ref(db,"rooms/"+pr.roomCode+"/dmgEvents/"+ptgt._fbId),{attackerName:who,dmg:ae.hd,oldHp:pCur,newHp:newPHp,maxHp:pMx,ts:Date.now()});}
}

/* NPC: бросок на попадание */
function npcAttack(s,w){
  var st=s.stats||{};var sk=s.skills||{};
  var skMap={Battle:"battleWeapon",Simple:"simpleWeapon",Guns:"guns",Archery:"archery"};
  var skVal=sk[skMap[w.type]]||0;
  var d=r1(10);var rv=st.REF||0;var t=d+rv+skVal+(w.bonus||0);
  var tgtChar=playerTgtId?playerChars.find(function(x){return x._fbId===playerTgtId}):null;
  var tgtName=tgtChar?tgtChar.name:"";
  pr.addLog({who:s.name,type:"hit",label:"🎯 "+w.name+(tgtName?" → "+tgtName:""),detail:"🎲"+d+" + REF("+rv+") + "+w.type+"("+skVal+") + бонус("+(w.bonus||0)+") = "+t,total:t});
  sRollP({label:s.name+" — "+w.name+" Попад.",d10:d,parts:[{label:"REF",value:rv},{label:w.type,value:skVal},{label:"Бнс",value:w.bonus||0}],total:t,subtext:tgtName?"→ "+tgtName:""});
  if(playerTgtId&&pr.savePendingAttack){
    pr.savePendingAttack({id:"atk_"+Date.now(),attackerName:s.name,targetId:playerTgtId,targetName:tgtName,
      hitRoll:t,atkD:d,atkREF:rv,atkSkill:skVal,atkSkillName:w.type,atkBonus:w.bonus||0,
      weaponName:w.name,dmgDice:w.dice||"1d6",dmgType:w.dmgType||"Р",dmgBonus:w.bonus||0,
      zone:playerZone,status:"pending_dodge",ts:Date.now()});
  }
}

/* NPC: бросок на урон + применение к игроку */
function npcDmg(s,w){
  var m=(w.dice||"1d6").match(/(\d+)d(\d+)/);if(!m)return;
  var dice=rN(parseInt(m[1]),parseInt(m[2]));
  var rawDmg=sm(dice)+(w.bonus||0);
  var ptgt=playerTgtId?playerChars.find(function(x){return x._fbId===playerTgtId}):null;
  if(ptgt){
    applyDmgToPlayer(ptgt,rawDmg,w.dmgType,playerZone,s.name);
  } else {
    pr.addLog({who:s.name,type:"dmg",label:"💥 "+w.name+" ("+w.dmgType+") — нет цели",detail:(w.dice||"1d6")+"["+dice.join(",")+"]+бонус("+(w.bonus||0)+")="+rawDmg,total:rawDmg});
  }
  /* Попап урона без d10 — формула: кубик + бонус */
  sRollP({label:s.name+" 💥 "+w.name+" Урон",d10:null,parts:[{label:w.dice||"1d6",value:sm(dice)},{label:"Бнс",value:w.bonus||0}],total:rawDmg,subtext:"Тип: "+w.dmgType+(ptgt?" → "+ptgt.name+"\nЗона: "+playerZone:" (нет цели)")});
}

/* NPC магия (как Чувствительный): d10, ≤3=попад → урон игроку, >3=обратный или по союзнику NPC */
function npcMagic(s,npcSpawnId){
  var st=s.stats||{};
  var will=st.WILL||1;
  var dmg=rN(3,12);var dT=sm(dmg);var bon=rN(1,6);var bT=sm(bon);var ft=dT+bT;
  var hit=r1(6);var ok=hit<=3;
  var ptgt=playerTgtId?playerChars.find(function(x){return x._fbId===playerTgtId}):null;
  var sub="";
  if(ok){
    if(ptgt){applyDmgToPlayer(ptgt,ft,"Д",playerZone,s.name);}
    sub="✨ ПОПАД! "+ft+(ptgt?" → "+ptgt.name:"");
    pr.addLog({who:s.name,type:"magic",label:"🔮 Заклинание ПОПАД!"+(ptgt?" → "+ptgt.name:""),detail:"3d12+1d6="+ft,total:ft});
  } else {
    var cat2=r1(2);
    sub=(cat2===1?"💥 ОБРАТНЫЙ! ":"🔥 ДРУЖЕСТВ! ")+ft;
    pr.addLog({who:s.name,type:"magic_fail",label:cat2===1?"💥 Обратный урон себе: "+ft:"🔥 Дружественный огонь: "+ft,detail:"",total:ft});
    if(cat2===1){
      /* Обратный — урон самому NPC */
      var sp2=Object.assign({},pr.spawned||{});
      sp2[npcSpawnId]=Object.assign({},s,{hp:Math.max(0,(s.hp||0)-ft)});
      pr.saveSpawned(sp2);
    }
  }
  sRollP({label:s.name+" 🔮 Заклинание",d10:hit,parts:[{label:"3d12",value:dT},{label:"1d6",value:bT}],total:ft,subtext:sub});
}

return(<div style={{flex:1,display:"flex",flexDirection:"column"}}>
<RollPopup roll={rollP} onClose={function(){sRollP(null)}}/>
<GMAttackPanel attacks={pr.pendAtk||{}} clearPendingAttack={pr.clearPendingAttack} characters={pr.characters||[]} room={pr.roomCode} addLog={pr.addLog} onRoll={sRollP}/>
<PlayerAttackNotif attacks={pr.pendAtk||{}} clearPendingAttack={pr.clearPendingAttack} spawned={pr.spawned||{}} saveSpawned={pr.saveSpawned} addLog={pr.addLog} onRoll={sRollP} room={pr.roomCode}/>
<div style={{padding:"8px 10px",borderBottom:"2px solid #ef444428",background:"#fef2f2",display:"flex",alignItems:"center",gap:6}}><button onClick={pr.onBack} style={{background:"none",border:"none",fontSize:14,cursor:"pointer",color:"#8b7e6a"}}>←</button><span style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:14,color:"#ef4444"}}>👹 Бестиарий</span></div>
<div style={{flex:1,padding:8,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>

{/* Выбор цели для атак NPC по игрокам */}
{<div style={{border:"2px solid #3b82f628",borderRadius:9,padding:"6px 8px",background:"#eff6ff"}}>
<label style={Object.assign({},S.lb,{color:"#1d4ed8"})}>🎯 Цель NPC-атак (игрок)</label>
{playerChars.length===0&&<div style={{fontSize:9,color:"#8b7e6a",fontStyle:"italic",padding:"4px 0"}}>Нет активных игроков — отметь игроков "В игру" в панели ГМ</div>}
<div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:3}}>
{playerChars.map(function(pc){var inf2=cF(pc);var pMx=pc.hpOv||mHP(inf2.fs);var pCur=pc.curHp!==null&&pc.curHp!==undefined?pc.curHp:pMx;var pPct=pMx>0?(pCur/pMx)*100:0;var isSel=playerTgtId===pc._fbId;
return <button key={pc._fbId} onClick={function(){sPlayerTgt(isSel?null:pc._fbId)}} style={{padding:"3px 7px",borderRadius:6,border:"2px solid "+(isSel?"#3b82f6":"#e8e0d4"),background:isSel?"#dbeafe":"#fefdfb",fontSize:9,fontWeight:isSel?700:400,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
<span>{pc.name}</span>
<div style={{width:40,height:4,background:"#f0f0f0",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:pPct+"%",background:pPct<=25?"#ef4444":pPct<=50?"#f59e0b":"#10b981",borderRadius:2}}/></div>
<span style={{fontSize:7,color:"#8b7e6a"}}>{pCur+"/"+pMx}</span>
</button>})}
</div>
{playerTgtId&&<div style={{marginTop:4}}>
<label style={Object.assign({},S.lb,{marginTop:3})}>Зона удара по игроку</label>
<div style={{display:"flex",flexWrap:"wrap",gap:2,marginTop:2}}>
{ZONES.map(function(z){return <button key={z.name} onClick={function(){sPlayerZone(z.name)}} style={{padding:"2px 5px",borderRadius:5,border:"2px solid "+(playerZone===z.name?"#f59e0b":"#e8e0d4"),background:playerZone===z.name?"#fffbeb":"#fefdfb",fontSize:8,fontWeight:playerZone===z.name?700:400,cursor:"pointer"}}>{z.e+" "+z.name+(z.ignoreArmor?" 🔓":"")+" ×"+z.mult}</button>})}
</div>
</div>}
</div>}

{/* NPC на поле боя */}
{Object.keys(spawned).length>0&&<div style={{border:"2px solid #ef444420",borderRadius:9,padding:"6px 8px",background:"#fef2f2"}}>
<div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11,color:"#ef4444",marginBottom:4}}>⚔️ На поле боя</div>
{Object.entries(spawned).map(function(e){var id=e[0];var s=e[1];var hpP=s.maxHp>0?((s.hp||0)/s.maxHp)*100:0;var st=s.stats||{};var sk=s.skills||{};var wpns=s.weapons||[];
return <div key={id} style={{background:"#fff",border:"1px solid #e8e0d4",borderRadius:7,padding:"5px 7px",marginBottom:4}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:11}}>{s.name} <span style={{fontSize:8,color:"#8b7e6a"}}>Ур.{s.level}</span></span><button onClick={function(){if(window.confirm("Убрать "+s.name+"?"))despawn(id)}} style={{fontSize:8,background:"none",border:"none",color:"#ef4444",cursor:"pointer"}}>✕</button></div>
{(s.hp||0)<=0&&<div style={{background:"#1f2937",borderRadius:5,padding:"3px 7px",marginTop:3,textAlign:"center",fontSize:9,color:"#f9fafb",fontWeight:700}}>💀 Повержен</div>}
<div style={{display:"flex",alignItems:"center",gap:3,marginTop:2}}><span style={{fontSize:8}}>❤️</span><div style={{flex:1,background:"#f0f0f0",borderRadius:3,height:8,overflow:"hidden"}}><div style={{height:"100%",width:hpP+"%",background:(s.hp||0)<=0?"#1f2937":"#ef4444",borderRadius:3}}/></div><div style={{display:"flex",gap:1}}>{[-5,-1,1,5].map(function(d){return <button key={d} onClick={function(){updateSpawned(id,Object.assign({},s,{hp:Math.max(0,Math.min(s.maxHp,(s.hp||0)+d))}))}} style={{padding:"1px 4px",borderRadius:3,fontSize:7,fontWeight:700,border:"1px solid #e8e0d4",background:d<0?"#fef2f2":"#ecfdf5",color:d<0?"#ef4444":"#10b981",cursor:"pointer"}}>{d>0?"+"+d:d}</button>})}</div><span style={{fontSize:9,fontWeight:700,fontFamily:"'Cinzel',serif"}}>{(s.hp||0)+"/"+s.maxHp}</span></div>
{s.armorHead&&s.armorHead!=="none"&&<div style={{fontSize:7,color:"#64748b",marginTop:1}}>🧠 {s.armorHead} {s.armorHeadHp||0}/{s.armorHeadMaxHp||0}</div>}
{s.armorBody&&s.armorBody!=="none"&&<div style={{fontSize:7,color:"#64748b"}}>🫀 {s.armorBody} {s.armorBodyHp||0}/{s.armorBodyMaxHp||0}</div>}
<div style={{display:"flex",gap:2,marginTop:3,flexWrap:"wrap"}}>
{wpns.length>0?wpns.map(function(w,wi){return <div key={wi} style={{display:"flex",gap:1,marginBottom:1}}>
<button onClick={function(){npcAttack(s,w)}} style={{padding:"2px 5px",borderRadius:4,border:"1px solid #3b82f620",background:"#eff6ff",fontSize:7,fontWeight:700,color:"#1d4ed8",cursor:"pointer"}}>{"🎯 "+w.name+(playerTgtId?" →":"")}</button>
<button onClick={function(){npcDmg(s,w)}} style={{padding:"2px 5px",borderRadius:4,border:"1px solid #ef444420",background:"#fef2f2",fontSize:7,fontWeight:700,color:"#dc2626",cursor:"pointer"}}>{"💥"+(playerTgtId?" →":"")}</button>
</div>}):
<button onClick={function(){var d=r1(10);var t=d+(st.REF||0);sRollP({label:s.name+" Атака",d10:d,parts:[{label:"REF",value:st.REF||0}],total:t});pr.addLog({who:s.name,type:"hit",label:"🎯 Атака",detail:"🎲"+d+" + REF("+(st.REF||0)+") = "+t,total:t})}} style={{padding:"3px 6px",borderRadius:4,border:"1px solid #3b82f620",background:"#eff6ff",fontSize:8,fontWeight:700,color:"#1d4ed8",cursor:"pointer"}}>🎯 Атака</button>}
<button onClick={function(){npcMagic(s,id)}} style={{padding:"3px 5px",borderRadius:4,border:"1px solid #7c3aed20",background:"#fdf4ff",fontSize:7,fontWeight:700,color:"#7c3aed",cursor:"pointer"}}>{"🔮"+(playerTgtId?" →":"")}</button>
<button onClick={function(){var d=r1(10);var dv=st.DEX||0;var dg=sk.dodge||0;var t=d+dv+dg;sRollP({label:s.name+" — Уклонение",d10:d,parts:[{label:"DEX",value:dv},{label:"Dodge",value:dg}],total:t});pr.addLog({who:s.name,type:"dodge",label:"🛡️ Уклонение",detail:"🎲"+d+" + DEX("+dv+") + Dodge("+dg+") = "+t,total:t})}} style={{padding:"3px 6px",borderRadius:4,border:"1px solid #10b98120",background:"#ecfdf5",fontSize:8,fontWeight:700,color:"#065f46",cursor:"pointer"}}>🛡️ Уклон.</button>
</div></div>})}
</div>}

{/* Категории */}
{(pr.logs||[]).filter(function(l){return l.type==="hit"||l.type==="dmg"||l.type==="dmg_npc"||l.type==="dodge"||l.type==="magic"||l.type==="magic_fail"||l.type==="spawn"}).slice(0,8).length>0&&<div style={{border:"2px solid #e8e0d4",borderRadius:9,padding:"6px 8px",background:"#fefdfb"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11,marginBottom:4}}>📜 Боевой лог</div><div style={{maxHeight:130,overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>{(pr.logs||[]).filter(function(l){return l.type==="hit"||l.type==="dmg"||l.type==="dmg_npc"||l.type==="dodge"||l.type==="magic"||l.type==="magic_fail"||l.type==="spawn"}).slice(0,8).map(function(l,i){var bgc=l.type==="magic_fail"?"#fee2e2":l.type==="magic"?"#fdf4ff":l.type==="dodge"?"#f0fdf4":l.type==="hit"?"#eff6ff":l.type==="spawn"?"#fdf4ff":"#fef2f2";return <div key={i} style={{background:bgc,borderRadius:4,padding:"3px 6px",fontSize:8}}><b>{l.who||"?"}: {l.label}</b>{l.total>0&&<span style={{fontFamily:"'Cinzel',serif",fontWeight:700,marginLeft:4}}>={l.total}</span>}</div>})}</div></div>}
<div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:12}}>📁 Категории</div>
<div style={{display:"flex",gap:3}}><input style={Object.assign({},S.inp,{flex:1})} value={catName} onChange={function(e){sCatName(e.target.value)}} placeholder="Новая категория..." onKeyDown={function(e){if(e.key==="Enter")addCat()}}/><button onClick={addCat} style={{padding:"4px 10px",borderRadius:5,border:"none",background:"#10b981",color:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}>+</button></div>
{cats.length===0&&<div style={{textAlign:"center",padding:12,color:"#8b7e6a",fontStyle:"italic",fontSize:9}}>Создай категорию (Бандиты, Нежить, Звери...)</div>}
{cats.map(function(cat){var npcs=templ[cat]||{};var npcArr=Object.entries(npcs).filter(function(e){return e[0]!=="_created"});var isOpen=selCat===cat;return <div key={cat} style={{border:"2px solid #ef444418",borderRadius:8,overflow:"hidden"}}><button onClick={function(){sCat(isOpen?null:cat)}} style={{width:"100%",display:"flex",justifyContent:"space-between",padding:"6px 8px",background:"#fef2f2",border:"none",cursor:"pointer",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11,color:"#ef4444"}}><span>{"📁 "+cat+" ("+npcArr.length+")"}</span><span style={{transform:isOpen?"rotate(180deg)":"none"}}>▼</span></button>
{isOpen&&<div style={{padding:"5px 7px",background:"#fefdfb",display:"flex",flexDirection:"column",gap:4}}>
{npcArr.map(function(e2){var nid=e2[0];var n=e2[1];return <div key={nid} style={{border:"1px solid #e8e0d4",borderRadius:6,padding:"4px 6px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontWeight:700,fontSize:10}}>{n.name}</span><span style={{fontSize:8,color:"#8b7e6a",marginLeft:3}}>Ур.{n.level} HP:{n.maxHp}</span></div><div style={{display:"flex",gap:2}}><button onClick={function(){loadNpcToForm(n);sEditNpc(nid);sCat(cat)}} style={{padding:"2px 5px",borderRadius:4,border:"1px solid #3b82f620",background:"#eff6ff",fontSize:7,fontWeight:700,color:"#1d4ed8",cursor:"pointer"}}>✏️</button><button onClick={function(){spawnNpc(cat,nid)}} style={{padding:"2px 6px",borderRadius:4,border:"1px solid #10b98128",background:"#ecfdf5",fontSize:8,fontWeight:700,color:"#065f46",cursor:"pointer"}}>⚔️ Спавн</button><button onClick={function(){delNpc(cat,nid)}} style={{background:"none",border:"none",color:"#ef4444",fontSize:9,cursor:"pointer"}}>✕</button></div></div>
<div style={{fontSize:7,color:"#6b7280",marginTop:1}}>{(n.weapons||[]).length>0?(n.weapons||[]).map(function(w){return w.name+" "+w.dice+" "+w.dmgType}).join(", "):"Без оружия"}</div>
</div>})}
<div style={{border:"2px dashed #ef444430",borderRadius:8,padding:6,display:"flex",flexDirection:"column",gap:4,background:"#fef2f208"}}>
<div style={{fontSize:9,fontWeight:700,color:"#ef4444"}}>{editNpc?"✏️ Редактировать NPC":"+ Новый NPC"}</div>
<input style={S.inp} value={nn} onChange={function(e){sNN(e.target.value)}} placeholder="Имя NPC"/>
<div style={{display:"flex",gap:3}}><div style={{flex:1}}><label style={{fontSize:6,fontWeight:700}}>Уровень</label><input style={Object.assign({},S.inp,{fontSize:9,padding:2})} type="number" value={nl} onChange={function(e){sNL(parseInt(e.target.value)||1)}}/></div><div style={{flex:1}}><label style={{fontSize:6,fontWeight:700}}>HP</label><input style={Object.assign({},S.inp,{fontSize:9,padding:2})} type="number" value={nhp} onChange={function(e){sNHP(parseInt(e.target.value)||1)}}/></div></div>
<div style={{fontSize:8,fontWeight:700,marginTop:2}}>Характеристики</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2}}>{SD.map(function(st){return <div key={st.key} style={{textAlign:"center"}}><label style={{fontSize:6,fontWeight:700,color:st.color}}>{st.emoji}{st.key}</label><input style={Object.assign({},S.inp,{fontSize:10,padding:2,textAlign:"center"})} type="number" value={nstats[st.key]||0} onChange={function(e){var ns=Object.assign({},nstats);ns[st.key]=parseInt(e.target.value)||0;sNStats(ns)}}/></div>})}</div>
<div style={{fontSize:8,fontWeight:700,marginTop:2}}>Боевые навыки</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2}}>
{[{k:"dodge",l:"Dodge"},{k:"resist",l:"Resistance"},{k:"brawl",l:"Brawl"},{k:"battleWeapon",l:"Battle Wpn"},{k:"simpleWeapon",l:"Simple Wpn"},{k:"guns",l:"Guns"},{k:"archery",l:"Archery"},{k:"athletics",l:"Athletics"},{k:"spellcast",l:"Spellcast"}].map(function(sk){return <div key={sk.k}><label style={{fontSize:5,fontWeight:700}}>{sk.l}</label><input style={Object.assign({},S.inp,{fontSize:9,padding:2,textAlign:"center"})} type="number" value={nskills[sk.k]||0} onChange={function(e){var ns=Object.assign({},nskills);ns[sk.k]=parseInt(e.target.value)||0;sNSkills(ns)}}/></div>})}
</div>
<div style={{fontSize:8,fontWeight:700,marginTop:2}}>Оружие ({nweapons.length})</div>
{nweapons.map(function(w,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:3,fontSize:8,padding:"2px 4px",background:"#fefdfb",border:"1px solid #e8e0d4",borderRadius:4}}><span style={{flex:1,fontWeight:600}}>{w.name} {w.dice} {w.dmgType} +{w.bonus}</span><button onClick={function(){sNWeapons(nweapons.filter(function(x,j){return j!==i}))}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:8}}>✕</button></div>})}
<div style={{display:"flex",gap:2,flexWrap:"wrap"}}><input style={Object.assign({},S.inp,{flex:2,minWidth:60,fontSize:8,padding:2})} value={twn} onChange={function(e){sTWN(e.target.value)}} placeholder="Оружие"/><input style={Object.assign({},S.inp,{width:35,fontSize:8,padding:2})} value={twd} onChange={function(e){sTWD(e.target.value)}} placeholder="1d6"/><select value={twt} onChange={function(e){sTWT(e.target.value)}} style={Object.assign({},S.inp,{width:50,fontSize:8,padding:2})}>{WT.map(function(t){return <option key={t} value={t}>{t}</option>})}</select><select value={twdt} onChange={function(e){sTWDT(e.target.value)}} style={Object.assign({},S.inp,{width:30,fontSize:8,padding:2})}>{DT.map(function(t){return <option key={t} value={t}>{t}</option>})}</select><input style={Object.assign({},S.inp,{width:28,fontSize:8,padding:2})} type="number" value={twb} onChange={function(e){sTWB(parseInt(e.target.value)||0)}} placeholder="+"/><button onClick={addTmpWeapon} style={{padding:"2px 6px",borderRadius:3,border:"none",background:"#10b981",color:"#fff",fontWeight:700,fontSize:7,cursor:"pointer"}}>+</button></div>
<div style={{fontSize:8,fontWeight:700,marginTop:2}}>Броня</div>
<div style={{display:"flex",gap:3}}><div style={{flex:1}}><label style={{fontSize:6,fontWeight:700}}>🧠 Голова</label><select value={nar} onChange={function(e){sNAR(e.target.value)}} style={Object.assign({},S.inp,{fontSize:8,padding:2})}>{ARMOR_T.map(function(a){return <option key={a.id} value={a.id}>{a.name}</option>})}</select>{nar!=="none"&&<input style={Object.assign({},S.inp,{fontSize:8,padding:2,marginTop:2})} type="number" value={narh} onChange={function(e){sNARH(parseInt(e.target.value)||1)}} placeholder="HP"/>}</div><div style={{flex:1}}><label style={{fontSize:6,fontWeight:700}}>🫀 Тело</label><select value={narbod} onChange={function(e){sNARBOD(e.target.value)}} style={Object.assign({},S.inp,{fontSize:8,padding:2})}>{ARMOR_T.map(function(a){return <option key={a.id} value={a.id}>{a.name}</option>})}</select>{narbod!=="none"&&<input style={Object.assign({},S.inp,{fontSize:8,padding:2,marginTop:2})} type="number" value={narbh} onChange={function(e){sNARBH(parseInt(e.target.value)||1)}} placeholder="HP"/>}</div></div>
<div style={{display:"flex",gap:3,marginTop:2}}><button onClick={function(){saveNpc();sCat(cat)}} style={{flex:1,padding:6,borderRadius:5,border:"none",background:"#ef4444",color:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}>{editNpc?"💾 Сохранить":"Создать NPC"}</button>{editNpc&&<button onClick={resetForm} style={{padding:"6px 10px",borderRadius:5,border:"2px solid #e8e0d4",background:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}>Отмена</button>}</div>
</div>
<button onClick={function(){if(window.confirm("Удалить категорию "+cat+"?"))delCat(cat)}} style={{fontSize:8,color:"#ef4444",background:"none",border:"none",cursor:"pointer",marginTop:3}}>🗑️ Удалить категорию</button>
</div>}
</div>})}
</div></div>)}

function GMPanel(pr){var _s=useState(null);var sid=_s[0];var sS=_s[1];var _sl=useState(false);var sl=_sl[0];var sSL=_sl[1];
var _sb=useState(false);var showBest=_sb[0];var sShowBest=_sb[1];
var sel=pr.characters.find(function(c){return c._fbId===sid});
if(sel)return <GameView char={sel} save={function(d){pr.saveChar(sel._fbId,d)}} onBack={function(){sS(null)}} isGM={true} logs={pr.logs} addLog={pr.addLog} lore={pr.lore} mapData={pr.mapData} saveMap={pr.saveMap} characters={pr.characters} spawned={pr.spawned} saveSpawned={pr.saveSpawned} pendAtk={pr.pendAtk} clearPendingAttack={pr.clearPendingAttack} room={pr.roomCode} savePendingAttack={pr.savePendingAttack}/>;
if(sl)return(<div style={{flex:1,display:"flex",flexDirection:"column"}}><div style={{padding:"8px 10px",borderBottom:"2px solid #c084fc28",background:"#fdf4ff",display:"flex",alignItems:"center",gap:6}}><button onClick={function(){sSL(false)}} style={{background:"none",border:"none",fontSize:14,cursor:"pointer",color:"#8b7e6a"}}>←</button><span style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:14,color:"#7c3aed"}}>📚 Лорбук</span></div><div style={{flex:1,padding:8,overflowY:"auto"}}><LoreEditor lore={pr.lore} saveLore={pr.saveLore} mapData={pr.mapData} saveMap={pr.saveMap} characters={pr.characters}/></div></div>);
if(showBest)return <BestiaryEditor npcTempl={pr.npcTempl} saveNpcTempl={pr.saveNpcTempl} spawned={pr.spawned} saveSpawned={pr.saveSpawned} onBack={function(){sShowBest(false)}} addLog={pr.addLog} characters={pr.characters} roomCode={pr.roomCode} savePendingAttack={pr.savePendingAttack} clearPendingAttack={pr.clearPendingAttack} pendAtk={pr.pendAtk} logs={pr.logs}/>;
return(<div style={{flex:1,display:"flex",flexDirection:"column"}}><div style={{padding:"8px 10px",borderBottom:"2px solid #c084fc28",background:"#fdf4ff"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:16,color:"#7c3aed",textAlign:"center"}}>🎭 ГМ</div></div><div style={{flex:1,padding:8,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
<button onClick={function(){sSL(true)}} style={{width:"100%",padding:10,borderRadius:9,border:"2px solid #8b5cf630",background:"#fdf4ff",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13,color:"#7c3aed",cursor:"pointer"}}>📚 Лорбук</button>
<button onClick={function(){sShowBest(true)}} style={{width:"100%",padding:10,borderRadius:9,border:"2px solid #ef444430",background:"#fef2f2",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13,color:"#ef4444",cursor:"pointer"}}>👹 Бестиарий / NPC</button>
{pr.characters.length===0&&<div style={{textAlign:"center",padding:20,color:"#8b7e6a"}}>Ожидаем...</div>}
{pr.characters.map(function(c){var inf=cF(c);var pf=PROFS.find(function(p){return p.id===c.profId})||PROFS[0];var mx=c.hpOv||mHP(inf.fs);var ch=c.curHp!==null&&c.curHp!==undefined?c.curHp:mx;return(<div key={c._fbId} style={{background:"#fefdfb",border:"2px solid #c084fc18",borderRadius:9,padding:"7px 9px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:12}}>{c.name||"?"} <span style={{fontSize:8,color:"#8b7e6a"}}>{pf.name} Ур.{c.level}</span>{c.active&&<span style={{fontSize:7,background:"#10b981",color:"#fff",borderRadius:3,padding:"1px 4px",marginLeft:4}}>В ИГРЕ</span>}</span><div style={{display:"flex",gap:2}}><button onClick={function(){pr.saveChar(c._fbId,Object.assign({},c,{active:!c.active}))}} style={{padding:"3px 7px",borderRadius:5,border:"1px solid "+(c.active?"#10b98140":"#e8e0d4"),background:c.active?"#ecfdf5":"#fefdfb",fontWeight:700,fontSize:8,color:c.active?"#065f46":"#8b7e6a",cursor:"pointer"}}>{c.active?"✓ Активен":"В игру"}</button><button onClick={function(){sS(c._fbId)}} style={{padding:"3px 8px",borderRadius:5,border:"1px solid #7c3aed28",background:"#fdf4ff",fontWeight:700,fontSize:9,color:"#7c3aed",cursor:"pointer"}}>Открыть</button></div></div>
<div style={{fontSize:9}}>{"❤️ "+ch+"/"+mx+" 🔥 "+(inf.fs.WILL||0)}</div>
<div style={{display:"flex",gap:2,marginTop:3,flexWrap:"wrap"}}><button onClick={function(){pr.saveChar(c._fbId,Object.assign({},c,{level:c.level+1,lvlPts:(c.lvlPts||0)+2}))}} style={{padding:"3px 6px",borderRadius:4,border:"1px solid #10b98128",background:"#ecfdf5",fontSize:8,fontWeight:700,color:"#065f46",cursor:"pointer"}}>⬆️+1</button><button onClick={function(){pr.saveChar(c._fbId,Object.assign({},c,{curHp:c.hpOv||mHP(cF(c).fs),curWill:c.willOv||cF(c).fs.WILL||1}))}} style={{padding:"3px 6px",borderRadius:4,border:"1px solid #10b98128",background:"#ecfdf5",fontSize:8,fontWeight:700,color:"#065f46",cursor:"pointer"}}>💤</button>{[-5,-1,1,5].map(function(d){return <button key={d} onClick={function(){var mx2=c.hpOv||mHP(cF(c).fs);var cur=c.curHp!==null&&c.curHp!==undefined?c.curHp:mx2;pr.saveChar(c._fbId,Object.assign({},c,{curHp:Math.max(0,Math.min(mx2,cur+d))}))}} style={{padding:"3px 5px",borderRadius:4,border:"1px solid #ef444420",background:d<0?"#fef2f2":"#ecfdf5",fontSize:8,fontWeight:700,color:d<0?"#ef4444":"#10b981",cursor:"pointer"}}>{"HP"+(d>0?"+":"")+d}</button>})}<button onClick={function(){if(window.confirm("Удалить "+c.name+"?"))pr.deleteChar(c._fbId)}} style={{padding:"3px 6px",borderRadius:4,border:"1px solid #ef444440",background:"#fef2f2",fontSize:8,fontWeight:700,color:"#ef4444",cursor:"pointer"}}>🗑️ Удалить</button></div></div>)})}
<div style={{border:"2px solid #e8e0d4",borderRadius:9,padding:"7px 8px",background:"#fefdfb"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:12}}>📜 Общий лог</span><button onClick={function(){if(window.confirm("Очистить все логи?"))pr.clearLogs()}} style={{fontSize:8,background:"#fef2f2",border:"1px solid #ef444420",borderRadius:4,padding:"2px 6px",cursor:"pointer",color:"#ef4444",fontWeight:700}}>🗑️ Очистить</button></div><div style={{maxHeight:250,overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>{(pr.logs||[]).length===0&&<div style={{textAlign:"center",padding:10,color:"#8b7e6a",fontStyle:"italic",fontSize:9}}>Пусто</div>}{(pr.logs||[]).map(function(l,i){var bgc=l.type==="magic_fail"?"#fee2e2":l.type==="magic"?"#fdf4ff":l.type==="rest"?"#ecfdf5":l.type==="dodge"?"#f0fdf4":l.type==="zone"?"#fffbeb":l.type==="hit"?"#eff6ff":l.type==="dmg_npc"?"#fef2f2":l.type==="dmg"?"#fef2f2":l.type==="spawn"?"#fdf4ff":"#fefdfb";return <div key={i} style={{background:bgc,border:"1px solid #e8e0d420",borderRadius:5,padding:"4px 6px",fontSize:9,animation:i===0?"slideIn 0.3s":"none"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,color:"#2d2a24"}}>{l.who||"?"}</span>{l.ts&&<span style={{fontSize:7,color:"#a09888"}}>{new Date(l.ts).toLocaleTimeString()}</span>}</div><div style={{color:"#5c5548",marginTop:1}}>{l.label}</div>{l.detail&&<div style={{fontSize:8,color:"#6b7280",fontFamily:"monospace"}}>{l.detail}</div>}{l.total>0&&<div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13,color:l.type==="magic_fail"?"#dc2626":"#2d2a24"}}>{"= "+l.total}</div>}</div>})}</div></div>
</div></div>)}


/* ── DonatePage ── */
function DonatePage(pr){
var onClose=pr.onClose;var isGM=pr.isGM;var saveMap=pr.saveMap;var mapData=pr.mapData||{};
var _editMode=useState(false);var editMode=_editMode[0];var sEditMode=_editMode[1];

/* Default packs stored in mapData.donatePacks, fallback to hardcoded */
var DEFAULT_PACKS=[
  {id:1,icon:"💪",name:"Стартовый пак",price:"500 ₽",items:["Начните с преимущества!","+1 к силе, +1 к ловкости","+500 золота","Одно случайное зелье"]},
  {id:2,icon:"🛡️",name:"Стандартный пак",price:"1000 ₽",items:["Станьте сильнее!","+2 к любой характеристике","+1000 золота","Один редкий магический предмет"]},
  {id:3,icon:"👑",name:"VIP пак",price:"2000 ₽",items:["Доминируйте!","Отмена крит. промаха 1×/сессию","Список слабостей монстра","Секретный разговор с NPC"]},
  {id:4,icon:"🏆",name:"King пак",price:"5000 ₽",items:["Станьте королём!","Всё из VIP","+2 к характеристике навсегда","Идеальный спутник-легенда","Внеочередной ход"]},
  {id:5,icon:"❤️",name:"Личный запас здоровья",price:"2500 ₽",items:["Начало сессии с полным HP","+50% к макс. здоровью на сессию"]},
  {id:6,icon:"🎯",name:"Игнорирование промаха",price:"500 ₽",items:["Промах → попадание","Работает 1× за раунд"]},
  {id:7,icon:"✨",name:"Полное воскрешение",price:"1000 ₽",items:["Персонаж воскресает на месте","Все вещи, полное HP, без штрафов"]},
  {id:8,icon:"📦",name:"Сундук из другого мира",price:"1500 ₽",items:["Случайный предмет — от простого до легендарного","Гарантированно ломает баланс!"]},
  {id:9,icon:"📊",name:"Изменение характеристик",price:"800 ₽",items:["Перераспределить все очки","или +2 к любой характеристике навсегда"]},
  {id:10,icon:"🔮",name:"Бесплатные заклинания",price:"400 ₽",items:["Любой класс заклинания 1×/сессию","Без затрат WILL"]},
  {id:11,icon:"🌍",name:"Мастер мира",price:"1000 ₽/сессию",items:["Отменить действие игрока или ДМа","Список слабостей монстра"]},
  {id:12,icon:"💎",name:"Титан Подземелья",price:"10 000 ₽",items:["Все донаты бесплатно навсегда","Приоритет выбора заданий","Право голоса по любым спорам"]},
];
var packs=mapData.donatePacks?JSON.parse(mapData.donatePacks):DEFAULT_PACKS;
var _ep=useState(null);var editPack=_ep[0];var sEditPack=_ep[1];
var _ename=useState("");var eName=_ename[0];var sEName=_ename[1];
var _eprice=useState("");var ePrice=_eprice[0];var sEPrice=_eprice[1];
var _eicon=useState("💰");var eIcon=_eicon[0];var sEIcon=_eicon[1];
var _eitems=useState("");var eItems=_eitems[0];var sEItems=_eitems[1];

function savePacks(newPacks){if(saveMap)saveMap(Object.assign({},mapData,{donatePacks:JSON.stringify(newPacks)}));}
function startEdit(p){sEditPack(p.id);sEName(p.name);sEPrice(p.price);sEIcon(p.icon);sEItems(p.items.join("\n"));}
function saveEdit(){var np=packs.map(function(p){return p.id===editPack?Object.assign({},p,{name:eName,price:ePrice,icon:eIcon,items:eItems.split("\n").filter(function(x){return x.trim()})}):p});savePacks(np);sEditPack(null);}
function deletePack(id){savePacks(packs.filter(function(p){return p.id!==id}));}
function addPack(){var newId=Date.now();var np=packs.concat([{id:newId,icon:"⭐",name:"Новый пакет",price:"0 ₽",items:["Описание"]}]);savePacks(np);startEdit({id:newId,name:"Новый пакет",price:"0 ₽",icon:"⭐",items:["Описание"]});}

function setDonateImg(key,dataUrl){if(saveMap)saveMap(Object.assign({},mapData,function(){var o={};o["donate_"+key]=dataUrl;return o}()));}
var qrImg=mapData.donate_qr||"";
var img1=mapData.donate_img1||"";
var img2=mapData.donate_img2||"";

var CONDITIONS=[
  "ДМ всегда прав. Окончательное решение по любому донату остается за ДМом.",
  "Донаты не возвращаются. Даже если вы не смогли ими воспользоваться.",
  "Использование по требованию. ДМ может потребовать использовать донат в любой момент.",
  "Срок годности. Все донаты (кроме Титана) исчезают через 24 часа.",
  "Без гарантий. Мы не несём ответственности за поломку игры или потерю дружбы.",
  "Бафф для монстров. После каждой покупки один монстр получает случайный бонус.",
  "Налог на донат. 50% стоимости выплачивается заданиями от ДМа.",
];

var S2={inp:{width:"100%",padding:"4px 6px",border:"1px solid #4b3800",borderRadius:5,fontSize:9,fontFamily:"'Nunito',sans-serif",background:"#1a1008",color:"#fef3c7",outline:"none"}};

return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:1000,overflowY:"auto",fontFamily:"'Nunito',sans-serif"}}>
<div style={{maxWidth:560,margin:"0 auto",padding:"16px 12px 40px"}}>

{/* Header */}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
  <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:18,color:"#f59e0b"}}>💰 Донат-магазин</div>{isGM&&<span style={{fontSize:8,background:"#f59e0b20",color:"#f59e0b",border:"1px solid #f59e0b40",borderRadius:4,padding:"1px 6px"}}>ГМ</span>}</div>
  <div style={{display:"flex",gap:6,alignItems:"center"}}>
    {isGM&&<button onClick={function(){sEditMode(!editMode);sEditPack(null)}} style={{padding:"4px 12px",borderRadius:5,border:"2px solid #f59e0b",background:editMode?"#f59e0b":"transparent",color:editMode?"#1a1008":"#f59e0b",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"'Cinzel',serif"}}>{editMode?"✓ Готово":"✏️ Редактировать"}</button>}
    {!isGM&&<span style={{fontSize:8,color:"#4b5563",fontStyle:"italic"}}>режим просмотра</span>}
    <button onClick={onClose} style={{background:"none",border:"1px solid #5c5548",borderRadius:5,padding:"4px 12px",color:"#e8e0d4",cursor:"pointer",fontSize:10}}>✕ Закрыть</button>
  </div>
</div>

{/* Banner image */}
<div style={{marginBottom:12,borderRadius:10,overflow:"hidden",border:"1px solid #4b3800"}}>
  {img1?<div style={{position:"relative"}}>
    <img src={img1} style={{width:"100%",maxHeight:180,objectFit:"cover",display:"block"}} alt="banner"/>
    {isGM&&editMode&&<label style={{position:"absolute",bottom:6,right:6,background:"rgba(0,0,0,0.8)",border:"1px solid #f59e0b",borderRadius:5,padding:"3px 8px",color:"#f59e0b",cursor:"pointer",fontSize:8}}>🖼️ Сменить<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){setDonateImg("img1",ev.target.result)};r.readAsDataURL(f)}}/></label>}
  </div>:isGM&&editMode?<label style={{display:"block",padding:"24px",background:"#1a1008",textAlign:"center",color:"#f59e0b",cursor:"pointer",fontSize:10}}>🖼️ Загрузить баннер<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){setDonateImg("img1",ev.target.result)};r.readAsDataURL(f)}}/></label>:<div style={{background:"linear-gradient(135deg,#1a1008,#2d1f00)",padding:"14px",textAlign:"center"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:14,color:"#f59e0b",marginBottom:4}}>Цены для настоящих королей Мидланда!</div><div style={{fontSize:9,color:"#d97706"}}>Наши донаты — ваш ключ к абсолютной власти!</div></div>}
</div>

{/* Packs list */}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
  <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11,color:"#f59e0b"}}>🎁 Пакеты доната</div>
  {isGM&&editMode&&<button onClick={addPack} style={{padding:"3px 10px",borderRadius:5,border:"1px solid #f59e0b40",background:"#2d1f00",color:"#f59e0b",cursor:"pointer",fontSize:9,fontWeight:700}}>+ Добавить</button>}
</div>

<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
{packs.map(function(p){
  var isEditing=editPack===p.id;
  return(<div key={p.id} style={{background:"linear-gradient(135deg,#1a1008,#221500)",border:"1px solid "+(isEditing?"#f59e0b":"#f59e0b20"),borderRadius:10,overflow:"hidden"}}>
    {isEditing?
    /* Edit form */
    <div style={{padding:"10px 12px",display:"flex",flexDirection:"column",gap:6}}>
      <div style={{display:"flex",gap:6}}>
        <input style={Object.assign({},S2.inp,{width:36,textAlign:"center",fontSize:14})} value={eIcon} onChange={function(e){sEIcon(e.target.value)}} placeholder="🎁"/>
        <input style={Object.assign({},S2.inp,{flex:2})} value={eName} onChange={function(e){sEName(e.target.value)}} placeholder="Название пакета"/>
        <input style={Object.assign({},S2.inp,{width:80})} value={ePrice} onChange={function(e){sEPrice(e.target.value)}} placeholder="1000 ₽"/>
      </div>
      <div>
        <div style={{fontSize:8,color:"#d97706",marginBottom:3}}>Описание (каждый пункт с новой строки):</div>
        <textarea style={Object.assign({},S2.inp,{minHeight:70,resize:"vertical",lineHeight:1.6})} value={eItems} onChange={function(e){sEItems(e.target.value)}} placeholder={"Пункт 1\nПункт 2\nПункт 3"}/>
      </div>
      <div style={{display:"flex",gap:5}}>
        <button onClick={saveEdit} style={{flex:1,padding:"5px",borderRadius:5,border:"none",background:"#f59e0b",color:"#1a1008",fontWeight:700,fontSize:9,cursor:"pointer"}}>💾 Сохранить</button>
        <button onClick={function(){sEditPack(null)}} style={{padding:"5px 10px",borderRadius:5,border:"1px solid #4b3800",background:"#1a1008",color:"#9ca3af",fontSize:9,cursor:"pointer"}}>Отмена</button>
        <button onClick={function(){if(window.confirm("Удалить "+p.name+"?"))deletePack(p.id)}} style={{padding:"5px 8px",borderRadius:5,border:"1px solid #ef444440",background:"#1a1008",color:"#ef4444",fontSize:9,cursor:"pointer"}}>🗑️</button>
      </div>
    </div>:
    /* View mode */
    <div style={{padding:"10px 12px",display:"flex",gap:10,alignItems:"flex-start"}}>
      <div style={{fontSize:20,flexShrink:0,marginTop:1}}>{p.icon}</div>
      <div style={{flex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10,color:"#fef3c7"}}>{p.name}</span>
          <span style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:10,color:"#f59e0b",background:"#2d1f00",borderRadius:4,padding:"1px 6px",whiteSpace:"nowrap",flexShrink:0,marginLeft:6}}>{p.price}</span>
        </div>
        {p.items.map(function(it,j){return<div key={j} style={{fontSize:8,color:"#d97706",lineHeight:1.6}}>• {it}</div>})}
      </div>
      {isGM&&editMode&&<button onClick={function(){startEdit(p)}} style={{background:"none",border:"none",color:"#f59e0b",cursor:"pointer",fontSize:12,flexShrink:0,padding:"0 2px"}}>✏️</button>}
    </div>}
  </div>);
})}
</div>

{/* Middle image */}
{img2?<div style={{position:"relative",marginBottom:14}}>
  <img src={img2} style={{width:"100%",maxHeight:200,objectFit:"cover",borderRadius:10}} alt="companions"/>
  {isGM&&editMode&&<label style={{position:"absolute",bottom:6,right:6,background:"rgba(0,0,0,0.8)",border:"1px solid #f59e0b",borderRadius:5,padding:"3px 8px",color:"#f59e0b",cursor:"pointer",fontSize:8}}>🖼️ Сменить<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){setDonateImg("img2",ev.target.result)};r.readAsDataURL(f)}}/></label>}
</div>:isGM&&editMode?<label style={{display:"block",marginBottom:14,padding:"20px",borderRadius:10,border:"2px dashed #4b3800",color:"#f59e0b",cursor:"pointer",fontSize:10,textAlign:"center",background:"#1a1008"}}>🖼️ Загрузить картинку<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){setDonateImg("img2",ev.target.result)};r.readAsDataURL(f)}}/></label>:null}

{/* QR */}
<div style={{background:"#1a1008",border:"1px solid #4b3800",borderRadius:12,padding:"14px",marginBottom:14,textAlign:"center"}}>
  <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10,color:"#f59e0b",marginBottom:10}}>💳 Оплата</div>
  {qrImg?<div style={{position:"relative",display:"inline-block"}}>
    <img src={qrImg} style={{width:180,height:180,borderRadius:8,objectFit:"contain",background:"#fff",padding:6,display:"block"}} alt="QR"/>
    {isGM&&editMode&&<label style={{position:"absolute",bottom:4,right:4,background:"rgba(0,0,0,0.85)",border:"1px solid #f59e0b",borderRadius:5,padding:"3px 8px",color:"#f59e0b",cursor:"pointer",fontSize:8}}>🔄 QR<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){setDonateImg("qr",ev.target.result)};r.readAsDataURL(f)}}/></label>}
  </div>:
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
    <div style={{width:140,height:140,background:"#111",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",border:"2px dashed #4b3800"}}>
      {isGM&&editMode?<label style={{cursor:"pointer",textAlign:"center",padding:10}}><div style={{fontSize:28}}>📷</div><div style={{fontSize:8,color:"#f59e0b",marginTop:4}}>Загрузить QR-код</div><input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){setDonateImg("qr",ev.target.result)};r.readAsDataURL(f)}}/></label>:<div style={{textAlign:"center"}}><div style={{fontSize:32}}>📱</div><div style={{fontSize:8,color:"#4b5563",marginTop:4}}>QR появится здесь</div></div>}
    </div>
  </div>}
</div>

{/* Conditions */}
<div style={{background:"#0d0d0d",border:"1px solid #1f2937",borderRadius:10,padding:"12px 14px",marginBottom:8}}>
  <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:9,color:"#6b7280",marginBottom:8}}>📜 Условия использования</div>
  {CONDITIONS.map(function(c,i){return<div key={i} style={{fontSize:8,color:"#4b5563",lineHeight:1.7}}>⚠️ {c}</div>})}
</div>
<div style={{textAlign:"center",fontSize:8,color:"#1f2937",marginTop:8}}>Nox Aeterna © Здоровье не продаётся. Хотя...</div>
</div>
</div>)}


/* ── MAIN APP ── */
export default function App(){
var _r=useState(null);var room=_r[0];var setRoom=_r[1];var _gm=useState(false);var isGM=_gm[0];var setIsGM=_gm[1];var _pn=useState("");var pN=_pn[0];var sPN=_pn[1];var _pid=useState(null);var pId=_pid[0];var sPId=_pid[1];
/* Автовход из localStorage */
useEffect(function(){
  try{
    var saved=localStorage.getItem("nox_session");
    if(!saved)return;
    var s=JSON.parse(saved);
    if(!s.room)return;
    /* Проверяем что комната ещё существует */
    get(ref(db,"rooms/"+s.room)).then(function(snap){
      if(!snap.exists())return;
      setRoom(s.room);
      setIsGM(!!s.isGM);
      if(s.playerName)sPN(s.playerName);
    }).catch(function(){});
  }catch(e){}
},[]);
var _ch=useState({});var chars=_ch[0];var sCh=_ch[1];var _lo=useState({});var lore=_lo[0];var sLo=_lo[1];var _mp=useState({});var mapData=_mp[0];var sMapData=_mp[1];var _lg=useState([]);var logs=_lg[0];var sLg=_lg[1];var _nt=useState({});var npcTempl=_nt[0];var sNpcTempl=_nt[1];var _sn=useState({});var spawned=_sn[0];var sSpawned=_sn[1];
var _pa=useState({});var pendAtk=_pa[0];var sPendAtk=_pa[1];
var _dme=useState({});var dmgEvents=_dme[0];var sDmgEvents=_dme[1];
var _ld=useState(false);var loaded=_ld[0];var sLoaded=_ld[1];
function handleJoin(rc,nm,gm){
  setRoom(rc);setIsGM(gm);if(nm)sPN(nm);
  try{localStorage.setItem("nox_session",JSON.stringify({room:rc,isGM:!!gm,playerName:nm||""}))}catch(e){}
}
useEffect(function(){if(!room)return;sLoaded(false);var u=[];u.push(onValue(ref(db,"rooms/"+room+"/characters"),function(s){sCh(s.val()||{});sLoaded(true)}));u.push(onValue(ref(db,"rooms/"+room+"/lore"),function(s){sLo(s.val()||{})}));u.push(onValue(ref(db,"rooms/"+room+"/mapData"),function(s){sMapData(s.val()||{})}));u.push(onValue(ref(db,"rooms/"+room+"/npcTemplates"),function(s){sNpcTempl(s.val()||{})}));u.push(onValue(ref(db,"rooms/"+room+"/spawned"),function(s){sSpawned(s.val()||{})}));u.push(onValue(ref(db,"rooms/"+room+"/logs"),function(s){var d=s.val()||{};sLg(Object.values(d).sort(function(a,b){return(b.ts||0)-(a.ts||0)}).slice(0,100))}));u.push(onValue(ref(db,"rooms/"+room+"/pendingAttacks"),function(s){sPendAtk(s.val()||{})}));
u.push(onValue(ref(db,"rooms/"+room+"/dmgEvents"),function(s){sDmgEvents(s.val()||{})}));return function(){u.forEach(function(x){x()})}},[room]);
useEffect(function(){if(!room||isGM||!pN||pId)return;
get(ref(db,"rooms/"+room+"/characters")).then(function(snap){
  var data=snap.val()||{};
  var ex=Object.entries(data).find(function(e){return e[1].name===pN});
  if(ex){sPId(ex[0]);return}
  var nid="p_"+Date.now();
  set(ref(db,"rooms/"+room+"/characters/"+nid),nC(pN));
  sPId(nid);
})},[room,isGM,pN,pId]);
function saveChar(id,d){if(!room)return;var c=Object.assign({},d);delete c._fbId;set(ref(db,"rooms/"+room+"/characters/"+id),c)}
function deleteChar(id){if(!room)return;remove(ref(db,"rooms/"+room+"/characters/"+id))}
function saveLore(d){if(!room)return;set(ref(db,"rooms/"+room+"/lore"),d)}
function saveMap(d){if(!room)return;set(ref(db,"rooms/"+room+"/mapData"),d)}
function addLog(e){if(!room)return;set(ref(db,"rooms/"+room+"/logs/"+Date.now()),Object.assign({},e,{ts:Date.now()}))}
function clearLogs(){if(!room)return;set(ref(db,"rooms/"+room+"/logs"),null)}
function saveNpcTempl(d){if(!room)return;set(ref(db,"rooms/"+room+"/npcTemplates"),d)}
function savePendingAttack(d){if(!room)return;set(ref(db,"rooms/"+room+"/pendingAttacks/"+d.id),d)}
function clearPendingAttack(id){if(!room)return;remove(ref(db,"rooms/"+room+"/pendingAttacks/"+id))}
function clearDmgEvent(charId){if(!room)return;remove(ref(db,"rooms/"+room+"/dmgEvents/"+charId))}
function saveSpawned(d){if(!room)return;set(ref(db,"rooms/"+room+"/spawned"),d)}
function leave(){
  setRoom(null);setIsGM(false);sPN("");sPId(null);sCh({});sLo({});sLg([]);
  try{localStorage.removeItem("nox_session")}catch(e){}
}
var _cp=useState(false);var cp=_cp[0];var sCP=_cp[1];var _sd=useState(false);var showDonate=_sd[0];var sShowDonate=_sd[1];
if(!room)return <Lobby onJoin={handleJoin}/>;
var ca=Object.entries(chars).map(function(e){return Object.assign({},e[1],{_fbId:e[0]})});
return(<div style={{fontFamily:"'Nunito',sans-serif",background:"linear-gradient(180deg,#fefcf5,#f5efe3)",minHeight:"100vh",maxWidth:520,margin:"0 auto",display:"flex",flexDirection:"column"}}><style>{CSS}</style>
{showDonate&&<DonatePage onClose={function(){sShowDonate(false)}} isGM={isGM} saveMap={saveMap} mapData={mapData}/>}
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 10px",background:"#2d2a24",color:"#e8e0d4",fontSize:10,gap:4}}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700}}>✦ Nox Aeterna</span><div style={{display:"flex",gap:4,alignItems:"center"}}><button onClick={function(){sShowDonate(true)}} style={{background:"linear-gradient(90deg,#f59e0b,#d97706)",border:"none",borderRadius:4,padding:"2px 8px",color:"#1a1a1a",cursor:"pointer",fontSize:9,fontFamily:"'Cinzel',serif",fontWeight:700}}>💰 Донат</button><button onClick={function(){if(navigator.clipboard){navigator.clipboard.writeText(room);sCP(true);setTimeout(function(){sCP(false)},1500)}}} style={{background:"none",border:"1px solid #5c5548",borderRadius:4,padding:"2px 8px",color:"#e8e0d4",cursor:"pointer",fontSize:10,fontFamily:"'Cinzel',serif"}}>{cp?"✓":"Код: "+room}</button><button onClick={leave} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:10}}>Выйти</button></div></div>
{isGM?<GMPanel characters={ca} saveChar={saveChar} deleteChar={deleteChar} lore={lore} saveLore={saveLore} logs={logs} addLog={addLog} clearLogs={clearLogs} mapData={mapData} saveMap={saveMap} npcTempl={npcTempl} saveNpcTempl={saveNpcTempl} spawned={spawned} saveSpawned={saveSpawned} roomCode={room} pendAtk={pendAtk} savePendingAttack={savePendingAttack} clearPendingAttack={clearPendingAttack}/>:(function(){var my=ca.find(function(c){return c._fbId===pId});if(!my)return <div style={{padding:20,textAlign:"center"}}><div style={{fontFamily:"'Cinzel',serif",fontSize:16,fontWeight:700}}>⏳ Подключение...</div></div>;return <GameView char={my} save={function(d){saveChar(pId,d)}} isGM={false} logs={logs} addLog={addLog} lore={lore} mapData={mapData} saveMap={saveMap} characters={ca} spawned={spawned} saveSpawned={saveSpawned} pendAtk={pendAtk} clearPendingAttack={clearPendingAttack} room={room} dmgEvents={dmgEvents} clearDmgEvent={clearDmgEvent}/>})()}
</div>)}

var S={lb:{display:"block",fontSize:8,fontWeight:700,color:"#5c5548",marginBottom:1,textTransform:"uppercase",letterSpacing:0.5},inp:{width:"100%",padding:"4px 5px",border:"2px solid #e8e0d4",borderRadius:5,fontSize:10,fontFamily:"'Nunito',sans-serif",background:"#fefdfb",color:"#2d2a24",outline:"none"},sm:{width:20,height:20,border:"2px solid #e8e0d4",borderRadius:4,background:"#fefdfb",cursor:"pointer",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",color:"#5c5548"},ab:{padding:"2px 6px",borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:"'Nunito',sans-serif",fontWeight:700},bud:{border:"2px solid",borderRadius:7,padding:"4px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}};
