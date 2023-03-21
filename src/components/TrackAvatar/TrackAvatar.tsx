import {
  Avatar,
  AvatarProps,
  HoverCard,
  Image,
  Text,
  Title,
} from '@mantine/core';
import { IconMusic } from '@tabler/icons-react';
import Wrapper from 'components/Wrapper';
import { Track } from 'lib/schemas';
import { IconSize } from 'lib/theme';
import { getIconProps } from 'lib/theme';

type TrackAvatarProps = {
  track: Track;
  hoverDetails?: boolean;
  title?: React.ReactNode;
  fallbackSize?: IconSize;
} & Pick<AvatarProps, 'size' | 'radius' | 'color' | 'variant' | 'sx'>;

const TrackAvatar = ({
  track,
  hoverDetails = true,
  fallbackSize = 'md',
  title,
  sx,
  ...avatarProps
}: TrackAvatarProps) => {
  return (
    <Wrapper
      if={hoverDetails}
      wrapper={(children) => (
        <HoverCard
          width={320}
          shadow='md'
          withArrow
          arrowPosition='center'
          position='bottom-start'
        >
          <HoverCard.Target>{children}</HoverCard.Target>
          <HoverCard.Dropdown>
            {title ? (
              <Title order={6} color='dimmed' mb='xs'>
                {title}
              </Title>
            ) : null}
            <Title order={5}>{track.title}</Title>
            <Text size='sm' color='dimmed' mb='sm'>
              {track.description}
            </Text>{' '}
            <Image
              src={track.image ?? null}
              alt={track.description ?? track.title}
              withPlaceholder
              radius='sm'
            />
          </HoverCard.Dropdown>
        </HoverCard>
      )}
    >
      <Avatar
        {...avatarProps}
        src={track.image ?? null}
        alt={track.description ?? track.title}
        sx={
          hoverDetails
            ? {
                ...sx,
                cursor: 'help',
              }
            : { ...sx }
        }
      >
        <IconMusic {...getIconProps(fallbackSize)} />
      </Avatar>
    </Wrapper>
  );
};

export default TrackAvatar;
