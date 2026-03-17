import { useState } from "react";

var roll1 = function(s) { return Math.floor(Math.random() * s) + 1; };
var rollN = function(c, s) { return Array.from({ length: c }, function() { return roll1(s); }); };
var sum = function(a) { return a.reduce(function(x, y) { return x + y; }, 0); };
var now = function() { return new Date().toLocaleTimeString(); };
var pick = function(a) { return a[Math.floor(Math.random() * a.length)]; };

var CSS = '@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Nunito:wght@400;600;700&display=swap");@keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes popIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#c4b8a4;border-radius:3px}';

var IconChar = function() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; };
var IconBattle = function() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/></svg>; };
var IconInv = function() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>; };
var IconLib = function() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; };

var LORE_CHAPTERS = [
  { id: "map", title: "Карта Аэтернии", icon: "🗺️", color: "#10b981" },
  { id: "intro", title: "Введение", icon: "📜", color: "#3b82f6" },
  { id: "peoples", title: "Народы Аэтернии", icon: "👥", color: "#8b5cf6" },
  { id: "trade", title: "Торговые Маршруты Аэтернии", icon: "🛒", color: "#f59e0b" },
  { id: "world", title: "Особенности мира Аэтернии", icon: "🌍", color: "#10b981" },
  { id: "eastfal", title: "Ист-Фаль — Восточная Держава", icon: "🏰", color: "#ef4444" },
  { id: "westfal", title: "Вестфаль — Западная Держава", icon: "🏰", color: "#3b82f6" },
  { id: "ergaria", title: "Ближняя Эргария — Три Вольных Берега", icon: "🌊", color: "#06b6d4" },
  { id: "elves", title: "Эльфы Эргария", icon: "🧝", color: "#10b981" },
  { id: "dwarves", title: "Дварфы Эргария", icon: "⛏️", color: "#f97316" },
  { id: "zarmakhal", title: "Зар-Махаль — Халифат Лунного Порога", icon: "🌙", color: "#8b5cf6" },
  { id: "raksi", title: "Ракси Ашкандара — Кочевые и Оседлые", icon: "🐎", color: "#d97706" },
  { id: "dragonborn", title: "Драконорождённые — Народ Пламени и Чести", icon: "🐉", color: "#ef4444" },
  { id: "rebel", title: "Народы Мятежного Бога", icon: "⚡", color: "#7c3aed" },
  { id: "iznanка", title: "Изнанка — О Мельтарионе", icon: "💀", color: "#1f2937" },
];

var STATS_DEF = [
  { key:"INT",full:"Интеллект",color:"#6366f1",emoji:"🧠" },
  { key:"REF",full:"Рефлексы",color:"#f59e0b",emoji:"⚡" },
  { key:"DEX",full:"Ловкость",color:"#10b981",emoji:"🏹" },
  { key:"BODY",full:"Тело",color:"#ef4444",emoji:"💪" },
  { key:"EMP",full:"Эмпатия",color:"#ec4899",emoji:"💜" },
  { key:"CRA",full:"Крафт",color:"#f97316",emoji:"🔨" },
  { key:"WILL",full:"Воля",color:"#8b5cf6",emoji:"🔥" }
];
var SKILLS_DEF = {
  INT:[{name:"Awareness",x2:false},{name:"Teaching",x2:true},{name:"Streetwise",x2:false},{name:"Lore",x2:false},{name:"Gambling",x2:false},{name:"Wilderness Survival",x2:false},{name:"Navigating",x2:false}],
  REF:[{name:"Battle Weapon",x2:true},{name:"Simple Weapon",x2:false},{name:"Guns",x2:true},{name:"Archery",x2:true}],
  DEX:[{name:"Acrobatics",x2:false},{name:"Ride/Drive",x2:false},{name:"Sleight of Hands",x2:false},{name:"Stealth",x2:false},{name:"Dodge",x2:true}],
  BODY:[{name:"Brawl",x2:false},{name:"Resistance",x2:false},{name:"Athletics",x2:false},{name:"Swimming",x2:false}],
  EMP:[{name:"Charisma",x2:false},{name:"Deception",x2:false},{name:"Performance",x2:false},{name:"Seduction",x2:true}],
  CRA:[{name:"Alchemy",x2:false},{name:"Blacksmithing",x2:false},{name:"Jewel Crafting",x2:true},{name:"Tinkering",x2:true}],
  WILL:[{name:"Spellcasting",x2:true},{name:"Magic Resist",x2:true}]
};
var WS = {Battle:"Battle Weapon",Simple:"Simple Weapon",Guns:"Guns",Archery:"Archery"};
var DT = ["К","Р","Д","С","П"];
var WT = ["Battle","Simple","Guns","Archery"];
var ZONES = [{r:1,name:"Голова",mult:3,e:"🧠",slot:"head"},{r:2,name:"Шея",mult:2,e:"🫁",slot:"body"},{r:3,name:"Торс",mult:1,e:"🫀",slot:"body"},{r:4,name:"Руки",mult:1,e:"💪",slot:"body"},{r:5,name:"Пах",mult:2,e:"⚠️",slot:"body"},{r:6,name:"Ноги",mult:1,e:"🦵",slot:"body"}];
var ARMOR_T = [{id:"none",name:"Нет",bodyReq:0,desc:""},{id:"light",name:"Лёгкая",bodyReq:4,desc:"Простое — ½ урона"},{id:"medium",name:"Средняя",bodyReq:6,desc:"Режущее — ½, колющее — полный"},{id:"heavy",name:"Тяжёлая",bodyReq:8,desc:"Всё кроме дробящего поглощается, дробящее — полный"}];
var PROFS = [
  {id:"none",name:"— Нет —",desc:"",ab:"",abN:"",pS:[],pSk:[]},
  {id:"merchant",name:"Купец",desc:"Торговля.",ab:"+5 Charisma/день.",abN:"Мастер Обмена",pS:["EMP","INT"],pSk:["Charisma","Deception","Streetwise","Gambling","Ride/Drive"]},
  {id:"warrior",name:"Воин",desc:"Боец.",ab:"+5 атака/день.",abN:"Стойкость Дуэлянта",pS:["REF","BODY"],pSk:["Battle Weapon","Resistance","Athletics","Dodge","Simple Weapon"]},
  {id:"priest",name:"Священник",desc:"Наставник.",ab:"Воля Судьбы.",abN:"Воля Судьбы",pS:["WILL","EMP"],pSk:["Spellcasting","Performance","Lore","Magic Resist","Charisma"]},
  {id:"artisan",name:"Ремесленник",desc:"Механизмы.",ab:"Оценка механизмов.",abN:"Рука Мастера",pS:["CRA","INT"],pSk:["Blacksmithing","Tinkering","Alchemy","Jewel Crafting","Lore"]},
  {id:"sensitive",name:"Чувствительный",desc:"Хаос-магия.",ab:"+1d6 урона.",abN:"Хаот. Всплеск",pS:["WILL","EMP"],pSk:["Spellcasting","Magic Resist","Awareness","Lore","Performance"]}
];
var RACES = [
  {id:"none",name:"— Нет —",desc:"",st:{},sk:{},sp:null,fp:false,bsp:false},
  {id:"human",name:"Человек",desc:"Адаптивные.",st:{EMP:1},sk:{Streetwise:2,"Ride/Drive":1},sp:"+1 навык",fp:true,bsp:true},
  {id:"elf_sun",name:"Эльф (Солнечный)",desc:"Маги.",st:{WILL:1,INT:1,BODY:-1},sk:{Spellcasting:2,Lore:1,Performance:1},sp:null,fp:false,bsp:false},
  {id:"elf_wood",name:"Эльф (Лесной)",desc:"Охотники.",st:{DEX:1,REF:1,WILL:-1},sk:{Archery:2,Stealth:1,"Wilderness Survival":1},sp:null,fp:false,bsp:false},
  {id:"dwarf_high",name:"Гном (Воитель)",desc:"Стражи.",st:{BODY:1,REF:1,EMP:-1},sk:{"Battle Weapon":2,Resistance:1},sp:null,fp:false,bsp:false},
  {id:"dwarf_deep",name:"Гном (Ремесленник)",desc:"Кузнецы.",st:{CRA:2,DEX:-1},sk:{Blacksmithing:2,"Jewel Crafting":1,Lore:1},sp:null,fp:false,bsp:false},
  {id:"dwarf_dark",name:"Гном (Тёмный)",desc:"Слепые.",st:{INT:1,DEX:1,EMP:-2},sk:{Awareness:2,"Wilderness Survival":2},sp:"Слепота",fp:false,bsp:false},
  {id:"azgul",name:"Азгул",desc:"Солдаты.",st:{BODY:2,WILL:-1,EMP:-1},sk:{Resistance:2,"Battle Weapon":1,Athletics:1},sp:null,fp:false,bsp:false},
  {id:"dragonborn",name:"Драконорожденный",desc:"Огонь.",st:{BODY:1,WILL:1,DEX:-1},sk:{"Battle Weapon":2,Resistance:1},sp:"Breath 1d8",fp:false,bsp:false},
  {id:"kobold",name:"Кобольд",desc:"Ловушки.",st:{DEX:1,CRA:1,BODY:-2},sk:{Tinkering:2,Stealth:2,"Sleight of Hands":1},sp:null,fp:false,bsp:false},
  {id:"drow",name:"Дроу",desc:"Яды.",st:{DEX:1,INT:1,EMP:-1},sk:{Alchemy:1,Spellcasting:1,Deception:1,Stealth:1},sp:null,fp:false,bsp:false}
];
var NAMES_P = ["Альдрик","Бранн","Каэль","Дариен","Фенрис","Горан","Хальдор","Игнис","Кайлен","Мирон","Оррин","Раэль","Сигмар","Тарик","Аэлла","Бриана","Элара","Фрейя","Гвен","Кайра","Лианна","Мирабель","Равенна","Рен","Эш","Морган","Сторм"];

function iS(){var s={};STATS_DEF.forEach(function(x){s[x.key]=1});return s}
function iSk(){var s={};Object.values(SKILLS_DEF).flat().forEach(function(x){s[x.name]=0});return s}
function uSP(s){return Object.values(s).reduce(function(a,b){return a+b},0)}
function uSkP(s){var t=0;Object.values(SKILLS_DEF).flat().forEach(function(x){t+=x.x2?(s[x.name]||0)*2:(s[x.name]||0)});return t}
function gE(b,bo){var r=Object.assign({},b);Object.entries(bo||{}).forEach(function(e){r[e[0]]=(r[e[0]]||0)+e[1]});return r}
function cF(c){var rc=RACES.find(function(r){return r.id===c.raceId})||RACES[0];var es=gE(c.stats,rc.st);if(rc.fp&&c.humanBonusStat)es[c.humanBonusStat]=(es[c.humanBonusStat]||0)+1;return{race:rc,fs:es,eSk:gE(c.skills,rc.sk)}}
function mHP(f){return((f.BODY||0)+(f.WILL||0))*2}

function nC(){return{id:Date.now(),name:"",level:1,profId:"none",raceId:"none",humanBonusStat:"",notes:"",age:"",height:"",weight:"",eyeColor:"",hair:"",bio:"",friends:[],enemies:[],stats:iS(),skills:iSk(),locked:false,curHp:null,hpOv:null,curWill:null,willOv:null,weapons:[],lvlPts:0,spentLvlPts:0,armors:[],equippedHead:null,equippedBody:null,inventory:[],gold:0}}

function rnd(pId){
  var pr=PROFS.find(function(p){return p.id===pId})||PROFS[0];var rc=pick(RACES.filter(function(r){return r.id!=="none"}));
  var st=iS();var rem=33;var pb=Math.floor(rem*0.7);var sp=0;
  if(pr.pS.length>0)for(var i=0;i<pb;i++){var cn=pr.pS.filter(function(k){return st[k]<8});if(!cn.length)break;st[pick(cn)]++;sp++}
  var lf=rem-sp;var ak=STATS_DEF.map(function(s){return s.key});for(var j=0;j<lf;j++){var c2=ak.filter(function(k){return st[k]<8});if(!c2.length)break;st[pick(c2)]++}
  var sk=iSk();var aS=Object.values(SKILLS_DEF).flat();var co=function(n){var d=aS.find(function(s){return s.name===n});return d&&d.x2?2:1};
  var bk=rc.bsp?1:0;var sB=60+bk;var sp2=Math.floor(sB*0.7);var ss=0;
  if(pr.pSk.length>0)for(var x=0;x<200&&ss<sp2;x++){var c3=pr.pSk.filter(function(n){return sk[n]<8&&co(n)<=(sB-ss)});if(!c3.length)break;var n2=pick(c3);sk[n2]++;ss+=co(n2)}
  var sl=sB-ss;for(var y=0;y<200&&sl>0;y++){var c4=aS.map(function(s){return s.name}).filter(function(n){return sk[n]<6&&co(n)<=sl});if(!c4.length)break;var n3=pick(c4);sk[n3]++;sl-=co(n3)}
  var hb="";if(rc.fp&&pr.pS.length>0)hb=pick(pr.pS);
  return{name:pick(NAMES_P),raceId:rc.id,humanBonusStat:hb,stats:st,skills:sk}
}

