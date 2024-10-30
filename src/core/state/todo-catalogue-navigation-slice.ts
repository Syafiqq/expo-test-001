import { createSlice } from '@reduxjs/toolkit';

interface TodoCatalogueNavigationState {
  isFilterAndOrderShown: boolean;
  isSearchShown: boolean;
}

const initialState: TodoCatalogueNavigationState = {
  isFilterAndOrderShown: false,
  isSearchShown: false,
};

export const todoCatalogueNavigationSlice = createSlice({
  name: 'todoCatalogueNavigation',
  initialState,
  reducers: {
    showFilterAndOrder: (state) => {
      state.isFilterAndOrderShown = true;
    },
    hideFilterAndOrder: (state) => {
      state.isFilterAndOrderShown = false;
    },
    showSearch: (state) => {
      state.isSearchShown = true;
    },
    hideSearch: (state) => {
      state.isSearchShown = false;
    },
  },
});

export const {
  showFilterAndOrder,
  hideFilterAndOrder,
  showSearch,
  hideSearch,
} = todoCatalogueNavigationSlice.actions;

export default todoCatalogueNavigationSlice.reducer;
