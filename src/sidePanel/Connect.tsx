import React from 'react';
import { AccordionButton, AccordionItem, AccordionPanel, Text } from '@chakra-ui/react';

import { ConnectGemini } from './ConnectGemini';
import { ConnectGroq } from './ConnectGroq';
import { ConnectOllama } from './ConnectOllama';
import { SettingTitle } from './SettingsTitle';

type ConnectionProps = {
  title: string;
  Component: React.FC<any>;
};

const borderStyle: string = '2px solid var(--text)';
const textStyle = {
  fontWeight: 800,
  paddingTop: 2,
  paddingBottom: 2,
  paddingLeft: 4,
  fontSize: 'lg',
  color: 'var(--text)'
};

const ConnectionSection: React.FC<ConnectionProps> = ({ title, Component }) => (
  <>
    <Text textAlign="left" {...textStyle}>{title}</Text>
    <Component />
  </>
);

export const Connect: React.FC = () => (
  <AccordionItem border={borderStyle} borderRadius={16} mb={4} mt={2}>
    <AccordionButton _hover={{ backgroundColor: 'transparent' }} paddingBottom={1} paddingRight={2}>
      <SettingTitle icon="🔗" padding={0} text="connections" />
    </AccordionButton>
    <AccordionPanel p={0}>
      <ConnectionSection Component={ConnectOllama} title="ollama" />
      <ConnectionSection Component={ConnectGroq} title="groq" />
      <ConnectionSection Component={ConnectGemini} title="gemini" />
    </AccordionPanel>
  </AccordionItem>
);
