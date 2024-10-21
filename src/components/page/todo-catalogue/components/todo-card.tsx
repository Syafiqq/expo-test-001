import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useTodoRepository } from '@/api/repositoiry/todo';
import type { TodoPresenter } from '@/components/page/todo-catalogue/todo-presenter';
import { deleteItem } from '@/core/state/todo-catalogue-slice';
import { Pressable, showErrorMessage, Text } from '@/ui';

export const TodoCard = ({
  title,
  description,
  id,
  dueDate,
}: TodoPresenter) => {
  const repo = useTodoRepository();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await repo.deleteFromLocal(id);
      dispatch(deleteItem(id));
    } catch (error) {
      showErrorMessage('Error delete todo list');
    }
  };

  return (
    <Link push href={`/todo/${id}`} asChild>
      <Pressable>
        <View className="mx-4 my-2 overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-2xl dark:bg-neutral-900">
          <View className="p-4">
            <Text className="text-xl font-bold">{title}</Text>
            <View className="h-2 bg-transparent pb-1 text-lg" />
            <Text numberOfLines={3} className="leading-snug text-gray-600">
              {description}
            </Text>
            <View className="my-2 h-px bg-gray-300 dark:bg-gray-700" />
            <View className="flex-row">
              <View className="flex-auto">
                <Text className="text-sm text-gray-500">{dueDate}</Text>
              </View>
              <View className="flex-none flex-row">
                <Pressable
                  className="aspect-square items-center justify-center rounded-full bg-red-700 p-1"
                  onPress={handleDelete}
                >
                  <FontAwesome name="trash" size={10} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};
