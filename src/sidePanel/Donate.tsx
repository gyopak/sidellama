import React from 'react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';

export const Donate = () => (
  <Box
    border="2px"
    borderColor="var(--text)"
    borderRadius={16}
    color="var(--text)"
    defaultValue="default"
    fontSize="md"
    onClick={() => window.open("https://ko-fi.com/sidellama",'_blank')}
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
    <span style={{ marginRight: "5px" }}>support</span><span style={{ fontSize: "0.75rem" }}>💚</span>
  </Box>
);
