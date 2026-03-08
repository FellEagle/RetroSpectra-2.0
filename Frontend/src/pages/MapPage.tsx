import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../api";

interface MapRegion {
  id: string;
  name: string;
  type: string;
  bounds?: number[][];
  lat?: number;
  lng?: number;
  year?: number;
}

const MapPage: React.FC = () => {
  const [regions, setRegions] = useState<MapRegion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      const response = await api.get("/map");
      setRegions(response.data.regions);
    } catch (error) {
      console.error("Map error:", error);
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
          Historical Map Explorer
        </h1>
        <p className="text-soft/70">
          Explore historical events and empires on an interactive map
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gold mb-4">Map View</h2>
          <div className="aspect-video bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-soft/50">Interactive map would be rendered here</p>
              <p className="text-sm text-soft/30 mt-2">Integration with Leaflet/Mapbox</p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gold mb-4">Historical Locations</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-soft/50">Loading map data...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {regions.map((region) => (
                <motion.div
                  key={region.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-soft">{region.name}</h3>
                      <p className="text-sm text-soft/50 capitalize">{region.type}</p>
                      {region.year && (
                        <p className="text-xs text-soft/30">Year: {region.year}</p>
                      )}
                    </div>
                    <div className="text-gold/70">
                      {region.type === "empire" ? "🏛️" : "⚔️"}
                    </div>
                  </div>
                  {region.lat && region.lng && (
                    <p className="text-xs text-soft/30 mt-2">
                      Coordinates: {region.lat.toFixed(2)}, {region.lng.toFixed(2)}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
