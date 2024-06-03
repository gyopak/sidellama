export async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };

  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export async function injectContentScript(tabId: number) {
  console.log('injecting content script');

  chrome.scripting.executeScript({
    // @ts-ignore
    target: { tabId },
    files: [
      'assets/vendor.js',
      'content.js'
    ]
  });
}
