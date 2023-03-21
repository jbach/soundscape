import { ActionIcon, Group, Slider, Sx, Tooltip } from '@mantine/core';
import { IconVolume, IconVolume2, IconVolumeOff } from '@tabler/icons-react';
import { useMasterVolume } from 'lib/state';
import { getIconProps } from 'lib/theme';
import { useCallback, useRef } from 'react';

type VolumeProps = { sx?: Sx };

const Volume = ({ sx = {} }: VolumeProps) => {
  const [volume, setVolume] = useMasterVolume();
  const restoreVolume = useRef(volume);
  const muted = volume === 0;

  const handleMute = useCallback(() => {
    if (muted) {
      // restore
      setVolume(restoreVolume.current);
    } else {
      // mute
      setVolume(0);
    }
  }, [setVolume, muted]);

  return (
    <Group spacing='xs' sx={sx}>
      <Tooltip label={muted ? 'Unmute' : 'Mute'}>
        <ActionIcon
          onClick={handleMute}
          color={muted ? 'red' : 'default'}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <IconVolumeOff {...getIconProps('md')} />
          ) : volume <= 0.5 ? (
            <IconVolume2 {...getIconProps('md')} />
          ) : (
            <IconVolume {...getIconProps('md')} />
          )}
        </ActionIcon>
      </Tooltip>
      <Slider
        size='sm'
        value={volume}
        min={0}
        max={1}
        step={0.02}
        sx={{ width: 100 }}
        label={null}
        thumbSize={14}
        color={muted ? 'red' : 'default'}
        onChange={setVolume}
        onChangeEnd={(endValue) => {
          if (endValue > 0) {
            restoreVolume.current = endValue;
          }
        }}
      />
    </Group>
  );
};

export default Volume;
