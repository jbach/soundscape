import {
  Badge,
  Button,
  Card,
  Group,
  Highlight,
  Image,
  Text,
  Title,
} from '@mantine/core';
import { IconMusic } from '@tabler/icons-react';
import { Track } from 'lib/schemas';
import { useCurrentTrack, usePreview } from 'lib/state';
import { getIconProps } from 'lib/theme';
import { memo } from 'react';

type TrackCardProps = {
  track: Track;
  highlight: string;
};

const TrackCard = memo(({ track, highlight }: TrackCardProps) => {
  const [togglePreview, isPreviewing] = usePreview(track);
  const [togglePlay, isPlaying] = useCurrentTrack(track);

  return (
    <Card
      key={track.id}
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
          src={track.image ?? null}
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
        <Title order={5}>
          <Highlight highlight={highlight}>{track.title}</Highlight>
        </Title>
        {track.description ? (
          <Text size='sm' color='dimmed'>
            <Highlight highlight={highlight}>{track.description}</Highlight>
          </Text>
        ) : null}
      </Card.Section>
      <Card.Section withBorder inheritPadding py='sm'>
        <Group spacing='sm' noWrap align='start'>
          <Title order={6} color='dimmed'>
            Genre
          </Title>
          <Group spacing='xs'>
            {track.genre.map((item) => (
              <Badge size='xs' key={item}>
                <Highlight highlight={highlight}>{item}</Highlight>
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
                <Highlight highlight={highlight}>{item}</Highlight>
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
            <Button fullWidth onClick={togglePlay}>
              Play
            </Button>
            {isPreviewing ? (
              <Button onClick={togglePreview} color='red' fullWidth>
                Stop Preview
              </Button>
            ) : (
              <Button
                fullWidth
                variant='light'
                disabled={isPlaying}
                onClick={togglePreview}
              >
                Preview
              </Button>
            )}
          </Button.Group>
        )}
      </Card.Section>
    </Card>
  );
});

export default TrackCard;
