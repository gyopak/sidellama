export async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };

  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export async function injectContentScript(tabId: number) {
  try {
    // Get tab info to check URL
    const tab = await chrome.tabs.get(tabId);
    
    // Skip chrome:// URLs early
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      console.debug('Skipping content script injection for restricted URL:', tab.url);
      return;
    }

    console.log('injecting content script');

    await chrome.scripting.executeScript({
      // @ts-ignore
      target: { tabId },
      files: [
        'assets/vendor.js',
        'content.js'
      ]
    }).catch(err => {
      console.debug('Script injection failed:', err);
    });
  } catch (err) {
    console.debug('Tab access failed:', err);
    return;
  }
}
