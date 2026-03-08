import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../api";

interface GraphNode {
  id: string;
  label: string;
  type: string;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
}

const GraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      const response = await api.get("/graph");
      setNodes(response.data.nodes);
      setLinks(response.data.links);
    } catch (error) {
      console.error("Graph error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-display font-bold text-gold mb-4">
          Knowledge Graph
        </h1>
        <p className="text-soft/70">
          Explore connections between historical events, figures, and concepts
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gold mb-4">Interactive Graph</h2>
          <div className="aspect-video bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
            <div className="text-center">
              <div className="text-4xl mb-2">🕸️</div>
              <p className="text-soft/50">Interactive knowledge graph</p>
              <p className="text-sm text-soft/30 mt-2">D3.js visualization</p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gold mb-4">Graph Data</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-soft/50">Loading graph data...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-soft mb-2">Nodes ({nodes.length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {nodes.map((node) => (
                    <div key={node.id} className="flex items-center gap-2 text-sm">
                      <span className={`w-2 h-2 rounded-full ${
                        node.type === "person" ? "bg-blue-400" :
                        node.type === "event" ? "bg-gold" :
                        node.type === "region" ? "bg-green-400" : "bg-gray-400"
                      }`} />
                      <span className="text-soft/70">{node.label}</span>
                      <span className="text-soft/30 text-xs">({node.type})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-soft mb-2">Connections ({links.length})</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {links.map((link, idx) => (
                    <div key={idx} className="text-xs text-soft/50">
                      <span className="text-soft/70">{link.source}</span>
                      <span className="mx-2 text-gold">→</span>
                      <span className="text-soft/70">{link.target}</span>
                      <span className="ml-2 text-soft/30">({link.label})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
