import { Box } from '@chakra-ui/react';

export const VersionInfo = () => (
  <Box
    border="2px"
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
  >
    sidellama 0.0.1
  </Box>
);
