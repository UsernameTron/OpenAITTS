// Event handlers and functionality for new features

// Cost estimation updates
document.getElementById('tts-text-input').addEventListener('input', function() {
    const text = this.value;
    const charCount = text.length;
    document.getElementById('tts-char-count').textContent = charCount;
    
    // Update cost estimate
    const cost = estimateCost(text, 'tts');
    document.getElementById('tts-cost-estimate').textContent = `$${cost}`;
});

document.getElementById('advanced-tts-text-input').addEventListener('input', function() {
    const text = this.value;
    const charCount = text.length;
    document.getElementById('advanced-tts-char-count').textContent = charCount;
    
    // Update cost estimate for advanced TTS
    const cost = estimateCost(text, 'tts');
    if (document.getElementById('advanced-tts-cost-estimate')) {
        document.getElementById('advanced-tts-cost-estimate').textContent = `$${cost}`;
    }
});

// Model selection change handler
document.getElementById('advanced-tts-model').addEventListener('change', function() {
    const model = this.value;
    
    // Find the custom instructions element more reliably
    const allCollapsibles = document.querySelectorAll('button.collapsible');
    let customInstructionsButton = null;
    
    for (let button of allCollapsibles) {
        if (button.textContent.trim().includes('Custom Instructions')) {
            customInstructionsButton = button;
            break;
        }
    }
    
    const styleInstructionsSection = customInstructionsButton ? 
        customInstructionsButton.nextElementSibling : null;
    
    // Disable style instructions entirely as they're not supported
    if (styleInstructionsSection) {
        styleInstructionsSection.style.opacity = '0.5';
        const textarea = styleInstructionsSection.querySelector('textarea');
        if (textarea) textarea.disabled = true;
    }
    
    // Update cost estimate
    const text = document.getElementById('advanced-tts-text-input').value;
    const cost = estimateCost(text, 'tts');
    if (document.getElementById('advanced-tts-cost-estimate')) {
        document.getElementById('advanced-tts-cost-estimate').textContent = `$${cost}`;
    }
});

// Advanced TTS - Generate speech with style instructions
document.getElementById('advanced-tts-generate-btn').addEventListener('click', function() {
    const apiKey = document.getElementById('api-key').value.trim();
    const text = document.getElementById('advanced-tts-text-input').value.trim();
    const model = document.getElementById('advanced-tts-model').value;
    
    // Get voice selection - safely
    let selectedVoice = 'alloy'; // Default voice
    const selectedVoiceElement = document.querySelector('#advanced-tts-tab .voice-option.selected');
    if (selectedVoiceElement) {
        selectedVoice = selectedVoiceElement.getAttribute('data-voice') || 'alloy';
    }
    
    // Validation
    if (!apiKey) {
        showStatus(document.getElementById('advanced-tts-status-message'), 'Please enter your OpenAI API key', 'error');
        return;
    }
    
    if (!text) {
        showStatus(document.getElementById('advanced-tts-status-message'), 'Please enter some text to convert', 'error');
        return;
    }
    
    // Remember API key if checkbox is checked
    const rememberCheckbox = document.getElementById('remember-key');
    if (rememberCheckbox && rememberCheckbox.checked) {
        localStorage.setItem('openai_api_key', apiKey);
    } else {
        localStorage.removeItem('openai_api_key');
    }
    
    // Style instructions are no longer used with the TTS API
    const styleInstructions = "";
    
    // Status and button updates
    const statusElement = document.getElementById('advanced-tts-status-message');
    if (statusElement) {
        showStatus(statusElement, 'Generating speech... please wait', '');
    }
    this.disabled = true;
    
    console.log(`Generating speech with model: ${model}, voice: ${selectedVoice}`);
    
    // Make API call with new parameters
    generateSpeech(text, selectedVoice, styleInstructions, model)
        .then(blob => {
            const audioElement = document.getElementById('advanced-tts-audio-player');
            if (audioElement) {
                const audioUrl = URL.createObjectURL(blob);
                audioElement.src = audioUrl;
                audioElement.style.display = 'block';
                
                if (statusElement) {
                    showStatus(statusElement, 'Speech generated successfully!', 'success');
                }
                
                const playButton = document.getElementById('advanced-tts-play-btn');
                if (playButton) playButton.disabled = false;
                
                const downloadButton = document.getElementById('advanced-tts-download-btn');
                if (downloadButton) downloadButton.disabled = false;
            }
            this.disabled = false;
        })
        .catch(error => {
            if (statusElement) {
                showStatus(statusElement, `Error: ${error.message}`, 'error');
            }
            console.error('Speech generation error:', error);
            this.disabled = false;
        });
});

