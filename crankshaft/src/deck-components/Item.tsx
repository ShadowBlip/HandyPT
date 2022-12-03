import { ComponentChildren } from 'preact';

export interface ItemProps {
  children?: ComponentChildren;
  label?: string;
  description?: string;
  layout?: 'below' | 'inline';
  icon?: any;
  bottomSeparator?: boolean;
  indentLevel?: number;
  tooltip?: string;
}
