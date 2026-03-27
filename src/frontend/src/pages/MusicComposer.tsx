import { useEffect, useRef, useState } from "react";

const MOODS = ["Happy", "Sad", "Relaxing", "Energetic", "Romantic", "Epic"];
const GENRES = ["Pop", "Classical", "EDM", "Jazz", "Lo-fi", "Cinematic"];
const TEMPOS = ["Slow", "Medium", "Fast"];
const INSTRUMENTS = ["Piano", "Guitar", "Orchestra", "Synth"];

const MOOD_SEQUENCES: Record<string, number[]> = {
  Happy: [523, 659, 784, 1047, 784, 659, 523, 659, 784, 880, 784, 659],
  Sad: [440, 415, 392, 370, 349, 330, 311, 294, 277, 262, 247, 220],
  Relaxing: [261, 329, 392, 440, 392, 329, 261, 293, 349, 392, 349, 293],
  Energetic: [880, 988, 1047, 880, 784, 880, 988, 1047, 1175, 1047, 880, 784],
  Romantic: [349, 440, 523, 587, 659, 587, 523, 440, 392, 440, 494, 523],
  Epic: [220, 246, 261, 293, 329, 370, 392, 440, 494, 523, 587, 659],
};

const TEMPO_BPM: Record<string, number> = { Slow: 60, Medium: 100, Fast: 150 };
const WAVE_TYPES: Record<string, OscillatorType> = {
  Piano: "sine",
  Guitar: "sawtooth",
  Orchestra: "triangle",
  Synth: "square",
};
const MOOD_COLORS: Record<string, string> = {
  Happy: "oklch(75% 0.22 85)",
  Sad: "oklch(55% 0.18 240)",
  Relaxing: "oklch(65% 0.18 180)",
  Energetic: "oklch(70% 0.25 30)",
  Romantic: "oklch(65% 0.28 340)",
  Epic: "oklch(65% 0.28 290)",
};

const BAR_IDS = Array.from({ length: 40 }, (_, i) => `waveform-bar-${i}`);

