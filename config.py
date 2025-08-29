# config.py
import os
import json
from dotenv import load_dotenv
import assemblyai as aai
import google.generativeai as genai
import logging

# Load environment variables from .env file
load_dotenv()

# Load API Keys from environment or user input
def load_api_keys():
    try:
        with open("api_keys.json", "r") as f:
            keys = json.load(f)
            return {
                "MURF_API_KEY": keys.get("murfApiKey"),
                "ASSEMBLYAI_API_KEY": keys.get("assemblyAiApiKey"),
                "GEMINI_API_KEY": keys.get("geminiApiKey"),
                "SERPAPI_API_KEY": keys.get("serpApiKey"),
            }
    except FileNotFoundError:
        logging.warning("api_keys.json not found. Falling back to .env file.")
        return {
            "MURF_API_KEY": os.getenv("MURF_API_KEY"),
            "ASSEMBLYAI_API_KEY": os.getenv("ASSEMBLYAI_API_KEY"),
            "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY"),
            "SERPAPI_API_KEY": os.getenv("SERPAPI_API_KEY"),
        }

# Load API Keys
api_keys = load_api_keys()
MURF_API_KEY = api_keys["MURF_API_KEY"]
ASSEMBLYAI_API_KEY = api_keys["ASSEMBLYAI_API_KEY"]
GEMINI_API_KEY = api_keys["GEMINI_API_KEY"]
SERPAPI_API_KEY = api_keys["SERPAPI_API_KEY"]

# Configure APIs and log warnings if keys are missing
if ASSEMBLYAI_API_KEY:
    aai.settings.api_key = ASSEMBLYAI_API_KEY
else:
    logging.warning("ASSEMBLYAI_API_KEY not found in .env file.")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logging.warning("GEMINI_API_KEY not found in .env file.")

if not MURF_API_KEY:
    logging.warning("MURF_API_KEY not found in .env file.")

if not SERPAPI_API_KEY:
    logging.warning("SERPAPI_API_KEY not found in .env file.")