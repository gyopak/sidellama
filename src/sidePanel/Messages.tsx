import React from 'react';
import { RepeatIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { Message } from './Message';

import PropTypes from 'prop-types';

export const Messages = ({ messages = [] as string[], isLoading = false, onReload = () => {}, settingsMode = false }) => {
  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };

  return (
    <Box
      bottom="5rem"
      display="flex"
      flexDir="column-reverse"
      flexGrow={1}
      id="messages"
      marginBottom="-10px"
      marginTop="-20px"
      maxHeight="87vh"
      background="var(--bg)"
      paddingTop="5rem"
      overflow="scroll"
      paddingBottom="8px"
      position="absolute"
      style={{ opacity: settingsMode ? 0 : 1 }}
    >
      {messages.map(
        (m, i) => m && (
          <Box
            alignItems="flex-end"
            display="flex"
            justifyContent="flex-start"
            // eslint-disable-next-line react/no-array-index-key
            key={`${m}_${i}`}
            mb={0}
            mt={3}
          >
            <Message i={i} m={m} />
            <Box display="flex" flexDirection="column" gap={1}>
              <IconButton
                aria-label="Copy"
                as={motion.div}
                borderRadius={16}
                icon={
                  !isLoading && i === 0 ? (
                    <CopyIcon color="var(--text)" fontSize="xl" />
                  ) : undefined
                }
                      variant="outlined"
                      whileHover={{ scale: 1.1, cursor: 'pointer' }}
                      onClick={() => copyMessage(m)}
                    />
              <IconButton
                aria-label="Repeat"
                as={motion.div}
                borderRadius={16}
                icon={
                  !isLoading && i === 0 ? (
                    <RepeatIcon
                      color="var(--text)"
                      fontSize="2xl"
                      onClick={onReload}
                    />
                  ) : undefined
                }
                variant="outlined"
                whileHover={{ rotate: '90deg', cursor: 'pointer' }}
              />
            </Box>
          </Box>
        ),
      )}
    </Box>
  );
};

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string),
  isLoading: PropTypes.bool,
  onReload: PropTypes.func,
  settingsMode: PropTypes.bool,
};
