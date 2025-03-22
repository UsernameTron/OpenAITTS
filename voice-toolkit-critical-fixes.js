/**
 * OpenAI Voice Toolkit - Critical Fixes
 * 
 * Focused fixes for the most important issues identified during testing,
 * specifically addressing DOM selection and null-checking in event handlers.
 */

// Fix for model selection change handler (improved DOM selection)
advancedTtsModel.addEventListener('change', function() {
    const model = this.value;
    // Find the custom instructions button using a more robust method
    const customInstructionsButton = Array.from(document.querySelectorAll('button.collapsible')).find(
        button => button.textContent.trim() === 'Custom Instructions'
    );
    const styleInstructionsSection = customInstructionsButton?.nextElementSibling;
    
    // Only enable style instructions for models that support it
    if (styleInstructionsSection) {
        if (model === 'gpt-4o-mini-tts' || model === 'gpt-4o-audio-preview') {
            styleInstructionsSection.style.opacity = '1';
            const textarea = styleInstructionsSection.querySelector('textarea');
            if (textarea) textarea.disabled = false;
        } else {
            styleInstructionsSection.style.opacity = '0.5';
            const textarea = styleInstructionsSection.querySelector('textarea');
            if (textarea) textarea.disabled = true;
        }
    }
    
    // Update cost estimate
    const text = advancedTtsTextInput.value;
    const cost = estimateCost(text, 'tts');
    if (document.getElementById('advanced-tts-cost-estimate')) {
        document.getElementById('advanced-tts-cost-estimate').textContent = `$${cost}`;
    }
});

// Fix for the advanced TTS generate button (get selected voice correctly)
advancedTtsGenerateBtn.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    const text = advancedTtsTextInput.value.trim();
    const model = advancedTtsModel.value;
    const accent = accentSelect.value;
    const speed = speedSlider.value;
    const tone = toneSelect.value;
    const customInstructionsText = customInstructions.value.trim();
    
    // Validation
    if (!apiKey) {
        showStatus(advancedTtsStatusMessage, 'Please enter your OpenAI API key', 'error');
        return;
    }
    
    if (!text) {
        showStatus(advancedTtsStatusMessage, 'Please enter some text to convert', 'error');
        return;
    }
    
    // Remember API key if checkbox is checked
    if (rememberKeyCheckbox.checked) {
        localStorage.setItem('openai_api_key', apiKey);
    } else {
        localStorage.removeItem('openai_api_key');
    }
    
    // Compose style instructions
    let styleInstructions = "";
    
    if (accent !== 'neutral') {
        styleInstructions += `Speak with a ${accent} accent. `;
    }
    
    if (speed !== '1') {
        if (parseFloat(speed) < 1) {
            styleInstructions += `Speak slower than normal. `;
        } else {
            styleInstructions += `Speak faster than normal. `;
        }
    }
    
    if (tone !== 'neutral') {
        styleInstructions += `Use a ${tone} tone. `;
    }
    
    if (customInstructionsText) {
        styleInstructions += customInstructionsText;
    }
    
    // Status and button updates
    showStatus(advancedTtsStatusMessage, 'Generating styled speech... please wait', '');
    this.disabled = true;
    
    // Make API call with new parameters - use the correct voice
    generateSpeech(text, advancedSelectedVoice, styleInstructions, model)
        .then(blob => {
            advancedTtsAudioBlob = blob;
            const audioUrl = URL.createObjectURL(blob);
            advancedTtsAudioPlayer.src = audioUrl;
            advancedTtsAudioPlayer.style.display = 'block';
            
            showStatus(advancedTtsStatusMessage, 'Speech generated successfully!', 'success');
            advancedTtsPlayBtn.disabled = false;
            advancedTtsDownloadBtn.disabled = false;
            this.disabled = false;
        })
        .catch(error => {
            showStatus(advancedTtsStatusMessage, `Error: ${error.message}`, 'error');
            this.disabled = false;
        });
});