export default function MusicComposer() {
  const [mood, setMood] = useState("Happy");
  const [genre, setGenre] = useState("Pop");
  const [tempo, setTempo] = useState("Medium");
  const [instrument, setInstrument] = useState("Piano");
  const [playing, setPlaying] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(40).fill(0.1));
  const stopRef = useRef<() => void>(() => {});
  const animRef = useRef<number>(0);
  const accent = MOOD_COLORS[mood] || "oklch(72% 0.22 200)";

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setGenerated(true);
      setLoading(false);
    }, 1500);
  };

  const play = () => {
    if (playing) {
      stopRef.current();
      return;
    }
    const ctx = new AudioContext();
    const notes = MOOD_SEQUENCES[mood];
    const bpm = TEMPO_BPM[tempo];
    const noteDur = 60 / bpm;
    const waveType = WAVE_TYPES[instrument];
    let t = ctx.currentTime;
    const oscillators: OscillatorNode[] = [];
    for (let rep = 0; rep < 3; rep++) {
      for (const freq of notes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + noteDur * 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + noteDur);
        oscillators.push(osc);
        t += noteDur;
      }
    }
    setPlaying(true);
    const animLoop = () => {
      setBars(
        Array.from({ length: 40 }, (_, i) => {
          const baseFreq = notes[i % notes.length];
          return (
            0.1 +
            0.9 *
              Math.abs(Math.sin(Date.now() / (200 + baseFreq / 20) + i * 0.4))
          );
        }),
      );
      animRef.current = requestAnimationFrame(animLoop);
    };
    animRef.current = requestAnimationFrame(animLoop);
    const totalDur = notes.length * 3 * noteDur * 1000;
    const timer = setTimeout(() => stopRef.current(), totalDur);
    stopRef.current = () => {
      clearTimeout(timer);
      cancelAnimationFrame(animRef.current);
      for (const o of oscillators) {
        try {
          o.stop();
        } catch {}
      }
      ctx.close();
      setPlaying(false);
      setBars(Array(40).fill(0.1));
    };
  };

  useEffect(
    () => () => {
      stopRef.current();
    },
    [],
  );

  return (
    <div className="page-wrapper">
      <h1 className="page-title neon-text-cyan">🎵 Music Composer</h1>
      <p className="page-subtitle">
        Compose original music with mood-based tone sequences using your
        browser.
      </p>

      <div className="glass rounded-2xl p-7 mb-7">
        <div className="grid grid-cols-2 gap-4 mb-5">
          {(
            [
              ["Mood", MOODS, mood, setMood, "music.mood.select"],
              ["Genre", GENRES, genre, setGenre, "music.genre.select"],
              ["Tempo", TEMPOS, tempo, setTempo, "music.tempo.select"],
              [
                "Instrument",
                INSTRUMENTS,
                instrument,
                setInstrument,
                "music.instrument.select",
              ],
            ] as const
          ).map(([label, opts, val, setter, ocid]) => (
            <div key={label}>
              <span
                className="field-label"
                style={{ color: "oklch(72% 0.22 200)", display: "block" }}
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
          data-ocid="music.generate.primary_button"
          onClick={generate}
          disabled={loading}
          className="btn"
          style={{
            background:
              "linear-gradient(135deg, oklch(72% 0.22 200), oklch(60% 0.25 230))",
            color: "white",
            border: "none",
            padding: "11px 26px",
            fontSize: 14,
            fontWeight: 700,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "🎵 Composing..." : "🎵 Generate Music"}
        </button>
      </div>

      {generated && (
        <div className="animate-fade-in-up">
          <div
            className="glass rounded-2xl p-7 mb-5"
            style={{ border: `1px solid ${accent}25` }}
          >
            <div className="flex items-center gap-3 flex-wrap mb-5">
              <span className="font-bold" style={{ color: accent }}>
                {mood} {genre}
              </span>
              {[`${tempo} Tempo`, instrument].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: `${accent.replace(")", " / 0.18)")}`,
                    color: accent,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Waveform */}
            <div
              className="flex items-end gap-0.5 rounded-xl overflow-hidden mb-6"
              style={{
                height: 96,
                padding: "10px 14px",
                background: "oklch(10% 0.03 260)",
              }}
            >
              {bars.map((h, i) => (
                <div
                  key={BAR_IDS[i]}
                  style={{
                    flex: 1,
                    background: `linear-gradient(to top, ${accent}, ${accent.replace(")", " / 0.5)")})`,
                    borderRadius: 2,
                    height: `${h * 100}%`,
                    transition: playing ? "height 0.08s" : "height 0.3s",
                  }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                data-ocid="music.play.button"
                onClick={play}
                className="flex items-center justify-center flex-shrink-0 rounded-full text-xl transition-all"
                style={{
                  width: 52,
                  height: 52,
                  border: `2px solid ${accent}`,
                  background: playing
                    ? `${accent.replace(")", " / 0.25)")}`
                    : `${accent.replace(")", " / 0.12)")}`,
                  color: accent,
                  cursor: "pointer",
                }}
              >
                {playing ? "⏸" : "▶️"}
              </button>
              <div className="flex-1">
                <p
                  className="text-xs mb-2"
                  style={{ color: "oklch(58% 0.02 260)" }}
                >
                  {playing ? "Now playing..." : "Press play to listen"}
                </p>
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: "oklch(20% 0.04 260)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      background: accent,
                      width: playing ? "60%" : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="glass rounded-xl p-4"
            style={{ border: "1px solid oklch(28% 0.04 260 / 0.3)" }}
          >
            <p className="text-xs" style={{ color: "oklch(50% 0.02 260)" }}>
              💾 Download is available for premium users. Music is generated
              live in your browser using Web Audio API with{" "}
              {instrument.toLowerCase()} waveforms tuned to a{" "}
              {mood.toLowerCase()} {genre.toLowerCase()} progression.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
