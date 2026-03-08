import React, { useState } from "react";
import { motion } from "framer-motion";
import { api } from "../api";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await api.post(endpoint, { email, password });
      
      localStorage.setItem("retrospectra-token", response.data.token);
      window.location.href = "/dashboard";
    } catch (error: any) {
      setError(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gold mb-2">
            {isLogin ? "Welcome Back" : "Join RetroSpectra"}
          </h1>
          <p className="text-soft/70">
            {isLogin ? "Sign in to continue your journey" : "Start your historical exploration"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-soft mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-soft placeholder-soft/40 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-soft mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-soft placeholder-soft/40 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold hover:from-gold/30 hover:to-gold/20 transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-soft/50">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-gold hover:text-gold/80 transition"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        {!isLogin && (
          <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-soft/50 text-center">
              Demo admin credentials: admin@retrospectra.ai / admin123
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthPage;
