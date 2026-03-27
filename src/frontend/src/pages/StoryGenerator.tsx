import { useState } from "react";
import { useActor } from "../hooks/useActor";

const GENRES = ["Adventure", "Mystery", "Fantasy", "Sci-Fi", "Horror"];

const STORY_TEMPLATES: Record<
  string,
  (char: string, idea: string) => string[]
> = {
  Adventure: (c, i) => [
    `${c} stood at the edge of the ancient map, fingers tracing the faded ink that marked the beginning of an impossible journey. The village elders had warned against seeking ${i}, but the pull of destiny was stronger than fear.`,
    `Three days into the wilderness, the landscape shifted from familiar forests to jagged terrain unlike anything ${c} had ever seen. Strange symbols carved into stone pillars glowed faintly in the dim light — someone, or something, had been here before.`,
    `As twilight fell, a distant howl echoed across the valleys. ${c} gripped the worn leather satchel tightly, knowing that whatever lay ahead would test every ounce of courage and wit.`,
  ],
  Mystery: (c, i) => [
    `It was the kind of morning that felt like a lie. ${c} received the sealed envelope at dawn — inside, a single photograph and the words: "${i}." No signature. No return address.`,
    `The investigation led ${c} to a decaying mansion on the outskirts of the city. The door creaked open without a knock, as if the house had been expecting company. Dust motes drifted through shafts of pale light, illuminating a room frozen in time.`,
    `Every clue pointed to the same impossible conclusion. ${c} spread the evidence across the floor, connecting threads that shouldn't exist. Someone had gone to great lengths to hide the truth — and even greater lengths to make sure it would eventually be found.`,
  ],
  Fantasy: (c, i) => [
    `The prophecy had named ${c} as the Chosen — but no one had bothered to explain what that actually meant until the dragon landed in the marketplace and whispered a single name: ${i}.`,
    `Magic in this realm was not the fireworks and spectacle of legends. It was quiet, insistent, and it ran through ${c}'s veins like cold lightning. The ancient tome spoke of a balance that had been shattered centuries ago, and only one path led to restoration.`,
    `At the crossroads between realms, ${c} faced a choice that would echo through ages. The Spirit Guides offered power beyond imagination — but every gift in this world carried a price written in a language older than words.`,
  ],
  "Sci-Fi": (c, i) => [
    `Earth had been silent for eleven years when ${c} first detected the signal. Buried beneath terabytes of cosmic noise was a pattern — deliberate, mathematical, and unmistakably related to ${i}. The discovery would change everything.`,
    `The colony ship drifted through the outer belt, its crew of twelve staring at readouts that defied physics. ${c} ran the calculations a fourth time, arriving at the same impossible answer: they were not traveling through space. They were traveling through time.`,
    `In the haze of a terraformed atmosphere, ${c} found the relic — a device that predated human civilization by millennia. Its interface responded only to thought, unspooling visions of civilizations risen and fallen, all connected by one singular thread.`,
  ],
  Horror: (c, i) => [
    `Nobody believed ${c} at first. The dreams had started three weeks ago — vivid, suffocating nightmares all centered on ${i}. Then the scratching started at 3:17 every morning, always the same rhythm, always from the same wall.`,
    `The old caretaker's warning had seemed like superstition: "Never look at the reflection after midnight." But ${c} had looked, and what looked back was wearing ${c}'s face — wearing it the way a mask is worn, not quite right, smiling just a little too wide.`,
    `The house log showed no records after 1987. Yet every room held evidence of recent habitation — cold coffee, an unmade bed, a television showing static. ${c} reached for the light switch and the darkness reached back.`,
  ],
};

const CHOICES: Record<string, [string, string, string]> = {
  Adventure: [
    "Follow the glowing symbols deeper",
    "Set up camp and wait for dawn",
    "Retrace your steps to the last village",
  ],
  Mystery: [
    "Search the hidden room upstairs",
    "Follow the mysterious figure outside",
    "Decode the cipher in the photograph",
  ],
  Fantasy: [
    "Accept the Spirit Guide's gift",
    "Seek the Dragon's counsel",
    "Travel to the Forbidden Archive",
  ],
  "Sci-Fi": [
    "Transmit a response to the signal",
    "Activate the ancient device",
    "Alert the Galactic Council",
  ],
  Horror: [
    "Investigate the scratching in the wall",
    "Leave the house immediately",
    "Search for answers in the basement",
  ],
};

