import React, { useState } from 'react';
import { db, ref, set } from '../../firebase';
import { ARMOR_T, ZONES } from '../../data/combat';
import { DT, SD, WT } from '../../data/stats';
import { S } from '../../styles/ui';
import { cF, mHP } from '../../utils/character';
import { calcAE } from '../../utils/combat';
import { r1, rN, sm, uid, rollHit } from '../../utils/dice';
import GMAttackPanel from '../combat/GMAttackPanel';
import PlayerAttackNotif from '../combat/PlayerAttackNotif';
import RollPopup from '../combat/RollPopup';
import InitiativeBar from '../combat/InitiativeBar';

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
var _twn=useState("");var twn=_twn[0];var sTWN=_twn[1];var _twd=useState("1d6");var twd=_twd[0];var sTWD=_twd[1];var _twt=useState("Battle");var twt=_twt[0];var sTWT=_twt[1];var _twdt=useState("Р");var twdt=_twdt[0];var sTWDT=_twdt[1];var _twb=useState(0);var twb=_twb[0];var sTWB=_twb[1];var _tmgc=useState(false);var tmgc=_tmgc[0];var sTMGC=_tmgc[1];
var _editNpc=useState(null);var editNpc=_editNpc[0];var sEditNpc=_editNpc[1];
var cats=Object.keys(templ);
var playerChars=(pr.characters||[]).filter(function(x){return x.active});if(playerChars.length===0)playerChars=(pr.characters||[]);
var allPlayerChars=pr.characters||[];

