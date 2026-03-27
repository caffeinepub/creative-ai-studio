import { useState } from "react";
import { useActor } from "../hooks/useActor";

const GENRES = ["Action", "Comedy", "Sci-Fi", "Horror", "Romance", "Fantasy"];
const DURATIONS = ["30 sec", "1 min", "2 min"];
const STYLES = ["Cinematic", "Cartoon", "Anime", "Realistic"];
const MOOD_COLORS: Record<string, string> = {
  Action: "#ef4444",
  Comedy: "#f59e0b",
  "Sci-Fi": "#3b82f6",
  Horror: "#1e1b4b",
  Romance: "#ec4899",
  Fantasy: "#8b5cf6",
};

function generateStoryboard(idea: string, genre: string, style: string) {
  const mood = MOOD_COLORS[genre] || "#6366f1";
  const templates = [
    {
      title: "Opening Shot",
      desc: `A sweeping ${style.toLowerCase()} establishing shot sets the tone. The world of ${idea} is introduced with breathtaking visual scale and atmosphere.`,
    },
    {
      title: "Character Introduction",
      desc: `Our protagonist emerges from the chaos, defined by the weight of ${idea}. The ${genre.toLowerCase()} genre's signature tension crackles in every frame.`,
    },
    {
      title: "Rising Action",
      desc: `The central conflict of ${idea} escalates. Rapid cuts and dynamic camera work keep the pace electric. The ${style} aesthetic elevates every moment.`,
    },
    {
      title: "The Twist",
      desc: `Everything changes. The true nature of ${idea} is revealed in a stunning sequence that recontextualizes all that came before.`,
    },
    {
      title: "Climax",
      desc: `The confrontation the entire story has been building toward. Maximum drama, maximum stakes. The ${genre} energy reaches its peak.`,
    },
    {
      title: "Resolution",
      desc: `Aftermath and reflection. The world reshaped by the events of ${idea}. A final shot that lingers in memory.`,
    },
  ];
  return templates.map((t) => ({ ...t, mood }));
}

function generateScript(
  idea: string,
  genre: string,
  style: string,
  duration: string,
) {
  return `CREATIVE AI STUDIO - GENERATED SCREENPLAY
${idea.toUpperCase()}

Genre: ${genre} | Style: ${style} | Duration: ${duration}
Written by AI Story Engine

---

FADE IN:

EXT. ESTABLISHING LOCATION - DAY

A ${style.toLowerCase()} wide shot reveals the world of "${idea}". 
The visual language is unmistakably ${genre.toLowerCase()}.

NARRATOR (V.O.)
  Every story begins with a single moment. This is that moment.

INT. MAIN LOCATION - CONTINUOUS

We meet our protagonist. Their face carries the weight 
of everything that brought them here -- to this precipice, 
this impossible choice, this moment that defines them.

PROTAGONIST
  (quietly, with resolve)
  This is what it all comes down to.

The camera PULLS BACK to reveal the full scope of ${idea}.
The ${genre.toLowerCase()} stakes are now impossible to ignore.

CUT TO:

EXT. CONFRONTATION POINT - DUSK

The climax sequence. Everything the story has built toward.
The ${style} cinematography reaches its visual peak --
frames composed with mathematical precision and emotional truth.

PROTAGONIST
  (with conviction)
  Some things are worth every sacrifice.

SMASH CUT TO:

INT. AFTERMATH - NIGHT

The world after. Different. Changed. The theme of "${idea}"
fully crystallized in a single haunting image.

FADE TO BLACK.

TITLE CARD: ${idea.toUpperCase()}

FADE OUT.

                                                    THE END`;
}

