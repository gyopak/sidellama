import { Store } from 'webext-redux';

import { setCursorPosition } from "src/state/slices/content";
import { State } from 'src/state/State';
import { createStoreProxy } from 'src/state/store';
import PortNames from "src/types/PortNames";
import ContentProvider from '../contracts/ContentProvider';

class CursorController implements ContentProvider {
  app: HTMLElement | null = null;
  store: Store<State> = createStoreProxy(PortNames.ContentPort);
  async register() {
    console.log('===================================');
    console.log('registering cursor controller');
    console.log('===================================');

    this.store.ready().then(() => {
      document.addEventListener('mousemove', this.handleMouseMove);
    });

    return this;
  }

  handleMouseMove = (e:MouseEvent) => {
    const cursorPosition = { x: e.clientX, y: e.clientY };
    this.store.dispatch(setCursorPosition(cursorPosition));
  };
}

export default CursorController;
