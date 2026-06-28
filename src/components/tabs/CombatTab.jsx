import React, { useState } from 'react';
import { db, ref, set } from '../../firebase';
import { ZONES } from '../../data/combat';
import { getProfs } from '../../utils/profStore';
import { DT, WS, WT } from '../../data/stats';
import { S } from '../../styles/ui';
import { cF, mHP } from '../../utils/character';
import { applyDmgToNpc } from '../../utils/combat';
import { pk, r1, rN, sm, uid, rollHit } from '../../utils/dice';
import ArmorSection from './ArmorSection';
import InvTab from './InvTab';
import ShopPicker from '../ShopPicker';
import InitiativeBar from '../combat/InitiativeBar';

function CombatTab(pr){
var c=pr.char;var sv=pr.save;var oR=pr.onRoll;var inf=cF(c);var fs=inf.fs;var es=inf.eSk;
var pf=getProfs().find(function(p){return p.id===c.profId})||getProfs()[0];
var _sa=useState(false);var sa=_sa[0];var sSA=_sa[1];
var _wn=useState("");var wn=_wn[0];var sWN=_wn[1];
var _wt=useState("Battle");var wt=_wt[0];var sWT=_wt[1];
var _wdt=useState("Р");var wdt=_wdt[0];var sWDT=_wdt[1];
var _wb=useState(0);var wb=_wb[0];var sWB=_wb[1];
var _wdi=useState("1d6");var wdi=_wdi[0];var sWDI=_wdi[1];
var _wh=useState(1);var wh=_wh[0];var sWH=_wh[1];
var _wdi2=useState("2d6");var wdi2=_wdi2[0];var sWDI2=_wdi2[1];var _wb2=useState(0);var wb2=_wb2[0];var sWB2=_wb2[1];
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
var _mint=useState("");var mInt=_mint[0];var sMInt=_mint[1];
var spawned=pr.spawned||{};var saveSpawned=pr.saveSpawned;
var spawnedArr=Object.entries(spawned).filter(function(e){var hp=e[1].hp!==undefined?e[1].hp:e[1].maxHp;return hp>0});
var tgtNpc=tgtId?spawned[tgtId]:null;
var mx=c.hpOv||mHP(fs);var curHp=c.curHp!==null&&c.curHp!==undefined?c.curHp:mx;
var mxW=c.willOv||fs.WILL||1;var curW=c.curWill!==null&&c.curWill!==undefined?c.curWill:mxW;
var hpP=mx>0?(curHp/mx)*100:0;
var isGM=pr.isGM;
var visibleLogs=(pr.logs||[]).filter(function(l){return isGM||(l.type!=="dmg_npc"&&l.type!=="spawn")});
return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
{pr.initiative&&<InitiativeBar initiative={pr.initiative}/>}
<div style={{background:"#2a1414",border:"2px solid #ef444418",borderRadius:9,padding:"7px 9px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11}}>❤️ HP</span><div style={{display:"flex",alignItems:"center",gap:3}}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:14,color:"#ef4444"}}>{curHp}</span><span style={{color:"#a89a82"}}>/</span><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:14}}>{mx}</span></div></div>
<div style={{background:"#262219",borderRadius:4,height:10,overflow:"hidden"}}><div style={{height:"100%",width:hpP+"%",background:"#ef4444",borderRadius:4,transition:"width 0.3s"}}/></div>
<div style={{display:"flex",gap:2,justifyContent:"center",marginTop:4}}>{[-10,-5,-1,1,5,10].map(function(d){return <button key={d} onClick={function(){sv(Object.assign({},c,{curHp:Math.max(0,Math.min(mx,curHp+d))}))}} style={Object.assign({},S.ab,{background:d<0?"#ef444412":"#ef444420",color:"#ef4444",border:"1px solid #ef444418"})}>{d>0?"+"+d:d}</button>})}</div>
</div>

<div style={{display:"flex",gap:4}}>
<div style={{flex:1,background:"#1c1530",border:"2px solid #8b5cf618",borderRadius:9,padding:"5px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11}}>🔥 WILL</span>
<div style={{display:"flex",alignItems:"center",gap:2}}><button onClick={function(){sv(Object.assign({},c,{curWill:Math.max(0,curW-1)}))}} style={S.sm}>−</button><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13,color:"#8b5cf6"}}>{curW+"/"+mxW}</span><button onClick={function(){sv(Object.assign({},c,{curWill:Math.min(mxW,curW+1)}))}} style={S.sm}>+</button></div>
</div>
<button onClick={function(){sv(Object.assign({},c,{curHp:mx,curWill:mxW,warriorBonus:false,warriorBonusUsed:false,sensitiveBonus:false,customStance:false,merchantUsed:false}));pr.addLog({who:c.name||"???",type:"rest",label:"💤 Отдых — способности восстановлены",detail:"",total:0})}} style={{padding:"5px 10px",borderRadius:9,border:"2px solid #10b98120",background:"#0e2018",fontWeight:700,fontSize:10,color:"#34d399",cursor:"pointer"}}>💤</button>
</div>

{/* Броня игрока */}
<ArmorSection char={c} save={sv} finalStats={fs} shop={pr.shop}/>

{/* NPC цели — видны всем игрокам */}
{spawnedArr.length>0&&<div style={{border:"2px solid #ef444428",borderRadius:9,padding:"6px 8px",background:"#2a1414"}}>
<label style={Object.assign({},S.lb,{color:"#ef4444"})}>⚔️ Враги на поле боя</label>
<div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:3}}>
{spawnedArr.map(function(e){var nid=e[0];var n=e[1];var nHp=n.hp!==undefined?n.hp:n.maxHp;var hpPct=n.maxHp>0?(nHp/n.maxHp)*100:0;var isSel=tgtId===nid;
return <button key={nid} onClick={function(){sTgt(isSel?null:nid)}} style={{padding:"4px 8px",borderRadius:7,border:"2px solid "+(isSel?"#ef4444":"#322d24"),background:isSel?"#311717":"#1d1a14",fontSize:9,fontWeight:isSel?700:400,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:60}}>
<span style={{fontWeight:700}}>{n.name}</span>
<div style={{width:50,height:5,background:"#262219",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:hpPct+"%",background:hpPct<=25?"#ef4444":hpPct<=50?"#f59e0b":"#10b981",borderRadius:3}}/></div>
<span style={{fontSize:7,color:"#a89a82"}}>{nHp+"/"+n.maxHp+" HP"}</span>
</button>})}
</div>
{tgtNpc&&<div style={{marginTop:5,paddingTop:5,borderTop:"1px solid #3a1c1c"}}>
<label style={Object.assign({},S.lb,{color:"#ef4444",marginBottom:3})}>🎯 Зона удара → {tgtNpc.name}</label>
<div style={{display:"flex",flexWrap:"wrap",gap:2}}>
{ZONES.map(function(z){var isSel=selZone===z.name;return <button key={z.name} onClick={function(){sZone(z.name)}} style={{padding:"2px 6px",borderRadius:5,border:"2px solid "+(isSel?"#f59e0b":"#322d24"),background:isSel?"#231b08":"#1d1a14",fontSize:8,fontWeight:isSel?700:400,cursor:"pointer"}}>{z.e+" "+z.name+(z.ignoreArmor?" 🔓":"")+" ×"+z.mult}</button>})}
</div>
</div>}
</div>}


{/* Способности профессий — Воин и Чувствительный */}
{(function(){
  if(pf.id==="warrior"){
    var warActive=c.warriorBonus;
    var warUsed=c.warriorBonusUsed;
    return(<div style={{background:"#2a1414",border:"2px solid #ef444428",borderRadius:9,padding:"7px 9px"}}>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10,color:"#ef4444",marginBottom:4}}>⚔️ Стойкость Дуэлянта</div>
      <div style={{fontSize:8,color:"#9a8f7c",marginBottom:6}}>{warActive?"Активен — следующая атака +5":"Один раз в день: +5 к атаке в одном ходу"}</div>
      <div style={{display:"flex",gap:4}}>
        <button disabled={warUsed} onClick={function(){sv(Object.assign({},c,{warriorBonus:true,warriorBonusUsed:true}))}} style={{flex:1,padding:"6px",borderRadius:7,border:"none",background:warUsed?"#322d24":warActive?"#10b981":"#ef4444",color:warUsed?"#8d8270":"#fff",fontWeight:700,fontSize:10,cursor:warUsed?"not-allowed":"pointer"}}>{warUsed?(warActive?"⚔️ +5 активен":"✓ Использовано сегодня"):"⚔️ Активировать +5"}</button>
        {warActive&&<button onClick={function(){sv(Object.assign({},c,{warriorBonus:false}))}} style={{padding:"6px 10px",borderRadius:7,border:"1px solid #322d24",background:"#1d1a14",fontSize:9,cursor:"pointer",color:"#a89a82"}}>Снять</button>}
        {warUsed&&<button onClick={function(){sv(Object.assign({},c,{warriorBonus:false,warriorBonusUsed:false}))}} title="Сбросить (новый день)" style={{padding:"6px 8px",borderRadius:7,border:"1px solid #322d24",background:"#1d1a14",fontSize:9,cursor:"pointer",color:"#a89a82"}}>🔄</button>}
      </div>
    </div>);
  }
  if(pf.id==="sensitive"){
    var senActive=c.sensitiveBonus;
    return(<div style={{background:"#1f1330",border:"2px solid #7c3aed28",borderRadius:9,padding:"7px 9px"}}>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10,color:"#7c3aed",marginBottom:4}}>🔮 Хаотический Всплеск</div>
      <div style={{fontSize:8,color:"#9a8f7c",marginBottom:6}}>{senActive?"+1d6 к заклинаниям активен (до провала)":"Добавляет +1d6 к урону заклинаний до первой неудачи"}</div>
      <button onClick={function(){sv(Object.assign({},c,{sensitiveBonus:!senActive}))}} style={{width:"100%",padding:"6px",borderRadius:7,border:"none",background:senActive?"#10b981":"#7c3aed",color:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}>{senActive?"🟢 +1d6 активен — нажать чтобы снять":"🔮 Активировать Хаот. Всплеск"}</button>
    </div>);
  }
  if(pf.id!=="none"&&pf.abilityType==="bonus_attack"){
    var cbActive=c.warriorBonus;
    var cbUsed=c.warriorBonusUsed;
    return(<div style={{background:"#231b08",border:"2px solid #f59e0b28",borderRadius:9,padding:"7px 9px"}}>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10,color:"#f0b352",marginBottom:4}}>⚔️ {pf.abN||"Способность"}</div>
      <div style={{fontSize:8,color:"#9a8f7c",marginBottom:6}}>{pf.abilityDesc||(cbActive?"Активна — следующая атака +5":"Один раз в день: +5 к атаке в одном ходу")}</div>
      <div style={{display:"flex",gap:4}}>
        <button disabled={cbUsed} onClick={function(){sv(Object.assign({},c,{warriorBonus:true,warriorBonusUsed:true}))}} style={{flex:1,padding:"6px",borderRadius:7,border:"none",background:cbUsed?"#322d24":cbActive?"#10b981":"#f59e0b",color:cbUsed?"#8d8270":"#fff",fontWeight:700,fontSize:10,cursor:cbUsed?"not-allowed":"pointer"}}>{cbUsed?(cbActive?"⚔️ +5 активен":"✓ Использовано сегодня"):"⚔️ Активировать +5"}</button>
        {cbActive&&<button onClick={function(){sv(Object.assign({},c,{warriorBonus:false}))}} style={{padding:"6px 10px",borderRadius:7,border:"1px solid #322d24",background:"#1d1a14",fontSize:9,cursor:"pointer",color:"#a89a82"}}>Снять</button>}
        {cbUsed&&<button onClick={function(){sv(Object.assign({},c,{warriorBonus:false,warriorBonusUsed:false}))}} title="Сбросить (новый день)" style={{padding:"6px 8px",borderRadius:7,border:"1px solid #322d24",background:"#1d1a14",fontSize:9,cursor:"pointer",color:"#a89a82"}}>🔄</button>}
      </div>
    </div>);
  }
  if(pf.id!=="none"&&pf.abilityType==="toggle"){
    var stOn=c.customStance;
    return(<div style={{background:"#1f1330",border:"2px solid #a78bfa28",borderRadius:9,padding:"7px 9px"}}>
      <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10,color:"#a78bfa",marginBottom:4}}>🔮 {pf.abN||"Способность"}</div>
      <div style={{fontSize:8,color:"#9a8f7c",marginBottom:6}}>{pf.abilityDesc||"Переключатель режима"}{stOn?" — сейчас активно":""}</div>
      <button onClick={function(){sv(Object.assign({},c,{customStance:!stOn}))}} style={{width:"100%",padding:"6px",borderRadius:7,border:"none",background:stOn?"#10b981":"#7c3aed",color:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}>{stOn?"🟢 Активно — нажми чтобы выключить":"🔮 Включить"}</button>
    </div>);
  }
  return null;
})()}

