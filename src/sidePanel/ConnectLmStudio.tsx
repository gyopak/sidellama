import React from 'react';
import { useState } from 'react';
import { CheckIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton, Input } from '@chakra-ui/react';

import { useConfig } from './ConfigContext';
import toast from 'react-hot-toast';

export const ConnectLmStudio = () => {
  const { config, updateConfig } = useConfig();
  const [url, setUrl] = useState(config?.lmStudioUrl || 'http://localhost:1234');
  const onConnect = () => {
    fetch(`${url}/v1/models`)
      .then(res => res.json())
      .then(data => {
        if (data?.error) {
          updateConfig({
            lmStudioError: data?.error?.message,
            lmStudioConnected: false
          });
          toast.error(data.error.message);
        } else {
          updateConfig({
            lmStudioConnected: true,
            lmStudioUrl: url,
            lmStudioError: undefined
          });
          toast.success("connected to LM Studio")
        }
      })
      .catch(err => {
        toast.error(err.message);

        updateConfig({
          lmStudioError: err,
          lmStudioConnected: false
        });
      });
  };

  const isConnected = config?.lmStudioConnected && config?.lmStudioUrl === url;
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
