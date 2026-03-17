import React, { useState, useEffect, useCallback } from 'react';
import { db, ref, set, get, onValue, update, remove } from './firebase';

/*
  ARCHITECTURE:
  - Lobby screen: Create room (GM) or Join room (Player) with code
  - All game data lives at /rooms/{roomCode}/ in Firebase
  - GM sees all characters, players see only their own
  - Lore & Map data shared across room
  - Real-time sync via onValue listeners
*/

// ── Generate room code ──
function genCode() {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var code = "";
  for (var i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ── CSS ──
var CSS = '@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Nunito:wght@400;600;700&display=swap");@keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes popIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#c4b8a4;border-radius:3px}';

// ── LOBBY ──
function Lobby(props) {
  var _m = useState("menu"), mode = _m[0], setMode = _m[1];
  var _c = useState(""), code = _c[0], setCode = _c[1];
  var _n = useState(""), name = _n[0], setName = _n[1];
  var _p = useState(""), pass = _p[0], setPass = _p[1];
  var _e = useState(""), err = _e[0], setErr = _e[1];
  var _l = useState(false), loading = _l[0], setLoading = _l[1];

  function createRoom() {
    if (!pass.trim()) { setErr("Введи пароль ГМ"); return; }
    setLoading(true);
    var roomCode = genCode();
    var roomRef = ref(db, "rooms/" + roomCode);
    set(roomRef, {
      gmPassword: pass.trim(),
      created: new Date().toISOString(),
      lore: {},
      mapData: {},
      characters: {},
      logs: {}
    }).then(function() {
      setLoading(false);
      props.onJoin(roomCode, null, true, pass.trim());
    }).catch(function(e) {
      setLoading(false);
      setErr("Ошибка: " + e.message);
    });
  }

  function joinAsPlayer() {
    if (!code.trim()) { setErr("Введи код комнаты"); return; }
    if (!name.trim()) { setErr("Введи своё имя"); return; }
    setLoading(true);
    var roomRef = ref(db, "rooms/" + code.trim().toUpperCase());
    get(roomRef).then(function(snap) {
      if (!snap.exists()) { setLoading(false); setErr("Комната не найдена"); return; }
      setLoading(false);
      props.onJoin(code.trim().toUpperCase(), name.trim(), false, "");
    }).catch(function(e) {
      setLoading(false);
      setErr("Ошибка: " + e.message);
    });
  }

  function joinAsGM() {
    if (!code.trim()) { setErr("Введи код комнаты"); return; }
    if (!pass.trim()) { setErr("Введи пароль ГМ"); return; }
    setLoading(true);
    var roomRef = ref(db, "rooms/" + code.trim().toUpperCase());
    get(roomRef).then(function(snap) {
      if (!snap.exists()) { setLoading(false); setErr("Комната не найдена"); return; }
      var data = snap.val();
      if (data.gmPassword !== pass.trim()) { setLoading(false); setErr("Неверный пароль ГМ"); return; }
      setLoading(false);
      props.onJoin(code.trim().toUpperCase(), null, true, pass.trim());
    }).catch(function(e) {
      setLoading(false);
      setErr("Ошибка: " + e.message);
    });
  }

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", background: "linear-gradient(180deg,#fefcf5,#f5efe3)", minHeight: "100vh", maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px 16px" }}>
      <style>{CSS}</style>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 28, fontFamily: "'Cinzel',serif", fontWeight: 900, color: "#2d2a24" }}>✦ Nox Aterna</div>
        <div style={{ fontSize: 14, fontFamily: "'Cinzel',serif", color: "#8b7e6a", marginTop: 4 }}>Fantasy Companion</div>
      </div>

      {mode === "menu" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={function() { setMode("join"); setErr(""); }} style={lobbyBtn("#3b82f6")}>🎮 Войти в комнату</button>
          <button onClick={function() { setMode("create"); setErr(""); }} style={lobbyBtn("#10b981")}>🏰 Создать комнату (ГМ)</button>
          <button onClick={function() { setMode("gmjoin"); setErr(""); }} style={lobbyBtn("#8b5cf6")}>🎭 Войти как ГМ</button>
        </div>
      )}

      {mode === "join" && (
        <div style={lobbyCard}>
          <div style={lobbyTitle}>🎮 Войти как игрок</div>
          <input style={lobbyInput} value={code} onChange={function(e) { setCode(e.target.value.toUpperCase()); }} placeholder="Код комнаты (напр. ABC123)" maxLength={6} />
          <input style={lobbyInput} value={name} onChange={function(e) { setName(e.target.value); }} placeholder="Твоё имя" />
          {err && <div style={lobbyErr}>{err}</div>}
          <button onClick={joinAsPlayer} disabled={loading} style={lobbyBtn("#3b82f6")}>{loading ? "⏳..." : "Войти"}</button>
          <button onClick={function() { setMode("menu"); }} style={lobbyBack}>← Назад</button>
        </div>
      )}

      {mode === "create" && (
        <div style={lobbyCard}>
          <div style={lobbyTitle}>🏰 Создать комнату</div>
          <input style={lobbyInput} type="password" value={pass} onChange={function(e) { setPass(e.target.value); }} placeholder="Пароль ГМ" />
          <div style={{ fontSize: 10, color: "#8b7e6a" }}>Этот пароль нужен чтобы войти как ГМ позже</div>
          {err && <div style={lobbyErr}>{err}</div>}
          <button onClick={createRoom} disabled={loading} style={lobbyBtn("#10b981")}>{loading ? "⏳ Создаю..." : "Создать"}</button>
          <button onClick={function() { setMode("menu"); }} style={lobbyBack}>← Назад</button>
        </div>
      )}

      {mode === "gmjoin" && (
        <div style={lobbyCard}>
          <div style={lobbyTitle}>🎭 Войти как ГМ</div>
          <input style={lobbyInput} value={code} onChange={function(e) { setCode(e.target.value.toUpperCase()); }} placeholder="Код комнаты" maxLength={6} />
          <input style={lobbyInput} type="password" value={pass} onChange={function(e) { setPass(e.target.value); }} placeholder="Пароль ГМ" />
          {err && <div style={lobbyErr}>{err}</div>}
          <button onClick={joinAsGM} disabled={loading} style={lobbyBtn("#8b5cf6")}>{loading ? "⏳..." : "Войти"}</button>
          <button onClick={function() { setMode("menu"); }} style={lobbyBack}>← Назад</button>
        </div>
      )}
    </div>
  );
}

