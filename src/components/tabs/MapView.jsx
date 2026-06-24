import React, { useState } from 'react';
import { ref } from '../../firebase';
import { S } from '../../styles/ui';

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
if(!img)return <div style={{textAlign:"center",padding:"30px 10px"}}><div style={{fontSize:40}}>🗺️</div><div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:14}}>Карта Аэтернии</div>{isGM?<label style={{display:"inline-block",marginTop:10,padding:"10px 20px",borderRadius:8,border:"2px dashed #10b981",background:"#0e2018",fontWeight:700,fontSize:12,color:"#34d399",cursor:"pointer"}}>📁 Загрузить карту<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){if(sMD)sMD(Object.assign({},md,{image:ev.target.result}))};r.readAsDataURL(f)}}/></label>:<div style={{fontSize:10,color:"#a89a82",marginTop:8}}>Мастер ещё не загрузил карту</div>}</div>;
return <div style={{display:"flex",flexDirection:"column",gap:6}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
  <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13}}>🗺️ Карта</div>
  <div style={{display:"flex",alignItems:"center",gap:4}}>
    <button onClick={function(){sZoom(function(z){return Math.max(0.25,+(z-0.25).toFixed(2))})}} style={{width:24,height:24,borderRadius:5,border:"1px solid #322d24",background:"#1d1a14",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
    <span style={{fontSize:9,fontWeight:700,minWidth:32,textAlign:"center"}}>{Math.round(zoom*100)+"%"}</span>
    <button onClick={function(){sZoom(function(z){return Math.min(5,+(z+0.25).toFixed(2))})}} style={{width:24,height:24,borderRadius:5,border:"1px solid #322d24",background:"#1d1a14",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
    <button onClick={function(){sZoom(1)}} style={{padding:"2px 6px",borderRadius:5,border:"1px solid #322d24",background:"#1d1a14",fontSize:8,cursor:"pointer",color:"#a89a82"}}>1:1</button>
  </div>
</div>
<div style={{overflow:"auto",borderRadius:10,border:"2px solid #322d24",background:"#1a1a2e",maxHeight:500,touchAction:"none",userSelect:"none"}} onMouseMove={onMv} onMouseUp={endDr} onMouseLeave={endDr} onTouchMove={onMv} onTouchEnd={endDr}>
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
<div style={{display:"flex",flexWrap:"wrap",gap:3}}>{allT.map(function(t){var sz=t.size||6;return <div key={t.id} style={{display:"flex",alignItems:"center",gap:3,background:"#1d1a14",border:"1px solid #322d24",borderRadius:5,padding:"2px 5px",fontSize:8}}><div style={{width:8,height:8,borderRadius:"50%",background:t.color||"#3b82f6",border:"1px solid #322d24",flexShrink:0}}/><span style={{fontWeight:600}}>{t.name}</span>{(isGM||t.charId===cId)&&<span style={{display:"flex",gap:1,alignItems:"center"}}><button onClick={function(){saveTk(allT.map(function(x){return x.id===t.id?Object.assign({},x,{size:Math.max(2,sz-1)}):x}))}} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#a89a82",lineHeight:1}}>−</button><span style={{fontSize:7,minWidth:16,textAlign:"center"}}>{sz}px</span><button onClick={function(){saveTk(allT.map(function(x){return x.id===t.id?Object.assign({},x,{size:Math.min(60,sz+1)}):x}))}} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#a89a82",lineHeight:1}}>+</button></span>}{isGM&&<button onClick={function(){saveTk(allT.filter(function(x){return x.id!==t.id}))}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:8}}>✕</button>}</div>})}</div>
{!isGM&&cId&&!allT.find(function(t){return t.charId===cId})&&<button onClick={function(){var me=chars.find(function(c2){return(c2._fbId||c2.id)===cId});saveTk(allT.concat([{id:"ch-"+cId,charId:cId,name:me?me.name:"?",x:50,y:50,color:"#3b82f6",size:6,type:"player"}]))}} style={{padding:"6px 12px",borderRadius:7,border:"2px solid #3b82f630",background:"#0e1a2b",fontWeight:700,fontSize:10,color:"#60a5fa",cursor:"pointer",width:"100%"}}>📍 Создать мой жетон на карте</button>}
{isGM&&<div style={{display:"flex",gap:3}}><button onClick={function(){sSN(!sn)}} style={{flex:1,padding:6,borderRadius:6,border:"2px solid #ef444420",background:"#2a1414",fontWeight:700,fontSize:9,color:"#ef4444",cursor:"pointer"}}>{sn?"✕":"👹 + NPC"}</button><label style={{padding:"6px 10px",borderRadius:6,border:"2px solid #10b98120",background:"#0e2018",fontWeight:700,fontSize:9,color:"#34d399",cursor:"pointer",textAlign:"center"}}>🖼️ Сменить<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){if(sMD)sMD(Object.assign({},md,{image:ev.target.result}))};r.readAsDataURL(f)}}/></label></div>}
{isGM&&sn&&<div style={{background:"#2a1414",border:"1px solid #ef444420",borderRadius:7,padding:6,display:"flex",flexDirection:"column",gap:4}}><input style={S.inp} value={nn} onChange={function(e){sNN(e.target.value)}} placeholder="Имя токена"/>
<div style={{display:"flex",gap:2,flexWrap:"wrap"}}>{TOKEN_COLORS.map(function(cl){return <button key={cl} onClick={function(){sNC(cl)}} style={{width:18,height:18,borderRadius:"50%",background:cl,border:nc===cl?"3px solid #374151":"1.5px solid #ddd",boxShadow:nc===cl?"0 0 0 2px "+cl:"none",cursor:"pointer",flexShrink:0}}/>})}</div>
<div style={{display:"flex",gap:3,alignItems:"center"}}><label style={{fontSize:8,fontWeight:700,color:"#b3a890",whiteSpace:"nowrap"}}>Размер (px):</label><input style={Object.assign({},S.inp,{width:50,fontSize:9,padding:2,textAlign:"center"})} type="number" min={2} max={60} value={ns} onChange={function(e){sNS(parseInt(e.target.value)||4)}}/><span style={{fontSize:8,color:"#a89a82"}}>мин 2, макс 60</span></div>
<button onClick={function(){if(!nn.trim())return;saveTk(allT.concat([{id:"npc-"+Date.now(),name:nn.trim(),x:50,y:50,color:nc,size:ns,type:"npc"}]));sNN("");sSN(false)}} style={{padding:5,borderRadius:5,border:"none",background:"#ef4444",color:"#fff",fontWeight:700,fontSize:9,cursor:"pointer"}}>Добавить токен</button></div>}
</div>}


export default MapView;
