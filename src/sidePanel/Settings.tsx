
import { Accordion, Box } from '@chakra-ui/react';

import { Automation } from './Automation';
import { useConfig } from './ConfigContext';
import { Connect } from './Connect';
import { PageContext } from './PageContext';
import { Params } from './Params';
import { Persona } from './Persona';
import { Themes } from './Themes';
import { WebSearch } from './WebSearch';

export const Settings = () => {
  const { config } = useConfig();
  const defaultIndex = (config?.models || [])?.length === 0 ? 1 : undefined;
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDir="column"
      flexGrow={1}
      height="100%"
      id="settings"
      overflowX="hidden"
      overflowY="scroll"
      padding={2}
      position="absolute"
      pt="4rem"
      top={0}
      width="100%"
    >
      <Accordion
        allowToggle
        reduceMotion
        defaultIndex={defaultIndex}
        marginTop={4}
        maxWidth="520px"
        ml={2}
        mr={2}
        width="100%"
      >
        <Themes />
        <Connect />
        <Persona />
        <PageContext />
        <WebSearch />
        <Params />
        <Automation />
      </Accordion>
    </Box>
  );
};
