import { MantineProvider } from '@mantine/core';
import theme from 'lib/theme';

type RootThemeProviderProps = { children: React.ReactNode };

const RootThemeProvider = ({ children }: RootThemeProviderProps) => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      {children}
    </MantineProvider>
  );
};

export default RootThemeProvider;
