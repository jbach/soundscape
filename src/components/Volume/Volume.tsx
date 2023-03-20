import { ActionIcon, Group, Slider, Sx } from '@mantine/core';
import { IconVolume, IconVolume2, IconVolumeOff } from '@tabler/icons-react';
import { useMasterVolume } from 'lib/state';
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
      <ActionIcon onClick={handleMute} color={muted ? 'red' : 'default'}>
        {muted ? (
          <IconVolumeOff size='1.125rem' />
        ) : volume <= 0.5 ? (
          <IconVolume2 size='1.125rem' />
        ) : (
          <IconVolume size='1.125rem' />
        )}
      </ActionIcon>
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
