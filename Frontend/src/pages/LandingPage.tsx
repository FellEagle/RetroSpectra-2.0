import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-start">
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel gradient-border p-6 lg:p-10 relative overflow-hidden"
        >
          <div className="absolute -top-32 -right-24 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-10 w-64 h-64 rounded-full bg-gold/15 blur-3xl" />

          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 glass-chip px-3 py-1 text-xs text-soft/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live · AI Historical Intelligence
            </div>
            <h1 className="text-3xl lg:text-5xl font-display font-semibold leading-tight">
              Explore the <span className="text-gold">Intelligence</span> of History.
            </h1>
            <p className="text-sm lg:text-base text-soft/70 max-w-xl">
              Discover civilizations, events, and people through AI-powered insights, visual
              timelines, and an immersive historian assistant. A modern lab for understanding the
              past.
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/explore")}
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-soft text-navy text-sm font-medium shadow-lg shadow-accent/30 hover:bg-white transition"
              >
                Explore History
              </button>
              <button
                onClick={() => navigate("/chat")}
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-full glass-chip text-sm hover:bg-white/20 transition"
              >
                Start AI Search
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs text-soft/70">
              <div>
                <div className="font-semibold text-soft/90">Timelines</div>
                <div>Scroll centuries with interactive event ribbons.</div>
              </div>
              <div>
                <div className="font-semibold text-soft/90">Map Intelligence</div>
                <div>See empires, borders, and battles on a living globe.</div>
              </div>
              <div>
                <div className="font-semibold text-soft/90">What If</div>
                <div>Simulate alternate histories with AI.</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="glass-panel p-4 space-y-2">
            <div className="text-xs uppercase tracking-[0.18em] text-soft/60">AI Historian</div>
            <div className="font-display text-sm">Conversational explanations</div>
            <p className="text-xs text-soft/65">
              Ask “Why did WWI start?” or “Explain the Roman Empire simply” and get structured,
              contextual answers.
            </p>
          </div>
          <div className="glass-panel p-4 space-y-2">
            <div className="text-xs uppercase tracking-[0.18em] text-soft/60">
              Timelines & Graphs
            </div>
            <div className="font-display text-sm">Visual narratives</div>
            <p className="text-xs text-soft/65">
              Scroll across centuries, zoom into decades, and see how people, ideas, and empires
              connect.
            </p>
          </div>
          <div className="glass-panel p-4 space-y-2">
            <div className="text-xs uppercase tracking-[0.18em] text-soft/60">For Learners</div>
            <div className="font-display text-sm">Quiz & mastery</div>
            <p className="text-xs text-soft/65">
              Unlock badges as you master themes: Time Traveler, History Scholar, Empire Expert.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="space-y-4">
        <motion.div
          className="glass-panel p-5 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-soft/60">
                AI Search Console
              </div>
              <div className="text-sm font-display text-soft/90">
                Civilizations · Events · People · Wars
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <input
                placeholder="Search any event, empire, or figure…"
                className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm outline-none placeholder:text-soft/40 focus:border-accent/80 focus:ring-1 focus:ring-accent/60"
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-1 text-[10px] text-soft/50">
                <span className="glass-chip px-2 py-0.5">⌘K</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-soft/60">
              {["Roman Empire", "World War 2", "Mughal Empire", "Industrial Revolution"].map(
                (chip) => (
                  <button key={chip} className="glass-chip px-3 py-1 hover:bg-white/20 transition">
                    {chip}
                  </button>
                )
              )}
            </div>
          </div>

          <motion.div
            className="mt-6 aspect-[4/3] rounded-3xl bg-gradient-to-br from-navy/40 via-black/60 to-navy/80 border border-white/10 relative overflow-hidden flex items-center justify-center"
            initial={{ rotate: 8, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="absolute inset-10 rounded-full border border-white/10" />
            <div className="absolute inset-16 rounded-full border border-white/10 border-dashed" />
            <motion.div
              className="absolute w-6 h-6 rounded-full bg-accent shadow-lg shadow-accent/70"
              animate={{ y: [0, -10, 0], x: [0, 12, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-4 h-4 rounded-full bg-gold shadow-lg shadow-gold/60"
              animate={{ y: [10, -6, 8], x: [-18, 0, 14] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative text-center px-6">
              <div className="text-xs uppercase tracking-[0.18em] text-soft/50">
                Historical Globe
              </div>
              <div className="mt-1 font-display text-sm text-soft/90">
                3D orbit of key civilizations
              </div>
              <p className="mt-2 text-[11px] text-soft/60">
                In the full experience this becomes an interactive globe: rotate through eras,
                tap regions, and see empires expand and fade.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

