
import React from 'react';
import { AccordionButton, AccordionItem, AccordionPanel, Button, Grid, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react';

import { useConfig } from './ConfigContext';
import { SettingTitle } from './SettingsTitle';

export const PageContext = () => {
  const { config, updateConfig } = useConfig();
  const isTextMode = !config?.pageMode || config?.pageMode === 'text';
  const size = config?.contextLimit || 1;
  return (
    <AccordionItem
      border="2px solid var(--text)"
      borderBottomWidth="2px !important"
      borderRadius={16}
      mb={4}
    >
      <AccordionButton _hover={{ backgroundColor: 'transparent' }} paddingBottom={1} paddingRight={2}>
        <SettingTitle
          icon="📜"
          padding={0}
          text="page context"
          widget={(
            <Grid alignItems="center" display="flex">
              {config?.host
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
                    {isTextMode ? 'text' : 'html'}
                    {' '}
                    {size === 50 ? '' : `${size}k`}
                  </Button>
                )}
            </Grid>
          )}
        />
      </AccordionButton>
      <AccordionPanel p={4} pt={2}>
        <Grid display="flex">
          <Grid width="50%">
            <Grid alignItems="center" cursor="pointer" display="flex" marginBottom={4} onClick={() => updateConfig({ pageMode: 'text' })}>
              <input checked={isTextMode} style={{ fontSize: '1.5rem', borderColor: 'var(--text)' }} type="checkbox" />
              <Text color="var(--text)" fontSize="lg" fontWeight={800} pl={2}>text mode</Text>
            </Grid>
            <Grid alignItems="center" cursor="pointer" display="flex" onClick={() => updateConfig({ pageMode: 'html' })}>
              <input checked={!isTextMode} style={{ fontSize: '1.5rem', borderColor: 'var(--text)' }} type="checkbox" />
              <Text color="var(--text)" fontSize="lg" fontWeight={800} pl={2}>html mode</Text>
            </Grid>
          </Grid>
          <Grid width="45%">
            <Text color="var(--text)" fontSize="lg" fontWeight={800} marginLeft={-4} pl={2} textAlign="left">
              char limit:
              {' '}
              {size === 50 ? 'inf' : `${size}k`}
            </Text>
            <Slider
              defaultValue={size}
              id="slider"
              max={50}
              min={1}
              onChange={e => updateConfig({ contextLimit: e })}
            >
              <SliderTrack background="var(--text)">
                <SliderFilledTrack background="var(--text)" />
              </SliderTrack>
              <SliderThumb background="var(--text)" style={{ zoom: 1.5 }} />
            </Slider>
          </Grid>
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
};
