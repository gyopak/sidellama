import React, { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton, Input } from '@chakra-ui/react';
import { useConfig } from './ConfigContext';
import toast from 'react-hot-toast';
import { GEMINI_URL } from './constants';

export const ConnectGemini = () => {
  const { config, updateConfig } = useConfig();
  const [apiKey, setApiKey] = useState(config?.geminiApiKey);
  const [visibleApiKeys, setVisibleApiKeys] = useState(false);
  const onConnect = () => {
    fetch(GEMINI_URL, { headers: { Authorization: `Bearer ${apiKey}` } })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data?.error) {
          toast.error(`${data?.error?.message}`);
          updateConfig({ geminiError: data?.error?.message, geminiConnected: false });
        } else {
          toast.success('connected to Gemini');
          updateConfig({ geminiApiKey: apiKey, geminiConnected: true, geminiError: undefined });
        }
      })
      .catch(err => {
        toast.error(err.message);
      });
  };

  const disabled = config?.geminiApiKey === apiKey;
  const isConnected = config?.geminiConnected && config?.geminiApiKey === apiKey;

  return (
    <Box display="flex" mb={4} ml={4} mr={4}>
      <Input
        _focus={{ borderColor: 'var(--text)', boxShadow: 'none !important' }}
        _hover={{ borderColor: !disabled && 'var(--text)', boxShadow: !disabled && 'none !important' }}
        autoComplete="off"
        border="2px"
        borderColor="var(--text)"
        borderRadius={16}
        color="var(--text)"
        fontSize="md"
        fontStyle="bold"
        fontWeight={600}
        id="user-input"
        mr={4}
        placeholder="GEMINI_API_KEY"
        size="sm"
        type={!visibleApiKeys ? 'password' : 'text'}
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
      />
      <IconButton
        isRound
        _hover={{
          background: 'var(--active)',
          border: '2px solid var(--text)'
        }}
        aria-label="Toggle visibility"
        background="var(--active)"
        border="2px solid var(--text)"
        color="var(--text)"
        fontSize="19px"
        icon={visibleApiKeys ? <ViewOffIcon /> : <ViewIcon />}
        size="sm"
        variant="solid"
        onClick={() => setVisibleApiKeys(!visibleApiKeys)}
      />
      {!isConnected && (
        <Button
          _hover={{ background: 'var(--active)', border: '2px solid var(--text)' }}
          background="var(--active)"
          border="2px solid var(--text)"
          borderRadius={16}
          color="var(--text)"
          disabled={disabled}
          size="sm"
          onClick={onConnect}
        >
          connect
        </Button>
      )}
    </Box>
  );
};