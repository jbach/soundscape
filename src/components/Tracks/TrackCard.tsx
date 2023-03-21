import { Badge, Button, Card, Group, Image, Text, Title } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { IconMusic } from '@tabler/icons-react';
import { Track } from 'lib/schemas';
import { useCurrentTrack } from 'lib/state';
import { getIconProps } from 'lib/theme';

type TrackCardProps = {
  track: Track;
};

const TrackCard = ({ track }: TrackCardProps) => {
  const [currentTrack, setCurrentTrack] = useCurrentTrack();
  const { ref, entry } = useIntersection({});
  const isPlaying = currentTrack?.id === track.id;
  const isVisible = entry?.isIntersecting;

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
          backgroundColor: isPlaying
            ? theme.colorScheme === 'dark'
              ? theme.fn.rgba(theme.colors.red[theme.fn.primaryShade()], 0.2)
              : theme.colors.red[0]
            : 'transparent',
        })}
      >
        {isPlaying ? (
          <Button
            onClick={() => {
              setCurrentTrack(undefined);
            }}
            color='red'
            fullWidth
          >
            Stop
          </Button>
        ) : (
          <Button
            fullWidth
            onClick={() => {
              setCurrentTrack(track.id);
            }}
          >
            Play
          </Button>
        )}
      </Card.Section>
    </Card>
  );
};

export default TrackCard;
