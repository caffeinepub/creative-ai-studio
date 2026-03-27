import { useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

const SKIN_TONES = [
  "#FDDBB4",
  "#E8B88A",
  "#C68642",
  "#8D5524",
  "#4A2912",
  "#FFEEDD",
];
const HAIRSTYLES = ["Short", "Long", "Curly", "Bald", "Braided"];
const CLOTHING = ["Casual", "Formal", "Sporty", "Fantasy", "Futuristic"];
const BACKGROUNDS = [
  { name: "Purple", gradient: ["#4c1d95", "#7c3aed"] },
  { name: "Ocean", gradient: ["#0c4a6e", "#0ea5e9"] },
  { name: "Sunset", gradient: ["#7c2d12", "#f97316"] },
  { name: "Forest", gradient: ["#14532d", "#22c55e"] },
  { name: "Neon", gradient: ["#1e1b4b", "#a855f7"] },
];
const CLOTHING_COLORS: Record<string, string> = {
  Casual: "#3b82f6",
  Formal: "#1e293b",
  Sporty: "#ef4444",
  Fantasy: "#8b5cf6",
  Futuristic: "#06b6d4",
};

function AvatarSVG({
  skinTone,
  hairstyle,
  clothingStyle,
  bgIdx,
  gender,
}: {
  skinTone: string;
  hairstyle: string;
  clothingStyle: string;
  bgIdx: number;
  gender: string;
}) {
  const bg = BACKGROUNDS[bgIdx];
  const clothColor = CLOTHING_COLORS[clothingStyle];
  const hairColor = "#4a3728";
  const hairPaths: Record<string, string> = {
    Short:
      "M 150 120 Q 150 80 200 80 Q 250 80 250 120 Q 240 90 200 88 Q 160 90 150 120",
    Long: "M 150 120 Q 150 70 200 70 Q 250 70 250 120 Q 245 85 200 82 Q 155 85 150 120 M 155 130 Q 140 200 145 250 M 245 130 Q 260 200 255 250",
    Curly:
      "M 148 115 Q 145 75 200 72 Q 255 75 252 115 Q 245 80 200 78 Q 155 80 148 115 M 148 115 Q 140 105 142 98 Q 155 100 155 115 M 252 115 Q 260 105 258 98 Q 245 100 245 115",
    Bald: "",
    Braided:
      "M 150 120 Q 150 72 200 70 Q 250 72 250 120 Q 240 88 200 86 Q 160 88 150 120 M 200 86 L 200 280 M 195 100 L 205 100 M 194 120 L 206 120 M 195 140 L 205 140",
  };
  return (
    <svg
      width="300"
      height="360"
      viewBox="0 0 300 360"
      style={{ borderRadius: 16, display: "block" }}
    >
      <title>Avatar Preview</title>
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg.gradient[0]} />
          <stop offset="100%" stopColor={bg.gradient[1]} />
        </linearGradient>
      </defs>
      <rect width="300" height="360" fill="url(#bgGrad)" />
      <rect x="130" y="230" width="40" height="80" rx="8" fill={clothColor} />
      {gender === "Female" ? (
        <ellipse cx="200" cy="270" rx="45" ry="65" fill={clothColor} />
      ) : (
        <rect
          x="155"
          y="228"
          width="90"
          height="100"
          rx="12"
          fill={clothColor}
        />
      )}
      <rect x="130" y="228" width="22" height="70" rx="10" fill={skinTone} />
      <rect x="148" y="228" width="22" height="70" rx="10" fill={clothColor} />
      <rect x="148" y="228" width="22" height="40" rx="10" fill={clothColor} />
      <rect x="250" y="228" width="22" height="70" rx="10" fill={skinTone} />
      <rect x="230" y="228" width="22" height="40" rx="10" fill={clothColor} />
      <rect x="188" y="205" width="24" height="30" rx="6" fill={skinTone} />
      <ellipse cx="200" cy="155" rx="54" ry="60" fill={skinTone} />
      <ellipse cx="183" cy="148" rx="7" ry="8" fill="white" />
      <ellipse cx="217" cy="148" rx="7" ry="8" fill="white" />
      <circle cx="185" cy="149" r="4" fill="#1e293b" />
      <circle cx="219" cy="149" r="4" fill="#1e293b" />
      <circle cx="186" cy="147" r="1.5" fill="white" />
      <circle cx="220" cy="147" r="1.5" fill="white" />
      <ellipse
        cx="200"
        cy="165"
        rx="4"
        ry="5"
        fill={skinTone}
        style={{ filter: "brightness(0.88)" }}
      />
      <path
        d="M 188 178 Q 200 188 212 178"
        fill="none"
        stroke="#c2665a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {hairstyle !== "Bald" && (
        <path d={hairPaths[hairstyle]} fill={hairColor} />
      )}
      <ellipse cx="147" cy="155" rx="10" ry="13" fill={skinTone} />
      <ellipse cx="253" cy="155" rx="10" ry="13" fill={skinTone} />
    </svg>
  );
}

