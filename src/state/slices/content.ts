import { createSlice } from '@reduxjs/toolkit';

import { ThunkType } from 'src/state/State';
import Position from 'src/types/Position';

export interface ContentState {
    isLoaded: boolean;
    cursorPosition: Position;
}

export const contentDefaultState: ContentState = {
  isLoaded: false,
  cursorPosition: { x: 0, y: 0 }
};

const slice = createSlice({
  name: 'profile',
  initialState: contentDefaultState,
  reducers: {
    reset: () => contentDefaultState,
    contentLoaded: state => {
      state.isLoaded = true;
    },
    setCursorPosition: (state, action) => {
      state.cursorPosition = action.payload;
    }
  }
});

/**
 * this is an example of a thunk, you could add api requests from here
 * and dispatch actions to update the state
 */
export const contentLoaded = (): ThunkType => async (dispatch, getState) => {
  const { isLoaded } = getState().content || {};
  if (isLoaded) return;
  await dispatch(slice.actions.contentLoaded());
};

export const setCursorPosition = (position: Position): ThunkType => async dispatch => {
  await dispatch(slice.actions.setCursorPosition(position));
};

const { actions, reducer } = slice;
const aliases = {};
export { actions, aliases, reducer };
