import { selector, selectorFamily, useRecoilValue } from 'recoil';
import { Track, TrackId, decodeTrack } from 'lib/schemas';
import defaultTracks from 'lib/defaultTracks';

type TracksMap = Record<string, Track>;

// -- root selector (we can switch to atom if the need arises)
export const tracksState = selector({
  key: 'tracks',
  get: () => {
    return defaultTracks.map((track) => decodeTrack(track));
  },
});

// -- selectors

/**
 * returns all tracks as map keyed by TrackId
 */
export const tracksMapState = selector<TracksMap>({
  key: 'tracksMap',
  get: ({ get }) => {
    const tracks = get(tracksState);

    return tracks.reduce(
      (obj, track) => ({
        ...obj,
        [track.id]: decodeTrack({
          ...track,
          // deduplicate tags + genre
          tags: [...new Set(track.tags)],
          genre: [...new Set(track.genre)],
        }),
      }),
      {} as TracksMap
    );
  },
});

/**
 * given a TrackId, this selector will return the corresponding full Track
 */
export const findTrackState = selectorFamily({
  key: 'findTrack',
  get:
    (trackId: TrackId | undefined) =>
    ({ get }) => {
      if (trackId) {
        const tracksMap = get(tracksMapState);

        if (trackId in tracksMap) {
          return tracksMap[trackId];
        }

        throw new Error(`trackId "${trackId}"" not found`);
      }

      return undefined;
    },
});

// -- public api
export const useTracks = () => useRecoilValue(tracksState);
