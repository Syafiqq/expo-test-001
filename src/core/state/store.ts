import { configureStore } from '@reduxjs/toolkit';

import todoCatalogueReducer from './todo-catalogue-slice';
import todoCreateReducer from './todo-create-slice';
import todoEditReducer from './todo-edit-slice';

export const store = configureStore({
  reducer: {
    todoCatalogue: todoCatalogueReducer,
    todoCreate: todoCreateReducer,
    todoEdit: todoEditReducer,
  },
});
