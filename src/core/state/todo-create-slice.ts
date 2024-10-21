import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface TodoCreateState {
  status:
    | 'initial'
    | 'loading'
    | 'failed'
    | 'success'
    | 'acknowledgeFailed'
    | 'acknowledgeSuccess';
  error: string | null;
}

const initialState: TodoCreateState = {
  status: 'initial',
  error: null,
};

export const todoCreateSlice = createSlice({
  name: 'todoCreate',
  initialState,
  reducers: {
    initial: (state) => {
      state.status = 'initial';
    },
    loading: (state) => {
      state.status = 'loading';
    },
    failed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    success: (state) => {
      state.status = 'success';
    },
    acknowledge: (state) => {
      if (state.status === 'success') {
        state.status = 'acknowledgeSuccess';
      } else {
        state.status = 'acknowledgeFailed';
      }
    },
  },
});

export const { initial, loading, success, failed, acknowledge } =
  todoCreateSlice.actions;

export default todoCreateSlice.reducer;
