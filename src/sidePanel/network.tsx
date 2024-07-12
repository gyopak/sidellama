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
  const url = new URL(domain);
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

    // @ts-ignore
    addRules: rules
  });
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

export async function fetchDataAsStream(url: string, data: any, onMessage: any, headers = {}, host: string) {
  if (url.includes('localhost')) {
    await urlRewriteRuntime(cleanUrl(url));
  }

  console.log(url, host, data)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(data)
    });

    // Check if response is ok
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
        }
        const data = new TextDecoder().decode(value)
        try {
          const parsed = JSON.parse(data);
        } catch {
          onMessage(str || '');
        }
        str += parsed?.message?.content;
        onMessage(str || '');
      }

      onMessage(str, true);
    }

    if (host === "lmStudio") {
      const stream = events(response);
      for await (const event of stream) {
        try {
          const received = JSON.parse(event.data || '');
          console.log(event)
          const err = received?.x_groq?.error;
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

    if (host === "groq") {
      const stream = events(response);
      for await (const event of stream) {
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