var lobbyBtn = function(c) { return { width: "100%", padding: 14, borderRadius: 12, border: "2px solid " + c + "40", background: c + "10", fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 15, color: c, cursor: "pointer" }; };
var lobbyCard = { display: "flex", flexDirection: "column", gap: 10, background: "#fff", border: "2px solid #e8e0d4", borderRadius: 14, padding: "20px 16px" };
var lobbyTitle = { fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 17, color: "#2d2a24", textAlign: "center" };
var lobbyInput = { width: "100%", padding: "10px 12px", border: "2px solid #e8e0d4", borderRadius: 8, fontSize: 14, fontFamily: "'Nunito',sans-serif", background: "#fefdfb", outline: "none", textAlign: "center" };
var lobbyErr = { color: "#ef4444", fontSize: 11, textAlign: "center", fontWeight: 600 };
var lobbyBack = { background: "none", border: "none", color: "#8b7e6a", cursor: "pointer", fontSize: 12, fontWeight: 600, marginTop: 4 };

// ── ROOM HEADER (shows room code) ──
function RoomHeader(props) {
  var _c = useState(false), copied = _c[0], setCopied = _c[1];
  function copyCode() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(props.code);
      setCopied(true);
      setTimeout(function() { setCopied(false); }, 1500);
    }
  }
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "#2d2a24", color: "#e8e0d4", fontSize: 10 }}>
      <span>✦ Nox Aterna</span>
      <button onClick={copyCode} style={{ background: "none", border: "1px solid #5c5548", borderRadius: 4, padding: "2px 8px", color: "#e8e0d4", cursor: "pointer", fontSize: 10, fontFamily: "'Cinzel',serif" }}>
        {copied ? "✓ Скопировано" : "Комната: " + props.code}
      </button>
      <button onClick={props.onLeave} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 10 }}>Выйти</button>
    </div>
  );
}

