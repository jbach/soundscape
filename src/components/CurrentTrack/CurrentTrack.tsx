import {
  ActionIcon,
  Avatar,
  BackgroundImage,
  Box,
  Center,
  Flex,
  HoverCard,
  Image,
  Sx,
  Text,
  Title,
  Tooltip,
  rem,
} from '@mantine/core';
import { IconPlayerStopFilled } from '@tabler/icons-react';
import { IconPhoto } from '@tabler/icons-react';
import { useCurrentTrack } from 'lib/state';

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
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          border: `${rem(1)} solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.dark[4]
              : theme.colors.gray[4]
          }`,
          ...sx,
        })}
        p='xs'
      >
        <Text c='dimmed' fz='sm' fw={500}>
          Nothing playing
        </Text>
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      <BackgroundImage
        src={currentTrack.large_image}
        radius='md'
        sx={(theme) => ({
          border: `${rem(1)} solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.dark[4]
              : theme.colors.gray[4]
          }`,
          overflow: 'hidden',
        })}
      >
        <Center
          pr='xs'
          sx={(theme) => ({
            backgroundColor: theme.fn.rgba(
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
              0.75
            ),
          })}
        >
          <Flex align='center'>
            <HoverCard width={320} shadow='md' withArrow>
              <HoverCard.Target>
                <Avatar
                  src={currentTrack.large_image}
                  alt={currentTrack.flavor_text}
                  radius='md'
                  sx={{
                    cursor: 'help',
                  }}
                >
                  <IconPhoto size='1.5rem' />
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
            <Text fz='sm' ml='xs' mr='xs' fw={500}>
              {currentTrack.track_title}
            </Text>
            <Tooltip label='Stop playback for all listeners'>
              <ActionIcon
                color='red'
                onClick={() => {
                  setCurrentTrack(undefined);
                }}
              >
                <IconPlayerStopFilled size='1.125rem' />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Center>
      </BackgroundImage>
    </Box>
  );
};

export default CurrentTrack;
