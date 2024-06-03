
import { useEffect, useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import localforage from 'localforage';

const dateToString = date => new Date(date).toLocaleDateString('sv-SE');

export type ChatMessage = {
  last_updated: number;
  id: string;
  messages: string[];
  title: string;
}

export const ChatHistory = ({ loadChat }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hoverId, setHoverId] = useState('');
  const [removeId, setRemoveId] = useState('');

  const messagesWithDates = messages.map(message => ({
    ...message,
    date: dateToString(message.last_updated)
  }));

  const uniqueDates = Array.from(
    new Set(messagesWithDates.map(message => message.date))
  );

  useEffect(() => {
    localforage.keys().then(async keys => {
      const storedMessages = await Promise.all(keys.map(key => localforage.getItem(key))) as ChatMessage[];
      setMessages(storedMessages.sort((a, b) => b.last_updated - a.last_updated));
    });
  }, []);

  const deleteMessage = (id: string) => {
    localforage.removeItem(id).then(async () => {
      localforage.keys().then(async keys => {
        const storedMessages = await Promise.all(keys.map(key => localforage.getItem(key))) as ChatMessage[];
        setMessages(storedMessages.sort((a, b) => b.last_updated - a.last_updated));
      });
    });
  };

  return (
    <Box
      height="100%"
      overflowX="hidden"
      overflowY="scroll"
      position="absolute"
      pt="5rem"
      top="0rem"
      width="100%"
    >
      {uniqueDates.map(date => (
        <Box mb="2rem">
          <Text
            color="var(--text)"
            fontSize="xl"
            fontWeight={800}
            overflow="hidden"
            pb={1}
            paddingLeft="1rem"
            textAlign="left"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            width="90%"
          >
            {date === dateToString(new Date()) ? 'today' : date}
          </Text>
          {messagesWithDates.filter(m => m.date === date).map(message => (
            <Box
              alignItems="center"
              display="flex"
              onMouseEnter={() => setHoverId(message.id)}
              onMouseLeave={() => setHoverId('')}
            >
              <Text
                color="var(--text)"
                cursor="pointer"
                fontSize="lg"
                fontWeight={400}
                paddingLeft="1rem"
                width="4.5rem"
              >
                {(`0${(new Date(message.last_updated)).getHours()}`).slice(-2)}
                :
                {(`0${(new Date(message.last_updated)).getMinutes()}`).slice(-2)}

              </Text>
              <Text
                _hover={{
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                  textDecorationThickness: '2px'
                }}
                color="var(--text)"
                cursor="pointer"
                fontSize="lg"
                fontWeight={800}
                overflow="hidden"
                paddingBottom="0.5rem"
                paddingLeft="1rem"
                paddingTop="0.5rem"
                textAlign="left"
                textDecoration={message.id === removeId ? 'line-through' : undefined}
                textDecorationThickness="2px"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                width="75%"
                onClick={() => loadChat(message)}
              >
                {message.title}
              </Text>
              {
                message.id === hoverId && (
                  <IconButton
                    aria-label="Reset"
                    as={motion.div}
                    borderRadius={16}
                    icon={<DeleteIcon color="var(--text)" fontSize="xl" />}
                    variant="outlined"
                    whileHover={{ rotate: '15deg', cursor: 'pointer' }}
                    onClick={() => deleteMessage(message.id)}
                    onMouseEnter={() => setRemoveId(message.id)}
                    onMouseLeave={() => setRemoveId('')}
                  />
                )
              }
            </Box>
          ))}
        </Box>
      ))}

    </Box>
  );
};
