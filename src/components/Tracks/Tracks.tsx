import { Affix, Pagination, SimpleGrid, rem } from '@mantine/core';
import TrackCard from './TrackCard';
import {
  getFilteredPageTracks,
  trackSearchState,
  useTrackPagination,
} from 'lib/state';
import { useRecoilValue } from 'recoil';

const Tracks = () => {
  const [page, setPage, pages] = useTrackPagination();
  const search = useRecoilValue(trackSearchState);
  const filteredPageTracks = useRecoilValue(getFilteredPageTracks);

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
        {filteredPageTracks.map((track) => (
          <TrackCard key={track.id} track={track} highlight={search} />
        ))}
      </SimpleGrid>
      {pages > 1 ? (
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
            value={page}
            onChange={setPage}
            total={pages}
            withEdges
            size='sm'
            noWrap
          />
        </Affix>
      ) : null}
    </>
  );
};

export default Tracks;
