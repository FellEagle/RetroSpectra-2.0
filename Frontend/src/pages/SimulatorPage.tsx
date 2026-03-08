import React, { useState } from "react";
import { motion } from "framer-motion";
import { api } from "../api";

const SimulatorPage: React.FC = () => {
  const [scenario, setScenario] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const scenarios = [
    "What if the Roman Empire never fell?",
    "What if the Industrial Revolution started in China?",
    "What if Columbus never reached the Americas?",
    "What if World War I never happened?",
    "What if the Byzantine Empire survived?"
  ];

  const handleSimulate = async () => {
    if (!scenario.trim()) return;

    setLoading(true);
    try {
      const response = await api.post("/simulator/what-if", { scenario });
      setResult(response.data);
    } catch (error) {
      console.error("Simulator error:", error);
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
          What If Simulator
        </h1>
        <p className="text-soft/70">
          Explore alternate histories and counterfactual scenarios
        </p>
      </motion.div>

      <div className="glass-panel rounded-2xl p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-soft mb-2">
            Choose a scenario or write your own:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {scenarios.map((preset) => (
              <button
                key={preset}
                onClick={() => setScenario(preset)}
                className="text-left p-3 rounded-lg bg-white/5 border border-white/10 text-soft/70 hover:bg-white/10 hover:border-gold/30 transition text-sm"
              >
                {preset}
              </button>
            ))}
          </div>
          <textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Describe your alternate history scenario..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-soft placeholder-soft/40 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition resize-none"
            rows={4}
          />
        </div>
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold hover:from-gold/30 hover:to-gold/20 transition disabled:opacity-50"
        >
          {loading ? "Simulating..." : "Simulate History"}
        </button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-gold mb-4">Alternate History</h2>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-soft/70 leading-relaxed">
                {result.narrative}
              </div>
            </div>
          </div>

          {result.regions && result.regions.length > 0 && (
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gold mb-4">Affected Regions</h3>
              <div className="flex flex-wrap gap-2">
                {result.regions.map((region: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-gold/10 text-gold text-sm">
                    {region}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SimulatorPage;
