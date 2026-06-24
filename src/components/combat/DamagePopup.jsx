import React from 'react';
import NpcDeathPopup from './NpcDeathPopup';

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

export default DamagePopup;
