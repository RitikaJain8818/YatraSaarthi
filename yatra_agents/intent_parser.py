"""
Yatra Saarthi — Intent Parser
=============================
Ingests unstructured multilingual text from passenger queries. Uses Google Gemini 2.5 Flash
in JSON mode (or high-speed local heuristic fallbacks) to detect domain intents, train numbers,
and railway station codes.
"""

import json

class IntentParser:
    def __init__(self, config):
        self.config = config

    def parse(self, user_query: str, language: str = "en") -> dict:
        """Detect intent and extract transit entities via Gemini LLM or heuristic fallback."""
        print(f"[INTENT PARSER] Parsing query: '{user_query}' (Target Lang: {language})")
        
        if self.config.llm_client:
            try:
                from google.genai import types
                prompt = f"""You are an intelligent Indic transit assistant. Parse the following passenger query into structured JSON format.
Query: "{user_query}"
Target Language: "{language}"

Extract:
- "intent": One of ["live_status", "platform_info", "delay_alerts", "food_options", "cab_booking", "train_route", "unknown"]
- "train_number": Train number if present (e.g. "12932", "12301"), else null
- "station_code": Station code if present (e.g. "NDLS", "BCT", "PRYJ", "HWH", "MAS", "SBC", "SC", "PUNE", "ADI"), else null

Output ONLY a valid JSON object without markdown fences or extra text."""
                response = self.config.llm_client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(response_mime_type="application/json"),
                )
                if response and response.text:
                    extracted_data = json.loads(response.text)
                    print(f"[INTENT PARSER] LLM Reasoning Output: {extracted_data}")
                    return extracted_data
            except Exception as e:
                print(f"[INTENT PARSER] LLM call failed ({e}). Falling back to local heuristics...")

        user_query_lower = user_query.lower()
        extracted_data = {"intent": "unknown", "train_number": None, "station_code": None}

        for train in self.config.known_trains:
            if train in user_query_lower:
                extracted_data["train_number"] = train
                break

        for code, keywords in self.config.station_keywords.items():
            if any(kw in user_query_lower for kw in keywords):
                extracted_data["station_code"] = code
                break

        delay_keywords = ["delay", "alert", "late", "cancel", "disruption"]
        food_keywords = ["food", "eat", "restaurant", "stall", "order food", "aahar", "khana"]
        cab_keywords = ["cab", "taxi", "ola", "uber", "ride", "transport"]
        platform_keywords = ["platform", "which platform", "konsa platform"]
        route_keywords = ["route", "stops", "stations", "via"]

        if any(k in user_query_lower for k in delay_keywords):
            extracted_data["intent"] = "delay_alerts"
        elif any(k in user_query_lower for k in food_keywords):
            extracted_data["intent"] = "food_options"
        elif any(k in user_query_lower for k in cab_keywords):
            extracted_data["intent"] = "cab_booking"
        elif any(k in user_query_lower for k in platform_keywords):
            extracted_data["intent"] = "platform_info"
        elif any(k in user_query_lower for k in route_keywords):
            extracted_data["intent"] = "train_route"
        elif extracted_data["train_number"]:
            extracted_data["intent"] = "live_status"
            
        print(f"[INTENT PARSER] Structured Output: {extracted_data}")
        return extracted_data
