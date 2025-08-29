// static/script.js
document.addEventListener("DOMContentLoaded", () => {
    const recordBtn = document.getElementById("recordBtn");
    const statusDisplay = document.getElementById("statusDisplay");
    const chatLog = document.getElementById('chat-log');
    
    // Disable microphone button initially
    recordBtn.disabled = true;
    statusDisplay.textContent = "Please enter API keys to enable microphone";

    // Function to enable microphone button
    const enableMicrophone = () => {
        recordBtn.disabled = false;
        statusDisplay.textContent = "Ready to chat!";
    };

    // Function to disable microphone button
    const disableMicrophone = () => {
        recordBtn.disabled = true;
        statusDisplay.textContent = "Please enter API keys to enable microphone";
    };

    // Check API key status on page load but don't automatically enable
    // The button stays disabled until API keys are explicitly saved
    const checkApiKeyStatus = async () => {
        try {
            const response = await fetch('/validate_api_keys');
            const data = await response.json();
            // We don't enable the microphone here even if keys are valid
            // because the user might want to enter new keys
            if (!data.valid) {
                disableMicrophone();
            }
        } catch (error) {
            console.error("Error checking API key status:", error);
            disableMicrophone();
        }
    };

    // Check API key status when page loads
    checkApiKeyStatus();

    const saveApiKeysButton = document.getElementById("saveApiKeys");
    saveApiKeysButton.addEventListener("click", () => {
        const murfApiKey = document.getElementById("murfApiKey").value;
        const assemblyAiApiKey = document.getElementById("assemblyAiApiKey").value;
        const geminiApiKey = document.getElementById("geminiApiKey").value;
        const serpApiKey = document.getElementById("serpApiKey").value;

        // Send API keys to the server
        fetch("/save_api_keys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                murfApiKey,
                assemblyAiApiKey,
                geminiApiKey,
                serpApiKey,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("API keys saved successfully!");
                enableMicrophone();
                // Start recording after enabling microphone for main form
                startRecording();
            } else {
                alert("Failed to save API keys.");
                disableMicrophone();
            }
        })
        .catch(error => {
            console.error("Error saving API keys:", error);
            alert("An error occurred while saving API keys.");
            disableMicrophone();
        });
    });

    let isRecording = false;
    let ws = null;
    let audioContext;
    let mediaStream;
    let processor;
    let audioQueue = [];
    let isPlaying = false;
    let assistantMessageDiv = null;

    const addOrUpdateMessage = (text, type) => {
        if (type === "assistant") {
            // Create a new div for the assistant's message
            assistantMessageDiv = document.createElement('div');
            assistantMessageDiv.className = 'message assistant';
            assistantMessageDiv.textContent = text;
            chatLog.appendChild(assistantMessageDiv);
        } else {
            assistantMessageDiv = null; // New user message, so reset assistant div
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user';
            messageDiv.textContent = text;
            chatLog.appendChild(messageDiv);
        }
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    const playNextInQueue = () => {
        if (audioQueue.length > 0) {
            isPlaying = true;
            const base64Audio = audioQueue.shift();
            const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer;
            
            audioContext.decodeAudioData(audioData).then(buffer => {
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.onended = playNextInQueue;
                source.start();
            }).catch(e => {
                console.error("Error decoding audio data:", e);
                playNextInQueue();
            });
        } else {
            isPlaying = false;
        }
    };

    const showApiKeyPopup = () => {
        const popup = document.createElement('div');
        popup.className = 'api-key-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h5>Enter API Keys</h5>
                <div class="input-group mb-2">
                    <span class="input-group-text">MURF API Key</span>
                    <input type="text" id="popupMurfApiKey" class="form-control" placeholder="Enter your API Key" />
                </div>
                <div class="input-group mb-2">
                    <span class="input-group-text">AssemblyAI API Key</span>
                    <input type="text" id="popupAssemblyAiApiKey" class="form-control" placeholder="Enter your API Key" />
                </div>
                <div class="input-group mb-2">
                    <span class="input-group-text">Gemini API Key</span>
                    <input type="text" id="popupGeminiApiKey" class="form-control" placeholder="Enter your API Key" />
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">SerpAPI Key</span>
                    <input type="text" id="popupSerpApiKey" class="form-control" placeholder="Enter your API Key" />
                </div>
                <div class="popup-buttons">
                    <button id="validateKeysBtn" class="btn btn-primary">Validate & Save</button>
                    <button id="cancelPopupBtn" class="btn btn-secondary">Cancel</button>
                </div>
                <div id="popupError" class="text-danger mt-2" style="display: none;"></div>
            </div>
        `;
        document.body.appendChild(popup);

        // Add event listeners
        document.getElementById('validateKeysBtn').addEventListener('click', validateAndSaveKeys);
        document.getElementById('cancelPopupBtn').addEventListener('click', () => {
            document.body.removeChild(popup);
        });
    };

    const validateAndSaveKeys = async () => {
        const murfApiKey = document.getElementById('popupMurfApiKey').value;
        const assemblyAiApiKey = document.getElementById('popupAssemblyAiApiKey').value;
        const geminiApiKey = document.getElementById('popupGeminiApiKey').value;
        const serpApiKey = document.getElementById('popupSerpApiKey').value;

        // Basic validation - check if any field is empty
        if (!murfApiKey || !assemblyAiApiKey || !geminiApiKey || !serpApiKey) {
            document.getElementById('popupError').textContent = 'Please fill all API key fields';
            document.getElementById('popupError').style.display = 'block';
            return;
        }

        try {
            const response = await fetch("/save_api_keys", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    murfApiKey,
                    assemblyAiApiKey,
                    geminiApiKey,
                    serpApiKey,
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                // Close popup, enable microphone, and start recording
                document.body.removeChild(document.querySelector('.api-key-popup'));
                enableMicrophone();
                startRecording();
            } else {
                document.getElementById('popupError').textContent = 'Failed to save API keys. Please recheck the keys.';
                document.getElementById('popupError').style.display = 'block';
            }
        } catch (error) {
            console.error("Error saving API keys:", error);
            document.getElementById('popupError').textContent = 'Error saving API keys. Please recheck the keys.';
            document.getElementById('popupError').style.display = 'block';
        }
    };

    const startRecording = async () => {
        try {
            // First check if we have valid API keys by making a quick validation request
            const validationResponse = await fetch('/validate_api_keys');
            const validationData = await validationResponse.json();
            
            if (!validationData.valid) {
                showApiKeyPopup();
                return;
            }

            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });

            const source = audioContext.createMediaStreamSource(mediaStream);
            processor = audioContext.createScriptProcessor(4096, 1, 1);
            source.connect(processor);
            processor.connect(audioContext.destination);
            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
                }
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(pcmData.buffer);
                }
            };

            const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
            console.log("Connecting to WebSocket:", wsUrl);
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("WebSocket connection established");
            };

            ws.onmessage = (event) => {
                console.log("WebSocket message received:", event.data);
                const msg = JSON.parse(event.data);
                if (msg.type === "assistant") {
                    addOrUpdateMessage(msg.text, "assistant");
                } else if (msg.type === "final") {
                    addOrUpdateMessage(msg.text, "user");
                } else if (msg.type === "audio") {
                    audioQueue.push(msg.b64);
                    if (!isPlaying) {
                        playNextInQueue();
                    }
                } else if (msg.type === "error") {
                    console.error("WebSocket error:", msg.message);
                    alert("Error: " + msg.message);
                    stopRecording();
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                alert("WebSocket connection error. Please check the console for details.");
                stopRecording();
            };

            ws.onclose = () => {
                console.log("WebSocket connection closed");
            };
            isRecording = true;
            recordBtn.classList.add("recording");
            statusDisplay.textContent = "Listening...";
        } catch (error) {
            console.error("Could not start recording:", error);
            alert("Microphone access is required to use the voice agent.");
        }
    };

    const stopRecording = () => {
        if (processor) processor.disconnect();
        if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
        if (ws) ws.close();
        
        isRecording = false;
        recordBtn.classList.remove("recording");
        statusDisplay.textContent = "Ready to chat!";
    };

    recordBtn.addEventListener("click", () => {
        console.log("Microphone button clicked, isRecording:", isRecording);
        if (isRecording) {
            console.log("Stopping recording...");
            stopRecording();
        } else {
            console.log("Starting recording...");
            startRecording();
        }
    });
});
