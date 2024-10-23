import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRenderInfo } from '@uidotdev/usehooks';
import { Stack } from 'expo-router';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import { useTodoRepository } from '@/api/repositoiry/todo';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { Button, ControlledInput, showErrorMessage, View } from '@/ui';

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

type FormType = z.infer<typeof schema>;

type Props = {
  id: string;
};

// eslint-disable-next-line max-lines-per-function
export default function TodoEdit({ id }: Props) {
  useRenderInfo('TodoEdit');
  const { control, handleSubmit, reset } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();
  const todo = useRef<TodoEntity | null>(null);
  const repository = useTodoRepository();

  const {
    isPending: isFetchPending,
    isError: isFetchError,
    isSuccess: isFetchSuccess,
    error: fetchError,
    data: fetchData,
  } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => repository.fetchByIdFromLocal(id),
    enabled: !!repository,
  });

  const {
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError,
    mutate,
  } = useMutation({
    mutationFn: (data: TodoEntity) => repository.editToLocal(data),
  });

  const onSubmit = (data: FormType) => {
    let currentTodo = todo.current;
    if (!currentTodo) {
      return;
    }
    let updatedTodo = {
      ...currentTodo,
      title: data.title,
      description: data.description,
    };
    mutate(updatedTodo, {
      onSettled: (data) => {
        if (data) {
          queryClient.setQueryData(['todo', id], data);

          queryClient.setQueryData(['todos'], function (old: TodoEntity[]) {
            return old.map((item) => {
              if (item.id === data.id) {
                return data;
              }
              return item;
            });
          });
        }
      },
    });
  };

  useEffect(() => {
    if (isFetchError) {
      showErrorMessage(`Error loading post ${fetchError.message}`);
    }
  }, [fetchError, isFetchError]);

  useEffect(() => {
    if (isFetchSuccess && fetchData) {
      todo.current = fetchData;
      reset({
        title: fetchData.title,
        description: fetchData.description ?? undefined,
      });
    }
  }, [fetchData, isFetchSuccess, reset]);

  useEffect(() => {
    if (isUpdateError) {
      showErrorMessage(`Error update todo ${updateError.message}`);
    }
  }, [updateError, isUpdateError]);

  useEffect(() => {
    if (isUpdateSuccess) {
      showMessage({
        message: 'Post updated successfully',
        type: 'success',
      });
    }
  }, [isUpdateSuccess]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Todo',
        }}
      />
      <View className="flex-1 p-4 ">
        <ControlledInput
          name="title"
          label="Title"
          control={control}
          testID="title"
          editable={!isFetchPending && !isUpdatePending}
        />
        <ControlledInput
          name="description"
          label="Content"
          control={control}
          multiline
          testID="body-input"
          editable={!isFetchPending && !isUpdatePending}
        />
        <Button
          label="Edit Post"
          loading={isFetchPending || isUpdatePending}
          onPress={handleSubmit(onSubmit)}
          testID="add-post-button"
        />
      </View>
    </>
  );
}
