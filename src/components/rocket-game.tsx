"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { gameSettings } from "@/data/game";

const WIDTH = 320;
const HEIGHT = 216;
const FLOOR = 196;
const ROCKET_X = 74;
const ROCKET_W = 24;
const ROCKET_H = 19;
const GRAVITY = 390;
const BOOST = -142;
const GAP = 79;
const OBSTACLE_WIDTH = 29;
const SPACING = 132;

type Obstacle = { x: number; gapY: number; passed: boolean };
type Particle = { x: number; y: number; vx: number; vy: number; life: number };
type Phase = "ready" | "playing" | "paused" | "over";
type GameState = {
  phase: Phase;
  y: number;
  vy: number;
  obstacles: Obstacle[];
  particles: Particle[];
  score: number;
  best: number;
  time: number;
  traveled: number;
};

function randomGap() { return 53 + Math.random() * 75; }
function initialGame(best: number): GameState {
  return { phase: "ready", y: 91, vy: 0, obstacles: [], particles: [], score: 0, best, time: 0, traveled: 0 };
}
function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
function pixelMan(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Helmet rim, dark hair, face and two dark eyes. A stylized stand-in for the portfolio owner.
  rect(ctx, x, y, 12, 12, "#070b10");
  rect(ctx, x + 1, y + 2, 10, 9, "#eee8d8");
  rect(ctx, x + 1, y + 1, 10, 3, "#22252c");
  rect(ctx, x + 3, y + 6, 2, 2, "#151515");
  rect(ctx, x + 8, y + 6, 2, 2, "#151515");
  rect(ctx, x + 5, y + 9, 4, 1, "#8e6552");
  rect(ctx, x + 1, y + 11, 10, 2, "#aeb6be");
}
function drawRocket(ctx: CanvasRenderingContext2D, y: number, time: number, thrust: boolean) {
  const x = ROCKET_X;
  const yy = Math.round(y);
  if (thrust) {
    const flame = Math.floor(time * 18) % 2;
    rect(ctx, x - 12 - flame * 4, yy + 8, 13 + flame * 4, 5, "#f9b54c");
    rect(ctx, x - 8 - flame * 3, yy + 9, 10, 3, "#fff3b0");
  }
  rect(ctx, x - 4, yy + 6, 8, 9, "#72808b");
  rect(ctx, x + 1, yy + 2, 18, 16, "#d8dde0");
  rect(ctx, x + 5, yy, 12, 19, "#eceff1");
  rect(ctx, x + 16, yy + 5, 6, 10, "#aeb9c3");
  rect(ctx, x + 21, yy + 7, 5, 6, "#f1f4f4");
  rect(ctx, x + 3, yy + 16, 6, 6, "#89959f");
  rect(ctx, x + 8, yy + 17, 8, 4, "#475560");
  rect(ctx, x + 6, yy - 2, 12, 14, "#26333d");
  pixelMan(ctx, x + 6, yy - 2);
  rect(ctx, x + 17, yy + 3, 2, 2, "#fff");
  rect(ctx, x + 20, yy + 11, 2, 2, "#3b4650");
}
function drawObstacle(ctx: CanvasRenderingContext2D, obstacle: Obstacle, time: number) {
  const x = Math.round(obstacle.x);
  const topH = Math.round(obstacle.gapY - GAP / 2);
  const bottom = Math.round(obstacle.gapY + GAP / 2);
  const tower = "#535e6c";
  const edge = "#a2aab1";
  const shadow = "#25303c";
  rect(ctx, x, 0, OBSTACLE_WIDTH, topH, shadow);
  rect(ctx, x + 3, 0, OBSTACLE_WIDTH - 7, topH, tower);
  rect(ctx, x + 4, 0, 3, topH, edge);
  rect(ctx, x - 3, topH - 10, OBSTACLE_WIDTH + 6, 10, "#7c8997");
  rect(ctx, x - 3, topH - 3, OBSTACLE_WIDTH + 6, 3, shadow);
  rect(ctx, x, bottom, OBSTACLE_WIDTH, FLOOR - bottom, shadow);
  rect(ctx, x + 3, bottom, OBSTACLE_WIDTH - 7, FLOOR - bottom, tower);
  rect(ctx, x + 4, bottom, 3, FLOOR - bottom, edge);
  rect(ctx, x - 3, bottom, OBSTACLE_WIDTH + 6, 10, "#7c8997");
  rect(ctx, x - 3, bottom + 8, OBSTACLE_WIDTH + 6, 3, shadow);
  for (let yy = 13; yy < topH - 10; yy += 24) rect(ctx, x + 15, yy, 5, 5, "#242c35");
  for (let yy = bottom + 18; yy < FLOOR; yy += 24) rect(ctx, x + 15, yy, 5, 5, "#242c35");
  // Blinking warning lights at the openings.
  if (Math.floor(time * 4) % 2 === 0) {
    rect(ctx, x + 10, topH - 7, 5, 3, "#e9bd66");
    rect(ctx, x + 10, bottom + 3, 5, 3, "#e9bd66");
  }
}
function draw(ctx: CanvasRenderingContext2D, game: GameState) {
  const t = game.time;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  rect(ctx, 0, 0, WIDTH, HEIGHT, "#111a25");
  for (let i = 0; i < 40; i++) {
    const sx = ((i * 79 + 37 - game.traveled * (i % 3 + 1) * 0.06) % WIDTH + WIDTH) % WIDTH;
    const sy = (i * 43 + 11) % (FLOOR - 12);
    rect(ctx, sx, sy, i % 4 === 0 ? 2 : 1, i % 4 === 0 ? 2 : 1, i % 5 === 0 ? "#a9b7c7" : "#556575");
  }
  // Pixel skyline and moonscape in the distance.
  rect(ctx, 240, 23, 19, 19, "#364251");
  rect(ctx, 244, 25, 12, 12, "#c9cdd4");
  for (let i = 0; i < 22; i++) {
    const bx = ((i * 23 - game.traveled * 0.16) % (WIDTH + 25) + WIDTH + 25) % (WIDTH + 25) - 12;
    const bh = 5 + ((i * 13) % 15);
    rect(ctx, bx, FLOOR - bh, 12, bh, "#202e3b");
  }
  for (const obstacle of game.obstacles) drawObstacle(ctx, obstacle, t);
  for (const p of game.particles) rect(ctx, p.x, p.y, 2, 2, p.life > 0.16 ? "#efb85d" : "#a8704f");
  const floatY = game.phase === "ready" ? Math.sin(t * 3.2) * 3 : 0;
  drawRocket(ctx, game.y + floatY, t, game.phase === "playing" || game.phase === "ready");
  rect(ctx, 0, FLOOR, WIDTH, 2, "#95a1ab");
  rect(ctx, 0, FLOOR + 2, WIDTH, HEIGHT - FLOOR, "#273541");
  for (let i = 0; i < 20; i++) {
    const px = ((i * 24 - game.traveled * 0.65) % (WIDTH + 30) + WIDTH + 30) % (WIDTH + 30);
    rect(ctx, px, FLOOR + 8 + (i % 2) * 4, 8, 2, "#60717e");
  }
  ctx.textAlign = "center";
  ctx.font = "bold 16px monospace";
  ctx.fillStyle = "#eef4f7";
  ctx.fillText(String(game.score).padStart(2, "0"), WIDTH / 2, 25);
  ctx.textAlign = "left";
  ctx.font = "7px monospace";
  ctx.fillStyle = "#a7b8c8";
  ctx.fillText("ROCKET RUN / 01", 10, 12);
  ctx.textAlign = "right";
  ctx.fillText(`BEST ${game.best}`, WIDTH - 10, 12);
  if (game.phase !== "playing") {
    rect(ctx, 63, 65, 194, 83, "#101720");
    ctx.strokeStyle = "#81909c";
    ctx.lineWidth = 1;
    ctx.strokeRect(63.5, 65.5, 193, 82);
    ctx.textAlign = "center";
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#f1f2f3";
    ctx.fillText(game.phase === "ready" ? "ROCKET RUN" : game.phase === "paused" ? "PAUSED" : "GAME OVER", WIDTH / 2, 91);
    ctx.font = "8px monospace";
    ctx.fillStyle = "#c3d0d7";
    if (game.phase === "over") ctx.fillText(`SCORE ${game.score}   BEST ${game.best}`, WIDTH / 2, 111);
    else ctx.fillText("FLY THROUGH THE GAPS", WIDTH / 2, 111);
    ctx.fillText(game.phase === "paused" ? "SPACE TO RESUME" : "SPACE / TAP TO " + (game.phase === "over" ? "RETRY" : "START"), WIDTH / 2, 132);
  }
}

