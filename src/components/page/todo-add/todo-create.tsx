import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from 'expo-router';
import * as React from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import { type TodoCreatePresenter } from '@/components/page/todo-add/todo-create-presenter';
import { useTodoCreateViewModel } from '@/components/page/todo-add/use-todo-create-view-model';
import { useAppSelector } from '@/core/state/use-redux';
import { Button, ControlledInput, showErrorMessage, View } from '@/ui';

const schema = z.object({
  title: z.string().min(10),
  description: z.string().min(120),
});

type FormType = z.infer<typeof schema>;

export default function TodoCreate() {
  const { control, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const status = useAppSelector((state) => state.todoCreate.status);

  const viewModel = useTodoCreateViewModel();

  const onSubmit = (data: TodoCreatePresenter) => {
    viewModel.createTodo(data);
  };

  useEffect(() => {
    switch (status) {
      case 'failed':
        viewModel.acknowledgeCrate();
        showErrorMessage('Error adding todo list');
        break;
      case 'success':
        viewModel.acknowledgeCrate();
        showMessage({
          message: 'Post added successfully',
          type: 'success',
        });
        break;
      default:
        break;
    }
  }, [status, viewModel]);

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
          loading={status === 'loading'}
          onPress={handleSubmit(onSubmit)}
          testID="add-post-button"
        />
      </View>
    </>
  );
}
