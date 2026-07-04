import type {SvgIconProps} from './types';

export const resolveSvgIconProps = (props: SvgIconProps) => ({
  size: props.size ?? 24,
  color: props.color ?? '#0F172A',
  strokeWidth: props.strokeWidth ?? 2,
});
