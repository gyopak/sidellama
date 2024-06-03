import { ArrowRightIcon } from '@chakra-ui/icons';
import { IconButton, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const Send = ({ isLoading, onSend }: { isLoading: boolean, onSend: () => void }) => (
  <IconButton
    aria-label="Settings"
    as={motion.div}
    background="var(--bg)"
    border="2px solid var(--text)"
    borderRadius={16}
    icon={
        isLoading ? (
          <Spinner color="var(--text)" speed="2s" />
        ) : (
          <ArrowRightIcon color="var(--text)" fontSize="md" marginLeft="2px" />
        )
      }
    ml={2}
    mr={2}
    zIndex={2}
    size="md"
    variant="outlined"
    whileHover={{ transform: !isLoading ? 'translateX(2px)' : undefined }}
    onClick={onSend}
  />
);
