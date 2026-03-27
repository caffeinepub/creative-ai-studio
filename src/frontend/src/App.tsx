import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AvatarCreator from "./pages/AvatarCreator";
import GameCreator from "./pages/GameCreator";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import MovieCreator from "./pages/MovieCreator";
import MusicComposer from "./pages/MusicComposer";
import SavedItems from "./pages/SavedItems";
import StoryGenerator from "./pages/StoryGenerator";

// Define root route with layout wrapper
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const storyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story",
  component: StoryGenerator,
});
const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game",
  component: GameCreator,
});
const avatarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/avatar",
  component: AvatarCreator,
});
const movieRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/movie",
  component: MovieCreator,
});
const musicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/music",
  component: MusicComposer,
});
const savedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/saved",
  component: SavedItems,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  storyRoute,
  gameRoute,
  avatarRoute,
  movieRoute,
  musicRoute,
  savedRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "oklch(8% 0.02 260)" }}
      >
        <div className="text-center">
          <div
            style={{
              width: 44,
              height: 44,
              border: "3px solid oklch(65% 0.28 290)",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 14px",
            }}
          />
          <p style={{ color: "oklch(58% 0.02 260)" }}>
            Loading Creative AI Studio...
          </p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  return <RouterProvider router={router} />;
}