<div style={{display:"flex",gap:3}}>
<button onClick={function(){var d=r1(6);var z=ZONES[d-1];sZone(z.name);pr.addLog({who:c.name||"???",type:"zone",label:z.e+" "+z.name+" ×"+z.mult,detail:"1d6="+d,total:d});oR({label:"🎯 Зона",d10:d,parts:[],total:d,subtext:z.e+" "+z.name+" ×"+z.mult+(z.ignoreArmor?" (игнор брони)":"")})}} style={{flex:1,padding:7,borderRadius:7,border:"2px solid #f59e0b28",background:"#231b08",cursor:"pointer",fontWeight:700,fontSize:10,color:"#f0b352"}}>🎯 Зона</button>
<button onClick={function(){var R=rollHit();var d=R.d;var dv=fs.DEX||0;var dg=es.Dodge||0;var t=d+dv+dg;pr.addLog({who:c.name||"???",type:"dodge",label:"🛡️ Уклонение"+(R.crit?" 🌟":R.fumble?" 💀":""),detail:"🎲"+d+" + DEX("+dv+") + Dodge("+dg+") = "+t,total:t});oR({label:"🛡️ Уклонение",d10:d,crit:R.crit,fumble:R.fumble,parts:[{label:"DEX",value:dv},{label:"Dodge",value:dg}],total:t})}} style={{flex:1,padding:7,borderRadius:7,border:"2px solid #10b98128",background:"#0e2018",cursor:"pointer",fontWeight:700,fontSize:10,color:"#34d399"}}>🛡️ Уклон.</button>
<button onClick={function(){var R=rollHit();var d=R.d;var wv=fs.WILL||0;var mr=es["Magic Resist"]||0;var t=d+wv+mr;pr.addLog({who:c.name||"???",type:"magic",label:"✨ Сопр. чуду"+(R.crit?" 🌟":R.fumble?" 💀":""),detail:"🎲"+d+" + WILL("+wv+") + Miracle Resist("+mr+") = "+t,total:t});oR({label:"✨ Сопротивление чуду",d10:d,crit:R.crit,fumble:R.fumble,parts:[{label:"WILL",value:wv},{label:"M.Resist",value:mr}],total:t})}} style={{flex:1,padding:7,borderRadius:7,border:"2px solid #7c3aed28",background:"#1f1330",cursor:"pointer",fontWeight:700,fontSize:10,color:"#a78bfa"}}>✨ Сопр.</button>
</div>

