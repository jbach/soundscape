import { ActionIcon, Group, Slider, Sx, Tooltip } from '@mantine/core';
import { IconVolume, IconVolume2, IconVolumeOff } from '@tabler/icons-react';
import { VolumeValue } from 'lib/schemas';
import { volumeFamily } from 'lib/state';
import { getIconProps } from 'lib/theme';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';

type VolumeProps = { sx?: Sx };

// todo: debounce
const Volume = ({ sx = {} }: VolumeProps) => {
  const [volume, setVolume] = useRecoilState(volumeFamily('root'));

  // handles slider dragging
  const handleChange = useCallback(
    (nextValue: VolumeValue) => {
      setVolume((prev) => ({ muted: false, value: nextValue }));
    },
    [setVolume]
  );

  const muted = volume.value === 0 || volume.muted;

  return (
    <Group spacing='xs' sx={sx}>
      <Tooltip label={muted ? 'Unmute' : 'Mute'}>
        <ActionIcon
          onClick={() => {
            setVolume((prev) => {
              if (prev.value === 0) {
                return { value: 0.75, muted: false };
              }
              return { ...prev, muted: !prev.muted };
            });
          }}
          color={muted ? 'red' : 'default'}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <IconVolumeOff {...getIconProps('md')} />
          ) : volume.value <= 0.5 ? (
            <IconVolume2 {...getIconProps('md')} />
          ) : (
            <IconVolume {...getIconProps('md')} />
          )}
        </ActionIcon>
      </Tooltip>
      <Slider
        size='sm'
        value={muted ? 0 : volume.value}
        min={0}
        max={1}
        step={0.02}
        sx={{ width: 100 }}
        label={null}
        thumbSize={14}
        color={muted ? 'red' : 'default'}
        onChange={handleChange}
      />
    </Group>
  );
};

export default Volume;
