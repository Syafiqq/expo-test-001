import React, { useEffect } from 'react';

import { ListPage } from '@/components/page/todo-catalogue/components/todo-list-layout';
import { TodoPageLoading } from '@/components/page/todo-catalogue/components/todo-page-loading';
import { useTodoCatalogueViewModel } from '@/components/page/todo-catalogue/use-todo-view-model';
import { useAppSelector } from '@/core/state/use-redux';
import { FocusAwareStatusBar } from '@/ui';

export function TodoCatalogue() {
  const firstFetchStatus = useAppSelector(
    (state) => state.todoCatalogue.fetchFirstStatus,
  );
  const isListInvalid = useAppSelector((state) => state.todoCatalogue.invalid);

  const todos = useAppSelector((state) => state.todoCatalogue.todos);

  const viewModel = useTodoCatalogueViewModel();

  useEffect(() => {
    if (isListInvalid) {
      viewModel.resetFetchTodos();
      viewModel.fetchTodos();
    }
  }, [viewModel, isListInvalid]);

  useEffect(() => {
    switch (firstFetchStatus) {
      case 'failed':
        viewModel.acknowledgeFetchTodos();
        break;
      case 'success':
        viewModel.acknowledgeFetchTodos();
        break;
      default:
        break;
    }
  }, [firstFetchStatus, viewModel]);

  switch (firstFetchStatus) {
    case 'initial':
    case 'loading':
    case 'failed':
      return (
        <>
          <FocusAwareStatusBar />
          <TodoPageLoading />
        </>
      );
    case 'acknowledgeFailed':
    case 'success':
      return (
        <>
          <FocusAwareStatusBar />
          <ListPage data={todos}></ListPage>
        </>
      );
  }
}
