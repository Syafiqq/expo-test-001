import { configureStore } from '@reduxjs/toolkit';

import todoCatalogueReducer from './todo-catalogue-slice';

export const store = configureStore({
  reducer: {
    todoCatalogue: todoCatalogueReducer,
  },
});