// Preset updates with new voices and styles
const stylePresets = {
    'british-narrator': {
        accent: 'british',
        speed: 0.9,
        tone: 'serious',
        instructions: 'Speak in a deep, authoritative voice like David Attenborough. Use dramatic pauses and emphasize descriptive words.'
    },
    'news-anchor': {
        accent: 'american',
        speed: 1.1,
        tone: 'professional',
        instructions: 'Speak clearly and professionally with a neutral tone. Emphasize important facts and maintain a steady pace.'
    },
    'storyteller': {
        accent: 'neutral',
        speed: 0.9,
        tone: 'friendly',
        instructions: 'Speak with warmth and variation in tone. Add drama to exciting parts and slow down for important moments.'
    },
    'teacher': {
        accent: 'neutral',
        speed: 0.9,
        tone: 'friendly',
        instructions: 'Speak clearly and at a measured pace. Emphasize key terms and use a slightly higher pitch for questions.'
    },
    'excited': {
        accent: 'american',
        speed: 1.3,
        tone: 'enthusiastic',
        instructions: 'Speak with high energy and enthusiasm. Use upward inflections and emphasize exciting words.'
    },
    'calm': {
        accent: 'neutral',
        speed: 0.8,
        tone: 'serious',
        instructions: 'Speak in a soothing, calming voice. Use a lower pitch and speak slowly with gentle transitions between sentences.'
    },
    // New presets
    'whisper': {
        accent: 'neutral',
        speed: 0.7,
        tone: 'serious',
        instructions: 'Speak in a soft whisper, as if sharing a secret. Keep your voice low and intimate.'
    },
    'dramatic': {
        accent: 'british',
        speed: 0.8,
        tone: 'serious',
        instructions: 'Speak with intense dramatic flair, emphasizing emotional words with strong vocal variations. Use strategic pauses for dramatic effect.'
    }
};

// Update preset selection handler for new presets
document.querySelectorAll('.style-preset').forEach(preset => {
    preset.addEventListener('click', function() {
        document.querySelectorAll('.style-preset').forEach(p => p.classList.remove('selected'));
        this.classList.add('selected');
        
        const presetName = this.getAttribute('data-preset');
        const presetData = stylePresets[presetName];
        
        if (presetData) {
            document.getElementById('accent-select').value = presetData.accent;
            document.getElementById('speed-slider').value = presetData.speed;
            document.getElementById('speed-value').textContent = presetData.speed;
            document.getElementById('tone-select').value = presetData.tone;
            document.getElementById('custom-instructions').value = presetData.instructions;
        }
    });
});

// Video tab updates for new voices
document.getElementById('video-generate-audio-btn').addEventListener('click', function() {
    const apiKey = document.getElementById('api-key').value.trim();
    const script = document.getElementById('video-script').value.trim();
    
    if (!apiKey || !script) {
        const statusElement = document.getElementById('video-status-message');
        if (statusElement) {
            showStatus(statusElement, 
                !apiKey ? 'Please enter your OpenAI API key' : 'Please generate or enter a script first', 
                'error');
        }
        return;
    }
    
    // Get selected voice
    const voiceSelect = document.getElementById('video-voice');
    const voice = voiceSelect ? voiceSelect.value : 'alloy';
    
    // Style instructions are no longer used - blank string
    const styleInstructions = "";
    
    // Status updates
    const statusElement = document.getElementById('video-status-message');
    if (statusElement) {
        showStatus(statusElement, 'Generating voiceover audio... please wait', '');
    }
    this.disabled = true;
    
    console.log(`Generating voiceover with voice: ${voice}`);
    
    // Use the updated API call with standard TTS model
    generateVoiceover(script, voice, styleInstructions, 'tts-1')
        .then(blob => {
            const audioElement = document.getElementById('video-audio-player');
            if (audioElement) {
                const audioUrl = URL.createObjectURL(blob);
                audioElement.src = audioUrl;
                audioElement.style.display = 'block';
                
                const playButton = document.getElementById('video-play-btn');
                if (playButton) playButton.disabled = false;
                
                const downloadButton = document.getElementById('video-download-btn');
                if (downloadButton) downloadButton.disabled = false;
                
                if (statusElement) {
                    showStatus(statusElement, 'Voiceover generated successfully!', 'success');
                }
            }
            this.disabled = false;
        })
        .catch(error => {
            if (statusElement) {
                showStatus(statusElement, `Error: ${error.message}`, 'error');
            }
            console.error('Voiceover generation error:', error);
            this.disabled = false;
        });
});
