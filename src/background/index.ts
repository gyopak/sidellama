import { getCurrentTab, injectContentScript } from 'src/background/util';
import buildStoreWithDefaults from 'src/state/store';
import storage from 'src/util/storageUtil';
import PortNames from '../types/PortNames';

buildStoreWithDefaults({ portName: PortNames.ContentPort });

storage.setItem('panelOpen', false);

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: any) => console.error(error));

chrome.tabs.onUpdated
  .addListener(async (tabId, changeInfo, tab) => {
    if (!(tab.id && changeInfo.status === 'complete')) return;

    console.log('tab connected: ', tab.url, changeInfo);

    if (await storage.getItem('panelOpen')) {
      console.log('panel open');
      injectContentScript(tabId);
    }
  });

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(async msg => {
    if (port.name === PortNames.SidePanelPort) {
      if (msg.type === 'init') {
        console.log('panel opened');

        await storage.setItem('panelOpen', true);

        port.onDisconnect.addListener(async () => {
          await storage.setItem('panelOpen', false);
          console.log('panel closed');
          console.log('port disconnected: ', port.name);
        });

        const tab = await getCurrentTab();

        if (!tab?.id) {
          console.error("Couldn't get current tab");
          return;
        }

        injectContentScript(tab.id);

        port.postMessage({
          type: 'handle-init',
          message: 'panel open'
        });
      }
    }
  });
});

export {};
