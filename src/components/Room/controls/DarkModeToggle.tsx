import { ActionIcon, Sx, Tooltip } from '@mantine/core';
import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react';
import { useDarkModeSetting } from 'lib/state';
import { getIconProps } from 'lib/theme';

type DarkModeToggleProps = { sx?: Sx };

const DarkModeToggle = ({ sx = {} }: DarkModeToggleProps) => {
  const [, toggleColorScheme, userColorScheme] = useDarkModeSetting();
  const label =
    userColorScheme === 'system'
      ? 'Automatic Mode'
      : userColorScheme === 'dark'
      ? 'Dark Mode'
      : 'Light Mode';

  return (
    <Tooltip label={label}>
      <ActionIcon
        onClick={toggleColorScheme}
        color='default'
        sx={sx}
        aria-label={label}
      >
        {userColorScheme === 'system' ? (
          <IconSunMoon {...getIconProps('md')} />
        ) : userColorScheme === 'dark' ? (
          <IconMoon {...getIconProps('md')} />
        ) : (
          <IconSun {...getIconProps('md')} />
        )}
      </ActionIcon>
    </Tooltip>
  );
};

export default DarkModeToggle;