function addCat(){if(!catName.trim())return;var n=Object.assign({},templ);n[catName.trim()]={_created:Date.now()};pr.saveNpcTempl(n);sCatName("")}
function delCat(c2){var n=Object.assign({},templ);delete n[c2];pr.saveNpcTempl(n)}
function resetForm(){sNN("");sNL(1);sNHP(20);sNStats({INT:3,REF:3,DEX:3,BODY:3,EMP:1,CRA:1,WILL:3});sNSkills({dodge:2,resist:2});sNWeapons([]);sNAR("none");sNARH(10);sNARBOD("none");sNARBH(10);sEditNpc(null)}
function loadNpcToForm(n){sNN(n.name||"");sNL(n.level||1);sNHP(n.maxHp||20);sNStats(n.stats||{INT:3,REF:3,DEX:3,BODY:3,EMP:1,CRA:1,WILL:3});sNSkills(n.skills||{dodge:2,resist:2});sNWeapons(n.weapons||[]);sNAR(n.armorHead||"none");sNARH(n.armorHeadHp||10);sNARBOD(n.armorBody||"none");sNARBH(n.armorBodyHp||10)}
function saveNpc(){if(!nn.trim()||!selCat)return;var n=Object.assign({},templ);if(!n[selCat])n[selCat]={_created:Date.now()};var id=editNpc||("npc_"+Date.now());n[selCat][id]={name:nn.trim(),level:nl,hp:nhp,maxHp:nhp,stats:Object.assign({},nstats),skills:Object.assign({},nskills),weapons:nweapons.slice(),armorHead:nar,armorHeadHp:narh,armorHeadMaxHp:narh,armorBody:narbod,armorBodyHp:narbh,armorBodyMaxHp:narbh};pr.saveNpcTempl(n);resetForm()}
function delNpc(cat,id){var n=Object.assign({},templ);if(n[cat])delete n[cat][id];pr.saveNpcTempl(n)}
function addTmpWeapon(){if(!twn.trim())return;sNWeapons(nweapons.concat([{id:uid(),name:twn.trim(),dice:twd,type:twt,dmgType:twdt,bonus:twb,magic:tmgc}]));sTWN("");sTMGC(false)}
function spawnNpc(cat,id){var t=templ[cat]&&templ[cat][id];if(!t)return;var sp=Object.assign({},spawned);var sid="s_"+Date.now();sp[sid]=Object.assign({},t,{_catId:cat,_tmplId:id,spawnedAt:Date.now()});pr.saveSpawned(sp);pr.addLog({who:"ГМ",type:"spawn",label:"👹 "+t.name+" появился!",detail:"",total:0})}
function despawn(id){var sp=Object.assign({},spawned);delete sp[id];pr.saveSpawned(sp)}
function updateSpawned(id,data){var sp=Object.assign({},spawned);sp[id]=data;pr.saveSpawned(sp)}
function rollInitiative(){
  var list=[];
  playerChars.forEach(function(pc){var inf=cF(pc);var rv=inf.fs.REF||0;var R=rollHit();list.push({id:pc._fbId,name:pc.name||"?",kind:"player",init:R.d+rv})});
  Object.entries(spawned).forEach(function(e){var id=e[0];var s=e[1];var hp=s.hp!==undefined?s.hp:s.maxHp;if(hp<=0)return;var rv=(s.stats||{}).REF||0;var R=rollHit();list.push({id:id,name:s.name,kind:"npc",init:R.d+rv})});
  if(!list.length)return;
  list.sort(function(a,b){return b.init-a.init});
  if(pr.saveInitiative)pr.saveInitiative({list:list,turn:0,round:1});
  pr.addLog({who:"ГМ",type:"spawn",label:"⚔️ Инициатива брошена",detail:list.map(function(x){return x.name+":"+x.init}).join(", "),total:0});
}
function nextTurn(){var init=pr.initiative;if(!init||!init.list||!init.list.length)return;var n=(init.turn||0)+1;var round=init.round||1;if(n>=init.list.length){n=0;round++}if(pr.saveInitiative)pr.saveInitiative(Object.assign({},init,{turn:n,round:round}))}
function endCombat(){if(pr.saveInitiative)pr.saveInitiative(null)}

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
  var rv,skVal,skNm,atName;
  if(w.magic){rv=st.WILL||0;skVal=sk.spellcast||0;skNm="Spellcast";atName="WILL";}
  else{var skMap={Battle:"battleWeapon",Simple:"simpleWeapon",Guns:"guns",Archery:"archery"};skVal=sk[skMap[w.type]]||0;rv=st.REF||0;skNm=w.type;atName="REF";}
  var R=rollHit();var d=R.d;var t=d+rv+skVal+(w.bonus||0);
  var tgtChar=playerTgtId?playerChars.find(function(x){return x._fbId===playerTgtId}):null;
  var tgtName=tgtChar?tgtChar.name:"";
  pr.addLog({who:s.name,type:"hit",label:(w.magic?"🔮 ":"🎯 ")+w.name+(tgtName?" → "+tgtName:"")+(R.crit?" 🌟КРИТ":R.fumble?" 💀ПРОВАЛ":""),detail:"🎲"+d+" + "+atName+"("+rv+") + "+skNm+"("+skVal+") + бонус("+(w.bonus||0)+") = "+t,total:t});
  /* RollPopup не показываем — результат отображается в GMAttackPanel */
  if(!playerTgtId){sRollP({label:s.name+" — "+w.name+" Попад.",d10:d,crit:R.crit,fumble:R.fumble,parts:[{label:atName,value:rv},{label:skNm,value:skVal},{label:"Бнс",value:w.bonus||0}],total:t,subtext:"(нет цели)"});}
  if(playerTgtId&&pr.savePendingAttack){
    pr.savePendingAttack({id:"atk_"+Date.now(),attackerName:s.name,targetId:playerTgtId,targetName:tgtName,
      hitRoll:t,atkD:d,atkREF:rv,atkSkill:skVal,atkSkillName:skNm,atkBonus:w.bonus||0,
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
<div style={{padding:"8px 10px",borderBottom:"2px solid #ef444428",background:"#2a1414",display:"flex",alignItems:"center",gap:6}}><button onClick={pr.onBack} style={{background:"none",border:"none",fontSize:14,cursor:"pointer",color:"#a89a82"}}>←</button><span style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:14,color:"#ef4444"}}>👹 Бестиарий</span></div>
<div style={{flex:1,padding:8,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>

{/* Инициатива / порядок ходов */}
<div style={{display:"flex",flexDirection:"column",gap:5}}>
{pr.initiative?<InitiativeBar initiative={pr.initiative}/>:<div style={{fontSize:9,color:"#a89a82",fontStyle:"italic",border:"2px dashed #f59e0b30",borderRadius:9,padding:"6px 8px",background:"#231b08"}}>⚔️ Бой не начат. Отметь игроков «В игру», заспавни NPC и брось инициативу.</div>}
<div style={{display:"flex",gap:3}}>
{!pr.initiative&&<button onClick={rollInitiative} style={{flex:1,padding:"5px",borderRadius:6,border:"2px solid #f59e0b40",background:"#2a2008",color:"#f0b352",fontWeight:700,fontSize:10,cursor:"pointer"}}>🎲 Бросить инициативу</button>}
{pr.initiative&&<button onClick={nextTurn} style={{flex:1,padding:"5px",borderRadius:6,border:"none",background:"#f59e0b",color:"#1a1410",fontWeight:700,fontSize:10,cursor:"pointer"}}>▶ Следующий ход</button>}
{pr.initiative&&<button onClick={rollInitiative} title="Перебросить" style={{padding:"5px 8px",borderRadius:6,border:"1px solid #322d24",background:"#1d1a14",color:"#a89a82",fontSize:10,cursor:"pointer"}}>🔄</button>}
{pr.initiative&&<button onClick={endCombat} title="Завершить бой" style={{padding:"5px 8px",borderRadius:6,border:"1px solid #ef444430",background:"#2a1414",color:"#ef4444",fontSize:10,cursor:"pointer"}}>⏹ Конец</button>}
</div>
</div>
{/* Выбор цели для атак NPC по игрокам */}
{<div style={{border:"2px solid #3b82f628",borderRadius:9,padding:"6px 8px",background:"#0e1a2b"}}>
<label style={Object.assign({},S.lb,{color:"#60a5fa"})}>🎯 Цель NPC-атак (игрок)</label>
{playerChars.length===0&&<div style={{fontSize:9,color:"#a89a82",fontStyle:"italic",padding:"4px 0"}}>Нет активных игроков — отметь игроков "В игру" в панели ГМ</div>}
<div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:3}}>
{playerChars.map(function(pc){var inf2=cF(pc);var pMx=pc.hpOv||mHP(inf2.fs);var pCur=pc.curHp!==null&&pc.curHp!==undefined?pc.curHp:pMx;var pPct=pMx>0?(pCur/pMx)*100:0;var isSel=playerTgtId===pc._fbId;
return <button key={pc._fbId} onClick={function(){sPlayerTgt(isSel?null:pc._fbId)}} style={{padding:"3px 7px",borderRadius:6,border:"2px solid "+(isSel?"#3b82f6":"#322d24"),background:isSel?"#12233a":"#1d1a14",fontSize:9,fontWeight:isSel?700:400,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
<span>{pc.name}</span>
<div style={{width:40,height:4,background:"#262219",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:pPct+"%",background:pPct<=25?"#ef4444":pPct<=50?"#f59e0b":"#10b981",borderRadius:2}}/></div>
<span style={{fontSize:7,color:"#a89a82"}}>{pCur+"/"+pMx}</span>
</button>})}
</div>
{playerTgtId&&<div style={{marginTop:4}}>
<label style={Object.assign({},S.lb,{marginTop:3})}>Зона удара по игроку</label>
<div style={{display:"flex",flexWrap:"wrap",gap:2,marginTop:2}}>
{ZONES.map(function(z){return <button key={z.name} onClick={function(){sPlayerZone(z.name)}} style={{padding:"2px 5px",borderRadius:5,border:"2px solid "+(playerZone===z.name?"#f59e0b":"#322d24"),background:playerZone===z.name?"#231b08":"#1d1a14",fontSize:8,fontWeight:playerZone===z.name?700:400,cursor:"pointer"}}>{z.e+" "+z.name+(z.ignoreArmor?" 🔓":"")+" ×"+z.mult}</button>})}
</div>
</div>}
</div>}

{/* NPC на поле боя */}
{Object.keys(spawned).length>0&&<div style={{border:"2px solid #ef444420",borderRadius:9,padding:"6px 8px",background:"#2a1414"}}>
<div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11,color:"#ef4444",marginBottom:4}}>⚔️ На поле боя</div>
{Object.entries(spawned).map(function(e){var id=e[0];var s=e[1];var hpP=s.maxHp>0?((s.hp||0)/s.maxHp)*100:0;var st=s.stats||{};var sk=s.skills||{};var wpns=s.weapons||[];
return <div key={id} style={{background:"#262219",border:"1px solid #322d24",borderRadius:7,padding:"5px 7px",marginBottom:4}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:11}}>{s.name} <span style={{fontSize:8,color:"#a89a82"}}>Ур.{s.level}</span></span><button onClick={function(){if(window.confirm("Убрать "+s.name+"?"))despawn(id)}} style={{fontSize:8,background:"none",border:"none",color:"#ef4444",cursor:"pointer"}}>✕</button></div>
{(s.hp||0)<=0&&<div style={{background:"#ece5d8",borderRadius:5,padding:"3px 7px",marginTop:3,textAlign:"center",fontSize:9,color:"#262219",fontWeight:700}}>💀 Повержен</div>}
<div style={{display:"flex",alignItems:"center",gap:3,marginTop:2}}><span style={{fontSize:8}}>❤️</span><div style={{flex:1,background:"#262219",borderRadius:3,height:8,overflow:"hidden"}}><div style={{height:"100%",width:hpP+"%",background:(s.hp||0)<=0?"#ece5d8":"#ef4444",borderRadius:3}}/></div><div style={{display:"flex",gap:1}}>{[-5,-1,1,5].map(function(d){return <button key={d} onClick={function(){updateSpawned(id,Object.assign({},s,{hp:Math.max(0,Math.min(s.maxHp,(s.hp||0)+d))}))}} style={{padding:"1px 4px",borderRadius:3,fontSize:7,fontWeight:700,border:"1px solid #322d24",background:d<0?"#2a1414":"#0e2018",color:d<0?"#ef4444":"#10b981",cursor:"pointer"}}>{d>0?"+"+d:d}</button>})}</div><span style={{fontSize:9,fontWeight:700,fontFamily:"'Cinzel',serif"}}>{(s.hp||0)+"/"+s.maxHp}</span></div>
{s.armorHead&&s.armorHead!=="none"&&<div style={{fontSize:7,color:"#94a3b8",marginTop:1}}>🧠 {s.armorHead} {s.armorHeadHp||0}/{s.armorHeadMaxHp||0}</div>}
{s.armorBody&&s.armorBody!=="none"&&<div style={{fontSize:7,color:"#94a3b8"}}>🫀 {s.armorBody} {s.armorBodyHp||0}/{s.armorBodyMaxHp||0}</div>}
<div style={{display:"flex",gap:2,marginTop:3,flexWrap:"wrap"}}>
{wpns.length>0?wpns.map(function(w,wi){return <div key={wi} style={{display:"flex",gap:1,marginBottom:1}}>
<button onClick={function(){npcAttack(s,w)}} style={{padding:"2px 5px",borderRadius:4,border:"1px solid "+(w.magic?"#7c3aed40":"#3b82f620"),background:w.magic?"#1f1330":"#0e1a2b",fontSize:7,fontWeight:700,color:w.magic?"#a78bfa":"#60a5fa",cursor:"pointer"}}>{(w.magic?"🔮 ":"🎯 ")+w.name+(playerTgtId?" →":"")}</button>
<button onClick={function(){npcDmg(s,w)}} style={{padding:"2px 5px",borderRadius:4,border:"1px solid #ef444420",background:"#2a1414",fontSize:7,fontWeight:700,color:"#dc2626",cursor:"pointer"}}>{"💥"+(playerTgtId?" →":"")}</button>
</div>}):
<button onClick={function(){var R=rollHit();var d=R.d;var t=d+(st.REF||0);sRollP({label:s.name+" Атака",d10:d,crit:R.crit,fumble:R.fumble,parts:[{label:"REF",value:st.REF||0}],total:t});pr.addLog({who:s.name,type:"hit",label:"🎯 Атака"+(R.crit?" 🌟КРИТ":R.fumble?" 💀ПРОВАЛ":""),detail:"🎲"+d+" + REF("+(st.REF||0)+") = "+t,total:t})}} style={{padding:"3px 6px",borderRadius:4,border:"1px solid #3b82f620",background:"#0e1a2b",fontSize:8,fontWeight:700,color:"#60a5fa",cursor:"pointer"}}>🎯 Атака</button>}
<button onClick={function(){npcMagic(s,id)}} style={{padding:"3px 5px",borderRadius:4,border:"1px solid #7c3aed20",background:"#1f1330",fontSize:7,fontWeight:700,color:"#7c3aed",cursor:"pointer"}}>{"🔮"+(playerTgtId?" →":"")}</button>
<button onClick={function(){var R=rollHit();var d=R.d;var dv=st.DEX||0;var dg=sk.dodge||0;var t=d+dv+dg;sRollP({label:s.name+" — Уклонение",d10:d,crit:R.crit,fumble:R.fumble,parts:[{label:"DEX",value:dv},{label:"Dodge",value:dg}],total:t});pr.addLog({who:s.name,type:"dodge",label:"🛡️ Уклонение"+(R.crit?" 🌟":R.fumble?" 💀":""),detail:"🎲"+d+" + DEX("+dv+") + Dodge("+dg+") = "+t,total:t})}} style={{padding:"3px 6px",borderRadius:4,border:"1px solid #10b98120",background:"#0e2018",fontSize:8,fontWeight:700,color:"#34d399",cursor:"pointer"}}>🛡️ Уклон.</button>
</div></div>})}
</div>}

