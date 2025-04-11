// Updated TTS API Function with new model and style instructions support
async function generateSpeech(text, voice, styleInstructions, model = "tts-1") {
  const apiKey = document.getElementById('api-key').value.trim();
  if (!apiKey) {
    throw new Error("API key is required");
  }
  
  // Default to MP3 format
  const format = document.getElementById('tts-format')?.value || 'mp3';
  
  try {
    // Log estimated cost
    const estimatedCost = estimateCost(text, 'tts');
    console.log(`Estimated cost: $${estimatedCost}`);
    
    // For advanced models that support style instructions
    if (model === "tts-1" || model === "tts-1-hd") {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          voice: voice,
          input: text,
          response_format: format,
          speed: parseFloat(document.getElementById('speed-slider')?.value || 1.0),
          style_instructions: styleInstructions || "" // New parameter
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }
      
      // Get the audio data as a blob
      const blob = await response.blob();
      return blob;
    } 
    // For standard TTS models
    else {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model, // tts-1 or tts-1-hd
          voice: voice,
          input: text,
          response_format: format,
          speed: parseFloat(document.getElementById('speed-slider')?.value || 1.0)
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }
      
      // Get the audio data as a blob
      const blob = await response.blob();
      return blob;
    }
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

// Updated Speech-to-Text integration with new model
async function transcribeAudio(file, type, format, timestampGranularities, prompt) {
  const apiKey = document.getElementById('api-key').value.trim();
  if (!apiKey) {
    throw new Error("API key is required");
  }
  
  try {
    // Create a FormData object to upload the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'gpt-4o-transcribe'); // Updated to new model
    
    // Set response format
    formData.append('response_format', format);
    
    // Add timestamps if requested (for verbose_json)
    if (format === 'verbose_json' && timestampGranularities.length > 0) {
      formData.append('timestamp_granularities', JSON.stringify(timestampGranularities));
    }
    
    // Add prompt if provided
    if (prompt) {
      formData.append('prompt', prompt);
    }
    
    // Estimate cost based on file duration (rough estimate)
    const estimatedCost = estimateCost(file.size, 'transcribe');
    console.log(`Estimated transcription cost: $${estimatedCost}`);
    
    // Determine endpoint based on type (transcription or translation)
    const endpoint = type === 'translation' 
      ? 'https://api.openai.com/v1/audio/translations'
      : 'https://api.openai.com/v1/audio/transcriptions';
    
    // Make the API request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
        // Don't set Content-Type header for FormData - browser will set it
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }
    
    // Parse the response based on format
    if (format === 'text') {
      return await response.text();
    } else {
      const jsonResponse = await response.json();
      return JSON.stringify(jsonResponse, null, 2);
    }
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

// Cost estimation function for user feedback
function estimateCost(input, modelType) {
  // For TTS models, estimate based on character count
  if (modelType === 'tts') {
    // Approximate token count (rough estimate)
    const text = typeof input === 'string' ? input : '';
    const tokenCount = text.length / 4;
    
    // $0.60 per million tokens for gpt-4o-mini-tts
    return ((tokenCount / 1000000) * 0.60).toFixed(4);
  } 
  // For STT models, estimate based on file size/duration
  else if (modelType === 'transcribe') {
    // Very rough estimate based on file size
    // Assuming ~1MB per minute of audio at moderate quality
    const fileSizeInMB = input / (1024 * 1024);
    const estimatedMinutes = fileSizeInMB;
    
    // $0.006 per minute for gpt-4o-transcribe
    return (estimatedMinutes * 0.006).toFixed(4);
  }
  
  return "0.0000"; // Default fallback
}

// Voiceover generation with style instructions
async function generateVoiceover(script, voice, styleInstructions, model = "tts-1") {
  // This is similar to generateSpeech but optimized for video narration
  const apiKey = document.getElementById('api-key').value.trim();
  if (!apiKey) {
    throw new Error("API key is required");
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        voice: voice,
        input: script,
        response_format: 'mp3',
        speed: parseFloat(document.getElementById('video-speed-slider')?.value || 1.0),
        style_instructions: styleInstructions
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }
    
    // Get the audio data as a blob
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error generating voiceover:', error);
    throw error;
  }
}
