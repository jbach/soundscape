import { Affix, Pagination, SimpleGrid, rem } from '@mantine/core';
import TrackCard from './TrackCard';
import { searchState, useTracks } from 'lib/state';
import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useWindowScroll } from '@mantine/hooks';

const PER_PAGE = 24;

const Tracks = () => {
  const [, scrollTo] = useWindowScroll();

  const allTracks = useTracks();
  const search = useRecoilValue(searchState);
  const tracks = useMemo(() => {
    if (search.length === 0) {
      return allTracks;
    }

    return allTracks.filter((track) => {
      return (
        track.title.toLowerCase().includes(search.toLowerCase()) ||
        track.description?.toLowerCase()?.includes(search.toLowerCase()) ||
        track.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        ) ||
        track.genre.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        )
      );
    });
  }, [allTracks, search]);

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
          <TrackCard key={track.id} track={track} highlight={search} />
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
          onChange={(nextPage) => {
            setPage(nextPage);
            scrollTo({ y: 0 });
          }}
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
