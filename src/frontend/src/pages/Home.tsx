import { useNavigate } from "@tanstack/react-router";

const TOOLS = [
  {
    path: "/story",
    icon: "📖",
    name: "Story Generator",
    desc: "Create branching interactive stories with AI-driven narrative choices.",
    accent: "oklch(65% 0.28 290)",
    border: "oklch(65% 0.28 290 / 0.25)",
    bg: "oklch(65% 0.28 290 / 0.1)",
    ocid: "home.story_generator.button",
  },
  {
    path: "/game",
    icon: "🎮",
    name: "Game Creator",
    desc: "Play browser mini-games with custom themes, difficulty, and game types.",
    accent: "oklch(65% 0.25 145)",
    border: "oklch(65% 0.25 145 / 0.25)",
    bg: "oklch(65% 0.25 145 / 0.1)",
    ocid: "home.game_creator.button",
  },
  {
    path: "/avatar",
    icon: "👤",
    name: "Avatar Creator",
    desc: "Design your unique digital avatar with layered customization.",
    accent: "oklch(65% 0.28 340)",
    border: "oklch(65% 0.28 340 / 0.25)",
    bg: "oklch(65% 0.28 340 / 0.1)",
    ocid: "home.avatar_creator.button",
  },
  {
    path: "/movie",
    icon: "🎬",
    name: "Movie Creator",
    desc: "Generate cinematic storyboards and full scripts from your ideas.",
    accent: "oklch(70% 0.22 50)",
    border: "oklch(70% 0.22 50 / 0.25)",
    bg: "oklch(70% 0.22 50 / 0.1)",
    ocid: "home.movie_creator.button",
  },
  {
    path: "/music",
    icon: "🎵",
    name: "Music Composer",
    desc: "Compose original music tracks with mood-based tone sequences.",
    accent: "oklch(72% 0.22 200)",
    border: "oklch(72% 0.22 200 / 0.25)",
    bg: "oklch(72% 0.22 200 / 0.1)",
    ocid: "home.music_composer.button",
  },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1
          className="gradient-title mb-3"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 48,
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          Creative AI Studio
        </h1>
        <p
          style={{
            color: "oklch(58% 0.02 260)",
            fontSize: 17,
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          Five AI-powered tools to generate stories, games, avatars, movies, and
          music.
        </p>
      </div>

      {/* Tool grid */}
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {TOOLS.map((tool, i) => (
          <button
            type="button"
            key={tool.path}
            data-ocid={tool.ocid}
            onClick={() => navigate({ to: tool.path })}
            className="glass animate-fade-in-up text-left rounded-2xl p-6 cursor-pointer"
            style={{
              animationDelay: `${i * 60}ms`,
              border: `1px solid ${tool.border}`,
              background: "transparent",
              transition: "background 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = tool.bg;
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tool.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div className="text-4xl mb-4">{tool.icon}</div>
            <h3
              className="font-bold text-base mb-2"
              style={{ color: tool.accent }}
            >
              {tool.name}
            </h3>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "oklch(60% 0.02 260)" }}
            >
              {tool.desc}
            </p>
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-md"
              style={{
                border: `1px solid ${tool.accent}`,
                color: tool.accent,
                background: tool.bg,
              }}
            >
              Launch →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