export default function AvatarCreator() {
  const { actor } = useActor();
  const [skinTone, setSkinTone] = useState(SKIN_TONES[0]);
  const [hairstyle, setHairstyle] = useState("Short");
  const [clothing, setClothing] = useState("Casual");
  const [bgIdx, setBgIdx] = useState(0);
  const [gender, setGender] = useState("Male");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);
  const accent = "oklch(65% 0.28 340)";

  const saveAvatar = async () => {
    setSaving(true);
    try {
      await actor?.saveAvatar({
        name: `${gender} Avatar ${new Date().toLocaleDateString()}`,
        jsonConfig: JSON.stringify({
          skinTone,
          hairstyle,
          clothing,
          bgIdx,
          gender,
        }),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const download = () => {
    const svgEl = svgRef.current?.querySelector("svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 360;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "avatar.png";
        a.click();
        URL.revokeObjectURL(url);
      });
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  const randomize = () => {
    setSkinTone(SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)]);
    setHairstyle(HAIRSTYLES[Math.floor(Math.random() * HAIRSTYLES.length)]);
    setClothing(CLOTHING[Math.floor(Math.random() * CLOTHING.length)]);
    setBgIdx(Math.floor(Math.random() * BACKGROUNDS.length));
    setGender(["Male", "Female", "Non-binary"][Math.floor(Math.random() * 3)]);
    setSaved(false);
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 1000 }}>
      <h1 className="page-title neon-text-pink">👤 Avatar Creator</h1>
      <p className="page-subtitle">
        Design your unique digital avatar with live preview.
      </p>

      <div className="grid gap-7" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* Controls */}
        <div className="glass rounded-2xl p-7">
          {/* Gender */}
          <div className="mb-5">
            <span className="field-label mb-2" style={{ color: accent }}>
              Gender
            </span>
            <div className="flex gap-2 flex-wrap">
              {["Male", "Female", "Non-binary"].map((g) => (
                <button
                  type="button"
                  key={g}
                  data-ocid={`avatar.gender.${g.toLowerCase()}.button`}
                  onClick={() => {
                    setGender(g);
                    setSaved(false);
                  }}
                  className="btn text-xs"
                  style={{
                    border: `1px solid ${gender === g ? accent : "oklch(30% 0.05 260 / 0.4)"}`,
                    background:
                      gender === g
                        ? "oklch(65% 0.28 340 / 0.18)"
                        : "transparent",
                    color: gender === g ? accent : "oklch(58% 0.02 260)",
                    fontWeight: gender === g ? 600 : 400,
                    padding: "7px 14px",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Skin tone */}
          <div className="mb-5">
            <span className="field-label mb-2" style={{ color: accent }}>
              Skin Tone
            </span>
            <div className="flex gap-2.5">
              {SKIN_TONES.map((tone) => (
                <div
                  key={tone}
                  data-ocid="avatar.skin.button"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSkinTone(tone);
                    setSaved(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSkinTone(tone);
                      setSaved(false);
                    }
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: tone,
                    cursor: "pointer",
                    border:
                      skinTone === tone
                        ? `3px solid ${accent}`
                        : "3px solid transparent",
                    transition: "border 0.15s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Hairstyle */}
          <div className="mb-5">
            <span className="field-label mb-2" style={{ color: accent }}>
              Hairstyle
            </span>
            <div className="flex gap-2 flex-wrap">
              {HAIRSTYLES.map((h) => (
                <button
                  type="button"
                  key={h}
                  data-ocid="avatar.hairstyle.button"
                  onClick={() => {
                    setHairstyle(h);
                    setSaved(false);
                  }}
                  className="btn text-xs"
                  style={{
                    border: `1px solid ${hairstyle === h ? accent : "oklch(30% 0.05 260 / 0.4)"}`,
                    background:
                      hairstyle === h
                        ? "oklch(65% 0.28 340 / 0.18)"
                        : "transparent",
                    color: hairstyle === h ? accent : "oklch(58% 0.02 260)",
                    padding: "7px 14px",
                  }}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Clothing */}
          <div className="mb-5">
            <span className="field-label mb-2" style={{ color: accent }}>
              Clothing Style
            </span>
            <div className="flex gap-2 flex-wrap">
              {CLOTHING.map((c) => (
                <button
                  type="button"
                  key={c}
                  data-ocid="avatar.clothing.button"
                  onClick={() => {
                    setClothing(c);
                    setSaved(false);
                  }}
                  className="btn text-xs"
                  style={{
                    border: `1px solid ${clothing === c ? accent : "oklch(30% 0.05 260 / 0.4)"}`,
                    background:
                      clothing === c
                        ? "oklch(65% 0.28 340 / 0.18)"
                        : "transparent",
                    color: clothing === c ? accent : "oklch(58% 0.02 260)",
                    padding: "7px 14px",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div className="mb-6">
            <span className="field-label mb-2" style={{ color: accent }}>
              Background
            </span>
            <div className="flex gap-2.5">
              {BACKGROUNDS.map((bg, i) => (
                <div
                  key={bg.name}
                  title={bg.name}
                  data-ocid="avatar.background.button"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setBgIdx(i);
                    setSaved(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setBgIdx(i);
                      setSaved(false);
                    }
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `linear-gradient(135deg, ${bg.gradient[0]}, ${bg.gradient[1]})`,
                    cursor: "pointer",
                    border:
                      bgIdx === i
                        ? `3px solid ${accent}`
                        : "3px solid transparent",
                    transition: "border 0.15s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              data-ocid="avatar.randomize.button"
              onClick={randomize}
              className="btn"
              style={{
                border: `1px solid ${accent}40`,
                background: "oklch(65% 0.28 340 / 0.1)",
                color: accent,
              }}
            >
              🎲 Randomize
            </button>
            <button
              type="button"
              data-ocid="avatar.save.button"
              onClick={saveAvatar}
              disabled={saving || saved}
              className="btn"
              style={{
                border: `1px solid ${saved ? "oklch(65% 0.25 145 / 0.4)" : `${accent}40`}`,
                background: saved
                  ? "oklch(65% 0.25 145 / 0.1)"
                  : "oklch(65% 0.28 340 / 0.1)",
                color: saved ? "oklch(65% 0.25 145)" : accent,
              }}
            >
              {saving ? "Saving..." : saved ? "✓ Saved" : "💾 Save Avatar"}
            </button>
            <button
              type="button"
              data-ocid="avatar.download.button"
              onClick={download}
              className="btn btn-ghost"
            >
              ↓ Download PNG
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-4">
          <div ref={svgRef} style={{ borderRadius: 16, overflow: "hidden" }}>
            <AvatarSVG
              skinTone={skinTone}
              hairstyle={hairstyle}
              clothingStyle={clothing}
              bgIdx={bgIdx}
              gender={gender}
            />
          </div>
          <p
            className="text-xs text-center"
            style={{ color: "oklch(50% 0.02 260)" }}
          >
            Live preview updates in real-time
          </p>
        </div>
      </div>
    </div>
  );
}
