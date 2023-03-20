import {
  ActionIcon,
  Avatar,
  BackgroundImage,
  Box,
  Center,
  Group,
  HoverCard,
  Image,
  Sx,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconMusic, IconPlayerStopFilled } from '@tabler/icons-react';
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
        src={currentTrack.large_image}
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
            <HoverCard width={320} shadow='md' withArrow>
              <HoverCard.Target>
                <Avatar
                  src={currentTrack.large_image}
                  alt={currentTrack.flavor_text}
                  radius='md'
                  sx={{
                    cursor: 'help',
                  }}
                  color='default'
                >
                  <IconMusic {...getIconProps('md')} />
                </Avatar>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text fz='xs' c='dimmed' mb='xs'>
                  Currently playing:
                </Text>
                <Title order={5}>{currentTrack.track_title}</Title>
                <Text size='sm' color='dimmed' mb='md'>
                  {currentTrack.flavor_text}
                </Text>
                <Image
                  src={currentTrack.large_image}
                  alt={currentTrack.flavor_text}
                  withPlaceholder
                  radius='sm'
                />
              </HoverCard.Dropdown>
            </HoverCard>
            <Text fz='sm' fw={500}>
              {currentTrack.track_title}
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
