import { SimpleGrid } from '@mantine/core';
import { rawTracks } from 'lib/tracks';
import Track from './Track';

const Tracks = () => {
  return (
    <SimpleGrid cols={3}>
      {rawTracks.slice(0, 20).map((track) => (
        <Track key={track.key} track={track} />
      ))}
    </SimpleGrid>
  );
};

export default Tracks;
