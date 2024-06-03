interface Storage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: any) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
}

// const fakeStorage: { [key in string]: any } = {};
const storage: Storage = typeof window !== 'undefined' && window.localStorage
  ? {
    getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key: string, value: any) => Promise.resolve(window.localStorage.setItem(key, value)),
    deleteItem: (key: string) => Promise.resolve(window.localStorage.removeItem(key))
  }
  : {
    getItem: async (key: string) => {
      const data = await chrome.storage.local.get(key);
      return data[key];
    },
    setItem: async (key: string, value: any) => chrome.storage.local.set({ [key]: value }),
    deleteItem: async (key: string) => chrome.storage.local.remove(key)
  };

export default storage;
