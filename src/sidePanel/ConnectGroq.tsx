import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton, Input, useToast } from '@chakra-ui/react';

import { useConfig } from './ConfigContext';

const GROQ_URL = 'https://api.groq.com/openai/v1/models';

export const ConnectGroq = () => {
  const { config, updateConfig } = useConfig();
  const [apiKey, setApiKey] = useState(config?.groqApiKey);
  const [visibleApiKeys, setVisibleApiKeys] = useState(false);
  const toast = useToast();
  const onConnect = () => {
    fetch(GROQ_URL, { headers: { Authorization: `Bearer ${apiKey}` } })
      .then(res => res.json())
      .then(data => {
        if (data?.error) {
          toast({
            title: `${data?.error?.message}`,
            status: 'error',
            isClosable: false,
            containerStyle: {
              borderRadius: 16,
              color: 'var(--text)'
            }
          });

          updateConfig({ groqError: data?.error?.message, groqConnected: false });
        } else {
          toast({
            title: 'connected to groq',
            status: 'success',
            isClosable: false,
            styleConfig: {
              borderRadius: 16,
              color: 'var(--text)'
            }
          });

          const otherModels = config?.models?.filter((m: any) => !m?.host || m?.host !== 'groq');
          updateConfig({
            groqApiKey: apiKey,
            groqConnected: true,
            models: [
              ...(otherModels || []),
              ...(data?.data.map((m: any) => ({ ...m, host: 'groq' })) || [])
            ],
            groqError: undefined
          });
        }
      })
      .catch(err => {
        toast({
          title: err.message,
          status: 'error',
          isClosable: false,
          containerStyle: {
            borderRadius: 16,
            color: 'var(--text)'
          }
        });
      });
  };

  const disabled = config?.groqApiKey === apiKey;
  const isConnected = config?.groqConnected && config?.groqApiKey === apiKey;

  return (
    <Box display="flex" mb={4} ml={4} mr={4}>
      <Input
        _focus={{
          borderColor: 'var(--text)',
          boxShadow: 'none !important'
        }}
        _hover={{
          borderColor: !disabled && 'var(--text)',
          boxShadow: !disabled && 'none !important'
        }}
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
        placeholder="GROQ_API_KEY"
        size="sm"
        style={{ width: '90%' }}
        type={!visibleApiKeys ? 'password' : undefined}
        value={apiKey}
        variant="outline"
        onChange={e => setApiKey(e.target.value)}
      />
      {!isConnected && (
      <Button
        _hover={{
          background: 'var(--active)',
          border: '2px solid var(--text)'
        }}
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
      {isConnected && (
      <IconButton
        isRound
        _hover={{
          background: 'var(--active)',
          border: '2px solid var(--text)'
        }}
        aria-label="Done"
        background="var(--active)"
        border="2px solid var(--text)"
        color="var(--text)"
        fontSize="19px"
        icon={visibleApiKeys ? <ViewOffIcon /> : <ViewIcon />}
        size="sm"
        variant="solid"
        onClick={() => setVisibleApiKeys(!visibleApiKeys)}
      />
      )}

    </Box>
  );
};
