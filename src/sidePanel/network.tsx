// Fetching data using readable stream
import { events } from 'fetch-event-stream';

// clean url ending if it with /
export const cleanUrl = (url: string) => {
  if (url.endsWith('/')) {
    return url.slice(0, -1);
  }

  return url;
};

export const urlRewriteRuntime = async function (
  domain: string,
  type = 'ollama'
) {
  try {
    const url = new URL(domain);
    // Skip chrome:// URLs
    if (url.protocol === 'chrome:') {
      return;
    }
    
    const domains = [url.hostname];
    const origin = `${url.protocol}//${url.hostname}`;

    const rules = [
      {
        id: 1,
        priority: 1,
        condition: { requestDomains: domains },
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            {
              header: 'Origin',
              operation: 'set',
              value: origin
            }
          ]
        }
      }
    ];
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map(r => r.id),
      addRules: rules
    });
  } catch (error) {
    console.debug('URL rewrite skipped:', error);
  }
};

export const webSearch = async (query: string, webMode: string) => {
  const baseUrl = webMode === 'brave' ? `https://search.brave.com/search?q=${query}` : 'https://html.duckduckgo.com/html/';
  await urlRewriteRuntime(cleanUrl(`${baseUrl}${query}`));

  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), 15000);
  const formData = new FormData();
  formData.append('q', query);

  const htmlString = await fetch(
    `${baseUrl}`,
    { signal: abortController.signal, method: webMode === 'brave' ? 'GET' : 'POST', body: webMode === 'brave' ? undefined : formData }
  )
    .then(response => response.text())
    .catch();

  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlString, 'text/html');
  htmlDoc.querySelectorAll('svg,#header,style,link[rel="stylesheet"],script,input,option,select,form').forEach(item => item.remove());
  return htmlDoc.body.innerText.replace(/\s\s+/g, ' ');
};

export async function fetchDataAsStream(
  url: string,
  data: Record<string, unknown>,
  onMessage: (message: string, done?: boolean) => void,
  headers: Record<string, string> = {},
  host: string
) {
  if (url.startsWith('chrome://')) {
    return; // Skip chrome:// URLs
  }

  if (url.includes('localhost')) {
    await urlRewriteRuntime(cleanUrl(url));
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    let str = '';

    if (host === "ollama") {
      if (!response.body) return;
      const reader = response.body.getReader();

      let done;
      let value;
      while (!done) {
        ({ value, done } = await reader.read());
        if (done) {
          onMessage(str, true);
          break;
        }
        const chunk = new TextDecoder().decode(value);
        // Handle [DONE] marker
        if (chunk.trim() === '[DONE]') {
          onMessage(str, true);
          break;
        }
        try {
          const parsed = JSON.parse(chunk);
          if (parsed.message?.content) {
            str += parsed.message.content;
            onMessage(str);
          }
        } catch (e) {
          // Ignore JSON parse errors for non-JSON chunks
          console.debug('Skipping invalid JSON chunk:', chunk);
          continue;
        }
      }
    }

    if (host === "lmStudio") {
      const stream = events(response);
      for await (const event of stream) {
        if (!event.data) continue;
        // Handle [DONE] marker
        if (event.data.trim() === '[DONE]') {          onMessage(str, true);

          break;
        }
        try {
          const received = JSON.parse(event.data || '');
          const err = received?.x_groq?.error;
          if (err) {
            onMessage(`Error: ${err}`, true);
            return;
          }

          str += received?.choices?.[0]?.delta?.content || '';
          onMessage(str || '');
        } catch (error) {
          // Skip invalid JSON chunks
          console.debug('Skipping invalid chunk:', event.data);
          continue;
        }
      }
    }

    if (host === "groq") {
      const stream = events(response);
      for await (const event of stream) {
        if (!event.data) continue;
        // Handle [DONE] marker
        if (event.data.trim() === '[DONE]') {          onMessage(str, true);

          break;
        }
        try {
          const received = JSON.parse(event.data || '');
          const err = received?.x_groq?.error;
          if (err) {
            onMessage(`Error: ${err}`, true);
            return;
          }

          str += received?.choices?.[0]?.delta?.content || '';
          onMessage(str || '');
        } catch (error) {
          // Skip invalid JSON chunks
          console.debug('Skipping invalid chunk:', event.data);
          continue;
        }
      }
    }

    if (host === "gemini") {
      const stream = events(response);
      for await (const event of stream) {
        if (!event.data) continue;

        // Check if the event data is exactly '[DONE]'
        if (event.data.trim() === '[DONE]') {
          onMessage(str, true);
          break;
        }

        try {
          // Only try to parse if it looks like JSON
          if (typeof event.data === 'string' && event.data.startsWith('{')) {
            const received = JSON.parse(event.data);
            const err = received?.x_gemini?.error;
            if (err) {
              onMessage(`Error: ${err}`, true);
              return;
            }
            str += received?.choices?.[0]?.delta?.content || '';
            onMessage(str || '');
          }
        } catch (error) {
          // Skip invalid chunks silently
          console.debug('Skipping invalid chunk');
          continue;
        }
      }
    }

    if (host === "openai") {
      const stream = events(response);
      for await (const event of stream) {
        if (!event.data) continue;
        try {
          const received = JSON.parse(event.data || '');
          const err = received?.x_openai?.error;
          if (err) {
            onMessage(`Error: ${err}`, true);
            return;
          }

          str += received?.choices?.[0]?.delta?.content || '';

          onMessage(str || '');
        } catch (error) {
          onMessage(`${error}`, true);
          console.error('Error fetching data:', error);
        }
      }
    }

    onMessage(str, true);
  } catch (error) {
    onMessage(`${error}`, true);
    console.error('Error fetching data:', error);
  }
}
