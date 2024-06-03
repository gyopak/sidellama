import {
  AnyAction,
  combineReducers,
  configureStore,
  createSerializableStateInvariantMiddleware,
  Slice
} from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { alias, applyMiddleware, Store, wrapStore } from 'webext-redux';

import * as contentSlice from 'src/state/slices/content';
import * as sidePanelSlice from 'src/state/slices/sidePanel';
import { State } from 'src/state/State';

type BuildStoreOptions = {
    reducers?: {
        [key in string]: Slice
    };
    portName?: string;
};

const backgroundAliases = { ...sidePanelSlice.aliases, ...contentSlice.aliases };

const middleware = [
  alias(backgroundAliases),
  thunkMiddleware,
  createSerializableStateInvariantMiddleware(),
  logger
];

const buildStoreWithDefaults = ({ portName }: BuildStoreOptions = {}) => {
  const reducer = combineReducers<State, AnyAction>({
    sidePanel: sidePanelSlice.reducer,
    content: contentSlice.reducer
  });

  const store = configureStore({
    devTools: true,
    reducer,
    middleware
  });

  if (portName) {
    wrapStore(store, { portName });
  }

  return store;
};

export default buildStoreWithDefaults;

export const createStoreProxy = (portName: string) => {
  const store = new Store<State, AnyAction>({ portName });
  applyMiddleware(store, ...middleware);

  // Fix for unresolved bug in webext-redux: https://github.com/tshaddix/webext-redux/issues/286
  Object.assign(store, {
    dispatch: store.dispatch.bind(store),
    getState: store.getState.bind(store),
    subscribe: store.subscribe.bind(store)
  });

  return store;
};
