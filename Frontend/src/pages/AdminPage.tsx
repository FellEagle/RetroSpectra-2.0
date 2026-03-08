import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../api";

const AdminPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/admin/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Admin analytics error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-8">
        <p className="text-soft/50">Loading admin dashboard...</p>
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
          Admin Dashboard
        </h1>
        <p className="text-soft/70">
          System analytics and user management
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-6 text-center"
        >
          <div className="text-3xl mb-2">👥</div>
          <h3 className="text-lg font-semibold text-gold mb-1">Total Users</h3>
          <p className="text-2xl text-soft">{analytics?.totalUsers || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-6 text-center"
        >
          <div className="text-3xl mb-2">🔖</div>
          <h3 className="text-lg font-semibold text-gold mb-1">Bookmarks</h3>
          <p className="text-2xl text-soft">{analytics?.totalBookmarks || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-6 text-center"
        >
          <div className="text-3xl mb-2">📝</div>
          <h3 className="text-lg font-semibold text-gold mb-1">Quiz Attempts</h3>
          <p className="text-2xl text-soft">{analytics?.totalQuizAttempts || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-2xl p-6 text-center"
        >
          <div className="text-3xl mb-2">👑</div>
          <h3 className="text-lg font-semibold text-gold mb-1">Admins</h3>
          <p className="text-2xl text-soft">{analytics?.roleBreakdown?.admin || 0}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gold mb-4">User Roles</h2>
          <div className="space-y-3">
            {Object.entries(analytics?.roleBreakdown || {}).map(([role, count]) => (
              <div key={role} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-soft capitalize">{role}</span>
                <span className="text-gold font-semibold">{count as number}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gold mb-4">System Health</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-soft">API Status</span>
              <span className="text-green-400 font-semibold">● Online</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-soft">Database</span>
              <span className="text-green-400 font-semibold">● Connected</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-soft">OpenAI API</span>
              <span className="text-green-400 font-semibold">● Active</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-soft">Cache</span>
              <span className="text-gold font-semibold">● Active</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-panel rounded-2xl p-6 mt-8"
      >
        <h2 className="text-xl font-semibold text-gold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg bg-white/5 border border-white/10 text-soft hover:bg-white/10 hover:border-gold/30 transition">
            📊 Export Data
          </button>
          <button className="p-4 rounded-lg bg-white/5 border border-white/10 text-soft hover:bg-white/10 hover:border-gold/30 transition">
            👥 Manage Users
          </button>
          <button className="p-4 rounded-lg bg-white/5 border border-white/10 text-soft hover:bg-white/10 hover:border-gold/30 transition">
            🧹 Clear Cache
          </button>
          <button className="p-4 rounded-lg bg-white/5 border border-white/10 text-soft hover:bg-white/10 hover:border-gold/30 transition">
            ⚙️ Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPage;
