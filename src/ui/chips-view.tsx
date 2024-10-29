import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { type FieldValues, useController } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { type ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import { Chip } from 'react-native-paper';
import { tv } from 'tailwind-variants';

import type { InputControllerType } from '@/ui/input';

export const chipViewTv = tv({
  slots: {
    container: 'mb-2',
    label: 'text-grey-100 mb-1 text-lg dark:text-neutral-100',
    body: 'mt-0 overflow-hidden rounded-xl font-inter text-base font-medium leading-5 dark:text-white',
  },
  variants: {
    error: {
      true: {
        label: 'text-danger-600 dark:text-danger-600',
      },
    },
    disabled: {
      false: {},
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
});

export const chipStyle = StyleSheet.create({
  chip: {
    marginVertical: 4,
    marginRight: 8,
  },
});

export type ChipViewPresenter = {
  key: string;
  value: string;
};

export interface ChipViewProps
  extends Omit<ViewProps, 'children' | 'style' | 'hitSlop'> {
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  value?: string[];
  onChangeValue?: ((text: string[]) => void) | undefined;
  pools: ChipViewPresenter[];
}

// eslint-disable-next-line max-lines-per-function
export function ChipView(props: ChipViewProps) {
  const { label, error, testID, className, value, onChangeValue, pools } =
    props;

  const styles = useMemo(
    () =>
      chipViewTv({
        error: Boolean(error),
        disabled: Boolean(props.disabled),
      }),
    [error, props.disabled],
  );

  const [valueState, setValueState] = useState<string[]>(value ?? []);
  const toggleValue = (val: string) => {
    setValueState((prev) => {
      let response;
      if (prev.includes(val)) {
        response = prev.filter((v) => v !== val);
      } else {
        response = [...prev, val];
      }
      onChangeValue && onChangeValue(response);
      return response;
    });
  };

  useEffect(() => {
    if (value) {
      setValueState(value);
    } else {
      setValueState([]);
    }
  }, [value]);

  return (
    <View className={styles.container()}>
      {label && (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          className={styles.label()}
        >
          {label}
        </Text>
      )}
      <View className={clsx(styles.body(), className, 'flex-row flex-wrap')}>
        {pools.map((pool) => (
          <Chip
            key={pool.key}
            style={chipStyle.chip}
            mode="outlined"
            onPress={() => toggleValue(pool.key)}
            selected={valueState.includes(pool.key)}
            showSelectedOverlay={true}
          >
            {pool.value}
          </Chip>
        ))}
      </View>
      {error && (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          className="text-sm text-danger-400 dark:text-danger-600"
        >
          {error}
        </Text>
      )}
    </View>
  );
}

interface ControlledChipViewProps<T extends FieldValues>
  extends ChipViewProps,
    InputControllerType<T> {}

// only used with react-hook-form
export function ControlledChipView<T extends FieldValues>(
  props: ControlledChipViewProps<T>,
) {
  const { name, control, rules, ...inputProps } = props;

  const { field, fieldState } = useController({ control, name, rules });

  return (
    <ChipView
      value={field.value as string[]}
      onChangeValue={(v) => field.onChange(v)}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
}
