"""
Yatra Saarthi — Main Multi-Agent Orchestrator
=============================================
A lightweight orchestrator wrapper that coordinates the modular sub-agents:
1. IntentParser (NLU & Entity Extraction)
2. TransitRetriever (FastMCP Stdio Protocol Client & Cache Fallback)
3. VernacularConcierge (Multilingual Response Synthesis)
"""

from yatra_agents import SharedConfig, IntentParser, TransitRetriever, VernacularConcierge

class YatraMultiAgentSystem:
    def __init__(self):
        self.system_name = "Yatra Saarthi"
        self.config = SharedConfig()
        self.parser = IntentParser(self.config)
        self.retriever = TransitRetriever(self.config)
        self.concierge = VernacularConcierge(self.config)

    def _agent_1_translator_parser(self, user_query, language):
        return self.parser.parse(user_query, language)

    def _agent_2_mcp_retriever(self, parsed_data):
        return self.retriever.retrieve(parsed_data)

    def _agent_3_concierge(self, raw_mcp_data, target_language):
        return self.concierge.synthesize(raw_mcp_data, target_language)

    def execute_pipeline(self, user_query, language="en"):
        print("="*50)
        print("🚀 STARTING YATRA SAARTHI PIPELINE")
        print("="*50)
        
        parsed_intent = self._agent_1_translator_parser(user_query, language)
        print("-" * 50)
        
        raw_mcp_data = self._agent_2_mcp_retriever(parsed_intent)
        print("-" * 50)
        
        final_response = self._agent_3_concierge(raw_mcp_data, language)
        print("="*50)
        print(f"🎯 FINAL OUTPUT:\n{final_response}")
        print("="*50)
        
        return final_response

if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    system = YatraMultiAgentSystem()
    print("\n--- TEST 1: Live Status in Hindi ---")
    system.execute_pipeline("12301 train kaha hai?", "hi")
    print("\n--- TEST 2: Platform Info in Marathi ---")
    system.execute_pipeline("12951 platform kay ahe?", "mr")