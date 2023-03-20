import { ActionIcon, Sx, Tooltip } from '@mantine/core';
import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react';
import { useDarkModeSetting } from 'lib/state';

type DarkModeToggleProps = { sx?: Sx };

const DarkModeToggle = ({ sx = {} }: DarkModeToggleProps) => {
  const [, toggleColorScheme, userColorScheme] = useDarkModeSetting();

  return (
    <Tooltip
      label={
        userColorScheme === 'system'
          ? 'Automatic'
          : userColorScheme === 'dark'
          ? 'Dark Mode'
          : 'Light Mode'
      }
    >
      <ActionIcon onClick={toggleColorScheme} color='default' sx={sx}>
        {userColorScheme === 'system' ? (
          <IconSunMoon size='1.125rem' />
        ) : userColorScheme === 'dark' ? (
          <IconMoon size='1.125rem' />
        ) : (
          <IconSun size='1.125rem' />
        )}
      </ActionIcon>
    </Tooltip>
  );
};

export default DarkModeToggle;