export default function StoryGenerator() {
  const { actor } = useActor();
  const [idea, setIdea] = useState("");
  const [genre, setGenre] = useState("Adventure");
  const [charName, setCharName] = useState("");
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState<string[][]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const generate = () => {
    if (!idea.trim() || !charName.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const tmpl = STORY_TEMPLATES[genre] || STORY_TEMPLATES.Adventure;
      setChapters([tmpl(charName, idea)]);
      setLoading(false);
      setSaved(false);
    }, 1800);
  };

  const choose = (choice: string) => {
    const tmpl = STORY_TEMPLATES[genre] || STORY_TEMPLATES.Adventure;
    const continuation = [
      `${charName} made the decision without hesitation: ${choice.toLowerCase()}. It was either the bravest or most foolish act in a life full of both.`,
      `The path unfolded in ways unexpected and wondrous. Every step seemed to rewrite the rules of the world, as though reality itself was improvising alongside ${charName}. The echoes of the original mission — ${idea} — grew louder, more urgent, more real.`,
      ...tmpl(charName, idea).slice(0, 1),
    ];
    setChapters((prev) => [...prev, continuation]);
  };

  const fullText = chapters
    .map((ch, i) => `Chapter ${i + 1}\n\n${ch.join("\n\n")}`)
    .join("\n\n---\n\n");
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;

  const download = () => {
    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${charName}-story.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveStory = async () => {
    setSaving(true);
    try {
      await actor?.saveStory({
        title: `${charName}'s ${genre} Story`,
        content: fullText,
        wordCount: BigInt(wordCount),
        createdAt: BigInt(Date.now()) * 1000000n,
        genre,
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const currentChoices = CHOICES[genre] || CHOICES.Adventure;
  const accent = "oklch(65% 0.28 290)";

  return (
    <div className="page-wrapper">
      <h1 className="page-title neon-text-purple">📖 Story Generator</h1>
      <p className="page-subtitle">
        Create branching interactive stories powered by AI narrative logic.
      </p>

      <div className="glass rounded-2xl p-7 mb-7">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="story-genre"
              className="field-label"
              style={{ color: accent }}
            >
              Genre
            </label>
            <select
              id="story-genre"
              data-ocid="story.genre.select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="field-control"
            >
              {GENRES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="story-char"
              className="field-label"
              style={{ color: accent }}
            >
              Character Name
            </label>
            <input
              id="story-char"
              data-ocid="story.character.input"
              value={charName}
              onChange={(e) => setCharName(e.target.value)}
              placeholder="e.g. Aria"
              className="field-control"
            />
          </div>
        </div>
        <div className="mb-5">
          <label
            htmlFor="story-idea"
            className="field-label"
            style={{ color: accent }}
          >
            Story Idea
          </label>
          <textarea
            id="story-idea"
            data-ocid="story.idea.textarea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your story idea, setting, or premise..."
            rows={3}
            className="field-control"
            style={{ resize: "vertical" }}
          />
        </div>
        <button
          type="button"
          data-ocid="story.generate.primary_button"
          onClick={generate}
          disabled={loading || !idea.trim() || !charName.trim()}
          className="btn"
          style={{
            background:
              "linear-gradient(135deg, oklch(65% 0.28 290), oklch(55% 0.28 290))",
            color: "white",
            border: "none",
            padding: "11px 26px",
            fontSize: 14,
            fontWeight: 700,
            opacity: loading || !idea.trim() || !charName.trim() ? 0.5 : 1,
          }}
        >
          {loading ? "⌛ Generating..." : "✨ Generate Story"}
        </button>
      </div>

      {chapters.length > 0 && (
        <div className="animate-fade-in-up">
          {chapters.map((ch, ci) => (
            <div
              key={ch[0]?.slice(0, 30) ?? ci.toString()}
              className="glass rounded-2xl p-7 mb-5"
              style={{ border: "1px solid oklch(65% 0.28 290 / 0.25)" }}
            >
              <div
                className="field-label mb-4"
                style={{ color: accent, letterSpacing: "0.12em" }}
              >
                Chapter {ci + 1}
              </div>
              {ch.map((para) => (
                <p
                  key={para.slice(0, 20)}
                  className="mb-3 leading-relaxed"
                  style={{ color: "oklch(84% 0.01 260)", fontSize: 15 }}
                >
                  {para}
                </p>
              ))}
            </div>
          ))}

          {chapters.length < 5 && (
            <div
              className="glass rounded-2xl p-6 mb-5"
              style={{ border: "1px solid oklch(65% 0.28 290 / 0.2)" }}
            >
              <p
                className="font-semibold mb-4"
                style={{ color: accent, fontSize: 14 }}
              >
                What happens next?
              </p>
              <div className="flex flex-col gap-2.5">
                {currentChoices.map((c, i) => (
                  <button
                    type="button"
                    key={c}
                    data-ocid={`story.choice.button.${i + 1}`}
                    onClick={() => choose(c)}
                    className="text-left px-4 py-3 rounded-xl transition-colors text-sm"
                    style={{
                      border: "1px solid oklch(65% 0.28 290 / 0.35)",
                      background: "oklch(65% 0.28 290 / 0.08)",
                      color: "oklch(80% 0.12 290)",
                      cursor: "pointer",
                    }}
                  >
                    {i + 1}. {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <span style={{ color: "oklch(52% 0.02 260)", fontSize: 13 }}>
              {wordCount} words
            </span>
            <button
              type="button"
              data-ocid="story.save.button"
              onClick={saveStory}
              disabled={saving || saved}
              className="btn"
              style={{
                border: "1px solid oklch(65% 0.28 290 / 0.4)",
                background: saved
                  ? "oklch(65% 0.25 145 / 0.15)"
                  : "oklch(65% 0.28 290 / 0.12)",
                color: saved ? "oklch(65% 0.25 145)" : accent,
              }}
            >
              {saving ? "Saving..." : saved ? "✓ Saved" : "💾 Save Story"}
            </button>
            <button
              type="button"
              data-ocid="story.download.button"
              onClick={download}
              className="btn btn-ghost"
            >
              ↓ Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
