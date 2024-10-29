import * as React from 'react';
import { useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

import { colors, ControlledInput, type ControlledInputProps } from '@/ui';
import { Trash } from '@/ui/icons/trash';

export interface ControllerDatePickerProps<T extends FieldValues>
  extends ControlledInputProps<T> {
  onDateChanged: (date: Date | undefined) => void;
}

export default function ControllerDatePicker<T extends FieldValues>(
  props: ControllerDatePickerProps<T>,
) {
  const { onDateChanged } = props;
  const [date, setDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  function onDateChange(date: Date | undefined) {
    if (!date) {
      setDate(new Date());
      onDateChanged(undefined);
      return;
    }
    setDate(date);
    onDateChanged(date);
  }

  return (
    <>
      <DatePicker
        modal
        open={datePickerOpen}
        date={date}
        onConfirm={(date) => {
          setDatePickerOpen(false);
          onDateChange(date);
        }}
        onCancel={() => {
          setDatePickerOpen(false);
        }}
      />
      <View className="flex-row">
        <View className="flex-1">
          <Pressable onPress={() => setDatePickerOpen(true)}>
            <ControlledInput
              editable={false}
              textAlwaysActive={true}
              {...props}
            />
          </Pressable>
        </View>
        <Pressable
          className="flex self-end"
          onPress={() => onDateChange(undefined)}
        >
          <Trash className="ml-4 py-9" color={colors.danger[600]}></Trash>
        </Pressable>
      </View>
    </>
  );
}
