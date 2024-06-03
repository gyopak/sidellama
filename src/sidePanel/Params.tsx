
import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import {
  AccordionButton, AccordionItem, AccordionPanel, Box,
  Text,
  Textarea
} from '@chakra-ui/react';

import { useConfig } from './ConfigContext';
import { SettingTitle } from './SettingsTitle';

const AutoResizeTextarea = forwardRef((props, ref) => (
  <Textarea
    as={ResizeTextarea}
    maxRows={8}
    minH="unset"
    minRows={3}
    overflow="scroll"
    ref={ref as ForwardedRef<HTMLTextAreaElement>}
    resize="none"
    w="100%"
    {...props}
  />
));

const ParamsTextArea = ({ params, setParams }) => (
  <AutoResizeTextarea

    // @ts-ignore
    // eslint-disable-next-line react/jsx-props-no-multi-spaces
    _focus={{ borderColor: 'var(--text)', boxShadow: 'none !important' }}
    _hover={{ borderColor: 'var(--text)', boxShadow: 'none !important' }}
    background="var(--text)"
    border="2px"
    borderColor="var(--text)"
    borderRadius={16}
    boxShadow="none !important"
    color="var(--bg)"
    fontSize="md"
    fontStyle="bold"
    fontWeight={600}
    value={params}
    onChange={e => setParams(e.target.value)}
  />
);

export const Params = () => {
  const { config, updateConfig } = useConfig();
  const [isValid, setValid] = useState(true);
  const [params, setParams] = useState(JSON.stringify(config?.params || { temperature: 1 }, null, 2));

  useEffect(() => {
    try {
      const paramsObj = JSON.parse(params);
      updateConfig({ params: paramsObj });
      setValid(true);
    } catch {
      setValid(false);
    }
  }, [params]);

  return (
    <AccordionItem
      border="2px solid var(--text)"
      borderBottomWidth="2px !important"
      borderRadius={16}
      mb={4}
    >
      <AccordionButton _hover={{ backgroundColor: 'transparent' }} paddingBottom={1} paddingRight={2}>
        <SettingTitle
          icon="🧮"
          padding={0}
          text="params"
        />
      </AccordionButton>
      <AccordionPanel p={2} pt={0}>
        <Text color="var(--text)" fontSize="md" fontWeight={800} p={2} pt={0} textAlign="left">
          {isValid ? 'saved' : 'invalid JSON'}
          !
        </Text>
        <Box display="flex" flexWrap="wrap">
          <ParamsTextArea params={params} setParams={setParams} />
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};
