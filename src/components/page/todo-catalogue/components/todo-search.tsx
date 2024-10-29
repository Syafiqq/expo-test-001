import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { FlatList, View } from 'react-native';
import { z } from 'zod';

import ControllerDatePicker from '@/components/date-picker/controlled-date-picker';
import {
  ControlledSortDefinerView,
  type TodoSortPresenter,
} from '@/components/sort-definer/todo-sort-definer-view';
import {
  type TodoSearchCompleteness,
  type TodoSearchEntity,
  type TodoSearchPriority,
} from '@/core/entity/todo-search-entity';
import { updateQuery } from '@/core/state/todo-catalogue-search-slice';
import { useAppDispatch } from '@/core/state/use-redux';
import { compactMap } from '@/core/type-utils';
import { Button, Text } from '@/ui';
import { ControlledChipView } from '@/ui/chips-view';

const prioritiesPool = [
  { key: 'low', value: 'Low' },
  { key: 'medium', value: 'Medium' },
  { key: 'high', value: 'High' },
];

const completenessPool = [
  { key: 'complete', value: 'Complete' },
  { key: 'incomplete', value: 'Incomplete' },
];

const sortPool: TodoSortPresenter[] = [
  { name: 'name', display: 'Name', status: 'unordered' },
  { name: 'description', display: 'Desc', status: 'unordered' },
  { name: 'completed', display: 'Completed', status: 'unordered' },
  { name: 'dueDate', display: 'Due', status: 'unordered' },
  { name: 'priority', display: 'Priority', status: 'unordered' },
];

const dateParser = 'd MMM yyyy h:mm a';

export const TodoSortPresenterSchema = z.object({
  name: z.string(),
  display: z.string(),
  status: z.enum(['unordered', 'ascending', 'descending']),
});

export const schema = z.object({
  after: z.coerce.date().optional(),
  afterDisplay: z.string().optional(),
  before: z.coerce.date().optional(),
  beforeDisplay: z.string().optional(),
  priorities: z.array(z.string()).default([]),
  completeness: z.array(z.string()).default([]),
  ordering: z.array(TodoSortPresenterSchema).default(sortPool),
});

export type FormType = z.infer<typeof schema>;

const formItems = [
  { type: 'text', label: 'Filter:', className: 'text-2xl font-bold' },
  {
    type: 'datePicker',
    name: 'afterDisplay',
    label: 'After',
    testID: 'input-after',
  },
  {
    type: 'datePicker',
    name: 'beforeDisplay',
    label: 'Before',
    testID: 'input-before',
  },
  {
    type: 'chipView',
    name: 'priorities',
    label: 'Priorities',
    testID: 'input-priorities',
    pools: prioritiesPool,
  },
  {
    type: 'chipView',
    name: 'completeness',
    label: 'Completeness',
    testID: 'input-completeness',
    pools: completenessPool,
  },
  { type: 'divider' },
  { type: 'text', label: 'Sort:', className: 'text-2xl font-bold' },
  { type: 'sortDefiner', name: 'ordering', testID: 'input-completeness' },
  { type: 'divider' },
  { type: 'button', label: 'Search', testID: 'add-post-button' },
];

const toSearchEntity = (data: FormType): TodoSearchEntity => {
  return {
    after: data.after?.getTime(),
    before: data.before?.getTime(),
    priorities: compactMap(data.priorities ?? [], function (priority: string) {
      return prioritiesPool.find((pool) => pool.key === priority)
        ?.key as TodoSearchPriority;
    }),
    completeness: compactMap(
      data.completeness ?? [],
      function (complete: string) {
        return completenessPool.find((pool) => pool.key === complete)
          ?.key as TodoSearchCompleteness;
      },
    ),
    ordering: compactMap(
      data.ordering ?? [],
      function (complete: z.infer<typeof TodoSortPresenterSchema>) {
        if (complete.status === 'unordered') {
          return undefined;
        }
        return {
          name: complete.name,
          status: complete.status,
        };
      },
    ),
  };
};

const toFormType = (data: TodoSearchEntity | undefined): FormType => {
  if (!data) {
    return schema.parse({});
  }

  const after = data.after;
  let afterDate: Date | undefined;
  let afterDateDisplay: string | undefined;
  if (after) {
    afterDate = new Date(after);
    afterDateDisplay = format(afterDate, dateParser);
  } else {
    afterDate = undefined;
    afterDateDisplay = undefined;
  }

  const before = data.before;
  let beforeDate: Date | undefined;
  let beforeDateDisplay: string | undefined;
  if (before) {
    beforeDate = new Date(before);
    beforeDateDisplay = format(beforeDate, dateParser);
  } else {
    beforeDate = undefined;
    beforeDateDisplay = undefined;
  }

  let ordering: TodoSortPresenter[] = compactMap(data.ordering, (order) => {
    const pool = sortPool.find((o) => o.name === order.name);
    if (pool) {
      return {
        name: pool.name,
        display: pool.display,
        status: order.status,
      };
    }
    return undefined;
  });
  let remainingPool = sortPool.filter((pool) => {
    return !ordering.find((order) => order.name === pool.name);
  });

  return {
    after: afterDate,
    afterDisplay: afterDateDisplay,
    before: beforeDate,
    beforeDisplay: beforeDateDisplay,
    priorities: data.priorities,
    completeness: data.completeness,
    ordering: ordering.concat(remainingPool),
  };
};

export type Props = {
  useBottomSheet: boolean;
  onSearchCommitted: () => void;
  savedQuery: TodoSearchEntity;
};
// eslint-disable-next-line max-lines-per-function
export default function TodoSearch({
  useBottomSheet,
  onSearchCommitted,
  savedQuery,
}: Props) {
  const { control, setValue, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: toFormType(savedQuery),
  });
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormType) => {
    const searchEntity = toSearchEntity(data);
    dispatch(updateQuery(searchEntity));
    onSearchCommitted();
  };

  const renderItem = ({ item }: any) => {
    switch (item.type) {
      case 'text':
        return <Text className={item.className}>{item.label}</Text>;
      case 'datePicker':
        return (
          <ControllerDatePicker
            onDateChanged={(date) => {
              if (date) {
                setValue(
                  `${item.name}` === 'afterDisplay'
                    ? 'afterDisplay'
                    : 'beforeDisplay',
                  format(date, dateParser),
                );
                setValue(
                  `${item.name}` === 'afterDisplay' ? 'after' : 'before',
                  date,
                );
              } else {
                setValue(
                  `${item.name}` === 'afterDisplay'
                    ? 'afterDisplay'
                    : 'beforeDisplay',
                  '',
                );
                setValue(
                  `${item.name}` === 'afterDisplay' ? 'after' : 'before',
                  undefined,
                );
              }
            }}
            name={item.name}
            label={item.label}
            control={control}
            testID={item.testID}
          />
        );
      case 'chipView':
        return (
          <ControlledChipView
            name={item.name}
            label={item.label}
            testID={item.testID}
            control={control}
            pools={item.pools}
          />
        );
      case 'sortDefiner':
        return (
          <ControlledSortDefinerView
            name={item.name}
            testID={item.testID}
            control={control}
          />
        );
      case 'button':
        return (
          <Button
            label={item.label}
            testID={item.testID}
            onPress={handleSubmit(onSubmit)}
          />
        );
      case 'divider':
        return <View className="h-8" />;
      default:
        return null;
    }
  };

  const ListComponent = useBottomSheet ? BottomSheetFlatList : FlatList;

  return (
    <View className="flex-1 p-4 ">
      <ListComponent
        data={formItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
      />
    </View>
  );
}
