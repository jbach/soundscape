import { Track } from 'lib/schemas';
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { tracksListState } from './tracks';
import { TRACKS_PER_PAGE } from 'lib/constants';
import { useDebouncedInput } from 'lib/hooks';
import { useEffect } from 'react';
import { useWindowScroll } from '@mantine/hooks';

// -- atom
export const trackSearchState = atom({
  key: 'trackSearch',
  default: '',
});

export const tracksPageState = atom({
  key: 'tracksPage',
  default: 1,
});

// -- selectors
export const getFilteredTracks = selector<Track[]>({
  key: 'filteredTracks',
  get: ({ get }) => {
    const tracks = get(tracksListState);
    const search = get(trackSearchState).toLowerCase();

    if (search.length === 0) {
      return tracks;
    }

    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(search) ||
        track.description?.toLowerCase()?.includes(search) ||
        track.tags.some((tag) => tag.toLowerCase().includes(search)) ||
        track.genre.some((tag) => tag.toLowerCase().includes(search))
    );
  },
});

export const getFilteredPages = selector({
  key: 'filteredPages',
  get: ({ get }) => {
    return Math.ceil(get(getFilteredTracks).length / TRACKS_PER_PAGE);
  },
});

export const getFilteredPageTracks = selector<Track[]>({
  key: 'filteredPageTracks',
  get: ({ get }) => {
    const filteredTracks = get(getFilteredTracks);
    const activePage = get(tracksPageState);

    if (filteredTracks.length <= TRACKS_PER_PAGE) {
      return filteredTracks;
    }

    return filteredTracks.slice(
      (activePage - 1) * TRACKS_PER_PAGE,
      activePage * TRACKS_PER_PAGE
    );
  },
});

// -- public API
export const useTrackSearchInput = () => {
  const [search, setSearch] = useRecoilState(trackSearchState);
  const setPage = useSetRecoilState(tracksPageState);
  const [input, setInput] = useDebouncedInput(setSearch);

  // reset pagination on change
  useEffect(() => {
    setPage(1);
  }, [search, setPage]);

  return [input, setInput] as const;
};

export const useTrackPagination = () => {
  const [, scrollTo] = useWindowScroll();
  const pages = useRecoilValue(getFilteredPages);
  const [page, setPage] = useRecoilState(tracksPageState);

  // scroll to top on page change
  useEffect(() => {
    scrollTo({ y: 0 });
  }, [page, scrollTo]);

  return [page, setPage, pages] as const;
};
