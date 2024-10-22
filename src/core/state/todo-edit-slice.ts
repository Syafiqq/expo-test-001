import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type TodoPresenter } from '@/components/page/todo-catalogue/todo-presenter';

interface TodoEditState {
  fetchStatus:
    | 'initial'
    | 'loading'
    | 'failed'
    | 'success'
    | 'acknowledgeFailed'
    | 'acknowledgeSuccess';
  todo: TodoPresenter | null;
  fetchError: string | null;
  updateStatus:
    | 'initial'
    | 'loading'
    | 'failed'
    | 'success'
    | 'acknowledgeFailed'
    | 'acknowledgeSuccess';
  updateError: string | null;
}

const initialState: TodoEditState = {
  fetchStatus: 'initial',
  todo: null,
  fetchError: null,
  updateStatus: 'initial',
  updateError: null,
};

export const todoEditSlice = createSlice({
  name: 'todoEdit',
  initialState,
  reducers: {
    fetchInitial: (state) => {
      state.fetchStatus = 'initial';
      state.todo = null;
    },
    fetchLoading: (state) => {
      state.fetchStatus = 'loading';
    },
    fetchFailed: (state, action: PayloadAction<string>) => {
      state.fetchStatus = 'failed';
      state.fetchError = action.payload;
    },
    fetchSuccess: (state, action: PayloadAction<TodoPresenter>) => {
      state.fetchStatus = 'success';
      state.todo = action.payload;
    },
    fetchAcknowledge: (state) => {
      if (state.fetchStatus === 'success') {
        state.fetchStatus = 'acknowledgeSuccess';
      } else {
        state.fetchStatus = 'acknowledgeFailed';
      }
    },
    updateInitial: (state) => {
      state.updateStatus = 'initial';
    },
    updateLoading: (state) => {
      state.updateStatus = 'loading';
    },
    updateFailed: (state, action: PayloadAction<string>) => {
      state.updateStatus = 'failed';
      state.updateError = action.payload;
    },
    updateSuccess: (state) => {
      state.updateStatus = 'success';
    },
    updateAcknowledge: (state) => {
      if (state.updateStatus === 'success') {
        state.updateStatus = 'acknowledgeSuccess';
      } else {
        state.updateStatus = 'acknowledgeFailed';
      }
    },
  },
});

export const {
  fetchInitial,
  fetchLoading,
  fetchSuccess,
  fetchFailed,
  fetchAcknowledge,
  updateInitial,
  updateLoading,
  updateSuccess,
  updateFailed,
  updateAcknowledge,
} = todoEditSlice.actions;

export default todoEditSlice.reducer;
