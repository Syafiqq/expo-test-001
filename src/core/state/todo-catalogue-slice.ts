import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type TodoPresenter } from '@/components/page/todo-catalogue/todo-presenter';

interface TodoCatalogueState {
  todos: TodoPresenter[];
  fetchFirstStatus:
    | 'initial'
    | 'loading'
    | 'failed'
    | 'success'
    | 'acknowledgeFailed';
  fetchFirstError: string | null;
  invalid: boolean;
}

const initialState: TodoCatalogueState = {
  todos: [],
  fetchFirstStatus: 'initial',
  fetchFirstError: null,
  invalid: true,
};

export const todoCatalogueSlice = createSlice({
  name: 'todoCatalogue',
  initialState,
  reducers: {
    initialFetchFirst: (state) => {
      state.fetchFirstStatus = 'initial';
      state.invalid = false;
    },
    loadingFetchFirst: (state) => {
      state.fetchFirstStatus = 'loading';
    },
    failedFetchFirst: (state, action: PayloadAction<string>) => {
      state.fetchFirstStatus = 'failed';
      state.fetchFirstError = action.payload;
    },
    successFetchFirst: (state, action: PayloadAction<TodoPresenter[]>) => {
      state.fetchFirstStatus = 'success';
      state.todos = action.payload;
    },
    acknowledgeFetchFirst: (state) => {
      if (state.fetchFirstStatus === 'success') {
      } else {
        state.fetchFirstStatus = 'acknowledgeFailed';
      }
    },
    markAsInvalid: (state) => {
      state.invalid = true;
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const {
  initialFetchFirst,
  loadingFetchFirst,
  successFetchFirst,
  failedFetchFirst,
  acknowledgeFetchFirst,
  markAsInvalid,
  deleteItem,
} = todoCatalogueSlice.actions;

export default todoCatalogueSlice.reducer;
