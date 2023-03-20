import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { IconMusic } from '@tabler/icons-react';
import { useCurrentTrack } from 'lib/state';
import { getIconProps } from 'lib/theme';
import { rawTracks } from 'lib/tracks';

type TrackProps = {
  track: (typeof rawTracks)[number];
};

const Track = ({ track }: TrackProps) => {
  const [currentTrack, setCurrentTrack] = useCurrentTrack();
  const { ref, entry } = useIntersection({});
  const isPlaying = currentTrack?.key === track.key;
  const isVisible = entry?.isIntersecting;

  return (
    <Card
      key={track.key}
      ref={ref}
      shadow='sm'
      withBorder
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Card.Section pos='relative'>
        <Image
          height={180}
          src={isVisible ? track.large_image : null}
          alt={track.flavor_text}
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
          {track.track_type}
        </Badge>
      </Card.Section>
      <Stack sx={{ flex: 1 }} spacing='md' mt='md'>
        <Box>
          <Title order={5}>{track.track_title}</Title>
          <Text size='sm' color='dimmed'>
            {track.flavor_text}
          </Text>
        </Box>
        <Group spacing='xs'>
          {track.track_genre.map((item) => (
            <Badge size='xs' key={item}>
              {item}
            </Badge>
          ))}
        </Group>
        <Group spacing='xs'>
          {track.tags.map((item) => (
            <Badge size='xs' key={item} color='gray'>
              {item}
            </Badge>
          ))}
        </Group>
        {isPlaying ? (
          <Button
            onClick={() => {
              setCurrentTrack(undefined);
            }}
            color='red'
            fullWidth
            mt='auto'
          >
            Stop
          </Button>
        ) : (
          <Button
            fullWidth
            onClick={() => {
              setCurrentTrack(track.key);
            }}
            mt='auto'
          >
            Play
          </Button>
        )}
      </Stack>
    </Card>
  );
};

export default Track;
