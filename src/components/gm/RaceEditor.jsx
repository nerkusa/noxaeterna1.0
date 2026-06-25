import React, { useState } from 'react';
import { RACES } from '../../data/races';
import { SD } from '../../data/stats';

const backBtn = { padding: '5px 12px', borderRadius: 6, border: '2px solid #322d24', background: '#1d1a14', color: '#ece5d8', fontWeight: 700, fontSize: 11, cursor: 'pointer' };
const inp = { width: '100%', padding: '6px 8px', border: '2px solid #322d24', borderRadius: 6, fontSize: 12, fontFamily: "'Nunito',sans-serif", background: '#262219', color: '#ece5d8', outline: 'none' };
const lbl = { display: 'block', fontSize: 8, fontWeight: 700, color: '#a89a82', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 };

function genId() { return 'r_' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36); }

function normalize(races) {
  const base = (Array.isArray(races) && races.length) ? races.slice() : RACES.slice();
  // guarantee the "— Нет —" entry stays first
  if (!base.find(r => r.id === 'none')) base.unshift(RACES[0]);
  return base;
}

export default function RaceEditor(pr) {
  const saveRaces = pr.saveRaces;
  const races = normalize(pr.races);
  const [openId, setOpenId] = useState(null);

  const persist = (arr) => saveRaces(arr);
  const updateRace = (id, patch) => persist(races.map(r => r.id === id ? Object.assign({}, r, patch) : r));
  const setStat = (id, key, delta) => {
    persist(races.map(r => {
      if (r.id !== id) return r;
      const st = Object.assign({}, r.st);
      const v = Math.max(-3, Math.min(3, (st[key] || 0) + delta));
      if (v === 0) delete st[key]; else st[key] = v;
      return Object.assign({}, r, { st: st });
    }));
  };
  const addRace = () => {
    const nr = { id: genId(), name: 'Новая раса', st: {}, sk: {}, sp: null, fp: false, bsp: false, desc: '' };
    persist(races.concat([nr]));
    setOpenId(nr.id);
  };
  const delRace = (id) => {
    if (!window.confirm('Удалить расу?')) return;
    persist(races.filter(r => r.id !== id));
    setOpenId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button onClick={pr.onBack} style={Object.assign({}, backBtn, { alignSelf: 'flex-start' })}>← Назад</button>
      <div style={{ textAlign: 'center', padding: '2px 0' }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 16, color: '#34d399' }}>🧬 Расы</div>
        <div style={{ fontSize: 9, color: '#a89a82' }}>Меняй названия, бонусы статов, добавляй и удаляй расы</div>
      </div>
      <button onClick={addRace} style={{ padding: 10, borderRadius: 9, border: '2px dashed #10b98160', background: '#0e2018', color: '#34d399', fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>➕ Добавить расу</button>

      {races.map(function (r) {
        const isNone = r.id === 'none';
        const open = openId === r.id;
        const mods = Object.entries(r.st || {});
        return (
          <div key={r.id} style={{ border: '2px solid #322d24', borderRadius: 9, background: '#1d1a14', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 9px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12, color: '#ece5d8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                <div style={{ fontSize: 8, color: '#a89a82' }}>{mods.length ? mods.map(m => m[0] + ' ' + (m[1] > 0 ? '+' + m[1] : m[1])).join(' · ') : 'без бонусов'}</div>
              </div>
              {!isNone && <button onClick={function () { delRace(r.id); }} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 13, cursor: 'pointer' }}>🗑</button>}
              <button onClick={function () { setOpenId(open ? null : r.id); }} style={{ padding: '4px 9px', borderRadius: 6, border: '1px solid #10b98140', background: '#0e2018', color: '#34d399', fontWeight: 700, fontSize: 10, cursor: 'pointer' }}>{open ? '✕' : '✏️'}</button>
            </div>

            {open && !isNone && (
              <div style={{ padding: '0 9px 9px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <label style={lbl}>Название</label>
                  <input value={r.name} onChange={function (e) { updateRace(r.id, { name: e.target.value }); }} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Бонусы характеристик</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(92px,1fr))', gap: 4 }}>
                    {SD.map(function (s) {
                      const v = (r.st || {})[s.key] || 0;
                      const clr = v > 0 ? '#34d399' : v < 0 ? '#f87171' : '#8d8270';
                      return (
                        <div key={s.key} style={{ background: s.color + '12', border: '1px solid ' + s.color + '22', borderRadius: 7, padding: '3px 2px', textAlign: 'center' }}>
                          <div style={{ fontSize: 8, fontWeight: 700, color: s.color }}>{s.emoji + ' ' + s.key}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 1 }}>
                            <button onClick={function () { setStat(r.id, s.key, -1); }} style={{ width: 18, height: 18, borderRadius: 4, border: '1px solid #322d24', background: '#262219', color: '#a89a82', fontSize: 10, cursor: 'pointer', padding: 0 }}>−</button>
                            <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 13, minWidth: 18, color: clr }}>{v > 0 ? '+' + v : v}</span>
                            <button onClick={function () { setStat(r.id, s.key, 1); }} style={{ width: 18, height: 18, borderRadius: 4, border: '1px solid #322d24', background: '#262219', color: '#a89a82', fontSize: 10, cursor: 'pointer', padding: 0 }}>+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={lbl}>Особенность (необязательно)</label>
                  <input value={r.sp || ''} placeholder="напр. Breath 1d8, Слепота…" onChange={function (e) { updateRace(r.id, { sp: e.target.value || null }); }} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Описание (показывается игрокам)</label>
                  <textarea value={r.desc || ''} onChange={function (e) { updateRace(r.id, { desc: e.target.value }); }} style={Object.assign({}, inp, { minHeight: 50, resize: 'vertical', fontSize: 11 })} />
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div style={{ fontSize: 9, color: '#a89a82', textAlign: 'center', padding: '4px 8px', fontStyle: 'italic' }}>
        Изменения сразу видны игрокам в выборе расы. «— Нет —» удалить нельзя.
      </div>
    </div>
  );
}