/* Armor damage calc */
function calcArmorEffect(armorType, dmgType, rawDmg) {
  // Returns: armorDmg (damage to armor HP), hpDmg (damage to character HP), desc
  if (armorType === "none") return { armorDmg: 0, hpDmg: rawDmg, desc: "Без брони" };

  if (dmgType === "П") return { armorDmg: 0, hpDmg: rawDmg, desc: "Пуля: игнорирует броню" };

  if (armorType === "light") {
    if (dmgType === "К") return { armorDmg: 0, hpDmg: rawDmg, desc: "К пробивает лёгкую → урон по HP" };
    if (dmgType === "Р") return { armorDmg: rawDmg, hpDmg: 0, desc: "Р → урон по броне" };
    if (dmgType === "Д") return { armorDmg: rawDmg * 2, hpDmg: rawDmg, desc: "Д → 2× по броне + по HP" };
    if (dmgType === "С") return { armorDmg: rawDmg * 2, hpDmg: 0, desc: "С → 2× по броне" };
    return { armorDmg: 0, hpDmg: rawDmg, desc: "" };
  }
  if (armorType === "medium") {
    if (dmgType === "К") { var half = Math.floor(rawDmg / 2); return { armorDmg: half, hpDmg: 0, desc: "К → ½ по средней броне" }; }
    if (dmgType === "Р") return { armorDmg: 0, hpDmg: 0, desc: "Р не пробивает среднюю" };
    if (dmgType === "Д") return { armorDmg: rawDmg * 2, hpDmg: rawDmg, desc: "Д → 2× по броне + по HP" };
    if (dmgType === "С") return { armorDmg: rawDmg * 2, hpDmg: rawDmg, desc: "С пробивает среднюю → 2× броня + HP" };
    return { armorDmg: 0, hpDmg: 0, desc: "" };
  }
  if (armorType === "heavy") {
    if (dmgType === "К") return { armorDmg: 0, hpDmg: 0, desc: "К не пробивает тяжёлую" };
    if (dmgType === "Р") return { armorDmg: 0, hpDmg: 0, desc: "Р не пробивает тяжёлую" };
    if (dmgType === "Д") return { armorDmg: rawDmg * 2, hpDmg: rawDmg, desc: "Д → 2× по броне + по HP" };
    if (dmgType === "С") return { armorDmg: 0, hpDmg: 0, desc: "С не пробивает тяжёлую" };
    return { armorDmg: 0, hpDmg: 0, desc: "" };
  }
  return { armorDmg: 0, hpDmg: rawDmg, desc: "" };
}

/* ── Roll Popup ── */
function RollPopup(p) {
  if (!p.roll) return null;
  var r = p.roll; var iC = r.d10 === 10; var iF = r.d10 === 1;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, animation: "fadeIn 0.2s" }} onClick={p.onClose}>
      <div onClick={function(e) { e.stopPropagation(); }} style={{ background: iC ? "linear-gradient(135deg,#fef3c7,#fde68a)" : iF ? "linear-gradient(135deg,#fee2e2,#fecaca)" : "linear-gradient(135deg,#fefcf5,#f5efe3)", border: iC ? "3px solid #f59e0b" : iF ? "3px solid #ef4444" : "3px solid #c4b8a4", borderRadius: 16, padding: "16px 22px", textAlign: "center", minWidth: 240, maxWidth: 350, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", animation: "popIn 0.3s" }}>
        <div style={{ fontSize: 12, color: "#5c5548", fontWeight: 700, marginBottom: 4 }}>{r.label}</div>
        <div style={{ background: "#fff", border: "2px solid #e8e0d4", borderRadius: 10, padding: "8px 10px", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900, color: iC ? "#d97706" : iF ? "#dc2626" : "#3b82f6" }}>{"🎲" + r.d10}</span>
            {(r.parts || []).map(function(pt, i) {
              return <span key={i} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ color: "#8b7e6a", fontSize: 13 }}>+</span>
                <span style={{ background: "#f5f0e8", borderRadius: 5, padding: "2px 6px", textAlign: "center" }}>
                  <span style={{ color: "#8b7e6a", fontSize: 7, display: "block" }}>{pt.label}</span>
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 700 }}>{pt.value}</span>
                </span>
              </span>;
            })}
          </div>
        </div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 30, fontWeight: 900, color: iC ? "#d97706" : iF ? "#dc2626" : "#2d2a24" }}>{"= " + r.total}</div>
        {iC && <div style={{ fontSize: 13, marginTop: 2, color: "#d97706", fontWeight: 700 }}>🌟 КРИТ!</div>}
        {iF && <div style={{ fontSize: 13, marginTop: 2, color: "#dc2626", fontWeight: 700 }}>💀 ПРОВАЛ!</div>}
        {r.subtext && <div style={{ fontSize: 10, marginTop: 3, color: "#6b21a8", fontWeight: 600, whiteSpace: "pre-line" }}>{r.subtext}</div>}
        <button onClick={p.onClose} style={{ marginTop: 10, padding: "4px 18px", borderRadius: 6, border: "2px solid #c4b8a4", background: "#fefdfb", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>OK</button>
      </div>
    </div>
  );
}

