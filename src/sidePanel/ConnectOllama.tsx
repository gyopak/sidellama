import { useState } from 'react';
import { CheckIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton, Input, useToast } from '@chakra-ui/react';

import { useConfig } from './ConfigContext';

export const ConnectOllama = () => {
  const { config, updateConfig } = useConfig();
  const [url, setUrl] = useState(config?.ollamaUrl || 'http://localhost:11434');
  const toast = useToast();
  const onConnect = () => {
    fetch(`${url}/api/tags`)
      .then(res => res.json())
      .then(data => {
        if (data?.error) {
          updateConfig({
            ollamaError: data?.error?.message,
            ollamaConnected: false
          });
        } else {
          const otherModels = config?.models?.filter((m: any) => !m?.host || m?.host !== 'ollama');
          updateConfig({
            ollamaConnected: true,
            models: [...(otherModels || []),
              ...(data?.models?.map((m: any) => ({ ...m, id: m.name, host: 'ollama' })) || [])],
            ollamaUrl: url,
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

        updateConfig({
          ollamaError: err,
          ollamaConnected: false
        });
      });
  };

  const isConnected = config?.ollamaConnected && config?.ollamaUrl === url;
  return (
    <Box display="flex" mb={4} ml={4} mr={4}>
      <Input
        _focus={{
          borderColor: 'var(--text)',
          boxShadow: 'none !important'
        }}
        _hover={{
          borderColor: 'var(--text)',
          boxShadow: 'none !important'
        }}
        border="2px"
        borderColor="var(--text)"
        borderRadius={16}
        color="var(--text)"
        fontSize="md"
        fontStyle="bold"
        fontWeight={600}
        id="user-input"
        mr={4}
        size="sm"
        style={{ width: '90%' }}
        value={url}
        variant="outline"
        onChange={e => setUrl(e.target.value)}
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
          fontSize="md"
          icon={<CheckIcon />}
          size="sm"
          variant="solid"
          onClick={() => updateConfig({ visibleApiKeys: !config?.visibleApiKeys })}
        />
      )}
    </Box>
  );
};
