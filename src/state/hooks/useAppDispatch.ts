import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';

import { State } from 'src/state/State';

export const useAppDispatch = useDispatch<ThunkDispatch<any, any, any>>;
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;

