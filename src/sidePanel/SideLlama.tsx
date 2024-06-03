/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  useInterval
} from '@chakra-ui/react';
import localforage from 'localforage';

import { AddToChat } from './AddToChat';
import { Background } from './Background';
import { ChatHistory, ChatMessage } from './ChatHistory';
import { useConfig } from './ConfigContext';
import { Header } from './Header';
import { Input } from './Input';
import { Messages } from './Messages';
import { downloadImage, downloadJson, downloadText } from './messageUtils';
import { fetchDataAsStream, webSearch } from './network';
import { Send } from './Send';
import { Settings } from './Settings';
import { setTheme, themes } from './Themes';

const generateTitle = 'create a short title to our conversation. only answer with the title string, say nothing else but the chat title. use spaces between the words. Here is an example title: New summarizer assignment';

function bridge() {
  const response = JSON.stringify({
    title: document.title,
    text: document.body.innerText.replace(/\s\s+/g, ' '),
    html: document.body.innerHTML.replace(/\s\s+/g, ' ')
  });
  return response;
}

async function injectBridge() {
  const queryOptions = { active: true, lastFocusedWindow: true };

  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  if (!tab?.id) return;
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      func: bridge
    })
    .then(result => {
      const res = JSON.parse(result?.[0]?.result || '{}');
      localStorage.setItem('pagestring', JSON.stringify(res?.text || ''));
      localStorage.setItem('pagehtml', JSON.stringify(res?.html || ''));
    });
}

const configBody = {
  model: 'llama3-8b-8192',
  temperature: 1,
  max_tokens: 1024,
  top_p: 1,
  stop: null,
  stream: true
};

const generateChatId = () => `chat_${Math.random().toString(16).slice(2)}`;

const MessageTemplate = ({ children, onClick }) => (
  <Box
    background="var(--bg)"
    border="2px"
    borderColor="var(--text)"
    borderRadius={16}
    color="var(--text)"
    cursor="pointer"
    defaultValue="default"
    fontSize="md"
    fontStyle="bold"
    fontWeight={600}
    overflow="hidden"
    pb={0.5}
    pl={3}
    pr={3}
    pt={0.5}
    textOverflow="ellipsis"
    whiteSpace="nowrap"
    width="fit-content"
    mr={4}
    mb={3}
    onClick={onClick}
  >
    {children}
  </Box>
);

const SideLlama = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [chunk, setChunk] = useState('');
  const [chatId, setChatId] = useState(generateChatId());
  const [response, setResponse] = useState('');
  const [webContent, setWebContent] = useState('');
  const [chatTitle, setChatTitle] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [settingsMode, setSettingsMode] = useState(false);
  const [historyMode, setHistoryMode] = useState(false);
  const { config, updateConfig } = useConfig();

  useInterval(async () => {
    if (config?.chatMode === 'page') {
      await injectBridge();
    }
  }, 2000);

  const onSend = async () => {
    if (isLoading || !message) return;
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

    fetchDataAsStream(
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
      { Authorization: `Bearer ${config?.groqApiKey}` }
    );
  };

  const reset = () => {
    setMessages([]);
    setPageContent('');
    setWebContent('');
    setLoading(false);
    updateConfig({ chatMode: undefined });
    setChunk('');
    setMessage('');
    setChatTitle('');
    setChatId(generateChatId());
  };

  const onReload = () => {
    setMessages(messages.slice(2));
    setMessage(messages[1]);
  };

  // load stored theme
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'moss';
    setTheme(themes.find(({ name }) => name === theme) || themes[0]);
  }, []);

  useEffect(() => {
    if (response) {
      const [, ...others] = messages;
      setMessages([response, ...others]);
    }
  }, [response]);

  useEffect(() => {
    if (!isLoading && messages.length > 3 && !chatTitle && config?.generateTitle) {
      const currentMessages = [message, ...messages].map((m, i) => ({
        content: m || generateTitle,
        role: i % 2 === 1 ? 'assistant' : 'user'
      })).reverse();

      fetchDataAsStream(
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
        { Authorization: `Bearer ${config?.groqApiKey}` }
      );
    }
  }, [isLoading]);

  const loadChat = (chat: ChatMessage) => {
    setChatTitle(chat.title);
    setMessages(chat.messages);
    setChatId(chat.id);
    setHistoryMode(false);
  };

  useEffect(() => {
    if (messages.length && !isLoading) {
      const savedChat = {
        id: chatId,
        last_updated: Date.now(),
        title: chatTitle || messages[messages.length - 1],
        messages
      };
      localforage.setItem(chatId, savedChat);
    }
  }, [chatId, messages, isLoading, chatTitle]);

  return (
    <Container
      maxWidth="100%"
      minHeight="100vh"
      padding={0}
      textAlign="center"
    >
      <Box
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        minHeight="100vh"
      >
        <Header
          chatTitle={chatTitle}
          downloadImage={() => downloadImage(messages)}
          downloadJson={() => downloadJson(messages)}
          downloadText={() => downloadText(messages)}
          historyMode={historyMode}
          reset={reset}
          setHistoryMode={setHistoryMode}
          setSettingsMode={setSettingsMode}
          settingsMode={settingsMode}
        />
        {settingsMode && <Settings />}
        {!settingsMode && !historyMode && messages.length > 0 && (
        <Messages
          isLoading={isLoading}
          messages={messages}
          settingsMode={settingsMode}
          onReload={onReload}
        />
        )}
        {!settingsMode && !historyMode && messages.length === 0 && !config?.chatMode && (
          <Box position="absolute" bottom="4rem" left="0.5rem">
            <MessageTemplate onClick={() => {
              updateConfig({ chatMode: 'web' });
            }}
            >
              web search
            </MessageTemplate>
            <MessageTemplate onClick={() => {
              updateConfig({ chatMode: 'page' });
            }}
            >
              chat about page
            </MessageTemplate>
          </Box>
        )}
        {!settingsMode && !historyMode && (
          <Box
            background="var(--active)"
            borderTop="2px solid var(--text)"
            display="flex"
            justifyContent="space-between"
            pb={2}
            pt={2}
            style={{ opacity: settingsMode ? 0 : 1 }}
            zIndex={2}
          >
            <Input isLoading={isLoading} message={message} setMessage={setMessage} onSend={onSend} />
            <AddToChat />
            <Send isLoading={isLoading} onSend={onSend} />
          </Box>
        )}
        {historyMode && <ChatHistory loadChat={loadChat} />}
        <Background />
      </Box>
    </Container>
  );
};

export default SideLlama;
