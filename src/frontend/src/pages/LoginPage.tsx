import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "oklch(8% 0.02 260)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎬</div>
        <h1
          className="gradient-title"
          style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}
        >
          Creative AI Studio
        </h1>
        <p
          style={{
            color: "oklch(60% 0.02 260)",
            marginBottom: 40,
            fontSize: 16,
          }}
        >
          Your futuristic AI-powered creative platform. Generate stories, games,
          avatars, movies, and music.
        </p>
        <div
          className="glass"
          style={{ borderRadius: 16, padding: 32, marginBottom: 24 }}
        >
          <p
            style={{
              color: "oklch(75% 0.02 260)",
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            Sign in with Internet Identity to save your creations and access all
            tools.
          </p>
          <button
            type="button"
            data-ocid="login.primary_button"
            onClick={login}
            disabled={isLoggingIn}
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: 10,
              border: "none",
              cursor: isLoggingIn ? "wait" : "pointer",
              background:
                "linear-gradient(135deg, oklch(65% 0.28 290), oklch(72% 0.22 200))",
              color: "white",
              fontWeight: 700,
              fontSize: 16,
              boxShadow: "0 0 24px oklch(65% 0.28 290 / 0.4)",
              transition: "all 0.2s",
            }}
          >
            {isLoggingIn ? "Connecting..." : "Sign In with Internet Identity"}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            "📖 Stories",
            "🎮 Games",
            "👤 Avatars",
            "🎬 Movies",
            "🎵 Music",
          ].map((t) => (
            <span
              key={t}
              style={{
                padding: "6px 12px",
                background: "oklch(20% 0.04 260 / 0.5)",
                borderRadius: 20,
                fontSize: 12,
                color: "oklch(70% 0.05 260)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
