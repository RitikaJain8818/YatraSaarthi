"""
Yatra Saarthi — Vernacular Concierge
====================================
Synthesizes raw JSON tool payloads into polite, culturally resonant vernacular responses
across 6 supported Indic languages (Hindi, Marathi, Tamil, Telugu, Bengali, and English)
using Google Gemini 2.5 Flash or localized template fallbacks.
"""

import json

class VernacularConcierge:
    def __init__(self, config):
        self.config = config

    def synthesize(self, raw_mcp_data: dict, target_language: str = "en") -> str:
        """Draft final natural language response via Gemini LLM or template fallback."""
        print(f"[VERNACULAR CONCIERGE] Drafting final response in '{target_language}'...")
        
        if "error" in raw_mcp_data:
            err_text = raw_mcp_data["error"]
            if "demo train" in err_text.lower() or "not in our" in err_text.lower() or "not present" in err_text.lower() or "not found" in err_text.lower():
                if target_language == "hi":
                    return "माफ कीजिए, यह ट्रेन नंबर उपलब्ध नहीं है। बिना API की के ऑफलाइन डेमो के लिए कृपया हमारे 10 डेमो ट्रेनों में से किसी एक का प्रयास करें: 12301 (राजधानी), 12932 (डबल डेकर), 12951 (मुंबई राजधानी), 12124 (डेक्कन क्वीन), 12215 (गरीबरथ), 12627, 12622, 12859, 12723, या 12839।"
                elif target_language == "mr":
                    return "माफ करा, हा ट्रेन क्रमांक उपलब्ध नाही. ऑफलाइन डेमोसाठी कृपया आमच्या 10 डेमो ट्रेनपैकी एक वापरून पहा: 12301, 12932, 12951, 12124, 12215, 12627, 12622, 12859, 12723, किंवा 12839."
                return err_text
            error_msgs = {
                "hi": "माफ कीजिए, मुझे यह जानकारी नहीं मिल पाई।",
                "mr": "माफ करा, मला ही माहिती मिळाली नाही.",
                "ta": "மன்னிக்கவும், இந்த தகவல் கிடைக்கவில்லை.",
                "te": "క్షమించండి, ఈ సమాచారం దొరకలేదు.",
                "bn": "দুঃখিত, এই তথ্য পাওয়া যায়নি।"
            }
            return error_msgs.get(target_language, "I'm sorry, I couldn't find that information.")

        if self.config.llm_client:
            try:
                prompt = f"""You are Yatra Saarthi, an AI Transit Concierge for Indian Railways.
Translate the following structured train status data into a polite, culturally resonant vernacular response in language code: "{target_language}".
Use appropriate honorifics (e.g., respectful tone, clear formatting).

Structured Transit Data:
{json.dumps(raw_mcp_data, ensure_ascii=False)}

Output ONLY the translated natural language response without markdown quotes or formatting fences."""
                response = self.config.llm_client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"[VERNACULAR CONCIERGE] LLM synthesis failed ({e}). Falling back to template synthesis...")

        intent = raw_mcp_data.get("intent", "live_status")

        # --- Live Status ---
        if intent == "live_status":
            train_name = raw_mcp_data.get('name')
            status = raw_mcp_data.get('status')
            station = raw_mcp_data.get('current_station')
            
            responses = {
                "hi": f"आपकी ट्रेन, {train_name}, अभी {station} पर है। स्टेटस: {status}।",
                "mr": f"तुमची ट्रेन, {train_name}, सध्या {station} मध्ये आहे. स्टेटस: {status}.",
                "ta": f"உங்கள் ரயில், {train_name}, தற்போது {station} இல் உள்ளது. நிலை: {status}.",
                "te": f"మీ రైలు, {train_name}, ప్రస్తుతం {station} లో ఉంది. స్థితి: {status}.",
                "bn": f"আপনার ট্রেন, {train_name}, বর্তমানে {station} এ আছে। অবস্থা: {status}."
            }
            return responses.get(target_language, f"Your train, {train_name}, is currently at {station}. Current status: {status}.")

        # --- Platform Info ---
        elif intent == "platform_info":
            name = raw_mcp_data.get('name')
            platform = raw_mcp_data.get('platform')
            coach = raw_mcp_data.get('coach_position')

            responses = {
                "hi": f"{name} प्लेटफॉर्म {platform} पर आएगी। कोच पोजीशन: {coach}।",
                "mr": f"{name} प्लॅटफॉर्म {platform} वर येईल. कोच पोजीशन: {coach}.",
                "ta": f"{name} பிளாட்ஃபார்ம் {platform} இல் வரும். கோச் நிலை: {coach}.",
                "te": f"{name} ప్లాట్‌ఫారం {platform} లో వస్తుంది. కోచ్ పొజిషన్: {coach}.",
                "bn": f"{name} প্ল্যাটফর্ম {platform} এ আসবে। কোচ পজিশন: {coach}।"
            }
            return responses.get(target_language, f"{name} is expected on Platform {platform}. Coach position: {coach}.")

        # --- Delay Alerts ---
        elif intent == "delay_alerts":
            alerts = raw_mcp_data.get('alerts', [])
            if not alerts:
                return "No active delay alerts at this time."
            
            lines = []
            for a in alerts:
                lines.append(f"[{a['severity'].upper()}] {a['region']}: {a['message']}")
            return "\n".join(lines)

        # --- Food Options ---
        elif intent == "food_options":
            station = raw_mcp_data.get('station_name')
            stalls = raw_mcp_data.get('food_stalls', [])
            stall_list = ", ".join(stalls)
            
            responses = {
                "hi": f"{station} पर खाने के विकल्प: {stall_list}।",
                "mr": f"{station} वर जेवणाचे पर्याय: {stall_list}.",
                "ta": f"{station} இல் உணவு விருப்பங்கள்: {stall_list}.",
                "te": f"{station} లో భోజనం ఎంపికలు: {stall_list}.",
                "bn": f"{station} তে খাবারের বিকল্প: {stall_list}।"
            }
            return responses.get(target_language, f"Food options at {station}: {stall_list}.")

        # --- Cab Booking ---
        elif intent == "cab_booking":
            station = raw_mcp_data.get('station_name')
            cabs = raw_mcp_data.get('cab_services', [])
            cab_list = ", ".join(cabs)
            
            responses = {
                "hi": f"{station} पर कैब सेवाएं: {cab_list}। प्रीपेड टैक्सी काउंटर भी उपलब्ध है।",
                "mr": f"{station} वर कॅब सेवा: {cab_list}. प्रीपेड टॅक्सी काउंटर सुद्धा उपलब्ध आहे.",
                "ta": f"{station} இல் கேப் சேவைகள்: {cab_list}. ப்ரீபெய்ட் டாக்சி கவுண்டரும் உள்ளது.",
                "te": f"{station} లో క్యాబ్ సేవలు: {cab_list}. ప్రీపెయిడ్ ట్యాక్సీ కౌంటర్ కూడా ఉంది.",
                "bn": f"{station} তে ক্যাব পরিষেবা: {cab_list}। প্রিপেইড ট্যাক্সি কাউন্টারও আছে।"
            }
            return responses.get(target_language, f"Cab services at {station}: {cab_list}. Prepaid taxi counter also available.")

        # --- Train Route ---
        elif intent == "train_route":
            name = raw_mcp_data.get('name')
            route = raw_mcp_data.get('route', [])
            route_str = " → ".join(route)
            return f"{name}: {route_str}"

        return "I'm sorry, I couldn't process that request."
