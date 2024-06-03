import { Box, Text } from '@chakra-ui/react';

export const SettingTitle = ({ text = '', widget = <></>, padding = 4, icon = '' }) => (
  <Text
    color="var(--text)"
    display="flex"
    fontSize="xl"
    fontWeight={600}
    justifyContent="space-between"
    padding={padding}
    textAlign="left"
    width="100%"
  >
    <Box alignItems="center" display="flex" pb={1}>
      {icon && false && (
      <Text
        color="var(--text)"
        display="flex"
        fontSize="1.25rem"
        fontWeight={600}
        justifyContent="space-between"
        lineHeight="2rem"
        mr={3}
        padding={padding}
        textAlign="left"
      >
        {icon}
      </Text>
      )}
      {text}
    </Box>
    <Box>
      {widget}
    </Box>
  </Text>
);