/* ── Main Menu ── */
function MainMenu(pr) {
  var _a = useState(false), sg = _a[0], sSG = _a[1];
  var _b = useState(""), gl = _b[0], sGL = _b[1];
  var _c = useState(""), gp = _c[0], sGP = _c[1];
  var _d = useState(""), ge = _d[0], sGE = _d[1];
  function tryGM() { if (gl === "admin" && gp === "admin") { pr.onGM(); sSG(false); } else sGE("Неверный логин/пароль"); }
  return (
    <div style={Object.assign({}, S.wr, { justifyContent: "flex-start" })}>
      <style>{CSS}</style>
      <div style={{ textAlign: "center", padding: "24px 14px 10px" }}>
        <div style={{ fontSize: 22, fontFamily: "'Cinzel',serif", fontWeight: 900, color: "#2d2a24" }}>✦ Fantasy Companion</div>
      </div>
      <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
        {pr.characters.length === 0 && <div style={{ textAlign: "center", padding: 24, color: "#8b7e6a", fontStyle: "italic", fontSize: 12 }}>Создай первого персонажа</div>}
        {pr.characters.map(function(c) {
          var rc = RACES.find(function(r) { return r.id === c.raceId; }) || RACES[0];
          var pf = PROFS.find(function(p) { return p.id === c.profId; }) || PROFS[0];
          return <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fefcf5", border: "2px solid #e8e0d4", borderRadius: 10, padding: "8px 10px", cursor: "pointer" }} onClick={function() { pr.onSelect(c.id); }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#e8d5b0,#d4c4a0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, fontFamily: "'Cinzel',serif", color: "#5c4a2a" }}>{c.name ? c.name[0].toUpperCase() : "?"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12 }}>{c.name || "?"}</div>
              <div style={{ fontSize: 9, color: "#8b7e6a" }}>{rc.name} · {pf.name} · Ур.{c.level}</div>
            </div>
            {c.locked && <span style={{ fontSize: 11 }}>🔒</span>}
            <button onClick={function(e) { e.stopPropagation(); pr.setCharacters(function(p) { return p.filter(function(x) { return x.id !== c.id; }); }); }} style={{ background: "none", border: "none", color: "#ef4444", fontSize: 14, cursor: "pointer" }}>✕</button>
          </div>;
        })}
      </div>
      {sg && <div style={{ margin: "0 12px 6px", padding: 10, background: "#f5f3ff", border: "2px solid #8b5cf620", borderRadius: 10 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12, color: "#7c3aed", marginBottom: 6 }}>🎭 Вход ГМ</div>
        <input style={S.inp} value={gl} onChange={function(e) { sGL(e.target.value); }} placeholder="Логин" />
        <input style={Object.assign({}, S.inp, { marginTop: 3 })} type="password" value={gp} onChange={function(e) { sGP(e.target.value); }} placeholder="Пароль" onKeyDown={function(e) { if (e.key === "Enter") tryGM(); }} />
        {ge && <div style={{ color: "#ef4444", fontSize: 9, marginTop: 2 }}>{ge}</div>}
        <div style={{ display: "flex", gap: 3, marginTop: 5 }}>
          <button onClick={tryGM} style={{ flex: 1, padding: 7, borderRadius: 7, border: "none", background: "#7c3aed", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 11 }}>Войти</button>
          <button onClick={function() { sSG(false); }} style={{ padding: "7px 10px", borderRadius: 7, border: "2px solid #e8e0d4", background: "#fff", cursor: "pointer", fontSize: 11 }}>✕</button>
        </div>
      </div>}
      <div style={{ padding: "4px 12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
        <button onClick={function() { pr.setCharacters(function(p) { return p.concat([nC()]); }); }} style={{ width: "100%", padding: 10, borderRadius: 10, border: "2px dashed #c4b8a4", background: "transparent", fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 13, color: "#5c4a2a", cursor: "pointer" }}>+ Создать</button>
        <button onClick={function() { sSG(true); }} style={{ width: "100%", padding: 9, borderRadius: 10, border: "2px solid #8b5cf630", background: "#8b5cf608", fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12, color: "#8b5cf6", cursor: "pointer" }}>🎭 ГМ</button>
      </div>
    </div>
  );
}

/* ── ContactList (Friends/Enemies) ── */
function ContactList(pr) {
  var items = pr.items; var onChange = pr.onChange;
  var _s = useState(false); var showAdd = _s[0]; var setShowAdd = _s[1];
  var _n = useState(""); var cName = _n[0]; var setCName = _n[1];
  var _r = useState(""); var cRace = _r[0]; var setCRace = _r[1];
  var _b = useState(""); var cBio = _b[0]; var setCBio = _b[1];
  var _re = useState(""); var cReason = _re[0]; var setCReason = _re[1];
  var _ed = useState(null); var editId = _ed[0]; var setEditId = _ed[1];

  function addContact() {
    if (!cName.trim()) return;
    if (editId) {
      onChange(items.map(function(it) { return it.id === editId ? Object.assign({}, it, { name: cName.trim(), race: cRace.trim(), bio: cBio.trim(), reason: cReason.trim() }) : it; }));
      setEditId(null);
    } else {
      onChange(items.concat([{ id: Date.now(), name: cName.trim(), race: cRace.trim(), bio: cBio.trim(), reason: cReason.trim() }]));
    }
    setCName(""); setCRace(""); setCBio(""); setCReason(""); setShowAdd(false);
  }
  function startEdit(it) {
    setCName(it.name); setCRace(it.race || ""); setCBio(it.bio || ""); setCReason(it.reason || "");
    setEditId(it.id); setShowAdd(true);
  }

  return (
    <div style={{ border: "2px solid " + pr.color + "20", borderRadius: 9, padding: "6px 8px", background: pr.bg + "60" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
        <label style={Object.assign({}, S.lb, { color: pr.color })}>{pr.label}</label>
        <button onClick={function() { setShowAdd(!showAdd); setEditId(null); setCName(""); setCRace(""); setCBio(""); setCReason(""); }} style={{ fontSize: 8, background: "none", border: "none", cursor: "pointer", color: pr.color, fontWeight: 700 }}>{showAdd ? "✕" : "+ Добавить"}</button>
      </div>
      {showAdd && (
        <div style={{ background: "#fff", borderRadius: 6, padding: 5, marginBottom: 4, display: "flex", flexDirection: "column", gap: 3, border: "1px solid #e8e0d4" }}>
          <div style={{ display: "flex", gap: 3 }}>
            <div style={{ flex: 2 }}><label style={Object.assign({}, S.lb, { fontSize: 6 })}>Имя</label><input style={Object.assign({}, S.inp, { fontSize: 9, padding: 3 })} value={cName} onChange={function(e) { setCName(e.target.value); }} placeholder="Имя" /></div>
            <div style={{ flex: 1 }}><label style={Object.assign({}, S.lb, { fontSize: 6 })}>Раса</label><input style={Object.assign({}, S.inp, { fontSize: 9, padding: 3 })} value={cRace} onChange={function(e) { setCRace(e.target.value); }} placeholder="Эльф" /></div>
          </div>
          <div><label style={Object.assign({}, S.lb, { fontSize: 6 })}>Краткое био</label><input style={Object.assign({}, S.inp, { fontSize: 9, padding: 3 })} value={cBio} onChange={function(e) { setCBio(e.target.value); }} placeholder="Торговец из Вестмарка" /></div>
          <div><label style={Object.assign({}, S.lb, { fontSize: 6 })}>Причина</label><input style={Object.assign({}, S.inp, { fontSize: 9, padding: 3 })} value={cReason} onChange={function(e) { setCReason(e.target.value); }} placeholder="Спас жизнь в бою" /></div>
          <button onClick={addContact} style={{ padding: 4, borderRadius: 4, border: "none", background: pr.color, color: "#fff", fontWeight: 700, fontSize: 9, cursor: "pointer" }}>{editId ? "Сохранить" : "Добавить"}</button>
        </div>
      )}
      {items.length === 0 && !showAdd && <div style={{ textAlign: "center", padding: 6, color: "#8b7e6a", fontStyle: "italic", fontSize: 8 }}>Пусто</div>}
      {items.map(function(it) {
        return (
          <div key={it.id} style={{ display: "flex", alignItems: "flex-start", gap: 4, padding: "4px 5px", borderRadius: 5, background: "#fff", marginBottom: 2, border: "1px solid #e8e0d4" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#2d2a24" }}>{it.name}{it.race && <span style={{ fontSize: 8, color: "#8b7e6a", marginLeft: 3 }}>{it.race}</span>}</div>
              {it.bio && <div style={{ fontSize: 8, color: "#6b7280" }}>{it.bio}</div>}
              {it.reason && <div style={{ fontSize: 8, color: pr.color, fontStyle: "italic" }}>{it.reason}</div>}
            </div>
            <button onClick={function() { startEdit(it); }} style={{ background: "none", border: "none", fontSize: 9, cursor: "pointer", color: "#3b82f6", padding: 0 }}>✏️</button>
            <button onClick={function() { onChange(items.filter(function(x) { return x.id !== it.id; })); }} style={{ background: "none", border: "none", fontSize: 9, cursor: "pointer", color: "#ef4444", padding: 0 }}>✕</button>
          </div>
        );
      })}
    </div>
  );
}

/* ── CharacterTab ── */
function CharTab(pr) {
  var c = pr.char; var sC = pr.setChar; var oR = pr.onRoll; var gm = pr.isGM;
  var inf = cF(c); var rc = inf.race; var fs = inf.fs; var es = inf.eSk;
  var pf = PROFS.find(function(p) { return p.id === c.profId; }) || PROFS[0];
  var stL = 40 - uSP(c.stats); var bsk = rc.bsp ? 1 : 0; var skL = (60 + bsk) - uSkP(c.skills);
  var _os = useState(null); var oSt = _os[0]; var sOS = _os[1];
  var avL = c.lvlPts - c.spentLvlPts;

  function uS(k, d) {
    if (c.locked && !gm) {
      if (d < 0) return;
      if (avL < 5) return;
      sC(function(p) { var ns = Object.assign({}, p.stats); ns[k] = (ns[k] || 0) + 1; if (ns[k] > 10) return p; return Object.assign({}, p, { stats: ns, spentLvlPts: p.spentLvlPts + 5 }); });
      return;
    }
    if (c.locked) return;
    sC(function(p) { var nv = p.stats[k] + d; if (nv < 1 || nv > 8) return p; var ns = Object.assign({}, p.stats); ns[k] = nv; if (uSP(ns) > 40) return p; return Object.assign({}, p, { stats: ns }); });
  }
  function uSk(n, d) {
    if (c.locked && !gm) {
      if (d < 0) return; var skD = Object.values(SKILLS_DEF).flat().find(function(s) { return s.name === n; }); var cost = skD && skD.x2 ? 4 : 2;
      if (avL < cost) return;
      sC(function(p) { var ns = Object.assign({}, p.skills); ns[n] = (ns[n] || 0) + 1; if (ns[n] > 10) return p; return Object.assign({}, p, { skills: ns, spentLvlPts: p.spentLvlPts + cost }); });
      return;
    }
    if (c.locked) return;
    sC(function(p) { var nv = (p.skills[n] || 0) + d; if (nv < 0 || nv > 10) return p; var ns = Object.assign({}, p.skills); ns[n] = nv; if (uSkP(ns) > 60 + bsk) return p; return Object.assign({}, p, { skills: ns }); });
  }
  function rS(k) { var d = roll1(10); oR({ label: k, d10: d, parts: [{ label: k, value: fs[k] }], total: d + fs[k] }); }
  function rSk(n, sk) { var d = roll1(10); oR({ label: n, d10: d, parts: [{ label: sk, value: fs[sk] }, { label: n, value: es[n] || 0 }], total: d + fs[sk] + (es[n] || 0) }); }

  var _undo = useState(null); var undoState = _undo[0]; var setUndo = _undo[1];

  function doRandom() {
    // Save current state before randomizing
    setUndo({ name: c.name, raceId: c.raceId, humanBonusStat: c.humanBonusStat, stats: Object.assign({}, c.stats), skills: Object.assign({}, c.skills) });
    var r = rnd(c.profId);
    sC(function(p) { return Object.assign({}, p, r, { curHp: null, curWill: null }); });
  }
  function doUndo() {
    if (!undoState) return;
    sC(function(p) { return Object.assign({}, p, undoState, { curHp: null, curWill: null }); });
    setUndo(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 4 }}>
        {!c.locked && <button onClick={doRandom} style={{ flex: 1, padding: 8, borderRadius: 8, border: "2px solid #f59e0b40", background: "#fef3c7", fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12, color: "#92400e", cursor: "pointer" }}>🎲 Рандом</button>}
        {!c.locked && undoState && <button onClick={doUndo} style={{ padding: "8px 12px", borderRadius: 8, border: "2px solid #3b82f640", background: "#eff6ff", fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12, color: "#3b82f6", cursor: "pointer" }}>↩️</button>}
        <button onClick={function() { sC(function(p) { return Object.assign({}, p, { locked: !p.locked }); }); }} style={{ padding: "8px 12px", borderRadius: 8, border: c.locked ? "2px solid #ef444440" : "2px solid #10b98140", background: c.locked ? "#fef2f2" : "#ecfdf5", fontWeight: 700, fontSize: 12, cursor: "pointer", color: c.locked ? "#ef4444" : "#10b981", fontFamily: "'Cinzel',serif" }}>{c.locked ? "🔒" : "🔓"}</button>
      </div>
      {c.locked && avL > 0 && <div style={{ background: "#fffbeb", border: "2px solid #f59e0b40", borderRadius: 8, padding: "5px 8px", fontSize: 10, fontWeight: 700, color: "#92400e" }}>{"⬆️ Очки: " + avL + " (Стат:5 Навык:2/4×2)"}</div>}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        <div style={{ flex: 2, minWidth: 120 }}><label style={S.lb}>Имя</label><input style={S.inp} value={c.name} disabled={c.locked && !gm} onChange={function(e) { sC(function(p) { return Object.assign({}, p, { name: e.target.value }); }); }} /></div>
        <div style={{ flex: 1, minWidth: 50 }}><label style={S.lb}>Ур.</label><input style={Object.assign({}, S.inp, { background: "#f0f0f0" })} type="number" value={c.level} disabled /></div>
      </div>
      <div><label style={S.lb}>Раса</label><select value={c.raceId} disabled={c.locked && !gm} onChange={function(e) { sC(function(p) { return Object.assign({}, p, { raceId: e.target.value, curHp: null }); }); }} style={Object.assign({}, S.inp, { cursor: "pointer" })}>{RACES.map(function(r) { return <option key={r.id} value={r.id}>{r.name}</option>; })}</select></div>
      {rc.id !== "none" && <div style={{ background: "#f0f9ff", border: "1px solid #38bdf828", borderRadius: 8, padding: "5px 7px", fontSize: 9 }}>
        <b style={{ color: "#0369a1" }}>{rc.name}</b>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
          {Object.entries(rc.st).map(function(e) { return <span key={e[0]} style={{ padding: "0 4px", borderRadius: 3, fontSize: 8, fontWeight: 700, background: e[1] > 0 ? "#d1fae5" : "#fee2e2", color: e[1] > 0 ? "#065f46" : "#991b1b" }}>{(e[1] > 0 ? "+" : "") + e[1] + " " + e[0]}</span>; })}
        </div>
      </div>}
      {rc.fp && !c.locked && <div style={{ background: "#fef3c7", borderRadius: 7, padding: "4px 7px" }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: "#92400e", marginBottom: 2 }}>+1 хар-ка</div>
        <div style={{ display: "flex", gap: 2 }}>{STATS_DEF.filter(function(s) { return s.key !== "EMP"; }).map(function(st) { return <button key={st.key} onClick={function() { sC(function(p) { return Object.assign({}, p, { humanBonusStat: st.key, curHp: null }); }); }} style={{ padding: "1px 5px", borderRadius: 4, fontSize: 8, fontWeight: 700, cursor: "pointer", border: "2px solid", background: c.humanBonusStat === st.key ? st.color + "22" : "#fff", borderColor: c.humanBonusStat === st.key ? st.color : "#ddd", color: c.humanBonusStat === st.key ? st.color : "#888" }}>{st.key}</button>; })}</div>
      </div>}
      <div><label style={S.lb}>Профессия</label><select value={c.profId} disabled={c.locked && !gm} onChange={function(e) { sC(function(p) { return Object.assign({}, p, { profId: e.target.value }); }); }} style={Object.assign({}, S.inp, { cursor: "pointer" })}>{PROFS.map(function(p) { return <option key={p.id} value={p.id}>{p.name}</option>; })}</select></div>
      {pf.id !== "none" && <div style={{ background: "#fdf4ff", border: "1px solid #c084fc28", borderRadius: 8, padding: "5px 7px", fontSize: 9 }}><b style={{ color: "#7c3aed" }}>{pf.name}</b><div style={{ color: "#581c87" }}>{"⚡ " + pf.abN + ": " + pf.ab}</div></div>}

      {!c.locked && <div style={Object.assign({}, S.bud, { background: stL === 0 ? "#d1fae5" : "#eff6ff", borderColor: stL === 0 ? "#10b98140" : "#3b82f640" })}><span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 10 }}>⚔️ Статы</span><span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 13, color: stL === 0 ? "#10b981" : "#3b82f6" }}>{stL + "/40"}</span></div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: 3 }}>
        {STATS_DEF.map(function(st) { var b = c.stats[st.key]; var e = fs[st.key]; var rb = e - b; return (
          <div key={st.key} style={{ background: st.color + "08", border: "2px solid " + st.color + "18", borderRadius: 8, padding: "4px 2px", textAlign: "center" }}>
            <div style={{ fontSize: 11 }}>{st.emoji}<span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 9, color: st.color, marginLeft: 2 }}>{st.key}</span></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
              {(!c.locked || gm) && <button onClick={function() { uS(st.key, -1); }} style={Object.assign({}, S.sm, { width: 18, height: 18, fontSize: 9 })}>−</button>}
              <button onClick={function() { rS(st.key); }} style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>{e}</button>
              <button onClick={function() { uS(st.key, 1); }} style={Object.assign({}, S.sm, { width: 18, height: 18, fontSize: 9, color: st.color })}>+</button>
            </div>
            {rb !== 0 && <div style={{ fontSize: 7, color: rb > 0 ? "#059669" : "#dc2626", fontWeight: 700 }}>{"(" + b + (rb > 0 ? "+" : "") + rb + ")"}</div>}
          </div>
        ); })}
      </div>

      {!c.locked && <div style={Object.assign({}, S.bud, { background: skL === 0 ? "#d1fae5" : "#fef3c7", borderColor: skL === 0 ? "#10b98140" : "#f59e0b40" })}><span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 10 }}>📜 Навыки</span><span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 13, color: skL === 0 ? "#10b981" : "#d97706" }}>{skL + "/" + (60 + bsk)}</span></div>}

      {STATS_DEF.map(function(st) { var sks = SKILLS_DEF[st.key]; if (!sks || !sks.length) return null; var op = oSt === st.key; return (
        <div key={st.key} style={{ border: "1px solid " + st.color + "15", borderRadius: 8, overflow: "hidden" }}>
          <button onClick={function() { sOS(op ? null : st.key); }} style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "5px 8px", background: st.color + "06", border: "none", cursor: "pointer" }}><span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 9, color: st.color }}>{st.emoji + " " + st.key}</span><span style={{ fontSize: 9, color: "#8b7e6a", transform: op ? "rotate(180deg)" : "none" }}>▼</span></button>
          {op && <div style={{ padding: "2px 5px 4px", display: "flex", flexDirection: "column", gap: 1 }}>
            {sks.map(function(sk) { var bv = c.skills[sk.name] || 0; var ev = es[sk.name] || 0; var skD = sk; var cost = skD.x2 ? 4 : 2; return (
              <div key={sk.name} style={{ display: "flex", alignItems: "center", gap: 2, padding: "2px 3px", borderRadius: 4, background: ev > 0 ? st.color + "05" : "transparent" }}>
                <button onClick={function() { rSk(sk.name, st.key); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 9, padding: 0, opacity: ev > 0 ? 1 : 0.3 }}>🎲</button>
                <span style={{ flex: 1, fontSize: 8, fontWeight: ev > 0 ? 700 : 400 }}>{sk.name}{sk.x2 && <span style={{ color: "#ef4444", fontSize: 7 }}>×2</span>}</span>
                <span style={{ fontSize: 6, color: "#aaa" }}>{"d10+" + fs[st.key] + "+" + ev}</span>
                {(!c.locked || gm) && <button onClick={function() { uSk(sk.name, -1); }} style={Object.assign({}, S.sm, { width: 16, height: 16, fontSize: 7 })}>−</button>}
                <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 11, minWidth: 12, textAlign: "center", color: ev > 0 ? st.color : "#ccc" }}>{ev}</span>
                <button onClick={function() { uSk(sk.name, 1); }} style={Object.assign({}, S.sm, { width: 16, height: 16, fontSize: 7, color: st.color })}>+</button>
              </div>
            ); })}
          </div>}
        </div>
      ); })}
      {/* Character Profile */}
      <div style={{ border: "2px solid #e8e0d4", borderRadius: 9, padding: "8px 8px", background: "#fefdfb" }}>
        <label style={S.lb}>📋 Профиль персонажа</label>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {/* Portrait placeholder */}
          <div style={{ width: 80, height: 80, borderRadius: 8, background: "linear-gradient(135deg,#e8e0d4,#d4c4a0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, border: "2px solid #c4b8a4" }}>
            {c.name ? c.name[0].toUpperCase() : "?"}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ display: "flex", gap: 3 }}>
              <div style={{ flex: 1 }}><label style={Object.assign({}, S.lb, { fontSize: 7 })}>Возраст</label><input style={Object.assign({}, S.inp, { fontSize: 9, padding: 3 })} value={c.age || ""} onChange={function(e) { sC(function(p) { return Object.assign({}, p, { age: e.target.value }); }); }} placeholder="25" /></div>
              <div style={{ flex: 1 }}><label style={Object.assign({}, S.lb, { fontSize: 7 })}>Рост</label><input style={Object.assign({}, S.inp, { fontSize: 9, padding: 3 })} value={c.height || ""} onChange={function(e) { sC(function(p) { return Object.assign({}, p, { height: e.target.value }); }); }} placeholder="175 см" /></div>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <div style={{ flex: 1 }}><label style={Object.assign({}, S.lb, { fontSize: 7 })}>Вес</label><input style={Object.assign({}, S.inp, { fontSize: 9, padding: 3 })} value={c.weight || ""} onChange={function(e) { sC(function(p) { return Object.assign({}, p, { weight: e.target.value }); }); }} placeholder="70 кг" /></div>
              <div style={{ flex: 1 }}><label style={Object.assign({}, S.lb, { fontSize: 7 })}>Глаза</label><input style={Object.assign({}, S.inp, { fontSize: 9, padding: 3 })} value={c.eyeColor || ""} onChange={function(e) { sC(function(p) { return Object.assign({}, p, { eyeColor: e.target.value }); }); }} placeholder="Карие" /></div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 4 }}><label style={Object.assign({}, S.lb, { fontSize: 7 })}>Причёска</label><input style={Object.assign({}, S.inp, { fontSize: 9, padding: 3 })} value={c.hair || ""} onChange={function(e) { sC(function(p) { return Object.assign({}, p, { hair: e.target.value }); }); }} placeholder="Длинные тёмные волосы" /></div>
        <div style={{ marginTop: 4 }}><label style={Object.assign({}, S.lb, { fontSize: 7 })}>Биография</label><textarea style={Object.assign({}, S.inp, { minHeight: 50, resize: "vertical", fontSize: 9, padding: 4 })} value={c.bio || ""} onChange={function(e) { sC(function(p) { return Object.assign({}, p, { bio: e.target.value }); }); }} placeholder="История персонажа..." /></div>
      </div>

      {/* Contacts: Friends & Enemies */}
      {["friends", "enemies"].map(function(listKey) {
        var isFriends = listKey === "friends";
        var label = isFriends ? "🤝 Друзья" : "⚔️ Враги";
        var color = isFriends ? "#10b981" : "#ef4444";
        var bg = isFriends ? "#ecfdf5" : "#fef2f2";
        var items = c[listKey] || [];
        return (
          <ContactList key={listKey} label={label} color={color} bg={bg} items={items} onChange={function(newItems) {
            sC(function(p) { var u = {}; u[listKey] = newItems; return Object.assign({}, p, u); });
          }} />
        );
      })}
    </div>
  );
}

