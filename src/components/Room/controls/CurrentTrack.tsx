import {
  ActionIcon,
  BackgroundImage,
  Box,
  Center,
  Group,
  Sx,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconPlayerStopFilled } from '@tabler/icons-react';
import TrackAvatar from 'components/TrackAvatar/TrackAvatar';
import { useCurrentTrack } from 'lib/state';
import { getIconProps } from 'lib/theme';

type CurrentTrackProps = { sx?: Sx };

const CurrentTrack = ({ sx = {} }: CurrentTrackProps) => {
  const [currentTrack, setCurrentTrack] = useCurrentTrack();

  // nothing playing, show fallback
  if (!currentTrack) {
    return (
      <Box
        sx={(theme) => ({
          borderRadius: theme.radius.md,
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[4]
              : theme.colors.gray[0],
          ...sx,
        })}
        px='md'
        py={8}
      >
        <Text c='dimmed' fz='sm' fw={500}>
          Nothing playing
        </Text>
      </Box>
    );
  }

  return (
    <Group spacing='xs' sx={sx} noWrap>
      <BackgroundImage
        src={
          currentTrack.image ??
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
        }
        radius='md'
        sx={(theme) => ({
          overflow: 'hidden',
        })}
      >
        <Center
          pr='md'
          sx={(theme) => ({
            backgroundColor: theme.fn.rgba(
              theme.colorScheme === 'dark'
                ? theme.colors.dark[4]
                : theme.colors.gray[0],
              theme.colorScheme === 'dark' ? 0.75 : 0.85
            ),
          })}
        >
          <Group spacing='md' noWrap>
            <TrackAvatar
              track={currentTrack}
              color='default'
              radius='md'
              title='Currently playing:'
            />
            <Text fz='sm' fw={500}>
              {currentTrack.title}
            </Text>
          </Group>
        </Center>
      </BackgroundImage>
      <Tooltip label='Stop playback for all listeners'>
        <ActionIcon
          color='red'
          onClick={() => {
            setCurrentTrack(undefined);
          }}
          aria-label='Stop playback for all listeners'
        >
          <IconPlayerStopFilled {...getIconProps('md')} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export default CurrentTrack;
