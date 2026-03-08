Retrospectra – AI Historical Intelligence Platform
==================================================

Retrospectra is a modern AI-powered web application that lets users explore history interactively through intelligent search, timelines, maps, simulations, and an AI historian assistant.

This project is structured as a full-stack app:

- `frontend`: React + TypeScript + Tailwind CSS + Framer Motion + Chart.js/D3 visualizations
- `backend`: Python + Flask + JWT auth + OpenAI + Wikipedia/Linked Data integrations

## Features (High-Level)

- AI historical search for events, civilizations, figures, wars, and inventions
- AI historian chatbot for conversational explanations and comparisons
- Interactive horizontal timelines with filters
- Historical map explorer with regions and battles
- AI “What If” alternate history simulator
- Knowledge graph of people/events/civilizations
- Gamified quiz mode with badges
- Admin dashboard and analytics
- Authentication with JWT (user/admin)
- Extras: voice narration hooks, bookmarks, exported notes, recommendations

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, Chart.js/D3.js
- **Backend**: Python, Flask, Flask-CORS, PyJWT, Requests, OpenAI API
- **Data Sources**: Wikipedia API, DBpedia, Wikidata (via HTTP APIs)

## Getting Started

This repo is scaffolded but may not have all dependencies installed yet. After cloning/opening it in your editor:

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python app.py
```

Then open the frontend dev server (e.g. `http://localhost:5173`) in your browser. The frontend is configured to talk to the backend on `http://localhost:8000` by default.

## Environment Variables

Create a `.env` file in `backend` using `.env.example` as a template:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
JWT_SECRET=change_this_secret_in_production
OPENAI_MODEL=gpt-4
WIKIPEDIA_API_ENDPOINT=https://en.wikipedia.org/api/rest_v1
PORT=8000
```

**Note**: The current version includes mock AI responses that work without API keys. To use real AI, add your API key.

## Demo Credentials

- Email: `admin@retrospectra.ai`
- Password: `admin123`

## Status

This scaffold sets up the core architecture for:

- A premium, dark-academic + AI dashboard UI
- Key pages (landing, search, chat, timeline, map, simulator, knowledge graph, quiz, admin)
- Flask API endpoints for AI-powered features and data

You can extend each feature with richer data, more visualizations, and production-ready persistence as needed.

