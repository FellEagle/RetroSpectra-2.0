import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../api";

const DashboardPage: React.FC = () => {
  const [userStats, setUserStats] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [meRes, bookmarksRes, recRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/bookmarks"),
        api.get("/recommendations")
      ]);
      
      setUserStats(meRes.data);
      setBookmarks(bookmarksRes.data.bookmarks || []);
      setRecommendations(recRes.data.recommendations || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-8">
        <p className="text-soft/50">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-display font-bold text-gold mb-4">
          Your Dashboard
        </h1>
        <p className="text-soft/70">
          Track your learning progress and achievements
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-6 text-center"
        >
          <div className="text-3xl mb-2">📚</div>
          <h3 className="text-lg font-semibold text-gold mb-1">Bookmarks</h3>
          <p className="text-2xl text-soft">{bookmarks.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-6 text-center"
        >
          <div className="text-3xl mb-2">🏆</div>
          <h3 className="text-lg font-semibold text-gold mb-1">Achievements</h3>
          <p className="text-2xl text-soft">{userStats?.achievements?.length || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-6 text-center"
        >
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="text-lg font-semibold text-gold mb-1">Quiz Score</h3>
          <p className="text-2xl text-soft">85%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-2xl p-6 text-center"
        >
          <div className="text-3xl mb-2">🔥</div>
          <h3 className="text-lg font-semibold text-gold mb-1">Streak</h3>
          <p className="text-2xl text-soft">7 days</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gold mb-4">Recent Bookmarks</h2>
          {bookmarks.length === 0 ? (
            <p className="text-soft/50 text-center py-8">
              No bookmarks yet. Start exploring and bookmark interesting topics!
            </p>
          ) : (
            <div className="space-y-3">
              {bookmarks.slice(0, 5).map((bookmark, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-soft">{bookmark.topic || bookmark.title || "Untitled"}</p>
                  <p className="text-xs text-soft/30 mt-1">
                    {new Date(bookmark.timestamp || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gold mb-4">Recommended Topics</h2>
          {recommendations.length === 0 ? (
            <p className="text-soft/50 text-center py-8">
              Start exploring to get personalized recommendations!
            </p>
          ) : (
            <div className="space-y-2">
              {recommendations.map((topic, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 rounded-lg bg-white/5 border border-white/10 text-soft hover:bg-white/10 hover:border-gold/30 transition"
                >
                  📖 {topic}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {userStats?.achievements && userStats.achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-panel rounded-2xl p-6 mt-8"
        >
          <h2 className="text-xl font-semibold text-gold mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userStats.achievements.map((achievement: string, idx: number) => (
              <div key={idx} className="text-center p-4 rounded-lg bg-gold/10 border border-gold/30">
                <div className="text-2xl mb-2">🏅</div>
                <p className="text-sm text-gold capitalize">{achievement.replace(/_/g, " ")}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;
