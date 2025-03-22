#!/bin/bash
# OpenAI Voice Toolkit Launcher

# Path to the HTML file - updated to use enhanced version
FILE_PATH="/Users/cpconnor/Desktop/VSC Scripts/OpenAITTS/enhanced-voice-toolkit.html"

# Check if the file exists
if [ -f "$FILE_PATH" ]; then
    # Open the file in the default browser
    open "$FILE_PATH"
    echo "Opening Enhanced OpenAI Voice Toolkit..."
else
    # Show an error message
    echo "Error: The Enhanced OpenAI Voice Toolkit file doesn't exist at $FILE_PATH"
    
    # Check if the original version exists as fallback
    FALLBACK_PATH="/Users/cpconnor/Desktop/VSC Scripts/OpenAITTS/functional-voice-toolkit.html"
    if [ -f "$FALLBACK_PATH" ]; then
        echo "Opening original version instead..."
        open "$FALLBACK_PATH"
    else
        echo "Error: No version of the toolkit could be found."
    fi
fi