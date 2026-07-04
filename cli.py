"""
Yatra Saarthi — Command Line Interface (CLI) Engine
===================================================
Provides a high-speed terminal interface for invoking the Yatra Saarthi 3-Agent Pipeline.
Allows developers and passengers to query train running status, platform numbers, and alerts
in natural language across 6 supported Indic languages (en, hi, mr, ta, te, bn).

Example Usage:
  python cli.py --query "12301 train kaha phochi?" --lang hi
  python cli.py --query "mumbai central var jevanache kay paryay ahet?" --lang mr

Security Note: Zero API keys or secrets required. Runs entirely offline via mock MCP bridges.
"""

import sys
import argparse
from agent import YatraMultiAgentSystem

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    parser = argparse.ArgumentParser(description="Yatra Saarthi Transit Agent CLI")

    
    parser.add_argument(
        '--query', 
        type=str, 
        required=True, 
        help="User query in natural language (e.g., 'Where is train 12932?')"
    )
    
    parser.add_argument(
        '--lang', 
        type=str, 
        default="en", 
        choices=["en", "hi", "mr", "ta", "te", "bn"], 
        help="Target output language (en=English, hi=Hindi, mr=Marathi, ta=Tamil, te=Telugu, bn=Bengali)"
    )

    args = parser.parse_args()

    system = YatraMultiAgentSystem()
    system.execute_pipeline(args.query, args.lang)

if __name__ == "__main__":
    main()