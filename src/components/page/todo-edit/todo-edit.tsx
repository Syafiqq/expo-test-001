import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { router, Stack, useFocusEffect } from 'expo-router';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { showMessage } from 'react-native-flash-message';

import { useTodoRepository } from '@/api/repositoiry/todo';
import {
  type FormType,
  priorities,
  schema,
} from '@/components/page/todo-add/todo-create-schema';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { acknowledgePhoto } from '@/core/state/take-photo-slice';
import { useAppDispatch, useAppSelector } from '@/core/state/use-redux';
import { nullableToNull, nullableToUndefined } from '@/core/type-utils';
import {
  Button,
  ControlledCheckbox,
  ControlledInput,
  ControlledSelect,
  showErrorMessage,
  View,
} from '@/ui';
import { ControlledImageView } from '@/ui/image-view';

type Props = {
  id: string;
};

// eslint-disable-next-line max-lines-per-function
export default function TodoEdit({ id }: Props) {
  const { control, handleSubmit, reset, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();
  const todo = useRef<TodoEntity | null>(null);
  const repository = useTodoRepository();

  const [date, setDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const dispatch = useAppDispatch();
  const imageStore = useAppSelector((state) => state.takePhoto.takePhoto);

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
      dueDate: data.dueDate,
      completed: data.completed,
      priority: nullableToNull(data.priority),
      picture: data.picture,
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

  useFocusEffect(
    useCallback(() => {
      if (imageStore) {
        dispatch(acknowledgePhoto());
        setValue('picture', imageStore.uri);
      }
    }, [dispatch, imageStore, setValue]),
  );

  useEffect(() => {
    if (isFetchError) {
      showErrorMessage(`Error loading post ${fetchError.message}`);
    }
  }, [fetchError, isFetchError]);

  useEffect(() => {
    if (isFetchSuccess && fetchData) {
      todo.current = fetchData;

      let dueDate = fetchData.dueDate;
      let dueDateDisplay: string;
      if (dueDate) {
        dueDateDisplay = format(dueDate, 'd MMM yyyy h:mm a');
      } else {
        dueDateDisplay = '';
      }
      reset({
        title: fetchData.title,
        description: fetchData.description ?? undefined,
        dueDate: dueDate ?? undefined,
        dueDateDisplay: dueDateDisplay,
        completed: fetchData.completed,
        priority: nullableToUndefined(fetchData.priority),
        picture: nullableToUndefined(fetchData.picture),
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
            label="Edit Post"
            loading={isFetchPending || isUpdatePending}
            onPress={handleSubmit(onSubmit)}
            testID="add-post-button"
          />
        </View>
      </ScrollView>
    </>
  );
}
