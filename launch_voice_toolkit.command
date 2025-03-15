#!/bin/bash
# OpenAI Voice Toolkit Launcher

# Path to the HTML file
FILE_PATH="/Users/cpconnor/Desktop/VSC Scripts/OpenAITTS/functional-voice-toolkit.html"

# Check if the file exists
if [ -f "$FILE_PATH" ]; then
    # Open the file in the default browser
    open "$FILE_PATH"
    echo "Opening OpenAI Voice Toolkit..."
else
    # Show an error message
    echo "Error: The OpenAI Voice Toolkit file doesn't exist at $FILE_PATH"
fi