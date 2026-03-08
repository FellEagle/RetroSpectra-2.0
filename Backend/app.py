import os
import datetime
from functools import wraps

from cachetools import TTLCache
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import jwt
import requests
from openai import OpenAI


load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.config["JWT_SECRET"] = os.getenv("JWT_SECRET", "change_this_secret")
    app.config["JWT_ALGORITHM"] = "HS256"
    app.config["OPENAI_MODEL"] = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
    app.config["WIKIPEDIA_API_ENDPOINT"] = os.getenv(
        "WIKIPEDIA_API_ENDPOINT", "https://en.wikipedia.org/api/rest_v1"
    )

    app.openai_client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
        base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    )

    # Simple in-memory stores (replace with DB in production)
    app.users = {
        # demo admin
        "admin@retrospectra.ai": {
            "password": "admin123",  # DO NOT use plaintext in production
            "role": "admin",
            "bookmarks": [],
            "achievements": [],
        }
    }
    app.bookmarks = {}
    app.quiz_results = {}

    # Cache for Wikipedia summaries (topic -> summary)
    app.wiki_cache = TTLCache(maxsize=512, ttl=60 * 60)  # 1 hour

    register_routes(app)
    return app


def generate_jwt(app: Flask, email: str, role: str) -> str:
    payload = {
        "sub": email,
        "role": role,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=8),
    }
    token = jwt.encode(
        payload, app.config["JWT_SECRET"], algorithm=app.config["JWT_ALGORITHM"]
    )
    # pyjwt >= 2 returns str already, but keep this safe
    return token if isinstance(token, str) else token.decode("utf-8")


def decode_jwt(app: Flask, token: str):
    return jwt.decode(
        token,
        app.config["JWT_SECRET"],
        algorithms=[app.config["JWT_ALGORITHM"]],
    )


def auth_required(role: str | None = None):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            from flask import current_app

            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"error": "Missing or invalid Authorization header"}), 401

            token = auth_header.split(" ", 1)[1]
            try:
                payload = decode_jwt(current_app, token)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token"}), 401

            if role is not None and payload.get("role") != role:
                return jsonify({"error": "Insufficient permissions"}), 403

            request.user = {
                "email": payload.get("sub"),
                "role": payload.get("role"),
            }
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def fetch_wikipedia_summary(app: Flask, topic: str) -> str:
    cached = app.wiki_cache.get(topic.lower())
    if cached:
        return cached

    endpoint = app.config["WIKIPEDIA_API_ENDPOINT"]
    url = f"{endpoint}/page/summary/{requests.utils.quote(topic)}"
    try:
        resp = requests.get(url, timeout=8)
        if resp.status_code == 200:
            data = resp.json()
            summary = data.get("extract") or ""
            app.wiki_cache[topic.lower()] = summary
            return summary
    except Exception:
        pass
    return ""


def openai_structured_history(app: Flask, prompt: str, topic: str):
    """
    Mock AI response for historical intelligence - no API key required
    """
    # Mock responses for common topics
    mock_responses = {
        "roman empire": {
            "overview": "The Roman Empire was one of the largest empires in history, spanning from 27 BC to 476 AD in the West and 1453 AD in the East.",
            "timeline": [
                {"date": "27 BC", "description": "Augustus becomes first Roman Emperor"},
                {"date": "117 AD", "description": "Roman Empire reaches its greatest extent under Trajan"},
                {"date": "476 AD", "description": "Fall of the Western Roman Empire"}
            ],
            "key_figures": ["Julius Caesar", "Augustus", "Trajan", "Constantine"],
            "causes": ["Military conquest", "Political reforms", "Economic expansion"],
            "consequences": ["Spread of Roman law", "Christianity", "Latin language"],
            "fun_facts": ["Roman concrete is still used today", "Romans invented central heating"]
        },
        "world war": {
            "overview": "World War II was a global conflict from 1939-1945 involving most of the world's nations.",
            "timeline": [
                {"date": "1939", "description": "Germany invades Poland, starting WWII"},
                {"date": "1941", "description": "Pearl Harbor attack, US enters war"},
                {"date": "1945", "description": "Germany surrenders, war ends in Europe"}
            ],
            "key_figures": ["Winston Churchill", "Franklin D. Roosevelt", "Adolf Hitler", "Joseph Stalin"],
            "causes": ["Treaty of Versailles", "Expansionist policies", "Economic depression"],
            "consequences": ["United Nations formation", "Cold War", "Decolonization"],
            "fun_facts": ["Over 70 million people died", "First nuclear weapons used"]
        }
    }
    
    topic_lower = topic.lower()
    for key, response in mock_responses.items():
        if key in topic_lower:
            return response
    
    # Default response for unknown topics
    return {
        "overview": f"{topic} was a significant historical period that shaped our world in profound ways. Through extensive research and analysis, historians continue to uncover new insights about this fascinating subject.",
        "timeline": [
            {"date": "Unknown", "description": "Major historical events occurred"},
            {"date": "Unknown", "description": "Further developments followed"}
        ],
        "key_figures": ["Important historical figures", "Key leaders", "Influential individuals"],
        "causes": ["Complex historical factors", "Multiple contributing elements"],
        "consequences": ["Lasting historical impact", "Significant changes"],
        "fun_facts": ["Interesting historical details", "Notable trivia"]
    }


