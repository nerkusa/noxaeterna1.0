import React, { useState } from 'react';
import { LORE_CH } from '../../data/lore';
import { S } from '../../styles/ui';
import GameView from '../GameView';
import MapView from '../tabs/MapView';

function LoreEditor(pr){var lore=pr.lore||{};var sLore=pr.saveLore;var _s=useState(null);var eid=_s[0];var sE=_s[1];var ch=eid?LORE_CH.find(function(x){return x.id===eid}):null;
if(ch&&ch.id==="map")return <div style={{display:"flex",flexDirection:"column",gap:8}}><button onClick={function(){sE(null)}} style={{alignSelf:"flex-start",padding:"4px 10px",borderRadius:6,border:"2px solid #e8e0d4",background:"#fefdfb",fontWeight:700,fontSize:10,cursor:"pointer"}}>← Назад</button><MapView mapData={pr.mapData} saveMap={pr.saveMap} characters={pr.characters} isGM={true}/></div>;
if(ch){return(<div style={{display:"flex",flexDirection:"column",gap:8}}><button onClick={function(){sE(null)}} style={{alignSelf:"flex-start",padding:"4px 10px",borderRadius:6,border:"2px solid #e8e0d4",background:"#fefdfb",fontWeight:700,fontSize:10,cursor:"pointer"}}>← Назад</button><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:20}}>{ch.icon}</span><span style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:14,color:ch.color}}>{ch.title}</span></div><textarea style={Object.assign({},S.inp,{minHeight:300,resize:"vertical",fontSize:10,padding:8,lineHeight:1.5})} value={lore[ch.id]||""} onChange={function(e){var n=Object.assign({},lore);n[ch.id]=e.target.value;sLore(n)}}/></div>)}
return(<div style={{display:"flex",flexDirection:"column",gap:5}}><div style={{textAlign:"center",padding:"6px 0"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:15,color:"#7c3aed"}}>📚 Редактор</div></div>{LORE_CH.map(function(ch){var len=(lore[ch.id]||"").length;return <button key={ch.id} onClick={function(){sE(ch.id)}} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 9px",borderRadius:8,border:"2px solid "+ch.color+"18",background:len>0?ch.color+"08":"#fefdfb",cursor:"pointer",textAlign:"left"}}><div style={{width:26,height:26,borderRadius:5,background:ch.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{ch.icon}</div><div style={{flex:1}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:10}}>{ch.title}</div><div style={{fontSize:7,color:len>0?"#10b981":"#8b7e6a"}}>{ch.id==="map"?"🗺️ Карта мира":len>0?"✓ "+len+" симв.":"Пусто"}</div></div><span style={{color:"#7c3aed"}}>✏️</span></button>})}</div>)}

/* ── GameView ── */

export default LoreEditor;
