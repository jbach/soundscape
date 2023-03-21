import { SimpleGrid } from '@mantine/core';
import TrackCard from './TrackCard';
import { useTracks } from 'lib/state';

const Tracks = () => {
  const tracks = useTracks();

  return (
    <SimpleGrid
      breakpoints={[
        {
          minWidth: 'xs',
          cols: 2,
        },
        {
          minWidth: 'sm',
          cols: 3,
        },
        {
          minWidth: 'md',
          cols: 4,
        },
      ]}
    >
      {tracks.slice(0, 25).map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </SimpleGrid>
  );
};

export default Tracks;
