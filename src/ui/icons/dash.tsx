import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const Dash = ({ color = '#000', width = 24, height = 24, ...props }: SvgProps) => (
  <Svg width={width} height={height} fill={color} viewBox="0 0 512 512" {...props}>
    <Path d="M512 256c0 17.67-14.33 32-32 32H32C14.33 288 0 273.7 0 256s14.33-32 32-32h448C497.7 224 512 238.3 512 256z" />
  </Svg>
);
