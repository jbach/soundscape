import { AppShell, Header, Group, Container } from '@mantine/core';
import Volume from 'components/Volume/Volume';
import CurrentTrack from 'components/CurrentTrack/CurrentTrack';
import CopyLink from 'components/CopyLink';
import Tracks from 'components/Tracks/Tracks';

const Room = () => {
  return (
    <AppShell
      padding='md'
      header={
        <Header height={60}>
          <Group sx={{ height: '100%' }} px={20}>
            <CurrentTrack />
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
      <Container>
        <Tracks />
      </Container>
    </AppShell>
  );
};

export default Room;
