import React, { useState } from 'react';
import { TRAITS } from '../../data/traits';
import { SD, SKD } from '../../data/stats';

const backBtn = { padding: '5px 12px', borderRadius: 6, border: '2px solid #322d24', background: '#1d1a14', color: '#ece5d8', fontWeight: 700, fontSize: 11, cursor: 'pointer' };
const inp = { width: '100%', padding: '6px 8px', border: '2px solid #322d24', borderRadius: 6, fontSize: 12, fontFamily: "'Nunito',sans-serif", background: '#262219', color: '#ece5d8', outline: 'none' };
const lbl = { display: 'block', fontSize: 8, fontWeight: 700, color: '#a89a82', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 };

const CATS = [
  { id: 'positive', name: 'Положительная', color: '#34d399' },
  { id: 'negative', name: 'Отрицательная', color: '#f87171' },
  { id: 'mixed', name: 'Смешанная', color: '#f0b352' },
];
const ALL_SKILLS = Object.values(SKD).flat().map(function (s) { return s.name; });

function genId() { return 'tr_' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36); }
function catColor(id) { return (CATS.find(function (c) { return c.id === id; }) || CATS[0]).color; }

function normalize(traits) { return (Array.isArray(traits) && traits.length) ? traits.slice() : TRAITS.slice(); }

function effectLabel(e) {
  if (e.type === 'stat_bonus') return (e.stat || '?') + ' ' + (e.amount > 0 ? '+' + e.amount : e.amount || 0);
  if (e.type === 'skill_bonus') return (e.skill || '?') + ' ' + (e.amount > 0 ? '+' + e.amount : e.amount || 0);
  if (e.type === 'hp_flat') return 'HP ' + (e.amount > 0 ? '+' + e.amount : e.amount || 0);
  return '—';
}

