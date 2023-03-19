import {
  ActionIcon,
  Avatar,
  BackgroundImage,
  Box,
  Center,
  Flex,
  Sx,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconPlayerStopFilled } from '@tabler/icons-react';
import { IconPhoto, IconPlayerStop } from '@tabler/icons-react';
import { useCurrentTrack } from 'lib/state';

type CurrentTrackProps = { sx?: Sx };

const CurrentTrack = ({ sx = {} }: CurrentTrackProps) => {
  const [currentTrack, setCurrentTrack] = useCurrentTrack();

  if (!currentTrack) {
    return (
      <Box
        sx={(theme) => ({
          borderRadius: theme.radius.md,
        })}
        bg='gray.0'
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
          backgroundColor: theme.colors.gray[8],
        })}
      >
        <Center
          pr='xs'
          sx={{
            background: 'rgba(255,255,255,0.9)',
          }}
        >
          <Flex align='center'>
            <Avatar
              src={currentTrack.large_image}
              alt={currentTrack.flavor_text}
            >
              <IconPhoto size='1.5rem' />
            </Avatar>
            <Text c='dimmed' fz='sm' ml='xs' mr='xs' fw={500}>
              {currentTrack.track_title}
            </Text>
            <Tooltip label='Stop playback for all listeners' withArrow>
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
