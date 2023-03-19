import { MantineProvider } from '@mantine/core';

type UserThemeProviderProps = { children: React.ReactNode };

const UserThemeProvider = ({ children }: UserThemeProviderProps) => {
  return <MantineProvider inherit>{children}</MantineProvider>;
};

export default UserThemeProvider;
