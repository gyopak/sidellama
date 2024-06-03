import { AnyAction, ThunkAction } from '@reduxjs/toolkit';

import { ContentState } from "src/state/slices/content";
import { SidePanelState } from "src/state/slices/sidePanel";

export type ThunkType = ThunkAction<void, State, unknown, AnyAction>;

export interface State {
    sidePanel: SidePanelState
    content: ContentState
}

export type StateUpdate = {
    [key in keyof State]?: State[key];
};

