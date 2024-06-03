import { RepeatIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { Message } from './Message';

export const Messages = ({ messages = [] as string[], isLoading = false, onReload = () => {}, settingsMode = false }) => (
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
      )
    )}
  </Box>
);
