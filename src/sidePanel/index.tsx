import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

import { createStoreProxy } from 'src/state/store';
import PortNames from 'src/types/PortNames';

import { ConfigProvider } from './ConfigContext';
import SideLlama from './SideLlama';

const store = createStoreProxy(PortNames.ContentPort);
const container = document.getElementById('root');

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

const theme = extendTheme({ config });

store.ready().then(() => {
  if (container == null) {
    throw new Error('Root container not found');
  }

  const root = createRoot(container);

  root.render(
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ConfigProvider>
          <SideLlama />
        </ConfigProvider>
      </ChakraProvider>
    </Provider>
  );
});

