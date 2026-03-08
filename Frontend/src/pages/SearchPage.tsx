import React, { useState } from "react";
import { motion } from "framer-motion";
import { api } from "../api";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.post("/search/historical", { query });
      setResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-display font-bold text-gold mb-4">
          Historical Search
        </h1>
        <p className="text-soft/70">
          Explore any historical topic with AI-powered intelligence
        </p>
      </motion.div>

      <div className="glass-panel rounded-2xl p-6 mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter a historical topic, event, or figure..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-soft placeholder-soft/40 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold hover:from-gold/30 hover:to-gold/20 transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-gold mb-4">{results.topic}</h2>
            {results.overview && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-soft mb-2">Overview</h3>
                <p className="text-soft/70 leading-relaxed">{results.overview}</p>
              </div>
            )}
            
            {results.timeline && results.timeline.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-soft mb-3">Timeline</h3>
                <div className="space-y-2">
                  {results.timeline.map((event: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-3 rounded-lg bg-white/5">
                      <span className="text-gold font-mono text-sm">{event.date}</span>
                      <span className="text-soft/70">{event.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {results.keyFigures && results.keyFigures.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-soft mb-3">Key Figures</h3>
                <div className="flex flex-wrap gap-2">
                  {results.keyFigures.map((figure: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-gold/10 text-gold text-sm">
                      {figure}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchPage;
