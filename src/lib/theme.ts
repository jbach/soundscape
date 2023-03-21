import { MantineThemeOverride, TooltipProps, rem } from '@mantine/core';

export const iconSizes = {
  sm: rem(16),
  md: rem(18),
  lg: rem(24),
  placeholder: rem(40),
} as const;

export type IconSize = keyof typeof iconSizes;

const defaultIconProps = {
  'aria-hidden': true,
  focusable: false,
} as const;

/**
 * get default props for tabler icons. size defaults to 'lg' (24px)
 */
export const getIconProps = (size?: IconSize) => {
  if (size) {
    return {
      ...defaultIconProps,
      size: iconSizes[size],
    } as const;
  }
  return defaultIconProps;
};

// define default props
const ToolTipDefaultProps: Partial<TooltipProps> = {
  withArrow: true,
};

// define custom theme
const theme: MantineThemeOverride = {
  fontFamily:
    '"InterVariable", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
  fontFamilyMonospace:
    '"iA Writer Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
  headings: {
    sizes: {
      h6: {
        fontSize: rem(12),
        fontWeight: 600,
      },
    },
  },
  globalStyles: () => ({
    html: {
      height: '100%',
    },
    body: {
      height: '100%',
      userSelect: 'none',
    },
    '#root': {
      height: '100%',
    },
  }),
  components: {
    Tooltip: {
      defaultProps: ToolTipDefaultProps,
    },
  },
};

export default theme;
