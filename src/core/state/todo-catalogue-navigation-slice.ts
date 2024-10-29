import { createSlice } from '@reduxjs/toolkit';

interface TodoCatalogueNavigationState {
  isFilterAndOrderShown: boolean;
}

const initialState: TodoCatalogueNavigationState = {
  isFilterAndOrderShown: false,
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
  },
});

export const { showFilterAndOrder, hideFilterAndOrder } =
  todoCatalogueNavigationSlice.actions;

export default todoCatalogueNavigationSlice.reducer;
