import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';

import { type AppDispatch, type RootState } from '@/core/state/store.types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
