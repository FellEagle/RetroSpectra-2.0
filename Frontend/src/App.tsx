import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeProvider, useTheme } from "./theme";
import { LandingPage } from "./pages/LandingPage";
import SearchPage from "./pages/SearchPage";
import HistorianChatPage from "./pages/HistorianChatPage";
import TimelinePage from "./pages/TimelinePage";
import MapPage from "./pages/MapPage";
import SimulatorPage from "./pages/SimulatorPage";
import GraphPage from "./pages/GraphPage";
import QuizPage from "./pages/QuizPage";
import DashboardPage from "./pages/DashboardPage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/chat", label: "Ask the Historian" },
  { to: "/timeline", label: "Timeline" },
  { to: "/map", label: "Map" },
  { to: "/simulator", label: "What If" },
  { to: "/graph", label: "Knowledge Graph" },
  { to: "/quiz", label: "Quiz" },
  { to: "/dashboard", label: "Dashboard" }
];

const AppShell: React.FC = () => {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-navy text-soft bg-radial-glow relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60 hero-orbit" />
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-soft/60">
                Retrospectra
              </div>
              <div className="text-lg font-display font-semibold">AI Historical Lab</div>
            </div>
            <button
              onClick={toggle}
              className="glass-chip w-9 h-9 flex items-center justify-center text-xs hover:bg-white/20 transition"
            >
              {theme === "dark" ? "☾" : "☼"}
            </button>
          </div>
          <nav className="flex-1 px-3 space-y-1 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition",
                    "hover:bg-white/10 hover:text-soft",
                    isActive ? "bg-white/15 text-gold" : "text-soft/70"
                  ].join(" ")
                }
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="px-6 py-4 text-xs text-soft/50 border-t border-white/10">
            “ChatGPT + Wikipedia + Museum”
          </div>
        </aside>
        <main className="flex-1 flex flex-col">
          <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 glass-panel rounded-none">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-soft/60">
                Retrospectra
              </div>
              <div className="text-base font-display font-semibold">
                AI Historical Intelligence
              </div>
            </div>
            <button
              onClick={toggle}
              className="glass-chip w-9 h-9 flex items-center justify-center text-xs hover:bg-white/20 transition"
            >
              {theme === "dark" ? "☾" : "☼"}
            </button>
          </header>
          <motion.div
            className="flex-1 p-4 lg:p-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<SearchPage />} />
              <Route path="/chat" element={<HistorianChatPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/simulator" element={<SimulatorPage />} />
              <Route path="/graph" element={<GraphPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
};

export default App;

