import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useDarkModeSetting } from 'lib/state';

type UserThemeProviderProps = { children: React.ReactNode };

const UserThemeProvider = ({ children }: UserThemeProviderProps) => {
  const [colorScheme, toggleColorScheme] = useDarkModeSetting();

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        theme={{
          colorScheme,
        }}
        inherit
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default UserThemeProvider;
