import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const ChevronsDown = ({ color = '#000', width = 24, height = 24, ...props }: SvgProps) => (
  <Svg width={width} height={height} fill={color} viewBox="0 0 448 512" {...props}>
    <Path d="M201.4 278.6C207.6 284.9 215.8 288 224 288s16.38-3.125 22.62-9.375l192-192c12.5-12.5 12.5-32.75 0-45.25s-32.75-12.5-45.25 0L224 210.8L54.63 41.38c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L201.4 278.6zM393.4 233.4L224 402.8L54.63 233.4c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25l192 192C207.6 476.9 215.8 480 224 480s16.38-3.125 22.62-9.375l192-192c12.5-12.5 12.5-32.75 0-45.25S405.9 220.9 393.4 233.4z" />
  </Svg>
);
