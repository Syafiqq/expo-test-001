import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { router, Stack, useFocusEffect } from 'expo-router';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { showMessage } from 'react-native-flash-message';

import { useTodoRepository } from '@/api/repositoiry/todo';
import { type TodoCreatePresenter } from '@/components/page/todo-add/todo-create-presenter';
import { toDomain } from '@/components/page/todo-add/todo-create-presenter+entity';
import {
  type FormType,
  priorities,
  schema,
} from '@/components/page/todo-add/todo-create-schema';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { acknowledgePhoto } from '@/core/state/take-photo-slice'; // eslint-disable-next-line max-lines-per-function
import { useAppDispatch, useAppSelector } from '@/core/state/use-redux';
import {
  Button,
  ControlledCheckbox,
  ControlledInput,
  ControlledSelect,
  showErrorMessage,
  View,
} from '@/ui';
import { ControlledImageView } from '@/ui/image-view'; // eslint-disable-next-line max-lines-per-function

// eslint-disable-next-line max-lines-per-function
export default function TodoCreate() {
  const { control, handleSubmit, reset, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();
  const repository = useTodoRepository();

  const [date, setDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const dispatch = useAppDispatch();

  const imageStore = useAppSelector((state) => state.takePhoto.takePhoto);

  const { isPending, isSuccess, isError, mutate } = useMutation({
    mutationFn: (data: TodoEntity) => repository.addToLocal(data),
  });

  const onSubmit = (data: TodoCreatePresenter) => {
    mutate(toDomain(data), {
      onSettled: (data) => {
        if (data) {
          reset();
          queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (imageStore) {
        dispatch(acknowledgePhoto());
        setValue('picture', imageStore.uri);
      }
    }, [dispatch, imageStore, setValue]),
  );

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
      <DatePicker
        modal
        open={datePickerOpen}
        date={date}
        onConfirm={(date) => {
          setDatePickerOpen(false);
          setDate(date);
          setValue('dueDateDisplay', format(date, 'd MMM yyyy h:mm a'));
          setValue('dueDate', date);
        }}
        onCancel={() => {
          setDatePickerOpen(false);
        }}
      />
      <Stack.Screen
        options={{
          title: 'Add Todo',
        }}
      />
      <ScrollView className="flex-1">
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
          <Pressable onPress={() => setDatePickerOpen(true)}>
            <ControlledInput
              name="dueDateDisplay"
              label="Due Date"
              control={control}
              testID="input-due-date"
              editable={false}
              textAlwaysActive={true}
            />
          </Pressable>
          <View className="mb-2 mt-4">
            <ControlledSelect
              name="priority"
              label="Priority"
              control={control}
              options={priorities}
              testID="input-select"
            />
          </View>
          <ControlledImageView
            name="picture"
            label="Picture"
            onPress={() => router.push('../(aux)/take-photos')}
            className="aspect-[4/3] w-full items-center justify-center bg-gray-200"
            control={control}
            testID="input-picture"
          />
          <ControlledCheckbox
            className="mb-2 mt-4"
            name="completed"
            control={control}
            accessibilityLabel="Mark as completed"
            label="Mark as completed"
            testID="input-completed"
          />
          <Button
            label="Add Post"
            loading={isPending}
            onPress={handleSubmit(onSubmit)}
            testID="add-post-button"
          />
        </View>
      </ScrollView>
    </>
  );
}
