# Shinchan Voice Assistant 🎤🤖

## 📖 What is Shinchan Voice Assistant?

Shinchan Voice Assistant is your playful AI companion that listens to your voice, understands your questions, and responds with helpful answers using a friendly voice! It's like having a smart, funny friend who can help you with almost anything.

**Think of it as:**
- A voice-activated Google assistant with personality
- A smart researcher that can summarize web pages
- A conversational AI that remembers your chat history
- A real-time information finder using web search

## ✨ Amazing Features

### 🗣️ Voice Conversations
- **Talk naturally**: Just click the microphone and speak - no typing needed!
- **Playful responses**: Get answers with a fun, friendly personality
- **Continuous chat**: The assistant remembers your conversation history

### 🌐 Web Search Superpowers
- **Real-time information**: Ask about current events, weather, or news
- **Smart research**: "Search for latest iPhone features" or "Find pizza places near me"
- **Always up-to-date**: Gets information from the live web, not just pre-trained knowledge

### 📄 URL Summarization Magic
- **Automatic detection**: Just mention a URL in your question
- **Quick summaries**: "Summarize this article: https://example.com/news"
- **Webpage understanding**: Extracts key information from any webpage

### 🔊 Real Voice Responses
- **Natural sounding**: Responses come as spoken audio, not just text
- **Streaming audio**: Hears responses as they're being generated
- **Visual feedback**: See text responses while listening to the audio

### 🔐 Smart API Management
- **Easy setup**: Enter API keys once and they're saved
- **Popup option**: Quick access to API key entry without scrolling
- **Automatic validation**: System checks if your keys work properly

### 🎤 Microphone Intelligence
- **Safety first**: Microphone stays disabled until keys are validated
- **Clear status**: Always know if the system is ready or needs setup
- **One-click recording**: Simple button to start/stop talking

## 🚀 Getting Started - Beginner's Guide

### Step 1: Install Dependencies
First, make sure you have Python installed. Then open your command prompt or terminal and run:

```bash
# Install all required packages
pip install -r requirements.txt
```

**What this does**: This command installs all the necessary software libraries that make the voice assistant work.

### Step 2: Get Your API Keys (Don't Worry - It's Easy!)

You'll need 4 free API keys. Here's how to get each one:

