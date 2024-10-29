import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const ChevronsUp = ({ color = '#000', width = 24, height = 24, ...props }: SvgProps) => (
  <Svg width={width} height={height} fill={color} viewBox="0 0 448 512" {...props}>
    <Path d="M54.63 278.6L224 109.3l169.4 169.4C399.6 284.9 407.8 288 416 288s16.38-3.125 22.62-9.375c12.5-12.5 12.5-32.75 0-45.25l-192-192c-12.5-12.5-32.75-12.5-45.25 0l-192 192c-12.5 12.5-12.5 32.75 0 45.25S42.13 291.1 54.63 278.6zM246.6 233.4c-12.5-12.5-32.75-12.5-45.25 0l-192 192c-12.5 12.5-12.5 32.75 0 45.25s32.75 12.5 45.25 0L224 301.3l169.4 169.4C399.6 476.9 407.8 480 416 480s16.38-3.125 22.62-9.375c12.5-12.5 12.5-32.75 0-45.25L246.6 233.4z" />
  </Svg>
);
