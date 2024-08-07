import React from 'react';
import { Box } from '@chakra-ui/react';

export const VersionInfo = () => (
  <Box
    border="2px"
    cursor="pointer"
    onClick={() => window.open("https://github.com/gyopak/sidellama/releases", "_blank")}
    borderColor="var(--text)"
    borderRadius={16}
    color="var(--text)"
    defaultValue="default"
    fontSize="md"
    background="var(--bg)"
    fontStyle="bold"
    fontWeight={600}
    pb={0.5}
    pl={3}
    pr={3}
    pt={0.5}
    mr={3}
  >
    v0.0.1
  </Box>
);
