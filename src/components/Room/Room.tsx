import { AppShell, Header, Group, Container } from '@mantine/core';
import Tracks from 'components/Tracks';
import Volume from './controls/Volume';
import CopyLink from './controls/CopyLink';
import DarkModeToggle from './controls/DarkModeToggle';
import CurrentTrack from './controls/CurrentTrack';
import Search from './controls/Search';

const Room = () => {
  return (
    <AppShell
      padding='md'
      header={
        <Header height={60}>
          <Group sx={{ height: '100%' }} px={20}>
            <CurrentTrack />
            <Search />
            <DarkModeToggle sx={{ marginLeft: 'auto' }} />
            <CopyLink />
            <Volume />
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Container p={0} size='xl'>
        <Tracks />
      </Container>
    </AppShell>
  );
};

export default Room;