#### 🔑 MURF API Key (for voice)
1. Go to [murf.ai](https://murf.ai/)
2. Sign up for a free account
3. Find your API key in account settings

#### 🔑 AssemblyAI API Key (for speech recognition)
1. Visit [assemblyai.com](https://www.assemblyai.com/)
2. Create a free account
3. Get your API key from the dashboard

#### 🔑 Gemini API Key (for AI intelligence)
1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Sign in with your Google account
3. Create an API key for Gemini

#### 🔑 SerpAPI Key (for web search)
1. Visit [serpapi.com](https://serpapi.com/)
2. Sign up for a free account
3. Find your API key in your account

### Step 3: Setup Options (Choose One)

#### Option A: Web Interface (Recommended for Beginners)
1. Start the application: `uvicorn main:app --reload`
2. Open `http://127.0.0.1:8000` in your browser
3. Enter your API keys in the form on the page
4. Click "Save API Keys" - that's it!

#### Option B: Environment File (Advanced)
Create a file called `.env` in the project folder with:
```
MURF_API_KEY="your_actual_key_here"
ASSEMBLYAI_API_KEY="your_actual_key_here"
GEMINI_API_KEY="your_actual_key_here"
SERPAPI_API_KEY="your_actual_key_here"
```

### Step 4: Start Talking! 🎉

1. **Check the status**: Look for "Ready to chat!" message
2. **Click the microphone**: The big red button in the center
3. **Speak clearly**: Ask your question naturally
4. **Wait for response**: Listen to the audio and see text appear

## 🎯 How to Use - Examples for Beginners

### Basic Questions
- "What's the capital of France?"
- "Tell me a joke"
- "How do I make pasta?"

### Web Search Questions
- "What's the weather in New York today?"
- "Find recent news about technology"
- "Search for healthy breakfast ideas"

### URL Summarization
- "Summarize this article: https://wikipedia.org/article"
- "Can you tell me about this page: www.news-site.com/story"
- "What does this webpage say: https://blog.example.com/post"

### Fun Interactions
- "Tell me a story"
- "What's your name?"
- "Can you sing a song?"

## 🔧 How It Works - Simple Explanation

### 1. You Speak 🎤
- You click the microphone and talk
- Your speech gets converted to text instantly

### 2. AI Thinks 🤖
- The system understands what you asked
- If you mentioned a URL, it fetches that webpage
- If you asked for web search, it finds current information
- It generates a smart, helpful response

### 3. You Hear Back 🔊
- The response gets converted to speech
- You hear the answer in a friendly voice
- You see the text response on screen

## 🛠️ Technical Stuff (For Curious Beginners)

### What's Happening Behind the Scenes?

1. **Speech-to-Text**: AssemblyAI converts your voice to text
2. **AI Brain**: Google Gemini understands and answers your question
3. **Web Search**: SerpAPI finds real-time information when needed
4. **Text-to-Speech**: MURF AI converts the answer to spoken audio
5. **Real-time Streaming**: WebSocket technology streams audio instantly

### File Structure Explained
```
Voice_Agent_murfai/
├── main.py              # The main brain - handles everything
├── config.py            # Manages your API keys safely
├── services/
│   ├── llm.py          # AI intelligence and web search
│   ├── stt.py          # Converts speech to text
│   └── tts.py          # Converts text to speech
├── static/
│   ├── style.css       # Makes everything look pretty
│   └── script.js       # Handles microphone and web interface
├── templates/
│   └── index.html      # The web page you see
└── uploads/            # Temporary storage for audio
```

## ❓ Troubleshooting - Common Issues Solved

### 🎤 Microphone Not Working?
1. **Check browser permissions**: Make sure you allowed microphone access
2. **Verify API keys**: All 4 keys must be entered and valid
3. **Look at status**: Should say "Ready to chat!" not "Please enter API keys"

### 🔇 No Sound?
1. **Check volume**: Make sure your computer volume is up
2. **MURF API key**: Verify your MURF key is correct
3. **Internet connection**: You need stable internet for audio

### 🌐 Web Search Not Working?
1. **SerpAPI key**: Check if your SerpAPI key is valid
2. **Credit limit**: Free accounts have limited searches
3. **Question format**: Try "Search for [your topic]" or "Find [information]"

### 📄 URL Summarization Failed?
1. **Valid URL**: Make sure the website address is correct
2. **Accessible content**: Some websites block automated access
3. **Try different URL**: Some sites work better than others

### 🔑 API Key Issues?
1. **All keys required**: You need all 4 keys for full functionality
2. **Validation**: The system checks if keys work when you save them
3. **Popup option**: Use the popup if the main form isn't working

## 🆘 Getting Help

### Quick Fixes
- **Restart the application**: Stop and restart with `uvicorn main:app --reload`
- **Refresh the page**: Sometimes the browser needs a refresh
- **Re-enter keys**: Try saving your API keys again

### Need More Help?
1. Check that all API services are working (visit their websites)
2. Ensure you have a stable internet connection
3. Try asking simpler questions first

## 🤝 Contributing

**Welcome to the community!** We love helping beginners contribute.

### Easy Ways to Help:
- **Report bugs**: Found something not working? Tell us!
- **Suggest features**: Have an idea to make it better?
- **Improve documentation**: Help make this guide even clearer

### How to Contribute:
1. **Fork the project** (make your own copy)
2. **Make your changes**
3. **Submit a pull request** (offer your changes to the main project)

## 📜 License

This project uses the **MIT License**, which means:
- You can use it for free
- You can modify it
- You can share it with others
- Just give credit to the original authors

## 🎉 Congratulations!

You're now ready to use your very own voice assistant! Remember:
- Start with simple questions
- Don't worry if something doesn't work - just try again
- Have fun exploring all the features!

**Happy talking with Shinchan!** 🎤✨
