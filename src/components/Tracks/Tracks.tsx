import { Affix, Pagination, SimpleGrid, rem } from '@mantine/core';
import TrackCard from './TrackCard';
import { useTracks } from 'lib/state';
import { useMemo, useState } from 'react';

const PER_PAGE = 24;

const Tracks = () => {
  const tracks = useTracks();
  const [activePage, setPage] = useState(1);
  const pageTracks = useMemo(() => {
    return tracks.slice((activePage - 1) * PER_PAGE, activePage * PER_PAGE);
  }, [activePage, tracks]);

  const pages = Math.ceil(tracks.length / PER_PAGE);

  return (
    <>
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
        {pageTracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </SimpleGrid>
      <Affix
        sx={(theme) => ({
          backgroundColor: theme.fn.rgba(
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
            theme.colorScheme === 'dark' ? 0.8 : 0.85
          ),
          borderRadius: theme.radius.md,

          bottom: rem(10),
          right: rem(10),
        })}
        px='sm'
        py='xs'
      >
        <Pagination
          value={activePage}
          onChange={setPage}
          total={pages}
          withEdges
          size='sm'
          noWrap
        />
      </Affix>
    </>
  );
};

export default Tracks;
