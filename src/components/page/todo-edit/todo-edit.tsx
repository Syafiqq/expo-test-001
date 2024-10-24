import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRenderInfo } from '@uidotdev/usehooks';
import { format } from 'date-fns';
import { Stack } from 'expo-router';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { showMessage } from 'react-native-flash-message';

import { useTodoRepository } from '@/api/repositoiry/todo';
import {
  type FormType,
  priorities,
  schema,
} from '@/components/page/todo-add/todo-create-schema';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { nullableToNull, nullableToUndefined } from '@/core/type-utils';
import {
  Button,
  ControlledCheckbox,
  ControlledInput,
  ControlledSelect,
  showErrorMessage,
  View,
} from '@/ui';

type Props = {
  id: string;
};

// eslint-disable-next-line max-lines-per-function
export default function TodoEdit({ id }: Props) {
  useRenderInfo('TodoEdit');
  const { control, handleSubmit, reset, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();
  const todo = useRef<TodoEntity | null>(null);
  const repository = useTodoRepository();

  const [date, setDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

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
        <ControlledCheckbox
          className="my-2"
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
    </>
  );
}
