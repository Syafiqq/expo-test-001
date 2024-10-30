import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type TodoSearchEntity } from '@/core/entity/todo-search-entity';
import { todoCatalogueNavigationSlice } from '@/core/state/todo-catalogue-navigation-slice';

interface TodoCatalogueSearchState {
  query: TodoSearchEntity;
  search: string | undefined;
}

const initialState: TodoCatalogueSearchState = {
  query: {
    after: undefined,
    before: undefined,
    completeness: [],
    priorities: [],
    ordering: [],
  },
  search: undefined,
};

export const todoCatalogueSearchSlice = createSlice({
  name: 'todoCatalogueSearch',
  initialState,
  reducers: {
    updateQuery: (state, action: PayloadAction<TodoSearchEntity>) => {
      state.query = action.payload;
    },
    updateSearch: (state, action: PayloadAction<string | undefined>) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(todoCatalogueNavigationSlice.actions.hideSearch, (state) => {
      state.search = undefined;
    });
  },
});

export const { updateQuery, updateSearch } = todoCatalogueSearchSlice.actions;

export default todoCatalogueSearchSlice.reducer;
