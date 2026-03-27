import { useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV = [
  { path: "/", label: "Dashboard", icon: "🏠" },
  { path: "/story", label: "Story", icon: "📖" },
  { path: "/game", label: "Game", icon: "🎮" },
  { path: "/avatar", label: "Avatar", icon: "👤" },
  { path: "/movie", label: "Movie", icon: "🎬" },
  { path: "/music", label: "Music", icon: "🎵" },
  { path: "/saved", label: "Saved", icon: "💾" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const pathname = location.pathname;
  const { clear } = useInternetIdentity();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(8% 0.02 260)" }}
    >
      {/* ── Top Navbar ── */}
      <header
        className="sticky top-0 z-50 flex items-center gap-4 px-5 h-14"
        style={{
          background: "oklch(10% 0.025 260 / 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(25% 0.04 260 / 0.5)",
        }}
      >
        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.dashboard.link"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-2 flex-shrink-0 mr-2"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span className="text-xl">✨</span>
          <span
            className="gradient-title hidden sm:block"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            Creative AI
          </span>
        </button>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV.map((item) => {
            const active = pathname === item.path;
            return (
              <button
                type="button"
                key={item.path}
                data-ocid={`nav.${item.label.toLowerCase()}.link`}
                onClick={() => navigate({ to: item.path })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  background: active
                    ? "oklch(65% 0.28 290 / 0.15)"
                    : "transparent",
                  color: active ? "oklch(65% 0.28 290)" : "oklch(62% 0.02 260)",
                  border: "none",
                  borderBottom: active
                    ? "2px solid oklch(65% 0.28 290)"
                    : "2px solid transparent",
                  borderRadius: "6px 6px 0 0",
                  cursor: "pointer",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1 md:hidden" />

        {/* Mobile menu button */}
        <button
          type="button"
          data-ocid="nav.menu.toggle"
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-md"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            background: "oklch(18% 0.04 260 / 0.6)",
            border: "1px solid oklch(30% 0.05 260 / 0.4)",
            cursor: "pointer",
            color: "oklch(70% 0.02 260)",
            fontSize: 16,
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Logout */}
        <button
          type="button"
          data-ocid="nav.logout.button"
          onClick={clear}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium"
          style={{
            background: "oklch(15% 0.05 15 / 0.3)",
            border: "1px solid oklch(40% 0.1 15 / 0.35)",
            color: "oklch(62% 0.15 15)",
            cursor: "pointer",
          }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </header>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: "oklch(10% 0.025 260 / 0.97)",
            borderBottom: "1px solid oklch(25% 0.04 260 / 0.5)",
            padding: "8px 12px 12px",
          }}
        >
          {NAV.map((item) => {
            const active = pathname === item.path;
            return (
              <button
                type="button"
                key={item.path}
                onClick={() => {
                  navigate({ to: item.path });
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm mb-1"
                style={{
                  background: active
                    ? "oklch(65% 0.28 290 / 0.15)"
                    : "transparent",
                  color: active ? "oklch(65% 0.28 290)" : "oklch(65% 0.02 260)",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              clear();
              setMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm mt-2"
            style={{
              background: "oklch(15% 0.05 15 / 0.3)",
              border: "1px solid oklch(40% 0.1 15 / 0.35)",
              color: "oklch(62% 0.15 15)",
              cursor: "pointer",
            }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        className="text-center py-4 text-xs"
        style={{
          color: "oklch(40% 0.02 260)",
          borderTop: "1px solid oklch(20% 0.03 260 / 0.4)",
        }}
      >
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "oklch(55% 0.15 290)" }}
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