def openai_chat(app: Flask, messages: list[dict]):
    """
    Mock AI chat responses - no API key required
    """
    # Get the last user message
    user_message = ""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            user_message = msg.get("content", "").lower()
            break
    
    # Mock responses for common questions
    if "roman" in user_message:
        return "The Roman Empire was one of history's most influential civilizations. It began as a small city-state in Italy and grew to dominate the Mediterranean world for centuries. Key achievements include aqueducts, roads, concrete, and legal systems that still influence us today."
    elif "world war" in user_message or "wwii" in user_message:
        return "World War II (1939-1945) was the deadliest conflict in human history. It involved over 30 countries and resulted in 70-85 million fatalities. The war saw major technological advancements and led to the formation of the United Nations."
    elif "napoleon" in user_message:
        return "Napoleon Bonaparte was a French military leader and emperor who rose to prominence during the French Revolution. He conquered much of Europe before his final defeat at Waterloo in 1815. His legal reforms, the Napoleonic Code, still influence many legal systems today."
    elif "renaissance" in user_message:
        return "The Renaissance was a period of cultural, artistic, and scientific rebirth in Europe from the 14th to 17th centuries. It began in Italy and spread northward, producing master artists like Leonardo da Vinci, Michelangelo, and writers like Shakespeare."
    else:
        return f"That's a fascinating historical question! Based on the topic '{user_message}', I can tell you that this represents an important area of historical study. Historians continue to research and discover new insights about this subject. Would you like me to elaborate on any specific aspect?"


