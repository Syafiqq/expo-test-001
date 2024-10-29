import React, { useEffect, useState } from 'react';
import { type FieldValues, useController } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import DragList, { type DragListRenderItemInfo } from 'react-native-draglist';
import { SegmentedButtons } from 'react-native-paper';

import { type InputControllerType, Text } from '@/ui';
import { Bars } from '@/ui/icons/bars';

const segmentedButtonValue = [
  {
    value: 'unordered',
    label: '-',
  },
  {
    value: 'ascending',
    label: 'Asc',
  },
  {
    value: 'descending',
    label: 'Desc',
  },
];

export type TodoStatus = 'unordered' | 'ascending' | 'descending';

export type TodoSortPresenter = {
  name: string;
  display: string;
  status: TodoStatus;
};

export interface SortDefinerProps
  extends Omit<ViewProps, 'children' | 'style' | 'hitSlop'> {
  className?: string;
  value?: TodoSortPresenter[];
  onChangeValue?: ((text: TodoSortPresenter[]) => void) | undefined;
}

// eslint-disable-next-line max-lines-per-function
export default function SortDefinerView(props: SortDefinerProps) {
  const { value, onChangeValue } = props;

  const [valueState, setValueState] = useState<TodoSortPresenter[]>(
    value ?? [],
  );

  const setValues = (val: TodoSortPresenter[]) => {
    setValueState((_) => {
      onChangeValue && onChangeValue(val);
      return val;
    });
  };

  useEffect(() => {
    if (value) {
      setValueState(value);
    } else {
      setValueState([]);
    }
  }, [value]);

  function keyExtractor(item: TodoSortPresenter, _index: number) {
    return item.name;
  }

  function renderItem(info: DragListRenderItemInfo<TodoSortPresenter>) {
    const { item, onDragStart, onDragEnd } = info;

    return (
      <TouchableOpacity
        key={item.name}
        onPressIn={onDragStart}
        onPressOut={onDragEnd}
      >
        <View className="flex flex-row align-middle">
          <Bars width={20} height={20} className="mr-2 self-center"></Bars>
          <Text className="w-1/4 self-center">{item.display}</Text>
          <SegmentedButtons
            style={{ margin: 4, flex: 1 }}
            onValueChange={function (status: string | TodoStatus) {
              if (['unordered', 'ascending', 'descending'].includes(status)) {
                onStatusChanged(item.name, status as TodoStatus);
              }
            }}
            value={item.status}
            buttons={segmentedButtonValue}
          />
        </View>
      </TouchableOpacity>
    );
  }

  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...valueState];
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]);
    setValues(copy);
  }

  function onStatusChanged(name: string, status: TodoStatus) {
    const copy = [...valueState];
    setValues(
      copy.map((item) => (item.name === name ? { ...item, status } : item)),
    );
  }

  return (
    <View>
      <DragList
        data={valueState}
        keyExtractor={keyExtractor}
        onReordered={onReordered}
        renderItem={renderItem}
        {...props}
      />
    </View>
  );
}

interface ControlledChipViewProps<T extends FieldValues>
  extends SortDefinerProps,
    InputControllerType<T> {}

// only used with react-hook-form
export function ControlledSortDefinerView<T extends FieldValues>(
  props: ControlledChipViewProps<T>,
) {
  const { name, control, rules, ...inputProps } = props;

  const { field } = useController({ control, name, rules });

  return (
    <SortDefinerView
      value={field.value as TodoSortPresenter[]}
      onChangeValue={(v) => field.onChange(v)}
      {...inputProps}
    />
  );
}