{/* Категории */}
{(pr.logs||[]).filter(function(l){return l.type==="hit"||l.type==="dmg"||l.type==="dmg_npc"||l.type==="dodge"||l.type==="magic"||l.type==="magic_fail"||l.type==="spawn"}).slice(0,8).length>0&&<div style={{border:"2px solid #322d24",borderRadius:9,padding:"6px 8px",background:"#1d1a14"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11,marginBottom:4}}>📜 Боевой лог</div><div style={{maxHeight:130,overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>{(pr.logs||[]).filter(function(l){return l.type==="hit"||l.type==="dmg"||l.type==="dmg_npc"||l.type==="dodge"||l.type==="magic"||l.type==="magic_fail"||l.type==="spawn"}).slice(0,8).map(function(l,i){var bgc=l.type==="magic_fail"?"#311717":l.type==="magic"?"#1f1330":l.type==="dodge"?"#0e2018":l.type==="hit"?"#0e1a2b":l.type==="spawn"?"#1f1330":"#2a1414";return <div key={i} style={{background:bgc,borderRadius:4,padding:"3px 6px",fontSize:8}}><b>{l.who||"?"}: {l.label}</b>{l.total>0&&<span style={{fontFamily:"'Cinzel',serif",fontWeight:700,marginLeft:4}}>={l.total}</span>}</div>})}</div></div>}
<div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:12}}>📁 Категории</div>
<div style={{display:"flex",gap:3}}><input style={Object.assign({},S.inp,{flex:1})} value={catName} onChange={function(e){sCatName(e.target.value)}} placeholder="Новая категория..." onKeyDown={function(e){if(e.key==="Enter")addCat()}}/><button onClick={addCat} style={{padding:"4px 10px",borderRadius:5,border:"none",background:"#10b981",color:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}>+</button></div>
{cats.length===0&&<div style={{textAlign:"center",padding:12,color:"#a89a82",fontStyle:"italic",fontSize:9}}>Создай категорию (Бандиты, Нежить, Звери...)</div>}
{cats.map(function(cat){var npcs=templ[cat]||{};var npcArr=Object.entries(npcs).filter(function(e){return e[0]!=="_created"});var isOpen=selCat===cat;return <div key={cat} style={{border:"2px solid #ef444418",borderRadius:8,overflow:"hidden"}}><button onClick={function(){sCat(isOpen?null:cat)}} style={{width:"100%",display:"flex",justifyContent:"space-between",padding:"6px 8px",background:"#2a1414",border:"none",cursor:"pointer",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11,color:"#ef4444"}}><span>{"📁 "+cat+" ("+npcArr.length+")"}</span><span style={{transform:isOpen?"rotate(180deg)":"none"}}>▼</span></button>
{isOpen&&<div style={{padding:"5px 7px",background:"#1d1a14",display:"flex",flexDirection:"column",gap:4}}>
{npcArr.map(function(e2){var nid=e2[0];var n=e2[1];return <div key={nid} style={{border:"1px solid #322d24",borderRadius:6,padding:"4px 6px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontWeight:700,fontSize:10}}>{n.name}</span><span style={{fontSize:8,color:"#a89a82",marginLeft:3}}>Ур.{n.level} HP:{n.maxHp}</span></div><div style={{display:"flex",gap:2}}><button onClick={function(){loadNpcToForm(n);sEditNpc(nid);sCat(cat)}} style={{padding:"2px 5px",borderRadius:4,border:"1px solid #3b82f620",background:"#0e1a2b",fontSize:7,fontWeight:700,color:"#60a5fa",cursor:"pointer"}}>✏️</button><button onClick={function(){spawnNpc(cat,nid)}} style={{padding:"2px 6px",borderRadius:4,border:"1px solid #10b98128",background:"#0e2018",fontSize:8,fontWeight:700,color:"#34d399",cursor:"pointer"}}>⚔️ Спавн</button><button onClick={function(){delNpc(cat,nid)}} style={{background:"none",border:"none",color:"#ef4444",fontSize:9,cursor:"pointer"}}>✕</button></div></div>
<div style={{fontSize:7,color:"#9a8f7c",marginTop:1}}>{(n.weapons||[]).length>0?(n.weapons||[]).map(function(w){return w.name+" "+w.dice+" "+w.dmgType}).join(", "):"Без оружия"}</div>
</div>})}
<div style={{border:"2px dashed #ef444430",borderRadius:8,padding:6,display:"flex",flexDirection:"column",gap:4,background:"#2a141408"}}>
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
{nweapons.map(function(w,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:3,fontSize:8,padding:"2px 4px",background:"#1d1a14",border:"1px solid #322d24",borderRadius:4}}><span style={{flex:1,fontWeight:600}}>{w.name} {w.dice} {w.dmgType} +{w.bonus}</span><button onClick={function(){sNWeapons(nweapons.filter(function(x,j){return j!==i}))}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:8}}>✕</button></div>})}
<div style={{display:"flex",gap:2,flexWrap:"wrap"}}><input style={Object.assign({},S.inp,{flex:2,minWidth:60,fontSize:8,padding:2})} value={twn} onChange={function(e){sTWN(e.target.value)}} placeholder="Оружие"/><input style={Object.assign({},S.inp,{width:35,fontSize:8,padding:2})} value={twd} onChange={function(e){sTWD(e.target.value)}} placeholder="1d6"/><select value={twt} onChange={function(e){sTWT(e.target.value)}} style={Object.assign({},S.inp,{width:50,fontSize:8,padding:2})}>{WT.map(function(t){return <option key={t} value={t}>{t}</option>})}</select><select value={twdt} onChange={function(e){sTWDT(e.target.value)}} style={Object.assign({},S.inp,{width:30,fontSize:8,padding:2})}>{DT.map(function(t){return <option key={t} value={t}>{t}</option>})}</select><input style={Object.assign({},S.inp,{width:28,fontSize:8,padding:2})} type="number" value={twb} onChange={function(e){sTWB(parseInt(e.target.value)||0)}} placeholder="+"/><button onClick={function(){sTMGC(!tmgc)}} title="Заклинание (попадание по WILL+Spellcast)" style={{padding:"2px 6px",borderRadius:3,border:"1px solid #7c3aed40",background:tmgc?"#7c3aed":"#1f1330",color:tmgc?"#fff":"#a78bfa",fontWeight:700,fontSize:8,cursor:"pointer"}}>🔮</button><button onClick={addTmpWeapon} style={{padding:"2px 6px",borderRadius:3,border:"none",background:"#10b981",color:"#fff",fontWeight:700,fontSize:7,cursor:"pointer"}}>+</button></div>
{tmgc&&<div style={{fontSize:7,color:"#a78bfa",fontStyle:"italic"}}>🔮 Заклинание: попадание по WILL + Spellcast</div>}
<div style={{fontSize:8,fontWeight:700,marginTop:2}}>Броня</div>
<div style={{display:"flex",gap:3}}><div style={{flex:1}}><label style={{fontSize:6,fontWeight:700}}>🧠 Голова</label><select value={nar} onChange={function(e){sNAR(e.target.value)}} style={Object.assign({},S.inp,{fontSize:8,padding:2})}>{ARMOR_T.map(function(a){return <option key={a.id} value={a.id}>{a.name}</option>})}</select>{nar!=="none"&&<input style={Object.assign({},S.inp,{fontSize:8,padding:2,marginTop:2})} type="number" value={narh} onChange={function(e){sNARH(parseInt(e.target.value)||1)}} placeholder="HP"/>}</div><div style={{flex:1}}><label style={{fontSize:6,fontWeight:700}}>🫀 Тело</label><select value={narbod} onChange={function(e){sNARBOD(e.target.value)}} style={Object.assign({},S.inp,{fontSize:8,padding:2})}>{ARMOR_T.map(function(a){return <option key={a.id} value={a.id}>{a.name}</option>})}</select>{narbod!=="none"&&<input style={Object.assign({},S.inp,{fontSize:8,padding:2,marginTop:2})} type="number" value={narbh} onChange={function(e){sNARBH(parseInt(e.target.value)||1)}} placeholder="HP"/>}</div></div>
<div style={{display:"flex",gap:3,marginTop:2}}><button onClick={function(){saveNpc();sCat(cat)}} style={{flex:1,padding:6,borderRadius:5,border:"none",background:"#ef4444",color:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}>{editNpc?"💾 Сохранить":"Создать NPC"}</button>{editNpc&&<button onClick={resetForm} style={{padding:"6px 10px",borderRadius:5,border:"2px solid #322d24",background:"#262219",fontWeight:700,fontSize:10,cursor:"pointer"}}>Отмена</button>}</div>
</div>
<button onClick={function(){if(window.confirm("Удалить категорию "+cat+"?"))delCat(cat)}} style={{fontSize:8,color:"#ef4444",background:"none",border:"none",cursor:"pointer",marginTop:3}}>🗑️ Удалить категорию</button>
</div>}
</div>})}
</div></div>)}


export default BestiaryEditor;
