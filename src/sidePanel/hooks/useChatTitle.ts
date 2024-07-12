import { useEffect, useState } from 'react';

import { useConfig } from '../ConfigContext';
import { fetchDataAsStream } from '../network';

const generateTitle = 'create a short title to our conversation. only answer with the title string, say nothing else but the chat title. use spaces between the words. Here is an example title: New summarizer assignment';

export const useChatTitle = (isLoading, messages, message) => {
  const [chatTitle, setChatTitle] = useState('');
  const { config } = useConfig();
  const configBody = { stream: true };

  useEffect(() => {
    if (!isLoading && messages.length > 3 && !chatTitle && config?.generateTitle) {
      const currentMessages = [message, ...messages].map((m, i) => ({
        content: m || generateTitle,
        role: i % 2 === 1 ? 'assistant' : 'user'
      })).reverse();

      const currentModel = config?.models?.find(({ id }: any) => id === config?.selectedModel);
      const url = {
        groq: 'https://api.groq.com/openai/v1/chat/completions',
        ollama: `${config?.ollamaUrl}/api/chat`,
        gemini: ''
      }[currentModel?.host || ''];

      fetchDataAsStream(
        url,
        {
          ...configBody,
          model: config?.selectedModel,
          messages: [
            ...currentMessages
          ]
        },
        (part: string) => {
          if (part) setChatTitle(part.replace('"', '').replace('"', '').replace('# ', '').trim());
        },
        { Authorization: `Bearer ${config?.groqApiKey}` },
        currentModel?.host
      );
    }
  }, [isLoading]);

  return { chatTitle, setChatTitle };
};
