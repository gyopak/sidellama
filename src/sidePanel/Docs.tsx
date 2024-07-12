import React from 'react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';

export const Docs = () => (
  <Box
    border="2px"
    borderColor="var(--text)"
    borderRadius={16}
    color="var(--text)"
    defaultValue="default"
    onClick={() => window.open("https://github.com/gyopak/sidellama/blob/master/DOCS.md", "_blank")}
    fontSize="md"
    background="var(--bg)"
    fontStyle="bold"
    fontWeight={600}
    pb={0.5}
    pl={3}
    pr={3}
    pt={0.5}
    mr={3}
    cursor="pointer"
  >
    docs
  </Box>
);
