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
    const styleInstructionsSection = document.querySelector('button.collapsible:contains("Custom Instructions")').nextElementSibling;
    
    // Only enable style instructions for models that support it
    if (model === 'gpt-4o-mini-tts' || model === 'gpt-4o-audio-preview') {
        styleInstructionsSection.style.opacity = '1';
        styleInstructionsSection.querySelector('textarea').disabled = false;
    } else {
        styleInstructionsSection.style.opacity = '0.5';
        styleInstructionsSection.querySelector('textarea').disabled = true;
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
    const accent = document.getElementById('accent-select').value;
    const speed = document.getElementById('speed-slider').value;
    const tone = document.getElementById('tone-select').value;
    const customInstructions = document.getElementById('custom-instructions').value.trim();
    
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
    if (document.getElementById('remember-key').checked) {
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
    
    if (customInstructions) {
        styleInstructions += customInstructions;
    }
    
    // Status and button updates
    showStatus(document.getElementById('advanced-tts-status-message'), 'Generating styled speech... please wait', '');
    this.disabled = true;
    
    // Make API call with new parameters
    generateSpeech(text, selectedVoice, styleInstructions, model)
        .then(blob => {
            const audioElement = document.getElementById('advanced-tts-audio-player');
            const audioUrl = URL.createObjectURL(blob);
            audioElement.src = audioUrl;
            audioElement.style.display = 'block';
            
            showStatus(document.getElementById('advanced-tts-status-message'), 'Speech generated successfully!', 'success');
            document.getElementById('advanced-tts-play-btn').disabled = false;
            document.getElementById('advanced-tts-download-btn').disabled = false;
            this.disabled = false;
        })
        .catch(error => {
            showStatus(document.getElementById('advanced-tts-status-message'), `Error: ${error.message}`, 'error');
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
        showStatus(document.getElementById('video-status-message'), 
            !apiKey ? 'Please enter your OpenAI API key' : 'Please generate or enter a script first', 
            'error');
        return;
    }
    
    const voice = document.getElementById('video-voice').value;
    const accent = document.getElementById('video-accent').value;
    const speed = document.getElementById('video-speed-slider').value;
    const tone = document.getElementById('video-tone').value;
    const customInstructions = document.getElementById('video-custom-instructions').value.trim();
    
    // Build style instructions
    let styleInstructions = `You are narrating a video.`;
    
    if (accent !== 'neutral') {
        styleInstructions += ` Speak with a ${accent} accent.`;
    }
    
    if (speed !== '1') {
        if (parseFloat(speed) < 1) {
            styleInstructions += ` Speak slower than normal.`;
        } else {
            styleInstructions += ` Speak faster than normal.`;
        }
    }
    
    if (tone !== 'neutral') {
        styleInstructions += ` Use a ${tone} tone.`;
    }
    
    if (customInstructions) {
        styleInstructions += ` ${customInstructions}`;
    }
    
    // Status updates
    showStatus(document.getElementById('video-status-message'), 'Generating voiceover audio... please wait', '');
    this.disabled = true;
    
    // Use the new API call
    generateVoiceover(script, voice, styleInstructions, 'gpt-4o-mini-tts')
        .then(blob => {
            const audioElement = document.getElementById('video-audio-player');
            const audioUrl = URL.createObjectURL(blob);
            audioElement.src = audioUrl;
            audioElement.style.display = 'block';
            
            document.getElementById('video-play-btn').disabled = false;
            document.getElementById('video-download-btn').disabled = false;
            this.disabled = false;
            
            showStatus(document.getElementById('video-status-message'), 'Voiceover generated successfully!', 'success');
        })
        .catch(error => {
            showStatus(document.getElementById('video-status-message'), `Error: ${error.message}`, 'error');
            this.disabled = false;
        });
});
