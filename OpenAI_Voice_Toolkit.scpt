-- OpenAI Voice Toolkit Launcher
-- This AppleScript launches the OpenAI Voice Toolkit in the default browser

-- Define the file path to the HTML file
set filePath to "/Users/cpconnor/Desktop/VSC Scripts/OpenAITTS/functional-voice-toolkit.html"

-- Convert the POSIX path to HFS path format (which AppleScript uses)
set hfsPath to POSIX file filePath

-- Check if the file exists
tell application "System Events"
    if exists file filePath then
        -- Open the file in the default browser
        do shell script "open " & quoted form of filePath
    else
        -- Show an error message if the file doesn't exist
        display dialog "Error: The OpenAI Voice Toolkit file doesn't exist at the specified location." buttons {"OK"} default button "OK" with icon stop
    end if
end tell