export default function MovieCreator() {
  const { actor } = useActor();
  const [idea, setIdea] = useState("");
  const [genre, setGenre] = useState("Action");
  const [duration, setDuration] = useState("1 min");
  const [style, setStyle] = useState("Cinematic");
  const [loading, setLoading] = useState(false);
  const [scenes, setScenes] = useState<
    Array<{ title: string; desc: string; mood: string }>
  >([]);
  const [script, setScript] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const accent = "oklch(70% 0.22 50)";

  const generate = () => {
    if (!idea.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setScenes(generateStoryboard(idea, genre, style));
      setScript(generateScript(idea, genre, style, duration));
      setLoading(false);
      setSaved(false);
    }, 2000);
  };

  const download = () => {
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${idea.slice(0, 20)}-script.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveMovie = async () => {
    setSaving(true);
    try {
      await actor?.saveMovie({
        title: idea.slice(0, 60),
        script,
        style,
        genre,
        prompt: idea,
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 1000 }}>
      <h1 className="page-title neon-text-orange">🎬 Movie Creator</h1>
      <p className="page-subtitle">
        Generate cinematic storyboards and full screenplays from your ideas.
      </p>

      <div className="glass rounded-2xl p-7 mb-7">
        <div className="mb-4">
          <label
            htmlFor="movie-idea"
            className="field-label"
            style={{ color: accent }}
          >
            Movie Idea
          </label>
          <textarea
            id="movie-idea"
            data-ocid="movie.idea.textarea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your movie concept, plot, setting, or story idea..."
            rows={3}
            className="field-control"
            style={{ resize: "vertical" }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          {(
            [
              ["Genre", GENRES, genre, setGenre, "movie.genre.select"],
              [
                "Duration",
                DURATIONS,
                duration,
                setDuration,
                "movie.duration.select",
              ],
              ["Style", STYLES, style, setStyle, "movie.style.select"],
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
          data-ocid="movie.generate.primary_button"
          onClick={generate}
          disabled={loading || !idea.trim()}
          className="btn"
          style={{
            background:
              "linear-gradient(135deg, oklch(70% 0.22 50), oklch(60% 0.25 30))",
            color: "white",
            border: "none",
            padding: "11px 26px",
            fontSize: 14,
            fontWeight: 700,
            opacity: loading || !idea.trim() ? 0.5 : 1,
          }}
        >
          {loading ? "🎬 Generating Storyboard..." : "🎬 Generate Movie"}
        </button>
      </div>

      {scenes.length > 0 && (
        <div className="animate-fade-in-up">
          <h2 className="font-bold mb-4" style={{ color: accent }}>
            Storyboard
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 mb-7 scrollbar-hide">
            {scenes.map((scene, i) => (
              <div
                key={scene.title}
                className="glass rounded-2xl p-5 flex-shrink-0"
                style={{ minWidth: 220, border: `1px solid ${scene.mood}40` }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 90,
                    borderRadius: 8,
                    background: `linear-gradient(135deg, ${scene.mood}28, ${scene.mood}0a)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                    border: `1px solid ${scene.mood}25`,
                    fontSize: 26,
                  }}
                >
                  {["🌅", "🎭", "⚡", "🌀", "💥", "🌙"][i]}
                </div>
                <div
                  className="field-label mb-1.5"
                  style={{ color: scene.mood, letterSpacing: "0.1em" }}
                >
                  Scene {i + 1}
                </div>
                <div
                  className="font-bold text-sm mb-2"
                  style={{ color: "oklch(84% 0.01 260)" }}
                >
                  {scene.title}
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "oklch(58% 0.02 260)" }}
                >
                  {scene.desc}
                </p>
              </div>
            ))}
          </div>

          <h2 className="font-bold mb-4" style={{ color: accent }}>
            Generated Script
          </h2>
          <div className="glass rounded-2xl p-7 mb-5">
            <pre
              className="leading-loose whitespace-pre-wrap"
              style={{
                color: "oklch(78% 0.01 260)",
                fontSize: 13,
                fontFamily: "'Courier New', monospace",
              }}
            >
              {script}
            </pre>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              data-ocid="movie.save.button"
              onClick={saveMovie}
              disabled={saving || saved}
              className="btn"
              style={{
                border: `1px solid ${saved ? "oklch(65% 0.25 145 / 0.4)" : `${accent.replace(")", " / 0.4)")}`}`,
                background: saved
                  ? "oklch(65% 0.25 145 / 0.1)"
                  : "oklch(70% 0.22 50 / 0.1)",
                color: saved ? "oklch(65% 0.25 145)" : accent,
              }}
            >
              {saving ? "Saving..." : saved ? "✓ Saved" : "💾 Save Movie"}
            </button>
            <button
              type="button"
              data-ocid="movie.download.button"
              onClick={download}
              className="btn btn-ghost"
            >
              ↓ Download Script
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
