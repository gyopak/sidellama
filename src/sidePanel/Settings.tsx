
import { Accordion, Box } from '@chakra-ui/react';

import { Automation } from './Automation';
import { Connect } from './Connect';
import { PageContext } from './PageContext';
import { Params } from './Params';
import { Persona } from './Persona';
import { Themes } from './Themes';
import { WebSearch } from './WebSearch';

export const Settings = () => (
  <Box
    alignItems="center"
    display="flex"
    flexDir="column"
    flexGrow={1}
    id="settings"
    overflowX="hidden"
    overflowY="scroll"
    padding={2}
    width="100%"
    position="absolute"
    top={0}
    pt="4rem"
    height="100%"
  >
    <Accordion
      allowToggle
      reduceMotion
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
