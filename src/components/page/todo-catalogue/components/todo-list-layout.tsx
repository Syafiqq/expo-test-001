import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View } from 'react-native';

import { TodoCard } from '@/components/page/todo-catalogue/components/todo-card';
import type { TodoPresenter } from '@/components/page/todo-catalogue/todo-presenter';
import { EmptyList, FocusAwareStatusBar } from '@/ui';

interface Props {
  data: TodoPresenter[];
}

export function ListPage({ data }: Props) {
  const renderItem = React.useCallback(
    ({ item }: { item: TodoPresenter }) => <TodoCard {...item} />,
    [],
  );

  return (
    <View className="flex-1 ">
      <FocusAwareStatusBar />
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, _) => `item-${item.id}`}
        ListEmptyComponent={<EmptyList isLoading={false} />}
        estimatedItemSize={300}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 32 }}
      />
    </View>
  );
}
