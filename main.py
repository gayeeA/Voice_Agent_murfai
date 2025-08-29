from fastapi import FastAPI, Request, WebSocket, HTTPException
import json
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import logging
import asyncio
import base64
import re

# Import services and config
import config
from services import stt, llm, tts

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()

# Mount static files for CSS/JS
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.post("/save_api_keys")
async def save_api_keys(request: Request):
    """Saves API keys provided by the user."""
    try:
        data = await request.json()
        with open("api_keys.json", "w") as f:
            json.dump(data, f)
        
        # Reload API keys into config
        import config
        config.reload_api_keys()
        
        return {"success": True}
    except Exception as e:
        logging.error(f"Error saving API keys: {e}")
        raise HTTPException(status_code=500, detail="Failed to save API keys.")

@app.get("/")
async def home(request: Request):
    """Serves the main HTML page."""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/validate_api_keys")
async def validate_api_keys():
    """Validates if all required API keys are present and returns validation status."""
    missing_keys = config.validate_api_keys()
    return {"valid": len(missing_keys) == 0, "missing_keys": missing_keys}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Handles WebSocket connection for real-time transcription and voice response."""
    await websocket.accept()
    logging.info("WebSocket client connected.")

    # Check if API keys are valid before proceeding
    missing_keys = config.validate_api_keys()
    if missing_keys:
        error_message = f"API keys missing: {', '.join(missing_keys)}. Please configure API keys first."
        await websocket.send_json({"type": "error", "message": error_message})
        await websocket.close()
        logging.warning(f"WebSocket connection rejected due to missing API keys: {missing_keys}")
        return

    loop = asyncio.get_event_loop()
    chat_history = []

    async def handle_transcript(text: str):
        """Processes the final transcript, gets LLM and TTS responses, and streams audio."""
        await websocket.send_json({"type": "final", "text": text})
        try:
            # 1. Get the full text response from the LLM (non-streaming)
            # Check if user wants to summarize a URL
            url = llm.extract_url_from_query(text)
            if url:
                full_response, updated_history = llm.summarize_url(url, chat_history)
            elif "search for" in text.lower() or "what is" in text.lower():
                full_response, updated_history = llm.get_web_response(text, chat_history)
            else:
                full_response, updated_history = llm.get_llm_response(text, chat_history)
            
            # Update history for the next turn
            chat_history.clear()
            chat_history.extend(updated_history)

            # Send the full text response to the UI
            await websocket.send_json({"type": "assistant", "text": full_response})

            # 2. Split the response into sentences
            sentences = re.split(r'(?<=[.?!])\s+', full_response.strip())
            
            # 3. Process each sentence for TTS and stream audio back
            for sentence in sentences:
                if sentence.strip():
                    # Run the blocking TTS function in a separate thread
                    audio_bytes = await loop.run_in_executor(
                        None, tts.speak, sentence.strip()
                    )
                    if audio_bytes:
                        b64_audio = base64.b64encode(audio_bytes).decode('utf-8')
                        await websocket.send_json({"type": "audio", "b64": b64_audio})

        except Exception as e:
            logging.error(f"Error in LLM/TTS pipeline: {e}")
            await websocket.send_json({"type": "error", "message": "Sorry, I encountered an error processing your request."})

    def on_final_transcript(text: str):
        logging.info(f"Final transcript received: {text}")
        asyncio.run_coroutine_threadsafe(handle_transcript(text), loop)

    transcriber = stt.AssemblyAIStreamingTranscriber(on_final_callback=on_final_transcript)

    try:
        while True:
            data = await websocket.receive_bytes()
            transcriber.stream_audio(data)
    except Exception as e:
        logging.info(f"WebSocket connection closed: {e}")
    finally:
        transcriber.close()
        logging.info("Transcription resources released.")
