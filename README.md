# OpenAI Voice Toolkit

A comprehensive web application for working with OpenAI's voice technologies.

## Features

### 1. Text-to-Speech (TTS)
- Convert text to natural-sounding speech
- 6 different voice options (Alloy, Echo, Fable, Onyx, Nova, and Shimmer)
- Basic and advanced styling options
- Download audio in MP3 or WAV format

### 2. Advanced Text-to-Speech
- Voice styling with accents, tone adjustments, and speed control
- Style presets (British Narrator, News Anchor, Storyteller, etc.)
- Access to high-definition TTS models
- Custom voice instructions

### 3. Speech-to-Text (STT)
- Transcribe audio files in various formats
- Translation to English option
- Multiple output formats (plain text, JSON, verbose JSON)
- Timestamp granularity options
- Custom prompt support for improved recognition

### 4. Video Voiceover
- Upload video files and preview frames
- Auto-generate scripts based on video content
- Multiple script styles (descriptive, narrative, educational, etc.)
- Customizable voice settings for narration
- Download audio for video projects

## Getting Started

### Launch Options

1. **Browser Launch**
   - Open `functional-voice-toolkit.html` directly in your browser

2. **Desktop Shortcut**
   - Double-click `OpenAI Voice Toolkit.command` on your Desktop

3. **AppleScript**
   - Run the `OpenAI_Voice_Toolkit.scpt` AppleScript file

4. **Command Line**
   - Run `./launch_voice_toolkit.command` from the terminal

### Using the Application

1. Enter your OpenAI API key in the API Configuration section
   - You need to replace the placeholder 'YOUR_OPENAI_API_KEY' with your actual API key
   - For security reasons, the API key is not included in this repository
2. Select the desired function (TTS, Advanced TTS, STT, or Video Voiceover)
3. Configure your options and provide input
4. Process and download your results

## Technical Details

- Single HTML file with embedded CSS and JavaScript
- Uses OpenAI API for all voice processing:
  - Text-to-Speech API (`tts-1` and `tts-1-hd` models)
  - Speech-to-Text API (Whisper model)
  - GPT-4o for script generation and text enhancement

## API Usage Notes

This application requires an OpenAI API key and will use:
- TTS credits for text-to-speech conversion
- Whisper credits for speech-to-text transcription
- GPT-4o credits for script generation and text enhancement

## Troubleshooting

If you encounter any issues:
1. Check your internet connection
2. Verify your API key is valid and has sufficient credits
3. For file upload issues, ensure your file is under the size limit (25MB for audio, 100MB for video)
4. Try refreshing the page or restarting the application

## Credits

Developed with OpenAI technologies and Claude for code assistance.