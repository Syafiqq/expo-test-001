import { useMemo } from 'react';

import { useTodoRepository } from '@/api/repositoiry/todo';
import { TodoEditViewModel } from '@/components/page/todo-edit/todo-edit-view-model';
import { useAppDispatch } from '@/core/state/use-redux';

export function useTodoEditViewModel(): TodoEditViewModel {
  const repository = useTodoRepository();
  const dispatch = useAppDispatch();

  return useMemo(
    () => new TodoEditViewModel(repository, dispatch),
    [repository, dispatch],
  );
}
