import { createSlice } from '@reduxjs/toolkit';

export enum ModalConfirmActions {
  Default = 'default',
  ConfirmDeleteCard = 'confirmDeleteCard',
}

export enum ModalCancelActions {
  Default = 'default',
}

export interface SidePanelState {
  isOpen: boolean;
}

export const sidePanelDefaultState: SidePanelState = { isOpen: false };

const slice = createSlice({
  name: 'profile',
  initialState: sidePanelDefaultState,
  reducers: { reset: () => sidePanelDefaultState }
});

const { actions, reducer } = slice;
const aliases = {};
export { actions, aliases,reducer };
