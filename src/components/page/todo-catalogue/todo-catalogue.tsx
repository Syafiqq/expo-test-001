import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';

import { useTodoRepository } from '@/api/repositoiry/todo';
import { ListPage } from '@/components/page/todo-catalogue/components/todo-list-layout';
import { TodoPageLoading } from '@/components/page/todo-catalogue/components/todo-page-loading';
import { toPresenter } from '@/components/page/todo-catalogue/todo-presenter+entity';
import { FocusAwareStatusBar, showErrorMessage } from '@/ui';

export function TodoCatalogue() {
  const repository = useTodoRepository();

  const {
    isPending,
    error,
    data: todos,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: () => repository.getAllFromLocal(),
    select: (data) => data.map(toPresenter),
    enabled: !!repository,
  });

  useEffect(() => {
    if (error) {
      showErrorMessage(`Error loading posts ${error.message}`);
    }
  }, [error]);

  if (isPending) {
    return (
      <>
        <FocusAwareStatusBar />
        <TodoPageLoading />
      </>
    );
  }

  return (
    <>
      <FocusAwareStatusBar />
      <ListPage data={todos ?? []}></ListPage>
    </>
  );
}
