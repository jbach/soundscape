import { MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import theme from 'lib/theme';

type RootThemeProviderProps = { children: React.ReactNode };

const RootThemeProvider = ({ children }: RootThemeProviderProps) => {
  const preferredColorScheme = useColorScheme();

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ ...theme, colorScheme: preferredColorScheme }}
    >
      {children}
    </MantineProvider>
  );
};

export default RootThemeProvider;
