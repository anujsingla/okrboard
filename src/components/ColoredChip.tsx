import React from 'react';
import { css } from '@patternfly/react-styles';

export interface LabelProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;
  color?: 'blue' | 'cyan' | 'green' | 'orange' | 'purple' | 'red' | 'grey';
  variant?: 'outline' | 'filled';
}

export function ColoredChip(props: LabelProps) {
  const { color, className, ...restProps } = props;
  return <div {...restProps} className={css(color, className)} />;
}
