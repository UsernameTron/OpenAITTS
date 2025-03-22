#!/bin/bash
# Script to create a desktop shortcut for the Enhanced OpenAI Voice Toolkit

# Define the paths
LAUNCHER_SCRIPT="/Users/cpconnor/Desktop/VSC Scripts/OpenAITTS/launch_voice_toolkit.command"
HTML_FILE="/Users/cpconnor/Desktop/VSC Scripts/OpenAITTS/enhanced-voice-toolkit.html"
DESKTOP_PATH="$HOME/Desktop"
SHORTCUT_NAME="Enhanced OpenAI Voice Toolkit.command"
DESKTOP_SHORTCUT="$DESKTOP_PATH/$SHORTCUT_NAME"

# Create a simpler shortcut file
cat > "$DESKTOP_SHORTCUT" << EOT
#!/bin/bash
# Shortcut to Enhanced OpenAI Voice Toolkit

# Open the toolkit in the default browser
open "$HTML_FILE"
echo "Opening Enhanced OpenAI Voice Toolkit..."
EOT

# Make it executable
chmod +x "$DESKTOP_SHORTCUT"

# Inform the user
echo "Desktop shortcut created at: $DESKTOP_SHORTCUT"
echo "You can double-click the shortcut to open the Enhanced OpenAI Voice Toolkit."
echo "Done!"