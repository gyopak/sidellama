/* eslint-disable no-undef */
import React from 'react';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  Box,
  Container,
  useInterval
} from '@chakra-ui/react';
import localforage from 'localforage';

import { useChatTitle } from './hooks/useChatTitle';
import useSendMessage from './hooks/useSendMessage';
import { useUpdateModels } from './hooks/useUpdateModels';
import { AddToChat } from './AddToChat';
import { Background } from './Background';
import { ChatHistory, ChatMessage } from './ChatHistory';
import { useConfig } from './ConfigContext';
import { Header } from './Header';
import { Input } from './Input';
import { Messages } from './Messages';
import { downloadImage, downloadJson, downloadText } from './messageUtils';
import { Send } from './Send';
import { Settings } from './Settings';
import { setTheme, themes } from './Themes';

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

const generateChatId = () => `chat_${Math.random().toString(16).slice(2)}`;

// eslint-disable-next-line react/prop-types
const MessageTemplate = ({ children, onClick }) => (
  <Box
    background="var(--bg)"
    border="2px"
    borderColor="var(--text)"
    borderRadius={16}
    color="var(--text)"
    cursor="pointer"
    defaultValue="default"
    fontSize="lg"
    fontStyle="bold"
    fontWeight={600}
    mb={3}
    mr={4}
    overflow="hidden"
    pb={0.5}
    pl={3}
    pr={3}
    pt={0.5}
    textOverflow="ellipsis"
    whiteSpace="nowrap"
    width="fit-content"
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

  const { chatTitle, setChatTitle } = useChatTitle(isLoading, messages, message);

  const onSend = useSendMessage(isLoading, message, messages, webContent, config, setMessages, setMessage, setResponse, setWebContent, setPageContent, setLoading);

  useUpdateModels();

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
    updateConfig({ chatMode: undefined })
  }, []);

  useEffect(() => {
    if (response) {
      const [, ...others] = messages;
      setMessages([response, ...others]);
    }
  }, [response]);

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
          <Box bottom="4rem" left="0.5rem" position="absolute">
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
        {!settingsMode && !historyMode && messages.length === 0 && config?.chatMode === "page" && (
          <Box bottom="4rem" left="0.5rem" position="absolute">
            <MessageTemplate onClick={async () => {
              await onSend('extract data');
            }}
            >
              extract data
            </MessageTemplate>
            <MessageTemplate onClick={async () => {
              await onSend('summarize content');
            }}
            >
              summarize content
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
        {config?.backgroundImage ? <Background /> : null}
      </Box>
      <Toaster
        containerStyle={{
          borderRadius: 16,
        }}
        toastOptions={{
          duration: 2000,
          position: "bottom-center",
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: "1.25rem",
          },

          // Default options for specific types
          success: {
            duration: 2000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: "1.25rem",
            },
          },
        }} />
    </Container>
  );
};

export default SideLlama;
