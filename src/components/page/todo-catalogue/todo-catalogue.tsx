import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';

import { useTodoRepository } from '@/api/repositoiry/todo';
import { ListPage } from '@/components/page/todo-catalogue/components/todo-list-layout';
import { TodoPageLoading } from '@/components/page/todo-catalogue/components/todo-page-loading';
import TodoSearch from '@/components/page/todo-catalogue/components/todo-search';
import { toPresenter } from '@/components/page/todo-catalogue/todo-presenter+entity';
import {
  hideFilterAndOrder,
  showFilterAndOrder,
} from '@/core/state/todo-catalogue-navigation-slice';
import { useAppDispatch, useAppSelector } from '@/core/state/use-redux';
import {
  colors,
  FocusAwareStatusBar,
  Modal,
  showErrorMessage,
  useModal,
} from '@/ui';
import { Sliders } from '@/ui/icons/sliders';

// eslint-disable-next-line max-lines-per-function
export function TodoCatalogue() {
  const repository = useTodoRepository();
  const isFilterActive = useAppSelector(
    (state) => state.todoCatalogueNavigation.isFilterAndOrderShown,
  );
  const searchQuery = useAppSelector(
    (state) => state.todoCatalogueSearch.query,
  );
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const modal = useModal();

  const {
    isPending,
    isFetching,
    error,
    data: todos,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: () => repository.getAllFromLocal(searchQuery, undefined),
    select: (data) => data.map(toPresenter),
    enabled: !!repository,
  });

  useEffect(() => {
    if (error) {
      showErrorMessage(`Error loading posts ${error.message}`);
    }
  }, [error]);

  useEffect(() => {
    if (isPending || isFetching) {
      dispatch(hideFilterAndOrder());
    } else {
      dispatch(showFilterAndOrder());
    }
  }, [isPending, isFetching]);

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
      <Modal ref={modal.ref} snapPoints={['95%']}>
        <TodoSearch
          savedQuery={searchQuery}
          useBottomSheet={true}
          onSearchCommitted={() => {
            modal.dismiss();
            queryClient.invalidateQueries({ queryKey: ['todos'] });
          }}
        />
      </Modal>
      <Stack.Screen
        options={{
          headerRight: () =>
            isFilterActive ? (
              <Pressable onPress={() => modal.present()}>
                <View className="items-center p-4">
                  <Sliders
                    color={colors.charcoal[700]}
                    width={20}
                    height={20}
                  />
                </View>
              </Pressable>
            ) : null,
        }}
      />
      <ListPage data={todos ?? []}></ListPage>
    </>
  );
}
