import { Badge, Button, Card, Group, Image, Text, Title } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { IconMusic } from '@tabler/icons-react';
import { SHARED_SOUNDSCAPE_NODE_ID } from 'lib/constants';
import { Track } from 'lib/schemas';
import { currentTrackState, localTrackState, volumeFamily } from 'lib/state';
import { getIconProps } from 'lib/theme';
import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

type TrackCardProps = {
  track: Track;
};

const TrackCard = ({ track }: TrackCardProps) => {
  const setSharedVolume = useSetRecoilState(
    volumeFamily(SHARED_SOUNDSCAPE_NODE_ID)
  );
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const [localTrack, setLocalTrack] = useRecoilState(localTrackState);

  const { ref, entry } = useIntersection({});
  const isPlaying = currentTrack?.id === track.id;
  const isPreviewing = localTrack?.id === track.id;
  const isVisible = entry?.isIntersecting;
  const togglePlay = useCallback(() => {
    setCurrentTrack((prevTrack) => {
      if (!prevTrack || prevTrack.id !== track.id) {
        return track;
      }
    });
  }, [setCurrentTrack, track]);

  const togglePreview = useCallback(() => {
    setLocalTrack((prevTrack) => {
      // todo: seek to middle
      if (!prevTrack || prevTrack.id !== track.id) {
        return track;
      }
    });
  }, [setLocalTrack, track]);

  return (
    <Card
      key={track.id}
      ref={ref}
      shadow='sm'
      withBorder
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <Card.Section pos='relative'>
        <Image
          height={180}
          src={isVisible ? track.image ?? null : null}
          alt={track.description ?? track.title}
          withPlaceholder
          placeholder={<IconMusic {...getIconProps('placeholder')} />}
        />
        <Badge
          size='xs'
          sx={(theme) => ({
            position: 'absolute',
            right: theme.spacing.xs,
            top: theme.spacing.xs,
          })}
        >
          {track.type}
        </Badge>
      </Card.Section>
      <Card.Section inheritPadding py='sm'>
        <Title order={5}>{track.title}</Title>
        <Text size='sm' color='dimmed'>
          {track.description}
        </Text>
      </Card.Section>
      <Card.Section withBorder inheritPadding py='sm'>
        <Group spacing='sm' noWrap align='start'>
          <Title order={6} color='dimmed'>
            Genre
          </Title>
          <Group spacing='xs'>
            {track.genre.map((item) => (
              <Badge size='xs' key={item}>
                {item}
              </Badge>
            ))}
          </Group>
        </Group>
      </Card.Section>
      <Card.Section inheritPadding py='sm'>
        <Group spacing='sm' noWrap align='start'>
          <Title order={6} color='dimmed'>
            Tags:
          </Title>
          <Group spacing='xs'>
            {track.tags.map((item) => (
              <Badge size='xs' key={item} color='gray'>
                {item}
              </Badge>
            ))}
          </Group>
        </Group>
      </Card.Section>
      <Card.Section
        withBorder
        inheritPadding
        py='sm'
        mt='auto'
        sx={(theme) => ({
          backgroundColor:
            isPlaying || isPreviewing
              ? theme.colorScheme === 'dark'
                ? theme.fn.rgba(theme.colors.red[theme.fn.primaryShade()], 0.2)
                : theme.colors.red[0]
              : 'transparent',
        })}
      >
        {isPlaying ? (
          <Button onClick={togglePlay} color='red' fullWidth>
            Stop
          </Button>
        ) : (
          <Button.Group>
            <Button
              fullWidth
              onClick={() => {
                setSharedVolume((prev) => ({ ...prev, muted: false }));
                setLocalTrack(undefined);
                togglePlay();
              }}
            >
              Play
            </Button>
            {isPreviewing ? (
              <Button
                onClick={() => {
                  setSharedVolume((prev) => ({ ...prev, muted: false }));
                  togglePreview();
                }}
                color='red'
                fullWidth
              >
                Stop Preview
              </Button>
            ) : (
              <Button
                fullWidth
                variant='light'
                disabled={isPlaying}
                onClick={() => {
                  setSharedVolume((prev) => ({ ...prev, muted: true }));
                  togglePreview();
                }}
              >
                Preview
              </Button>
            )}
          </Button.Group>
        )}
      </Card.Section>
    </Card>
  );
};

export default TrackCard;
