import { FlashList } from '@shopify/flash-list';
import { type InfiniteData } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useTodoRepository } from '@/api/repositoiry/todo';
import { TodoCard } from '@/components/page/todo-catalogue/components/todo-card';
import type { TodoPresenter } from '@/components/page/todo-catalogue/todo-presenter';
import { EmptyList, FocusAwareStatusBar } from '@/ui';

export interface ListPageProps {
  data: InfiniteData<TodoPresenter[]>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function ListPage({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: ListPageProps) {
  const repo = useTodoRepository();
  const renderItem = React.useCallback(
    ({ item }: { item: TodoPresenter }) => (
      <TodoCard repository={repo} {...item} />
    ),
    [repo],
  );

  const keyExtractor = useCallback((item: TodoPresenter, i: number) => `${i}-${item.id}`, []);

  return (
    <View className="flex-1 ">
      <FocusAwareStatusBar />
      <FlashList
        data={data?.pages.flat() ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<EmptyList isLoading={false} />}
        estimatedItemSize={300}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 32 }}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      />
    </View>
  );
}
