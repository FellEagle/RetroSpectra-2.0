import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../api";

interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  century: number;
  category: string;
  summary: string;
}

const TimelinePage: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, [category]);

  const fetchTimeline = async () => {
    try {
      const response = await api.get(`/timeline?category=${category}`);
      setEvents(response.data.events);
    } catch (error) {
      console.error("Timeline error:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", "civilizations", "discoveries", "wars"];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-display font-bold text-gold mb-4">
          Interactive Timeline
        </h1>
        <p className="text-soft/70">
          Explore historical events across different categories and time periods
        </p>
      </motion.div>

      <div className="glass-panel rounded-2xl p-6 mb-8">
        <div className="flex gap-4 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg capitalize transition ${
                category === cat
                  ? "bg-gold/20 text-gold border border-gold/30"
                  : "bg-white/5 text-soft/70 border border-white/10 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-soft/50">Loading timeline...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel rounded-2xl p-6 relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold/30 rounded-l-2xl" />
              <div className="ml-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gold">{event.title}</h3>
                    <p className="text-soft/50 text-sm font-mono">{event.date}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-sm capitalize">
                    {event.category}
                  </span>
                </div>
                <p className="text-soft/70 leading-relaxed">{event.summary}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimelinePage;
