import clsx from 'clsx';
import * as React from 'react';
import { type FieldValues, useController } from 'react-hook-form';
import { Pressable, type PressableProps, Text, View } from 'react-native';
import { tv } from 'tailwind-variants';

import { Image } from '@/ui/image';
import { type InputControllerType } from '@/ui/input';

const imageViewTv = tv({
  slots: {
    container: 'mb-2',
    label: 'text-grey-100 mb-1 text-lg dark:text-neutral-100',
    body: 'mt-0 overflow-hidden rounded-xl border-[0.5px] border-neutral-300 bg-neutral-100 font-inter text-base font-medium leading-5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
  },
  variants: {
    focused: {
      true: {
        body: 'border-neutral-400 dark:border-neutral-300',
      },
    },
    error: {
      true: {
        body: 'border-danger-600',
        label: 'text-danger-600 dark:text-danger-600',
      },
    },
    disabled: {
      true: {
        body: 'bg-neutral-200',
      },
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
});

export interface ImageViewProps extends PressableProps {
  label?: string;
  error?: string;
  className?: string;
  value?: string;
}

export const ImageView = React.forwardRef<View, ImageViewProps>(
  // eslint-disable-next-line max-lines-per-function
  (props, ref) => {
    const { label, error, testID, value, className, ...inputProps } = props;
    const [isFocussed, setIsFocussed] = React.useState(false);
    const onBlur = React.useCallback(() => setIsFocussed(false), []);
    const onFocus = React.useCallback(() => setIsFocussed(true), []);

    const styles = React.useMemo(
      () =>
        imageViewTv({
          error: Boolean(error),
          focused: isFocussed,
          disabled: Boolean(props.disabled),
        }),
      [error, isFocussed, props.disabled],
    );

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
        <Pressable
          ref={ref}
          onBlur={onBlur}
          onFocus={onFocus}
          {...inputProps}
          style={inputProps.style}
        >
          <View className={clsx(styles.body(), className)}>
            {value && value?.length > 0 ? (
              <Image
                source={{ uri: value }}
                alt="Image"
                className="h-full w-full object-cover"
                contentFit={'contain'}
              />
            ) : (
              <Text className="text-neutral-400 dark:text-neutral-600">
                No Image
              </Text>
            )}
          </View>
        </Pressable>
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
  },
);

interface ControlledImageViewProps<T extends FieldValues>
  extends ImageViewProps,
    InputControllerType<T> {}

// only used with react-hook-form
export function ControlledImageView<T extends FieldValues>(
  props: ControlledImageViewProps<T>,
) {
  const { name, control, rules, ...inputProps } = props;

  const { field, fieldState } = useController({ control, name, rules });

  return (
    <ImageView
      ref={field.ref}
      value={field.value as string}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
}
