import { useCallback, useEffect, useRef, useState } from "react";

const GAME_TYPES = ["Maze", "Shooter", "Puzzle", "Platformer"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const THEMES = ["Space", "Jungle", "Fantasy", "City"];

const THEME_COLORS: Record<
  string,
  { primary: string; secondary: string; bg: string }
> = {
  Space: { primary: "#7c3aed", secondary: "#60a5fa", bg: "#0f0620" },
  Jungle: { primary: "#16a34a", secondary: "#86efac", bg: "#052e16" },
  Fantasy: { primary: "#db2777", secondary: "#f9a8d4", bg: "#3b0764" },
  City: { primary: "#ea580c", secondary: "#fdba74", bg: "#1c1917" },
};

function generateMaze(size: number): boolean[][] {
  const walls = Array.from({ length: size }, () => Array(size).fill(true));
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const dirs = [
    [0, 2],
    [2, 0],
    [0, -2],
    [-2, 0],
  ];
  function carve(r: number, c: number) {
    visited[r][c] = true;
    walls[r][c] = false;
    const shuffled = [...dirs].sort(() => Math.random() - 0.5);
    for (const [dr, dc] of shuffled) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < size && nc < size && !visited[nr][nc]) {
        walls[r + dr / 2][c + dc / 2] = false;
        carve(nr, nc);
      }
    }
  }
  carve(1, 1);
  walls[size - 2][size - 1] = false;
  return walls;
}

