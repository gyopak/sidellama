import React, { createContext, useContext, useEffect, useState } from 'react';

export const ConfigContext = createContext({});

export const personas = {
  sidellama: 'you are sidellama, a friendly web assistant',
  haiku: `you are a haiku generator.
user: generate a haiku about haiku generation

assistant:
### *Prompt's subtle spark*
### *AI's gentle, dreaming mind*
### *Haiku blooms in code*

user: generate a haiku 
about ducks

assistant:
### *Feathers glisten bright*
### *Ripples dance upon the lake*
### *Quacks echo silence*
`
};

const defaultConfig = { personas, generateTitle: true, persona: 'sidellama', webMode: 'brave', webLimit: 1, contextLimit: 1 };

export const ConfigProvider = ({ children }: any) => {
  const initialConfig = JSON.parse(localStorage.getItem('config') || JSON.stringify(defaultConfig));

  const [config, setConfig] = useState(initialConfig);

  useEffect(() => {
    localStorage.setItem('config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    if (config?.fontSize) {
      document.documentElement.style.setProperty('font-size', `${config?.fontSize}px`);
    }
  }, [config?.fontSize]);

  const updateConfig = (newConfig: any) => {
    setConfig({ ...config, ...newConfig });
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext) as { config: any, updateConfig: (v: any) => void };
