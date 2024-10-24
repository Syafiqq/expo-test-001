import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Stack } from 'expo-router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import { useTodoRepository } from '@/api/repositoiry/todo';
import { type TodoCreatePresenter } from '@/components/page/todo-add/todo-create-presenter';
import { toDomain } from '@/components/page/todo-add/todo-create-presenter+entity';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import {
  Button,
  ControlledCheckbox,
  ControlledInput,
  ControlledSelect,
  type OptionType,
  showErrorMessage,
  View,
} from '@/ui';

const priorities: OptionType[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const schema = z.object({
  title: z.string().min(10),
  description: z.string().min(120),
  dueDate: z.coerce.date(),
  dueDateDisplay: z.string(),
  completed: z.boolean().default(false),
  priority: z.enum(['low', 'medium', 'high']).default('low'),
});

type FormType = z.infer<typeof schema>;

// eslint-disable-next-line max-lines-per-function
export default function TodoCreate() {
  const { control, handleSubmit, reset, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();
  const repository = useTodoRepository();

  const [date, setDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

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
        <ControlledCheckbox
          className="my-2"
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
    </>
  );
}