{/* Чувствительный */}
{pf.id==="sensitive"&&<div style={{display:"flex",flexDirection:"column",gap:3}}>
<input value={mInt} onChange={function(e){sMInt(e.target.value)}} placeholder="Опиши чудо: «Создал фаербол и метнул…»" style={Object.assign({},S.inp,{fontSize:9,padding:5,border:"2px solid #7c3aed28"})}/>
<button onClick={function(){
  if(curW<=0){alert("Нет WILL!");return}
  if(tgtNpc&&tgtId&&pr.savePendingAttack){
    /* Контест против NPC: чудо vs Miracle Resist (как атака) */
    sv(Object.assign({},c,{curWill:curW-1}));
    var R=rollHit();var dd=R.d;var wv=fs.WILL||0;var msk=es.Spellcasting||0;var hitC=dd+wv+msk;
    var cbon=r1(6)+(c.sensitiveBonus?r1(6):0);
    pr.savePendingAttack({id:"atk_"+Date.now(),fromPlayer:true,magic:true,attackerId:c._fbId,attackerName:c.name||"???",npcId:tgtId,npcName:tgtNpc.name,hitRoll:hitC,atkD:dd,atkREF:wv,atkSkill:msk,atkSkillName:"Miracle",atkBonus:0,weaponName:mInt||"Чудо",dmgDice:"3d12",dmgType:"Д",dmgBonus:cbon,zone:selZone,castIntent:mInt||"",status:"pending_dodge",ts:Date.now()});
    pr.addLog({who:c.name||"???",type:"magic",label:"✨ "+(mInt||"Чудо")+" → "+tgtNpc.name+" (бросок чуда)"+(R.crit?" 🌟":R.fumble?" 💀":""),detail:"🎲"+dd+" + WILL("+wv+") + Miracle("+msk+") = "+hitC,total:hitC});
    oR({label:mInt||"✨ Чудо",d10:dd,crit:R.crit,fumble:R.fumble,parts:[{label:"WILL",value:wv},{label:"Miracle",value:msk}],total:hitC,subtext:(mInt?"«"+mInt+"»\n":"")+"−1 WILL\n→ "+tgtNpc.name+" сопротивляется Miracle Resist…"});
    sMInt("");
    return;
  }
  sv(Object.assign({},c,{curWill:curW-1}));
  var dmg=rN(3,12);var dT=sm(dmg);var bon=rN(1,6);var bT=sm(bon);var extraD6=c.sensitiveBonus?r1(6):0;var ft=dT+bT+extraD6;
  var hit=r1(6);var ok=hit<=3;var sub="";
  if(ok){
    /* Попадание — урон по выбранному NPC */
    if(tgtNpc&&tgtId&&saveSpawned){
      applyDmgToNpc(tgtNpc,ft,"Д",selZone,saveSpawned,spawned,tgtId,pr.addLog,c.name||"???",pr.onNpcDeath,"🔮 Заклинание",pr.saveNpcHit);
    }
    sub=(mInt?"«"+mInt+"»\n":"")+"✨ ПОПАД! "+ft+"\n−1 WILL"+(tgtNpc?" → "+tgtNpc.name:" (нет цели)");
    pr.addLog({who:c.name||"???",type:"magic",label:"✨ "+(mInt||"Чудо")+" — ПОПАД!"+(tgtNpc?" → "+tgtNpc.name:""),detail:"3d12+1d6="+ft,total:ft});
  } else {
    var cat2=r1(2);
    if(cat2===1){
      /* Обратный — урон себе, сбросить бонус */
      sv(Object.assign({},c,{curHp:Math.max(0,curHp-ft),curWill:Math.max(0,curW-1),sensitiveBonus:false}));
      sub="💥 ОБРАТНЫЙ! "+ft+" урона СЕБЕ\n−1 WILL";
      pr.addLog({who:c.name||"???",type:"magic_fail",label:"💥 "+(mInt||"Чудо")+" — Обратный! Урон себе: "+ft,detail:"",total:ft});
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
  oR({label:mInt||"🔮 Чудо",d10:hit,parts:[{label:"3d12",value:dT},{label:"1d6",value:bT}],total:ft,subtext:sub});
  sMInt("");
}} style={{padding:7,borderRadius:7,border:"2px solid #7c3aed20",background:"#1f1330",cursor:"pointer",fontWeight:700,fontSize:10,color:"#a78bfa"}}>{"✨ Сотворить чудо (−1W) "+(curW<=0?"⛔":"")+(tgtNpc?" → "+tgtNpc.name:"")}</button></div>}

{/* Оружие */}
<div style={{background:"#262219",border:"2px solid #f59e0b18",borderRadius:9,padding:"7px 8px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><label style={S.lb}>⚔️ Оружие</label><button onClick={function(){sSA(!sa)}} style={{fontSize:9,background:"#0e1a2b",border:"1px solid #3b82f640",borderRadius:5,padding:"2px 8px",cursor:"pointer",color:"#60a5fa",fontWeight:700}}>{sa?"✕ Закрыть":"➕ Своё оружие"}</button></div>
<ShopPicker color="#3b82f6" items={(pr.shop||[]).filter(function(i){return i.cat==="weapon"})} subOf={function(it){return it.wtype}} suborder={["Battle","Simple","Guns","Archery"]} sublabels={{Battle:"⚔️ Боевое оружие",Simple:"🗡️ Простое оружие",Guns:"🔫 Огнестрел",Archery:"🏹 Лук"}} sub={function(it){var h=it.hands===2?"двуруч.":it.hands===1.5?"полуторн.":"одноруч.";return it.wtype+" · "+it.dmgDice+(it.bonus?"+"+it.bonus:"")+" · "+it.dmgType+" · "+h}} onPick={function(it){var newW={id:uid(),name:it.name,type:it.wtype,dmgType:it.dmgType,bonus:it.bonus||0,dmgDice:it.dmgDice,hands:it.hands};if(it.hands===1.5){newW.dmgDice2h=it.dmgDice2h;newW.bonus2h=it.bonus2h||0;}sv(Object.assign({},c,{weapons:(c.weapons||[]).concat([newW])}))}}/>
{sa&&<div style={{background:"#262219",border:"1px solid #322d24",borderRadius:8,padding:6,marginBottom:4,display:"flex",flexDirection:"column",gap:3}}>
<input style={S.inp} value={wn} onChange={function(e){sWN(e.target.value)}} placeholder="Название"/>
<div style={{display:"flex",gap:3}}>
<select value={wt} onChange={function(e){sWT(e.target.value)}} style={Object.assign({},S.inp,{flex:1,fontSize:9,padding:3})}>{WT.map(function(t){return <option key={t} value={t}>{t}</option>})}</select>
<select value={wdt} onChange={function(e){sWDT(e.target.value)}} style={Object.assign({},S.inp,{width:38,fontSize:9,padding:3})}>{DT.map(function(t){return <option key={t} value={t}>{t}</option>})}</select>
</div>
<div style={{display:"flex",gap:3}}>{[1,1.5,2].map(function(h){return<button key={h} onClick={function(){sWH(h)}} style={{flex:1,padding:"3px 0",borderRadius:5,border:wh===h?"2px solid #3b82f6":"1px solid #322d24",background:wh===h?"#0e1a2b":"#1d1a14",fontSize:8,fontWeight:wh===h?700:400,cursor:"pointer",color:wh===h?"#60a5fa":"#b3a890"}}>{h===1?"Одноручное":h===1.5?"Полуторное":"Двуручное"}</button>})}</div>
{wh!==1.5
?<div style={{display:"flex",gap:3}}><input style={Object.assign({},S.inp,{flex:1,fontSize:9,padding:3})} value={wdi} onChange={function(e){sWDI(e.target.value)}} placeholder="1d6"/><input style={Object.assign({},S.inp,{width:40,fontSize:9,padding:3})} type="number" value={wb} onChange={function(e){sWB(parseInt(e.target.value)||0)}} placeholder="Бнс"/></div>
:<div style={{display:"flex",flexDirection:"column",gap:3}}>
<div style={{display:"flex",gap:3,alignItems:"center"}}><span style={{fontSize:8,color:"#a89a82",width:42}}>1 рука:</span><input style={Object.assign({},S.inp,{flex:1,fontSize:9,padding:3})} value={wdi} onChange={function(e){sWDI(e.target.value)}} placeholder="1d8"/><input style={Object.assign({},S.inp,{width:36,fontSize:9,padding:3})} type="number" value={wb} onChange={function(e){sWB(parseInt(e.target.value)||0)}} placeholder="Бнс"/></div>
<div style={{display:"flex",gap:3,alignItems:"center"}}><span style={{fontSize:8,color:"#a89a82",width:42}}>2 руки:</span><input style={Object.assign({},S.inp,{flex:1,fontSize:9,padding:3})} value={wdi2} onChange={function(e){sWDI2(e.target.value)}} placeholder="2d8"/><input style={Object.assign({},S.inp,{width:36,fontSize:9,padding:3})} type="number" value={wb2} onChange={function(e){sWB2(parseInt(e.target.value)||0)}} placeholder="Бнс"/></div>
</div>}
<button onClick={function(){if(!wn.trim())return;var newW={id:uid(),name:wn.trim(),type:wt,dmgType:wdt,bonus:wb,dmgDice:wdi,hands:wh};if(wh===1.5){newW.dmgDice2h=wdi2;newW.bonus2h=wb2;}sv(Object.assign({},c,{weapons:(c.weapons||[]).concat([newW])}));sWN("");sSA(false);sWH(1);sWDI("1d6");sWDI2("2d6");sWB2(0);}} style={{padding:5,borderRadius:5,border:"none",background:"#10b981",color:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}>Добавить</button>
</div>}
{(c.weapons||[]).length===0&&!sa&&<div style={{textAlign:"center",padding:"10px 6px",color:"#a89a82",fontStyle:"italic",fontSize:9,border:"1px dashed #322d24",borderRadius:7}}>Нет оружия — нажми «+ Оружие», чтобы добавить</div>}
{(c.weapons||[]).map(function(w){var sk=WS[w.type]||"Simple Weapon";var isEq=c.equippedWeapon===w.id;var curMode=c.weaponMode||"1h";var activeDice=(w.hands===1.5&&curMode==="2h")?(w.dmgDice2h||w.dmgDice):w.dmgDice;var activeBon=(w.hands===1.5&&curMode==="2h")?(w.bonus2h!==undefined?w.bonus2h:w.bonus||0):(w.bonus||0);var handsLabel=w.hands===2?"двуручное":w.hands===1.5?"полуторное":"одноручное";var handsClr=w.hands===2?"#f87171":w.hands===1.5?"#f0b352":"#60a5fa";var handsBg=w.hands===2?"#311717":w.hands===1.5?"#231b08":"#0e1a2b";
return(<div key={w.id} style={{background:isEq?"#0e2018":"#1d1a14",border:"1px solid "+(isEq?"#10b98130":"#322d24"),borderRadius:8,padding:"5px 7px",marginBottom:3}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
<div style={{flex:1}}><span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:11}}>{w.name}</span><span style={{fontSize:7,color:"#a89a82",marginLeft:4}}>{w.type+" · "+activeDice+" · "+w.dmgType}</span><span style={{fontSize:7,marginLeft:3,padding:"1px 4px",borderRadius:3,background:handsBg,color:handsClr}}>{handsLabel}</span></div>
<div style={{display:"flex",gap:3,flexShrink:0}}>
<button onClick={function(){var newEq=isEq?null:w.id;var upd={equippedWeapon:newEq};if(w.hands===2&&c.equippedShield)upd.equippedShield=null;sv(Object.assign({},c,upd));}} style={{fontSize:7,padding:"2px 6px",borderRadius:3,border:isEq?"1px solid #10b98140":"1px solid #322d24",background:isEq?"#123424":"#1d1a14",cursor:"pointer",color:isEq?"#34d399":"#b3a890",fontWeight:700}}>{isEq?"✓ Снаряжено":"Снарядить"}</button>
{!isEq&&<button onClick={function(){sv(Object.assign({},c,{weapons:(c.weapons||[]).filter(function(x){return x.id!==w.id})}))}} style={{background:"none",border:"none",color:"#ef4444",fontSize:10,cursor:"pointer"}}>✕</button>}{isEq&&<span title="Сначала снимите" style={{fontSize:10,color:"#3a3429",cursor:"not-allowed",padding:"0 4px"}}>✕</span>}
</div></div>
{w.hands===1.5&&<div style={{display:"flex",gap:3,marginBottom:3}}>
<button onClick={function(){sv(Object.assign({},c,{weaponMode:"1h"}))}} style={{flex:1,padding:"2px 0",borderRadius:4,border:curMode==="1h"?"2px solid #3b82f6":"1px solid #322d24",background:curMode==="1h"?"#0e1a2b":"#1d1a14",fontSize:8,fontWeight:curMode==="1h"?700:400,cursor:"pointer",color:curMode==="1h"?"#60a5fa":"#b3a890"}}>1 рука · {w.dmgDice}{w.bonus?" +"+w.bonus:""}</button>
<button onClick={function(){var upd={weaponMode:"2h"};if(c.equippedShield)upd.equippedShield=null;sv(Object.assign({},c,upd));}} style={{flex:1,padding:"2px 0",borderRadius:4,border:curMode==="2h"?"2px solid #3b82f6":"1px solid #322d24",background:curMode==="2h"?"#0e1a2b":"#1d1a14",fontSize:8,fontWeight:curMode==="2h"?700:400,cursor:"pointer",color:curMode==="2h"?"#60a5fa":"#b3a890"}}>2 руки · {w.dmgDice2h||w.dmgDice}{w.bonus2h!==undefined?" +"+w.bonus2h:""}</button>
</div>}
<div style={{display:"flex",gap:3}}>
<button onClick={function(){var R=rollHit();var d=R.d;var rv=fs.REF||0;var sv2=es[sk]||0;var warBon=(c.warriorBonus&&(pf.id==="warrior"||pf.abilityType==="bonus_attack"))?5:0;if(warBon)sv(Object.assign({},c,{warriorBonus:false}));var t=d+rv+sv2+(w.bonus||0)+warBon;pr.addLog({who:c.name||"???",type:"hit",label:"🎯 "+w.name+(tgtNpc?" → "+tgtNpc.name:"")+(warBon?" ⚔️+5":"")+(R.crit?" 🌟КРИТ":R.fumble?" 💀ПРОВАЛ":""),detail:"🎲"+d+" + REF("+rv+") + "+sk+"("+sv2+") + бонус("+(w.bonus||0)+") = "+t,total:t});
if(tgtNpc&&tgtId&&pr.savePendingAttack){pr.savePendingAttack({id:"atk_"+Date.now(),fromPlayer:true,attackerId:c._fbId,attackerName:c.name||"???",npcId:tgtId,npcName:tgtNpc.name,hitRoll:t,atkD:d,atkREF:rv,atkSkill:sv2,atkSkillName:sk,atkBonus:w.bonus||0,weaponName:w.name,dmgDice:activeDice||"1d6",dmgType:w.dmgType||"Р",dmgBonus:activeBon,zone:selZone,status:"pending_dodge",ts:Date.now()});}
else{oR({label:w.name+" Попад.",d10:d,crit:R.crit,fumble:R.fumble,parts:[{label:"REF",value:rv},{label:sk,value:sv2},{label:"Бнс",value:w.bonus||0}],total:t});}}}
 style={{flex:1,padding:4,borderRadius:5,border:"1px solid #3b82f620",background:"#0e1a2b",cursor:"pointer",fontWeight:700,fontSize:9,color:"#60a5fa",textAlign:"center"}}>{"🎯"+(tgtNpc?" →"+tgtNpc.name.slice(0,8):"")}</button>
<button onClick={function(){
  var m=activeDice.match(/(\d+)d(\d+)/);if(!m)return;
  var dice=rN(parseInt(m[1]),parseInt(m[2]));
  var warDmgBon=(c.warriorBonus&&(pf.id==="warrior"||pf.abilityType==="bonus_attack"))?5:0;
  if(warDmgBon)sv(Object.assign({},c,{warriorBonus:false}));
  var rawDmg=sm(dice)+activeBon+warDmgBon;
  if(tgtNpc&&tgtId&&saveSpawned){
    applyDmgToNpc(tgtNpc,rawDmg,w.dmgType,selZone,saveSpawned,spawned,tgtId,pr.addLog,c.name||"???",pr.onNpcDeath,w.name,pr.saveNpcHit);
  } else {
    pr.addLog({who:c.name||"???",type:"dmg",label:"💥 "+w.name+" ("+w.dmgType+")"+(warDmgBon?" ⚔️+5":""),detail:activeDice+"["+dice.join(",")+"]"+(w.bonus?("+бнс("+w.bonus+")"):"")+(warDmgBon?"+⚔️5":"")+" = "+rawDmg,total:rawDmg});
  }
  oR({label:w.name+" 💥 Урон",d10:null,parts:[{label:activeDice,value:sm(dice)},{label:"Бнс",value:activeBon+warDmgBon}],total:rawDmg,subtext:"Тип: "+w.dmgType+(warDmgBon?" ⚔️+5":"")+(tgtNpc?" → "+tgtNpc.name+"\nЗона: "+selZone:" (нет цели)")});
}} style={{flex:1,padding:4,borderRadius:5,border:"1px solid #ef444420",background:"#2a1414",cursor:"pointer",fontWeight:700,fontSize:9,color:"#dc2626",textAlign:"center"}}>{"💥"+(tgtNpc?" →"+tgtNpc.name.slice(0,8):"")}</button>
</div></div>)})}
</div>

<div><label style={S.lb}>📜 Лог</label><div style={{maxHeight:120,overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>{visibleLogs.length===0&&<div style={{textAlign:"center",padding:8,color:"#a89a82",fontSize:9}}>Пусто</div>}{visibleLogs.map(function(l,i){return <div key={i} style={{background:"#1d1a14",border:"1px solid #322d2420",borderRadius:4,padding:"3px 5px",fontSize:8}}><b>{(l.who||"")}: {l.label}</b>{l.detail&&<div style={{fontSize:7,color:"#9a8f7c"}}>{l.detail}</div>}{l.total>0&&<div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:12}}>{"= "+l.total}</div>}</div>})}</div></div>
</div>)}

/* ── InvTab ── */

export default CombatTab;
