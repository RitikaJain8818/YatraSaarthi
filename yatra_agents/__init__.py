"""
Yatra Saarthi — Modular Agents Package
======================================
This package modularizes the 3-agent orchestration pipeline into distinct sub-files:
- config: Shared database loading, .env configuration, and Gemini LLM client initialization.
- intent_parser: Natural language understanding, intent detection, and entity extraction.
- transit_retriever: Programmatic FastMCP stdio client communication and local cache fallback.
- vernacular_concierge: Vernacular Indic language translation and polite response synthesis.
"""

from .config import SharedConfig
from .intent_parser import IntentParser
from .transit_retriever import TransitRetriever
from .vernacular_concierge import VernacularConcierge

__all__ = ["SharedConfig", "IntentParser", "TransitRetriever", "VernacularConcierge"]