def register_routes(app: Flask):
    @app.get("/")
    def root():
        return jsonify({
            "message": "RetroSpectra Backend API",
            "version": "1.0.0",
            "status": "running",
            "endpoints": {
                "health": "/api/health",
                "auth": "/api/auth/*",
                "search": "/api/search/historical",
                "chat": "/api/chat/historian",
                "timeline": "/api/timeline",
                "map": "/api/map",
                "simulator": "/api/simulator/what-if",
                "graph": "/api/graph",
                "quiz": "/api/quiz",
                "bookmarks": "/api/bookmarks",
                "recommendations": "/api/recommendations",
                "admin": "/api/admin/analytics"
            }
        })

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "retrospectra-backend"})

    # ---------- AUTH ----------

    @app.post("/api/auth/register")
    def register():
        data = request.get_json() or {}
        email = data.get("email", "").lower().strip()
        password = data.get("password", "")
        role = data.get("role", "user")

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        if email in app.users:
            return jsonify({"error": "User already exists"}), 400

        app.users[email] = {
            "password": password,
            "role": "admin" if role == "admin" else "user",
            "bookmarks": [],
            "achievements": [],
        }
        token = generate_jwt(app, email, app.users[email]["role"])
        return jsonify({"token": token, "role": app.users[email]["role"]})

    @app.post("/api/auth/login")
    def login():
        data = request.get_json() or {}
        email = data.get("email", "").lower().strip()
        password = data.get("password", "")
        user = app.users.get(email)
        if not user or user["password"] != password:
            return jsonify({"error": "Invalid credentials"}), 401
        token = generate_jwt(app, email, user["role"])
        return jsonify({"token": token, "role": user["role"]})

    @app.get("/api/auth/me")
    @auth_required()
    def me():
        user = app.users.get(request.user["email"], {})
        return jsonify(
            {
                "email": request.user["email"],
                "role": request.user["role"],
                "bookmarks": user.get("bookmarks", []),
                "achievements": user.get("achievements", []),
            }
        )

    # ---------- AI HISTORICAL SEARCH ----------

    @app.post("/api/search/historical")
    def historical_search():
        data = request.get_json() or {}
        query = data.get("query", "").strip()
        if not query:
            return jsonify({"error": "Query required"}), 400

        structured = openai_structured_history(
            app,
            prompt="Provide a historical intelligence profile.",
            topic=query,
        )
        return jsonify(
            {
                "topic": query,
                "overview": structured.get("overview"),
                "timeline": structured.get("timeline", []),
                "keyFigures": structured.get("key_figures", []),
                "causes": structured.get("causes", []),
                "consequences": structured.get("consequences", []),
                "funFacts": structured.get("fun_facts", []),
            }
        )

    # ---------- AI HISTORIAN CHATBOT ----------

    @app.post("/api/chat/historian")
    def chat_historian():
        data = request.get_json() or {}
        history = data.get("history", [])
        question = data.get("question", "").strip()
        topic_hint = data.get("topic", "").strip()

        messages = [
            {
                "role": "system",
                "content": (
                    "You are 'The Historian', a precise, engaging AI historian. "
                    "Answer with clear structure, headings, and suggestions for related topics. "
                    "Be accurate and cite eras and regions explicitly."
                ),
            }
        ]
        for turn in history:
            role = turn.get("role")
            if role not in ("user", "assistant"):
                continue
            messages.append({"role": role, "content": turn.get("content", "")})

        if topic_hint:
            wiki_context = fetch_wikipedia_summary(app, topic_hint)
            if wiki_context:
                messages.append(
                    {
                        "role": "system",
                        "content": f"Context from Wikipedia for {topic_hint}: {wiki_context}",
                    }
                )

        messages.append({"role": "user", "content": question})
        answer = openai_chat(app, messages)

        # Simple heuristic related topics suggestion via secondary call (can be optimized)
        suggestions = openai_chat(
            app,
            [
                {
                    "role": "system",
                    "content": (
                        "Given a question and its answer, list 5 related historical topics "
                        "as a comma-separated string."
                    ),
                },
                {
                    "role": "user",
                    "content": f"Question: {question}\nAnswer: {answer}",
                },
            ],
        )

        related = [s.strip() for s in suggestions.split(",") if s.strip()]
        return jsonify({"answer": answer, "relatedTopics": related})

    # ---------- INTERACTIVE TIMELINE ----------

    @app.get("/api/timeline")
    def timeline():
        category = request.args.get("category", "all")
        # Static demo data; in production query DB/knowledge base
        events = [
            {
                "id": 1,
                "title": "Fall of Western Roman Empire",
                "date": "0476-09-04",
                "century": 5,
                "category": "civilizations",
                "summary": "Deposition of Romulus Augustulus, marking the end of the Western Roman Empire.",
            },
            {
                "id": 2,
                "title": "Printing Press Invented",
                "date": "1450-01-01",
                "century": 15,
                "category": "discoveries",
                "summary": "Johannes Gutenberg develops the movable-type printing press.",
            },
            {
                "id": 3,
                "title": "Battle of Waterloo",
                "date": "1815-06-18",
                "century": 19,
                "category": "wars",
                "summary": "Napoleon Bonaparte's final defeat in Belgium.",
            },
            {
                "id": 4,
                "title": "World War II Ends",
                "date": "1945-09-02",
                "century": 20,
                "category": "wars",
                "summary": "Formal surrender of Japan aboard USS Missouri.",
            },
        ]
        if category != "all":
            events = [e for e in events if e["category"] == category]
        return jsonify({"events": events})

    # ---------- HISTORICAL MAP EXPLORER ----------

    @app.get("/api/map")
    def map_data():
        # Static demo markers; frontend will overlay on Leaflet/Mapbox
        regions = [
            {
                "id": "roman_empire_peak",
                "name": "Roman Empire (c. 117 CE)",
                "type": "empire",
                "bounds": [[51.5, -10.0], [25.0, 40.0]],
            },
            {
                "id": "battle_waterloo",
                "name": "Battle of Waterloo",
                "type": "battle",
                "lat": 50.6806,
                "lng": 4.4125,
                "year": 1815,
            },
            {
                "id": "stalingrad",
                "name": "Battle of Stalingrad",
                "type": "battle",
                "lat": 48.708,
                "lng": 44.513,
                "year": 1942,
            },
        ]
        return jsonify({"regions": regions})

    # ---------- AI "WHAT IF" SIMULATOR ----------

    @app.post("/api/simulator/what-if")
    def what_if():
        data = request.get_json() or {}
        scenario = data.get("scenario", "").strip()
        if not scenario:
            return jsonify({"error": "Scenario description required"}), 400

        prompt = (
            "You are an expert counterfactual historian. Given a 'what if' scenario, "
            "construct an alternate history with: (1) brief divergence point, "
            "(2) alternate timeline (chronological bullet list with dates), "
            "(3) geopolitical consequences, (4) social/cultural impact, "
            "(5) how the world in 2025 differs. Label speculation clearly."
        )
        content = openai_chat(
            app,
            [
                {"role": "system", "content": prompt},
                {"role": "user", "content": scenario},
            ],
        )

        # An additional lightweight call can summarize for maps if needed
        map_hint = openai_chat(
            app,
            [
                {
                    "role": "system",
                    "content": (
                        "Given an alternate history narrative, summarize up to 5 key "
                        "regions where borders or influence would change. "
                        "Return them as 'Region - brief description' separated by commas."
                    ),
                },
                {"role": "user", "content": content},
            ],
        )
        regions = [s.strip() for s in map_hint.split(",") if s.strip()]
        return jsonify({"narrative": content, "regions": regions})

    # ---------- KNOWLEDGE GRAPH ----------

    @app.get("/api/graph")
    def knowledge_graph():
        # Simple demo knowledge graph centered around Napoleon and related events
        nodes = [
            {"id": "napoleon", "label": "Napoleon Bonaparte", "type": "person"},
            {"id": "french_revolution", "label": "French Revolution", "type": "event"},
            {"id": "napoleonic_wars", "label": "Napoleonic Wars", "type": "event"},
            {"id": "europe", "label": "Europe", "type": "region"},
            {"id": "waterloo", "label": "Battle of Waterloo", "type": "event"},
        ]
        links = [
            {"source": "napoleon", "target": "french_revolution", "label": "rose_after"},
            {"source": "napoleon", "target": "napoleonic_wars", "label": "led"},
            {"source": "napoleonic_wars", "target": "europe", "label": "reshaped"},
            {"source": "napoleon", "target": "waterloo", "label": "defeated_at"},
        ]
        return jsonify({"nodes": nodes, "links": links})

    # ---------- QUIZ & GAMIFICATION ----------

    BASE_BADGES = [
        {"id": "time_traveler", "name": "Time Traveler", "description": "Completed first quiz"},
        {"id": "history_scholar", "name": "History Scholar", "description": "Score 80%+ on hard quiz"},
        {"id": "empire_expert", "name": "Empire Expert", "description": "Perfect score on empire quiz"},
    ]

    @app.get("/api/quiz")
    def quiz():
        difficulty = request.args.get("difficulty", "medium")
        # Static pool; in production, generate via AI with constraints
        questions = [
            {
                "id": "q1",
                "question": "Which year is commonly taken as the fall of the Western Roman Empire?",
                "options": ["395 CE", "410 CE", "476 CE", "529 CE"],
                "answerIndex": 2,
                "difficulty": "easy",
            },
            {
                "id": "q2",
                "question": "Which invention is most associated with Johannes Gutenberg?",
                "options": ["Compass", "Printing press", "Steam engine", "Gunpowder"],
                "answerIndex": 1,
                "difficulty": "easy",
            },
            {
                "id": "q3",
                "question": "The Treaty of Versailles formally ended which major conflict?",
                "options": [
                    "Napoleonic Wars",
                    "World War I",
                    "World War II",
                    "Thirty Years' War",
                ],
                "answerIndex": 1,
                "difficulty": "medium",
            },
        ]
        filtered = [q for q in questions if q["difficulty"] == difficulty] or questions
        return jsonify({"questions": filtered})

    @app.post("/api/quiz/submit")
    @auth_required()
    def submit_quiz():
        data = request.get_json() or {}
        answers = data.get("answers", {})
        score = data.get("score", 0)
        difficulty = data.get("difficulty", "medium")

        email = request.user["email"]
        user = app.users.get(email)
        if not user:
            return jsonify({"error": "User not found"}), 404

        history = app.quiz_results.setdefault(email, [])
        history.append(
            {
                "score": score,
                "difficulty": difficulty,
                "timestamp": datetime.datetime.utcnow().isoformat(),
            }
        )

        # Simple achievement logic
        unlocked = []
        if score > 0 and "time_traveler" not in user["achievements"]:
            user["achievements"].append("time_traveler")
            unlocked.append("time_traveler")
        if difficulty == "hard" and score >= 0.8 and "history_scholar" not in user["achievements"]:
            user["achievements"].append("history_scholar")
            unlocked.append("history_scholar")
        if "empire" in "".join(str(v) for v in answers.values()).lower() and score == 1.0:
            if "empire_expert" not in user["achievements"]:
                user["achievements"].append("empire_expert")
                unlocked.append("empire_expert")

        return jsonify({"score": score, "unlockedBadges": unlocked})

    # ---------- BOOKMARKS & RECOMMENDATIONS ----------

    @app.post("/api/bookmarks")
    @auth_required()
    def add_bookmark():
        data = request.get_json() or {}
        item = data.get("item")
        if not item:
            return jsonify({"error": "Bookmark item required"}), 400
        email = request.user["email"]
        user = app.users.get(email)
        if not user:
            return jsonify({"error": "User not found"}), 404

        user.setdefault("bookmarks", []).append(item)
        return jsonify({"bookmarks": user["bookmarks"]})

    @app.get("/api/bookmarks")
    @auth_required()
    def list_bookmarks():
        email = request.user["email"]
        user = app.users.get(email, {})
        return jsonify({"bookmarks": user.get("bookmarks", [])})

    @app.get("/api/recommendations")
    @auth_required()
    def recommendations():
        email = request.user["email"]
        user = app.users.get(email, {})
        bookmarks = user.get("bookmarks", [])

        # Very simple recommendation: AI summarizes + suggests next topics
        topics_str = ", ".join(str(b.get("topic", "")) for b in bookmarks if isinstance(b, dict))
        if not topics_str:
            return jsonify({"recommendations": []})

        suggestion_text = openai_chat(
            app,
            [
                {
                    "role": "system",
                    "content": (
                        "Given a list of historical topics a learner liked, "
                        "suggest 5 new topics or questions to explore. "
                        "Return them as a comma-separated list only."
                    ),
                },
                {"role": "user", "content": topics_str},
            ],
        )
        recs = [s.strip() for s in suggestion_text.split(",") if s.strip()]
        return jsonify({"recommendations": recs})

    # ---------- ADMIN DASHBOARD ----------

    @app.get("/api/admin/analytics")
    @auth_required(role="admin")
    def admin_analytics():
        total_users = len(app.users)
        total_bookmarks = sum(len(u.get("bookmarks", [])) for u in app.users.values())
        total_quizzes = sum(len(q) for q in app.quiz_results.values())

        by_role = {}
        for u in app.users.values():
            r = u.get("role", "user")
            by_role[r] = by_role.get(r, 0) + 1

        return jsonify(
            {
                "totalUsers": total_users,
                "roleBreakdown": by_role,
                "totalBookmarks": total_bookmarks,
                "totalQuizAttempts": total_quizzes,
            }
        )


app = create_app()


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=True)

