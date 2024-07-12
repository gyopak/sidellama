/* eslint-disable no-undef */

import { fetchDataAsStream, webSearch } from '../network';

const useSendMessage = (
  isLoading,
  originalMessage,
  messages,
  webContent,
  config,
  setMessages,
  setMessage,
  setResponse,
  setWebContent,
  setPageContent,
  setLoading
) => {
  const onSend = async (overridedMessage?: string) => {
    const message = overridedMessage || originalMessage;
    if (isLoading || !(message)) return;
    setLoading(true);

    const currentMessages = [message, ...messages].map((m, i) => ({
      content: m,
      role: i % 2 === 1 ? 'assistant' : 'user'
    })).reverse();

    let searchRes = '';

    if (config?.chatMode === 'web' && !webContent) {
      searchRes = await webSearch(message, config?.webMode);
    }

    const newMessages = ['', message, ...messages];
    setMessages(newMessages);
    setMessage('');
    setResponse('');

    const persona = config?.personas[config?.persona];
    const pageString = JSON.parse(localStorage.getItem('pagestring') || '{}');
    const pageHtml = JSON.parse(localStorage.getItem('pagehtml') || '{}');
    const currentPageContent = config?.chatMode === 'page' && (config?.pageMode === 'html' ? pageHtml : pageString);

    const charLimit = 1000 * (config?.contextLimit || 1);
    const limitedContent = charLimit && currentPageContent?.substr?.(0, charLimit);
    const unlimitedContent = config?.contextLimit === 50 && currentPageContent;

    const webLimit = 1000 * (config?.webLimit || 1);
    const limitedWebResult = charLimit && searchRes?.substr?.(0, webLimit);
    const unlimitedWebresults = config?.webLimit === 50 && searchRes;

    if (unlimitedWebresults || limitedWebResult) setWebContent(unlimitedWebresults || limitedWebResult as string);
    if (unlimitedContent || limitedContent) setPageContent(unlimitedContent || limitedContent);

    const pageChat = unlimitedContent || limitedContent;
    const webChat = unlimitedWebresults || limitedWebResult;

    const content = `
      ${persona}
      ${pageChat && `. here is the page content: ${pageChat}`}
      ${webChat && `. here is a quick web search result about the topic (refer to this as your quick web search): ${webChat}`}
    `;

    const configBody = { stream: true };
    const currentModel = config?.models?.find(({ id }: any) => id === config?.selectedModel);
    console.log(currentModel)
    const url = {
      groq: 'https://api.groq.com/openai/v1/chat/completions',
      ollama: `${config?.ollamaUrl}/api/chat`,
      gemini: '',
      lmStudio: `${config?.lmStudioUrl}/v1/chat/completions`,
    }[currentModel?.host || ''];

    fetchDataAsStream(
      url,
      {
        ...configBody,
        model: config?.selectedModel,
        messages: [
          { role: 'system', content },
          ...currentMessages
        ]
      },
      (part: string, isFinished: boolean) => {
        if (isFinished) {
          setResponse(part);
          setLoading(false);
        } else {
          setResponse(part || '');
        }
      },
      { Authorization: `Bearer ${config?.groqApiKey}` },
      currentModel?.host
    );
  };

  return onSend;
};

export default useSendMessage;
