import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type TodoSearchEntity } from '@/core/entity/todo-search-entity';

interface TodoCatalogueSearchState {
  query: TodoSearchEntity;
}

const initialState: TodoCatalogueSearchState = {
  query: {
    after: undefined,
    before: undefined,
    completeness: [],
    priorities: [],
    ordering: [],
  },
};

export const todoCatalogueSearchSlice = createSlice({
  name: 'todoCatalogueSearch',
  initialState,
  reducers: {
    updateQuery: (state, action: PayloadAction<TodoSearchEntity>) => {
      state.query = action.payload;
    },
  },
});

export const { updateQuery } = todoCatalogueSearchSlice.actions;

export default todoCatalogueSearchSlice.reducer;
