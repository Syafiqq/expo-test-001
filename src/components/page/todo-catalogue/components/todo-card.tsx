import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import React, { memo, useEffect } from 'react';
import { View } from 'react-native';

import { type ToDoRepository } from '@/api/repositoiry/todo/todo-repository.types';
import type { TodoPresenter } from '@/components/page/todo-catalogue/todo-presenter';
import type { TodoEntity } from '@/core/entity/todo-entity.types';
import { colors, Pressable, showErrorMessage, Text } from '@/ui';
import { Check } from '@/ui/icons/check';
import { ChevronsDown } from '@/ui/icons/chevrons-down';
import { ChevronsUp } from '@/ui/icons/chevrons-up';
import { Dash } from '@/ui/icons/dash';
import { Trash } from '@/ui/icons/trash';

interface ItemProps extends TodoPresenter {
  repository: ToDoRepository;
}

// eslint-disable-next-line max-lines-per-function
export const TodoCard = ({
  title,
  description,
  id,
  dueDate,
  repository,
  completed,
  priority,
}: ItemProps) => {
  const queryClient = useQueryClient();

  const { isError, error, mutate } = useMutation({
    mutationFn: (id: string) => repository.deleteFromLocal(id),
  });

  const handleDelete = async () => {
    mutate(id, {
      onSettled: (_, error) => {
        if (!error) {
          queryClient.setQueryData(['todos'], function (old: TodoEntity[]) {
            return old.filter((item) => item.id !== id);
          });
        }
      },
    });
  };

  useEffect(() => {
    if (isError) {
      showErrorMessage(`Error delete post ${error.message}`);
    }
  }, [error, isError]);

  return (
    <Link push href={`/todo/${id}`} asChild>
      <Pressable>
        <View className="mx-4 my-2 overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-2xl dark:bg-neutral-900">
          {completed && <TriangleBadge />}
          <View className="p-4">
            <View className="flex-row">
              <PriorityView priority={priority} />
              <Text className="flex-1 text-xl font-bold">{title}</Text>
            </View>
            <View className="h-2 bg-transparent pb-1 text-lg" />
            <Text numberOfLines={3} className="leading-snug text-gray-600">
              {description}
            </Text>
            <View className="my-2 h-px bg-gray-300 dark:bg-gray-700" />
            <View className="flex-row">
              <Text className="flex-1 self-center text-sm text-gray-500">
                {dueDate}
              </Text>
              <Pressable
                className="aspect-square items-center justify-center rounded-full p-1"
                onPress={handleDelete}
              >
                <Trash width={16} height={16} color={colors.danger[600]} />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const TriangleBadge = memo(() => {
  return (
    <View className="absolute right-0 top-0 size-[40px]">
      <View className="relative right-0 top-0 size-0 rotate-90 border-b-[40px] border-l-[40px] border-b-transparent border-l-green-300" />
      <Check className="absolute right-1 top-1" width={16} height={16} />
    </View>
  );
});

const HighPriority = memo(() => {
  return (
    <View className="mr-2 self-center rounded-md border border-neutral-400 p-[2px]">
      <ChevronsUp width={10} height={10} color={colors.danger[600]}/>
    </View>
  );
});

const ModeratePriority = memo(() => {
  return (
    <View className="mr-2 self-center rounded-md border border-neutral-400 p-[2px]">
      <Dash width={10} height={10} color={colors.warning[500]}/>
    </View>
  );
});

const LowPriority = memo(() => {
  return (
    <View className="mr-2 self-center rounded-md border border-neutral-400 p-[2px]">
      <ChevronsDown width={10} height={10} color="#03a9f4"/>
    </View>
  );
});

const PriorityView = ({ priority }: { priority: string | null }) => {
  if (!priority) return <></>;

  switch (priority) {
    case 'high':
      return <HighPriority />;
    case 'medium':
      return <ModeratePriority />;
    case 'low':
      return <LowPriority />;
    default:
      return <></>;
  }
};
