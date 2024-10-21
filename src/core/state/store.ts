import { configureStore } from '@reduxjs/toolkit';

import todoCatalogueReducer from './todo-catalogue-slice';
import todoCreateReducer from './todo-create-slice';

export const store = configureStore({
  reducer: {
    todoCatalogue: todoCatalogueReducer,
    todoCreate: todoCreateReducer,
  },
});
