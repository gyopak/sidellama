import React from 'react';
import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip
} from '@chakra-ui/react';

import { useConfig } from './ConfigContext';
import { SettingTitle } from './SettingsTitle';

type Theme = {
  name: string;
  active: string;
  bg: string;
  text: string;
}

export const themes = [
  { name: 'stone', active: 'black', bg: '#212529', text: '#fff6a5' },
  { name: 'choco', active: '#58350d', bg: '#251605', text: '#ffed95' },
  { name: 'shell', active: '#1e321b', bg: 'black', text: '#86dc37' },
  { name: 'moss', active: '#889B7B', bg: '#EFD6AC', text: 'black' },
  { name: 'mint', active: '#94BBE4', bg: '#d0e5ff', text: 'black' }
];

export const themes2 = [
  { name: 'mist', active: '#F0F0F0', bg: '#FFFFFF', text: 'black' },
  { name: 'pear', active: '#FFE18B', bg: '#FFFCE2', text: 'black' },
  { name: 'peach', active: '#FFA07A', bg: '#FFC080', text: 'black' },
  { name: 'tomato', active: '#fb8f7b', bg: '#fff0f0', text: 'black' },
  { name: 'lavender', active: '#bda7f2', bg: '#E4D6F5', text: 'black' }
];

export const setTheme = (c: Theme) => {
  localStorage.setItem('theme', c.name);
  document.documentElement.style.setProperty('--active', c.active);
  document.documentElement.style.setProperty('--bg', c.bg);
  document.documentElement.style.setProperty('--text', c.text);
};

const ThemeButton = ({ theme, updateConfig }: { theme: Theme, updateConfig: Function }) => (
  <Tooltip aria-label={theme.name} background="var(--bg)" color="var(--text)" label={theme.name}>
    <Button
      _hover={{
        background: theme.active,
        border: '3px solid var(--text)',
        boxShadow: '3px'
      }}
      background={theme.active}
      border="2px solid var(--text)"
      borderRadius={16}
      color="var(--text)"
      mb={2}
      mr={2}
      size="md"
      onClick={() => {
        updateConfig(theme.name);
        setTheme(theme);
      }}
    />
  </Tooltip>

);

export const Themes = () => {
  const { config, updateConfig } = useConfig();
  const currentFontSize = config?.fontSize || 12;

  return (
    <AccordionItem border="2px solid var(--text)" borderRadius={16} mb={4} mt={0}>
      <AccordionButton _hover={{ backgroundColor: 'transparent' }} paddingBottom={1} paddingRight={2}>
        <SettingTitle icon="🎨" padding={0} text="general" />
      </AccordionButton>
      <AccordionPanel pb={4}>
        <Box>
          <Text alignItems="center" color="var(--text)" display="flex" fontSize="lg" fontWeight={800} pb={2} textAlign="left">
            generate title
            <input checked={config?.generateTitle} style={{ marginLeft: '0.5rem' }} type="checkbox" onChange={() => updateConfig({ generateTitle: !config?.generateTitle })} />
          </Text>
          <Text color="var(--text)" fontSize="lg" fontWeight={800} pb={2} pt={2} textAlign="left">font size</Text>
          <Box mb={4} paddingLeft={2} paddingTop={4} width="70%" maxWidth="200px">
            <Slider
              defaultValue={currentFontSize}
              id="slider"
              max={15}
              min={9}
              onChange={e => {
                updateConfig({ fontSize: e });
              }}
            >
              <SliderTrack background="var(--text)">
                <SliderFilledTrack background="var(--text)" />
              </SliderTrack>
              <SliderThumb background="var(--text)" style={{ zoom: 1.5 }} />
            </Slider>
          </Box>
        </Box>
        <Box>
          <Text color="var(--text)" fontSize="lg" fontWeight={800} pb={2} textAlign="left">theme</Text>
          <Box display="flex" flexWrap="wrap">
            {themes.map((theme, index) => (
              <ThemeButton key={theme.name} theme={theme} updateConfig={updateConfig} />
            ))}
          </Box>
          <Box display="flex" flexWrap="wrap">
            {themes2.map((theme, index) => (
              <ThemeButton key={theme.name} theme={theme} updateConfig={updateConfig} />
            ))}
          </Box>
        </Box>

      </AccordionPanel>
    </AccordionItem>
  );
};
