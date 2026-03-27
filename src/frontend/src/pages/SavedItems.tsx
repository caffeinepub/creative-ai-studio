import { useEffect, useState } from "react";
import type { AvatarConfig, MovieStoryboard, Story } from "../backend.d";
import { useActor } from "../hooks/useActor";

export default function SavedItems() {
  const { actor } = useActor();
  const [tab, setTab] = useState<"stories" | "avatars" | "movies">("stories");
  const [stories, setStories] = useState<Story[]>([]);
  const [avatars, setAvatars] = useState<AvatarConfig[]>([]);
  const [movies, setMovies] = useState<MovieStoryboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!actor) {
      setLoading(false);
      return;
    }
    actor
      .getAllUserItems()
      .then(([s, a, m]) => {
        setStories(s);
        setAvatars(a);
        setMovies(m);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const deleteStory = async (title: string) => {
    await actor?.deleteStory(title);
    setStories((prev) => prev.filter((s) => s.title !== title));
  };

  const deleteAvatar = async (name: string) => {
    await actor?.deleteAvatar(name);
    setAvatars((prev) => prev.filter((a) => a.name !== name));
  };

  const deleteMovie = async (title: string) => {
    await actor?.deleteMovie(title);
    setMovies((prev) => prev.filter((m) => m.title !== title));
  };

  const TABS = [
    { key: "stories", label: "📖 Stories", count: stories.length },
    { key: "avatars", label: "👤 Avatars", count: avatars.length },
    { key: "movies", label: "🎬 Movies", count: movies.length },
  ] as const;

  return (
    <div style={{ padding: "40px 32px", maxWidth: 860, margin: "0 auto" }}>
      <h1
        className="gradient-title"
        style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}
      >
        💾 Saved Items
      </h1>
      <p style={{ color: "oklch(60% 0.02 260)", marginBottom: 32 }}>
        Your saved creations from all tools.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {TABS.map((t) => (
          <button
            type="button"
            key={t.key}
            data-ocid={`saved.${t.key}.tab`}
            onClick={() => setTab(t.key)}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: `1px solid ${tab === t.key ? "oklch(65% 0.28 290)" : "oklch(30% 0.05 260 / 0.4)"}`,
              background:
                tab === t.key ? "oklch(65% 0.28 290 / 0.2)" : "transparent",
              color:
                tab === t.key ? "oklch(65% 0.28 290)" : "oklch(60% 0.02 260)",
              cursor: "pointer",
              fontWeight: tab === t.key ? 600 : 400,
              fontSize: 14,
            }}
          >
            {t.label}{" "}
            {t.count > 0 && (
              <span
                style={{
                  padding: "2px 7px",
                  borderRadius: 10,
                  background: "oklch(65% 0.28 290 / 0.3)",
                  marginLeft: 6,
                  fontSize: 11,
                }}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div
          data-ocid="saved.loading_state"
          style={{
            textAlign: "center",
            padding: 60,
            color: "oklch(55% 0.02 260)",
          }}
        >
          Loading your saved items...
        </div>
      ) : (
        <div>
          {tab === "stories" &&
            (stories.length === 0 ? (
              <div
                data-ocid="saved.stories.empty_state"
                className="glass"
                style={{
                  borderRadius: 14,
                  padding: 40,
                  textAlign: "center",
                  color: "oklch(50% 0.02 260)",
                }}
              >
                No saved stories yet. Generate one in the Story Generator!
              </div>
            ) : (
              stories.map((s, i) => (
                <div
                  key={s.title}
                  data-ocid={`saved.story.item.${i + 1}`}
                  className="glass"
                  style={{
                    borderRadius: 14,
                    padding: 20,
                    marginBottom: 12,
                    border: "1px solid oklch(65% 0.28 290 / 0.2)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "oklch(85% 0.01 260)",
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      {s.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "oklch(55% 0.02 260)",
                        display: "flex",
                        gap: 12,
                      }}
                    >
                      <span>{s.genre}</span>
                      <span>{s.wordCount.toString()} words</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    data-ocid={`saved.story.delete_button.${i + 1}`}
                    onClick={() => deleteStory(s.title)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid oklch(55% 0.2 15 / 0.4)",
                      background: "transparent",
                      color: "oklch(55% 0.15 15)",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            ))}
          {tab === "avatars" &&
            (avatars.length === 0 ? (
              <div
                data-ocid="saved.avatars.empty_state"
                className="glass"
                style={{
                  borderRadius: 14,
                  padding: 40,
                  textAlign: "center",
                  color: "oklch(50% 0.02 260)",
                }}
              >
                No saved avatars yet. Create one in the Avatar Creator!
              </div>
            ) : (
              avatars.map((a, i) => (
                <div
                  key={a.name}
                  data-ocid={`saved.avatar.item.${i + 1}`}
                  className="glass"
                  style={{
                    borderRadius: 14,
                    padding: 20,
                    marginBottom: 12,
                    border: "1px solid oklch(65% 0.28 340 / 0.2)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{ color: "oklch(85% 0.01 260)", fontWeight: 700 }}
                  >
                    {a.name}
                  </div>
                  <button
                    type="button"
                    data-ocid={`saved.avatar.delete_button.${i + 1}`}
                    onClick={() => deleteAvatar(a.name)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid oklch(55% 0.2 15 / 0.4)",
                      background: "transparent",
                      color: "oklch(55% 0.15 15)",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            ))}
          {tab === "movies" &&
            (movies.length === 0 ? (
              <div
                data-ocid="saved.movies.empty_state"
                className="glass"
                style={{
                  borderRadius: 14,
                  padding: 40,
                  textAlign: "center",
                  color: "oklch(50% 0.02 260)",
                }}
              >
                No saved movies yet. Generate one in the Movie Creator!
              </div>
            ) : (
              movies.map((m, i) => (
                <div
                  key={m.title}
                  data-ocid={`saved.movie.item.${i + 1}`}
                  className="glass"
                  style={{
                    borderRadius: 14,
                    padding: 20,
                    marginBottom: 12,
                    border: "1px solid oklch(70% 0.22 50 / 0.2)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "oklch(85% 0.01 260)",
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      {m.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "oklch(55% 0.02 260)",
                        display: "flex",
                        gap: 12,
                      }}
                    >
                      <span>{m.genre}</span>
                      <span>{m.style}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    data-ocid={`saved.movie.delete_button.${i + 1}`}
                    onClick={() => deleteMovie(m.title)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid oklch(55% 0.2 15 / 0.4)",
                      background: "transparent",
                      color: "oklch(55% 0.15 15)",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            ))}
        </div>
      )}
    </div>
  );
}
