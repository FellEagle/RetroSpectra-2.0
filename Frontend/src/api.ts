import axios from "axios";

export const api = axios.create({
  baseURL: "/api"
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("retrospectra-token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    } as any;
  }
  return config;
});

export interface HistoricalSearchResult {
  topic: string;
  overview?: string;
  timeline: { date: string; description: string }[];
  keyFigures: string[];
  causes: string[];
  consequences: string[];
  funFacts: string[];
}

