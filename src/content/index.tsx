import { contentLoaded } from 'src/state/slices/content';
import { createStoreProxy } from 'src/state/store';
import PortNames from '../types/PortNames';
import CursorController from './controllers/CursorController';

// Wrap in IIFE to allow early return
(async () => {
  try {
    // More comprehensive URL checks for restricted pages
    if (window.location.protocol === 'chrome:' || 
        window.location.protocol === 'chrome-extension:' || 
                window.location.href.includes('chrome.google.com')) {
      console.debug('Skipping restricted URL:', window.location.protocol);
      return;
    }

    const store = createStoreProxy(PortNames.ContentPort);
    
    // Add cleanup on port disconnect
    store.port.onDisconnect.addListener(() => {
      console.debug('Store port disconnected');
      // Cleanup any registered handlers
      controllers?.forEach(controller => controller.cleanup?.());
    });

    const controllers = [
      new CursorController()
    ];

    try {
      await store.ready();
      await Promise.all(controllers.map(controller => controller.register()));
      store.dispatch(contentLoaded());
    } catch (initError) {
      console.debug('Failed to initialize controllers:', initError);
    }
  } catch (err) {
    console.debug('Content script error:', err);
  }
})();

export {};