export function RocketGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState>(initialGame(0));
  const lastFrameRef = useRef(0);
  const rafRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [sound, setSound] = useState(false);

  const beep = useCallback((frequency: number, duration: number) => {
    if (!soundRef.current) return;
    try {
      const audio = audioContextRef.current ?? new AudioContext();
      audioContextRef.current = audio;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = "square";
      osc.frequency.value = frequency;
      gain.gain.value = 0.035;
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + duration);
    } catch { /* Audio is an optional enhancement. */ }
  }, []);

  const action = useCallback(() => {
    const game = gameRef.current;
    if (game.phase === "paused") { game.phase = "playing"; setPhase("playing"); lastFrameRef.current = 0; return; }
    if (game.phase === "over" || game.phase === "ready") {
      const savedBest = game.best;
      gameRef.current = initialGame(savedBest);
      gameRef.current.phase = "playing";
      gameRef.current.vy = BOOST;
      setScore(0);
      setPhase("playing");
      beep(420, 0.06);
      return;
    }
    game.vy = BOOST;
    for (let i = 0; i < 3; i++) game.particles.push({ x: ROCKET_X - 4, y: game.y + 10, vx: -45 - Math.random() * 35, vy: Math.random() * 15 - 7, life: 0.28 });
    beep(300, 0.035);
  }, [beep]);

  const pause = useCallback(() => {
    const g = gameRef.current;
    if (g.phase === "playing") { g.phase = "paused"; setPhase("paused"); }
    else if (g.phase === "paused") { g.phase = "playing"; setPhase("playing"); lastFrameRef.current = 0; }
  }, []);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem("rocket-run-best") || 0);
      if (Number.isFinite(saved) && saved >= 0) { gameRef.current.best = saved; setBest(saved); }
    } catch { /* Storage can be disabled. */ }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const tick = (now: number) => {
      const g = gameRef.current;
      const dt = lastFrameRef.current ? Math.min(0.033, (now - lastFrameRef.current) / 1000) : 0;
      lastFrameRef.current = now;
      if (g.phase !== "paused") g.time += dt;
      if (g.phase === "playing") {
        g.vy += GRAVITY * dt;
        g.y += g.vy * dt;
        const speed = Math.min(92, 67 + g.score * 1.5);
        g.traveled += speed * dt;
        if (!g.obstacles.length || g.obstacles[g.obstacles.length - 1].x < WIDTH - SPACING) {
          g.obstacles.push({ x: WIDTH + 2, gapY: randomGap(), passed: false });
        }
        for (const o of g.obstacles) {
          o.x -= speed * dt;
          if (!o.passed && o.x + OBSTACLE_WIDTH < ROCKET_X) {
            o.passed = true;
            g.score++;
            setScore(g.score);
            beep(640, 0.065);
            if (g.score > g.best) {
              g.best = g.score;
              setBest(g.best);
              try { window.localStorage.setItem("rocket-run-best", String(g.best)); } catch { /* optional */ }
            }
          }
          const rLeft = ROCKET_X + 2;
          const rRight = ROCKET_X + ROCKET_W - 1;
          const rTop = g.y - 2;
          const rBottom = g.y + ROCKET_H + 1;
          if (rRight > o.x && rLeft < o.x + OBSTACLE_WIDTH && (rTop < o.gapY - GAP / 2 || rBottom > o.gapY + GAP / 2)) {
            g.phase = "over"; setPhase("over"); beep(110, 0.24);
          }
        }
        g.obstacles = g.obstacles.filter(o => o.x + OBSTACLE_WIDTH > -5);
        if (g.y < -4 || g.y + ROCKET_H > FLOOR) {
          g.y = Math.max(-4, Math.min(g.y, FLOOR - ROCKET_H));
          g.phase = "over"; setPhase("over"); beep(110, 0.24);
        }
      }
      if (g.phase !== "paused") {
        for (const p of g.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }
        g.particles = g.particles.filter(p => p.life > 0);
      }
      draw(ctx, g);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    const onHidden = () => {
      if (document.hidden && gameRef.current.phase === "playing") { gameRef.current.phase = "paused"; setPhase("paused"); }
      lastFrameRef.current = 0;
    };
    const onBlur = () => {
      if (gameRef.current.phase === "playing") { gameRef.current.phase = "paused"; setPhase("paused"); }
      lastFrameRef.current = 0;
    };
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("blur", onBlur);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("blur", onBlur);
      void audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, [beep]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (["Space", "ArrowUp", "KeyW"].includes(event.code)) {
        if (event.repeat) return;
        const target = event.target;
        if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName))) return;
        event.preventDefault();
        action();
      }
      if (event.code === "KeyP" || event.code === "Escape") {
        const target = event.target;
        if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
        pause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [action, pause]);

  return (
    <div className="rocket-game">
      <div className="rocket-game-top">
        <div className="rocket-game-indicator"><span className="rocket-game-pixel" /> 8-BIT ARCADE <span className="rocket-game-separator">/</span> {gameSettings.gameTitle}</div>
        <span className="rocket-game-chip">{phase === "playing" ? "IN FLIGHT" : phase === "paused" ? "PAUSED" : phase === "over" ? "CRASHED" : "READY"}</span>
      </div>
      <div className="rocket-game-stage">
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} role="img" aria-label="Pixel art rocket game. Guide a small astronaut on a rocket through openings between towers." onPointerDown={(e) => { e.preventDefault(); action(); }} />
      </div>
      <div className="rocket-game-scoreboard" aria-live="polite">
        <div><span>CURRENT SCORE</span><strong>{String(score).padStart(2, "0")}</strong></div>
        <div><span>PERSONAL BEST</span><strong>{String(best).padStart(2, "0")}</strong></div>
        <div><span>MISSION</span><strong>KEEP FLYING</strong></div>
      </div>
      <div className="rocket-game-controls">
        <button type="button" className="rocket-game-primary" onClick={action}>{phase === "over" ? <RotateCcw size={16}/> : phase === "paused" ? <Play size={16}/> : <ArrowUp size={16}/>} {phase === "over" ? "Retry" : phase === "ready" ? "Start game" : phase === "paused" ? "Resume" : "Boost"}</button>
        <button type="button" className="rocket-game-secondary" onClick={pause} disabled={phase === "ready" || phase === "over"} aria-label={phase === "paused" ? "Resume game" : "Pause game"}>{phase === "paused" ? <Play size={16}/> : <Pause size={16}/>} <span>{phase === "paused" ? "Resume" : "Pause"}</span></button>
        <button type="button" className="rocket-game-secondary" onClick={() => { const next = !soundRef.current; soundRef.current = next; setSound(next); }} aria-label={sound ? "Mute sound" : "Enable sound"}>{sound ? <Volume2 size={16}/> : <VolumeX size={16}/>} <span>{sound ? "Sound on" : "Sound off"}</span></button>
      </div>
      <p className="rocket-game-hint"><strong>HOW TO PLAY:</strong> Press <kbd>SPACE</kbd> / <kbd>↑</kbd> / <kbd>W</kbd>, or tap the game to boost. Fly through the gaps without hitting the towers or the ground. Press <kbd>P</kbd> to pause.</p>
    </div>
  );
}