export default function TraitEditor(pr) {
  const saveTraits = pr.saveTraits;
  const traits = normalize(pr.traits);
  const [openId, setOpenId] = useState(null);

  const persist = (arr) => saveTraits(arr);
  const updateTrait = (id, patch) => persist(traits.map(t => t.id === id ? Object.assign({}, t, patch) : t));
  const delTrait = (id) => { if (!window.confirm('Удалить черту?')) return; persist(traits.filter(t => t.id !== id)); setOpenId(null); };
  const addTrait = () => {
    const nt = { id: genId(), name: 'Новая черта', category: 'positive', desc: '', effects: [] };
    persist(traits.concat([nt]));
    setOpenId(nt.id);
  };
  const addEffect = (id) => {
    persist(traits.map(x => x.id === id ? Object.assign({}, x, { effects: (x.effects || []).concat([{ type: 'skill_bonus', skill: ALL_SKILLS[0], amount: 1 }]) }) : x));
  };
  const updEffect = (id, idx, patch) => {
    persist(traits.map(x => {
      if (x.id !== id) return x;
      const effs = (x.effects || []).slice();
      effs[idx] = Object.assign({}, effs[idx], patch);
      return Object.assign({}, x, { effects: effs });
    }));
  };
  const delEffect = (id, idx) => {
    persist(traits.map(x => {
      if (x.id !== id) return x;
      const effs = (x.effects || []).slice();
      effs.splice(idx, 1);
      return Object.assign({}, x, { effects: effs });
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button onClick={pr.onBack} style={Object.assign({}, backBtn, { alignSelf: 'flex-start' })}>← Назад</button>
      <div style={{ textAlign: 'center', padding: '2px 0' }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 16, color: '#f0b352' }}>🎭 Черты</div>
        <div style={{ fontSize: 9, color: '#a89a82' }}>У черты может быть сразу несколько эффектов: бонус/штраф к нескольким навыкам и характеристике одновременно</div>
      </div>
      <button onClick={addTrait} style={{ padding: 10, borderRadius: 9, border: '2px dashed #f0b35260', background: '#231b08', color: '#f0b352', fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>➕ Добавить черту</button>

      {traits.length === 0 && <div style={{ textAlign: 'center', padding: 14, color: '#a89a82', fontSize: 11, fontStyle: 'italic' }}>Пусто — добавь первую черту</div>}

      {traits.map(function (t) {
        const open = openId === t.id;
        const cc = catColor(t.category);
        const effs = t.effects || [];
        return (
          <div key={t.id} style={{ border: '2px solid #322d24', borderRadius: 9, background: '#1d1a14', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 9px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12, color: '#ece5d8' }}>{t.name}{effs.length > 0 && <span style={{ fontSize: 8, color: cc, marginLeft: 5, fontFamily: "'Nunito',sans-serif" }}>{'⚙ эффектов: ' + effs.length}</span>}</div>
                <div style={{ fontSize: 8, color: '#a89a82' }}>{effs.length ? effs.map(effectLabel).join(' · ') : 'без эффектов'}</div>
              </div>
              <button onClick={() => delTrait(t.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 13, cursor: 'pointer' }}>🗑</button>
              <button onClick={() => setOpenId(open ? null : t.id)} style={{ padding: '4px 9px', borderRadius: 6, border: '1px solid ' + cc + '40', background: cc + '18', color: cc, fontWeight: 700, fontSize: 10, cursor: 'pointer' }}>{open ? '✕' : '✏️'}</button>
            </div>

            {open && (
              <div style={{ padding: '0 9px 9px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <label style={lbl}>Название</label>
                  <input value={t.name} onChange={e => updateTrait(t.id, { name: e.target.value })} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Тип</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {CATS.map(cat => <button key={cat.id} onClick={() => updateTrait(t.id, { category: cat.id })} style={{ flex: 1, padding: '5px 2px', borderRadius: 6, border: '2px solid ' + cat.color + (t.category === cat.id ? '' : '20'), background: t.category === cat.id ? cat.color + '20' : '#262219', color: cat.color, fontWeight: 700, fontSize: 9, cursor: 'pointer' }}>{cat.name}</button>)}
                  </div>
                </div>
                <div>
                  <label style={lbl}>Описание (показывается игроку)</label>
                  <textarea value={t.desc || ''} onChange={e => updateTrait(t.id, { desc: e.target.value })} style={Object.assign({}, inp, { minHeight: 40, resize: 'vertical' })} />
                </div>
                <div>
                  <label style={lbl}>Эффекты</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {effs.map(function (e, idx) {
                      return (
                        <div key={idx} style={{ display: 'flex', gap: 4, alignItems: 'center', background: '#262219', border: '1px solid #322d24', borderRadius: 6, padding: 4 }}>
                          <select value={e.type} onChange={ev => {
                            const nt = ev.target.value;
                            if (nt === 'stat_bonus') updEffect(t.id, idx, { type: nt, stat: SD[0].key, skill: undefined, amount: e.amount || 1 });
                            else if (nt === 'skill_bonus') updEffect(t.id, idx, { type: nt, skill: ALL_SKILLS[0], stat: undefined, amount: e.amount || 1 });
                            else updEffect(t.id, idx, { type: nt, stat: undefined, skill: undefined, amount: e.amount || 1 });
                          }} style={Object.assign({}, inp, { flex: '0 0 90px', fontSize: 9, padding: 4, cursor: 'pointer' })}>
                            <option value="stat_bonus">Характеристика</option>
                            <option value="skill_bonus">Навык</option>
                            <option value="hp_flat">HP</option>
                          </select>
                          {e.type === 'stat_bonus' && <select value={e.stat || SD[0].key} onChange={ev => updEffect(t.id, idx, { stat: ev.target.value })} style={Object.assign({}, inp, { flex: 1, fontSize: 9, padding: 4, cursor: 'pointer' })}>{SD.map(s => <option key={s.key} value={s.key}>{s.emoji + ' ' + s.key}</option>)}</select>}
                          {e.type === 'skill_bonus' && <select value={e.skill || ALL_SKILLS[0]} onChange={ev => updEffect(t.id, idx, { skill: ev.target.value })} style={Object.assign({}, inp, { flex: 1, fontSize: 9, padding: 4, cursor: 'pointer' })}>{ALL_SKILLS.map(n => <option key={n} value={n}>{n}</option>)}</select>}
                          {e.type === 'hp_flat' && <div style={{ flex: 1, fontSize: 9, color: '#a89a82' }}>Плоский бонус/штраф к макс. HP</div>}
                          <input type="number" value={e.amount} onChange={ev => updEffect(t.id, idx, { amount: parseInt(ev.target.value) || 0 })} style={Object.assign({}, inp, { width: 46, fontSize: 9, padding: 4 })} />
                          <button onClick={() => delEffect(t.id, idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 12, cursor: 'pointer', padding: '0 3px' }}>✕</button>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => addEffect(t.id)} style={{ marginTop: 4, width: '100%', padding: 6, borderRadius: 6, border: '2px dashed #3b82f640', background: '#0e1a2b', color: '#60a5fa', fontWeight: 700, fontSize: 9, cursor: 'pointer' }}>➕ Добавить ещё эффект</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div style={{ fontSize: 9, color: '#a89a82', textAlign: 'center', padding: '4px 8px', fontStyle: 'italic' }}>
        Изменения сразу видны игрокам при выборе черт. Черту можно совсем без эффектов — просто ролевая особенность.
      </div>
    </div>
  );
}
