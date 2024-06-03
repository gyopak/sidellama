
import React from 'react';
import { AccordionButton, AccordionItem, AccordionPanel, Button, Grid, Text } from '@chakra-ui/react';

import { useConfig } from './ConfigContext';
import { SettingTitle } from './SettingsTitle';

export const Automation = () => {
  const { config } = useConfig();
  return (
    <AccordionItem
      border="2px solid var(--text)"
      borderBottomWidth="2px !important"
      borderRadius={16}
      mb={4}
    >
      <AccordionButton _hover={{ backgroundColor: 'transparent' }} paddingBottom={1} paddingRight={2}>
        <SettingTitle
          padding={0}
          text="automation"
          icon="🔨"
          widget={(
            <Grid alignItems="center" display="flex">
              {false
                    && (
                      <Button
                        _hover={{
                          background: 'var(--active)',
                          border: '2px solid var(--active)'
                        }}
                        background="var(--active)"
                        border="2px solid var(--text)"
                        borderRadius={16}
                        color="var(--text)"
                        mb={1}
                        ml={4}
                        mt="2px"
                        pl={4}
                        pr={4}
                        size="sm"
                      >
                        default
                      </Button>
                    )}
            </Grid>
              )}
        />
      </AccordionButton>
      <AccordionPanel p={4} pt={2}>
        <Text textAlign="left" color="var(--text)" fontSize="md" fontWeight={800}>coming soon!</Text>
      </AccordionPanel>
    </AccordionItem>
  );
};
