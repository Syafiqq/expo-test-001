import { configureStore } from '@reduxjs/toolkit';

import takePhotoReducer from './take-photo-slice';
import todoCatalogueNavigationReducer from './todo-catalogue-navigation-slice';
import todoCatalogueReducer from './todo-catalogue-slice';
import todoCreateReducer from './todo-create-slice';
import todoEditReducer from './todo-edit-slice';

export const store = configureStore({
  reducer: {
    todoCatalogue: todoCatalogueReducer,
    todoCatalogueNavigation: todoCatalogueNavigationReducer,
    todoCreate: todoCreateReducer,
    todoEdit: todoEditReducer,
    takePhoto: takePhotoReducer,
  },
});
