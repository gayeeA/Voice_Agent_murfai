# Shinchan Voice Assistant

## Description
Shinchan Voice Assistant is a playful AI companion designed to assist users with various tasks, including answering questions, summarizing articles, and converting text to speech.

## Features
- Answer your questions with a playful twist!
- Summarize articles and provide insights.
- Convert text to speech with a fun voice.
- Engage in light-hearted conversations.

## Installation
1. **Install the required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Create a `.env` file** and add your API keys:
    ```
    MURF_API_KEY="your_murf_api_key_here"
    ASSEMBLYAI_API_KEY="your_assemblyai_api_key_here"
    GEMINI_API_KEY="your_gemini_api_key_here"
    SERPAPI_API_KEY="your_serpapi_api_key_here"
    ```

## Usage
1. Start the application:
   ```bash
   uvicorn main:app --reload
   ```

2. Open your web browser and navigate to `http://127.0.0.1:8000`.

3. Enter your API keys in the API Key Configuration section and click "Save API Keys".

4. Start interacting with the Shinchan Voice Assistant!

## API Key Configuration
To use certain features, you will need to enter your API keys:
- **MURF API Key**
- **AssemblyAI API Key**
- **Gemini API Key**
- **SerpAPI Key**

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.
