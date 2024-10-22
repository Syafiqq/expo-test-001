import { zodResolver } from '@hookform/resolvers/zod';
import { useRenderInfo } from '@uidotdev/usehooks';
import { Stack } from 'expo-router';
import * as React from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import { useTodoEditViewModel } from '@/components/page/todo-edit/use-todo-edit-view-model';
import { useAppSelector } from '@/core/state/use-redux';
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
  const fetchStatus = useAppSelector((state) => state.todoEdit.fetchStatus);
  const updateStatus = useAppSelector((state) => state.todoEdit.updateStatus);
  const todo = useAppSelector((state) => state.todoEdit.todo);

  const viewModel = useTodoEditViewModel();

  const onSubmit = (data: FormType) => {
    if (!todo) {
      return;
    }
    let updatedTodo = {
      ...todo,
      title: data.title,
      description: data.description,
    };
    viewModel.update(updatedTodo);
  };

  useEffect(() => {
    viewModel.resetFetch();
    viewModel.fetch(id);
  }, [viewModel, id]);

  useEffect(() => {
    if (todo) {
      reset({
        title: todo.title,
        description: todo.description,
      });
    } else {
      reset({
        title: '',
        description: '',
      });
    }
  }, [todo, reset]);

  useEffect(() => {
    switch (fetchStatus) {
      case 'failed':
        viewModel.acknowledgeFetch();
        showErrorMessage('Error fetch todo');
        break;
      case 'success':
        viewModel.acknowledgeFetch();
        break;
      default:
        break;
    }
  }, [fetchStatus, viewModel]);

  useEffect(() => {
    switch (updateStatus) {
      case 'failed':
        viewModel.acknowledgeUpdate();
        showErrorMessage('Error update todo list');
        break;
      case 'success':
        viewModel.acknowledgeUpdate();
        showMessage({
          message: 'Post updated successfully',
          type: 'success',
        });
        break;
      default:
        break;
    }
  }, [updateStatus, viewModel]);

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
          editable={updateStatus !== 'loading' && fetchStatus !== 'loading'}
        />
        <ControlledInput
          name="description"
          label="Content"
          control={control}
          multiline
          testID="body-input"
          editable={updateStatus !== 'loading' && fetchStatus !== 'loading'}
        />
        <Button
          label="Edit Post"
          loading={updateStatus === 'loading' || fetchStatus === 'loading'}
          onPress={handleSubmit(onSubmit)}
          testID="add-post-button"
        />
      </View>
    </>
  );
}