// ── MAIN APP — connects Lobby → Game with Firebase sync ──
export default function App() {
  var _r = useState(null), room = _r[0], setRoom = _r[1];
  var _gm = useState(false), isGM = _gm[0], setIsGM = _gm[1];
  var _pn = useState(""), playerName = _pn[0], setPlayerName = _pn[1];
  var _pid = useState(null), playerId = _pid[0], setPlayerId = _pid[1];

  // Synced data from Firebase
  var _chars = useState({}), chars = _chars[0], setChars = _chars[1];
  var _lore = useState({}), lore = _lore[0], setLore = _lore[1];
  var _map = useState({}), mapData = _map[0], setMapData = _map[1];
  var _logs = useState([]), logs = _logs[0], setLogs = _logs[1];

  function handleJoin(roomCode, name, gm, pass) {
    setRoom(roomCode);
    setIsGM(gm);
    if (name) setPlayerName(name);
  }

  // Firebase real-time listeners
  useEffect(function() {
    if (!room) return;
    var unsubs = [];

    // Listen to characters
    var chRef = ref(db, "rooms/" + room + "/characters");
    var u1 = onValue(chRef, function(snap) {
      setChars(snap.val() || {});
    });
    unsubs.push(function() { u1(); });

    // Listen to lore
    var lRef = ref(db, "rooms/" + room + "/lore");
    var u2 = onValue(lRef, function(snap) {
      setLore(snap.val() || {});
    });
    unsubs.push(function() { u2(); });

    // Listen to map
    var mRef = ref(db, "rooms/" + room + "/mapData");
    var u3 = onValue(mRef, function(snap) {
      setMapData(snap.val() || {});
    });
    unsubs.push(function() { u3(); });

    // Listen to logs
    var lgRef = ref(db, "rooms/" + room + "/logs");
    var u4 = onValue(lgRef, function(snap) {
      var data = snap.val() || {};
      var arr = Object.values(data).sort(function(a, b) { return (b.ts || 0) - (a.ts || 0); });
      setLogs(arr.slice(0, 100));
    });
    unsubs.push(function() { u4(); });

    return function() { unsubs.forEach(function(u) { u(); }); };
  }, [room]);

  // Create player character on first join
  useEffect(function() {
    if (!room || isGM || !playerName || playerId) return;
    // Check if character with this name already exists
    var existing = Object.entries(chars).find(function(e) { return e[1].name === playerName; });
    if (existing) {
      setPlayerId(existing[0]);
      return;
    }
    // Create new character
    var newId = "p_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    var newChar = createDefaultChar(playerName);
    set(ref(db, "rooms/" + room + "/characters/" + newId), newChar);
    setPlayerId(newId);
  }, [room, isGM, playerName, chars, playerId]);

  // Firebase write helpers
  function updateChar(charId, data) {
    if (!room) return;
    update(ref(db, "rooms/" + room + "/characters/" + charId), data);
  }

  function setCharFull(charId, charData) {
    if (!room) return;
    set(ref(db, "rooms/" + room + "/characters/" + charId), charData);
  }

  function deleteChar(charId) {
    if (!room) return;
    remove(ref(db, "rooms/" + room + "/characters/" + charId));
  }

  function updateLore(newLore) {
    if (!room) return;
    set(ref(db, "rooms/" + room + "/lore"), newLore);
  }

  function updateMap(newMap) {
    if (!room) return;
    set(ref(db, "rooms/" + room + "/mapData"), newMap);
  }

  function addLog(entry) {
    if (!room) return;
    var logRef = ref(db, "rooms/" + room + "/logs/" + Date.now());
    set(logRef, Object.assign({}, entry, { ts: Date.now() }));
  }

  function handleLeave() {
    setRoom(null);
    setIsGM(false);
    setPlayerName("");
    setPlayerId(null);
    setChars({});
    setLore({});
    setMapData({});
    setLogs([]);
  }

  if (!room) return <Lobby onJoin={handleJoin} />;

  var charArray = Object.entries(chars).map(function(e) { return Object.assign({}, e[1], { _fbId: e[0] }); });

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", background: "linear-gradient(180deg,#fefcf5,#f5efe3)", minHeight: "100vh", maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <style>{CSS}</style>
      <RoomHeader code={room} onLeave={handleLeave} />
      <GameShell
        isGM={isGM}
        playerId={playerId}
        characters={charArray}
        lore={lore}
        mapData={mapData}
        logs={logs}
        updateChar={updateChar}
        setCharFull={setCharFull}
        deleteChar={deleteChar}
        updateLore={updateLore}
        updateMap={updateMap}
        addLog={addLog}
      />
    </div>
  );
}