/* ── Combat Tab ── */
function CombatTab(pr) {
  var c = pr.char; var sC = pr.setChar; var logs = pr.logs; var aL = pr.addLog; var oR = pr.onRoll;
  var inf = cF(c); var fs = inf.fs; var es = inf.eSk; var rc = inf.race;
  var pf = PROFS.find(function(p) { return p.id === c.profId; }) || PROFS[0];
  var _n = useState(""); var note = _n[0]; var sN = _n[1];
  var _sa = useState(false); var sa = _sa[0]; var sSA = _sa[1];
  var _wn = useState(""); var wn = _wn[0]; var sWN = _wn[1];
  var _wt = useState("Battle"); var wt = _wt[0]; var sWT = _wt[1];
  var _wr = useState(1); var wr = _wr[0]; var sWR = _wr[1];
  var _wdt = useState("Р"); var wdt = _wdt[0]; var sWDT = _wdt[1];
  var _wb = useState(0); var wb = _wb[0]; var sWB = _wb[1];
  var _wdi = useState("1d6"); var wdi = _wdi[0]; var sWDI = _wdi[1];
  var _saa = useState(false); var saa = _saa[0]; var sSAA = _saa[1];
  var _an = useState(""); var an = _an[0]; var sAN = _an[1];
  var _at = useState("light"); var at = _at[0]; var sAT = _at[1];
  var _ah = useState(10); var ah = _ah[0]; var sAH = _ah[1];

  var mx = c.hpOv || mHP(fs); var curHp = c.curHp !== null ? c.curHp : mx;
  var mxW = c.willOv || fs.WILL || 1; var curW = c.curWill !== null ? c.curWill : mxW;
  var hpP = mx > 0 ? (curHp / mx) * 100 : 0;

  function sHp(v) { sC(function(p) { var m = p.hpOv || mHP(cF(p).fs); return Object.assign({}, p, { curHp: Math.max(0, Math.min(m, v)) }); }); }
  function sMHp(v) { sC(function(p) { return Object.assign({}, p, { hpOv: Math.max(1, v), curHp: Math.min(p.curHp !== null ? p.curHp : v, Math.max(1, v)) }); }); }
  function sWi(v) { sC(function(p) { var m = p.willOv || cF(p).fs.WILL || 1; return Object.assign({}, p, { curWill: Math.max(0, Math.min(m, v)) }); }); }

  function longRest() {
    sC(function(p) { var m = p.hpOv || mHP(cF(p).fs); var mw = p.willOv || cF(p).fs.WILL || 1; return Object.assign({}, p, { curHp: m, curWill: mw }); });
    aL({ id: Date.now(), time: now(), who: c.name || "???", type: "rest", label: "💤 Долгий отдых — HP и WILL восстановлены", detail: "", total: 0, note: "" });
  }

  var eqHead = c.armors.find(function(a) { return a.id === c.equippedHead; });
  var eqBody = c.armors.find(function(a) { return a.id === c.equippedBody; });

  function addArmor() {
    if (!an.trim()) return;
    var atDef = ARMOR_T.find(function(a) { return a.id === at; }) || ARMOR_T[0];
    if (fs.BODY < atDef.bodyReq) { alert("BODY (" + fs.BODY + ") < требуется (" + atDef.bodyReq + ")!"); return; }
    sC(function(p) { return Object.assign({}, p, { armors: p.armors.concat([{ id: Date.now(), name: an.trim(), type: at, hp: ah, maxHp: ah }]) }); });
    sAN(""); sSAA(false);
  }

  function equipArmor(armor, slot) {
    var atDef = ARMOR_T.find(function(a) { return a.id === armor.type; }) || ARMOR_T[0];
    if (fs.BODY < atDef.bodyReq) { alert("BODY (" + fs.BODY + ") < требуется (" + atDef.bodyReq + ")!"); return; }
    sC(function(p) { var u = {}; u[slot === "head" ? "equippedHead" : "equippedBody"] = armor.id; return Object.assign({}, p, u); });
  }

  function unequip(slot) { sC(function(p) { var u = {}; u[slot === "head" ? "equippedHead" : "equippedBody"] = null; return Object.assign({}, p, u); }); }

  function rollZone() {
    var d = roll1(6); var z = ZONES.find(function(x) { return x.r === d; });
    aL({ id: Date.now(), time: now(), who: c.name || "???", type: "zone", label: z.e + " " + z.name + " (×" + z.mult + ")", detail: "1d6=" + d, total: d, note: note });
    oR({ label: "🎯 Зона", d10: d, parts: [], total: d, subtext: z.e + " " + z.name + " — урон ×" + z.mult });
  }
  function rollDodge() {
    var d = roll1(10); var dv = fs.DEX || 0; var dg = es.Dodge || 0; var t = d + dv + dg;
    aL({ id: Date.now(), time: now(), who: c.name || "???", type: "dodge", label: "Уклонение", detail: "d10(" + d + ")+DEX(" + dv + ")+Dodge(" + dg + ")", total: t, note: note });
    oR({ label: "🛡️ Уклонение", d10: d, parts: [{ label: "DEX", value: dv }, { label: "Dodge", value: dg }], total: t });
  }
  function castSpell() {
    if (curW <= 0) { alert("Нет очков WILL!"); return; }
    sWi(curW - 1);
    var dmg = rollN(3, 12); var dT = sum(dmg); var bon = rollN(1, 6); var bT = sum(bon); var ft = dT + bT;
    var hit = roll1(6); var ok = hit <= 3; var sub = "";
    if (ok) { sub = "✨ ПОПАДАНИЕ! Магия: " + ft + "\n🔮 Магия игнорирует броню!\n🔥 −1 WILL"; aL({ id: Date.now(), time: now(), who: c.name || "???", type: "magic", label: "Заклинание ПОПАД.", detail: "3d12[" + dmg.join(",") + "]+1d6[" + bon[0] + "] −1WILL", total: ft, note: note }); }
    else { var cat = roll1(2); sub = (cat === 1 ? "💥 ОБРАТНЫЙ УДАР! " : "🔥 ДРУЖЕСТВ. ОГОНЬ! ") + ft + "\n🔥 −1 WILL"; aL({ id: Date.now(), time: now(), who: c.name || "???", type: "magic_fail", label: cat === 1 ? "ОБРАТНЫЙ УДАР" : "ДРУЖЕСТВ. ОГОНЬ", detail: "−1WILL", total: ft, note: note }); }
    oR({ label: "🔮 Заклинание", d10: hit, parts: [{ label: "3d12", value: dT }, { label: "1d6", value: bT }], total: ft, subtext: sub });
  }
  function rollHit(w) {
    var d = roll1(10); var sk = WS[w.type] || "Simple Weapon"; var rv = fs.REF || 0; var sv = es[sk] || 0; var t = d + rv + sv + w.bonus;
    aL({ id: Date.now(), time: now(), who: c.name || "???", type: "hit", label: w.name + " Попад.", detail: "d10(" + d + ")+REF(" + rv + ")+" + sk + "(" + sv + ")+" + w.bonus, total: t, note: note });
    oR({ label: w.name + " Попадание", d10: d, parts: [{ label: "REF", value: rv }, { label: sk, value: sv }, { label: "Бнс", value: w.bonus }], total: t });
  }
  function rollDmg(w) {
    var m = w.dmgDice.match(/(\d+)d(\d+)/); if (!m) return;
    var dice = rollN(parseInt(m[1]), parseInt(m[2])); var t = sum(dice) + w.bonus;
    aL({ id: Date.now(), time: now(), who: c.name || "???", type: "dmg", label: w.name + " Урон(" + w.dmgType + ")", detail: w.dmgDice + "[" + dice.join(",") + "]+" + w.bonus, total: t, note: note });
    oR({ label: w.name + " Урон", d10: dice[0], parts: [{ label: w.dmgDice, value: sum(dice) }, { label: "Бнс", value: w.bonus }], total: t, subtext: "Тип: " + w.dmgType });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* HP */}
      <div style={{ background: "#fef2f2", border: "2px solid #ef444418", borderRadius: 9, padding: "7px 9px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 11 }}>❤️ HP</span>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <input type="number" value={curHp} onChange={function(e) { sHp(parseInt(e.target.value) || 0); }} style={Object.assign({}, S.inp, { width: 36, textAlign: "center", padding: "1px", fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 13, color: "#ef4444" })} />
            <span style={{ color: "#8b7e6a" }}>/</span>
            <input type="number" value={mx} onChange={function(e) { sMHp(parseInt(e.target.value) || 1); }} style={Object.assign({}, S.inp, { width: 36, textAlign: "center", padding: "1px", fontFamily: "'Cinzel',serif", fontWeight: 700 })} />
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 4, height: 10, overflow: "hidden" }}><div style={{ height: "100%", width: hpP + "%", background: "#ef4444", borderRadius: 4, transition: "width 0.3s" }} /></div>
        <div style={{ display: "flex", gap: 2, justifyContent: "center", marginTop: 4 }}>
          {[-10, -5, -1, 1, 5, 10].map(function(d) { return <button key={d} onClick={function() { sHp(curHp + d); }} style={Object.assign({}, S.ab, { background: d < 0 ? "#ef444412" : "#ef444420", color: "#ef4444", border: "1px solid #ef444418" })}>{d > 0 ? "+" + d : d}</button>; })}
        </div>
      </div>

      {/* WILL + Rest */}
      <div style={{ display: "flex", gap: 4 }}>
        <div style={{ flex: 1, background: "#f5f3ff", border: "2px solid #8b5cf618", borderRadius: 9, padding: "5px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 11 }}>🔥 WILL</span>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button onClick={function() { sWi(curW - 1); }} style={S.sm}>−</button>
            <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 13, color: "#8b5cf6" }}>{curW + "/" + mxW}</span>
            <button onClick={function() { sWi(curW + 1); }} style={S.sm}>+</button>
          </div>
        </div>
        <button onClick={longRest} style={{ padding: "5px 10px", borderRadius: 9, border: "2px solid #10b98120", background: "#ecfdf5", fontWeight: 700, fontSize: 10, color: "#065f46", cursor: "pointer" }}>💤 Отдых</button>
      </div>

      {/* Armor slots */}
      <div style={{ background: "#f8fafc", border: "2px solid #64748b18", borderRadius: 9, padding: "7px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <label style={S.lb}>🛡️ Броня</label>
          <button onClick={function() { sSAA(!saa); }} style={{ fontSize: 8, background: "none", border: "none", cursor: "pointer", color: "#10b981", fontWeight: 700 }}>{saa ? "✕" : "+ Добавить"}</button>
        </div>
        {saa && <div style={{ background: "#f0f0ea", borderRadius: 7, padding: 6, marginBottom: 5, display: "flex", flexDirection: "column", gap: 3 }}>
          <input style={S.inp} value={an} onChange={function(e) { sAN(e.target.value); }} placeholder="Название брони" />
          <div style={{ display: "flex", gap: 3 }}>
            <div style={{ flex: 1 }}><label style={Object.assign({}, S.lb, { fontSize: 7 })}>Тип</label><select value={at} onChange={function(e) { sAT(e.target.value); }} style={Object.assign({}, S.inp, { fontSize: 9, padding: 3, cursor: "pointer" })}>{ARMOR_T.filter(function(a) { return a.id !== "none"; }).map(function(a) { return <option key={a.id} value={a.id}>{a.name + " (Body≥" + a.bodyReq + ")"}</option>; })}</select></div>
            <div style={{ width: 45 }}><label style={Object.assign({}, S.lb, { fontSize: 7 })}>HP</label><input style={Object.assign({}, S.inp, { fontSize: 9, padding: 3 })} type="number" value={ah} onChange={function(e) { sAH(parseInt(e.target.value) || 1); }} /></div>
          </div>
          <button onClick={addArmor} style={{ padding: 5, borderRadius: 5, border: "none", background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 10, cursor: "pointer" }}>Добавить</button>
        </div>}

        {/* Equipped display */}
        {["head", "body"].map(function(slot) {
          var eq = slot === "head" ? eqHead : eqBody;
          var atDef = eq ? ARMOR_T.find(function(a) { return a.id === eq.type; }) || ARMOR_T[0] : null;
          var pct = eq && eq.maxHp > 0 ? (eq.hp / eq.maxHp) * 100 : 0;
          return <div key={slot} style={{ marginTop: 4, padding: "4px 6px", background: eq ? "#f0fdf4" : "#fefdfb", border: "1px solid " + (eq ? "#10b98120" : "#e8e0d4"), borderRadius: 6 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#64748b" }}>{slot === "head" ? "🧠 Голова" : "🫀 Тело"}</div>
            {eq ? <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 700 }}>{eq.name} <span style={{ fontSize: 8, color: "#64748b" }}>{atDef ? atDef.name : ""}</span></span>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <button onClick={function() { sC(function(p) { return Object.assign({}, p, { armors: p.armors.map(function(a) { return a.id === eq.id ? Object.assign({}, a, { hp: Math.max(0, a.hp - 1) }) : a; }) }); }); }} style={Object.assign({}, S.sm, { width: 16, height: 16, fontSize: 8 })}>−</button>
                  <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 11, color: eq.hp <= 0 ? "#ef4444" : eq.hp <= eq.maxHp / 2 ? "#f59e0b" : "#10b981" }}>{eq.hp + "/" + eq.maxHp}</span>
                  <button onClick={function() { sC(function(p) { return Object.assign({}, p, { armors: p.armors.map(function(a) { return a.id === eq.id ? Object.assign({}, a, { hp: Math.min(a.maxHp, a.hp + 1) }) : a; }) }); }); }} style={Object.assign({}, S.sm, { width: 16, height: 16, fontSize: 8 })}>+</button>
                  <button onClick={function() { unequip(slot); }} style={{ fontSize: 8, background: "#fee2e2", border: "1px solid #ef444420", borderRadius: 4, padding: "1px 5px", cursor: "pointer", color: "#ef4444", fontWeight: 700 }}>Снять</button>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 3, height: 6, overflow: "hidden", marginTop: 2 }}><div style={{ height: "100%", width: pct + "%", background: eq.hp <= 0 ? "#ef4444" : eq.hp <= eq.maxHp / 2 ? "#f59e0b" : "#10b981", borderRadius: 3 }} /></div>
              {atDef && atDef.desc && <div style={{ fontSize: 7, color: "#64748b", marginTop: 1 }}>{atDef.desc}</div>}
            </div> : <div style={{ fontSize: 9, color: "#8b7e6a", fontStyle: "italic" }}>Пусто</div>}
          </div>;
        })}

        {/* Armor inventory */}
        {c.armors.length > 0 && <div style={{ marginTop: 5 }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>Инвентарь брони:</div>
          {c.armors.map(function(a) {
            var isEq = a.id === c.equippedHead || a.id === c.equippedBody;
            var atD = ARMOR_T.find(function(x) { return x.id === a.type; }) || ARMOR_T[0];
            return <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 4px", borderRadius: 4, background: isEq ? "#dbeafe" : "#fefdfb", marginBottom: 2, fontSize: 9 }}>
              <span style={{ flex: 1, fontWeight: isEq ? 700 : 400 }}>{a.name} <span style={{ fontSize: 7, color: "#64748b" }}>{atD.name} {a.hp + "/" + a.maxHp}</span>{isEq && <span style={{ fontSize: 7, color: "#3b82f6" }}> ЭКИП</span>}</span>
              {!isEq && <button onClick={function() { equipArmor(a, "head"); }} style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, border: "1px solid #3b82f620", background: "#eff6ff", cursor: "pointer", color: "#1d4ed8" }}>Голова</button>}
              {!isEq && <button onClick={function() { equipArmor(a, "body"); }} style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, border: "1px solid #3b82f620", background: "#eff6ff", cursor: "pointer", color: "#1d4ed8" }}>Тело</button>}
              <button onClick={function() { sC(function(p) { return Object.assign({}, p, { armors: p.armors.filter(function(x) { return x.id !== a.id; }), equippedHead: p.equippedHead === a.id ? null : p.equippedHead, equippedBody: p.equippedBody === a.id ? null : p.equippedBody }); }); }} style={{ fontSize: 8, background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>✕</button>
            </div>;
          })}
        </div>}
      </div>

      <input style={S.inp} value={note} onChange={function(e) { sN(e.target.value); }} placeholder="📝 Заметка..." />

      <div style={{ display: "flex", gap: 3 }}>
        <button onClick={rollZone} style={{ flex: 1, padding: 7, borderRadius: 7, border: "2px solid #f59e0b28", background: "#fffbeb", cursor: "pointer", fontWeight: 700, fontSize: 10, color: "#92400e" }}>🎯 Зона</button>
        <button onClick={rollDodge} style={{ flex: 1, padding: 7, borderRadius: 7, border: "2px solid #10b98128", background: "#ecfdf5", cursor: "pointer", fontWeight: 700, fontSize: 10, color: "#065f46" }}>🛡️ Уклонение</button>
      </div>
      {pf.id === "sensitive" && <button onClick={castSpell} style={{ padding: 7, borderRadius: 7, border: "2px solid #7c3aed20", background: "#fdf4ff", cursor: "pointer", fontWeight: 700, fontSize: 10, color: "#7c3aed" }}>{"🔮 Заклинание (−1 WILL) " + (curW <= 0 ? "⛔" : "")}</button>}
      {rc.id === "dragonborn" && <button onClick={function() { var d = roll1(8); aL({ id: Date.now(), time: now(), who: c.name || "???", type: "ability", label: "Breath 1d8", detail: "", total: d, note: note }); oR({ label: "🐉 Breath", d10: d, parts: [], total: d }); }} style={{ padding: 7, borderRadius: 7, border: "2px solid #f9731620", background: "#fff7ed", cursor: "pointer", fontWeight: 700, fontSize: 10, color: "#c2410c" }}>🐉 Breath 1d8</button>}

      {/* Weapons */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><label style={S.lb}>⚔️ Оружие</label><button onClick={function() { sSA(!sa); }} style={{ fontSize: 8, background: "none", border: "none", cursor: "pointer", color: "#10b981", fontWeight: 700 }}>{sa ? "✕" : "+ Добавить"}</button></div>
        {sa && <div style={{ background: "#f8f6f0", border: "1px solid #e8e0d4", borderRadius: 8, padding: 6, marginBottom: 4, display: "flex", flexDirection: "column", gap: 3 }}>
          <input style={S.inp} value={wn} onChange={function(e) { sWN(e.target.value); }} placeholder="Название" />
          <div style={{ display: "flex", gap: 3 }}>
            <div style={{ flex: 1 }}><select value={wt} onChange={function(e) { sWT(e.target.value); }} style={Object.assign({}, S.inp, { fontSize: 9, padding: 3, cursor: "pointer" })}>{WT.map(function(t) { return <option key={t} value={t}>{t}</option>; })}</select></div>
            <div style={{ width: 38 }}><input style={Object.assign({}, S.inp, { fontSize: 9, padding: 3 })} type="number" min={1} value={wr} onChange={function(e) { sWR(parseInt(e.target.value) || 1); }} placeholder="RoF" /></div>
            <div style={{ width: 38 }}><select value={wdt} onChange={function(e) { sWDT(e.target.value); }} style={Object.assign({}, S.inp, { fontSize: 9, padding: 3, cursor: "pointer" })}>{DT.map(function(t) { return <option key={t} value={t}>{t}</option>; })}</select></div>
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            <input style={Object.assign({}, S.inp, { flex: 1, fontSize: 9, padding: 3 })} value={wdi} onChange={function(e) { sWDI(e.target.value); }} placeholder="1d6" />
            <input style={Object.assign({}, S.inp, { width: 40, fontSize: 9, padding: 3 })} type="number" value={wb} onChange={function(e) { sWB(parseInt(e.target.value) || 0); }} placeholder="Бнс" />
          </div>
          <button onClick={function() { if (!wn.trim()) return; sC(function(p) { return Object.assign({}, p, { weapons: p.weapons.concat([{ id: Date.now(), name: wn.trim(), type: wt, rof: wr, dmgType: wdt, bonus: wb, dmgDice: wdi }]) }); }); sWN(""); sSA(false); }} style={{ padding: 5, borderRadius: 5, border: "none", background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 10, cursor: "pointer" }}>Добавить</button>
        </div>}
        {c.weapons.map(function(w) { var sk = WS[w.type] || "Simple Weapon"; return (
          <div key={w.id} style={{ background: "#fefdfb", border: "1px solid #e8e0d4", borderRadius: 8, padding: "5px 7px", marginBottom: 3 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 11 }}>{w.name}<span style={{ fontSize: 7, color: "#8b7e6a", marginLeft: 3 }}>{w.type + " " + w.dmgDice + " " + w.dmgType + " RoF:" + w.rof}</span></span>
              <button onClick={function() { sC(function(p) { return Object.assign({}, p, { weapons: p.weapons.filter(function(x) { return x.id !== w.id; }) }); }); }} style={{ background: "none", border: "none", color: "#ef4444", fontSize: 10, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <button onClick={function() { rollHit(w); }} style={{ flex: 1, padding: 4, borderRadius: 5, border: "1px solid #3b82f620", background: "#eff6ff", cursor: "pointer", fontWeight: 700, fontSize: 9, color: "#1d4ed8", textAlign: "center" }}>🎯 Попад.</button>
              <button onClick={function() { rollDmg(w); }} style={{ flex: 1, padding: 4, borderRadius: 5, border: "1px solid #ef444420", background: "#fef2f2", cursor: "pointer", fontWeight: 700, fontSize: 9, color: "#dc2626", textAlign: "center" }}>💥 Урон</button>
            </div>
          </div>
        ); })}
      </div>

      {/* Log */}
      <div>
        <label style={S.lb}>📜 Лог</label>
        <div style={{ maxHeight: 150, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {logs.length === 0 && <div style={{ textAlign: "center", padding: 8, color: "#8b7e6a", fontStyle: "italic", fontSize: 9 }}>Пусто</div>}
          {logs.map(function(l, i) { return <div key={l.id} style={{ background: l.type === "magic_fail" ? "#fee2e2" : l.type === "magic" ? "#fdf4ff" : l.type === "rest" ? "#ecfdf5" : l.type === "zone" ? "#fffbeb" : "#fefdfb", border: "1px solid #e8e0d420", borderRadius: 4, padding: "3px 5px", animation: i === 0 ? "slideIn 0.3s" : "none", fontSize: 8 }}>
            <div style={{ fontWeight: 700 }}>{l.who + ": " + l.label}</div>
            {l.detail && <div style={{ fontSize: 7, color: "#6b7280" }}>{l.detail}</div>}
            {l.total > 0 && <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12 }}>{"= " + l.total}</div>}
            {l.note && <div style={{ fontSize: 7, color: "#6b7280", fontStyle: "italic" }}>{"📝 " + l.note}</div>}
          </div>; })}
        </div>
      </div>
    </div>
  );
}

/* ── Inventory Tab ── */
function InvTab(pr) {
  var c = pr.char; var sC = pr.setChar;
  var _a = useState(""); var ni = _a[0]; var sNI = _a[1];
  var _b = useState(1); var nq = _b[0]; var sNQ = _b[1];
  function add() { if (!ni.trim()) return; sC(function(p) { return Object.assign({}, p, { inventory: p.inventory.concat([{ id: Date.now(), name: ni.trim(), qty: nq, equipped: false }]) }); }); sNI(""); sNQ(1); }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", gap: 3 }}>
        <input style={Object.assign({}, S.inp, { flex: 2, minWidth: 80 })} value={ni} onChange={function(e) { sNI(e.target.value); }} placeholder="Предмет..." onKeyDown={function(e) { if (e.key === "Enter") add(); }} />
        <input style={Object.assign({}, S.inp, { width: 32, textAlign: "center" })} type="number" min={1} value={nq} onChange={function(e) { sNQ(parseInt(e.target.value) || 1); }} />
        <button onClick={add} style={Object.assign({}, S.ab, { background: "#10b981", color: "#fff", fontWeight: 700, border: "none" })}>+</button>
      </div>
      <div style={{ background: "#fef3c7", borderRadius: 8, padding: "5px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 10 }}>💰 Золото</span>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {[-10, -1].map(function(d) { return <button key={d} onClick={function() { sC(function(p) { return Object.assign({}, p, { gold: Math.max(0, p.gold + d) }); }); }} style={S.sm}>{d}</button>; })}
          <span style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 700, color: "#d97706", minWidth: 24, textAlign: "center" }}>{c.gold}</span>
          {[1, 10].map(function(d) { return <button key={d} onClick={function() { sC(function(p) { return Object.assign({}, p, { gold: p.gold + d }); }); }} style={S.sm}>{"+" + d}</button>; })}
        </div>
      </div>
      {c.inventory.length === 0 && <div style={{ textAlign: "center", padding: 12, color: "#8b7e6a", fontStyle: "italic", fontSize: 9 }}>🎒 Пусто</div>}
      {c.inventory.map(function(it) { return <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 3, background: it.equipped ? "#dbeafe" : "#fefdfb", border: "1px solid " + (it.equipped ? "#3b82f640" : "#e8e0d4"), borderRadius: 5, padding: "3px 6px" }}>
        <button onClick={function() { sC(function(p) { return Object.assign({}, p, { inventory: p.inventory.map(function(i) { return i.id === it.id ? Object.assign({}, i, { equipped: !i.equipped }) : i; }) }); }); }} style={{ background: "none", border: "none", fontSize: 11, cursor: "pointer" }}>{it.equipped ? "🛡️" : "📦"}</button>
        <span style={{ flex: 1, fontSize: 9, fontWeight: it.equipped ? 700 : 400 }}>{it.name}</span>
        <button onClick={function() { sC(function(p) { return Object.assign({}, p, { inventory: p.inventory.map(function(i) { return i.id === it.id ? Object.assign({}, i, { qty: Math.max(0, i.qty - 1) }) : i; }).filter(function(i) { return i.qty > 0; }) }); }); }} style={Object.assign({}, S.sm, { width: 16, height: 16, fontSize: 7 })}>−</button>
        <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 9 }}>{it.qty}</span>
        <button onClick={function() { sC(function(p) { return Object.assign({}, p, { inventory: p.inventory.map(function(i) { return i.id === it.id ? Object.assign({}, i, { qty: i.qty + 1 }) : i; }) }); }); }} style={Object.assign({}, S.sm, { width: 16, height: 16, fontSize: 7 })}>+</button>
        <button onClick={function() { sC(function(p) { return Object.assign({}, p, { inventory: p.inventory.filter(function(i) { return i.id !== it.id; }) }); }); }} style={{ background: "none", border: "none", color: "#ef4444", fontSize: 9, cursor: "pointer" }}>✕</button>
      </div>; })}
    </div>
  );
}

