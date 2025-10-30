/**
 * LLM Client for calling OpenAI and Anthropic APIs
 */

/**
 * Call LLM API with streaming support
 * @param {Object} config - Provider configuration
 * @param {Array} messages - Chat messages array
 * @param {Function} onChunk - Callback for each chunk
 * @returns {Promise<string>} Complete response
 */
export async function callLLM(config, messages, onChunk) {
  const { type, baseUrl, apiKey, model } = config;

  if (type === 'openai') {
    return callOpenAI(baseUrl, apiKey, model, messages, onChunk);
  } else if (type === 'anthropic') {
    return callAnthropic(baseUrl, apiKey, model, messages, onChunk);
  } else {
    throw new Error(`Unsupported provider type: ${type}`);
  }
}

/**
 * Call OpenAI-compatible API
 */
async function callOpenAI(baseUrl, apiKey, model, messages, onChunk) {
  const url = `${baseUrl}/chat/completions`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  return processOpenAIStream(response.body, onChunk);
}

/**
 * Process OpenAI streaming response
 */
async function processOpenAIStream(body, onChunk) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        
        if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.slice(6));
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              if (onChunk) onChunk(content);
            }
          } catch (e) {
            console.error('Failed to parse SSE:', e);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullText;
}

/**
 * Call Anthropic API
 */
async function callAnthropic(baseUrl, apiKey, model, messages, onChunk) {
  const url = `${baseUrl}/messages`;
  
  // Convert messages format for Anthropic
  const systemMessage = messages.find(m => m.role === 'system');
  const chatMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      system: systemMessage?.content,
      max_tokens: 4096,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${error}`);
  }

  return processAnthropicStream(response.body, onChunk);
}

/**
 * Process Anthropic streaming response
 */
async function processAnthropicStream(body, onChunk) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        
        try {
          const json = JSON.parse(trimmed.slice(6));
          
          if (json.type === 'content_block_delta') {
            const content = json.delta?.text;
            if (content) {
              fullText += content;
              if (onChunk) onChunk(content);
            }
          }
        } catch (e) {
          console.error('Failed to parse SSE:', e);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullText;
}

/**
 * Fetch available models from provider
 * @param {string} type - Provider type
 * @param {string} baseUrl - API base URL
 * @param {string} apiKey - API key
 * @returns {Promise<Array>} List of available models
 */
export async function fetchModels(type, baseUrl, apiKey) {
  if (type === 'openai') {
    const url = `${baseUrl}/models`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    return data.data.map(model => ({
      id: model.id,
      name: model.id,
    }));
  } else if (type === 'anthropic') {
    // Anthropic doesn't have a models endpoint, return common models
    return [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
    ];
  } else {
    throw new Error(`Unsupported provider type: ${type}`);
  }
}

