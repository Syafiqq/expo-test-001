import { useMemo } from 'react';

import { useTodoRepository } from '@/api/repositoiry/todo';
import { TodoCreateViewModel } from '@/components/page/todo-add/todo-create-view-model';
import { useAppDispatch } from '@/core/state/use-redux';

export function useTodoCreateViewModel(): TodoCreateViewModel {
  const repository = useTodoRepository();
  const dispatch = useAppDispatch();

  return useMemo(
    () => new TodoCreateViewModel(repository, dispatch),
    [repository, dispatch],
  );
}
