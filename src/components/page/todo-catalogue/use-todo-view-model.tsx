import { useMemo } from 'react';

import { useTodoRepository } from '@/api/repositoiry/todo';
import { TodoCatalogueViewModel } from '@/components/page/todo-catalogue/todo-catalogue-view-model';
import { useAppDispatch } from '@/core/state/use-redux';

export function useTodoCatalogueViewModel(): TodoCatalogueViewModel {
  const repository = useTodoRepository();
  const dispatch = useAppDispatch();

  return useMemo(
    () => new TodoCatalogueViewModel(repository, dispatch),
    [repository, dispatch],
  );
}