function MazeGame({
  theme,
  difficulty,
}: { theme: string; difficulty: string }) {
  const size = difficulty === "Easy" ? 11 : difficulty === "Medium" ? 15 : 21;
  const [maze] = useState(() => generateMaze(size));
  const [pos, setPos] = useState({ r: 1, c: 1 });
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const colors = THEME_COLORS[theme];
  const cell = 28;

  const reset = () => {
    setPos({ r: 1, c: 1 });
    setWon(false);
    setMoves(0);
  };

  useEffect(() => {
    if (pos.r === size - 2 && pos.c === size - 1) setWon(true);
  }, [pos, size]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (won) return;
      const dirs: Record<string, [number, number]> = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
      };
      const d = dirs[e.key];
      if (!d) return;
      e.preventDefault();
      setPos((p) => {
        const nr = p.r + d[0];
        const nc = p.c + d[1];
        if (nr >= 0 && nc >= 0 && nr < size && nc < size && !maze[nr][nc]) {
          setMoves((m) => m + 1);
          return { r: nr, c: nc };
        }
        return p;
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [maze, size, won]);

  const displaySize = Math.min(size, 15);
  const offset = {
    r: Math.max(0, Math.min(pos.r - 7, size - displaySize)),
    c: Math.max(0, Math.min(pos.c - 7, size - displaySize)),
  };

  return (
    <div style={{ textAlign: "center" }}>
      {won && (
        <div
          className="mb-3 font-bold text-lg"
          style={{ color: "oklch(65% 0.25 145)" }}
        >
          🏆 You escaped the maze!
        </div>
      )}
      <div
        style={{
          display: "inline-block",
          border: `2px solid ${colors.primary}`,
          borderRadius: 4,
          overflow: "hidden",
          background: colors.bg,
        }}
      >
        {Array.from({ length: displaySize }, (_, ri) => (
          <div key={`maze-row-${ri}-${offset.r}`} style={{ display: "flex" }}>
            {Array.from({ length: displaySize }, (_, ci) => {
              const ar = ri + offset.r;
              const ac = ci + offset.c;
              const isPlayer = ar === pos.r && ac === pos.c;
              const isExit = ar === size - 2 && ac === size - 1;
              const isWall = ar < size && ac < size && maze[ar][ac];
              return (
                <div
                  key={`cell-${ar}-${ac}`}
                  style={{
                    width: cell,
                    height: cell,
                    background: isPlayer
                      ? colors.primary
                      : isExit
                        ? colors.secondary
                        : isWall
                          ? "#1a1a2e"
                          : colors.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    transition: "background 0.1s",
                  }}
                >
                  {isPlayer ? "🔵" : isExit ? "🔟" : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 text-sm" style={{ color: "oklch(58% 0.02 260)" }}>
        Moves: {moves} | Arrow keys to move | 🔟 = Exit
      </div>
      <button
        type="button"
        data-ocid="game.restart.button"
        onClick={reset}
        className="btn mt-2.5"
        style={{
          border: `1px solid ${colors.primary}`,
          background: `${colors.primary}20`,
          color: colors.primary,
        }}
      >
        Restart
      </button>
    </div>
  );
}

function ShooterGame({
  theme,
  difficulty,
}: { theme: string; difficulty: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    player: { x: 250, y: 450 },
    bullets: [] as { x: number; y: number }[],
    enemies: [] as { x: number; y: number; hp: number }[],
    score: 0,
    lives: 3,
    over: false,
    frame: 0,
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [over, setOver] = useState(false);
  const keysRef = useRef<Set<string>>(new Set());
  const speed = difficulty === "Easy" ? 1.5 : difficulty === "Medium" ? 2.5 : 4;
  const colors = THEME_COLORS[theme];

  const reset = useCallback(() => {
    stateRef.current = {
      player: { x: 250, y: 450 },
      bullets: [],
      enemies: [],
      score: 0,
      lives: 3,
      over: false,
      frame: 0,
    };
    setScore(0);
    setLives(3);
    setOver(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    let lastShot = 0;
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    const loop = (ts: number) => {
      const s = stateRef.current;
      if (s.over) {
        ctx.fillStyle = "#ff4444";
        ctx.font = "24px monospace";
        ctx.fillText("GAME OVER", 180, 240);
        return;
      }
      s.frame++;
      if (keysRef.current.has("ArrowLeft"))
        s.player.x = Math.max(20, s.player.x - 4);
      if (keysRef.current.has("ArrowRight"))
        s.player.x = Math.min(480, s.player.x + 4);
      if (keysRef.current.has(" ") && ts - lastShot > 250) {
        s.bullets.push({ x: s.player.x, y: s.player.y - 20 });
        lastShot = ts;
      }
      s.bullets = s.bullets
        .filter((b) => b.y > 0)
        .map((b) => ({ ...b, y: b.y - 8 }));
      if (s.frame % 60 === 0)
        s.enemies.push({ x: Math.random() * 440 + 20, y: -20, hp: 1 });
      s.enemies = s.enemies.map((e) => ({ ...e, y: e.y + speed }));
      s.bullets = s.bullets.filter(
        (b) =>
          !s.enemies.some(
            (e) => Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 20,
          ),
      );
      const hitCount = s.enemies.filter((e) =>
        s.bullets.some(
          (b) => Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 20,
        ),
      ).length;
      s.score += hitCount;
      const escaped = s.enemies.filter((e) => e.y > 500).length;
      s.lives -= escaped;
      s.enemies = s.enemies.filter(
        (e) =>
          e.y <= 500 &&
          !s.bullets.some(
            (b) => Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 20,
          ),
      );
      if (s.lives <= 0) s.over = true;
      setScore(s.score);
      setLives(Math.max(0, s.lives));
      setOver(s.over);
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, 500, 500);
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.moveTo(s.player.x, s.player.y - 20);
      ctx.lineTo(s.player.x - 18, s.player.y + 10);
      ctx.lineTo(s.player.x + 18, s.player.y + 10);
      ctx.fill();
      ctx.fillStyle = colors.secondary;
      for (const b of s.bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#ef4444";
      for (const e of s.enemies) {
        ctx.beginPath();
        ctx.arc(e.x, e.y, 14, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!s.over) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [speed, colors]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        className="flex gap-5 justify-center mb-2.5 text-sm"
        style={{ color: "oklch(68% 0.02 260)" }}
      >
        <span>
          Score: <strong style={{ color: colors.primary }}>{score}</strong>
        </span>
        <span>
          Lives:{" "}
          <strong style={{ color: "#ef4444" }}>
            {"❤️".repeat(Math.max(0, lives))}
          </strong>
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{
          border: `2px solid ${colors.primary}`,
          borderRadius: 8,
          display: "block",
          margin: "0 auto",
        }}
      />
      <div className="mt-2.5 text-xs" style={{ color: "oklch(52% 0.02 260)" }}>
        Arrow keys to move | Space to shoot
      </div>
      {over && (
        <button
          type="button"
          data-ocid="game.restart.button"
          onClick={reset}
          className="btn mt-2.5"
          style={{
            border: `1px solid ${colors.primary}`,
            background: `${colors.primary}20`,
            color: colors.primary,
          }}
        >
          Restart
        </button>
      )}
    </div>
  );
}

function PuzzleGame({ theme }: { theme: string }) {
  const colors = THEME_COLORS[theme];
  const initTiles = () => {
    const t = Array.from({ length: 15 }, (_, i) => i + 1).concat([0]);
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
    return t;
  };
  const [tiles, setTiles] = useState(initTiles);
  const [moves, setMoves] = useState(0);
  const won = tiles.every((t, i) => t === (i < 15 ? i + 1 : 0));
  const click = (i: number) => {
    const empty = tiles.indexOf(0);
    const row = (idx: number) => Math.floor(idx / 4);
    const col = (idx: number) => idx % 4;
    if (Math.abs(row(i) - row(empty)) + Math.abs(col(i) - col(empty)) !== 1)
      return;
    const next = [...tiles];
    [next[i], next[empty]] = [next[empty], next[i]];
    setTiles(next);
    setMoves((m) => m + 1);
  };
  return (
    <div style={{ textAlign: "center" }}>
      {won && (
        <div
          className="mb-3 font-bold text-lg"
          style={{ color: "oklch(65% 0.25 145)" }}
        >
          🏆 Puzzle Solved!
        </div>
      )}
      <div
        style={{
          display: "inline-grid",
          gridTemplateColumns: "repeat(4, 80px)",
          gap: 4,
          background: colors.bg,
          padding: 8,
          borderRadius: 8,
          border: `2px solid ${colors.primary}`,
        }}
      >
        {tiles.map((t, i) => (
          <div
            key={t === 0 ? "empty-tile" : `tile-${t}`}
            onClick={() => click(i)}
            onKeyDown={(e) => e.key === "Enter" && click(i)}
            tabIndex={t ? 0 : -1}
            style={{
              width: 80,
              height: 80,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              cursor: t ? "pointer" : "default",
              background: t ? `${colors.primary}40` : "transparent",
              color: colors.secondary,
              border: t ? `1px solid ${colors.primary}60` : "none",
              transition: "all 0.15s",
            }}
          >
            {t || ""}
          </div>
        ))}
      </div>
      <div className="mt-3 text-sm" style={{ color: "oklch(58% 0.02 260)" }}>
        Moves: {moves} | Click tiles to slide
      </div>
      <button
        type="button"
        data-ocid="game.restart.button"
        onClick={() => {
          setTiles(initTiles());
          setMoves(0);
        }}
        className="btn mt-2.5"
        style={{
          border: `1px solid ${colors.primary}`,
          background: `${colors.primary}20`,
          color: colors.primary,
        }}
      >
        Restart
      </button>
    </div>
  );
}

function PlatformerGame({
  theme,
  difficulty,
}: { theme: string; difficulty: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = THEME_COLORS[theme];
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const stateRef = useRef({
    player: { x: 80, y: 300, vy: 0, onGround: false },
    coins: [] as { x: number; y: number; collected: boolean }[],
    score: 0,
    over: false,
  });
  const keysRef = useRef<Set<string>>(new Set());
  const platforms = [
    { x: 0, y: 380, w: 500, h: 20 },
    { x: 100, y: 300, w: 120, h: 16 },
    { x: 280, y: 240, w: 120, h: 16 },
    { x: 60, y: 180, w: 100, h: 16 },
    { x: 320, y: 160, w: 100, h: 16 },
  ];
  const numCoins = difficulty === "Easy" ? 3 : difficulty === "Medium" ? 5 : 8;
  const reset = useCallback(() => {
    stateRef.current = {
      player: { x: 80, y: 300, vy: 0, onGround: false },
      coins: Array.from({ length: numCoins }, (_, i) => ({
        x: 80 + i * 55,
        y: 150 + (i % 3) * 50,
        collected: false,
      })),
      score: 0,
      over: false,
    };
    setScore(0);
    setOver(false);
  }, [numCoins]);
  useEffect(() => {
    reset();
  }, [reset]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: platforms is constant
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const onKey = (e: KeyboardEvent) => {
      if ([" ", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    const loop = () => {
      const s = stateRef.current;
      if (!s.over) {
        if (
          (keysRef.current.has(" ") || keysRef.current.has("ArrowUp")) &&
          s.player.onGround
        )
          s.player.vy = -12;
        if (keysRef.current.has("ArrowLeft")) s.player.x -= 3;
        if (keysRef.current.has("ArrowRight")) s.player.x += 3;
        s.player.vy += 0.5;
        s.player.y += s.player.vy;
        s.player.onGround = false;
        for (const p of platforms) {
          if (
            s.player.x + 16 > p.x &&
            s.player.x - 16 < p.x + p.w &&
            s.player.y + 20 >= p.y &&
            s.player.y + 20 <= p.y + p.h + s.player.vy + 1 &&
            s.player.vy >= 0
          ) {
            s.player.y = p.y - 20;
            s.player.vy = 0;
            s.player.onGround = true;
          }
        }
        if (s.player.y > 450) s.over = true;
        s.player.x = Math.max(16, Math.min(484, s.player.x));
        for (const c of s.coins) {
          if (
            !c.collected &&
            Math.abs(s.player.x - c.x) < 20 &&
            Math.abs(s.player.y - c.y) < 20
          ) {
            c.collected = true;
            s.score++;
          }
        }
        setScore(s.score);
        setOver(s.over);
      }
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, 500, 400);
      ctx.fillStyle = colors.primary;
      for (const p of platforms) {
        ctx.fillRect(p.x, p.y, p.w, p.h);
      }
      ctx.fillStyle = "#facc15";
      for (const c of s.coins) {
        if (!c.collected) {
          ctx.beginPath();
          ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(s.player.x - 14, s.player.y - 20, 28, 28);
      if (s.over) {
        ctx.fillStyle = "#ef4444";
        ctx.font = "24px monospace";
        ctx.fillText("GAME OVER", 170, 200);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [colors, platforms]);
  return (
    <div style={{ textAlign: "center" }}>
      {over && (
        <div className="font-bold mb-2" style={{ color: "#ef4444" }}>
          Game Over!
        </div>
      )}
      <div className="mb-2.5 text-sm" style={{ color: "oklch(68% 0.02 260)" }}>
        Coins:{" "}
        <strong style={{ color: "#facc15" }}>
          {score}/{numCoins}
        </strong>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        style={{
          border: `2px solid ${colors.primary}`,
          borderRadius: 8,
          display: "block",
          margin: "0 auto",
        }}
      />
      <div className="mt-2.5 text-xs" style={{ color: "oklch(52% 0.02 260)" }}>
        Arrow keys / Space to jump | Collect all coins!
      </div>
      <button
        type="button"
        data-ocid="game.restart.button"
        onClick={reset}
        className="btn mt-2.5"
        style={{
          border: `1px solid ${colors.primary}`,
          background: `${colors.primary}20`,
          color: colors.primary,
        }}
      >
        Restart
      </button>
    </div>
  );
}

export default function GameCreator() {
  const [gameType, setGameType] = useState("Maze");
  const [difficulty, setDifficulty] = useState("Medium");
  const [theme, setTheme] = useState("Space");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setGenerated(true);
      setLoading(false);
      setKey((k) => k + 1);
    }, 1200);
  };

  const accent = "oklch(65% 0.25 145)";

  return (
    <div className="page-wrapper">
      <h1 className="page-title neon-text-green">🎮 Game Creator</h1>
      <p className="page-subtitle">
        Build playable browser mini-games with custom themes and difficulty.
      </p>

      <div className="glass rounded-2xl p-7 mb-7">
        <div className="grid grid-cols-3 gap-4 mb-5">
          {(
            [
              [
                "Game Type",
                GAME_TYPES,
                gameType,
                setGameType,
                "game.type.select",
              ],
              [
                "Difficulty",
                DIFFICULTIES,
                difficulty,
                setDifficulty,
                "game.difficulty.select",
              ],
              ["Theme", THEMES, theme, setTheme, "game.theme.select"],
            ] as const
          ).map(([label, opts, val, setter, ocid]) => (
            <div key={label}>
              <span
                className="field-label"
                style={{ color: accent, display: "block" }}
              >
                {label}
              </span>
              <select
                data-ocid={ocid}
                value={val}
                onChange={(e) =>
                  (setter as (v: string) => void)(e.target.value)
                }
                className="field-control"
              >
                {(opts as readonly string[]).map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button
          type="button"
          data-ocid="game.generate.primary_button"
          onClick={generate}
          disabled={loading}
          className="btn"
          style={{
            background:
              "linear-gradient(135deg, oklch(65% 0.25 145), oklch(55% 0.28 160))",
            color: "white",
            border: "none",
            padding: "11px 26px",
            fontSize: 14,
            fontWeight: 700,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "⌛ Generating Game..." : "🎮 Generate Game"}
        </button>
      </div>

      {generated && (
        <div key={key} className="glass animate-fade-in-up rounded-2xl p-7">
          <div className="flex items-center gap-2 mb-5">
            <span className="font-bold" style={{ color: accent }}>
              {gameType} Game
            </span>
            {[difficulty, theme].map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "oklch(65% 0.25 145 / 0.15)",
                  color: accent,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          {gameType === "Maze" && (
            <MazeGame key={key} theme={theme} difficulty={difficulty} />
          )}
          {gameType === "Shooter" && (
            <ShooterGame key={key} theme={theme} difficulty={difficulty} />
          )}
          {gameType === "Puzzle" && <PuzzleGame key={key} theme={theme} />}
          {gameType === "Platformer" && (
            <PlatformerGame key={key} theme={theme} difficulty={difficulty} />
          )}
        </div>
      )}
    </div>
  );
}
