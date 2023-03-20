import { MantineThemeOverride } from '@mantine/core';

const theme: MantineThemeOverride = {
  fontFamily:
    '"InterVariable", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
  fontFamilyMonospace:
    '"iA Writer Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
  globalStyles: () => ({
    html: {
      height: '100%',
    },
    body: {
      height: '100%',
    },
    '#root': {
      height: '100%',
    },
  }),
  components: {
    Tooltip: {
      defaultProps: {
        withArrow: true,
      },
    },
  },
};

export default theme;
