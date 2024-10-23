import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
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
    refetch,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: () => repository.getAllFromLocal(),
    select: (data) => data.map(toPresenter),
    enabled: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      const timeoutId = setTimeout(() => {
        refetch();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }, [refetch]),
  );

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
