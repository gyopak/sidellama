import { contentLoaded } from 'src/state/slices/content';
import { createStoreProxy } from 'src/state/store';
import PortNames from '../types/PortNames';
import CursorController from './controllers/CursorController';

// Wrap in IIFE to allow early return
(async () => {
  try {
    // Skip chrome:// URLs early
    if (window.location.protocol === 'chrome:') {
      console.debug('Skipping chrome:// URL');
      return;
    }

    const store = createStoreProxy(PortNames.ContentPort);
    
    store.port.onDisconnect.addListener(() => {
      console.debug('Store port disconnected');
    });

    const controllers = [
      new CursorController()
    ];

    await store.ready();
    await Promise.all(controllers.map(controller => controller.register()));
    store.dispatch(contentLoaded());
  } catch (err) {
    console.debug('Content script error:', err);
  }
})();

export {};
