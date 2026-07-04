🚂 Yatra Saarthi: Multilingual Transit Concierge

Track: Concierge Agents (Kaggle AI Agents Capstone)
Core Technologies: Multi-Agent Pipeline, Model Context Protocol (MCP), LLM Translation, Terminal CLI

🚨 Problem Statement

Navigating the Indian transit system (IRCTC, state buses) requires high English literacy and complex app navigation. This creates a massive digital divide for millions of Tier-2/Tier-3 citizens and elderly users. When a user simply wants to know "Where is my train?", they are blocked by Captchas, drop-down menus, and English-only interfaces.

💡 Solution Thinking

Yatra Saarthi is a localized, multi-lingual AI Concierge that allows users to query complex transit data using natural conversational language in Hindi, Marathi, English, or other Indic languages.

It utilizes a Multi-Agent Orchestration (ADK) architecture:

Translation & Intent Agent: Normalizes local dialects into structured English queries.

Retrieval Agent (MCP Client): Routes the structured query to a local custom Model Context Protocol (MCP) Server.

Concierge Agent: Synthesizes the raw JSON data back into a polite response in the user's original language.

🛠️ How to Run Locally

1. Install Dependencies

pip install -r requirements.txt


2. Run the CLI

python cli.py --query "Bhai, 12932 kaha phochi?" --lang hi


🐳 How to Run via Docker (Deployability)

docker build -t yatra-saarthi .
docker run -it yatra-saarthi --query "Where is train 12215?" --lang en


🔐 Security & Failover

No PII Leakage: The agent strips personal user data before querying the external MCP server.

Failover Design: The MCP server is backed by a local JSON database (transit_db.json), guaranteeing 100% uptime during demonstrations and zero API latency.