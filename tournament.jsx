import { useState, useEffect } from "react";

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const chunkPairs = (arr) => {
  const pairs = [];
  for (let i = 0; i < arr.length - 1; i += 2) {
    pairs.push([arr[i], arr[i + 1]]);
  }
  if (arr.length % 2 !== 0) pairs.push([arr[arr.length - 1], null]);
  return pairs;
};

const COLORS = {
  bg: "#0d0f1a",
  surface: "#161929",
  card: "#1e2235",
  border: "#2a2f4a",
  accent: "#7c6af7",
  accentLight: "#a599ff",
  gold: "#f5c842",
  green: "#3ddc84",
  red: "#ff5a5a",
  text: "#e8eaf0",
  muted: "#8890b0",
};

export default function App() {
  const [screen, setScreen] = useState("input"); // input | tournament
  const [inputText, setInputText] = useState("");
  const [names, setNames] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [winners, setWinners] = useState({});
  const [champion, setChampion] = useState(null);
  const [roundDone, setRoundDone] = useState(false);

  const startTournament = () => {
    const parsed = inputText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parsed.length < 2) return;
    const shuffled = shuffle(parsed);
    const firstRound = chunkPairs(shuffled);
    setNames(parsed);
    setRounds([firstRound]);
    setCurrentRound(0);
    setWinners({});
    setChampion(null);
    setRoundDone(false);
    setScreen("tournament");
  };

  const currentMatches = rounds[currentRound] || [];
  const currentWinners = winners[currentRound] || {};

  const selectWinner = (matchIdx, player) => {
    if (champion) return;
    setWinners((prev) => ({
      ...prev,
      [currentRound]: { ...(prev[currentRound] || {}), [matchIdx]: player },
    }));
  };

  useEffect(() => {
    if (!rounds.length) return;
    const matches = rounds[currentRound];
    if (!matches) return;
    const wins = winners[currentRound] || {};
    const allDone = matches.every((pair, i) => {
      if (pair[1] === null) return true;
      return !!wins[i];
    });
    setRoundDone(allDone);
  }, [winners, currentRound, rounds]);

  const nextRound = () => {
    const matches = rounds[currentRound];
    const wins = winners[currentRound] || {};
    const roundWinners = matches.map((pair, i) => {
      if (pair[1] === null) return pair[0];
      return wins[i];
    });
    if (roundWinners.length === 1) {
      setChampion(roundWinners[0]);
      return;
    }
    const nextMatches = chunkPairs(roundWinners);
    setRounds((prev) => [...prev, nextMatches]);
    setCurrentRound((prev) => prev + 1);
    setRoundDone(false);
  };

  const getRoundName = (idx, total) => {
    const remaining = rounds[idx]?.length || 1;
    if (remaining === 1 && rounds[idx]?.[0]?.[1] !== null) return "Final";
    if (remaining === 2) return "Yarim final";
    if (remaining === 4) return "Chorak final";
    return `${idx + 1}-bosqich`;
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', system-ui, sans-serif", padding: "0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        textarea:focus { outline: none; }
        .match-card { transition: transform 0.15s ease; }
        .match-card:hover { transform: translateY(-1px); }
        .player-btn { transition: all 0.2s ease; cursor: pointer; border: none; }
        .player-btn:hover { filter: brightness(1.1); }
        .player-btn:active { transform: scale(0.98); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,106,247,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(124,106,247,0); }
        }
        .champion-glow { animation: champ 1.5s infinite alternate; }
        @keyframes champ {
          from { box-shadow: 0 0 20px rgba(245,200,66,0.3); }
          to { box-shadow: 0 0 40px rgba(245,200,66,0.7); }
        }
        .fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {screen === "input" ? (
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "60px 20px", display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, background: `linear-gradient(135deg, ${COLORS.accentLight}, ${COLORS.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>
              Turnir Yaratuvchi
            </h1>
            <p style={{ color: COLORS.muted, marginTop: 8, fontSize: 15 }}>
              Ishtirokchilarni kiriting, random tartibda jang qilishsin
            </p>
          </div>

          {/* Input area */}
          <div style={{ background: COLORS.surface, borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: COLORS.accentLight, fontSize: 16 }}>👥</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Ishtirokchilar
              </span>
              {inputText.split(/[\n,;]+/).filter(s => s.trim()).length > 0 && (
                <span style={{ marginLeft: "auto", background: COLORS.accent, color: "#fff", fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                  {inputText.split(/[\n,;]+/).filter(s => s.trim()).length}
                </span>
              )}
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={"Alisher\nBobur\nCamilla\nDilnoza\n...\n\n(Har bir ism yangi qatorda)"}
              style={{
                width: "100%", minHeight: 240, background: "transparent", border: "none",
                color: COLORS.text, fontSize: 15, lineHeight: 1.8, padding: "16px 18px",
                resize: "vertical", fontFamily: "inherit"
              }}
            />
          </div>

          {/* Start button */}
          <button
            onClick={startTournament}
            disabled={inputText.split(/[\n,;]+/).filter(s => s.trim()).length < 2}
            style={{
              background: inputText.split(/[\n,;]+/).filter(s => s.trim()).length >= 2
                ? `linear-gradient(135deg, ${COLORS.accent}, #9b6af7)`
                : COLORS.border,
              color: inputText.split(/[\n,;]+/).filter(s => s.trim()).length >= 2 ? "#fff" : COLORS.muted,
              border: "none", borderRadius: 14, padding: "16px 24px",
              fontSize: 17, fontWeight: 700, cursor: inputText.split(/[\n,;]+/).filter(s => s.trim()).length >= 2 ? "pointer" : "not-allowed",
              letterSpacing: "0.3px", transition: "all 0.2s",
              boxShadow: inputText.split(/[\n,;]+/).filter(s => s.trim()).length >= 2 ? "0 4px 24px rgba(124,106,247,0.4)" : "none"
            }}
          >
            🚀 Turnirni boshlash
          </button>

          <p style={{ textAlign: "center", color: COLORS.muted, fontSize: 13 }}>
            Juft sondagi ishtirokchida to'liq bracket, toq sonda biri keyingi bosqichga avtomatik o'tadi
          </p>
        </div>
      ) : (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 16px 60px" }} className="fade-in">
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <button
              onClick={() => setScreen("input")}
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.muted, borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              ← Orqaga
            </button>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>🏆 Turnir</h2>
              <p style={{ color: COLORS.muted, fontSize: 12 }}>{names.length} ishtirokchi</p>
            </div>
            <div style={{ width: 80 }} />
          </div>

          {/* Round tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
            {rounds.map((r, i) => (
              <button
                key={i}
                onClick={() => { if (i <= currentRound) setCurrentRound(i); }}
                style={{
                  background: i === currentRound ? COLORS.accent : COLORS.surface,
                  color: i === currentRound ? "#fff" : i < currentRound ? COLORS.green : COLORS.muted,
                  border: `1px solid ${i === currentRound ? COLORS.accent : i < currentRound ? COLORS.green : COLORS.border}`,
                  borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600,
                  cursor: i <= currentRound ? "pointer" : "default", whiteSpace: "nowrap",
                  minWidth: "fit-content", transition: "all 0.2s"
                }}
              >
                {i < currentRound ? "✓ " : ""}{getRoundName(i, rounds.length)}
              </button>
            ))}
            {champion && (
              <div style={{ background: COLORS.gold, color: "#000", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                👑 G'olib!
              </div>
            )}
          </div>

          {/* Champion banner */}
          {champion && (
            <div className="champion-glow fade-in" style={{
              background: `linear-gradient(135deg, #2a2200, #3a3000)`,
              border: `2px solid ${COLORS.gold}`,
              borderRadius: 20, padding: "28px 24px", textAlign: "center", marginBottom: 32
            }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>👑</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.gold, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
                Turnir G'olibi
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.gold }}>
                {champion}
              </div>
            </div>
          )}

          {/* Matches */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {rounds[currentRound]?.map((pair, matchIdx) => {
              const selectedWinner = (winners[currentRound] || {})[matchIdx];
              const isResolved = selectedWinner || pair[1] === null;
              const autoWin = pair[1] === null;

              return (
                <div key={matchIdx} className="match-card" style={{
                  background: COLORS.card,
                  border: `1px solid ${isResolved ? (autoWin ? COLORS.border : COLORS.accent + "60") : COLORS.border}`,
                  borderRadius: 16, overflow: "hidden"
                }}>
                  {/* Match header */}
                  <div style={{
                    padding: "8px 16px",
                    background: COLORS.surface,
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: "flex", alignItems: "center", justifyContent: "space-between"
                  }}>
                    <span style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, letterSpacing: "0.5px" }}>
                      JANG #{matchIdx + 1}
                    </span>
                    {isResolved && !autoWin && (
                      <span style={{ fontSize: 11, color: COLORS.green, fontWeight: 600 }}>✓ TUGADI</span>
                    )}
                    {autoWin && (
                      <span style={{ fontSize: 11, color: COLORS.accent, fontWeight: 600 }}>⚡ AVTOMATIK</span>
                    )}
                    {!isResolved && (
                      <span style={{ fontSize: 11, color: COLORS.gold, fontWeight: 600 }}>⚔️ G'OLIBNI TANLANG</span>
                    )}
                  </div>

                  {/* Players */}
                  <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[pair[0], pair[1]].filter(Boolean).map((player, pIdx) => {
                      const isWinner = selectedWinner === player;
                      const isLoser = selectedWinner && selectedWinner !== player;
                      const isAuto = autoWin && pIdx === 0;

                      return (
                        <button
                          key={pIdx}
                          className="player-btn"
                          onClick={() => !autoWin && currentRound === currentRound && selectWinner(matchIdx, player)}
                          style={{
                            background: isWinner || isAuto
                              ? `linear-gradient(135deg, ${COLORS.accent}33, ${COLORS.accent}15)`
                              : isLoser ? "transparent" : COLORS.surface,
                            border: `2px solid ${isWinner || isAuto ? COLORS.accent : isLoser ? COLORS.border + "60" : COLORS.border}`,
                            borderRadius: 12, padding: "14px 18px",
                            display: "flex", alignItems: "center", gap: 12,
                            opacity: isLoser ? 0.4 : 1,
                            cursor: autoWin || selectedWinner ? "default" : "pointer",
                            width: "100%", textAlign: "left"
                          }}
                        >
                          <div style={{
                            width: 38, height: 38, borderRadius: "50%",
                            background: isWinner || isAuto
                              ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`
                              : `linear-gradient(135deg, ${COLORS.border}, ${COLORS.surface})`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0
                          }}>
                            {isAuto ? "⚡" : isWinner ? "✓" : player?.charAt(0)?.toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: isWinner || isAuto ? COLORS.accentLight : COLORS.text }}>
                              {player}
                            </div>
                            {(isWinner || isAuto) && (
                              <div style={{ fontSize: 12, color: COLORS.accent, marginTop: 2 }}>
                                {isAuto ? "Keyingi bosqichga o'tdi" : "G'olib! 🎉"}
                              </div>
                            )}
                          </div>
                          {!isResolved && !autoWin && (
                            <div style={{ fontSize: 12, color: COLORS.muted, padding: "4px 10px", border: `1px solid ${COLORS.border}`, borderRadius: 8 }}>
                              Tanlash
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* VS divider for unresolved */}
                  {!isResolved && pair[1] && (
                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginTop: -8 }}>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Next round button */}
          {roundDone && !champion && (
            <div className="fade-in" style={{ marginTop: 28 }}>
              <button
                className="pulse"
                onClick={nextRound}
                style={{
                  width: "100%", background: `linear-gradient(135deg, ${COLORS.accent}, #9b6af7)`,
                  color: "#fff", border: "none", borderRadius: 14, padding: "18px 24px",
                  fontSize: 17, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 24px rgba(124,106,247,0.4)", letterSpacing: "0.3px"
                }}
              >
                {rounds[currentRound]?.filter(p => p[1] !== null).length === 1
                  ? "🏆 G'olibni e'lon qilish!"
                  : "⚡ Keyingi bosqichga o'tish →"}
              </button>
            </div>
          )}

          {/* Progress */}
          <div style={{ marginTop: 24, background: COLORS.surface, borderRadius: 12, padding: "14px 18px", border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600 }}>JARAYONI</span>
              <span style={{ fontSize: 12, color: COLORS.accent, fontWeight: 700 }}>
                {currentRound + 1}/{rounds.length + (champion ? 0 : 0)} bosqich
              </span>
            </div>
            <div style={{ background: COLORS.border, borderRadius: 99, height: 6, overflow: "hidden" }}>
              <div style={{
                background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                height: "100%", borderRadius: 99,
                width: `${Math.min(100, ((currentRound + (roundDone ? 1 : 0)) / (rounds.length + 1)) * 100)}%`,
                transition: "width 0.5s ease"
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
