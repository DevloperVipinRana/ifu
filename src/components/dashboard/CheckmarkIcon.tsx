import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CheckmarkIconProps {
  color?: string;
  size?: number;
}

const CheckmarkIcon = ({ color = "#34D399", size = 16 }: CheckmarkIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 12.75L11.25 15L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CheckmarkIcon;