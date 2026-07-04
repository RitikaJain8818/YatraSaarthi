"""
Yatra Saarthi — Shared Configuration & Resource Management
==========================================================
Handles environment variable detection (.env file loading), Gemini LLM client initialization,
and local JSON database caching with automatic entity extraction.
"""

import os
import json

class SharedConfig:
    def __init__(self):
        self.root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self._db_cache = None
        self.llm_client = None
        self.known_trains = []
        self.station_keywords = {}
        
        self._load_env()
        self._init_llm_client()
        self._load_entities()

    def _load_env(self):
        """Automatically load .env file from project root if present."""
        env_path = os.path.join(self.root_dir, ".env")
        if os.path.exists(env_path):
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
            except Exception as e:
                print(f"[SYSTEM] Could not parse .env file: {e}")

    def _init_llm_client(self):
        """Initialize Google Gemini GenAI client if API key is detected."""
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if api_key:
            try:
                from google import genai
                self.llm_client = genai.Client(api_key=api_key)
                print("[SYSTEM] Gemini LLM Client initialized successfully for Agent 1 and Agent 3 reasoning.")
            except Exception as e:
                print(f"[SYSTEM] Could not initialize Gemini client ({e}). Defaulting to offline fallback heuristics.")
        else:
            print("[SYSTEM] No GEMINI_API_KEY detected. Running in offline fallback heuristic mode.")

    def get_db(self):
        """Load and cache the local offline transit database transit_db.json."""
        if self._db_cache is not None:
            return self._db_cache
        db_path = os.path.join(self.root_dir, "transit_db.json")
        try:
            with open(db_path, "r", encoding="utf-8") as f:
                self._db_cache = json.load(f)
        except Exception as e:
            print(f"[ERROR] Failed to load database: {e}")
            self._db_cache = {}
        return self._db_cache

    def _load_entities(self):
        """Dynamically extract known train numbers and station keywords from database."""
        db = self.get_db()
        self.known_trains = [k for k in db.keys() if k not in ("stations", "delay_alerts")]
        self.station_keywords = {
            "NDLS": ["delhi", "ndls", "new delhi"],
            "BCT": ["mumbai central", "bct", "mumbai"],
            "HWH": ["howrah", "hwh"],
            "MAS": ["chennai", "mas"],
            "SBC": ["bengaluru", "bangalore", "sbc"],
            "SC": ["secunderabad", "sc", "hyderabad"],
            "PUNE": ["pune"],
            "ADI": ["ahmedabad", "adi"]
        }
