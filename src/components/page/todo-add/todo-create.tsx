import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as React from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import { useTodoRepository } from '@/api/repositoiry/todo';
import { type TodoCreatePresenter } from '@/components/page/todo-add/todo-create-presenter';
import { toDomain } from '@/components/page/todo-add/todo-create-presenter+entity';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { Button, ControlledInput, showErrorMessage, View } from '@/ui';

const schema = z.object({
  title: z.string().min(10),
  description: z.string().min(120),
});

type FormType = z.infer<typeof schema>;

export default function TodoCreate() {
  const { control, handleSubmit, reset } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const repository = useTodoRepository();

  const { isPending, isSuccess, isError, mutate } = useMutation({
    mutationFn: (data: TodoEntity) => repository.addToLocal(data),
  });

  const onSubmit = (data: TodoCreatePresenter) => {
    mutate(toDomain(data), {
      onSettled: (data) => {
        if (data) {
          reset();
        }
      },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      showMessage({
        message: 'Post added successfully',
        type: 'success',
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      showErrorMessage('Error adding todo list');
    }
  }, [isError]);

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
        />
        <ControlledInput
          name="description"
          label="Content"
          control={control}
          multiline
          testID="body-input"
        />
        <Button
          label="Add Post"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
          testID="add-post-button"
        />
      </View>
    </>
  );
}