// ── Default character template ──
function createDefaultChar(name) {
  var stats = {}; ["INT","REF","DEX","BODY","EMP","CRA","WILL"].forEach(function(k) { stats[k] = 1; });
  var skills = {};
  var allSk = [].concat(
    ["Awareness","Teaching","Streetwise","Lore","Gambling","Wilderness Survival","Navigating"],
    ["Battle Weapon","Simple Weapon","Guns","Archery"],
    ["Acrobatics","Ride/Drive","Sleight of Hands","Stealth","Dodge"],
    ["Brawl","Resistance","Athletics","Swimming"],
    ["Charisma","Deception","Performance","Seduction"],
    ["Alchemy","Blacksmithing","Jewel Crafting","Tinkering"],
    ["Spellcasting","Magic Resist"]
  );
  allSk.forEach(function(s) { skills[s] = 0; });
  return {
    name: name || "", level: 1, profId: "none", raceId: "none", humanBonusStat: "",
    age: "", height: "", weight: "", eyeColor: "", hair: "", bio: "",
    friends: [], enemies: [],
    stats: stats, skills: skills, locked: false,
    curHp: null, hpOv: null, curWill: null, willOv: null,
    weapons: [], lvlPts: 0, spentLvlPts: 0,
    armors: [], equippedHead: null, equippedBody: null,
    inventory: [], gold: 0
  };
}

// ── GAME SHELL — thin wrapper that renders the right view ──
// This is a simplified connector. The full game UI from fantasy-companion.jsx
// would be imported here. For now, it shows a working connected interface.
function GameShell(props) {
  var _v = useState("list"), view = _v[0], setView = _v[1];
  var _sel = useState(null), selId = _sel[0], setSelId = _sel[1];

  if (props.isGM) {
    return <GMView {...props} />;
  }

  // Player view — show their character
  var myChar = props.characters.find(function(c) { return c._fbId === props.playerId; });
  if (!myChar) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>⏳ Подключение...</div>
        <div style={{ fontSize: 11, color: "#8b7e6a" }}>Создаём персонажа, подожди секунду</div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: 10 }}>
      <div style={{ textAlign: "center", padding: "8px 0", fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 16 }}>
        {myChar.name || "Новый герой"}
      </div>
      <div style={{ textAlign: "center", fontSize: 10, color: "#8b7e6a", marginBottom: 10 }}>
        Игрок · Уровень {myChar.level}
      </div>
      <div style={{ background: "#fff", border: "2px solid #e8e0d4", borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
        <div style={{ fontSize: 14, marginBottom: 6 }}>✅ Подключён к Firebase!</div>
        <div style={{ fontSize: 11, color: "#8b7e6a" }}>
          Персонаж «{myChar.name}» сохранён в облаке.
          <br />Данные синхронизируются в реальном времени.
          <br /><br />
          <b>Следующий шаг:</b> я перенесу полный игровой интерфейс
          <br />(характеристики, бой, инвентарь, лор)
          <br />в эту Firebase-версию.
        </div>
      </div>
    </div>
  );
}

function GMView(props) {
  return (
    <div style={{ flex: 1, padding: 10 }}>
      <div style={{ textAlign: "center", padding: "8px 0", fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 16, color: "#7c3aed" }}>
        🎭 Панель ГМ
      </div>
      <div style={{ fontSize: 11, textAlign: "center", color: "#8b7e6a", marginBottom: 10 }}>
        Персонажей в комнате: {props.characters.length}
      </div>

      {props.characters.length === 0 && (
        <div style={{ textAlign: "center", padding: 20, color: "#8b7e6a", fontStyle: "italic" }}>
          Ожидаем игроков...
        </div>
      )}

      {props.characters.map(function(c) {
        return (
          <div key={c._fbId} style={{ background: "#fff", border: "2px solid #e8e0d4", borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 13 }}>{c.name || "?"}</div>
            <div style={{ fontSize: 9, color: "#8b7e6a" }}>Уровень {c.level} · ID: {c._fbId}</div>
          </div>
        );
      })}

      <div style={{ background: "#fff", border: "2px solid #10b98120", borderRadius: 10, padding: "14px 12px", marginTop: 10, textAlign: "center" }}>
        <div style={{ fontSize: 14, marginBottom: 6 }}>✅ Firebase подключён!</div>
        <div style={{ fontSize: 11, color: "#8b7e6a" }}>
          Комната работает. Игроки могут подключаться.
          <br />Данные синхронизируются в реальном времени.
          <br /><br />
          <b>Следующий шаг:</b> полный перенос интерфейса
          <br />(статы, бой, инвентарь, лор, карта)
        </div>
      </div>
    </div>
  );
}
