import { contentLoaded } from 'src/state/slices/content';
import { createStoreProxy } from 'src/state/store';
import PortNames from '../types/PortNames';

import CursorController from './controllers/CursorController';

const initialize = async () => {
  const store = createStoreProxy(PortNames.ContentPort);

  const controllers = [
    new CursorController()
  ];

  await store.ready();
  await Promise.all(controllers.map(controller => controller.register()));
  store.dispatch(contentLoaded());
};

initialize();

export {};