/* ── MapView — interactive map with draggable tokens ── */
function MapView(pr) {
  var mapData = pr.mapData || {};
  var setMapData = pr.setMapData;
  var characters = pr.characters || [];
  var isGM = pr.isGM;
  var charId = pr.charId;
  var imgSrc = mapData.image || "";
  var tokens = mapData.tokens || [];
  var _drag = useState(null); var dragId = _drag[0]; var setDragId = _drag[1];
  var _off = useState({ x: 0, y: 0 }); var dragOff = _off[0]; var setDragOff = _off[1];
  var _sa = useState(false); var showAddNpc = _sa[0]; var setShowAddNpc = _sa[1];
  var _nn = useState(""); var npcName = _nn[0]; var setNpcName = _nn[1];
  var _nc = useState("#ef4444"); var npcColor = _nc[0]; var setNpcColor = _nc[1];
  var _ns = useState(14); var npcSize = _ns[0]; var setNpcSize = _ns[1];
  var containerRef = { current: null };

  // Build player tokens from characters if not in tokens yet
  var allTokens = tokens.slice();
  characters.forEach(function(c) {
    var exists = allTokens.find(function(t) { return t.charId === c.id; });
    if (!exists) {
      allTokens.push({ id: "char-" + c.id, charId: c.id, name: c.name || "?", x: 10 + Math.random() * 30, y: 10 + Math.random() * 30, color: "#3b82f6", size: 14, type: "player" });
    }
  });

  function save(newTokens) {
    setMapData(Object.assign({}, mapData, { tokens: newTokens }));
  }

  function handleImgUpload(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      setMapData(Object.assign({}, mapData, { image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  }

  function canDrag(tok) {
    if (isGM) return true;
    if (tok.charId && tok.charId === charId) return true;
    return false;
  }

  function startDrag(e, tok) {
    if (!canDrag(tok)) return;
    e.preventDefault();
    var rect = e.currentTarget.parentElement.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    var px = ((clientX - rect.left) / rect.width) * 100;
    var py = ((clientY - rect.top) / rect.height) * 100;
    setDragId(tok.id);
    setDragOff({ x: px - tok.x, y: py - tok.y });
  }

  function onMove(e) {
    if (!dragId) return;
    e.preventDefault();
    var rect = e.currentTarget.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    var px = ((clientX - rect.left) / rect.width) * 100;
    var py = ((clientY - rect.top) / rect.height) * 100;
    var nx = Math.max(0, Math.min(100, px - dragOff.x));
    var ny = Math.max(0, Math.min(100, py - dragOff.y));
    var updated = allTokens.map(function(t) { return t.id === dragId ? Object.assign({}, t, { x: nx, y: ny }) : t; });
    save(updated);
  }

  function endDrag() { setDragId(null); }

  function addNpc() {
    if (!npcName.trim()) return;
    var nt = { id: "npc-" + Date.now(), name: npcName.trim(), x: 50, y: 50, color: npcColor, size: npcSize, type: "npc" };
    save(allTokens.concat([nt]));
    setNpcName(""); setShowAddNpc(false);
  }

  function delToken(id) { save(allTokens.filter(function(t) { return t.id !== id; })); }

  function resizeToken(id, delta) {
    save(allTokens.map(function(t) { return t.id === id ? Object.assign({}, t, { size: Math.max(6, Math.min(40, (t.size || 14) + delta)) }) : t; }));
  }

  if (!imgSrc) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "30px 10px" }}>
        <div style={{ fontSize: 40 }}>🗺️</div>
        <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 14, color: "#2d2a24" }}>Карта Аэтернии</div>
        {isGM ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#8b7e6a", marginBottom: 8 }}>Загрузи изображение карты</div>
            <label style={{ display: "inline-block", padding: "10px 20px", borderRadius: 8, border: "2px dashed #10b981", background: "#ecfdf5", fontWeight: 700, fontSize: 12, color: "#065f46", cursor: "pointer" }}>
              📁 Выбрать изображение
              <input type="file" accept="image/*" onChange={handleImgUpload} style={{ display: "none" }} />
            </label>
          </div>
        ) : (
          <div style={{ fontSize: 10, color: "#8b7e6a" }}>Мастер ещё не загрузил карту</div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 13, textAlign: "center" }}>🗺️ Карта Аэтернии</div>

      {/* Map container */}
      <div
        style={{ position: "relative", width: "100%", borderRadius: 10, overflow: "hidden", border: "2px solid #e8e0d4", touchAction: "none", userSelect: "none" }}
        onMouseMove={onMove} onMouseUp={endDrag} onMouseLeave={endDrag}
        onTouchMove={onMove} onTouchEnd={endDrag}
      >
        <img src={imgSrc} style={{ width: "100%", display: "block", pointerEvents: "none" }} alt="map" />
        {/* Tokens */}
        {allTokens.map(function(tok) {
          var sz = tok.size || 14;
          var canD = canDrag(tok);
          return (
            <div key={tok.id}
              onMouseDown={function(e) { startDrag(e, tok); }}
              onTouchStart={function(e) { startDrag(e, tok); }}
              style={{
                position: "absolute", left: tok.x + "%", top: tok.y + "%",
                width: sz, height: sz, borderRadius: "50%",
                background: tok.color || "#3b82f6",
                border: "2px solid #fff",
                boxShadow: dragId === tok.id ? "0 0 8px rgba(0,0,0,0.5)" : "0 1px 3px rgba(0,0,0,0.3)",
                transform: "translate(-50%,-50%)",
                cursor: canD ? "grab" : "default",
                zIndex: dragId === tok.id ? 50 : tok.type === "player" ? 10 : 5,
                transition: dragId === tok.id ? "none" : "left 0.1s, top 0.1s"
              }}
              title={tok.name}
            />
          );
        })}
      </div>

      {/* Token legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {allTokens.map(function(tok) {
          var sz = tok.size || 14;
          return (
            <div key={tok.id} style={{ display: "flex", alignItems: "center", gap: 3, background: "#fefdfb", border: "1px solid #e8e0d4", borderRadius: 5, padding: "2px 5px", fontSize: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: tok.color || "#3b82f6", flexShrink: 0 }} />
              <span style={{ fontWeight: 600 }}>{tok.name}</span>
              {(isGM || (tok.charId && tok.charId === charId)) && (
                <span style={{ display: "flex", gap: 1 }}>
                  <button onClick={function() { resizeToken(tok.id, -2); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 8, padding: 0, color: "#8b7e6a" }}>−</button>
                  <span style={{ color: "#aaa", fontSize: 7 }}>{sz}</span>
                  <button onClick={function() { resizeToken(tok.id, 2); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 8, padding: 0, color: "#8b7e6a" }}>+</button>
                </span>
              )}
              {isGM && tok.type === "npc" && <button onClick={function() { delToken(tok.id); }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 8, padding: 0 }}>✕</button>}
            </div>
          );
        })}
      </div>

      {/* GM: add NPC tokens + change image */}
      {isGM && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", gap: 3 }}>
            <button onClick={function() { setShowAddNpc(!showAddNpc); }} style={{ flex: 1, padding: 6, borderRadius: 6, border: "2px solid #ef444420", background: "#fef2f2", fontWeight: 700, fontSize: 9, color: "#ef4444", cursor: "pointer" }}>{showAddNpc ? "✕ Отмена" : "👹 + NPC точка"}</button>
            <label style={{ padding: "6px 10px", borderRadius: 6, border: "2px solid #10b98120", background: "#ecfdf5", fontWeight: 700, fontSize: 9, color: "#065f46", cursor: "pointer", textAlign: "center" }}>
              🖼️ Сменить карту
              <input type="file" accept="image/*" onChange={handleImgUpload} style={{ display: "none" }} />
            </label>
          </div>
          {showAddNpc && (
            <div style={{ background: "#fef2f2", border: "1px solid #ef444420", borderRadius: 7, padding: 6, display: "flex", flexDirection: "column", gap: 3 }}>
              <input style={S.inp} value={npcName} onChange={function(e) { setNpcName(e.target.value); }} placeholder="Имя NPC / группы" />
              <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <label style={Object.assign({}, S.lb, { fontSize: 7 })}>Цвет</label>
                  <div style={{ display: "flex", gap: 2 }}>
                    {["#ef4444", "#f59e0b", "#8b5cf6", "#1f2937", "#10b981", "#ec4899"].map(function(c) {
                      return <button key={c} onClick={function() { setNpcColor(c); }} style={{ width: 18, height: 18, borderRadius: "50%", background: c, border: npcColor === c ? "3px solid #fff" : "2px solid #ddd", boxShadow: npcColor === c ? "0 0 0 2px " + c : "none", cursor: "pointer" }} />;
                    })}
                  </div>
                </div>
                <div style={{ width: 50 }}>
                  <label style={Object.assign({}, S.lb, { fontSize: 7 })}>Размер</label>
                  <input style={Object.assign({}, S.inp, { fontSize: 9, padding: 3 })} type="number" min={6} max={40} value={npcSize} onChange={function(e) { setNpcSize(parseInt(e.target.value) || 14); }} />
                </div>
              </div>
              <button onClick={addNpc} style={{ padding: 5, borderRadius: 5, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, fontSize: 9, cursor: "pointer" }}>Добавить NPC</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Library Tab (read-only for players) ── */
function LibTab(pr) {
  var lore = pr.loreData || {};
  var _s = useState(null); var openId = _s[0]; var setOpenId = _s[1];
  var ch = openId ? LORE_CHAPTERS.find(function(x) { return x.id === openId; }) : null;

  if (ch && ch.id === "map") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={function() { setOpenId(null); }} style={{ alignSelf: "flex-start", padding: "4px 10px", borderRadius: 6, border: "2px solid #e8e0d4", background: "#fefdfb", fontWeight: 700, fontSize: 10, cursor: "pointer", color: "#5c5548" }}>← Назад</button>
        <MapView mapData={pr.mapData || {}} setMapData={pr.setMapData || function(){}} characters={pr.characters || []} isGM={pr.isGM || false} charId={pr.charId} />
      </div>
    );
  }

  if (ch) {
    var content = lore[ch.id] || "";
    var hasContent = content.trim().length > 0;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={function() { setOpenId(null); }} style={{ alignSelf: "flex-start", padding: "4px 10px", borderRadius: 6, border: "2px solid #e8e0d4", background: "#fefdfb", fontWeight: 700, fontSize: 10, cursor: "pointer", color: "#5c5548" }}>← Назад</button>
        <div style={{ textAlign: "center", padding: "12px 8px 4px" }}>
          <div style={{ fontSize: 32 }}>{ch.icon}</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 16, color: ch.color, marginTop: 4 }}>{ch.title}</div>
        </div>
        {hasContent ? (
          <div style={{ background: "#fff", border: "2px solid #e8e0d4", borderRadius: 10, padding: "14px 12px" }}>
            {content.split("\n").map(function(line, i) {
              if (line.startsWith("### ")) return <div key={i} style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 13, color: "#2d2a24", marginTop: i > 0 ? 10 : 0, marginBottom: 3 }}>{line.slice(4)}</div>;
              if (line.startsWith("## ")) return <div key={i} style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 15, color: ch.color, marginTop: i > 0 ? 12 : 0, marginBottom: 4 }}>{line.slice(3)}</div>;
              if (line.startsWith("# ")) return <div key={i} style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 17, color: "#2d2a24", marginTop: i > 0 ? 14 : 0, marginBottom: 5 }}>{line.slice(2)}</div>;
              if (line.startsWith("---")) return <hr key={i} style={{ border: "none", borderTop: "1px solid #e8e0d4", margin: "8px 0" }} />;
              if (line.startsWith("- ")) return <div key={i} style={{ fontSize: 10, color: "#2d2a24", paddingLeft: 12, position: "relative", marginBottom: 2 }}><span style={{ position: "absolute", left: 2 }}>•</span>{line.slice(2)}</div>;
              if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
              return <div key={i} style={{ fontSize: 10, color: "#2d2a24", lineHeight: 1.6, marginBottom: 2 }}>{line}</div>;
            })}
          </div>
        ) : (
          <div style={{ background: "#fff", border: "2px solid #e8e0d4", borderRadius: 10, padding: "20px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>📜</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12, color: "#5c5548" }}>Содержание готовится</div>
            <div style={{ fontSize: 9, color: "#8b7e6a", marginTop: 3 }}>Мастер ещё не добавил материал...</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 16, color: "#2d2a24" }}>📚 Лорбук Аэтернии</div>
        <div style={{ fontSize: 9, color: "#8b7e6a" }}>Знания о мире</div>
      </div>
      {LORE_CHAPTERS.map(function(ch) {
        var hasContent = lore[ch.id] && lore[ch.id].trim().length > 0;
        return (
          <button key={ch.id} onClick={function() { setOpenId(ch.id); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 9, border: "2px solid " + ch.color + "18", background: "linear-gradient(135deg," + ch.color + "06," + ch.color + "02)", cursor: "pointer", textAlign: "left", fontFamily: "'Nunito',sans-serif", opacity: hasContent ? 1 : 0.6 }}>
            <div style={{ width: 34, height: 34, borderRadius: 7, background: ch.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{ch.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 11, color: "#2d2a24" }}>{ch.title}</div>
              {!hasContent && <div style={{ fontSize: 8, color: "#8b7e6a", fontStyle: "italic" }}>Ожидает наполнения</div>}
            </div>
            <span style={{ fontSize: 11, color: "#c4b8a4" }}>›</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Lore Editor (GM Panel) ── */
function LoreEditor(pr) {
  var lore = pr.loreData || {};
  var setLore = pr.setLoreData;
  var _s = useState(null); var editId = _s[0]; var setEditId = _s[1];
  var ch = editId ? LORE_CHAPTERS.find(function(x) { return x.id === editId; }) : null;

  if (ch && ch.id === "map") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={function() { setEditId(null); }} style={{ alignSelf: "flex-start", padding: "4px 10px", borderRadius: 6, border: "2px solid #e8e0d4", background: "#fefdfb", fontWeight: 700, fontSize: 10, cursor: "pointer", color: "#5c5548" }}>← Назад к списку</button>
        <MapView mapData={pr.mapData || {}} setMapData={pr.setMapData || function(){}} characters={pr.characters || []} isGM={true} />
      </div>
    );
  }

  if (ch) {
    var content = lore[ch.id] || "";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={function() { setEditId(null); }} style={{ alignSelf: "flex-start", padding: "4px 10px", borderRadius: 6, border: "2px solid #e8e0d4", background: "#fefdfb", fontWeight: 700, fontSize: 10, cursor: "pointer", color: "#5c5548" }}>← Назад к списку</button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 22 }}>{ch.icon}</span>
          <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 14, color: ch.color }}>{ch.title}</div>
        </div>
        <div style={{ background: "#f5f3ff", border: "1px solid #8b5cf620", borderRadius: 7, padding: "4px 7px", fontSize: 8, color: "#6b7280" }}>
          Форматирование: # Заголовок | ## Подзаголовок | ### Секция | --- Линия | - Список
        </div>
        <textarea
          style={Object.assign({}, S.inp, { minHeight: 300, resize: "vertical", fontSize: 10, padding: 8, lineHeight: 1.5 })}
          value={content}
          onChange={function(e) { var n = Object.assign({}, lore); n[ch.id] = e.target.value; setLore(n); }}
          placeholder={"Начни писать «" + ch.title + "»...\n\n# Заголовок\n\nТекст...\n\n## Подзаголовок\n\n- Пункт 1\n- Пункт 2"}
        />
        <div style={{ fontSize: 8, color: "#8b7e6a" }}>{"Символов: " + content.length}</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ textAlign: "center", padding: "6px 0" }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 15, color: "#7c3aed" }}>📚 Редактор Лорбука</div>
        <div style={{ fontSize: 9, color: "#8b7e6a" }}>Нажми на главу чтобы писать</div>
      </div>
      {LORE_CHAPTERS.map(function(ch) {
        var len = (lore[ch.id] || "").length;
        return (
          <button key={ch.id} onClick={function() { setEditId(ch.id); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: 8, border: "2px solid " + ch.color + "18", background: len > 0 ? ch.color + "08" : "#fefdfb", cursor: "pointer", textAlign: "left", fontFamily: "'Nunito',sans-serif" }}>
            <div style={{ width: 28, height: 28, borderRadius: 5, background: ch.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{ch.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 10 }}>{ch.title}</div>
              <div style={{ fontSize: 7, color: len > 0 ? "#10b981" : "#8b7e6a" }}>{len > 0 ? "✓ " + len + " симв." : "Пусто"}</div>
            </div>
            <span style={{ fontSize: 10, color: "#7c3aed" }}>✏️</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── GameView ── */
function GameView(pr) {
  var c = pr.char; var sC = pr.setChar;
  var _t = useState("character"); var tab = _t[0]; var sT = _t[1];
  var _r = useState(null); var rP = _r[0]; var sRP = _r[1];
  var _l = useState([]); var logs = _l[0]; var sL = _l[1];
  function aL(e) { sL(function(p) { return [e].concat(p.slice(0, 50)); }); }
  var inf = cF(c); var pf = PROFS.find(function(p) { return p.id === c.profId; }) || PROFS[0];
  var tabs = [{ id: "character", l: "Персонаж", ic: <IconChar /> }, { id: "combat", l: "Бой", ic: <IconBattle /> }, { id: "inventory", l: "Инвентарь", ic: <IconInv /> }, { id: "library", l: "Лор", ic: <IconLib /> }];
  return (
    <div style={S.wr}>
      <style>{CSS}</style>
      <RollPopup roll={rP} onClose={function() { sRP(null); }} />
      <div style={{ display: "flex", alignItems: "center", padding: "7px 9px 3px", borderBottom: "2px solid #e8e0d4", background: "#fefcf5", gap: 6 }}>
        <button onClick={pr.onBack} style={{ background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "#8b7e6a" }}>←</button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 13, fontFamily: "'Cinzel',serif", fontWeight: 900 }}>{c.name || "Герой"}{pr.isGM && <span style={{ fontSize: 8, color: "#7c3aed", marginLeft: 3 }}>ГМ</span>}</div>
          <div style={{ fontSize: 8, color: "#8b7e6a" }}>{inf.race.name} · {pf.name} · Ур.{c.level}</div>
        </div>
      </div>
      <div style={S.tb}>{tabs.map(function(t) { return <button key={t.id} onClick={function() { sT(t.id); }} style={Object.assign({}, S.ta, { background: tab === t.id ? "#f5e6c8" : "transparent", color: tab === t.id ? "#5c4a2a" : "#8b7e6a", fontWeight: tab === t.id ? 700 : 500 })}>{t.ic}<span style={{ fontSize: 8 }}>{t.l}</span></button>; })}</div>
      <div style={S.ct}>
        {tab === "character" && <CharTab char={c} setChar={sC} onRoll={sRP} isGM={pr.isGM} />}
        {tab === "combat" && <CombatTab char={c} setChar={sC} logs={logs} addLog={aL} onRoll={sRP} />}
        {tab === "inventory" && <InvTab char={c} setChar={sC} />}
        {tab === "library" && <LibTab loreData={pr.loreData} mapData={pr.mapData} setMapData={pr.setMapData} characters={pr.characters} isGM={pr.isGM} charId={c.id} />}
      </div>
    </div>
  );
}

/* ── GM Panel ── */
function GMPanel(pr) {
  var _s = useState(null); var sid = _s[0]; var sSid = _s[1];
  var _dl = useState(0); var dl = _dl[0]; var sDl = _dl[1];
  var _ddt = useState("Р"); var ddt = _ddt[0]; var sDdt = _ddt[1];
  var _dMag = useState(false); var dMag = _dMag[0]; var sDMag = _dMag[1];
  var _lore = useState(false); var showLore = _lore[0]; var setShowLore = _lore[1];
  var sel = pr.characters.find(function(c) { return c.id === sid; });
  function uC(id, fn) { pr.setCharacters(function(prev) { return prev.map(function(c) { return c.id === id ? fn(c) : c; }); }); }

  if (sel) return <GameView char={sel} setChar={function(fn) { uC(sel.id, fn); }} onBack={function() { sSid(null); }} isGM={true} loreData={pr.loreData} mapData={pr.mapData} setMapData={pr.setMapData} characters={pr.characters} />;

  if (showLore) return (
    <div style={Object.assign({}, S.wr, { justifyContent: "flex-start" })}>
      <style>{CSS}</style>
      <div style={{ padding: "12px 12px 6px", borderBottom: "2px solid #c084fc28", background: "#fdf4ff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={function() { setShowLore(false); }} style={{ background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "#8b7e6a" }}>←</button>
          <span style={{ fontSize: 16, fontFamily: "'Cinzel',serif", fontWeight: 900, color: "#7c3aed" }}>📚 Редактор Лорбука</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: 8, overflowY: "auto" }}>
        <LoreEditor loreData={pr.loreData} setLoreData={pr.setLoreData} mapData={pr.mapData} setMapData={pr.setMapData} characters={pr.characters} />
      </div>
    </div>
  );

  return (
    <div style={Object.assign({}, S.wr, { justifyContent: "flex-start" })}>
      <style>{CSS}</style>
      <div style={{ padding: "12px 12px 6px", borderBottom: "2px solid #c084fc28", background: "#fdf4ff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={pr.onBack} style={{ background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "#8b7e6a" }}>←</button>
          <span style={{ fontSize: 18, fontFamily: "'Cinzel',serif", fontWeight: 900, color: "#7c3aed" }}>🎭 ГМ Панель</span>
        </div>
      </div>
      <div style={{ padding: "6px 12px", display: "flex", flexDirection: "column", gap: 6, flex: 1, overflowY: "auto" }}>
        <button onClick={function() { setShowLore(true); }} style={{ width: "100%", padding: "10px", borderRadius: 9, border: "2px solid #8b5cf630", background: "linear-gradient(135deg,#fdf4ff,#fae8ff)", fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 13, color: "#7c3aed", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>📚 Редактор Лорбука</button>
        {pr.characters.length === 0 && <div style={{ textAlign: "center", padding: 20, color: "#8b7e6a" }}>Нет персонажей</div>}
        {pr.characters.map(function(c) {
          var inf = cF(c); var pf = PROFS.find(function(p) { return p.id === c.profId; }) || PROFS[0];
          var mxH = c.hpOv || mHP(inf.fs); var cH = c.curHp !== null ? c.curHp : mxH;
          var mxW = c.willOv || inf.fs.WILL || 1; var cW = c.curWill !== null ? c.curWill : mxW;
          var eqH = c.armors.find(function(a) { return a.id === c.equippedHead; });
          var eqB = c.armors.find(function(a) { return a.id === c.equippedBody; });
          return (
            <div key={c.id} style={{ background: "#fefdfb", border: "2px solid #c084fc18", borderRadius: 9, padding: "7px 9px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div><span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12 }}>{c.name || "?"}</span><span style={{ fontSize: 8, color: "#8b7e6a", marginLeft: 4 }}>{inf.race.name} · {pf.name} · Ур.{c.level}</span></div>
                <button onClick={function() { sSid(c.id); }} style={{ padding: "3px 8px", borderRadius: 5, border: "1px solid #7c3aed28", background: "#fdf4ff", fontWeight: 700, fontSize: 9, color: "#7c3aed", cursor: "pointer" }}>Открыть</button>
              </div>
              <div style={{ fontSize: 9, marginBottom: 4 }}>{"❤️ " + cH + "/" + mxH + " 🔥 WILL:" + cW + "/" + mxW + " " + (c.locked ? "🔒" : "🔓")}</div>
              {eqH && <div style={{ fontSize: 8, color: "#64748b" }}>{"🧠 " + eqH.name + " " + eqH.hp + "/" + eqH.maxHp}</div>}
              {eqB && <div style={{ fontSize: 8, color: "#64748b" }}>{"🫀 " + eqB.name + " " + eqB.hp + "/" + eqB.maxHp}</div>}

              <div style={{ display: "flex", gap: 2, flexWrap: "wrap", marginTop: 4 }}>
                <button onClick={function() { uC(c.id, function(p) { return Object.assign({}, p, { level: p.level + 1, lvlPts: p.lvlPts + 2 }); }); }} style={{ padding: "3px 6px", borderRadius: 4, border: "1px solid #10b98128", background: "#ecfdf5", fontSize: 8, fontWeight: 700, color: "#065f46", cursor: "pointer" }}>⬆️ +1 Ур.</button>
                <button onClick={function() { uC(c.id, function(p) { var m = p.hpOv || mHP(cF(p).fs); var mw = p.willOv || cF(p).fs.WILL || 1; return Object.assign({}, p, { curHp: m, curWill: mw }); }); }} style={{ padding: "3px 6px", borderRadius: 4, border: "1px solid #10b98128", background: "#ecfdf5", fontSize: 8, fontWeight: 700, color: "#065f46", cursor: "pointer" }}>💤 Отдых</button>
              </div>

              {/* GM Attack */}
              <div style={{ marginTop: 5, padding: "5px 6px", background: "#fef2f2", borderRadius: 6, border: "1px solid #ef444418" }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: "#ef4444", marginBottom: 3 }}>⚔️ Атака по {c.name}</div>
                <div style={{ display: "flex", gap: 3, alignItems: "center", marginBottom: 3 }}>
                  <input type="number" value={dl} onChange={function(e) { sDl(parseInt(e.target.value) || 0); }} style={Object.assign({}, S.inp, { width: 45, fontSize: 9, padding: 2 })} placeholder="Урон" />
                  <select value={ddt} onChange={function(e) { sDdt(e.target.value); }} style={Object.assign({}, S.inp, { width: 40, fontSize: 9, padding: 2, cursor: "pointer" })}>{DT.map(function(t) { return <option key={t} value={t}>{t}</option>; })}</select>
                  <label style={{ fontSize: 8, display: "flex", alignItems: "center", gap: 2 }}><input type="checkbox" checked={dMag} onChange={function(e) { sDMag(e.target.checked); }} />Магия</label>
                </div>
                <button onClick={function() {
                  if (dl <= 0) return;
                  var zone = ZONES[roll1(6) - 1];
                  var rawDmg = dl * zone.mult;
                  var armorSlot = zone.slot === "head" ? eqH : eqB;
                  var armorTypeId = armorSlot ? armorSlot.type : "none";

                  if (dMag) {
                    // Magic ignores armor, goes straight to HP
                    uC(c.id, function(p) {
                      var m = p.hpOv || mHP(cF(p).fs);
                      var cur = p.curHp !== null ? p.curHp : m;
                      return Object.assign({}, p, { curHp: Math.max(0, cur - rawDmg) });
                    });
                    alert("🔮 Магия! Зона: " + zone.e + " " + zone.name + " (×" + zone.mult + ")\nУрон: " + rawDmg + " (игнорирует броню)\nHP: -" + rawDmg);
                    return;
                  }

                  var eff = calcArmorEffect(armorTypeId, ddt, rawDmg);
                  var actualArmorDmg = armorSlot ? Math.min(armorSlot.hp, eff.armorDmg) : 0;
                  var actualHpDmg = eff.hpDmg;

                  uC(c.id, function(p) {
                    var m = p.hpOv || mHP(cF(p).fs);
                    var cur = p.curHp !== null ? p.curHp : m;
                    var newArmors = p.armors;
                    if (armorSlot && actualArmorDmg > 0) {
                      newArmors = p.armors.map(function(a) { return a.id === armorSlot.id ? Object.assign({}, a, { hp: Math.max(0, a.hp - actualArmorDmg) }) : a; });
                    }
                    return Object.assign({}, p, { curHp: Math.max(0, cur - actualHpDmg), armors: newArmors });
                  });
                  alert("⚔️ Зона: " + zone.e + " " + zone.name + " (×" + zone.mult + ")\nБаза: " + dl + " → Итого: " + rawDmg + "\n" + eff.desc + "\nБроня: -" + actualArmorDmg + " HP: -" + actualHpDmg);
                }} style={{ width: "100%", padding: 5, borderRadius: 5, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, fontSize: 9, cursor: "pointer" }}>⚔️ Нанести урон</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── App ── */
export default function App() {
  var _a = useState([]); var ch = _a[0]; var sCh = _a[1];
  var _b = useState(null); var aid = _b[0]; var sAid = _b[1];
  var _c = useState(false); var gm = _c[0]; var sGm = _c[1];
  var _d = useState({}); var lore = _d[0]; var sLore = _d[1];
  var _e = useState({}); var mapD = _e[0]; var sMapD = _e[1];
  var ac = ch.find(function(c) { return c.id === aid; });
  function sAC(fn) { sCh(function(p) { return p.map(function(c) { return c.id === aid ? (typeof fn === "function" ? fn(c) : fn) : c; }); }); }
  if (gm) return <GMPanel characters={ch} setCharacters={sCh} onBack={function() { sGm(false); }} loreData={lore} setLoreData={sLore} mapData={mapD} setMapData={sMapD} />;
  if (ac) return <GameView char={ac} setChar={sAC} onBack={function() { sAid(null); }} isGM={false} loreData={lore} mapData={mapD} setMapData={sMapD} characters={ch} />;
  return <MainMenu characters={ch} setCharacters={sCh} onSelect={sAid} onGM={function() { sGm(true); }} />;
}

var S = {
  wr: { fontFamily: "'Nunito',sans-serif", background: "linear-gradient(180deg,#fefcf5,#f5efe3)", minHeight: "100vh", maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column" },
  tb: { display: "flex", gap: 1, padding: "2px 2px 0", background: "#faf6ee", borderBottom: "1px solid #e8e0d4" },
  ta: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: "5px 2px", border: "none", borderRadius: "6px 6px 0 0", cursor: "pointer", fontFamily: "'Nunito',sans-serif" },
  ct: { flex: 1, padding: 8, overflowY: "auto" },
  lb: { display: "block", fontSize: 8, fontWeight: 700, color: "#5c5548", marginBottom: 1, textTransform: "uppercase", letterSpacing: 0.5 },
  inp: { width: "100%", padding: "4px 5px", border: "2px solid #e8e0d4", borderRadius: 5, fontSize: 10, fontFamily: "'Nunito',sans-serif", background: "#fefdfb", color: "#2d2a24", outline: "none" },
  sm: { width: 20, height: 20, border: "2px solid #e8e0d4", borderRadius: 4, background: "#fefdfb", cursor: "pointer", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#5c5548" },
  ab: { padding: "2px 6px", borderRadius: 4, cursor: "pointer", fontSize: 10, fontFamily: "'Nunito',sans-serif", fontWeight: 700 },
  bud: { border: "2px solid", borderRadius: 7, padding: "4px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }
};
