import { useEffect, useState } from 'react';

import { useConfig } from '../ConfigContext';
import { GEMINI_URL, GROQ_URL } from '../constants';
import { useInterval } from '@chakra-ui/react';

const fetchDataSilently = async (url: string, params = {}) => {
  try {
    const res = await fetch(url, params);
    const data = res.json();
    return data;
  } catch (error) {
    return undefined;
  }
};

export const useUpdateModels = () => {
  const [chatTitle, setChatTitle] = useState('');
  const { config, updateConfig } = useConfig();

  useInterval(() => {
    const fetchModels = async () => {
      let models = [];
      if (config?.ollamaUrl) {
        const ollamaModels = await fetchDataSilently(`${config?.ollamaUrl}/api/tags`);
        if (!ollamaModels) {
          updateConfig({ ollamaConnected: false, ollamaUrl: '' });
        } else {
          const parsedModels = ollamaModels?.models?.map((m: any) => ({ ...m, id: m.name, host: 'ollama' })) || [];
          models = [...models, ...parsedModels];
        }
      }

      if (config?.lmStudioUrl) {
        console.log('lm')
        const lmStudioModels = await fetchDataSilently(`${config?.lmStudioUrl}/v1/models`);
        console.log('lm', lmStudioModels)
        if (!lmStudioModels) {
          updateConfig({ lmStudioConnected: false, lmStudioUrl: '' });
        } else {
          const parsedModels = lmStudioModels?.data?.map((m: any) => ({ ...m, host: 'lmStudio' })) || [];
          models = [...models, ...parsedModels];
        }
      }

      if (config?.groqApiKey) {
        const groqModels = await fetchDataSilently(GROQ_URL, { headers: { Authorization: `Bearer ${config?.groqApiKey}` } });
        if (!groqModels) {
          updateConfig({ groqConnected: false });
        } else {
          const parsedModels = groqModels?.data.map((m: any) => ({ ...m, host: 'groq' })) || [];
          models = [...models, ...parsedModels];
        }
      }

      const idChange = models?.map((m: { id: string }) => m.id).join() != config?.models?.map((m: { id: string }) => m.id).join()

      if (models.length > 0 && idChange) {
        const isSelectedAvailable = config?.selectedModel && models.some(m => m.id === config?.selectedModel);
        updateConfig({ models, selectedModel: isSelectedAvailable ? config?.selectedModel : models?.[0]?.id });
      }
    };

    fetchModels();
  }, 5000);

  return { chatTitle, setChatTitle };
};
